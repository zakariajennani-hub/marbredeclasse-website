import { Link } from "react-router-dom";

import products from "../data/productsData";

import heroMarbreImg from "../assets/home/hero-marbre.png";

import marbreMarocainImg from "../assets/home/marbre-marocain.png";
import marbreImporteImg from "../assets/home/marbre-importe.png";
import marbreArtificielImg from "../assets/home/marbre-artificiel.jpg";
import graniteImg from "../assets/home/granite.png";
import onyxeImg from "../assets/home/onyxe.png";
import produitsImg from "../assets/home/produits.png";

import "./HomePage.css";

const univers = [
  {
    title: "Marbre marocain",
    text: "Beauté naturelle et qualité exceptionnelle des carrières marocaines.",
    image: marbreMarocainImg,
    link: "/products?category=MARBRE MAROCAIN",
  },
  {
    title: "Marbre importé",
    text: "Sélection premium de marbres italiens, turcs, espagnols et plus.",
    image: marbreImporteImg,
    link: "/products?category=MARBRE IMPORTÉ",
  },
  {
    title: "Marbre artificiel",
    text: "Résistant, uniforme et idéal pour tous vos espaces.",
    image: marbreArtificielImg,
    link: "/products?category=MARBRE ARTIFICIEL",
  },
  {
    title: "Granit",
    text: "Solidité extrême et durabilité incomparable pour un usage quotidien.",
    image: graniteImg,
    link: "/products?category=GRANITE",
  },
  {
    title: "Onyxe",
    text: "Transparence unique et élégance pour des ambiances raffinées.",
    image: onyxeImg,
    link: "/products?category=ONYXE",
  },
  {
    title: "Autres produits",
    text: "Vasques, tables, fontaines et décorations en marbre et quartz.",
    image: produitsImg,
    link: "/products?category=PRODUITS",
  },
];

const testimonials = [
  {
    name: "Client Rabat",
    text: "Service sérieux, choix clair des formats et réponse rapide sur WhatsApp.",
  },
  {
    name: "Client Casablanca",
    text: "Le calculateur m’a aidé à comprendre la quantité nécessaire avant de demander le devis.",
  },
  {
    name: "Client Salé",
    text: "Très bon accompagnement pour choisir le marbre et la finition.",
  },
];

const faqs = [
  {
    q: "Est-ce que le prix affiché est définitif ?",
    a: "Le prix affiché est une estimation selon le format, la finition et la surface. Le devis final est confirmé par le service client.",
  },
  {
    q: "Puis-je choisir la pose pour une seule surface ?",
    a: "Oui, vous pouvez activer ou désactiver la pose pour chaque ligne séparément.",
  },
  {
    q: "Est-ce que vous livrez ?",
    a: "Oui, la livraison peut être ajoutée dans le calculateur selon la ville.",
  },
];

function getMinPrice(product) {
  const formats =
    product.finishes?.flatMap((finish) => finish.formats || []) || [];

  if (!formats.length) return product.price || 0;

  return Math.min(...formats.map((format) => Number(format.pricePerM2 || 0)));
}

export default function HomePage() {
  const bestProducts = products.slice(0, 3);

  return (
    <main className="home-page">
      <section className="home-hero home-hero-with-image">
        <div className="home-hero-bg">
          <img src={heroMarbreImg} alt="Marbre de Classe" />
        </div>

        <div className="home-hero-overlay"></div>

        <div className="home-hero-content">
          <span>MARBRE DE CLASSE</span>

          <h1>Le marbre sur mesure pour vos espaces d’exception</h1>

          <p>
            Découvrez nos marbres marocains, importés, artificiels, granits,
            onyxes et produits fabriqués sur mesure.
          </p>

          <div className="home-hero-actions">
            <Link to="/products" className="home-primary-btn">
              Voir les produits
            </Link>

            <Link to="/devis" className="home-secondary-btn">
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      <section className="home-univers-section">
        <div className="home-section-title">
          <span>CHOISISSEZ VOS UNIVERS</span>
          <h2>Nos types de marbre et pierres</h2>
        </div>

        <div className="home-univers-grid">
          {univers.map((item) => (
            <Link to={item.link} className="home-univers-card" key={item.title}>
              <div className="home-univers-image">
                <img src={item.image} alt={item.title} />
              </div>

              <div className="home-univers-content">
                <div className="home-univers-icon">◆</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-bestsellers-section">
        <div className="home-section-title">
          <span>SÉLECTION CLIENTS</span>
          <h2>Nos marbres les plus demandés</h2>
        </div>

        <div className="home-products-grid">
          {bestProducts.map((product) => (
            <Link
              to={`/products/${product.id}`}
              className="home-product-card"
              key={product.id}
            >
              <img src={product.image} alt={product.name} />

              <div>
                <span>{product.categoryLabel || product.category}</span>

                <h3>{product.name}</h3>

                <p>
                  Prix à partir de{" "}
                  <strong>{getMinPrice(product)} MAD / m²</strong>
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="home-center-action">
          <Link to="/products">Voir tous les produits</Link>
        </div>
      </section>

      <section className="home-testimonials-section">
        <div className="home-section-title">
          <span>AVIS CLIENTS</span>
          <h2>Retours de nos clients</h2>
        </div>

        <div className="home-testimonials-grid">
          {testimonials.map((item) => (
            <div className="home-testimonial-card" key={item.name}>
              <p>“{item.text}”</p>
              <strong>{item.name}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="home-faq-section">
        <div className="home-section-title">
          <span>QUESTIONS FRÉQUENTES</span>
          <h2>Questions fréquentes</h2>
        </div>

        <div className="home-faq-list">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <div>
          <h3>MARBRE DE CLASSE</h3>
          <p>
            Marbre marocain, importé, quartz, granite, onyxe et produits
            fabriqués sur mesure pour projets résidentiels et professionnels.
          </p>
        </div>

        <div>
          <h4>Navigation</h4>
          <Link to="/">Accueil</Link>
          <Link to="/products">Produits</Link>
          <Link to="/devis">Demander un devis</Link>
        </div>

        <div>
          <h4>Collections</h4>
          <Link to="/products?category=MARBRE MAROCAIN">Marbre marocain</Link>
          <Link to="/products?category=MARBRE IMPORTÉ">Marbre importé</Link>
          <Link to="/products?category=GRANITE">Granite</Link>
          <Link to="/products?category=ONYXE">Onyxe</Link>
        </div>

        <div>
          <h4>A propos</h4>
          <Link to="/about">Qui sommes-nous</Link>
          <Link to="/privacy">Politique de confidentialité</Link>
          <Link to="/terms">Conditions d’utilisation</Link>
        </div>

        <div>
          <h4>Contact</h4>
          <p>WhatsApp : 0604982455</p>
          <p>Magasin : Rabat, L’Océan</p>
          <p>Atelier : Salé, Bouknadel</p>
        </div>

        <div className="home-footer-bottom">
          © 2026 MARBRE DE CLASSE — Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}