import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const token = req.headers["x-admin-token"];

    if (!token || token !== process.env.ADMIN_API_TOKEN) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    const stats = {
      total: data.length,
      new: data.filter((q) => q.status === "new").length,
      reviewing: data.filter((q) => q.status === "reviewing").length,
      sent: data.filter((q) => q.status === "sent").length,
      closed: data.filter((q) => q.status === "closed").length,
      sold: data.filter((q) => q.status === "sold").length,
      revenue: data
        .filter((q) => q.converted_to_sale)
        .reduce(
          (sum, q) =>
            sum +
            Number(
              q.sale_amount ??
                q.total_price ??
                0
            ),
          0
        ),
    };

    return res.status(200).json({
      success: true,
      quotes: data,
      stats,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}