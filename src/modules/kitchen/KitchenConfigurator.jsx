import { useState } from "react";
import "./KitchenConfigurator.css";

const kitchenShapes = [
  {
    id: "linear",
    label: "Cuisine linéaire",
    description: "Un seul plan de travail droit.",
    sections: 1,
  },
  {
    id: "l",
    label: "Cuisine en L",
    description: "Deux parties avec angle.",
    sections: 2,
  },
  {
    id: "u",
    label: "Cuisine en U",
    description: "Trois parties autour de l’espace.",
    sections: 3,
  },
];

const edgeTypes = [
  "Chant droit",
  "Chant arrondi",
  "Chant biseauté",
  "Double chant",
];

export default function KitchenConfigurator({ product }) {
  const [shape, setShape] = useState("linear");

  const selectedShape =
    kitchenShapes.find((item) => item.id === shape) || kitchenShapes[0];

  const [sections, setSections] = useState([
    {
      id: 1,
      name: "Partie A",
      length: 250,
      width: 60,
      edges: {
        front: true,
        back: false,
        left: true,
        right: true,
      },
      edgeType: "Chant droit",
      cutouts: {
        sink: true,
        cooktop: false,
        faucet: true,
      },
    },
  ]);

  const resetSections = (nextShape) => {
    const next = kitchenShapes.find((item) => item.id === nextShape);

    const generated = Array.from({ length: next.sections }).map((_, index) => ({
      id: Date.now() + index,
      name: `Partie ${String.fromCharCode(65 + index)}`,
      length: index === 0 ? 250 : 180,
      width: 60,
      edges: {
        front: true,
        back: false,
        left: index === 0,
        right: index === next.sections - 1,
      },
      edgeType: "Chant droit",
      cutouts: {
        sink: index === 0,
        cooktop: false,
        faucet: index === 0,
      },
    }));

    setShape(nextShape);
    setSections(generated);
  };

  const updateSection = (id, field, value) => {
    setSections(
      sections.map((section) =>
        section.id === id
          ? {
              ...section,
              [field]: value,
            }
          : section
      )
    );
  };

  const updateEdge = (sectionId, edge, value) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              edges: {
                ...section.edges,
                [edge]: value,
              },
            }
          : section
      )
    );
  };

  const updateCutout = (sectionId, cutout, value) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              cutouts: {
                ...section.cutouts,
                [cutout]: value,
              },
            }
          : section
      )
    );
  };

  const applyEdgesToAll = (sourceSection) => {
    setSections(
      sections.map((section) => ({
        ...section,
        edges: { ...sourceSection.edges },
        edgeType: sourceSection.edgeType,
      }))
    );
  };

  const totalSurface = sections.reduce((sum, section) => {
    return sum + (section.length / 100) * (section.width / 100);
  }, 0);

  const totalEdges = sections.reduce((sum, section) => {
    const front = section.edges.front ? section.length / 100 : 0;
    const back = section.edges.back ? section.length / 100 : 0;
    const left = section.edges.left ? section.width / 100 : 0;
    const right = section.edges.right ? section.width / 100 : 0;

    return sum + front + back + left + right;
  }, 0);

  const cutoutCount = sections.reduce((sum, section) => {
    return (
      sum +
      Object.values(section.cutouts).filter((value) => value === true).length
    );
  }, 0);

  const pricePerM2 = product.salesModes?.customMarble?.pricePerM2 || 0;
  const materialPrice = totalSurface * pricePerM2;
  const edgePrice = totalEdges * 120;
  const cutoutPrice = cutoutCount * 250;
  const estimatedTotal = materialPrice + edgePrice + cutoutPrice;

  return (
    <section className="kitchen-configurator">
      <div className="kitchen-header">
        <span>PLAN DE CUISINE</span>

        <h2>Configurez votre plan de travail</h2>

        <p>
          Choisissez la forme de la cuisine, les dimensions de chaque partie,
          les chants visibles et les découpes nécessaires pour l’évier, la
          plaque cuisson et le robinet.
        </p>
      </div>

      <div className="kitchen-shapes">
        {kitchenShapes.map((item) => (
          <button
            key={item.id}
            className={
              shape === item.id ? "kitchen-shape-card active" : "kitchen-shape-card"
            }
            onClick={() => resetSections(item.id)}
          >
            <strong>{item.label}</strong>
            <span>{item.description}</span>
          </button>
        ))}
      </div>

      <div className="kitchen-sections">
        {sections.map((section) => (
          <div className="kitchen-section-card" key={section.id}>
            <div className="section-card-header">
              <h3>{section.name}</h3>
              <span>{selectedShape.label}</span>
            </div>

            <div className="section-dimensions">
              <label>
                Longueur (cm)
                <input
                  type="number"
                  value={section.length}
                  onChange={(e) =>
                    updateSection(section.id, "length", Number(e.target.value))
                  }
                />
              </label>

              <label>
                Largeur (cm)
                <input
                  type="number"
                  value={section.width}
                  onChange={(e) =>
                    updateSection(section.id, "width", Number(e.target.value))
                  }
                />
              </label>
            </div>

            <div className="section-edges">
              <h4>Chants à finir</h4>

              <div className="edge-grid">
                <label>
                  <input
                    type="checkbox"
                    checked={section.edges.front}
                    onChange={(e) =>
                      updateEdge(section.id, "front", e.target.checked)
                    }
                  />
                  Avant
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={section.edges.back}
                    onChange={(e) =>
                      updateEdge(section.id, "back", e.target.checked)
                    }
                  />
                  Arrière
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={section.edges.left}
                    onChange={(e) =>
                      updateEdge(section.id, "left", e.target.checked)
                    }
                  />
                  Gauche
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={section.edges.right}
                    onChange={(e) =>
                      updateEdge(section.id, "right", e.target.checked)
                    }
                  />
                  Droite
                </label>
              </div>

              <label className="edge-type-select">
                Type de chant
                <select
                  value={section.edgeType}
                  onChange={(e) =>
                    updateSection(section.id, "edgeType", e.target.value)
                  }
                >
                  {edgeTypes.map((edge) => (
                    <option key={edge}>{edge}</option>
                  ))}
                </select>
              </label>

              <button
                className="apply-all-btn"
                onClick={() => applyEdgesToAll(section)}
              >
                Appliquer ces chants à toutes les parties
              </button>
            </div>

            <div className="section-cutouts">
              <h4>Découpes & trous</h4>

              <div className="cutout-grid">
                <label>
                  <input
                    type="checkbox"
                    checked={section.cutouts.sink}
                    onChange={(e) =>
                      updateCutout(section.id, "sink", e.target.checked)
                    }
                  />
                  Découpe évier
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={section.cutouts.cooktop}
                    onChange={(e) =>
                      updateCutout(section.id, "cooktop", e.target.checked)
                    }
                  />
                  Découpe cuisson
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={section.cutouts.faucet}
                    onChange={(e) =>
                      updateCutout(section.id, "faucet", e.target.checked)
                    }
                  />
                  Trou robinet
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="kitchen-summary">
        <div>
          <span>Surface totale</span>
          <strong>{totalSurface.toFixed(2)} m²</strong>
        </div>

        <div>
          <span>Longueur chants</span>
          <strong>{totalEdges.toFixed(2)} ml</strong>
        </div>

        <div>
          <span>Découpes / trous</span>
          <strong>{cutoutCount}</strong>
        </div>

        <div>
          <span>Total estimé</span>
          <strong>{Math.round(estimatedTotal).toLocaleString()} MAD</strong>
        </div>
      </div>
    </section>
  );
}