import { useEffect } from "react";
import { Link } from "react-router-dom";

import { trackLead } from "../utils/metaPixel";

export default function DevisSuccessPage() {
  useEffect(() => {
    const alreadyTracked = sessionStorage.getItem(
      "marbre_devis_success_tracked"
    );

    if (alreadyTracked) return;

    const savedOrder = JSON.parse(
      localStorage.getItem("marbre_devis_order") || "{}"
    );

    trackLead({
      source: "devis_success",
      value: savedOrder?.totalPrice || savedOrder?.total_price || 0,
      city: savedOrder?.clientCity || savedOrder?.city || "",
      productName:
        savedOrder?.productName ||
        savedOrder?.product_name ||
        "Demande de devis",
    });

    sessionStorage.setItem("marbre_devis_success_tracked", "true");
  }, []);

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          width: "100%",
          textAlign: "center",
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1>✅ Demande envoyée avec succès</h1>

        <p style={{ marginTop: "20px", lineHeight: "1.8" }}>
          Merci pour votre demande.
          <br />
          Notre équipe MARBRE DE CLASSE va analyser votre projet et vous
          contacter dans les plus brefs délais.
        </p>

        <Link
          to="/"
          style={{
            display: "inline-block",
            marginTop: "25px",
            padding: "12px 24px",
            background: "#b8955f",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "10px",
          }}
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}