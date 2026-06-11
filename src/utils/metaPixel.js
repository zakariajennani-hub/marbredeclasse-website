import ReactPixel from "react-facebook-pixel";

const pixelId = "864493949510284";

export const initPixel = () => {
  ReactPixel.init(pixelId);
  ReactPixel.pageView();
};

export const trackPageView = () => {
  ReactPixel.pageView();
};

export const trackLead = () => {
  ReactPixel.track("Lead");
};

export const trackViewContent = (productName) => {
  ReactPixel.track("ViewContent", {
    content_name: productName,
  });
};

export const trackWhatsAppClick = () => {
  ReactPixel.trackCustom("WhatsAppClick");
};

export const trackAddToCart = (value) => {
  ReactPixel.track("AddToCart", {
    value,
    currency: "MAD",
  });
};