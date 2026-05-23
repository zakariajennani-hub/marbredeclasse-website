import { Link } from "react-router-dom";

import categoriesData from "./categoriesData";

import "./HomeCategories.css";

export default function HomeCategories() {
  return (
    <section className="home-categories">
      <div className="home-categories-header">
        <span>COLLECTIONS</span>

        <h2>Explorez nos univers marbre</h2>

        <p>
          Découvrez nos collections de marbre marocain, importé, quartz,
          granite, onyxe et produits fabriqués sur mesure.
        </p>
      </div>

      <div className="home-categories-grid">
        {categoriesData.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${encodeURIComponent(category.title)}`}
            className="home-category-card"
          >
            <div className="home-category-image">
              <img src={category.image} alt={category.title} />
            </div>

            <div className="home-category-overlay">
              <span>{category.title}</span>

              <p>{category.subtitle}</p>

              <button>{category.button}</button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}