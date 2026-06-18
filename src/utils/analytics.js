const PIXEL_ID = "864493949510284";
const DEFAULT_CURRENCY = "MAD";

const isBrowser = () => typeof window !== "undefined";

const hasFbq = () => isBrowser() && typeof window.fbq === "function";

const ensureDataLayer = () => {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
};

const pushDataLayer = (eventName, data = {}) => {
  if (!isBrowser()) return;
  ensureDataLayer();

  window.dataLayer.push({
    event: eventName,
    ...data,
  });
};

const trackMeta = (eventName, data = {}) => {
  if (!hasFbq()) return;
  window.fbq("track", eventName, data);
};

const trackMetaCustom = (eventName, data = {}) => {
  if (!hasFbq()) return;
  window.fbq("trackCustom", eventName, data);
};

export const initAnalytics = () => {
  if (!isBrowser()) return;

  ensureDataLayer();

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
  trackMeta("PageView");

  pushDataLayer("virtual_page_view", {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
  });
};

export const trackViewContent = ({
  productName = "Marbre De Classe Product",
  productId = "",
  category = "",
  value = 0,
} = {}) => {
  const data = {
    content_name: productName,
    content_ids: productId ? [String(productId)] : undefined,
    content_category: category,
    value,
    currency: DEFAULT_CURRENCY,
  };

  trackMeta("ViewContent", data);

  pushDataLayer("view_item", {
    item_name: productName,
    item_id: productId,
    item_category: category,
    value,
    currency: DEFAULT_CURRENCY,
  });
};

export const trackAddToCart = ({
  value = 0,
  productName = "",
  productId = "",
  quantity = 1,
  category = "",
} = {}) => {
  const data = {
    content_name: productName || "Produit ajouté au devis",
    content_ids: productId ? [String(productId)] : undefined,
    content_category: category,
    value,
    currency: DEFAULT_CURRENCY,
    quantity,
  };

  trackMeta("AddToCart", data);

  pushDataLayer("add_to_cart", {
    item_name: productName,
    item_id: productId,
    item_category: category,
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
  const data = {
    value,
    currency: DEFAULT_CURRENCY,
    num_items: itemsCount,
    content_category: source,
  };

  trackMeta("InitiateCheckout", data);

  pushDataLayer("begin_checkout", {
    value,
    currency: DEFAULT_CURRENCY,
    items_count: itemsCount,
    source,
  });
};

export const trackLead = ({
  source = "devis",
  value = 0,
  city = "",
  productName = "",
} = {}) => {
  const data = {
    content_name: productName || "Demande de devis",
    content_category: source,
    value,
    currency: DEFAULT_CURRENCY,
    city,
  };

  trackMeta("Lead", data);

  pushDataLayer("generate_lead", {
    source,
    value,
    currency: DEFAULT_CURRENCY,
    city,
    product_name: productName,
  });
};

export const trackContact = ({
  method = "whatsapp",
  source = "",
  productName = "",
} = {}) => {
  const data = {
    content_name: productName || "Contact Marbre De Classe",
    content_category: source,
    contact_method: method,
  };

  trackMeta("Contact", data);

  pushDataLayer("contact", {
    method,
    source,
    product_name: productName,
  });
};

export const trackWhatsAppClick = (data = {}) => {
  trackContact({
    method: "whatsapp",
    ...data,
  });

  trackMetaCustom("WhatsAppClick", data);

  pushDataLayer("whatsapp_click", data);
};

export const trackPhoneClick = (data = {}) => {
  trackContact({
    method: "phone",
    ...data,
  });

  trackMetaCustom("PhoneClick", data);

  pushDataLayer("phone_click", data);
};

export const trackPurchase = ({
  value = 0,
  orderId = "",
  itemsCount = 1,
} = {}) => {
  const data = {
    value,
    currency: DEFAULT_CURRENCY,
    order_id: orderId,
    num_items: itemsCount,
  };

  trackMeta("Purchase", data);

  pushDataLayer("purchase", {
    value,
    currency: DEFAULT_CURRENCY,
    order_id: orderId,
    items_count: itemsCount,
  });
};

export const trackSearch = ({ searchTerm = "" } = {}) => {
  trackMeta("Search", {
    search_string: searchTerm,
  });

  pushDataLayer("search", {
    search_term: searchTerm,
  });
};

export const trackCompleteRegistration = ({ method = "website" } = {}) => {
  trackMeta("CompleteRegistration", {
    registration_method: method,
  });

  pushDataLayer("sign_up", {
    method,
  });
};

export const trackCustomEvent = (eventName, data = {}) => {
  trackMetaCustom(eventName, data);
  pushDataLayer(eventName, data);
};