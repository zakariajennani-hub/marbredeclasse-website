import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import products from "../data/productsData";
import BackButton from "../modules/layout/BackButton";

import "./ProductsPage.css";

const categories = [
  "TOUS",
  "MARBRE IMPORTÉ",
  "MARBRE MAROCAIN",
  "GRANITE",
  "ONYXE",
  "PRODUITS",
];

function getMinPrice(product) {
  const formats =
    product.finishes?.flatMap((finish) => finish.formats || []) || [];

  if (!formats.length) return product.price || 0;

  return Math.min(...formats.map((format) => Number(format.pricePerM2 || 0)));
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "TOUS";

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === "TOUS" || product.category === selectedCategory;

      const matchSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [selectedCategory, search]);

  const handleCategory = (category) => {
    if (category === "PRODUITS") {
      navigate("/produits");
      return;
    }

    setSelectedCategory(category);

    if (category === "TOUS") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <main className="products-page-light">
      <div className="products-back-wrapper">
        <BackButton label="Retour" />
      </div>

      <div className="products-search-zone">
        <input
          type="text"
          placeholder="Rechercher un marbre : Ibiza, Crema, Travertin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="button">Rechercher</button>
      </div>

      <div className="products-categories-light">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => handleCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <section className="products-grid-light">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link
              to={`/products/${product.id}`}
              className="product-card-light"
              key={product.id}
            >
              <div className="product-image-light">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="product-info-light">
                <span>{product.categoryLabel || product.category}</span>

                <h3>{product.name}</h3>

                <p>
                  Prix à partir de{" "}
                  <strong>{getMinPrice(product)} MAD/m²</strong>
                </p>

                <button type="button">Choisir ce marbre</button>
              </div>
            </Link>
          ))
        ) : (
          <div className="products-empty">
            Aucun produit trouvé pour cette recherche.
          </div>
        )}
      </section>
    </main>
  );
}