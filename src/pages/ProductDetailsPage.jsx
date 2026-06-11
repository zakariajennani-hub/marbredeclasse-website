import { useEffect } from "react";
import { useParams } from "react-router-dom";

import products from "../data/productsData";
import ProductHeroGallery from "../modules/products/ProductHeroGallery";
import StandardFloorCalculator from "../modules/calculator/StandardFloorCalculator";
import BackButton from "../modules/layout/BackButton";

import { trackViewContent } from "../utils/metaPixel";

import "./ProductDetailsPage.css";

export default function ProductDetailsPage() {
  const { id } = useParams();

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  useEffect(() => {
    if (!product) return;

    trackViewContent({
      productName: product.name,
      productId: product.id,
      category: product.category || "",
      value: product.pricePerM2 || 0,
    });
  }, [product]);

  if (!product) {
    return (
      <main className="product-details-page">
        <BackButton label="Retour aux produits" />

        <section className="product-not-found">
          <h1>Produit introuvable</h1>
          <p>Ce produit n’existe pas ou a été supprimé.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <BackButton label="Retour aux produits" />

      <ProductHeroGallery product={product} />

      <StandardFloorCalculator product={product} />
    </main>
  );
}