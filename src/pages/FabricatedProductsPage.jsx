import { Link } from "react-router-dom";
import {
  productCategories,
  fabricatedProducts,
} from "../data/fabricatedProducts";

import "./FabricatedProductsPage.css";

export default function FabricatedProductsPage() {
  return (
    <main className="fabricated-page">
      <section className="fabricated-hero">
        <span>MARBRE DE CLASSE</span>

        <h1>Produits fabriqués en marbre & quartz</h1>

        <p>
          Découvrez notre collection de tables, vasques, fontaines,
          cheminées, accessoires et créations sur mesure.
        </p>
      </section>

      <section className="categories-section">
        <h2>Nos catégories</h2>

        <div className="categories-grid">
          {productCategories.map((category) => {
            const count = fabricatedProducts.filter(
              (item) => item.category === category.id
            ).length;

            return (
              <div className="category-card" key={category.id}>
                <h3>{category.label}</h3>

                <p>{category.description}</p>

                <span>{count} produit(s)</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="products-section">
        <h2>Produits en vedette</h2>

        <div className="products-grid">
          {fabricatedProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image-placeholder">
                Image produit
              </div>

              <div className="product-content">
                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <Link to={`/produits/${product.id}`} className="product-btn">
  Voir le produit
</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}