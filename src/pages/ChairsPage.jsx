import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ChairsPage.css";

import {
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
} from "../utils/metaPixel";

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

const chairModels = [
  { id: "andromeda", name: "Andromeda", price: 989 },
  { id: "sombrero", name: "Sombrero", price: 1690 },
  { id: "sunflower", name: "Sunflower", price: 850 },
  { id: "black-eye", name: "Black Eye", price: 890 },
  { id: "triangulum", name: "Triangulum", price: 950 },
];

const reviews = [
  {
    name: "سلمى من الرباط",
    text: "التوصيل كان ممتازًا والكرسي وصل في حالة جيدة جدًا.",
  },
  {
    name: "أمين من الدار البيضاء",
    text: "جودة الكرسي أفضل من المتوقع والتصميم أنيق جدًا.",
  },
  {
    name: "نادية من تمارة",
    text: "الثوب جميل ومريح ويظهر بجودة عالية.",
  },
];

function getChairColorImage(chairId, colorId) {
  return `/images/chairs/${chairId}/${chairId}-${colorId}.png`;
}

function getChairMainImage(chairId) {
  return `/images/chairs/${chairId}/${chairId}-6.png`;
}

function getGalleryImages(chairId) {
  return [
    `/images/chairs/${chairId}/gallery/1.jpeg`,
    `/images/chairs/${chairId}/gallery/2.jpeg`,
    `/images/chairs/${chairId}/gallery/3.jpeg`,
    `/images/chairs/${chairId}/gallery/4.jpeg`,
  ];
}

export default function ChairsPage() {
  const { chairId } = useParams();
  const navigate = useNavigate();

  const selectedChair =
    chairModels.find((chair) => chair.id === chairId) || chairModels[0];

  const hasColorImages = selectedChair.id === "andromeda";
  const galleryImages = getGalleryImages(selectedChair.id);

  const [selectedColor, setSelectedColor] = useState(chairColors[5]);
  const [quantity, setQuantity] = useState(1);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [mainImage, setMainImage] = useState(
    getChairMainImage(selectedChair.id)
  );

  const total = useMemo(
    () => selectedChair.price * quantity,
    [selectedChair.price, quantity]
  );

  useEffect(() => {
    setSelectedColor(chairColors[5]);
    setGalleryIndex(0);
    setMainImage(getChairMainImage(selectedChair.id));

    trackViewContent({
      productName: `Chaise ${selectedChair.name}`,
      productId: selectedChair.id,
      category: "Chaise",
      value: selectedChair.price,
    });
  }, [selectedChair.id, selectedChair.name, selectedChair.price]);

  function selectColor(color) {
    if (!hasColorImages) return;

    setSelectedColor(color);
    setGalleryIndex(0);
    setMainImage(getChairColorImage(selectedChair.id, color.id));
  }

  function selectGalleryImage(image, index) {
    setGalleryIndex(index);
    setMainImage(image);
  }

  function selectModel(chair) {
    navigate(`/chaises/${chair.id}`);
  }

  function handleBuy() {
    const order = {
      orderType: "chair",
      category: "Chaise",
      productId: selectedChair.id,
      productName: `Chaise ${selectedChair.name}`,
      color: hasColorImages ? selectedColor.name : "À confirmer sur WhatsApp",
      colorId: hasColorImages ? selectedColor.id : null,
      quantity,
      unitPrice: selectedChair.price,
      total,
      image: mainImage,
      sourcePage: `/chaises/${selectedChair.id}`,
    };

    trackAddToCart({
      value: total,
      productName: `Chaise ${selectedChair.name}`,
      productId: selectedChair.id,
      quantity,
      category: "Chaise",
    });

    trackInitiateCheckout({
      value: total,
      itemsCount: quantity,
      source: "Chaise",
    });

    localStorage.setItem("marbre_devis_order", JSON.stringify(order));
    navigate("/devis");
  }

  return (
    <main className="chairs-page">
      <nav className="breadcrumb">
        <span onClick={() => navigate("/")}>Accueil</span>
        <span className="separator">›</span>
        <span onClick={() => navigate("/chaises")}>Chaises</span>
        <span className="separator">›</span>
        <strong>{selectedChair.name}</strong>
      </nav>

      <section className="chairs-hero">
        <h1>Chaise {selectedChair.name}</h1>
        <p>
          Personnalisez votre chaise selon le tissu, la couleur et la quantité.
        </p>
      </section>

      <section className="chairs-config">
        <div className="chair-preview">
          <div className="chair-stage">
            <img src={mainImage} alt={selectedChair.name} />

            {hasColorImages && (
              <span className="fabric-badge">{selectedColor.name}</span>
            )}
          </div>

          <div className="gallery-dots">
            {galleryImages.map((image, index) => (
              <button
                key={image}
                type="button"
                className={galleryIndex === index ? "active" : ""}
                onClick={() => selectGalleryImage(image, index)}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </div>

          {hasColorImages ? (
            <div className="image-selector-block">
              <h3>Choisissez votre couleur</h3>

              <div className="color-image-grid">
                {chairColors.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => selectColor(color)}
                    className={
                      selectedColor.id === color.id
                        ? "color-image-card active"
                        : "color-image-card"
                    }
                  >
                    <img
                      src={getChairColorImage(selectedChair.id, color.id)}
                      alt={`${selectedChair.name} ${color.name}`}
                    />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="image-selector-block">
              <div className="temporary-color-box">
                <h3>Couleur du tissu</h3>
                <p>
                  Disponible en plusieurs couleurs sur commande.
                  <br />
                  Notre équipe confirmera avec vous la couleur souhaitée sur
                  WhatsApp.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="chair-panel">
          <div className="quantity-box">
            <span>Quantité</span>

            <div>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                -
              </button>

              <strong>{quantity}</strong>

              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <div className="total-card">
            <p>Prix unitaire : {selectedChair.price} DH</p>
            <h3>Total : {total.toLocaleString("fr-FR")} DH</h3>
          </div>

          <button className="main-cta" onClick={handleBuy}>
            Acheter
          </button>

          <p className="chair-description">
            Chaise design en bouclette texturée résistante aux taches avec
            structure en métal noir.
          </p>
        </div>
      </section>

      <section className="similar-models">
        <h2>Autres modèles de chaises</h2>

        <div className="models-grid">
          {chairModels
            .filter((chair) => chair.id !== selectedChair.id)
            .map((chair) => (
              <button key={chair.id} onClick={() => selectModel(chair)}>
                <img src={getChairMainImage(chair.id)} alt={chair.name} />
                <strong>{chair.name}</strong>
                <span>{chair.price} DH</span>
              </button>
            ))}
        </div>
      </section>

      <section className="reviews-section">
        <h2>Avis clients</h2>

        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.name} className="review-card">
              <div className="stars">★★★★★</div>
              <p>{review.text}</p>
              <strong>{review.name}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}