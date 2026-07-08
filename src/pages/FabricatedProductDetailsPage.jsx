import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import fabricatedProducts from "../data/fabricatedProducts";

import {
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
} from "../utils/metaPixel";

import "./FabricatedProductDetailsPage.css";

const BASE_LENGTH = 160;
const BASE_WIDTH = 90;
const BASE_TABLE_ONLY_PRICE = 4900;
const BASE_SET_PRICE = 9899;
const DEFAULT_CHAIRS = 6;
const CHAIR_UNIT_PRICE =
  (BASE_SET_PRICE - BASE_TABLE_ONLY_PRICE) / DEFAULT_CHAIRS;

const chairColors = [
  { id: 1, name: "Noir" },
  { id: 2, name: "Blanc" },
  { id: 3, name: "Blanc cassé" },
  { id: 4, name: "Crème" },
  { id: 5, name: "Ivoire" },
  { id: 6, name: "Beige" },
  { id: 7, name: "Taupe" },
  { id: 8, name: "Rose poudré" },
  { id: 9, name: "Marron" },
  { id: 10, name: "Camel" },
  { id: 11, name: "Moutarde" },
  { id: 12, name: "Vert olive" },
  { id: 13, name: "Vert foncé" },
  { id: 14, name: "Bleu gris" },
  { id: 15, name: "Gris clair" },
  { id: 16, name: "Gris foncé" },
  { id: 17, name: "Terracotta" },
];

function getChairSwatchImage(colorId) {
  return `/images/chairs/andromeda/andromeda-${colorId}.png`;
}

function getTableChairImage(colorId) {
  return `/images/tables/travertin-set/table-chair-${colorId}.png`;
}

function calculateLengthExtra(length) {
  if (length <= BASE_LENGTH) return 0;

  if (length <= 200) {
    return Math.ceil((length - BASE_LENGTH) / 10) * 500;
  }

  const extraUntil200 = 4 * 500;
  const extraAfter200 = Math.ceil((length - 200) / 10) * 800;

  return extraUntil200 + extraAfter200;
}

