import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import fabricatedProducts from "../data/fabricatedProducts";

import {
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
} from "../utils/metaPixel";

import "./FabricatedProductDetailsPage.css";

const BASE_SET_PRICE = 9899;
const DEFAULT_MEASURE_KEY = "160x90";
const DEFAULT_CHAIRS = 6;

const TABLE_MEASURES = [
  {
    key: "120x80",
    length: 120,
    width: 80,
    label: "120×80 cm — 4 personnes",
    tableOnlyPrice: 3699,
    recommendedChairs: 4,
  },
  {
    key: "160x90",
    length: 160,
    width: 90,
    label: "160×90 cm — Standard — 6 personnes",
    tableOnlyPrice: 4799,
    recommendedChairs: 6,
  },
  {
    key: "200x100",
    length: 200,
    width: 100,
    label: "200×100 cm — 8 personnes",
    tableOnlyPrice: 6999,
    recommendedChairs: 8,
  },
  {
    key: "240x120",
    length: 240,
    width: 120,
    label: "240×120 cm — 10 personnes",
    tableOnlyPrice: 9988,
    recommendedChairs: 10,
  },
];

const DEFAULT_MEASURE =
  TABLE_MEASURES.find((measure) => measure.key === DEFAULT_MEASURE_KEY) ||
  TABLE_MEASURES[0];

const CHAIR_UNIT_PRICE =
  (BASE_SET_PRICE - DEFAULT_MEASURE.tableOnlyPrice) / DEFAULT_CHAIRS;

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

  const [selectedMeasureKey, setSelectedMeasureKey] = useState(DEFAULT_MEASURE_KEY);
  const [chairCount, setChairCount] = useState(DEFAULT_CHAIRS);
  const [quantity, setQuantity] = useState(1);

  const chairColor = selectedChairColor.name;

  const selectedMeasure =
    TABLE_MEASURES.find((measure) => measure.key === selectedMeasureKey) ||
    DEFAULT_MEASURE;

  const currentUnitPrice = useMemo(() => {
    const chairsPrice = chairCount * CHAIR_UNIT_PRICE;
    return Math.round(selectedMeasure.tableOnlyPrice + chairsPrice);
  }, [selectedMeasure.tableOnlyPrice, chairCount]);

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



  function handleMeasureChange(measureKey) {
    const nextMeasure =
      TABLE_MEASURES.find((measure) => measure.key === measureKey) ||
      DEFAULT_MEASURE;

    setSelectedMeasureKey(nextMeasure.key);
    setChairCount(nextMeasure.recommendedChairs);
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
      mesure: `${selectedMeasure.length}×${selectedMeasure.width} cm`,
      mesureLabel: selectedMeasure.label,
      longueur: `${selectedMeasure.length} cm`,
      largeur: `${selectedMeasure.width} cm`,
      plateau: "Marbre Travertin",
      pieds: "Marbre Travertin",
      chaises: chairCount,
      chairCount,
      recommendedChairs: selectedMeasure.recommendedChairs,
      tableOnlyPrice: selectedMeasure.tableOnlyPrice,
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
            <label>Mesure de la table</label>

            <select
              value={selectedMeasureKey}
              onChange={(e) => handleMeasureChange(e.target.value)}
            >
              {TABLE_MEASURES.map((measure) => (
                <option key={measure.key} value={measure.key}>
                  {measure.label}
                </option>
              ))}
            </select>
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
            <label>Nombre de chaises</label>

            <div className="quantity-control">
              <button
                type="button"
                onClick={() => setChairCount((prev) => Math.max(0, prev - 1))}
              >
                -
              </button>

              <strong>{chairCount}</strong>

              <button
                type="button"
                onClick={() => setChairCount((prev) => prev + 1)}
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
            <span>✓ {chairCount} chaises</span>
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
              {selectedMeasure.length}×{selectedMeasure.width} cm
            </strong>
          </div>

          <div>
            <span>Plateau</span>
            <strong>Marbre Travertin</strong>
          </div>

          <div>
            <span>Chaises</span>
            <strong>{chairCount} chaises — couleur {chairColor}</strong>
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