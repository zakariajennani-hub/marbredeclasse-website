import "./FloorClientForm.css";

export default function FloorClientForm({ client, setClient }) {
  const updateClient = (field, value) => {
    setClient({
      ...client,
      [field]: value,
    });
  };

  return (
    <section className="floor-client-form">
      <div className="floor-client-header">
        <span>INFORMATIONS CLIENT</span>
        <h3>Coordonnées pour le devis</h3>
        <p>
          Ces informations seront ajoutées automatiquement à la demande WhatsApp.
        </p>
      </div>

      <div className="floor-client-grid">
        <label>
          Nom complet
          <input
            type="text"
            value={client.fullName}
            onChange={(e) => updateClient("fullName", e.target.value)}
            placeholder="Ex: Zakaria Jennani"
          />
        </label>

        <label>
          Téléphone
          <input
            type="text"
            value={client.phone}
            onChange={(e) => updateClient("phone", e.target.value)}
            placeholder="Ex: 06 00 00 00 00"
          />
        </label>

        <label>
          Ville
          <input
            type="text"
            value={client.city}
            onChange={(e) => updateClient("city", e.target.value)}
            placeholder="Ex: Rabat, Temara, Casablanca..."
          />
        </label>

        <label className="floor-client-note">
          Note projet
          <textarea
            value={client.note}
            onChange={(e) => updateClient("note", e.target.value)}
            placeholder="Ex: salon 30m², besoin livraison et pose..."
          />
        </label>
      </div>
    </section>
  );
}