import { useState } from "react";

import { calculateProjectPrice } from "../pricing/pricingEngine";
import ConfiguratorOptions from "../pricing/ConfiguratorOptions";
import pricingOptions from "../pricing/optionsData";

import TechnicalSummary from "../devis/TechnicalSummary";
import ClientForm from "../devis/ClientForm";
import DevisPrint from "../devis/DevisPrint";

import DynamicProjectPreview from "../gallery/DynamicProjectPreview";

import "./TechnicalCalculator.css";

export default function TechnicalCalculator({ product }) {
  const [items, setItems] = useState([
    {
      id: 1,
      length: 200,
      width: 90,
      quantity: 1,
      shape: "Rectangle",
    },
  ]);

  const [finition, setFinition] = useState("Polie");
  const [delivery, setDelivery] = useState(true);

  const [client, setClient] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    note: "",
  });

  const [selectedThickness, setSelectedThickness] =
    useState("2cm");

  const [selectedEdge, setSelectedEdge] =
    useState("droit");

  const [selectedInstallation, setSelectedInstallation] =
    useState("none");

  const [selectedProjectType, setSelectedProjectType] =
    useState("sol");

  const [selectedCut, setSelectedCut] =
    useState("none");

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        length: 100,
        width: 50,
        quantity: 1,
        shape: "Rectangle",
      },
    ]);
  };

  const updateItem = (id, field, value) => {
    const updated = items.map((item) =>
      item.id === id
        ? {
            ...item,
            [field]:
              field === "shape"
                ? value
                : Number(value),
          }
        : item
    );

    setItems(updated);
  };

  const removeItem = (id) => {
    if (items.length === 1) return;

    setItems(
      items.filter((item) => item.id !== id)
    );
  };

  const pricePerM2 = Number(
    product.price.replace(/\D/g, "")
  );

  const finitionPriceMap = {
    Polie: 0,
    Adoucie: 80,
    Bouchardée: 140,
    Antidérapante: 100,
  };

  const thicknessData =
    pricingOptions.thicknesses.find(
      (item) => item.id === selectedThickness
    );

  const edgeData =
    pricingOptions.edges.find(
      (item) => item.id === selectedEdge
    );

  const installationData =
    pricingOptions.installationTypes.find(
      (item) =>
        item.id === selectedInstallation
    );

  const projectData =
    pricingOptions.projectTypes.find(
      (item) =>
        item.id === selectedProjectType
    );

  const cutData =
    pricingOptions.specialCuts.find(
      (item) => item.id === selectedCut
    );

  const result = calculateProjectPrice({
    items,
    pricePerM2,

    wastePercent:
      projectData?.wastePercent || 8,

    finitionPrice:
      finitionPriceMap[finition] +
      (thicknessData?.extraPrice || 0),

    edgePrice:
      edgeData?.price || 40,

    deliveryPrice:
      delivery ? 350 : 0,

    installationPrice:
      (installationData?.price || 0) +
      (cutData?.price || 0),
  });

  return (
    <>
      <section className="technical-calculator">

        <div className="calculator-header">
          <div>
            <span>Module technique</span>

            <h2>
              Calculateur industriel
            </h2>
          </div>

          <button
            className="add-measure-btn"
            onClick={addItem}
          >
            + Ajouter une mesure
          </button>
        </div>

        <div className="multi-measures">

          {items.map((item, index) => (
            <div
              className="measure-row"
              key={item.id}
            >

              <div className="measure-title">
                Mesure {index + 1}
              </div>

              <label>
                Forme

                <select
                  value={item.shape}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "shape",
                      e.target.value
                    )
                  }
                >
                  <option>
                    Rectangle
                  </option>

                  <option>
                    Rond
                  </option>
                </select>
              </label>

              <label>
                Longueur (cm)

                <input
                  type="number"
                  value={item.length}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "length",
                      e.target.value
                    )
                  }
                />
              </label>

              <label>
                Largeur (cm)

                <input
                  type="number"
                  value={item.width}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "width",
                      e.target.value
                    )
                  }
                />
              </label>

              <label>
                Quantité

                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "quantity",
                      e.target.value
                    )
                  }
                />
              </label>

              <button
                className="remove-measure-btn"
                onClick={() =>
                  removeItem(item.id)
                }
              >
                Supprimer
              </button>

            </div>
          ))}
        </div>

        <ConfiguratorOptions
          selectedThickness={
            selectedThickness
          }
          setSelectedThickness={
            setSelectedThickness
          }

          selectedEdge={selectedEdge}
          setSelectedEdge={
            setSelectedEdge
          }

          selectedInstallation={
            selectedInstallation
          }
          setSelectedInstallation={
            setSelectedInstallation
          }

          selectedProjectType={
            selectedProjectType
          }
          setSelectedProjectType={
            setSelectedProjectType
          }

          selectedCut={selectedCut}
          setSelectedCut={
            setSelectedCut
          }
        />

        <div className="advanced-options">

          <label>
            Finition

            <select
              value={finition}
              onChange={(e) =>
                setFinition(
                  e.target.value
                )
              }
            >
              <option>Polie</option>

              <option>
                Adoucie
              </option>

              <option>
                Bouchardée
              </option>

              <option>
                Antidérapante
              </option>
            </select>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              checked={delivery}
              onChange={() =>
                setDelivery(!delivery)
              }
            />

            Livraison
          </label>

        </div>

        <div className="calculator-summary">

          <div>
            <span>
              Surface brute
            </span>

            <strong>
              {result.rawSurface.toFixed(
                2
              )}{" "}
              m²
            </strong>
          </div>

          <div>
            <span>
              Surface avec pertes
            </span>

            <strong>
              {result.surfaceWithWaste.toFixed(
                2
              )}{" "}
              m²
            </strong>
          </div>

          <div>
            <span>
              Prix matière
            </span>

            <strong>
              {Math.round(
                result.materialTotal
              ).toLocaleString()}{" "}
              MAD
            </strong>
          </div>

          <div>
            <span>
              Finition + épaisseur
            </span>

            <strong>
              {Math.round(
                result.finitionTotal
              ).toLocaleString()}{" "}
              MAD
            </strong>
          </div>

          <div>
            <span>
              Chant + services
            </span>

            <strong>
              {Math.round(
                result.edgeTotal +
                  result.deliveryPrice +
                  result.installationPrice
              ).toLocaleString()}{" "}
              MAD
            </strong>
          </div>

          <div>
            <span>
              Total estimé
            </span>

            <strong>
              {Math.round(
                result.total
              ).toLocaleString()}{" "}
              MAD
            </strong>
          </div>

        </div>

      </section>

      <DynamicProjectPreview
        selectedProjectType={
          selectedProjectType
        }

        selectedThickness={
          selectedThickness
        }

        finition={finition}
      />

      <ClientForm
        client={client}
        setClient={setClient}
      />

      <TechnicalSummary
        product={product}
        items={items}
        finition={finition}
        delivery={delivery}

        installation={
          selectedInstallation !== "none"
        }

        result={result}
        client={client}

        selectedThickness={
          selectedThickness
        }

        selectedEdge={selectedEdge}

        selectedProjectType={
          selectedProjectType
        }

        selectedCut={selectedCut}
      />

      <DevisPrint
        product={product}
        items={items}
        finition={finition}
        delivery={delivery}

        installation={
          selectedInstallation !== "none"
        }

        result={result}
        client={client}
      />
    </>
  );
}