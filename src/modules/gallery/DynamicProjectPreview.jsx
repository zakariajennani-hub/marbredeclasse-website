import "./DynamicProjectPreview.css";

const previewImages = {
  sol: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",

  escalier:
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",

  salledebain:
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop",

  cuisine:
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",

  table:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
};

export default function DynamicProjectPreview({
  selectedProjectType,
  selectedThickness,
  finition,
}) {
  const image =
    previewImages[selectedProjectType] ||
    previewImages.sol;

  return (
    <section className="dynamic-preview">

      <div className="preview-content">

        <div className="preview-text">

          <span>
            VISUALISATION DYNAMIQUE
          </span>

          <h2>
            Aperçu intelligent du projet
          </h2>

          <p>
            Prévisualisation dynamique selon
            les options choisies dans le
            configurateur technique.
          </p>

          <div className="preview-tags">

            <div className="preview-tag">
              {selectedProjectType}
            </div>

            <div className="preview-tag">
              {selectedThickness}
            </div>

            <div className="preview-tag">
              {finition}
            </div>

          </div>

        </div>

        <div className="preview-image-wrapper">

          <img
            src={image}
            alt="Projet preview"
          />

        </div>

      </div>

    </section>
  );
}