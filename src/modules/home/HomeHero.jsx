import { Link } from "react-router-dom";

import "./HomeHero.css";

export default function HomeHero() {
  return (
    <section className="home-hero-premium">
      <div className="home-hero-inner">
        <div className="home-hero-text">
          <span className="hero-kicker">MARBRE NATUREL & DESIGN</span>

          <h1>
            Le marbre d’exception
            <br />
            au meilleur prix
            <br />
            <strong>par m²</strong>
          </h1>

          <p>
            Découvrez notre sélection de marbres marocains, importés, quartz,
            granite, onyxe et produits fabriqués sur mesure pour vos projets.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="hero-primary-btn">
              Voir les marbres
            </Link>

            <Link to="/products" className="hero-secondary-btn">
              Demander un devis
            </Link>
          </div>

          <div className="hero-trust">
            <div>
              <strong>Prix clairs</strong>
              <span>au m²</span>
            </div>

            <div>
              <strong>Qualité premium</strong>
              <span>sélection contrôlée</span>
            </div>

            <div>
              <strong>Livraison rapide</strong>
              <span>partout au Maroc</span>
            </div>
          </div>
        </div>

        <div className="hero-price-card">
          <span>À partir de</span>
          <strong>350 MAD / m²</strong>
          <small>Marbre local</small>
        </div>
      </div>
    </section>
  );
}