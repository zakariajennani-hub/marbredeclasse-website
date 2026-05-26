import { useState } from "react";

import "./ContactPage.css";

const WHATSAPP_NUMBER = "212604982455";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    projectType: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendWhatsApp = () => {
    const text = `
Bonjour MARBRE DE CLASSE,

Je souhaite envoyer une demande de contact.

Nom complet : ${form.name || "-"}
Téléphone : ${form.phone || "-"}
Type de projet : ${form.projectType || "-"}
Message : ${form.message || "-"}
    `.trim();

    const encodedText = encodeURIComponent(text);

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`,
      "_blank"
    );
  };

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <span>CONTACT</span>
        <h1>Contactez-nous</h1>
        <p>
          Besoin d’un devis, d’un conseil ou d’un accompagnement pour votre
          projet en marbre ? Notre équipe vous répond rapidement.
        </p>
      </section>

      <section className="contact-content">
        <div className="contact-card contact-info">
          <span>MARBRE DE CLASSE</span>
          <h2>Parlez-nous de votre projet</h2>

          <div className="contact-line">
            <strong>WhatsApp</strong>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
            >
              +212 604 982 455
            </a>
          </div>

          <div className="contact-line">
            <strong>Email</strong>
            <a href="mailto:contact@marbredeclasse.com">
              contact@marbredeclasse.com
            </a>
          </div>

          <div className="contact-line">
            <strong>Adresse</strong>
            <p>Rabat, Maroc</p>
          </div>

          <a
            className="contact-whatsapp-btn"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20MARBRE%20DE%20CLASSE%2C%20je%20souhaite%20avoir%20des%20informations%20sur%20un%20projet%20en%20marbre.`}
            target="_blank"
            rel="noreferrer"
          >
            Écrire sur WhatsApp
          </a>
        </div>

        <form className="contact-card contact-form">
          <label>
            Nom complet
            <input
              type="text"
              name="name"
              placeholder="Votre nom"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Téléphone
            <input
              type="tel"
              name="phone"
              placeholder="+212..."
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Type de projet
            <select
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
            >
              <option value="" disabled>
                Choisir un type
              </option>
              <option>Sol en marbre</option>
              <option>Plan de cuisine</option>
              <option>Vasque / salle de bain</option>
              <option>Table ou décoration</option>
              <option>Autre projet</option>
            </select>
          </label>

          <label>
            Message
            <textarea
              name="message"
              placeholder="Décrivez votre besoin..."
              rows="5"
              value={form.message}
              onChange={handleChange}
            />
          </label>

          <button type="button" onClick={handleSendWhatsApp}>
            Envoyer la demande
          </button>
        </form>
      </section>
    </main>
  );
}