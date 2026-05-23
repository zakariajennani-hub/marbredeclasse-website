import { Link } from "react-router-dom";

import "./HomeBestSellers.css";

const bestSellers = [
  {
    id: 1,
    name: "Marbre Blanc Carrara",
    price: "650 MAD / m²",

    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 2,
    name: "Marbre Noir Marquina",
    price: "750 MAD / m²",

    image:
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 3,
    name: "Marbre Beige Botticino",
    price: "600 MAD / m²",

    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: 4,
    name: "Marbre Gris Pietra",
    price: "550 MAD / m²",

    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function HomeBestSellers() {
  return (
    <section className="home-best-sellers">

      <div className="best-sellers-header">

        <div>

          <span>
            BEST SELLERS
          </span>

          <h2>
            Nos marbres les plus vendus
          </h2>

        </div>

        <Link
          to="/products"
          className="best-sellers-link"
        >
          Voir tous les marbres
        </Link>

      </div>

      <div className="best-sellers-grid">

        {bestSellers.map((item) => (
          <Link
            key={item.id}
            to={`/products/${item.id}`}
            className="best-seller-card"
          >

            <div className="best-seller-image">

              <img
                src={item.image}
                alt={item.name}
              />

            </div>

            <div className="best-seller-content">

              <strong>
                {item.name}
              </strong>

              <span>
                {item.price}
              </span>

            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}