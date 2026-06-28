const money = (value) => {
  return Math.round(Number(value || 0)).toLocaleString("fr-FR") + " DH";
};

const line = "━━━━━━━━━━━━━━━━━━━━";

const buildClientSection = (client) => {
  return `
👤 CLIENT

Nom :
${client.fullName || "-"}

Téléphone :
${client.phone || "-"}

Ville :
${client.city || "-"}

Adresse :
${client.address || "-"}

Remarque :
${client.note || "-"}
`;
};

const buildSurMesureMessage = ({ order, client, quoteId }) => {
  const piecesText =
    order.pieces
      ?.map((piece) => {
        return `
${line}
📐 PIÈCE ${piece.index}

Longueur : ${piece.length || 0} cm
Largeur : ${piece.width || 0} cm
Quantité : ${piece.quantity || 0}
Surface : ${Number(piece.totalSurface || 0).toFixed(2)} m²
Total pièce : ${money(piece.totalPrice)}
`;
      })
      .join("\n") || "-";

  return `
🟨 DEMANDE DE DEVIS
MARBRE DE CLASSE

Référence demande : #${quoteId || "-"}

${line}

📌 Type :
Marbre sur mesure

🪨 Marbre :
${order.productName || "-"}

Catégorie :
${order.category || "-"}

💰 Prix :
${money(order.pricePerM2)} / m²

${line}

📐 PIÈCES
${piecesText}

${line}

📊 TOTAL

Nombre de pièces :
${order.totalQuantity || 0}

Surface totale :
${Number(order.totalSurface || 0).toFixed(2)} m²

Prix estimatif :
${money(order.totalPrice)}

${line}

${buildClientSection(client)}

${line}

Merci de me contacter pour confirmer les détails.
`;
};

const buildDefaultOrderMessage = ({ order, client, quoteId }) => {
  return `
🟨 DEMANDE DE DEVIS
MARBRE DE CLASSE

Référence demande : #${quoteId || "-"}

${line}

Produit :
${order?.product?.name || order?.productName || "Demande de devis"}

Catégorie :
${order?.product?.categoryLabel || order?.product?.category || order?.category || "-"}

Mode :
${order?.mode || "-"}

${line}

${buildClientSection(client)}

${line}

Merci de me contacter pour confirmer les détails.
`;
};

export default function buildWhatsAppMessage({ order, client, quoteId }) {
  if (order?.mode === "sur_mesure") {
    return buildSurMesureMessage({ order, client, quoteId });
  }

  return buildDefaultOrderMessage({ order, client, quoteId });
}