const pricingOptions = {
  thicknesses: [
    {
      id: "2cm",
      label: "2 cm",
      extraPrice: 0,
    },
    {
      id: "3cm",
      label: "3 cm",
      extraPrice: 120,
    },
    {
      id: "4cm",
      label: "4 cm",
      extraPrice: 220,
    },
  ],

  edges: [
    {
      id: "droit",
      label: "Chant droit",
      price: 40,
    },
    {
      id: "arrondi",
      label: "Chant arrondi",
      price: 80,
    },
    {
      id: "biseaute",
      label: "Chant biseauté",
      price: 100,
    },
    {
      id: "double",
      label: "Double chant",
      price: 160,
    },
  ],

  installationTypes: [
    {
      id: "none",
      label: "Sans pose",
      price: 0,
    },
    {
      id: "standard",
      label: "Pose standard",
      price: 900,
    },
    {
      id: "complex",
      label: "Pose complexe",
      price: 1600,
    },
  ],

  projectTypes: [
    {
      id: "sol",
      label: "Sol",
      wastePercent: 8,
    },
    {
      id: "salle_bain",
      label: "Salle de bain",
      wastePercent: 10,
    },
    {
      id: "escalier",
      label: "Escalier",
      wastePercent: 12,
    },
    {
      id: "table",
      label: "Table sur mesure",
      wastePercent: 6,
    },
    {
      id: "plan_travail",
      label: "Plan de travail",
      wastePercent: 10,
    },
  ],

  specialCuts: [
    {
      id: "none",
      label: "Sans découpe spéciale",
      price: 0,
    },
    {
      id: "evier",
      label: "Découpe évier",
      price: 250,
    },
    {
      id: "lavabo",
      label: "Découpe lavabo",
      price: 300,
    },
    {
      id: "angle",
      label: "Découpe angle",
      price: 180,
    },
  ],
};

export default pricingOptions;