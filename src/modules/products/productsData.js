const products = [
  {
    id: 1,
    name: "Noir Agadir",
    category: "Marbre marocain",
    categoryGroup: "MARBRE MAROCAIN",
    origin: "Maroc",
    price: "950 MAD / m²",
    thickness: "2 cm",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
    description:
      "Marbre marocain noir élégant, idéal pour cuisines, salles de bain, escaliers et projets sur mesure.",
    salesModes: {
      customMarble: { enabled: true, label: "Marbre sur mesure", pricePerM2: 950 },
      standardFloor: {
        enabled: true,
        label: "Sol / formats standards",
        formats: [
          { size: "60×60", pricePerM2: 720 },
          { size: "40×40", pricePerM2: 680 },
          { size: "60×30", pricePerM2: 650 },
        ],
      },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 1.8 },
    },
  },
  {
    id: 2,
    name: "Zayan",
    category: "Marbre marocain",
    categoryGroup: "MARBRE MAROCAIN",
    origin: "Maroc",
    price: "780 MAD / m²",
    thickness: "2 cm",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    description:
      "Marbre marocain chaleureux, adapté aux sols, escaliers et aménagements intérieurs.",
    salesModes: {
      customMarble: { enabled: true, label: "Marbre sur mesure", pricePerM2: 780 },
      standardFloor: {
        enabled: true,
        label: "Sol / formats standards",
        formats: [
          { size: "60×60", pricePerM2: 560 },
          { size: "40×40", pricePerM2: 520 },
          { size: "60×30", pricePerM2: 500 },
        ],
      },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 1.7 },
    },
  },
  {
    id: 3,
    name: "Ibiza",
    category: "Marbre importé",
    categoryGroup: "MARBRE IMPORTÉ",
    origin: "Importé",
    price: "1250 MAD / m²",
    thickness: "2 cm",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1200&auto=format&fit=crop",
    description:
      "Marbre importé clair et lumineux, adapté aux espaces premium et aux finitions haut de gamme.",
    salesModes: {
      customMarble: { enabled: true, label: "Marbre sur mesure", pricePerM2: 1250 },
      standardFloor: {
        enabled: true,
        label: "Sol / formats standards",
        formats: [
          { size: "60×60", pricePerM2: 950 },
          { size: "40×40", pricePerM2: 900 },
          { size: "60×30", pricePerM2: 860 },
        ],
      },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 2 },
    },
  },
  {
    id: 4,
    name: "Marmara",
    category: "Marbre importé",
    categoryGroup: "MARBRE IMPORTÉ",
    origin: "Importé",
    price: "1150 MAD / m²",
    thickness: "2 cm",
    image:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200&auto=format&fit=crop",
    description:
      "Marbre importé à lignes élégantes, idéal pour salles de bain, sols et projets décoratifs.",
    salesModes: {
      customMarble: { enabled: true, label: "Marbre sur mesure", pricePerM2: 1150 },
      standardFloor: {
        enabled: true,
        label: "Sol / formats standards",
        formats: [
          { size: "60×60", pricePerM2: 890 },
          { size: "40×40", pricePerM2: 850 },
          { size: "60×30", pricePerM2: 820 },
        ],
      },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 1.9 },
    },
  },
  {
    id: 5,
    name: "New Calacatta",
    category: "Marbre artificiel",
    categoryGroup: "MARBRE ARTIFICIEL",
    origin: "Quartz / Engineered stone",
    price: "1350 MAD / m²",
    thickness: "2 cm",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
    description:
      "Surface artificielle premium inspirée du Calacatta, idéale pour cuisines, plans vasques et tables.",
    salesModes: {
      customMarble: { enabled: true, label: "Marbre sur mesure", pricePerM2: 1350 },
      standardFloor: { enabled: false, label: "Sol / formats standards", formats: [] },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 2.1 },
    },
  },
  {
    id: 6,
    name: "Quartz Tout Blanc",
    category: "Marbre artificiel",
    categoryGroup: "MARBRE ARTIFICIEL",
    origin: "Quartz / Engineered stone",
    price: "1200 MAD / m²",
    thickness: "2 cm",
    image:
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=1200&auto=format&fit=crop",
    description:
      "Quartz blanc minimaliste, parfait pour cuisines modernes, salles de bain et plans de travail.",
    salesModes: {
      customMarble: { enabled: true, label: "Marbre sur mesure", pricePerM2: 1200 },
      standardFloor: { enabled: false, label: "Sol / formats standards", formats: [] },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 2 },
    },
  },
  {
    id: 7,
    name: "Granite Galaxy",
    category: "Granite",
    categoryGroup: "GRANITE",
    origin: "Importé",
    price: "1100 MAD / m²",
    thickness: "3 cm",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?q=80&w=1200&auto=format&fit=crop",
    description:
      "Granite résistant, parfait pour plans de travail, escaliers, cuisines et usages intensifs.",
    salesModes: {
      customMarble: { enabled: true, label: "Marbre sur mesure", pricePerM2: 1100 },
      standardFloor: {
        enabled: true,
        label: "Sol / formats standards",
        formats: [
          { size: "60×60", pricePerM2: 850 },
          { size: "40×40", pricePerM2: 800 },
          { size: "60×30", pricePerM2: 760 },
        ],
      },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 1.7 },
    },
  },
  {
    id: 8,
    name: "Granite Zimbabwe",
    category: "Granite",
    categoryGroup: "GRANITE",
    origin: "Importé",
    price: "1300 MAD / m²",
    thickness: "3 cm",
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop",
    description:
      "Granite noir hautement résistant, adapté aux plans de cuisine et projets professionnels.",
    salesModes: {
      customMarble: { enabled: true, label: "Marbre sur mesure", pricePerM2: 1300 },
      standardFloor: {
        enabled: true,
        label: "Sol / formats standards",
        formats: [
          { size: "60×60", pricePerM2: 980 },
          { size: "40×40", pricePerM2: 920 },
          { size: "60×30", pricePerM2: 880 },
        ],
      },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 1.8 },
    },
  },
  {
    id: 9,
    name: "Onyxe Honey",
    category: "Onyxe",
    categoryGroup: "ONYXE",
    origin: "Premium",
    price: "2800 MAD / m²",
    thickness: "2 cm",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop",
    description:
      "Onyxe décoratif haut de gamme, conseillé pour murs décoratifs, pièces artistiques et projets luxe.",
    salesModes: {
      customMarble: { enabled: true, label: "Marbre sur mesure", pricePerM2: 2800 },
      standardFloor: { enabled: false, label: "Sol / formats standards", formats: [] },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 2.8 },
    },
  },
  {
    id: 10,
    name: "Table basse en marbre",
    category: "Produits",
    categoryGroup: "PRODUITS",
    origin: "Fabrication sur mesure",
    price: "À partir de 4500 MAD",
    thickness: "Sur mesure",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    description:
      "Table basse fabriquée à partir de marbre sélectionné avec finition premium et design sur mesure.",
    salesModes: {
      customMarble: { enabled: false, label: "Marbre sur mesure", pricePerM2: 0 },
      standardFloor: { enabled: false, label: "Sol / formats standards", formats: [] },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 2.4 },
    },
  },
  {
    id: 11,
    name: "Vasque en marbre",
    category: "Produits",
    categoryGroup: "PRODUITS",
    origin: "Fabrication sur mesure",
    price: "À partir de 3500 MAD",
    thickness: "Sur mesure",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1200&auto=format&fit=crop",
    description:
      "Vasque ou plan vasque en marbre, avec trou robinet, évacuation et finition personnalisée.",
    salesModes: {
      customMarble: { enabled: false, label: "Marbre sur mesure", pricePerM2: 0 },
      standardFloor: { enabled: false, label: "Sol / formats standards", formats: [] },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 2.2 },
    },
  },
  {
    id: 12,
    name: "Receveur en marbre",
    category: "Produits",
    categoryGroup: "PRODUITS",
    origin: "Fabrication sur mesure",
    price: "À partir de 4200 MAD",
    thickness: "Sur mesure",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
    description:
      "Receveur de douche en marbre avec pente, bonde et finition antidérapante selon projet.",
    salesModes: {
      customMarble: { enabled: false, label: "Marbre sur mesure", pricePerM2: 0 },
      standardFloor: { enabled: false, label: "Sol / formats standards", formats: [] },
      fabricatedProduct: { enabled: true, label: "Projet sur mesure", baseMultiplier: 2.3 },
    },
  },
];

export default products;