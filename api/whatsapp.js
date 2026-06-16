const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

      const value = req.body?.entry?.[0]?.changes?.[0]?.value;
      const message = value?.messages?.[0];
      const status = value?.statuses?.[0];
      const contact = value?.contacts?.[0];

      if (status && !message) {
        console.log("STATUS UPDATE ONLY:", JSON.stringify(status, null, 2));
        return res.status(200).json({ ok: true, type: "status" });
      }

      if (!message) {
        console.log("NO MESSAGE FOUND");
        return res.status(200).json({ ok: true, type: "no_message" });
      }

      const from = message.from;
      const clientName = contact?.profile?.name || null;

      const text =
        message?.text?.body ||
        message?.button?.text ||
        message?.interactive?.button_reply?.title ||
        message?.interactive?.list_reply?.title ||
        "";

      console.log("FROM:", from);
      console.log("CLIENT NAME:", clientName);
      console.log("MESSAGE TYPE:", message.type);
      console.log("TEXT:", text);

      if (!from) {
        console.log("NO SENDER FOUND");
        return res.status(200).json({ ok: true, type: "no_sender" });
      }

      await upsertConversation(from, clientName);
      await saveMessage(from, "user", text || "[رسالة غير نصية]");

      const history = await getConversationHistory(from, 20);
      const conversation = await getConversation(from);

      let reply;

      if (!text) {
        reply =
          "مرحباً بك في Marbre de Classe. من فضلك أرسل طلبك كتابة: نوع الرخام، القياسات، والمدينة.";
      } else {
        reply = await getAiReply({
          userMessage: text,
          history,
          conversation,
          clientName,
        });
      }

      console.log("AI REPLY:", reply);

      await saveMessage(from, "assistant", reply);
      await updateConversationFromText(from, text, reply);

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

