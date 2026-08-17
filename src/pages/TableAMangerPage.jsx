import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
} from "../utils/metaPixel";

import "./TableAMangerPage.css";

/* =========================================================
   PRODUCT
========================================================= */

const PRODUCT = {
  id: "table-a-manger",
  name: "Table à manger",
  category: "PRODUIT SUR MESURE",
  unit: "DH",
};

/* =========================================================
   SETTINGS
========================================================= */

const DEFAULT_MEASURE_KEY = "160x90";
const DEFAULT_CHAIRS = 6;
const EXTRA_CHAIR_PRICE = 850;

/*
  مهم:
  تأكد أن أسماء الصور داخل public/images/table-a-manger/
  مطابقة تمامًا لهذه الأسماء.
*/

const TABLE_MEASURES = [
  {
    key: "120x80",
    length: 120,
    width: 80,
    persons: 4,
    recommendedChairs: 4,
    basePrice: 5999,
    label: "120×80 cm — 4 personnes",
    image: "/images/table-a-manger/table-120x80-4-chaises.png",
  },
  {
    key: "160x90",
    length: 160,
    width: 90,
    persons: 6,
    recommendedChairs: 6,
    basePrice: 7999,
    label: "160×90 cm — Standard — 6 personnes",
    image: "/images/table-a-manger/table-160x90-6-chaises.png",
  },
  {
    key: "200x100",
    length: 200,
    width: 100,
    persons: 8,
    recommendedChairs: 8,
    basePrice: 11999,
    label: "200×100 cm — 8 personnes",
    image: "/images/table-a-manger/table-200x100-8-chaises.png",
  },
  {
    key: "240x120",
    length: 240,
    width: 120,
    persons: 10,
    recommendedChairs: 10,
    basePrice: 15988,
    label: "240×120 cm — 10 personnes",
    image: "/images/table-a-manger/table-240x120-10-chaises.png",
  },
];

const DEFAULT_MEASURE =
  TABLE_MEASURES.find(
    (measure) => measure.key === DEFAULT_MEASURE_KEY
  ) || TABLE_MEASURES[0];

/* =========================================================
   CHAIR COLORS
========================================================= */

const CHAIR_COLORS = [
  {
    id: 1,
    name: "Noir",
    slug: "noir",
  },
  {
    id: 2,
    name: "Blanc",
    slug: "blanc",
  },
  {
    id: 3,
    name: "Blanc cassé",
    slug: "blanc-casse",
  },
  {
    id: 4,
    name: "Crème",
    slug: "creme",
  },
  {
    id: 5,
    name: "Ivoire",
    slug: "ivoire",
  },
  {
    id: 6,
    name: "Beige",
    slug: "beige",
  },
  {
    id: 7,
    name: "Taupe",
    slug: "taupe",
  },
  {
    id: 8,
    name: "Rose poudré",
    slug: "rose-poudre",
  },
  {
    id: 9,
    name: "Marron",
    slug: "marron",
  },
  {
    id: 10,
    name: "Camel",
    slug: "camel",
  },
  {
    id: 11,
    name: "Moutarde",
    slug: "moutarde",
  },
  {
    id: 12,
    name: "Vert olive",
    slug: "vert-olive",
  },
  {
    id: 13,
    name: "Vert foncé",
    slug: "vert-fonce",
  },
  {
    id: 14,
    name: "Bleu gris",
    slug: "bleu-gris",
  },
  {
    id: 15,
    name: "Gris clair",
    slug: "gris-clair",
  },
  {
    id: 16,
    name: "Gris foncé",
    slug: "gris-fonce",
  },
  {
    id: 17,
    name: "Terracotta",
    slug: "terracotta",
  },
];

