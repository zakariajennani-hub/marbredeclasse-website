import { Link } from "react-router-dom";

import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-premium">

      <div className="footer-grid">

        <div className="footer-brand">

          <h3>
            MARBRE DE CLASSE
          </h3>

          <p>
            Marbre marocain, importé,
            quartz, granite, onyxe et
            produits fabriqués sur mesure
            pour projets résidentiels
            et professionnels.
          </p>

        </div>

        <div className="footer-links">

          <span>
            Navigation
          </span>

          <Link to="/">
            Accueil
          </Link>

          <Link to="/products">
            Marbres
          </Link>

          <Link to="/products">
            Produits
          </Link>

          <Link to="/products">
            Demander un devis
          </Link>

        </div>

        <div className="footer-links">

          <span>
            Collections
          </span>

          <Link to="/products">
            Marbre marocain
          </Link>

          <Link to="/products">
            Marbre importé
          </Link>

          <Link to="/products">
            Granite
          </Link>

          <Link to="/products">
            Onyxe
          </Link>

        </div>

        <div className="footer-contact">

          <span>
            Contact
          </span>

          <p>
            WhatsApp :
            +212 6 00 00 00 00
          </p>

          <p>
            Rabat — Maroc
          </p>

          <p>
            contact@marbredeclasse.ma
          </p>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 MARBRE DE CLASSE —
          Tous droits réservés.
        </p>

      </div>

    </footer>
  );
}