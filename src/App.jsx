import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./modules/layout/Navbar";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import QuoteRequestPage from "./pages/QuoteRequestPage";
import ContactPage from "./pages/ContactPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import FabricatedProductDetailsPage from "./pages/FabricatedProductDetailsPage";
import DevisSuccessPage from "./pages/DevisSuccessPage";

import { initPixel } from "./utils/metaPixel";
import { initClarity } from "./utils/clarity";

export default function App() {
  useEffect(() => {
    initPixel();
    initClarity();
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />

        <Route path="/produits" element={<FabricatedProductDetailsPage />} />
        <Route
          path="/produits/:id"
          element={<FabricatedProductDetailsPage />}
        />

        <Route path="/devis" element={<QuoteRequestPage />} />
        <Route path="/devis-success" element={<DevisSuccessPage />} />

        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="/qui-sommes-nous" element={<AboutPage />} />

        <Route
          path="/politique-confidentialite"
          element={<PrivacyPolicyPage />}
        />

        <Route path="/conditions-utilisation" element={<TermsPage />} />
      </Routes>
    </BrowserRouter>
  );
}