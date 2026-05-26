import "./LegalPage.css";

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <section className="legal-container">
        <span className="legal-kicker">MARBRE DE CLASSE</span>

        <h1>Politique de confidentialité</h1>

        <p>
          La présente politique de confidentialité explique comment MARBRE DE
          CLASSE collecte, utilise et protège les informations personnelles des
          utilisateurs de son site web.
        </p>

        <h2>1. Données collectées</h2>
        <ul>
          <li>Nom et prénom</li>
          <li>Numéro de téléphone</li>
          <li>Adresse e-mail</li>
          <li>Ville ou adresse de livraison</li>
          <li>Informations liées à votre demande de devis</li>
          <li>Dimensions, choix de matériaux, finitions et services demandés</li>
          <li>Messages envoyés via le formulaire de contact ou WhatsApp</li>
        </ul>

        <h2>2. Utilisation des données</h2>
        <p>
          Les données collectées sont utilisées pour répondre à vos demandes,
          préparer un devis personnalisé, vous contacter concernant votre
          projet, organiser la livraison ou l’accompagnement et améliorer nos
          services.
        </p>

        <h2>3. Partage des données</h2>
        <p>
          MARBRE DE CLASSE ne vend pas vos données personnelles. Vos
          informations peuvent être partagées uniquement avec des prestataires
          nécessaires à l’exécution du service.
        </p>

        <h2>4. Conservation des données</h2>
        <p>
          Vos données sont conservées pendant la durée nécessaire au traitement
          de votre demande, au suivi commercial et au respect des obligations
          légales éventuelles.
        </p>

        <h2>5. Sécurité</h2>
        <p>
          Nous mettons en place des mesures raisonnables pour protéger vos
          informations contre l’accès non autorisé, la perte ou l’utilisation
          abusive.
        </p>

        <h2>6. Cookies</h2>
        <p>
          Le site peut utiliser des cookies afin d’améliorer l’expérience
          utilisateur, analyser la navigation et optimiser les performances du
          site.
        </p>

        <h2>7. Vos droits</h2>
        <p>
          Vous pouvez demander l’accès, la modification ou la suppression de vos
          données personnelles en nous contactant.
        </p>

        <h2>8. Contact</h2>
        <p className="legal-signature">
          MARBRE DE CLASSE
          <br />
          Rabat, Maroc
          <br />
          WhatsApp : +212 604 982 455
        </p>
      </section>
    </main>
  );
}