import "./FloorQuoteActions.css";

export default function FloorQuoteActions({
  product,
  client,

  selectedRoom,
  selectedFormat,

  surface,
  wastePercent,
  surfaceWithWaste,

  pricePerM2,

  delivery,
  installation,
  plinthes,

  total,
}) {
  const whatsappMessage = `
Bonjour MARBRE DE CLASSE,

Je souhaite demander un devis pour un projet sol.

━━━━━━━━━━━━━━━
INFORMATIONS CLIENT
━━━━━━━━━━━━━━━

Nom :
${client.fullName || "-"}

Téléphone :
${client.phone || "-"}

Ville :
${client.city || "-"}

Note :
${client.note || "-"}

━━━━━━━━━━━━━━━
PROJET SOL
━━━━━━━━━━━━━━━

Matériau :
${product.name}

Catégorie :
${product.category}

Origine :
${product.origin}

Type d’espace :
${selectedRoom}

Format choisi :
${selectedFormat}

Surface brute :
${surface} m²

Pertes techniques :
${wastePercent}%

Surface avec pertes :
${surfaceWithWaste.toFixed(2)} m²

Prix / m² :
${pricePerM2} MAD

━━━━━━━━━━━━━━━
OPTIONS
━━━━━━━━━━━━━━━

Livraison :
${delivery ? "Oui" : "Non"}

Pose :
${installation ? "Oui" : "Non"}

Plinthes :
${plinthes ? "Oui" : "Non"}

━━━━━━━━━━━━━━━
TOTAL ESTIMÉ
━━━━━━━━━━━━━━━

${Math.round(total).toLocaleString()} MAD
`;

  const whatsappLink = `https://wa.me/212600000000?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <section className="floor-quote-actions">
      <div>
        <span>DEVIS SOL</span>

        <h3>Envoyer la demande</h3>

        <p>
          Le client peut envoyer directement sa configuration sol via WhatsApp
          avec tous les détails techniques du projet.
        </p>
      </div>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="floor-whatsapp-btn"
      >
        Envoyer via WhatsApp
      </a>
    </section>
  );
}