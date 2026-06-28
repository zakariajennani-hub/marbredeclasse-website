import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { trackLead, trackWhatsAppClick } from "../utils/analytics";
import buildWhatsAppMessage from "../utils/buildWhatsAppMessage";

import "./QuoteRequestPage.css";

export default function QuoteRequestPage() {
  const navigate = useNavigate();

  const [client, setClient] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    note: "",
  });

  const [order, setOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const savedOrder = localStorage.getItem("marbre_devis_order");

    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch {
        localStorage.removeItem("marbre_devis_order");
      }
    }
  }, []);

  const updateClient = (field, value) => {
    setClient((prev) => ({ ...prev, [field]: value }));
  };

  const isSurMesureOrder = order?.mode === "sur_mesure";

  const getOrderValue = () => {
    if (!order) return 0;

    if (isSurMesureOrder) {
      return Number(order.totalPrice || 0);
    }

    return Number(order.totals?.finalTotal || 0);
  };

  const getProductName = () => {
    if (!order) return "Demande de devis";

    if (isSurMesureOrder) {
      return order.productName || "Marbre sur mesure";
    }

    return order.product?.name || "Demande de devis";
  };

  const getProductId = () => {
    if (!order) return "";

    if (isSurMesureOrder) {
      return order.productId || "";
    }

    return order.product?.id || "";
  };

  const getProductCategory = () => {
    if (!order) return "";

    if (isSurMesureOrder) {
      return order.category || "";
    }

    return order.product?.categoryLabel || order.product?.category || "";
  };

  const getTrackingData = () => {
    const params = new URLSearchParams(window.location.search);

    return {
      gclid: params.get("gclid") || localStorage.getItem("gclid") || "",
      gbraid: params.get("gbraid") || localStorage.getItem("gbraid") || "",
      wbraid: params.get("wbraid") || localStorage.getItem("wbraid") || "",
      fbclid: params.get("fbclid") || localStorage.getItem("fbclid") || "",

      utm_source:
        params.get("utm_source") || localStorage.getItem("utm_source") || "",
      utm_medium:
        params.get("utm_medium") || localStorage.getItem("utm_medium") || "",
      utm_campaign:
        params.get("utm_campaign") ||
        localStorage.getItem("utm_campaign") ||
        "",
      utm_term:
        params.get("utm_term") || localStorage.getItem("utm_term") || "",
      utm_content:
        params.get("utm_content") || localStorage.getItem("utm_content") || "",

      landing_page: window.location.href,
      referrer: document.referrer,

      device_type:
        window.innerWidth < 768
          ? "mobile"
          : window.innerWidth < 1024
          ? "tablet"
          : "desktop",

      browser: navigator.userAgent,
    };
  };

  const handleWhatsAppQuoteClick = async () => {
    if (!order) {
      setFormError("Aucune configuration trouvée.");
      return;
    }

    if (!client.fullName || !client.phone || !client.city) {
      setFormError(
        "Veuillez remplir au minimum le nom, le téléphone et la ville."
      );
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    const realValue = getOrderValue();
    const tracking = getTrackingData();

    try {
      const response = await fetch("/api/save-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_name: client.fullName,
          phone: client.phone,
          city: client.city,
          address: client.address,
          note: client.note,

          product_id: getProductId(),
          product_name: getProductName(),
          product_category: getProductCategory(),

          order_data: order,
          total_price: realValue,

          gclid: tracking.gclid,
          gbraid: tracking.gbraid,
          wbraid: tracking.wbraid,
          fbclid: tracking.fbclid,

          utm_source: tracking.utm_source,
          utm_medium: tracking.utm_medium,
          utm_campaign: tracking.utm_campaign,
          utm_term: tracking.utm_term,
          utm_content: tracking.utm_content,

          landing_page: tracking.landing_page,
          referrer: tracking.referrer,

          device_type: tracking.device_type,
          browser: tracking.browser,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erreur lors de l'enregistrement.");
      }

      const quoteId = result.quote?.id;

      const message = buildWhatsAppMessage({
        order,
        client,
        quoteId,
      });

      const whatsappLink = `https://wa.me/212715703927?text=${encodeURIComponent(
        message
      )}`;

      trackLead({
        source: "quote-success",
        value: realValue,
        city: client.city,
        productName: getProductName(),
        fullName: client.fullName,
        phone: client.phone,
      });

      trackWhatsAppClick({
        source: "devis",
        productName: getProductName(),
        value: realValue,
        city: client.city,
      });

      localStorage.setItem(
        "marbre_last_quote_request",
        JSON.stringify({
          quoteId,
          client,
          order,
          totalPrice: realValue,
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 800));

      window.open(whatsappLink, "_blank", "noopener,noreferrer");

      navigate("/devis-success");
    } catch (error) {
      console.error("QUOTE SUBMIT ERROR:", error);

      const fallbackMessage = buildWhatsAppMessage({
        order,
        client,
        quoteId: "LOCAL",
      });

      const whatsappLink = `https://wa.me/212715703927?text=${encodeURIComponent(
        fallbackMessage
      )}`;

      window.open(whatsappLink, "_blank", "noopener,noreferrer");

      setFormError(
        "La demande n’a pas été enregistrée automatiquement, mais WhatsApp a été ouvert avec les détails."
      );

      navigate("/devis-success");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="quote-request-page">
      <section className="quote-request-card">
        <div className="quote-request-header">
          <span>DEMANDE DE DEVIS</span>
          <h1>Finaliser votre demande</h1>
          <p>
            Ajoutez vos informations, puis envoyez la demande directement via
            WhatsApp.
          </p>
        </div>

        {!order && (
          <div className="quote-empty">
            <h3>Aucune configuration trouvée</h3>
            <p>Retournez vers un produit pour préparer une demande de devis.</p>
            <Link to="/products">Voir les produits</Link>
          </div>
        )}

        <div className="quote-form-grid">
          <label>
            Nom complet
            <input
              type="text"
              value={client.fullName}
              onChange={(e) => updateClient("fullName", e.target.value)}
              placeholder="Nom et prénom"
            />
          </label>

          <label>
            Téléphone
            <input
              type="text"
              value={client.phone}
              onChange={(e) => updateClient("phone", e.target.value)}
              placeholder="06 00 00 00 00"
            />
          </label>

          <label>
            Ville
            <input
              type="text"
              value={client.city}
              onChange={(e) => updateClient("city", e.target.value)}
              placeholder="Rabat, Casablanca..."
            />
          </label>

          <label>
            Adresse
            <input
              type="text"
              value={client.address}
              onChange={(e) => updateClient("address", e.target.value)}
              placeholder="Adresse de livraison"
            />
          </label>

          <label className="quote-note">
            Note
            <textarea
              value={client.note}
              onChange={(e) => updateClient("note", e.target.value)}
              placeholder="Ajoutez une remarque sur votre projet..."
            />
          </label>
        </div>

        {formError && <p className="quote-form-error">{formError}</p>}

        <button
          type="button"
          className="quote-whatsapp-btn"
          onClick={handleWhatsAppQuoteClick}
          disabled={isSubmitting || !order}
        >
          {isSubmitting ? "Envoi en cours..." : "Envoyer via WhatsApp"}
        </button>
      </section>
    </main>
  );
}