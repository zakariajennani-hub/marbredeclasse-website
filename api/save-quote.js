export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({
        success: false,
        error: "Missing Supabase environment variables",
      });
    }

    const {
      client_name,
      phone,
      city,
      address,
      note,
      product_id,
      product_name,
      product_category,
      order_data,
      total_price,
    } = req.body;

    const response = await fetch(`${SUPABASE_URL}/rest/v1/quote_requests`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify([
        {
          client_name,
          phone,
          city,
          address,
          note,
          product_id,
          product_name,
          product_category,
          order_data,
          total_price,
          status: "nouveau",
        },
      ]),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("SUPABASE SAVE QUOTE ERROR:", response.status, text);

      return res.status(500).json({
        success: false,
        error: text,
      });
    }

    const data = text ? JSON.parse(text) : [];

    return res.status(200).json({
      success: true,
      quote: data?.[0] || null,
    });
  } catch (err) {
    console.error("SAVE QUOTE ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}