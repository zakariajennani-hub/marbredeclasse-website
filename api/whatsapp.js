export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }

    return res.status(403).send("Verification failed");
  }

  if (req.method === "POST") {
    try {
      const message =
        req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      if (!message) return res.status(200).json({ ok: true });

      const from = message.from;
      const text = message?.text?.body || "";

      const reply = await getAiReply(text || "رسالة بدون نص");
      await sendWhatsAppMessage(from, reply);

      return res.status(200).json({ ok: true });
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(200).json({ ok: false });
    }
  }

  return res.status(405).send("Method not allowed");
}

async function getAiReply(userMessage) {
  const systemPrompt = `
أنت مساعد واتساب رسمي لشركة MARBRE DE CLASSE في المغرب.

الشركة تبيع وتفصل:
- الرخام المغربي
- الرخام المستورد
- الرخام الصناعي / engineered marble
- الغرانيت
- الأونيكس
- الأرضيات formats standards
- الطاولات والمغاسل وreceveurs وplans de cuisine والمنتجات حسب الطلب

مهمتك:
- رد بالعربية أو الدارجة المغربية حسب أسلوب العميل.
- كن مختصراً واحترافياً.
- لا تعط سعراً نهائياً إلا إذا توفرت القياسات والنوع والمدينة.
- اطلب من العميل: الاسم، المدينة، نوع الرخام، القياسات، الكمية، وهل يريد التوصيل أو التركيب.
- إذا كان العميل يريد devis، اجمع المعلومات ثم قل له إن الفريق سيراجعه ويتواصل معه.
- إذا سأل عن القياس، اشرح أن الحساب يكون غالباً بالمتر المربع: الطول × العرض.
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

  return (
    data.output_text ||
    "مرحباً بك في Marbre de Classe. أرسل لنا نوع الرخام، القياسات، والمدينة لنساعدك في إعداد عرض السعر."
  );
}

async function sendWhatsAppMessage(to, message) {
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
        text: { body: message },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("WhatsApp API error:", data);
  }

  return data;
}