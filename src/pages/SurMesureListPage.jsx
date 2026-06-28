import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import marbles from "../data/marbles";
import "../components/surMesure/surMesure.css";

const categories = [
  "TOUS",
  "MARBRE IMPORTÉ",
  "MARBRE MAROCAIN",
  "MARBRE ARTIFICIEL",
  "GRANITE",
  "ONYX",
  "PIERRE",
];

export default function SurMesureListPage() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("TOUS");

  const activeMarbles = marbles.filter((marble) => marble.is_active);

  const filteredMarbles = useMemo(() => {
    return activeMarbles.filter((marble) => {
      const search = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        marble.name.toLowerCase().includes(search) ||
        marble.category.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "TOUS" ||
        marble.category.toUpperCase() === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [activeMarbles, searchTerm, selectedCategory]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="surmesure-page surmesure-page-light">
      <section className="surmesure-list-container">
        <div className="surmesure-back-wrapper">
          <button
            type="button"
            className="surmesure-back-button"
            onClick={() => navigate(-1)}
          >
            ← Retour
          </button>
        </div>

        <form className="surmesure-search-box" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Rechercher un marbre : Calacatta, Guatemala, Travertin..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <button type="submit">Rechercher</button>
        </form>

        <div className="surmesure-category-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="surmesure-results-info">
          {filteredMarbles.length} marbre
          {filteredMarbles.length > 1 ? "s" : ""} disponible
          {filteredMarbles.length > 1 ? "s" : ""}
        </div>

        <div className="surmesure-marble-grid">
          {filteredMarbles.map((marble) => {
            const hoverImage = marble.gallery?.[0]?.image || marble.cover_image;

            return (
              <article key={marble.id} className="surmesure-marble-card">
                <div className="surmesure-marble-image">
                  <img
                    className="surmesure-marble-img main"
                    src={marble.cover_image}
                    alt={marble.name}
                  />

                  <img
                    className="surmesure-marble-img hover"
                    src={hoverImage}
                    alt={`${marble.name} en situation`}
                  />

                  {marble.badge ? (
                    <span className="surmesure-marble-badge">
                      {marble.badge}
                    </span>
                  ) : null}
                </div>

                <div className="surmesure-marble-content">
                  <h3>{marble.name}</h3>
                  <p>{marble.category}</p>
                  <strong>
                    {marble.price_per_m2.toLocaleString("fr-FR")} DH / m²
                  </strong>

                  <Link
                    to={`/sur-mesure/${marble.slug}`}
                    className="surmesure-marble-button"
                  >
                    Découvrir ce marbre →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}