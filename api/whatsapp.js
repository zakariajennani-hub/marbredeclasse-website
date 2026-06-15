export default async function handler(req, res) {
  // ==================================================
  // VERIFY WEBHOOK
  // ==================================================
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    console.log("VERIFY REQUEST RECEIVED");

    if (
      mode === "subscribe" &&
      token === process.env.WHATSAPP_VERIFY_TOKEN
    ) {
      console.log("VERIFY SUCCESS");
      return res.status(200).send(challenge);
    }

    console.log("VERIFY FAILED");
    return res.status(403).send("Verification failed");
  }

  // ==================================================
  // RECEIVE MESSAGES
  // ==================================================
  if (req.method === "POST") {
    try {
      console.log("================================");
      console.log("WEBHOOK RECEIVED");
      console.log("================================");

      console.log(
        JSON.stringify(req.body, null, 2)
      );

      const message =
        req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      console.log("MESSAGE OBJECT:", message);

      if (!message) {
        console.log("NO MESSAGE FOUND");
        return res.status(200).json({ ok: true });
      }

      const from = message.from;
      const text = message?.text?.body || "";

      console.log("FROM:", from);
      console.log("TEXT:", text);

      const reply = await getAiReply(text);

      console.log("AI REPLY:", reply);

      const sent = await sendWhatsAppMessage(from, reply);

      console.log("WHATSAPP RESPONSE:");
      console.log(JSON.stringify(sent, null, 2));

      console.log("MESSAGE SENT SUCCESSFULLY");

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error("WEBHOOK ERROR");
      console.error(error);

      return res.status(200).json({
        ok: false,
        error: error.message,
      });
    }
  }

  return res.status(405).send("Method not allowed");
}

// ==================================================
// OPENAI
// ==================================================
async function getAiReply(userMessage) {
  try {
    console.log("CALLING OPENAI");

    const systemPrompt = `
أنت مساعد واتساب رسمي لشركة MARBRE DE CLASSE في المغرب.

الشركة تبيع:
- الرخام المغربي
- الرخام المستورد
- الرخام الصناعي
- الغرانيت
- الأونيكس
- الأرضيات
- الطاولات
- المغاسل
- المطابخ
- المنتجات حسب الطلب

قواعد الرد:
- الرد بالعربية أو الدارجة المغربية.
- الرد مختصر واحترافي.
- اطلب الاسم والمدينة والقياسات عند الحاجة.
- لا تعط سعراً نهائياً بدون القياسات.
`;

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          input: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("OPENAI RESPONSE:");
    console.log(JSON.stringify(data, null, 2));

    return (
      data.output_text ||
      "مرحباً بك في Marbre de Classe، أرسل لنا نوع الرخام والقياسات والمدينة."
    );
  } catch (error) {
    console.error("OPENAI ERROR");
    console.error(error);

    return "مرحباً بك في Marbre de Classe، كيف يمكنني مساعدتك؟";
  }
}

// ==================================================
// SEND WHATSAPP MESSAGE
// ==================================================
async function sendWhatsAppMessage(to, message) {
  try {
    console.log("SENDING WHATSAPP MESSAGE");
    console.log("TO:", to);
    console.log("MESSAGE:", message);

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

    console.log("WHATSAPP API RESULT:");
    console.log(JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("WHATSAPP API ERROR");
      console.error(data);
    }

    return data;
  } catch (error) {
    console.error("SEND MESSAGE ERROR");
    console.error(error);

    throw error;
  }
}