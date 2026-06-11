import tableComplete from "../assets/products/table-salle-a-manger/table-complete.png";
import tableChaise from "../assets/products/table-salle-a-manger/chaise.png";
import tablePlateau from "../assets/products/table-salle-a-manger/plateau.png";
import tablePieds from "../assets/products/table-salle-a-manger/pieds.png";

export const productCategories = [
  {
    id: "tables",
    label: "Tables",
    description: "Tables à manger, tables basses et tables sur mesure en marbre.",
  },
  {
    id: "chaises",
    label: "Chaises",
    description: "Chaises assorties aux tables et ensembles sur mesure.",
  },
  {
    id: "vasques",
    label: "Vasques",
    description: "Vasques design pour salles de bain et projets personnalisés.",
  },
  {
    id: "plans-cuisine",
    label: "Plans de cuisine",
    description: "Plans de travail, îlots centraux et surfaces de cuisine.",
  },
  {
    id: "fontaines",
    label: "Fontaines",
    description: "Fontaines décoratives, murales et extérieures en pierre.",
  },
  {
    id: "cheminees",
    label: "Cheminées",
    description: "Habillages de cheminées modernes et classiques.",
  },
  {
    id: "bermat",
    label: "Bermat",
    description: "Bermat décoratif pour intérieur et extérieur.",
  },
  {
    id: "decoration",
    label: "Décoration",
    description: "Objets décoratifs, plateaux, étagères et pièces en marbre.",
  },
  {
    id: "accessoires",
    label: "Accessoires",
    description: "Porte-savon, distributeurs, planches de découpe et accessoires.",
  },
  {
    id: "sur-mesure",
    label: "Produits sur mesure",
    description: "Projets personnalisés pour villas, hôtels, restaurants et commerces.",
  },
];

const fabricatedProducts = [
  {
    id: "table-salle-a-manger-sur-mesure",
    category: "tables",
    subCategory: "tables-salle-a-manger",
    name: "Table en travertin",
    image: tableComplete,
    gallery: [tableComplete, tableChaise, tablePlateau, tablePieds],
    price: 9899,
    unit: "DH",
    description:
      "Table en travertin avec chaises assorties, plateau et pieds travaillés, fabriquée avec une finition élégante.",
  },

  {
    id: "table-marbre-ronde",
    category: "tables",
    subCategory: "tables-salle-a-manger",
    name: "Table ronde en marbre",
    image: tableComplete,
    gallery: [tableComplete, tableChaise, tablePlateau, tablePieds],
    price: 9899,
    unit: "DH",
    description:
      "Table ronde élégante en marbre, idéale pour salon ou salle à manger.",
  },

  {
    id: "vasque-marbre-design",
    category: "vasques",
    name: "Vasque design en marbre",
    image: "",
    description:
      "Vasque moderne fabriquée sur mesure selon le choix du client.",
  },

  {
    id: "plan-cuisine-quartz",
    category: "plans-cuisine",
    name: "Plan de cuisine en quartz",
    image: "",
    description:
      "Plan de travail résistant, élégant et adapté aux cuisines modernes.",
  },

  {
    id: "fontaine-marbre-jardin",
    category: "fontaines",
    name: "Fontaine de jardin",
    image: "",
    description:
      "Fontaine décorative en pierre pour jardin, patio ou entrée.",
  },

  {
    id: "cheminee-marbre-moderne",
    category: "cheminees",
    name: "Cheminée moderne",
    image: "",
    description:
      "Habillage de cheminée en marbre avec finition personnalisée.",
  },

  {
    id: "accessoires-salle-bain",
    category: "accessoires",
    name: "Accessoires salle de bain",
    image: "",
    description:
      "Porte-savon, distributeur et accessoires raffinés en marbre.",
  },
];

export { fabricatedProducts };
export default fabricatedProducts;