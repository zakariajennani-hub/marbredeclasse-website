import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar-premium">
      <button
        type="button"
        className="navbar-menu-btn"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Ouvrir le menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <Link to="/" className="navbar-logo-text" onClick={closeMenu}>
        MARBRE DE CLASSE
      </Link>

      <nav className={menuOpen ? "navbar-links open" : "navbar-links"}>
        <NavLink to="/" onClick={closeMenu}>
          Accueil
        </NavLink>

        <NavLink to="/produits" onClick={closeMenu}>
          Produits
        </NavLink>

        <NavLink to="/sur-mesure" onClick={closeMenu}>
          Sur mesure
        </NavLink>

        <NavLink to="/services" onClick={closeMenu}>
          Nos services
        </NavLink>

        <NavLink to="/contact" onClick={closeMenu}>
          Contactez-nous
        </NavLink>
      </nav>

      <Link to="/devis" className="navbar-quote-btn" onClick={closeMenu}>
        Demander un devis
      </Link>
    </header>
  );
}