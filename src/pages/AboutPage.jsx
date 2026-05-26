import "./LegalPage.css";

export default function AboutPage() {
  return (
    <main className="legal-page">
      <section className="legal-container">
        <span className="legal-kicker">MARBRE DE CLASSE</span>

        <h1>Qui sommes-nous</h1>

        <p>
          MARBRE DE CLASSE est une entreprise spécialisée dans la vente, la
          découpe et la fabrication de produits en marbre, quartz, granit, onyx
          et pierres naturelles.
        </p>

        <p>
          Basée à Rabat, au Maroc, notre mission est d’accompagner les
          particuliers, les professionnels, les architectes et les décorateurs
          dans la réalisation de projets élégants, durables et sur mesure.
        </p>

        <p>
          Nous proposons une sélection variée de marbres marocains, marbres
          importés, quartz, granits et pierres décoratives, adaptés aux sols,
          cuisines, salles de bain, escaliers, tables, vasques, fontaines et
          éléments de décoration.
        </p>

        <p>
          Chez MARBRE DE CLASSE, chaque projet est étudié avec attention. Nous
          aidons nos clients à choisir le matériau, les dimensions, l’épaisseur,
          les finitions et les services adaptés à leurs besoins.
        </p>

        <h2>Notre engagement</h2>

        <ul>
          <li>Une sélection de matériaux de qualité</li>
          <li>Des conseils adaptés à chaque projet</li>
          <li>Des découpes et finitions sur mesure</li>
          <li>Un accompagnement professionnel</li>
          <li>Des devis clairs et personnalisés</li>
          <li>Une livraison selon la ville et le besoin du client</li>
        </ul>

        <p className="legal-signature">
          MARBRE DE CLASSE, l’exigence de classe.
        </p>
      </section>
    </main>
  );
}