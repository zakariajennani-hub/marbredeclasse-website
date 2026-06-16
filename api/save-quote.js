import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
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

    const { data, error } = await supabase
      .from("quote_requests")
      .insert([
        {
          name: client_name,
          area: city,

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
      ])
      .select()
      .single();

    if (error) {
      console.error(
        "SUPABASE SAVE QUOTE ERROR:",
        error.code,
        error.message,
        error.details
      );

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      quote: data,
    });
  } catch (err) {
    console.error("SAVE QUOTE API ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}