export default function FabricatedProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const productId = id || "table-salle-a-manger-sur-mesure";
  const product = fabricatedProducts.find((item) => item.id === productId);

  const imageRef = useRef(null);

  const defaultColor =
    chairColors.find((color) => color.name === "Crème") || chairColors[0];

  const [selectedChairColor, setSelectedChairColor] = useState(defaultColor);
  const [activeImage, setActiveImage] = useState(
    getTableChairImage(defaultColor.id)
  );

  const [tableLength, setTableLength] = useState(160);
  const [quantity, setQuantity] = useState(1);

  const chairColor = selectedChairColor.name;
  const chairCount = 6;

  const lengthExtra = useMemo(
    () => calculateLengthExtra(Number(tableLength)),
    [tableLength]
  );

  const currentUnitPrice = useMemo(() => {
    const tablePrice = BASE_TABLE_ONLY_PRICE + lengthExtra;
    const chairsPrice = chairCount * CHAIR_UNIT_PRICE;

    return Math.round(tablePrice + chairsPrice);
  }, [lengthExtra, chairCount]);

  const totalPrice = currentUnitPrice * quantity;
  const originalPrice = Math.round(totalPrice / 0.65);
  const savedAmount = originalPrice - totalPrice;

  useEffect(() => {
    if (!product) return;

    setSelectedChairColor(defaultColor);
    setActiveImage(getTableChairImage(defaultColor.id));

    trackViewContent({
      productName: product.name,
      productId: product.id,
      category: product.category || "Produit fabriqué",
      value: product.price || 0,
    });
  }, [product, defaultColor.id]);
    if (!product) {
    return <div className="fabricated-not-found">Produit introuvable</div>;
  }

  function scrollToMainImageOnMobile() {
    if (window.innerWidth <= 720) {
      imageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  function selectChairColor(color) {
    setSelectedChairColor(color);
    setActiveImage(getTableChairImage(color.id));
    scrollToMainImageOnMobile();
  }


  function buildOrderData() {
    return {
      orderType: "fabricated-table",
      mode: "Projet sur mesure",
      product_type: "Table / produit fabriqué",
      productId: product.id,
      product_id: product.id,
      productName: product.name,
      product_name: product.name,
      productCategory: product.category || "PRODUIT SUR MESURE",
      product_category: product.category || "PRODUIT SUR MESURE",
      price: totalPrice,
      total: totalPrice,
      total_price: totalPrice,
      unitPrice: currentUnitPrice,
      unit_price: currentUnitPrice,
      originalPrice,
      original_price: originalPrice,
      discount: "35%",
      unit: product.unit || "DH",
      quantity,
      mesure: `${tableLength}×${BASE_WIDTH} cm`,
      longueur: `${tableLength} cm`,
      largeur: `${BASE_WIDTH} cm`,
      plateau: "Marbre Travertin",
      pieds: "Marbre Travertin",
      chaises: chairCount,
      chairCount,
      color: chairColor,
      couleur_chaises: chairColor,
      couleur_chaises_id: selectedChairColor.id,
      tissu: "Bouclé anti-tache",
      garantie: "1 an",
      livraison: "Tout le Maroc",
      image: activeImage,
      inclus: ["Plateau", "Pieds", `${chairCount} chaises`, "Garantie 1 an"],
      source: "FabricatedProductDetailsPage",
      sourcePage: `/produits/${product.id}`,
    };
  }

  const handleBuyClick = () => {
    const orderData = buildOrderData();

    trackAddToCart({
      value: totalPrice,
      productName: product.name,
      productId: product.id,
      quantity,
      category: product.category || "Produit fabriqué",
    });

    trackInitiateCheckout({
      value: totalPrice,
      itemsCount: quantity,
      source: "Produit fabriqué",
    });

    localStorage.setItem("marbre_devis_order", JSON.stringify(orderData));
    navigate("/devis");
  };

  return (
    <main className="fabricated-details-page">

      <section className="luxury-product-layout">
        <div className="luxury-gallery">
          <div className="luxury-main-image" ref={imageRef}>
            <span className="color-count-badge">17 couleurs disponibles</span>
            <img src={activeImage} alt={`${product.name} ${chairColor}`} />
          </div>

          <div className="luxury-color-gallery">
            {chairColors.map((color) => (
              <button
                key={color.id}
                type="button"
                className={
                  selectedChairColor.id === color.id
                    ? "luxury-color-gallery-card active"
                    : "luxury-color-gallery-card"
                }
                onClick={() => selectChairColor(color)}
              >
                <img
                  src={getTableChairImage(color.id)}
                  alt={`${product.name} avec chaises ${color.name}`}
                />
                <span>{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="luxury-product-info">
          <span className="luxury-category">TABLE EN TRAVERTIN</span>

          <h1>{product.name}</h1>

          <div className="luxury-config-box">
            <label>Longueur de la table</label>

            <select
              value={tableLength}
              onChange={(e) => setTableLength(Number(e.target.value))}
            >
              <option value={160}>160×90 cm — Standard</option>
              <option value={170}>170×90 cm</option>
              <option value={180}>180×90 cm</option>
              <option value={190}>190×90 cm</option>
              <option value={200}>200×90 cm</option>
              <option value={210}>210×90 cm</option>
              <option value={220}>220×90 cm</option>
              <option value={230}>230×90 cm</option>
              <option value={240}>240×90 cm</option>
            </select>

            {lengthExtra > 0 && (
              <small>
                Supplément longueur : +{lengthExtra.toLocaleString("fr-FR")} DH
              </small>
            )}
          </div>

          <div className="luxury-config-box">
            <div className="color-title-row">
              <label>Couleur des chaises</label>
              <strong>Couleur choisie : {chairColor}</strong>
            </div>

            <div className="table-chair-color-scroll">
              {chairColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={
                    selectedChairColor.id === color.id
                      ? "table-chair-color-card active"
                      : "table-chair-color-card"
                  }
                  onClick={() => selectChairColor(color)}
                >
                  <img
                    src={getChairSwatchImage(color.id)}
                    alt={`Chaise ${color.name}`}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div> 
                    <div className="luxury-config-box">
            <label>Quantité</label>

            <div className="quantity-control">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>

              <strong>{quantity}</strong>

              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="luxury-price-box">
            <div className="luxury-old-price">
              {originalPrice.toLocaleString("fr-FR")} DH
            </div>

            <div className="luxury-price">
              {totalPrice.toLocaleString("fr-FR")} DH
            </div>

            <span className="luxury-discount">-35%</span>

            <p>Vous économisez {savedAmount.toLocaleString("fr-FR")} DH</p>
          </div>

          <button
            type="button"
            className="luxury-buy-btn"
            onClick={handleBuyClick}
          >
            Commander la table
          </button>

          <div className="luxury-includes">
            <h3>Ce prix comprend</h3>

            <span>✓ Plateau</span>
            <span>✓ Pieds</span>
            <span>✓ 6 chaises</span>
            <span>✓ Garantie 1 an</span>
          </div>
        </div>
      </section>

      <section className="luxury-product-extra">
        <div className="luxury-details-table">
          <h2>Détails du produit</h2>

          <div>
            <span>Mesure</span>
            <strong>
              {tableLength}×{BASE_WIDTH} cm
            </strong>
          </div>

          <div>
            <span>Plateau</span>
            <strong>Marbre Travertin</strong>
          </div>

          <div>
            <span>Chaises</span>
            <strong>6 chaises — couleur {chairColor}</strong>
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
            <span>Garantie</span>
            <strong>1 an</strong>
          </div>
        </div>

        <div className="luxury-care">
          <h2>Conseils d’entretien</h2>

          <details>
            <summary>Nettoyage de la table</summary>
            <p>
              Essuyez la table avec un chiffon microfibre humide et quelques
              gouttes de savon doux.
            </p>
            <p className="luxury-warning">
              À éviter : vinaigre blanc, javel et éponges abrasives.
            </p>
          </details>

          <details>
            <summary>Nettoyage des chaises</summary>
            <p>
              Dépoussiérez avec une brosse douce. En cas de tache, tamponnez
              sans frotter avec un chiffon propre.
            </p>
            <p className="luxury-warning">
              À éviter : brosses dures et frottements énergiques.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}