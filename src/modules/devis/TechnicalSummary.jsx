export default function TechnicalSummary({
  product,
  items,
  finition,
  delivery,
  installation,
  result,
  client,

  selectedThickness,
  selectedEdge,
  selectedProjectType,
  selectedCut,
}) {
  return (
    <section className="technical-summary">

      <div className="summary-header">
        <span>RÉSUMÉ TECHNIQUE</span>

        <h2>Détails complets du projet</h2>
      </div>

      <div className="summary-grid">

        <div className="summary-card">
          <span>Produit</span>
          <strong>{product.name}</strong>
        </div>

        <div className="summary-card">
          <span>Catégorie</span>
          <strong>{product.category}</strong>
        </div>

        <div className="summary-card">
          <span>Finition</span>
          <strong>{finition}</strong>
        </div>

        <div className="summary-card">
          <span>Épaisseur</span>
          <strong>{selectedThickness}</strong>
        </div>

        <div className="summary-card">
          <span>Type de chant</span>
          <strong>{selectedEdge}</strong>
        </div>

        <div className="summary-card">
          <span>Découpe spéciale</span>
          <strong>{selectedCut}</strong>
        </div>

        <div className="summary-card">
          <span>Type projet</span>
          <strong>{selectedProjectType}</strong>
        </div>

        <div className="summary-card">
          <span>Livraison</span>

          <strong>
            {delivery ? "Oui" : "Non"}
          </strong>
        </div>

        <div className="summary-card">
          <span>Pose</span>

          <strong>
            {installation ? "Oui" : "Non"}
          </strong>
        </div>

        <div className="summary-card">
          <span>Surface brute</span>

          <strong>
            {result.rawSurface.toFixed(2)} m²
          </strong>
        </div>

        <div className="summary-card">
          <span>Surface finale</span>

          <strong>
            {result.surfaceWithWaste.toFixed(2)} m²
          </strong>
        </div>

        <div className="summary-card total-card">
          <span>Total estimé</span>

          <strong>
            {Math.round(
              result.total
            ).toLocaleString()} MAD
          </strong>
        </div>

      </div>

      <div className="summary-measures">

        <h3>Mesures du projet</h3>

        {items.map((item, index) => (
          <div
            className="measure-line"
            key={item.id}
          >

            <span>
              Mesure {index + 1}
            </span>

            <span>
              {item.length} × {item.width} cm
            </span>

            <span>
              Qté : {item.quantity}
            </span>

            <span>
              {item.shape}
            </span>

          </div>
        ))}

      </div>

      <div className="client-summary">

        <h3>Informations client</h3>

        <div className="client-grid">

          <div>
            <span>Nom</span>

            <strong>
              {client.fullName || "-"}
            </strong>
          </div>

          <div>
            <span>Téléphone</span>

            <strong>
              {client.phone || "-"}
            </strong>
          </div>

          <div>
            <span>Email</span>

            <strong>
              {client.email || "-"}
            </strong>
          </div>

          <div>
            <span>Ville</span>

            <strong>
              {client.city || "-"}
            </strong>
          </div>

        </div>

        <div className="client-note">
          <span>Note projet</span>

          <p>
            {client.note || "-"}
          </p>
        </div>

      </div>

    </section>
  );
}