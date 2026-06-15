export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log("VERIFY SUCCESS");
      return res.status(200).send(challenge);
    }

    console.log("VERIFY FAILED");
    return res.status(403).send("Verification failed");
  }

  if (req.method === "POST") {
    try {
      console.log("WEBHOOK RECEIVED");
      console.log("FULL WEBHOOK:", JSON.stringify(req.body, null, 2));

      const value = req.body?.entry?.[0]?.changes?.[0]?.value;
      const message = value?.messages?.[0];
      const status = value?.statuses?.[0];

      if (status && !message) {
        console.log("STATUS UPDATE ONLY:", JSON.stringify(status, null, 2));
        return res.status(200).json({ ok: true, type: "status" });
      }

      if (!message) {
        console.log("NO MESSAGE FOUND");
        return res.status(200).json({ ok: true, type: "no_message" });
      }

      const from = message.from;
      const text =
        message?.text?.body ||
        message?.button?.text ||
        message?.interactive?.button_reply?.title ||
        message?.interactive?.list_reply?.title ||
        "";

      console.log("FROM:", from);
      console.log("MESSAGE TYPE:", message.type);
      console.log("TEXT:", text);

      if (!from) {
        console.log("NO SENDER FOUND");
        return res.status(200).json({ ok: true, type: "no_sender" });
      }

      if (!text) {
        await sendWhatsAppMessage(
          from,
          "مرحباً بك في Marbre de Classe. من فضلك أرسل طلبك كتابة: نوع الرخام، القياسات، والمدينة."
        );

        return res.status(200).json({ ok: true, type: "non_text" });
      }

      const reply = await getAiReply(text);

      console.log("AI REPLY:", reply);

      const sent = await sendWhatsAppMessage(from, reply);

      console.log("WHATSAPP SEND RESULT:", JSON.stringify(sent, null, 2));
      console.log("MESSAGE SENT SUCCESSFULLY");

      return res.status(200).json({ ok: true, type: "message" });
    } catch (error) {
      console.error("WEBHOOK ERROR:", error);
      return res.status(200).json({
        ok: false,
        error: error?.message || "Unknown error",
      });
    }
  }

  return res.status(405).send("Method not allowed");
}

async function getAiReply(userMessage) {
  try {
    console.log("CALLING OPENAI");

    const systemPrompt = `
أنت مساعد واتساب رسمي لشركة MARBRE DE CLASSE في المغرب.

الشركة تبيع وتفصل:
- الرخام المغربي
- الرخام المستورد
- الرخام الصناعي / engineered marble
- الغرانيت
- الأونيكس
- الأرضيات formats standards
- الطاولات
- المغاسل
- receveurs
- plans de cuisine
- المنتجات حسب الطلب

قواعد الرد:
- رد بالعربية أو الدارجة المغربية حسب أسلوب العميل.
- كن مختصراً واحترافياً.
- لا تعط سعراً نهائياً إلا إذا توفرت القياسات والنوع والمدينة.
- اطلب من العميل: الاسم، المدينة، نوع الرخام، القياسات، الكمية، وهل يريد التوصيل أو التركيب.
- إذا كان العميل يريد devis، اجمع المعلومات ثم قل له إن الفريق سيراجع الطلب ويتواصل معه.
- إذا سأل عن القياس، اشرح أن الحساب غالباً بالمتر المربع: الطول × العرض.
- إذا كان الطلب معقداً، قل له إن مستشاراً سيتواصل معه.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("OPENAI API ERROR:", JSON.stringify(data, null, 2));
      return "مرحباً بك في Marbre de Classe. أرسل لنا نوع الرخام، القياسات، والمدينة لنساعدك في إعداد عرض السعر.";
    }

    return (
      data.output_text ||
      "مرحباً بك في Marbre de Classe. أرسل لنا نوع الرخام، القياسات، والمدينة لنساعدك في إعداد عرض السعر."
    );
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    return "مرحباً بك في Marbre de Classe. كيف يمكنني مساعدتك؟";
  }
}

async function sendWhatsAppMessage(to, message) {
  try {
    console.log("SENDING WHATSAPP MESSAGE");
    console.log("TO:", to);

    const response = await fetch(
      `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WHATSAPP API ERROR:", JSON.stringify(data, null, 2));
    }

    return data;
  } catch (error) {
    console.error("SEND WHATSAPP ERROR:", error);
    throw error;
  }
}