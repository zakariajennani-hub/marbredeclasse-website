const PIXEL_ID = "864493949510284";
const DEFAULT_CURRENCY = "MAD";

const isBrowser = () => typeof window !== "undefined";

const hasPixel = () => isBrowser() && typeof window.fbq === "function";

const track = (eventName, data = {}) => {
  if (!hasPixel()) return;
  window.fbq("track", eventName, data);
};

const trackCustom = (eventName, data = {}) => {
  if (!hasPixel()) return;
  window.fbq("trackCustom", eventName, data);
};

export const initPixel = () => {
  if (!isBrowser()) return;

  if (!window.fbq) {
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );

    window.fbq("init", PIXEL_ID);
  }

  trackPageView();
};

export const trackPageView = () => {
  track("PageView");
};

export const trackViewContent = ({
  productName = "Marbre De Classe Product",
  productId = "",
  category = "",
  value = 0,
} = {}) => {
  track("ViewContent", {
    content_name: productName,
    content_ids: productId ? [String(productId)] : undefined,
    content_category: category,
    value,
    currency: DEFAULT_CURRENCY,
  });
};

export const trackLead = ({
  source = "devis",
  value = 0,
  city = "",
  productName = "",
} = {}) => {
  track("Lead", {
    content_name: productName || "Demande de devis",
    content_category: source,
    value,
    currency: DEFAULT_CURRENCY,
    city,
  });
};

export const trackContact = ({
  method = "whatsapp",
  source = "",
  productName = "",
} = {}) => {
  track("Contact", {
    content_name: productName || "Contact Marbre De Classe",
    content_category: source,
    contact_method: method,
  });
};

export const trackWhatsAppClick = (data = {}) => {
  trackContact({
    method: "whatsapp",
    ...data,
  });

  trackCustom("WhatsAppClick", data);
};

export const trackPhoneClick = (data = {}) => {
  trackContact({
    method: "phone",
    ...data,
  });

  trackCustom("PhoneClick", data);
};

export const trackAddToCart = ({
  value = 0,
  productName = "",
  productId = "",
  quantity = 1,
  category = "",
} = {}) => {
  track("AddToCart", {
    content_name: productName || "Produit ajouté au devis",
    content_ids: productId ? [String(productId)] : undefined,
    content_category: category,
    value,
    currency: DEFAULT_CURRENCY,
    quantity,
  });
};

export const trackInitiateCheckout = ({
  value = 0,
  itemsCount = 1,
  source = "devis",
} = {}) => {
  track("InitiateCheckout", {
    value,
    currency: DEFAULT_CURRENCY,
    num_items: itemsCount,
    content_category: source,
  });
};

export const trackPurchase = ({
  value = 0,
  orderId = "",
  itemsCount = 1,
} = {}) => {
  track("Purchase", {
    value,
    currency: DEFAULT_CURRENCY,
    order_id: orderId,
    num_items: itemsCount,
  });
};

export const trackSearch = ({ searchTerm = "" } = {}) => {
  track("Search", {
    search_string: searchTerm,
  });
};

export const trackCompleteRegistration = ({ method = "website" } = {}) => {
  track("CompleteRegistration", {
    registration_method: method,
  });
};

export const trackCustomEvent = (eventName, data = {}) => {
  trackCustom(eventName, data);
};