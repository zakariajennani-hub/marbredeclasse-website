import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import VasqueConfiguratorPage from "./pages/VasqueConfiguratorPage";
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
import SurMesureListPage from "./pages/SurMesureListPage";
import SurMesurePage from "./pages/SurMesurePage";
import AdminQuotesPage from "./pages/AdminQuotesPage";
import ChairsPage from "./pages/ChairsPage";

import { initAnalytics, trackPageView } from "./utils/analytics";
import { initClarity } from "./utils/clarity";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname, location.search]);

  return null;
}

function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location.pathname, location.search]);

  return null;
}

export default function App() {
  useEffect(() => {
    initAnalytics();
    initClarity();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteChangeTracker />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
<Route
  path="/vasques/configurateur"
  element={<VasqueConfiguratorPage />}
/>
        <Route path="/sur-mesure" element={<SurMesureListPage />} />
        <Route path="/sur-mesure/:slug" element={<SurMesurePage />} />

        <Route path="/produits" element={<FabricatedProductDetailsPage />} />
        <Route path="/produits/:id" element={<FabricatedProductDetailsPage />} />

        <Route path="/devis" element={<QuoteRequestPage />} />
        <Route path="/devis-success" element={<DevisSuccessPage />} />

        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/qui-sommes-nous" element={<AboutPage />} />

        <Route path="/admin/quotes" element={<AdminQuotesPage />} />

        <Route
          path="/politique-confidentialite"
          element={<PrivacyPolicyPage />}
        />
        <Route path="/conditions-utilisation" element={<TermsPage />} />

        <Route path="/chaises" element={<ChairsPage />} />
        <Route path="/chaises/:chairId" element={<ChairsPage />} />
      </Routes>
    </BrowserRouter>
  );
}