import blancIbiza from "../assets/products/blanc-ibiza.jpg";
import beigePerlatino from "../assets/products/beige-perlatino.jpg";
import crema from "../assets/products/crema.jpg";

import grisWhite from "../assets/products/gris-white.jpg";
import noirWhite from "../assets/products/noir-white.jpg";
import bejaad from "../assets/products/bejaad.jpg";
import tazaBeige from "../assets/products/taza-beige.jpg";
import tazaGris from "../assets/products/taza-gris.jpg";
import travertin from "../assets/products/travertin-brut.jpg";
import grisRoyal from "../assets/products/gris-royal.jpg";
import beigeSilvia from "../assets/products/beige-silvia.jpeg";

const buildProduct = ({
  id,
  name,
  category,
  categoryLabel,
  image,
  color,
  origin,
  finishes,
  description,
}) => {
  const allFormats = finishes.flatMap((finish) =>
    finish.formats.map((format) => ({
      ...format,
      finish: finish.name,
    }))
  );

  const minPrice = Math.min(...allFormats.map((format) => format.pricePerM2));

  return {
    id,
    name,
    category,
    categoryLabel,
    image,
    price: minPrice,
    unit: "m²",
    thickness: "2 cm",
    color,
    origin,
    description,
    finishes,
    salesModes: {
      standardFloor: {
        enabled: true,
        formats: allFormats,
      },
    },
  };
};

