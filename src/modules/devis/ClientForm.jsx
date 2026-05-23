import "./ClientForm.css";

export default function ClientForm({ client, setClient }) {
  const updateClient = (field, value) => {
    setClient({
      ...client,
      [field]: value,
    });
  };

  return (
    <section className="client-form-section">
      <div className="client-form-header">
        <span>Informations client</span>
        <h2>Préparer la demande de devis</h2>
        <p>
          Ces informations seront utilisées pour préparer le devis, la commande
          et le contact WhatsApp.
        </p>
      </div>

      <div className="client-form-grid">
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
          Email
          <input
            type="email"
            value={client.email}
            onChange={(e) => updateClient("email", e.target.value)}
            placeholder="Ex: client@email.com"
          />
        </label>

        <label>
          Ville
          <input
            type="text"
            value={client.city}
            onChange={(e) => updateClient("city", e.target.value)}
            placeholder="Ex: Rabat, Casablanca, Temara..."
          />
        </label>

        <label className="client-note">
          Note projet
          <textarea
            value={client.note}
            onChange={(e) => updateClient("note", e.target.value)}
            placeholder="Ex: Projet salle de bain, escalier, cuisine, table sur mesure..."
          />
        </label>
      </div>
    </section>
  );
}