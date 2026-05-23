import "./FloorFormatSelector.css";

const formatDescriptions = {
  "60×60": {
    title: "Grand format moderne",
    description:
      "Idéal pour les grands salons, espaces ouverts et designs contemporains.",
  },

  "40×40": {
    title: "Format classique",
    description:
      "Format traditionnel polyvalent pour maisons et espaces standards.",
  },

  "60×30": {
    title: "Effet allongé",
    description:
      "Parfait pour créer un effet visuel élégant et contemporain.",
  },

  "30×30": {
    title: "Petit format",
    description:
      "Utilisé dans certaines salles de bain et espaces techniques.",
  },
};

export default function FloorFormatSelector({
  formats,
  selectedFormat,
  setSelectedFormat,
}) {
  return (
    <section className="floor-format-selector">

      <div className="floor-format-header">
        <span>FORMATS DISPONIBLES</span>

        <h3>
          Choisissez le format du sol
        </h3>
      </div>

      <div className="floor-format-grid">

        {formats.map((format) => (
          <button
            key={format.size}
            className={
              selectedFormat === format.size
                ? "floor-format-card active"
                : "floor-format-card"
            }
            onClick={() =>
              setSelectedFormat(format.size)
            }
          >

            <strong>
              {format.size}
            </strong>

            <span>
              {format.pricePerM2} MAD / m²
            </span>

            <p>
              {
                formatDescriptions[
                  format.size
                ]?.title
              }
            </p>

            <small>
              {
                formatDescriptions[
                  format.size
                ]?.description
              }
            </small>

          </button>
        ))}

      </div>

    </section>
  );
}