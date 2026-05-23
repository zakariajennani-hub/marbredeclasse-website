import { useState } from "react";

import "./HomeFAQ.css";

const faqData = [
  {
    question: "Comment est calculé le prix du marbre ?",
    answer:
      "Le prix dépend du type de marbre, de l’épaisseur, des dimensions, des découpes, des finitions et des options comme la pose ou la livraison.",
  },

  {
    question: "Quelle est la différence entre marbre standard et sur mesure ?",
    answer:
      "Le format standard concerne des pièces déjà découpées comme 60×60 ou 40×40. Le sur mesure permet de commander des dimensions personnalisées avec finitions spécifiques.",
  },

  {
    question: "Livrez-vous partout au Maroc ?",
    answer:
      "Oui, nous assurons la livraison dans plusieurs villes du Maroc selon le type de produit et la quantité commandée.",
  },

  {
    question: "Puis-je commander une table ou une vasque personnalisée ?",
    answer:
      "Oui, nous réalisons des tables, vasques, receveurs et autres produits décoratifs sur mesure selon votre projet.",
  },
];

export default function HomeFAQ() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="home-faq">
      <div className="faq-header">
        <span>FAQ</span>

        <h2>Questions fréquentes</h2>
      </div>

      <div className="faq-list">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={
              activeIndex === index
                ? "faq-item active"
                : "faq-item"
            }
          >
            <button
              className="faq-question"
              onClick={() =>
                setActiveIndex(
                  activeIndex === index
                    ? null
                    : index
                )
              }
            >
              <span>{item.question}</span>

              <strong>
                {activeIndex === index
                  ? "−"
                  : "+"}
              </strong>
            </button>

            {activeIndex === index && (
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}