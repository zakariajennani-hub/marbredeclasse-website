import "./DevisPrint.css";

export default function DevisPrint({
  product,
  items,
  finition,
  delivery,
  installation,
  result,
  client,
}) {
  const printDevis = () => {
    window.print();
  };

  return (
    <section className="devis-print-section">
      <div className="devis-print-header">
        <span>Document commercial</span>
        <h2>Devis imprimable</h2>
        <p>
          Version imprimable du devis avec les informations client, les mesures,
          les options techniques et le total estimé.
        </p>
      </div>

      <div className="devis-preview" id="devis-preview">
        <div className="devis-top">
          <div>
            <h1>MARBRE DE CLASSE</h1>
            <p>Marbre • Quartz • Granite • Sur mesure</p>
          </div>

          <div className="devis-meta">
            <strong>DEVIS</strong>
            <span>Date : {new Date().toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        <div className="devis-block">
          <h3>Client</h3>
          <p><strong>Nom :</strong> {client.fullName || "—"}</p>
          <p><strong>Téléphone :</strong> {client.phone || "—"}</p>
          <p><strong>Email :</strong> {client.email || "—"}</p>
          <p><strong>Ville :</strong> {client.city || "—"}</p>
        </div>

        <div className="devis-block">
          <h3>Produit</h3>
          <p><strong>Produit :</strong> {product.name}</p>
          <p><strong>Catégorie :</strong> {product.category}</p>
          <p><strong>Épaisseur :</strong> {product.thickness}</p>
          <p><strong>Finition :</strong> {finition}</p>
        </div>

        <div className="devis-block">
          <h3>Mesures</h3>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Forme</th>
                <th>Longueur</th>
                <th>Largeur</th>
                <th>Qté</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.shape}</td>
                  <td>{item.length} cm</td>
                  <td>{item.width} cm</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="devis-block">
          <h3>Résumé technique</h3>
          <p><strong>Surface brute :</strong> {result.rawSurface.toFixed(2)} m²</p>
          <p><strong>Surface avec pertes :</strong> {result.surfaceWithWaste.toFixed(2)} m²</p>
          <p><strong>Livraison :</strong> {delivery ? "Oui" : "Non"}</p>
          <p><strong>Pose :</strong> {installation ? "Oui" : "Non"}</p>
        </div>

        <div className="devis-total-print">
          <span>Total estimé</span>
          <strong>{Math.round(result.total).toLocaleString()} MAD</strong>
        </div>

        <div className="devis-note">
          <strong>Note projet :</strong>
          <p>{client.note || "—"}</p>
        </div>
      </div>

      <button className="print-devis-btn" onClick={printDevis}>
        Télécharger / Imprimer le devis
      </button>
    </section>
  );
}