function getChairImage(slug) {
  return `/images/table-a-manger/chaises/chaise-${slug}.png`;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TableAMangerPage() {
  const navigate = useNavigate();
  const imageRef = useRef(null);

  const defaultColor =
    CHAIR_COLORS.find((color) => color.name === "Crème") ||
    CHAIR_COLORS[0];

  const [selectedMeasureKey, setSelectedMeasureKey] =
    useState(DEFAULT_MEASURE_KEY);

  const [chairCount, setChairCount] =
    useState(DEFAULT_CHAIRS);

  const [selectedChairColor, setSelectedChairColor] =
    useState(defaultColor);

  /* =========================================================
     CURRENT MEASURE
  ========================================================= */

  const selectedMeasure =
    TABLE_MEASURES.find(
      (measure) => measure.key === selectedMeasureKey
    ) || DEFAULT_MEASURE;

  /*
    الصورة الرئيسية مرتبطة بالقياس فقط.

    تغيير لون الكرسي لن يغير هذه الصورة.
  */

  const activeImage = selectedMeasure.image;

  const chairColor = selectedChairColor.name;

  /* =========================================================
     PRICE
  ========================================================= */

  const currentPrice = useMemo(() => {
    const chairDifference =
      chairCount - selectedMeasure.recommendedChairs;

    return Math.max(
      0,
      selectedMeasure.basePrice +
        chairDifference * EXTRA_CHAIR_PRICE
    );
  }, [
    chairCount,
    selectedMeasure.basePrice,
    selectedMeasure.recommendedChairs,
  ]);

  /*
    خصم 40%
    currentPrice = 60% من السعر الأصلي
  */

  const originalPrice = Math.round(currentPrice / 0.6);

  const savedAmount = originalPrice - currentPrice;

  /* =========================================================
     META VIEW CONTENT
  ========================================================= */

  useEffect(() => {
    trackViewContent({
      productName: PRODUCT.name,
      productId: PRODUCT.id,
      category: PRODUCT.category,
      value: selectedMeasure.basePrice,
    });
  }, []);

  /* =========================================================
     MOBILE SCROLL
  ========================================================= */

  function scrollToMainImageOnMobile() {
    if (window.innerWidth <= 720) {
      imageRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  /* =========================================================
     MEASURE
  ========================================================= */

  function handleMeasureChange(measureKey) {
    const nextMeasure =
      TABLE_MEASURES.find(
        (measure) => measure.key === measureKey
      ) || DEFAULT_MEASURE;

    setSelectedMeasureKey(nextMeasure.key);

    /*
      عند تغيير القياس:
      120 → 4
      160 → 6
      200 → 8
      240 → 10
    */

    setChairCount(nextMeasure.recommendedChairs);

    /*
      بما أن activeImage مأخوذة من selectedMeasure
      فالصورة ستتغير تلقائيًا.
    */

    setTimeout(() => {
      scrollToMainImageOnMobile();
    }, 50);
  }

  /* =========================================================
     COLOR
  ========================================================= */

  function selectChairColor(color) {
    /*
      نغير اللون فقط.

      لا نغير صورة الطاولة الرئيسية.
    */

    setSelectedChairColor(color);
  }

  /* =========================================================
     CHAIRS
  ========================================================= */

  function removeChair() {
    setChairCount((prev) => Math.max(0, prev - 1));
  }

  function addChair() {
    setChairCount((prev) => prev + 1);
  }

  /* =========================================================
     ORDER DATA
  ========================================================= */

  function buildOrderData() {
    return {
      orderType: "table-a-manger",

      mode: "Projet sur mesure",

      product_type: "Table à manger",

      productId: PRODUCT.id,
      product_id: PRODUCT.id,

      productName: PRODUCT.name,
      product_name: PRODUCT.name,

      productCategory: PRODUCT.category,
      product_category: PRODUCT.category,

      price: currentPrice,
      total: currentPrice,
      total_price: currentPrice,

      unitPrice: currentPrice,
      unit_price: currentPrice,

      originalPrice,
      original_price: originalPrice,

      discount: "40%",

      unit: PRODUCT.unit,

      quantity: 1,

      mesure:
        `${selectedMeasure.length}×${selectedMeasure.width} cm`,

      mesureLabel: selectedMeasure.label,

      longueur:
        `${selectedMeasure.length} cm`,

      largeur:
        `${selectedMeasure.width} cm`,

      plateau: "Marbre",

      pieds: "Bois",

      chaises: chairCount,
      chairCount,

      recommendedChairs:
        selectedMeasure.recommendedChairs,

      basePrice:
        selectedMeasure.basePrice,

      extraChairPrice:
        EXTRA_CHAIR_PRICE,

      color: chairColor,

      couleur_chaises: chairColor,

      couleur_chaises_id:
        selectedChairColor.id,

      tissu: "Tissu anti-tache",

      garantie: "1 an",

      livraison: "Tout le Maroc",

      image: activeImage,

      inclus: [
        "Plateau en marbre",
        "Pieds en bois",
        `${chairCount} chaises`,
        "Garantie 1 an",
      ],

      source: "TableAMangerPage",

      sourcePage: "/table-a-manger",
    };
  }

  /* =========================================================
     BUY
  ========================================================= */

  function handleBuyClick() {
    const orderData = buildOrderData();

    trackAddToCart({
      value: currentPrice,
      productName: PRODUCT.name,
      productId: PRODUCT.id,
      quantity: 1,
      category: PRODUCT.category,
    });

    trackInitiateCheckout({
      value: currentPrice,
      itemsCount: 1,
      source: "Table à manger",
    });

    localStorage.setItem(
      "marbre_devis_order",
      JSON.stringify(orderData)
    );

    navigate("/devis");
  }

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <main className="table-a-manger-page">

      <section className="luxury-product-layout">

        {/* =====================================================
            LEFT — TABLE IMAGE
        ===================================================== */}

        <div className="luxury-gallery">

          <div
            className="luxury-main-image"
            ref={imageRef}
          >
            <span className="color-count-badge">
              17 couleurs disponibles
            </span>

            <img
              src={activeImage}
              alt={`${PRODUCT.name} ${selectedMeasure.label}`}
            />
          </div>

          {/*
            مهم:

            لا يوجد Gallery لصور الطاولة تحت الصورة.

            الصورة الرئيسية تتغير فقط حسب القياس.
          */}

        </div>

        {/* =====================================================
            RIGHT — CONFIGURATOR
        ===================================================== */}

        <div className="luxury-product-info">

          <h1>Table à manger</h1>

          {/* MEASURE */}

          <div className="luxury-config-box">

            <label>
              Mesure de la table
            </label>

            <select
              value={selectedMeasureKey}
              onChange={(e) =>
                handleMeasureChange(e.target.value)
              }
            >
              {TABLE_MEASURES.map((measure) => (
                <option
                  key={measure.key}
                  value={measure.key}
                >
                  {measure.label}
                </option>
              ))}
            </select>

          </div>

          {/* CHAIR COLORS */}

          <div className="luxury-config-box">

            <div className="color-title-row">

              <label>
                Couleur des chaises
              </label>

              <strong>
                Couleur choisie : {chairColor}
              </strong>

            </div>

            <div className="table-chair-color-scroll">

              {CHAIR_COLORS.map((color) => (

                <button
                  key={color.id}
                  type="button"
                  className={
                    selectedChairColor.id === color.id
                      ? "table-chair-color-card active"
                      : "table-chair-color-card"
                  }
                  onClick={() =>
                    selectChairColor(color)
                  }
                >

                  <img
                    src={getChairImage(color.slug)}
                    alt={`Chaise ${color.name}`}
                  />

                  <span>
                    {color.name}
                  </span>

                </button>

              ))}

            </div>

          </div>

          {/* NUMBER OF CHAIRS */}

          <div className="luxury-config-box">

            <label>
              Nombre de chaises
            </label>

            <div className="quantity-control">

              <button
                type="button"
                onClick={removeChair}
                aria-label="Retirer une chaise"
              >
                -
              </button>

              <strong>
                {chairCount}
              </strong>

              <button
                type="button"
                onClick={addChair}
                aria-label="Ajouter une chaise"
              >
                +
              </button>

            </div>

          </div>

          {/* PRICE */}

          <div className="luxury-price-box">

            <div className="luxury-old-price">
              {originalPrice.toLocaleString("fr-FR")} DH
            </div>

            <div className="luxury-price">
              {currentPrice.toLocaleString("fr-FR")} DH
            </div>

            <span className="luxury-discount">
              -40%
            </span>

            <p>
              Vous économisez{" "}
              {savedAmount.toLocaleString("fr-FR")} DH
            </p>

          </div>

          {/* BUY */}

          <button
            type="button"
            className="luxury-buy-btn"
            onClick={handleBuyClick}
          >
            Commander la table
          </button>

          {/* INCLUDES */}

          <div className="luxury-includes">

            <h3>
              Ce prix comprend
            </h3>

            <span>
              ✓ Plateau en marbre
            </span>

            <span>
              ✓ Pieds en bois
            </span>

            <span>
              ✓ {chairCount} chaises
            </span>

            <span>
              ✓ Garantie 1 an
            </span>

          </div>

        </div>

      </section>

      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}

      <section className="luxury-product-extra">

        <div className="luxury-details-table">

          <h2>
            Détails du produit
          </h2>

          <div>

            <span>
              Mesure
            </span>

            <strong>
              {selectedMeasure.length}
              ×
              {selectedMeasure.width}
              {" "}
              cm
            </strong>

          </div>

          <div>

            <span>
              Plateau
            </span>

            <strong>
              Marbre
            </strong>

          </div>

          <div>

            <span>
              Chaises
            </span>

            <strong>
              {chairCount} chaises — couleur {chairColor}
            </strong>

          </div>

          <div>

            <span>
              Tissu
            </span>

            <strong>
              Tissu anti-tache
            </strong>

          </div>

          <div>

            <span>
              Pieds
            </span>

            <strong>
              Bois
            </strong>

          </div>

          <div>

            <span>
              Garantie
            </span>

            <strong>
              1 an
            </strong>

          </div>

        </div>

        {/* =====================================================
            CARE
        ===================================================== */}

        <div className="luxury-care">

          <h2>
            Conseils d’entretien
          </h2>

          <details>

            <summary>
              Nettoyage de la table
            </summary>

            <p>
              Essuyez la table avec un chiffon
              microfibre humide et quelques gouttes
              de savon doux.
            </p>

            <p className="luxury-warning">
              À éviter : vinaigre blanc, javel
              et éponges abrasives.
            </p>

          </details>

          <details>

            <summary>
              Nettoyage des chaises
            </summary>

            <p>
              Dépoussiérez avec une brosse douce.
              En cas de tache, tamponnez avec un
              chiffon propre sans frotter.
            </p>

            <p className="luxury-warning">
              À éviter : brosses dures et
              frottements énergiques.
            </p>

          </details>

        </div>

      </section>

    </main>
  );
}