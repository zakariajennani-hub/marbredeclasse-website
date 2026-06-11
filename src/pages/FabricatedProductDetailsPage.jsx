import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import fabricatedProducts from "../data/fabricatedProducts";

import {
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackLead,
  trackWhatsAppClick,
} from "../utils/metaPixel";

import "./FabricatedProductDetailsPage.css";

export default function FabricatedProductDetailsPage() {
  const { id } = useParams();

  const productId = id || "table-salle-a-manger-sur-mesure";

  const product = fabricatedProducts.find((item) => item.id === productId);

  const [activeImage, setActiveImage] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCity, setClientCity] = useState("");

  useEffect(() => {
    if (product) {
      setActiveImage(product.gallery?.[0] || product.image || "");

      trackViewContent({
        productName: product.name,
        productId: product.id,
        category: product.category || "Produit fabriqué",
        value: product.price || 0,
      });
    }
  }, [product]);

  if (!product) {
    return <div className="fabricated-not-found">Produit introuvable</div>;
  }

  const handleBuyClick = () => {
    trackAddToCart({
      value: product.price || 0,
      productName: product.name,
      productId: product.id,
      quantity: 1,
      category: product.category || "Produit fabriqué",
    });

    trackInitiateCheckout({
      value: product.price || 0,
      itemsCount: 1,
      source: "Produit fabriqué",
    });

    setShowOrderForm((prev) => !prev);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    trackLead({
      source: "produit fabrique",
      value: product.price || 0,
      city: clientCity,
      productName: product.name,
    });

    trackWhatsAppClick({
      source: "produit fabrique",
      productName: product.name,
    });

    const message = `
Bonjour MARBRE DE CLASSE,

Je souhaite acheter ce produit :

Produit : ${product.name}
Prix : ${product.price?.toLocaleString("fr-FR")} ${product.unit || "DH"}

Informations client :
Nom complet : ${clientName}
Téléphone : ${clientPhone}
Ville : ${clientCity}

Merci de me contacter pour confirmer la commande.
`;

    window.open(
      `https://wa.me/212604982455?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <main className="fabricated-details-page">
      <section className="luxury-product-layout">
        <div className="luxury-gallery">
          <div className="luxury-main-image">
            <img src={activeImage} alt={product.name} />
          </div>

          {product.gallery?.length > 1 && (
            <div className="luxury-thumbs">
              {product.gallery.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  className={activeImage === img ? "active" : ""}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`${product.name}-${index}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="luxury-product-info">
          <span className="luxury-category">TABLES</span>

          <h1>{product.name}</h1>

          <div className="luxury-price">
            {product.price?.toLocaleString("fr-FR")} {product.unit || "DH"}
          </div>

          <p className="luxury-short-description">{product.description}</p>

          <div className="luxury-highlights">
            <span>✓ 160×90 cm</span>
            <span>✓ Plateau travertin</span>
            <span>✓ Chaises métal</span>
            <span>✓ Tissu bouclé anti-tache</span>
          </div>

          <button
            type="button"
            className="luxury-buy-btn"
            onClick={handleBuyClick}
          >
            Acheter
          </button>

          {showOrderForm && (
            <form className="luxury-order-form" onSubmit={handleOrderSubmit}>
              <input
                type="text"
                placeholder="Nom complet"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />

              <input
                type="tel"
                placeholder="Numéro de téléphone"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Ville"
                value={clientCity}
                onChange={(e) => setClientCity(e.target.value)}
                required
              />

              <button type="submit">Envoyer la demande</button>
            </form>
          )}
        </div>
      </section>

      <section className="luxury-product-extra">
        <div className="luxury-details-table">
          <h2>Détails du produit</h2>

          <div>
            <span>Mesure</span>
            <strong>160×90 cm — fabrication sur mesure disponible</strong>
          </div>
          <div>
            <span>Plateau</span>
            <strong>Marbre Travertin</strong>
          </div>
          <div>
            <span>Chaises</span>
            <strong>Métal</strong>
          </div>
          <div>
            <span>Tissu</span>
            <strong>Bouclé anti-tache</strong>
          </div>
          <div>
            <span>Pieds</span>
            <strong>Marbre Travertin</strong>
          </div>
          <div>
            <span>Livraison</span>
            <strong>Tout le Maroc</strong>
          </div>
        </div>

        <div className="luxury-care">
          <h2>Conseils d’entretien</h2>

          <details>
            <summary>Nettoyage de la table</summary>
            <p>
              Au quotidien, essuyez la table avec un chiffon microfibre humide
              avec quelques gouttes de savon.
            </p>
            <p>
              En cas de tache, appliquez une pâte de bicarbonate de soude avec
              un peu d’eau, puis essuyez délicatement.
            </p>
            <p className="luxury-warning">
              À bannir : vinaigre blanc, javel et éponges abrasives.
            </p>
          </details>

          <details>
            <summary>Nettoyage des chaises</summary>
            <p>
              Dépoussiérez une fois par mois avec l’embout brosse douce de
              l’aspirateur.
            </p>
            <p>
              En cas de tache liquide récente, absorbez immédiatement avec un
              chiffon blanc propre sans frotter.
            </p>
            <p>
              Pour une tache sèche, tamponnez avec une éponge humide et du savon
              de Marseille, puis séchez à distance.
            </p>
            <p className="luxury-warning">
              À bannir : brosses dures et frottements énergiques.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}