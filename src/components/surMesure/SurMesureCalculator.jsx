import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  trackAddToCart,
  trackBeginSurMesureQuote,
  trackInitiateCheckout,
} from "../../utils/analytics";

const createPiece = (id) => ({
  id,
  length: "",
  width: "",
  quantity: 1,
});

const toNumber = (value) => {
  return Number(String(value).replace(",", ".")) || 0;
};

export default function SurMesureCalculator({ marble }) {
  const navigate = useNavigate();
  const hasTrackedBeginQuote = useRef(false);

  const [pieces, setPieces] = useState([createPiece(1)]);

  const updatePiece = (id, field, value) => {
    if (!hasTrackedBeginQuote.current && value) {
      hasTrackedBeginQuote.current = true;

      trackBeginSurMesureQuote({
        marbleName: marble.name,
        value: marble.price_per_m2,
      });
    }

    setPieces((currentPieces) =>
      currentPieces.map((piece) =>
        piece.id === id ? { ...piece, [field]: value } : piece
      )
    );
  };

  const addPiece = () => {
    setPieces((currentPieces) => [...currentPieces, createPiece(Date.now())]);
  };

  const removePiece = (id) => {
    setPieces((currentPieces) =>
      currentPieces.length === 1
        ? currentPieces
        : currentPieces.filter((piece) => piece.id !== id)
    );
  };

  const calculations = useMemo(() => {
    const detailedPieces = pieces.map((piece, index) => {
      const length = toNumber(piece.length);
      const width = toNumber(piece.width);
      const quantity = Math.max(1, toNumber(piece.quantity));

      const unitSurface = (length * width) / 10000;
      const totalSurface = unitSurface * quantity;
      const totalPrice = totalSurface * marble.price_per_m2;

      return {
        ...piece,
        index: index + 1,
        length,
        width,
        quantity,
        unitSurface,
        totalSurface,
        totalPrice,
      };
    });

    const totalSurface = detailedPieces.reduce(
      (sum, piece) => sum + piece.totalSurface,
      0
    );

    const totalPrice = detailedPieces.reduce(
      (sum, piece) => sum + piece.totalPrice,
      0
    );

    const totalQuantity = detailedPieces.reduce(
      (sum, piece) => sum + piece.quantity,
      0
    );

    return {
      detailedPieces,
      totalSurface,
      totalPrice,
      totalQuantity,
    };
  }, [pieces, marble.price_per_m2]);

  const confirmDevis = () => {
    const order = {
      mode: "sur_mesure",
      productType: "Marbre sur mesure",
      productId: marble.id,
      productSlug: marble.slug,
      productName: marble.name,
      category: marble.category,
      pricePerM2: marble.price_per_m2,
      pieces: calculations.detailedPieces.map((piece) => ({
        index: piece.index,
        length: piece.length,
        width: piece.width,
        quantity: piece.quantity,
        unitSurface: Number(piece.unitSurface.toFixed(2)),
        totalSurface: Number(piece.totalSurface.toFixed(2)),
        totalPrice: Math.round(piece.totalPrice),
      })),
      totalQuantity: calculations.totalQuantity,
      totalSurface: Number(calculations.totalSurface.toFixed(2)),
      totalPrice: Math.round(calculations.totalPrice),
    };

    trackAddToCart({
      value: order.totalPrice,
      productName: marble.name,
      productId: marble.id,
      quantity: order.totalQuantity,
      category: "sur_mesure",
    });

    trackInitiateCheckout({
      value: order.totalPrice,
      itemsCount: order.totalQuantity,
      source: "sur_mesure",
    });

    localStorage.setItem("marbre_devis_order", JSON.stringify(order));
    navigate("/devis");
  };

  return (
    <section className="surmesure-calculator">
      <div className="surmesure-calculator-header">
        <div>
          <h2>Configurez vos mesures</h2>
          <p>Indiquez la longueur, la largeur et la quantité souhaitée.</p>
        </div>

        <span>{marble.name}</span>
      </div>

      <div className="surmesure-calculator-layout">
        <div className="surmesure-pieces-list">
          {calculations.detailedPieces.map((piece) => (
            <div key={piece.id} className="surmesure-piece-card">
              <div className="surmesure-piece-card-header">
                <h3>Pièce {piece.index}</h3>

                {pieces.length > 1 && (
                  <button type="button" onClick={() => removePiece(piece.id)}>
                    Supprimer
                  </button>
                )}
              </div>

              <div className="surmesure-piece-fields">
                <label>
                  Longueur (cm)
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex: 220"
                    value={
                      pieces.find((item) => item.id === piece.id)?.length || ""
                    }
                    onChange={(event) =>
                      updatePiece(piece.id, "length", event.target.value)
                    }
                  />
                </label>

                <label>
                  Largeur (cm)
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex: 65"
                    value={
                      pieces.find((item) => item.id === piece.id)?.width || ""
                    }
                    onChange={(event) =>
                      updatePiece(piece.id, "width", event.target.value)
                    }
                  />
                </label>

                <label>
                  Quantité
                  <input
                    type="number"
                    min="1"
                    placeholder="Ex: 1"
                    value={
                      pieces.find((item) => item.id === piece.id)?.quantity || 1
                    }
                    onChange={(event) =>
                      updatePiece(piece.id, "quantity", event.target.value)
                    }
                  />
                </label>
              </div>

              <button
                type="button"
                className="surmesure-add-piece-button"
                onClick={addPiece}
              >
                + Ajouter une autre pièce
              </button>
            </div>
          ))}
        </div>

        <aside className="surmesure-summary-card">
          <h3>Récapitulatif</h3>

          <div className="surmesure-summary-line">
            <span>Marbre</span>
            <strong>{marble.name}</strong>
          </div>

          <div className="surmesure-summary-line">
            <span>Prix / m²</span>
            <strong>{marble.price_per_m2.toLocaleString("fr-FR")} DH</strong>
          </div>

          <div className="surmesure-summary-line">
            <span>Nombre de pièces</span>
            <strong>{calculations.totalQuantity}</strong>
          </div>

          <div className="surmesure-summary-line">
            <span>Surface totale</span>
            <strong>{calculations.totalSurface.toFixed(2)} m²</strong>
          </div>

          <div className="surmesure-summary-total">
            <span>Total estimatif</span>
            <strong>
              {calculations.totalPrice.toLocaleString("fr-FR", {
                maximumFractionDigits: 0,
              })}{" "}
              DH
            </strong>
          </div>

          <button
            type="button"
            className="surmesure-request-button"
            onClick={confirmDevis}
          >
            Confirmer le devis
          </button>
        </aside>
      </div>
    </section>
  );
}