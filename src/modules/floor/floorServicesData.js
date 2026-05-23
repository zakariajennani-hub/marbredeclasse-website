const floorServicesData = {
  handling: {
    label: "Main-d’œuvre pour descendre la marchandise",
    unit: "m²",
    pricePerM2: 35,
  },

  pose: {
    marbre: {
      label: "Pose marbre",
      unit: "m²",
      pricePerM2: 80,
      description: "Installation du marbre uniquement.",
    },

    complete: {
      label: "Pose complète",
      unit: "m²",
      pricePerM2: 290,
      description:
        "Pose complète avec ciment, sable, colle, outils de coupe et finition.",
    },
  },
};

export default floorServicesData;