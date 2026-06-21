import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const token = req.headers["x-admin-token"];

    if (!token || token !== process.env.ADMIN_API_TOKEN) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { quote_id, sale_amount, status = "sold", admin_notes = "" } = req.body || {};

    if (!quote_id) {
      return res.status(400).json({ success: false, message: "quote_id is required" });
    }

    const finalAmount = Number(sale_amount);

    if (status === "sold" && (!finalAmount || finalAmount <= 0)) {
      return res.status(400).json({
        success: false,
        message: "sale_amount is required when status is sold",
      });
    }

    const updatePayload = {
      status,
      admin_notes,
      final_status_updated_at: new Date().toISOString(),
    };

    if (status === "sold") {
      updatePayload.sale_amount = finalAmount;
      updatePayload.sale_date = new Date().toISOString();
      updatePayload.converted_to_sale = true;
    }

    if (status !== "sold") {
      updatePayload.converted_to_sale = false;
      updatePayload.sale_amount = null;
      updatePayload.sale_date = null;
    }

    const { data, error } = await supabase
      .from("quote_requests")
      .update(updatePayload)
      .eq("id", quote_id)
      .select()
      .single();

    if (error) {
      console.error("UPDATE QUOTE SALE ERROR:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      quote: data,
    });
  } catch (err) {
    console.error("UPDATE QUOTE SALE API ERROR:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}