async function getAiReply({ userMessage, history, conversation, clientName }) {
  try {
    console.log("CALLING OPENAI");

    const historyText = history
      .map((m) => `${m.role === "user" ? "العميل" : "المساعد"}: ${m.message}`)
      .join("\n");

    const systemPrompt = `
أنت مساعد واتساب رسمي لشركة MARBRE DE CLASSE في المغرب.

مهمتك أن تتصرف كمستشار مبيعات محترف للرخام، وليس مجرد بوت.

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

بيانات العميل الحالية:
- الاسم: ${clientName || conversation?.client_name || "غير معروف"}
- المدينة: ${conversation?.city || "غير معروفة"}
- نوع الرخام: ${conversation?.marble_type || "غير محدد"}
- القياسات: ${conversation?.dimensions || "غير محددة"}
- التوصيل: ${conversation?.delivery ? "نعم" : "غير محدد"}
- التركيب: ${conversation?.installation ? "نعم" : "غير محدد"}
- المرحلة الحالية: ${conversation?.current_stage || "new"}

قواعد مهمة:
- تذكر سياق المحادثة السابق ولا تبدأ من الصفر.
- لا تكرر سؤالاً أجاب عنه العميل سابقاً.
- رد بالعربية أو الدارجة المغربية حسب أسلوب العميل.
- كن مختصراً، ودوداً، واحترافياً.
- إذا أعطى العميل قياسات، احسب المساحة إن أمكن: الطول × العرض.
- لا تعط سعراً نهائياً إلا إذا توفرت: نوع الرخام، القياسات، المدينة، وهل يريد التوصيل أو التركيب.
- إذا كانت المعلومات ناقصة، اسأل فقط عن الناقص.
- إذا اكتملت المعلومات، قل إنك تستطيع إعداد طلب devis مبدئي وأن الفريق سيراجعه.
- لا تقل للعميل أنك ذكاء اصطناعي.
- لا تذكر Supabase أو Vercel أو OpenAI.
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
          {
            role: "user",
            content: `
سجل المحادثة السابق:
${historyText || "لا يوجد سجل سابق"}

رسالة العميل الحالية:
${userMessage}
`,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error("OPENAI API ERROR:", JSON.stringify(data, null, 2));
      return fallbackReply();
    }

    const aiText =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      data.output?.[0]?.content?.[0]?.text?.value ||
      data.output?.[1]?.content?.[0]?.text ||
      "";

    return aiText || fallbackReply();
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    return fallbackReply();
  }
}

function fallbackReply() {
  return "مرحباً بك في Marbre de Classe. أرسل لنا نوع الرخام، القياسات، والمدينة لنساعدك في إعداد عرض السعر.";
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

async function supabaseRequest(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase environment variables");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  if (!response.ok) {
    console.error("SUPABASE ERROR:", response.status, text);
    throw new Error(`Supabase error ${response.status}: ${text}`);
  }

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function upsertConversation(waId, clientName) {
  console.log("UPSERT CONVERSATION");

  const body = [
    {
      wa_id: waId,
      client_name: clientName,
      updated_at: new Date().toISOString(),
    },
  ];

  return supabaseRequest("whatsapp_conversations?on_conflict=wa_id", {
    method: "POST",
    prefer: "resolution=merge-duplicates,return=representation",
    body: JSON.stringify(body),
  });
}

async function getConversation(waId) {
  console.log("GET CONVERSATION");

  const data = await supabaseRequest(
    `whatsapp_conversations?wa_id=eq.${encodeURIComponent(
      waId
    )}&select=*`,
    {
      method: "GET",
    }
  );

  return data?.[0] || null;
}

async function saveMessage(waId, role, message) {
  console.log("SAVE MESSAGE:", role);

  return supabaseRequest("whatsapp_messages", {
    method: "POST",
    prefer: "return=minimal",
    body: JSON.stringify([
      {
        wa_id: waId,
        role,
        message,
      },
    ]),
  });
}

async function getConversationHistory(waId, limit = 20) {
  console.log("GET HISTORY");

  const data = await supabaseRequest(
    `whatsapp_messages?wa_id=eq.${encodeURIComponent(
      waId
    )}&select=role,message,created_at&order=created_at.desc&limit=${limit}`,
    {
      method: "GET",
    }
  );

  return Array.isArray(data) ? data.reverse() : [];
}

async function updateConversationFromText(waId, userText, botReply) {
  console.log("UPDATE CONVERSATION FIELDS");

  const text = `${userText || ""} ${botReply || ""}`.toLowerCase();

  const updates = {
    updated_at: new Date().toISOString(),
  };

  const city = detectCity(text);
  const marbleType = detectMarbleType(text);
  const dimensions = detectDimensions(userText);

  if (city) updates.city = city;
  if (marbleType) updates.marble_type = marbleType;
  if (dimensions) updates.dimensions = dimensions;

  if (
    text.includes("توصيل") ||
    text.includes("livraison") ||
    text.includes("delivery")
  ) {
    updates.delivery = true;
  }

  if (
    text.includes("تركيب") ||
    text.includes("pose") ||
    text.includes("installation")
  ) {
    updates.installation = true;
  }

  updates.current_stage = detectStage(updates);

  return supabaseRequest(
    `whatsapp_conversations?wa_id=eq.${encodeURIComponent(waId)}`,
    {
      method: "PATCH",
      prefer: "return=minimal",
      body: JSON.stringify(updates),
    }
  );
}

function detectCity(text) {
  const cities = [
    "الرباط",
    "rabat",
    "سلا",
    "salé",
    "sale",
    "تمارة",
    "temara",
    "الصخيرات",
    "skhirat",
    "بوزنيقة",
    "bouznika",
    "المحمدية",
    "mohammedia",
    "الدار البيضاء",
    "casablanca",
    "كازا",
    "casa",
    "القنيطرة",
    "kenitra",
    "طنجة",
    "tanger",
    "تطوان",
    "tetouan",
  ];

  const found = cities.find((c) => text.includes(c.toLowerCase()));
  return found || null;
}

function detectMarbleType(text) {
  if (text.includes("ibiza") || text.includes("إيبزا")) return "Ibiza";
  if (text.includes("calacatta") || text.includes("كالاكاتا"))
    return "Calacatta";
  if (text.includes("quartz") || text.includes("كوارتز")) return "Quartz";
  if (text.includes("granite") || text.includes("غرانيت")) return "Granite";
  if (text.includes("onyx") || text.includes("أونيكس")) return "Onyx";
  if (text.includes("مغربي")) return "رخام مغربي";
  if (text.includes("مستورد")) return "رخام مستورد";
  if (text.includes("صناعي") || text.includes("artificiel"))
    return "رخام صناعي";

  return null;
}

function detectDimensions(text = "") {
  const normalized = text
    .replace(/,/g, ".")
    .replace(/×/g, "x")
    .replace(/\*/g, "x")
    .replace(/على/g, "x")
    .replace(/متر/g, "m")
    .replace(/سم/g, "cm");

  const match = normalized.match(
    /(\d+(?:\.\d+)?)\s*(m|cm)?\s*x\s*(\d+(?:\.\d+)?)\s*(m|cm)?/i
  );

  if (!match) return null;

  return match[0];
}

function detectStage(updates) {
  if (updates.city && updates.marble_type && updates.dimensions) {
    return "ready_for_devis";
  }

  if (updates.dimensions || updates.city || updates.marble_type) {
    return "collecting_details";
  }

  return "new";
}