import { useState } from "react";

import KitchenConfigurator from "../kitchen/KitchenConfigurator";

import "./FabricatedProductCalculator.css";

const productTypes = [
  {
    id: "table",
    title: "Table",
    description:
      "Table à manger, table basse ou table d’appoint en marbre avec finition premium.",
  },
  {
    id: "vasque",
    title: "Vasque",
    description:
      "Vasque simple, double vasque ou plan vasque avec trou robinet et évacuation.",
  },
  {
    id: "receveur",
    title: "Receveur",
    description:
      "Receveur de douche en marbre avec pente, bonde et finition antidérapante.",
  },
  {
    id: "planCuisine",
    title: "Plan de cuisine",
    description:
      "Plan de travail avec découpe évier, plaque cuisson, trou robinet et chants visibles.",
  },
  {
    id: "custom",
    title: "Produit sur demande",
    description:
      "Fontaine, pièce décorative, console ou forme spéciale fabriquée sur demande.",
  },
];

export default function FabricatedProductCalculator({ product }) {
  const [selectedType, setSelectedType] = useState("table");

  const selectedProductType = productTypes.find(
    (item) => item.id === selectedType
  );

  return (
    <section className="fabricated-calculator">
      <div className="fabricated-header">
        <span>PROJET SUR MESURE</span>

        <h2>Choisissez le type de produit</h2>

        <p>
          Le prix d’un produit fabriqué ne dépend pas uniquement de la surface.
          Il inclut la sélection de la pierre, le travail artistique, les
          découpes, la finition premium et la perte de matière.
        </p>
      </div>

      <div className="fabricated-type-grid">
        {productTypes.map((item) => (
          <button
            key={item.id}
            className={
              selectedType === item.id
                ? "fabricated-type-card active"
                : "fabricated-type-card"
            }
            onClick={() => setSelectedType(item.id)}
          >
            <span>{item.title}</span>
            <p>{item.description}</p>
          </button>
        ))}
      </div>

      {selectedType !== "planCuisine" && (
        <div className="fabricated-summary-box">
          <span>Produit sélectionné</span>

          <strong>{selectedProductType?.title}</strong>

          <p>
            Matériau choisi : <b>{product.name}</b>
          </p>

          <p>
            Le configurateur détaillé de ce type de produit sera ajouté dans la
            prochaine étape.
          </p>
        </div>
      )}

      {selectedType === "planCuisine" && (
        <KitchenConfigurator product={product} />
      )}
    </section>
  );
}