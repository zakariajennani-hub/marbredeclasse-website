import venteMarbre from "../assets/services/vente-marbre.jpeg";
import decoupeSurMesure from "../assets/services/decoupe-sur-mesure.jpeg";
import solMarbre from "../assets/services/sol-marbre.jpeg";
import plansCuisineBain from "../assets/services/plans-cuisine-bain.jpeg";
import produitsSurMesure from "../assets/services/produits-sur-mesure.jpeg";
import livraison from "../assets/services/livraison.jpeg";
import { Link } from "react-router-dom";

import "./ServicesPage.css";

const services = [
  {
    number: "01",
    title: "Vente de marbre et pierres",
    image: venteMarbre,
    icon: "▱",
    items: [
      "Marbre marocain",
      "Marbre importé",
      "Granite",
      "Onyxe",
      "Quartz / marbre artificiel",
    ],
  },
  {
    number: "02",
    title: "Découpe sur mesure",
    image: decoupeSurMesure,
    icon: "⌞",
    items: [
      "Selon vos mesures",
      "Choix de la forme",
      "Choix de l’épaisseur",
      "Finition des bords",
    ],
  },
  {
    number: "03",
    title: "Sol en marbre",
    image: solMarbre,
    icon: "▦",
    items: [
      "Formats standards : 60×60 / 40×40 / 60×30",
      "Calcul du m²",
      "Marge de perte",
      "Pose optionnelle",
    ],
  },
  {
    number: "04",
    title: "Plans de cuisine & salles de bain",
    image: plansCuisineBain,
    icon: "▔",
    items: ["Plan de travail", "Vasque", "Trous robinet", "Découpe évier"],
  },
  {
    number: "05",
    title: "Produits sur mesure",
    image: produitsSurMesure,
    icon: "◯",
    items: [
      "Tables",
      "Vasques",
      "Fontaines",
      "Décorations en marbre / quartz",
    ],
  },
  {
    number: "06",
    title: "Livraison & accompagnement",
    image: livraison,
    icon: "▭",
    items: [
      "Livraison selon la ville",
      "Aide au choix",
      "Conseils personnalisés",
      "Devis rapide via WhatsApp",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="services-page">
      <section className="services-hero">
        <div className="services-hero-overlay">
          <span>NOS SERVICES</span>

          <div className="services-separator">
            <i></i>
            <b>◇</b>
            <i></i>
          </div>

          <h1>
            Des solutions complètes en marbre, quartz et pierres naturelles
          </h1>

          <p>
            Qualité premium, finitions sur mesure et accompagnement à chaque
            étape de votre projet.
          </p>
        </div>
      </section>

      <section className="services-grid">
        {services.map((service) => (
          <article className="service-card" key={service.number}>
            <div className="service-image">
              <img src={service.image} alt={service.title} />
              <span>{service.number}</span>
            </div>

            <div className="service-body">
              <div className="service-title-row">
                <div className="service-icon">{service.icon}</div>
                <h2>{service.title}</h2>
              </div>

              <ul>
                {service.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <Link to="/devis" className="service-btn">
                Demander un devis
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="services-whatsapp">
        <div>
          <span>☏</span>
          <div>
            <h2>Un projet ? Parlons-en !</h2>
            <p>
              Contactez-nous sur WhatsApp pour un devis rapide et personnalisé.
            </p>
          </div>
        </div>

        <a
          href="https://wa.me/212604982455?text=Bonjour%20MARBRE%20DE%20CLASSE%2C%20je%20souhaite%20demander%20un%20devis."
          target="_blank"
          rel="noreferrer"
        >
          Nous contacter sur WhatsApp
        </a>
      </section>
    </main>
  );
}