const products = [
  buildProduct({
    id: "blanc-ibiza",
    name: "Ibiza",
    category: "MARBRE IMPORTÉ",
    categoryLabel: "MARBRE IMPORTÉ",
    image: blancIbiza,
    color: "Blanc",
    origin: "Importé",
    description: "Marbre blanc importé, élégant et lumineux.",
    finishes: [
      {
        name: "Poli",
        formats: [
          { size: "30x30", pricePerM2: 270 },
          { size: "40x30", pricePerM2: 280 },
          { size: "50x30", pricePerM2: 295 },
          { size: "60x30", pricePerM2: 380 },
          { size: "40x40", pricePerM2: 340 },
          { size: "60x40", pricePerM2: 370 },
          { size: "60x60", pricePerM2: 560 },
          { size: "120x60", pricePerM2: 590 },
          { size: "120x33", pricePerM2: 510 },
        ],
      },
      {
        name: "Brut",
        formats: [
          { size: "30x30", pricePerM2: 230 },
          { size: "40x30", pricePerM2: 250 },
          { size: "50x30", pricePerM2: 265 },
          { size: "60x30", pricePerM2: 350 },
          { size: "40x40", pricePerM2: 300 },
          { size: "60x40", pricePerM2: 320 },
          { size: "60x60", pricePerM2: 510 },
          { size: "120x60", pricePerM2: 540 },
          { size: "120x33", pricePerM2: 480 },
        ],
      },
    ],
  }),

  buildProduct({
    id: "beige-perlatino",
    name: "Beige Perlatino",
    category: "MARBRE IMPORTÉ",
    categoryLabel: "MARBRE IMPORTÉ",
    image: beigePerlatino,
    color: "Beige",
    origin: "Importé",
    description: "Marbre beige importé avec un rendu chaleureux.",
    finishes: [
      {
        name: "Poli",
        formats: [
          { size: "60x30", pricePerM2: 395 },
          { size: "40x40", pricePerM2: 390 },
          { size: "60x60", pricePerM2: 665 },
        ],
      },
      {
        name: "Brut",
        formats: [
          { size: "30x30", pricePerM2: 240 },
          { size: "40x30", pricePerM2: 250 },
          { size: "50x30", pricePerM2: 295 },
        ],
      },
    ],
  }),

  buildProduct({
    id: "crema",
    name: "Crema",
    category: "MARBRE IMPORTÉ",
    categoryLabel: "MARBRE IMPORTÉ",
    image: crema,
    color: "Beige",
    origin: "Importé",
    description: "Marbre crème importé, sobre et lumineux.",
    finishes: [
      {
        name: "Poli",
        formats: [
          { size: "60x30", pricePerM2: 455 },
          { size: "40x40", pricePerM2: 450 },
          { size: "60x60", pricePerM2: 665 },
        ],
      },
      {
        name: "Brut",
        formats: [
          { size: "30x30", pricePerM2: 195 },
          { size: "40x30", pricePerM2: 200 },
          { size: "40x40", pricePerM2: 210 },
          { size: "60x30", pricePerM2: 330 },
          { size: "60x60", pricePerM2: 505 },
        ],
      },
    ],
  }),

  buildProduct({
    id: "gris-white",
    name: "Gris White",
    category: "MARBRE MAROCAIN",
    categoryLabel: "MARBRE LOCAL",
    image: grisWhite,
    color: "Gris",
    origin: "Maroc",
    description: "Marbre local gris clair pour sols et projets modernes.",
    finishes: [
      { name: "Poli", formats: [{ size: "60x30", pricePerM2: 230 }] },
      { name: "Brut", formats: [{ size: "60x30", pricePerM2: 185 }] },
    ],
  }),

  buildProduct({
    id: "noir-white",
    name: "Noir White",
    category: "MARBRE MAROCAIN",
    categoryLabel: "MARBRE LOCAL",
    image: noirWhite,
    color: "Noir",
    origin: "Maroc",
    description: "Marbre local noir avec veines blanches.",
    finishes: [
      { name: "Poli", formats: [{ size: "60x30", pricePerM2: 250 }] },
      { name: "Brut", formats: [{ size: "60x30", pricePerM2: 195 }] },
    ],
  }),

  buildProduct({
    id: "bejaad",
    name: "Bejaad",
    category: "MARBRE MAROCAIN",
    categoryLabel: "MARBRE LOCAL",
    image: bejaad,
    color: "Jaune",
    origin: "Maroc",
    description: "Marbre local jaune/beige, chaleureux et naturel.",
    finishes: [
      { name: "Poli", formats: [{ size: "60x30", pricePerM2: 250 }] },
      { name: "Brut", formats: [{ size: "60x30", pricePerM2: 195 }] },
    ],
  }),

  buildProduct({
    id: "taza-beige",
    name: "Taza Beige",
    category: "MARBRE MAROCAIN",
    categoryLabel: "MARBRE LOCAL",
    image: tazaBeige,
    color: "Beige",
    origin: "Maroc",
    description: "Pierre locale beige de Taza.",
    finishes: [
      { name: "Poli", formats: [{ size: "60x30", pricePerM2: 220 }] },
      { name: "Brut", formats: [{ size: "60x30", pricePerM2: 175 }] },
    ],
  }),

  buildProduct({
    id: "taza-gris",
    name: "Taza Gris",
    category: "MARBRE MAROCAIN",
    categoryLabel: "MARBRE LOCAL",
    image: tazaGris,
    color: "Gris",
    origin: "Maroc",
    description: "Pierre locale grise de Taza.",
    finishes: [
      { name: "Poli", formats: [{ size: "60x30", pricePerM2: 220 }] },
      { name: "Brut", formats: [{ size: "60x30", pricePerM2: 175 }] },
    ],
  }),

  buildProduct({
    id: "travertin",
    name: "Travertin",
    category: "MARBRE MAROCAIN",
    categoryLabel: "MARBRE LOCAL",
    image: travertin,
    color: "Beige",
    origin: "Maroc",
    description: "Travertin naturel beige.",
    finishes: [
      { name: "Poli", formats: [{ size: "60x30", pricePerM2: 280 }] },
      { name: "Brut", formats: [{ size: "60x30", pricePerM2: 210 }] },
    ],
  }),

  buildProduct({
    id: "gris-royal",
    name: "Gris Royal",
    category: "MARBRE MAROCAIN",
    categoryLabel: "MARBRE LOCAL",
    image: grisRoyal,
    color: "Gris",
    origin: "Maroc",
    description: "Marbre local gris royal.",
    finishes: [
      { name: "Poli", formats: [{ size: "60x30", pricePerM2: 240 }] },
      { name: "Brut", formats: [{ size: "60x30", pricePerM2: 190 }] },
    ],
  }),

  buildProduct({
    id: "beige-silvia",
    name: "Beige Silvia",
    category: "MARBRE MAROCAIN",
    categoryLabel: "MARBRE LOCAL",
    image: beigeSilvia,
    color: "Beige",
    origin: "Maroc",
    description: "Marbre beige local avec veinage doux.",
    finishes: [
      {
        name: "Poli",
        formats: [
          { size: "60x30", pricePerM2: 185 },
          { size: "40x40", pricePerM2: 175 },
        ],
      },
      {
        name: "Brut",
        formats: [
          { size: "30x30", pricePerM2: 165 },
          { size: "40x30", pricePerM2: 155 },
        ],
      },
    ],
  }),
];

export default products;