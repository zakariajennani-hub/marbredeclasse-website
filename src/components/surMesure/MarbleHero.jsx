import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  trackMarbleView,
  trackMarbleApplicationClick,
} from "../../utils/analytics";

const applicationLabels = {
  floor: "Sol",
  kitchen: "Cuisine",
  bathroom: "Salle de bain",
  stairs: "Escalier",
  wall: "Mur",
};

export default function MarbleHero({ marble }) {
  const images = useMemo(() => {
    const mainImage = {
      key: "main",
      label: "Marbre",
      image: marble.cover_image,
    };

    const galleryImages =
      marble.gallery?.map((item) => ({
        key: item.type,
        label: applicationLabels[item.type] || item.label,
        image: item.image,
      })) || [];

    return [mainImage, ...galleryImages];
  }, [marble]);

  const [activeImage, setActiveImage] = useState(images[0]);

  useEffect(() => {
    setActiveImage(images[0]);
  }, [images]);
useEffect(() => {
  if (!marble) return;

  trackMarbleView({
    marbleName: marble.name,
    marbleCategory: marble.category,
    value: marble.price_per_m2,
  });
}, [marble]);

  return (
    <section className="surmesure-marble-hero">
      <Link to="/sur-mesure" className="surmesure-back-link">
        ← Retour
      </Link>

      <div className="surmesure-marble-hero-grid">
        <div className="surmesure-marble-visual">
          <div className="surmesure-marble-main-image">
            <img
              key={activeImage?.key}
              src={activeImage?.image || marble.cover_image}
              alt={activeImage?.label || marble.name}
            />
          </div>

          <div className="surmesure-marble-tabs">
            {images.map((item) => (
              <button
                key={item.key}
                type="button"
                className={activeImage?.key === item.key ? "active" : ""}
onClick={() => {
  setActiveImage(item);

  trackMarbleApplicationClick({
    marbleName: marble.name,
    application: item.key,
  });
}}              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="surmesure-marble-info-panel">
          <p className="surmesure-detail-eyebrow">Découpe sur mesure</p>
          <h1>{marble.name}</h1>

          <div className="surmesure-rating">
            ★★★★★ <span>5.0</span>
          </div>

          <div className="surmesure-detail-meta">
            <span>{marble.category}</span>
            <strong>
              {marble.price_per_m2.toLocaleString("fr-FR")} DH / m²
            </strong>
          </div>

          <p className="surmesure-detail-description">{marble.description}</p>

          <div className="surmesure-detail-features">
            <div>
              <strong>Découpe</strong>
              <span>Sur mesure</span>
            </div>
            <div>
              <strong>Livraison disponible</strong>
              <span>Partout au Maroc</span>
            </div>
            <div>
              <strong>Devis</strong>
              <span>En ligne</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}