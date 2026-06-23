import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const GOOGLE_ADS_API_VERSION = "v24";
const DEFAULT_CURRENCY = "MAD";

const formatGoogleAdsDateTime = (date = new Date()) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");

  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate()
  )} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
    d.getUTCSeconds()
  )}+00:00`;
};

const getGoogleAdsAccessToken = async () => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.error || "Google OAuth error");
  }

  return data.access_token;
};

const uploadGoogleAdsOfflineConversion = async ({ quote, saleAmount }) => {
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const conversionAction = process.env.GOOGLE_ADS_CONVERSION_ACTION;

  if (
    !customerId ||
    !developerToken ||
    !conversionAction ||
    !process.env.GOOGLE_ADS_CLIENT_ID ||
    !process.env.GOOGLE_ADS_CLIENT_SECRET ||
    !process.env.GOOGLE_ADS_REFRESH_TOKEN
  ) {
    throw new Error("Missing Google Ads environment variables");
  }

  const clickId = quote.gclid || quote.gbraid || quote.wbraid;

  if (!clickId) {
    return {
      skipped: true,
      reason: "No gclid/gbraid/wbraid found for this quote",
    };
  }

  const conversion = {
    conversionAction,
    conversionDateTime: formatGoogleAdsDateTime(quote.sale_date || new Date()),
    conversionValue: Number(saleAmount),
    currencyCode: DEFAULT_CURRENCY,
    orderId: `quote-${quote.id}`,
  };

  if (quote.gclid) conversion.gclid = quote.gclid;
  if (quote.gbraid && !quote.gclid) conversion.gbraid = quote.gbraid;
  if (quote.wbraid && !quote.gclid && !quote.gbraid) conversion.wbraid = quote.wbraid;

  const accessToken = await getGoogleAdsAccessToken();

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "developer-token": developerToken,
    "Content-Type": "application/json",
  };

  if (loginCustomerId) {
    headers["login-customer-id"] = loginCustomerId;
  }

  const response = await fetch(
    `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}/customers/${customerId}:uploadClickConversions`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        conversions: [conversion],
        partialFailure: true,
        validateOnly: false,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(data));
  }

  if (data.partialFailureError) {
    throw new Error(JSON.stringify(data.partialFailureError));
  }

  return data;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
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

    const {
      quote_id,
      sale_amount,
      status = "sold",
      admin_notes = "",
    } = req.body || {};

    if (!quote_id) {
      return res.status(400).json({
        success: false,
        message: "quote_id is required",
      });
    }

    const finalAmount = Number(sale_amount);

    if (status === "sold" && (!finalAmount || finalAmount <= 0)) {
      return res.status(400).json({
        success: false,
        message: "sale_amount is required when status is sold",
      });
    }

    const { data: existingQuote, error: fetchError } = await supabase
      .from("quote_requests")
      .select("*")
      .eq("id", quote_id)
      .single();

    if (fetchError) {
      return res.status(500).json({
        success: false,
        error: fetchError.message,
      });
    }

    const now = new Date().toISOString();

    const updatePayload = {
      status,
      admin_notes,
      final_status_updated_at: now,
    };

    if (status === "sold") {
      updatePayload.sale_amount = finalAmount;
      updatePayload.sale_date = now;
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
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    let googleAdsResult = null;
    let googleAdsWarning = null;

    if (
      status === "sold" &&
      !existingQuote.google_offline_conversion_sent_at
    ) {
      try {
        googleAdsResult = await uploadGoogleAdsOfflineConversion({
          quote: data,
          saleAmount: finalAmount,
        });

        if (!googleAdsResult?.skipped) {
          const { data: updatedQuote, error: sentError } = await supabase
            .from("quote_requests")
            .update({
              google_offline_conversion_sent_at: new Date().toISOString(),
            })
            .eq("id", quote_id)
            .select()
            .single();

          if (!sentError && updatedQuote) {
            return res.status(200).json({
              success: true,
              quote: updatedQuote,
              googleAds: googleAdsResult,
            });
          }
        } else {
          googleAdsWarning = googleAdsResult.reason;
        }
      } catch (googleError) {
        console.error("GOOGLE ADS OFFLINE CONVERSION ERROR:", googleError);
        googleAdsWarning = googleError.message;
      }
    }

    return res.status(200).json({
      success: true,
      quote: data,
      googleAds: googleAdsResult,
      googleAdsWarning,
    });
  } catch (err) {
    console.error("UPDATE QUOTE SALE API ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
}