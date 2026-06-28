const createImages = (folder) => ({
  cover_image: `/images/marbles/${folder}/marble.webp`,
  gallery: [
    {
      type: "floor",
      label: "Sol",
      image: `/images/marbles/${folder}/floor.webp`,
    },
    {
      type: "kitchen",
      label: "Cuisine",
      image: `/images/marbles/${folder}/kitchen_worktop.webp`,
    },
    {
      type: "bathroom",
      label: "Salle de bain",
      image: `/images/marbles/${folder}/washbasin.webp`,
    },
    {
      type: "stairs",
      label: "Escalier",
      image: `/images/marbles/${folder}/stairs.webp`,
    },
  ],
});

const createMarble = ({
  id,
  slug,
  name,
  category,
  price_per_m2,
  badge = "",
  description,
  folder,
}) => ({
  id,
  slug,
  name,
  category,
  price_per_m2,
  is_active: true,
  badge,
  description,
  folder,
  ...createImages(folder),
});

const marbles = [
  createMarble({
    id: "galaxy-granite",
    slug: "galaxy-granite",
    name: "Galaxy",
    category: "GRANITE",
    price_per_m2: 989,
    badge: "Best seller",
    folder: "galaxy",
    description:
      "Granite Galaxy élégant, résistant et adapté aux plans de travail, escaliers, sols et projets sur mesure.",
  }),

  createMarble({
    id: "white",
    slug: "white",
    name: "White",
    category: "QUARTZ",
    price_per_m2: 950,
    folder: "quartz-white",
    description:
      "Quartz blanc pur sans veinage, idéal pour les cuisines modernes, plans de travail et surfaces minimalistes.",
  }),

  createMarble({
    id: "calacatta-gold",
    slug: "calacatta-gold",
    name: "Calacatta Gold",
    category: "QUARTZ",
    price_per_m2: 990,
    badge: "Best seller",
    folder: "calacatta-gold",
    description:
      "Quartz Calacatta Gold avec veinage élégant, idéal pour les cuisines, salles de bain et plans haut de gamme.",
  }),

  createMarble({
    id: "calacatta-gris",
    slug: "calacatta-gris",
    name: "Calacatta Gris",
    category: "QUARTZ",
    price_per_m2: 950,
    folder: "calacatta-gris",
    description:
      "Quartz Calacatta Gris aux tons doux et lumineux, adapté aux projets modernes et chaleureux.",
  }),

  createMarble({
    id: "calacatta-marron",
    slug: "calacatta-marron",
    name: "Calacatta Marron",
    category: "QUARTZ",
    price_per_m2: 1150,
    badge: "Premium",
    folder: "calacatta-marron",
    description:
      "Quartz Calacatta Marron avec des nuances chaleureuses et un rendu haut de gamme.",
  }),

  createMarble({
    id: "calacatta-panda",
    slug: "calacatta-panda",
    name: "Calacatta Panda",
    category: "QUARTZ",
    price_per_m2: 1150,
    badge: "Premium",
    folder: "calacatta-panda",
    description:
      "Quartz Calacatta Panda au contraste marqué, parfait pour les cuisines et projets décoratifs modernes.",
  }),

  createMarble({
    id: "beige",
    slug: "beige",
    name: "Beige",
    category: "QUARTZ",
    price_per_m2: 950,
    folder: "beige",
    description:
      "Quartz Beige avec une teinte naturelle et douce, idéal pour les espaces élégants.",
  }),

  createMarble({
    id: "gris-clair",
    slug: "gris-clair",
    name: "Gris Clair",
    category: "QUARTZ",
    price_per_m2: 1150,
    badge: "Clair",
    folder: "gris-clair",
    description:
      "Quartz Gris clair, sobre et contemporain pour des projets élégants.",
  }),

  createMarble({
    id: "gris-fonce",
    slug: "gris-fonce",
    name: "Gris Foncé",
    category: "QUARTZ",
    price_per_m2: 1150,
    badge: "Foncé",
    folder: "gris-foncé",
    description:
      "Quartz Gris foncé avec finition brillante et rendu lumineux haut de gamme.",
  }),
];

export default marbles;