import "./ProductHeroGallery.css";

export default function ProductHeroGallery({ product }) {
  const getMinPrice = () => {
    const formats =
      product.finishes?.flatMap((finish) => finish.formats || []) || [];

    if (!formats.length) return product.price || 0;

    return Math.min(...formats.map((format) => Number(format.pricePerM2 || 0)));
  };

  const scrollToCalculator = () => {
    document
      .getElementById("floor-calculator")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="product-hero-gallery">
      <div className="product-gallery-main">
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info-panel">
        <span>{product.categoryLabel || product.category}</span>

        <h1>{product.name}</h1>

        <p>{product.description}</p>

        <div className="product-info-meta">
          <div>
            <small>Prix à partir de</small>
            <strong>{getMinPrice()} MAD / m²</strong>
          </div>

          <div>
            <small>Épaisseur</small>
            <strong>{product.thickness}</strong>
          </div>

          <div>
            <small>Couleur</small>
            <strong>{product.color}</strong>
          </div>

          <div>
            <small>Origine</small>
            <strong>{product.origin}</strong>
          </div>
        </div>

        <button
          type="button"
          className="product-configure-btn"
          onClick={scrollToCalculator}
        >
          Configurer ce marbre
        </button>
      </div>
    </section>
  );
}