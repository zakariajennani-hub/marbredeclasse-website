import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  trackAddToCart,
  trackInitiateCheckout,
} from "../utils/metaPixel";

import deliveryZones from "../floor/deliveryZones";
import floorServicesData from "../floor/floorServicesData";

import "./StandardFloorCalculator.css";

export default function StandardFloorCalculator({ product }) {
  const navigate = useNavigate();

  const LOSS_MARGIN = 8;
  const SECURITY_MARGIN = 4;

  const finishes = product.finishes || [];
  const rowsRef = useRef(null);

  const summarySurfaceRef = useRef(null);
  const summaryRecommendedSurfaceRef = useRef(null);
  const summaryPiecesRef = useRef(null);
  const summaryLinearRef = useRef(null);
  const summaryMaterialRef = useRef(null);
  const summaryServicesRef = useRef(null);
  const summaryTotalRef = useRef(null);

  const deliveryRef = useRef(null);
  const cityRef = useRef(null);
  const deliveryPriceRef = useRef(null);

  const handlingRef = useRef(null);
  const handlingPriceRef = useRef(null);

  const poseRef = useRef(null);
  const poseTypeRef = useRef(null);
  const poseOptionsRef = useRef(null);
  const poseSurfaceRef = useRef(null);
  const posePriceRef = useRef(null);

  const getDefaultFinish = () => finishes[0]?.name || "";

  const getFormatsByFinish = (finishName) =>
    finishes.find((finish) => finish.name === finishName)?.formats || [];

  const getFormatDimensions = (formatSize) => {
    if (!formatSize) return { width: 0, height: 0 };

    const [w, h] = formatSize
      .replace("×", "x")
      .split("x")
      .map((v) => Number(v.trim()));

    return { width: w || 0, height: h || 0 };
  };

  const getFormatSurface = (formatSize) => {
    const { width, height } = getFormatDimensions(formatSize);
    if (!width || !height) return 0;
    return (width / 100) * (height / 100);
  };

  const getFormatLinearMeter = (formatSize) => {
    const { width, height } = getFormatDimensions(formatSize);
    if (!width || !height) return 0;
    return 2 * (width / 100 + height / 100);
  };

  const getFormatPrice = (finishName, formatSize) => {
    const selectedFormat = getFormatsByFinish(finishName).find(
      (format) => format.size === formatSize
    );

    return Number(selectedFormat?.pricePerM2 || 0);
  };

  const getSelectedCity = () => {
    const cityId = cityRef.current?.value || "rabat";
    return deliveryZones.find((zone) => zone.id === cityId) || deliveryZones[0];
  };

  const formatMoney = (value) => {
    return Math.round(value).toLocaleString() + " MAD";
  };

  const createFormatOptions = (finishName) => {
    return getFormatsByFinish(finishName)
      .map(
        (format) =>
          `<option value="${format.size}">${format.size} — ${format.pricePerM2} MAD / m²</option>`
      )
      .join("");
  };

  const updateFormatOptions = (row) => {
    const finishSelect = row.querySelector(".finish-select");
    const formatSelect = row.querySelector(".format-select");

    if (!finishSelect || !formatSelect) return;

    formatSelect.innerHTML = createFormatOptions(finishSelect.value);
  };

  const togglePoseOptions = () => {
    if (!poseOptionsRef.current || !poseRef.current) return;

    poseOptionsRef.current.style.display = poseRef.current.checked
      ? "block"
      : "none";
  };

  const getCurrentOrder = () => {
    const rowElements =
      rowsRef.current?.querySelectorAll(".floor-line-card") || [];

    let totalClientSurface = 0;
    let totalRecommendedSurface = 0;
    let totalPieces = 0;
    let totalLinearMeters = 0;
    let materialTotal = 0;
    let totalPoseSurface = 0;

    const lines = Array.from(rowElements).map((row) => {
      const finishSelect = row.querySelector(".finish-select");
      const formatSelect = row.querySelector(".format-select");
      const surfaceInput = row.querySelector(".surface-input");
      const lossMarginInput = row.querySelector(".loss-margin-input");
      const securityMarginInput = row.querySelector(".security-margin-input");
      const linePoseInput = row.querySelector(".line-pose-input");

      const finish = finishSelect?.value || getDefaultFinish();
      const format = formatSelect?.value || "";
      const clientSurface = Number(surfaceInput?.value) || 0;

      const lossEnabled = !!lossMarginInput?.checked;
      const securityEnabled = !!securityMarginInput?.checked;
      const linePoseEnabled = !!linePoseInput?.checked;

      const lossMargin = lossEnabled ? LOSS_MARGIN : 0;
      const securityMargin = securityEnabled ? SECURITY_MARGIN : 0;

      const pieceSurface = getFormatSurface(format);
      const pieceLinearMeter = getFormatLinearMeter(format);
      const pricePerM2 = getFormatPrice(finish, format);

      const lossSurface = clientSurface * (lossMargin / 100);
      const securitySurface = clientSurface * (securityMargin / 100);
      const recommendedSurface = clientSurface + lossSurface + securitySurface;

      const piecesNeeded =
        pieceSurface > 0 ? Math.ceil(recommendedSurface / pieceSurface) : 0;

      const rowLinearMeters = piecesNeeded * pieceLinearMeter;
      const rowPrice = recommendedSurface * pricePerM2;

      const linePoseSurface = linePoseEnabled ? clientSurface : 0;

      totalClientSurface += clientSurface;
      totalRecommendedSurface += recommendedSurface;
      totalPieces += piecesNeeded;
      totalLinearMeters += rowLinearMeters;
      materialTotal += rowPrice;
      totalPoseSurface += linePoseSurface;

      return {
        finish,
        format,
        clientSurface,
        lossEnabled,
        securityEnabled,
        lossMargin,
        securityMargin,
        lossSurface,
        securitySurface,
        recommendedSurface,
        pieceSurface,
        pieceLinearMeter,
        piecesNeeded,
        rowLinearMeters,
        pricePerM2,
        rowPrice,
        linePoseEnabled,
        linePoseSurface,
      };
    });

    const selectedCity = getSelectedCity();

    const deliveryEnabled = !!deliveryRef.current?.checked;
    const deliveryPrice = deliveryEnabled ? Number(selectedCity.price || 0) : 0;

    const handlingEnabled = !!handlingRef.current?.checked;
    const handlingPrice = handlingEnabled
      ? totalRecommendedSurface * floorServicesData.handling.pricePerM2
      : 0;

    const poseEnabled = !!poseRef.current?.checked;
    const poseType = poseTypeRef.current?.value || "pose_marbre";

    const posePricePerM2 =
      poseType === "pose_complete"
        ? floorServicesData.pose.complete.pricePerM2
        : floorServicesData.pose.marbre.pricePerM2;

    const poseSurface = poseEnabled ? totalPoseSurface : 0;
    const posePrice = poseEnabled ? poseSurface * posePricePerM2 : 0;

    const servicesTotal = deliveryPrice + handlingPrice + posePrice;
    const finalTotal = materialTotal + servicesTotal;

    return {
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        categoryLabel: product.categoryLabel,
        origin: product.origin,
        price: product.price,
      },
      mode: "Sol / formats standards",
      lines,
      services: {
        delivery: deliveryEnabled,
        city: selectedCity.label,
        deliveryPrice,

        handling: handlingEnabled,
        handlingUnit: floorServicesData.handling.unit,
        handlingPricePerM2: floorServicesData.handling.pricePerM2,
        handlingPrice,

        pose: poseEnabled,
        poseType,
        poseSurface,
        posePricePerM2,
        posePrice,
      },
      totals: {
        totalClientSurface,
        totalRecommendedSurface,
        totalPieces,
        totalLinearMeters,
        materialTotal,
        servicesTotal,
        finalTotal,
      },
    };
  };

  const calculateAll = () => {
    const order = getCurrentOrder();

    const rowElements =
      rowsRef.current?.querySelectorAll(".floor-line-card") || [];

    Array.from(rowElements).forEach((row, index) => {
      const recommendedSurfaceOutput = row.querySelector(
        ".recommended-surface-output"
      );
      const piecesOutput = row.querySelector(".pieces-output");
      const linearOutput = row.querySelector(".linear-output");
      const priceOutput = row.querySelector(".price-output");

      const line = order.lines[index];
      if (!line) return;

      recommendedSurfaceOutput.textContent =
        line.recommendedSurface.toFixed(2) + " m²";

      piecesOutput.textContent = line.piecesNeeded + " pièces";
      linearOutput.textContent = line.rowLinearMeters.toFixed(2) + " ml";
      priceOutput.textContent = formatMoney(line.rowPrice);
    });

    deliveryPriceRef.current.textContent = formatMoney(
      order.services.deliveryPrice
    );

    handlingPriceRef.current.textContent = formatMoney(
      order.services.handlingPrice
    );

    if (poseSurfaceRef.current) {
      poseSurfaceRef.current.value = order.services.poseSurface.toFixed(2);
    }

    if (posePriceRef.current) {
      posePriceRef.current.textContent = formatMoney(order.services.posePrice);
    }

    summarySurfaceRef.current.textContent =
      order.totals.totalClientSurface.toFixed(2) + " m²";

    summaryRecommendedSurfaceRef.current.textContent =
      order.totals.totalRecommendedSurface.toFixed(2) + " m²";

    summaryPiecesRef.current.textContent =
      order.totals.totalPieces + " pièces";

    summaryLinearRef.current.textContent =
      order.totals.totalLinearMeters.toFixed(2) + " ml";

    summaryMaterialRef.current.textContent = formatMoney(
      order.totals.materialTotal
    );

    summaryServicesRef.current.textContent = formatMoney(
      order.totals.servicesTotal
    );

    summaryTotalRef.current.textContent = formatMoney(order.totals.finalTotal);

    togglePoseOptions();

    return order;
  };

  const bindRowEvents = (row) => {
    const finishSelect = row.querySelector(".finish-select");
    const formatSelect = row.querySelector(".format-select");
    const surfaceInput = row.querySelector(".surface-input");
    const lossMarginInput = row.querySelector(".loss-margin-input");
    const securityMarginInput = row.querySelector(".security-margin-input");
    const linePoseInput = row.querySelector(".line-pose-input");
    const removeButton = row.querySelector(".remove-floor-line");

    finishSelect?.addEventListener("change", () => {
      updateFormatOptions(row);
      calculateAll();
    });

    formatSelect?.addEventListener("change", calculateAll);
    surfaceInput?.addEventListener("input", calculateAll);
    lossMarginInput?.addEventListener("change", calculateAll);
    securityMarginInput?.addEventListener("change", calculateAll);
    linePoseInput?.addEventListener("change", calculateAll);

    removeButton?.addEventListener("click", () => {
      if (rowsRef.current.querySelectorAll(".floor-line-card").length > 1) {
        row.remove();
        calculateAll();
      }
    });
  };

  const addRow = () => {
    const defaultFinish = getDefaultFinish();

    const wrapper = document.createElement("div");
    wrapper.className = "floor-line-card floor-line-card-advanced";

    wrapper.innerHTML = `
      <div class="floor-line-title">Nouvelle ligne</div>

      <label>
        Finition
        <select class="finish-select">
          ${finishes
            .map(
              (finish) =>
                `<option value="${finish.name}">${finish.name}</option>`
            )
            .join("")}
        </select>
      </label>

      <label>
        Format
        <select class="format-select">
          ${createFormatOptions(defaultFinish)}
        </select>
      </label>

      <label>
        Surface à couvrir (m²)
        <input class="surface-input" type="number" min="0" value="10" />
      </label>

      <label class="line-margin-check">
        <input class="loss-margin-input" type="checkbox" checked />
        <div>
          <strong>Marge de perte : ${LOSS_MARGIN}%</strong>
          <p>Pour couvrir les découpes, ajustements et pertes pendant la pose.</p>
        </div>
      </label>

      <label class="line-margin-check">
        <input class="security-margin-input" type="checkbox" checked />
        <div>
          <strong>Marge de sécurité : ${SECURITY_MARGIN}%</strong>
          <p>Pour garder quelques pièces en réserve en cas de casse future.</p>
        </div>
      </label>

      <label class="line-margin-check">
        <input class="line-pose-input" type="checkbox" checked />
        <div>
          <strong>Appliquer la pose</strong>
          <p>Activer si vous souhaitez la pose pour cette surface uniquement.</p>
        </div>
      </label>

      <div class="line-result">
        <span>Surface recommandée</span>
        <strong class="recommended-surface-output">0.00 m²</strong>
      </div>

      <div class="line-result">
        <span>Nombre de pièces</span>
        <strong class="pieces-output">0 pièces</strong>
      </div>

      <div class="line-result">
        <span>Mètre linéaire</span>
        <strong class="linear-output">0.00 ml</strong>
      </div>

      <div class="line-result">
        <span>Prix total</span>
        <strong class="price-output">0 MAD</strong>
      </div>

      <button type="button" class="remove-floor-line">
        Supprimer
      </button>
    `;

    rowsRef.current.appendChild(wrapper);
    bindRowEvents(wrapper);
    calculateAll();
  };

  const continueRequest = () => {
    const order = calculateAll();

    trackAddToCart({
      value: order.totals.finalTotal,
      productName: product.name,
      productId: product.id,
      quantity: order.totals.totalPieces,
      category: product.categoryLabel || product.category || "Sol",
    });

    trackInitiateCheckout({
      value: order.totals.finalTotal,
      itemsCount: order.totals.totalPieces,
      source: "Sol / formats standards",
    });

    localStorage.setItem("marbre_devis_order", JSON.stringify(order));

    navigate("/devis");
  };

  useEffect(() => {
    togglePoseOptions();
    calculateAll();
  }, []);

  const defaultFinish = getDefaultFinish();

  return (
    <section className="standard-floor-calculator" id="floor-calculator">
      <div className="floor-header">
        <span>SOL / FORMATS STANDARDS</span>

        <h2>Calculateur de sol</h2>

        <p>
          Choisissez la finition, le format et la surface à couvrir. Vous pouvez
          activer ou désactiver les marges et la pose pour chaque ligne.
        </p>
      </div>

      <div className="floor-lines-section">
        <div className="floor-lines-header">
          <div>
            <span>FINITIONS, FORMATS & SURFACES</span>
            <h3>Ajoutez les surfaces à couvrir</h3>
          </div>

          <button type="button" onClick={addRow}>
            + Ajouter une surface
          </button>
        </div>

        <div className="floor-lines" ref={rowsRef}>
          <div className="floor-line-card floor-line-card-advanced">
            <div className="floor-line-title">Ligne 1</div>

            <label>
              Finition
              <select
                className="finish-select"
                onChange={(e) => {
                  const row = e.currentTarget.closest(".floor-line-card");
                  updateFormatOptions(row);
                  calculateAll();
                }}
              >
                {finishes.map((finish) => (
                  <option key={finish.name} value={finish.name}>
                    {finish.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Format
              <select className="format-select" onChange={calculateAll}>
                {getFormatsByFinish(defaultFinish).map((format) => (
                  <option key={format.size} value={format.size}>
                    {format.size} — {format.pricePerM2} MAD / m²
                  </option>
                ))}
              </select>
            </label>

            <label>
              Surface à couvrir (m²)
              <input
                className="surface-input"
                type="number"
                min="0"
                defaultValue="20"
                onInput={calculateAll}
              />
            </label>

            <label className="line-margin-check">
              <input
                className="loss-margin-input"
                type="checkbox"
                defaultChecked
                onChange={calculateAll}
              />
              <div>
                <strong>Marge de perte : {LOSS_MARGIN}%</strong>
                <p>
                  Pour couvrir les découpes, ajustements et pertes pendant la
                  pose.
                </p>
              </div>
            </label>

            <label className="line-margin-check">
              <input
                className="security-margin-input"
                type="checkbox"
                defaultChecked
                onChange={calculateAll}
              />
              <div>
                <strong>Marge de sécurité : {SECURITY_MARGIN}%</strong>
                <p>
                  Pour garder quelques pièces en réserve en cas de casse future.
                </p>
              </div>
            </label>

            <label className="line-margin-check">
              <input
                className="line-pose-input"
                type="checkbox"
                defaultChecked
                onChange={calculateAll}
              />
              <div>
                <strong>Appliquer la pose</strong>
                <p>
                  Activez cette option si vous souhaitez la pose pour cette
                  surface uniquement.
                </p>
              </div>
            </label>

            <div className="line-result">
              <span>Surface recommandée</span>
              <strong className="recommended-surface-output">0.00 m²</strong>
            </div>

            <div className="line-result">
              <span>Nombre de pièces</span>
              <strong className="pieces-output">0 pièces</strong>
            </div>

            <div className="line-result">
              <span>Mètre linéaire</span>
              <strong className="linear-output">0.00 ml</strong>
            </div>

            <div className="line-result">
              <span>Prix total</span>
              <strong className="price-output">0 MAD</strong>
            </div>

            <button
              type="button"
              className="remove-floor-line"
              onClick={(e) => {
                if (
                  rowsRef.current.querySelectorAll(".floor-line-card").length > 1
                ) {
                  e.currentTarget.closest(".floor-line-card").remove();
                  calculateAll();
                }
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>

      <div className="floor-options-panel">
        <div className="floor-option-block">
          <span>LIVRAISON</span>

          <label className="floor-checkbox">
            <input
              ref={deliveryRef}
              type="checkbox"
              defaultChecked
              onChange={calculateAll}
            />
            Livraison
          </label>

          <label className="floor-service-label">
            Ville de livraison
            <select ref={cityRef} onChange={calculateAll}>
              {deliveryZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.label}
                  {zone.custom ? " — sur devis" : ` — ${zone.price} MAD`}
                </option>
              ))}
            </select>
          </label>

          <div className="service-price-box">
            <span>Prix livraison</span>
            <strong ref={deliveryPriceRef}>0 MAD</strong>
          </div>
        </div>

        <div className="floor-option-block">
          <span>MAIN-D’ŒUVRE</span>

          <label className="floor-checkbox">
            <input
              ref={handlingRef}
              type="checkbox"
              onChange={calculateAll}
            />
            Main-d’œuvre pour descendre la marchandise
          </label>

          <p className="installation-note">
            Calcul actuel : {floorServicesData.handling.pricePerM2} MAD / m².
          </p>

          <div className="service-price-box">
            <span>Prix main-d’œuvre</span>
            <strong ref={handlingPriceRef}>0 MAD</strong>
          </div>
        </div>

        <div className="floor-option-block">
          <span>POSE</span>

          <label className="floor-checkbox">
            <input ref={poseRef} type="checkbox" onChange={calculateAll} />
            Pose
          </label>

          <div
            className="installation-options"
            ref={poseOptionsRef}
            style={{ display: "none" }}
          >
            <label className="floor-service-label">
              Type de pose
              <select ref={poseTypeRef} onChange={calculateAll}>
                <option value="pose_marbre">
                  Pose marbre — {floorServicesData.pose.marbre.pricePerM2} MAD /
                  m²
                </option>

                <option value="pose_complete">
                  Pose complète — {floorServicesData.pose.complete.pricePerM2}{" "}
                  MAD / m²
                </option>
              </select>
            </label>

            <label className="floor-service-label">
              Surface de pose calculée automatiquement
              <input
                ref={poseSurfaceRef}
                type="number"
                readOnly
                min="0"
                defaultValue="0"
              />
            </label>

            <p className="installation-note">
              La pose est calculée uniquement sur les lignes où “Appliquer la
              pose” est activé.
            </p>

            <div className="service-price-box">
              <span>Prix pose</span>
              <strong ref={posePriceRef}>0 MAD</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="floor-summary">
        <div>
          <span>Surface client</span>
          <strong ref={summarySurfaceRef}>0.00 m²</strong>
        </div>

        <div>
          <span>Surface recommandée</span>
          <strong ref={summaryRecommendedSurfaceRef}>0.00 m²</strong>
        </div>

        <div>
          <span>Nombre de pièces</span>
          <strong ref={summaryPiecesRef}>0 pièces</strong>
        </div>

        <div>
          <span>Mètre linéaire total</span>
          <strong ref={summaryLinearRef}>0.00 ml</strong>
        </div>

        <div>
          <span>Prix total</span>
          <strong ref={summaryMaterialRef}>0 MAD</strong>
        </div>

        <div>
          <span>Services</span>
          <strong ref={summaryServicesRef}>0 MAD</strong>
        </div>

        <div className="floor-total-card">
          <span>Total estimé</span>
          <strong ref={summaryTotalRef}>0 MAD</strong>
        </div>
      </div>

      <div className="floor-continue-box">
        <div>
          <span>DEMANDE DE DEVIS</span>

          <h3>Votre configuration sol est prête</h3>

          <p>Continuez vers l’étape suivante pour envoyer votre demande.</p>
        </div>

        <button type="button" onClick={continueRequest}>
          Continuer la demande
        </button>
      </div>
    </section>
  );
}