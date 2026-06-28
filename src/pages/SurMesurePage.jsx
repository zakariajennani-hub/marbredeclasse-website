import { useEffect } from "react";
import { useParams } from "react-router-dom";

import marbles from "../data/marbles";
import MarbleHero from "../components/surMesure/MarbleHero";
import SurMesureCalculator from "../components/surMesure/SurMesureCalculator";

import { trackViewContent } from "../utils/analytics";

import "../components/surMesure/surMesure.css";

export default function SurMesurePage() {
  const { slug } = useParams();

  const marble = marbles.find((item) => item.slug === slug);

  useEffect(() => {
    if (!marble) return;

    trackViewContent({
      productName: marble.name,
      productId: marble.id,
      category: marble.category,
      value: marble.price_per_m2 || 0,
    });
  }, [marble]);

  if (!marble) {
    return (
      <main className="surmesure-page">
        <section className="surmesure-list-container">
          <h1>Marbre introuvable</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="surmesure-page">
      <section className="surmesure-detail-container">
        <MarbleHero marble={marble} />

        <SurMesureCalculator marble={marble} />
      </section>
    </main>
  );
}