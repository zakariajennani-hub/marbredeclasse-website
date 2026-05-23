import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import "./QuoteRequestPage.css";

export default function QuoteRequestPage() {
  const [client, setClient] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    note: "",
  });

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("marbre_devis_order");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  const updateClient = (field, value) => {
    setClient((prev) => ({ ...prev, [field]: value }));
  };

  const clearOrder = () => {
    localStorage.removeItem("marbre_devis_order");
    setOrder(null);
  };

  const money = (value) => {
    return Math.round(Number(value || 0)).toLocaleString() + " MAD";
  };

  const orderText = useMemo(() => {
    if (!order) return "Aucune configuration enregistrée.";

    const linesText = order.lines
      ?.map((line, index) => {
        return `
${index + 1}) ${order.product?.name || "-"} — ${line.finish || "-"} — ${
          line.format || "-"
        }
   Surface à couvrir : ${Number(line.clientSurface || 0).toFixed(2)} m²
   Surface recommandée : ${Number(line.recommendedSurface || 0).toFixed(2)} m²
   Nombre de pièces : ${line.piecesNeeded || 0}
   Mètre linéaire : ${Number(line.rowLinearMeters || 0).toFixed(2)} ml
   Marge de perte : ${
     line.lossEnabled ? `${line.lossMargin}%` : "Non activée"
   }
   Marge de sécurité : ${
     line.securityEnabled ? `${line.securityMargin}%` : "Non activée"
   }
   Pose sur cette ligne : ${line.linePoseEnabled ? "Oui" : "Non"}
   Surface pose ligne : ${Number(line.linePoseSurface || 0).toFixed(2)} m²
   Prix / m² : ${line.pricePerM2 || 0} MAD
   Total ligne : ${money(line.rowPrice)}
`;
      })
      .join("\n");

    return `
DEMANDE DE DEVIS - MARBRE DE CLASSE

CLIENT
Nom : ${client.fullName || "-"}
Téléphone : ${client.phone || "-"}
Ville : ${client.city || "-"}
Adresse : ${client.address || "-"}
Note : ${client.note || "-"}

PRODUIT
Nom : ${order.product?.name || "-"}
Catégorie : ${order.product?.categoryLabel || order.product?.category || "-"}
Origine : ${order.product?.origin || "-"}
Mode : ${order.mode || "-"}

MESURES
${linesText}

SERVICES
Livraison : ${order.services?.delivery ? "Oui" : "Non"}
Ville livraison : ${order.services?.city || "-"}
Prix livraison : ${money(order.services?.deliveryPrice)}

Main-d’œuvre descente : ${order.services?.handling ? "Oui" : "Non"}
Prix main-d’œuvre : ${money(order.services?.handlingPrice)}

Pose globale : ${order.services?.pose ? "Oui" : "Non"}
Type de pose : ${
      order.services?.pose
        ? order.services.poseType === "pose_complete"
          ? "Pose complète"
          : "Pose marbre"
        : "-"
    }
Surface totale de pose : ${
      order.services?.pose
        ? Number(order.services.poseSurface || 0).toFixed(2) + " m²"
        : "-"
    }
Prix pose / m² : ${
      order.services?.pose ? `${order.services.posePricePerM2} MAD` : "-"
    }
Prix pose : ${money(order.services?.posePrice)}

TOTAL
Surface client totale : ${Number(
      order.totals?.totalClientSurface || 0
    ).toFixed(2)} m²
Surface recommandée totale : ${Number(
      order.totals?.totalRecommendedSurface || 0
    ).toFixed(2)} m²
Nombre total de pièces : ${order.totals?.totalPieces || 0}
Mètre linéaire total : ${Number(
      order.totals?.totalLinearMeters || 0
    ).toFixed(2)} ml
Prix total matériaux : ${money(order.totals?.materialTotal)}
Total services : ${money(order.totals?.servicesTotal)}
TOTAL ESTIMÉ : ${money(order.totals?.finalTotal)}
`;
  }, [order, client]);

  const message = `
Bonjour MARBRE DE CLASSE,

Je souhaite finaliser cette demande de devis :

${orderText}

Merci de me contacter pour confirmer les détails.
`;

  const whatsappLink = `https://wa.me/212604982455?text=${encodeURIComponent(
    message
  )}`;

  return (
    <main className="quote-request-page">
      <section className="quote-request-card">
        <div className="quote-request-header">
          <span>DEMANDE DE DEVIS</span>
          <h1>Finaliser votre demande</h1>
          <p>
            Vérifiez votre configuration, ajoutez vos informations, puis envoyez
            la demande directement via WhatsApp.
          </p>
        </div>

        {order ? (
          <div className="quote-order-summary">
            <span>RÉSUMÉ DU PROJET</span>

            <h3>{order.product?.name}</h3>

            <div className="quote-summary-grid">
              <div>
                <small>Surface client</small>
                <strong>
                  {Number(order.totals?.totalClientSurface || 0).toFixed(2)} m²
                </strong>
              </div>

              <div>
                <small>Surface recommandée</small>
                <strong>
                  {Number(order.totals?.totalRecommendedSurface || 0).toFixed(
                    2
                  )}{" "}
                  m²
                </strong>
              </div>

              <div>
                <small>Nombre de pièces</small>
                <strong>{order.totals?.totalPieces || 0}</strong>
              </div>

              <div>
                <small>Mètre linéaire</small>
                <strong>
                  {Number(order.totals?.totalLinearMeters || 0).toFixed(2)} ml
                </strong>
              </div>

              <div>
                <small>Surface pose</small>
                <strong>
                  {Number(order.services?.poseSurface || 0).toFixed(2)} m²
                </strong>
              </div>

              <div>
                <small>Services</small>
                <strong>{money(order.totals?.servicesTotal)}</strong>
              </div>

              <div className="quote-summary-total">
                <small>Total estimé</small>
                <strong>{money(order.totals?.finalTotal)}</strong>
              </div>
            </div>

            <div className="quote-lines">
              {order.lines?.map((line, index) => (
                <div className="quote-line" key={index}>
                  <strong>
                    Ligne {index + 1} — {line.finish || "-"} —{" "}
                    {line.format || "-"}
                  </strong>

                  <p>
                    Surface: {Number(line.clientSurface || 0).toFixed(2)} m² ·
                    Perte:{" "}
                    {line.lossEnabled ? `${line.lossMargin}%` : "Non"} ·
                    Sécurité:{" "}
                    {line.securityEnabled ? `${line.securityMargin}%` : "Non"} ·
                    Pose: {line.linePoseEnabled ? "Oui" : "Non"} · Surface pose:{" "}
                    {Number(line.linePoseSurface || 0).toFixed(2)} m² ·
                    Recommandée:{" "}
                    {Number(line.recommendedSurface || 0).toFixed(2)} m² ·{" "}
                    {line.piecesNeeded || 0} pièces ·{" "}
                    {Number(line.rowLinearMeters || 0).toFixed(2)} ml ·{" "}
                    {money(line.rowPrice)}
                  </p>
                </div>
              ))}
            </div>

            <div className="quote-actions-top">
              <Link to={`/products/${order.product?.id}`}>
                Retour au produit
              </Link>

              <button type="button" onClick={clearOrder}>
                Vider la demande
              </button>
            </div>
          </div>
        ) : (
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

        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="quote-whatsapp-btn"
        >
          Envoyer via WhatsApp
        </a>
      </section>
    </main>
  );
}