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

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />

        <Route path="/produits" element={<FabricatedProductDetailsPage />} />
        <Route path="/produits/:id" element={<FabricatedProductDetailsPage />} />

        <Route path="/devis" element={<QuoteRequestPage />} />
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