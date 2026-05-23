import "./UsageModeSelector.css";

const modeDescriptions = {
  customMarble: {
    title: "Marbre sur mesure",
    description:
      "Pour commander une ou plusieurs pièces de marbre selon vos mesures, avec forme, chants, finition et découpes.",
  },

  standardFloor: {
    title: "Sol / formats standards",
    description:
      "Pour les sols avec formats déjà découpés comme 60×60, 40×40 ou 60×30, avec prix prédéfinis.",
  },

  fabricatedProduct: {
    title: "Projet sur mesure",
    description:
      "Pour fabriquer une table, vasque, console ou pièce décorative avec sélection de pierre, travail artistique et finition premium.",
  },
};

export default function UsageModeSelector({
  product,
  selectedMode,
  setSelectedMode,
}) {
  const modes = product.salesModes || {};

  return (
    <section className="usage-mode-selector">
      <div className="usage-mode-header">
        <span>MODE DE VENTE</span>
        <h2>Que souhaitez-vous réaliser ?</h2>
        <p>
          Choisissez le type de demande afin d’adapter le calcul, les options
          techniques et le devis.
        </p>
      </div>

      <div className="usage-mode-grid">
        {Object.entries(modes).map(([modeKey, mode]) => {
          if (!mode.enabled) return null;

          return (
            <button
              key={modeKey}
              className={
                selectedMode === modeKey
                  ? "usage-mode-card active"
                  : "usage-mode-card"
              }
              onClick={() => setSelectedMode(modeKey)}
            >
              <span>{modeDescriptions[modeKey]?.title || mode.label}</span>

              <p>
                {modeDescriptions[modeKey]?.description ||
                  "Configuration personnalisée du projet."}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}