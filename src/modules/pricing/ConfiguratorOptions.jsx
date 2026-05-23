import pricingOptions from "./optionsData";
import "./ConfiguratorOptions.css";

export default function ConfiguratorOptions({
  selectedThickness,
  setSelectedThickness,

  selectedEdge,
  setSelectedEdge,

  selectedInstallation,
  setSelectedInstallation,

  selectedProjectType,
  setSelectedProjectType,

  selectedCut,
  setSelectedCut,
}) {
  return (
    <section className="configurator-options">

      <div className="configurator-header">
        <span>CONFIGURATEUR AVANCÉ</span>

        <h2>
          Configurez votre projet marbre
        </h2>

        <p>
          Personnalisez les caractéristiques
          techniques de votre projet :
          épaisseur, chants, pose,
          découpes et type d’utilisation.
        </p>
      </div>

      <div className="configurator-grid">

        {/* TYPE PROJET */}
        <div className="config-card">
          <label>Type de projet</label>

          <select
            value={selectedProjectType}
            onChange={(e) =>
              setSelectedProjectType(
                e.target.value
              )
            }
          >
            {pricingOptions.projectTypes.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </option>
              )
            )}
          </select>
        </div>

        {/* ÉPAISSEUR */}
        <div className="config-card">
          <label>Épaisseur</label>

          <select
            value={selectedThickness}
            onChange={(e) =>
              setSelectedThickness(
                e.target.value
              )
            }
          >
            {pricingOptions.thicknesses.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </option>
              )
            )}
          </select>
        </div>

        {/* CHANT */}
        <div className="config-card">
          <label>Type de chant</label>

          <select
            value={selectedEdge}
            onChange={(e) =>
              setSelectedEdge(
                e.target.value
              )
            }
          >
            {pricingOptions.edges.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </option>
              )
            )}
          </select>
        </div>

        {/* DÉCOUPE */}
        <div className="config-card">
          <label>Découpe spéciale</label>

          <select
            value={selectedCut}
            onChange={(e) =>
              setSelectedCut(
                e.target.value
              )
            }
          >
            {pricingOptions.specialCuts.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </option>
              )
            )}
          </select>
        </div>

        {/* POSE */}
        <div className="config-card">
          <label>Type de pose</label>

          <select
            value={selectedInstallation}
            onChange={(e) =>
              setSelectedInstallation(
                e.target.value
              )
            }
          >
            {pricingOptions.installationTypes.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.label}
                </option>
              )
            )}
          </select>
        </div>

      </div>

    </section>
  );
}