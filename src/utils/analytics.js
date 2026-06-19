const PIXEL_ID = "864493949510284";
const DEFAULT_CURRENCY = "MAD";

const isBrowser = () => typeof window !== "undefined";

const hasFbq = () => isBrowser() && typeof window.fbq === "function";
const hasGtag = () => isBrowser() && typeof window.gtag === "function";

const cleanObject = (obj = {}) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      return value !== undefined && value !== null && value !== "";
    })
  );
};

const ensureDataLayer = () => {
  if (!isBrowser()) return;
  window.dataLayer = window.dataLayer || [];
};

const pushDataLayer = (eventName, data = {}) => {
  if (!isBrowser()) return;

  ensureDataLayer();

  window.dataLayer.push({
    event: eventName,
    ...cleanObject(data),
  });
};

const trackGA4 = (eventName, data = {}) => {
  if (!hasGtag()) return;

  window.gtag("event", eventName, cleanObject(data));
};

const trackMeta = (eventName, data = {}) => {
  if (!hasFbq()) return;

  window.fbq("track", eventName, cleanObject(data));
};

const trackMetaCustom = (eventName, data = {}) => {
  if (!hasFbq()) return;

  window.fbq("trackCustom", eventName, cleanObject(data));
};

const trackAll = ({
  dataLayerEvent,
  ga4Event,
  metaEvent,
  metaCustomEvent,
  dataLayerData = {},
  ga4Data = {},
  metaData = {},
}) => {
  if (dataLayerEvent) {
    pushDataLayer(dataLayerEvent, dataLayerData);
  }

  if (ga4Event) {
    trackGA4(ga4Event, ga4Data);
  }

  if (metaEvent) {
    trackMeta(metaEvent, metaData);
  }

  if (metaCustomEvent) {
    trackMetaCustom(metaCustomEvent, metaData);
  }
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
  if (!isBrowser()) return;

  const pageData = {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
  };

  trackAll({
    dataLayerEvent: "virtual_page_view",
    ga4Event: "page_view",
    metaEvent: "PageView",
    dataLayerData: pageData,
    ga4Data: pageData,
    metaData: {},
  });
};

export const trackViewContent = ({
  productName = "Marbre De Classe Product",
  productId = "",
  category = "",
  value = 0,
} = {}) => {
  const item = cleanObject({
    item_id: productId,
    item_name: productName,
    item_category: category,
  });

  const ga4Data = {
    currency: DEFAULT_CURRENCY,
    value,
    items: [item],
  };

  const metaData = {
    content_name: productName,
    content_ids: productId ? [String(productId)] : undefined,
    content_category: category,
    value,
    currency: DEFAULT_CURRENCY,
  };

  trackAll({
    dataLayerEvent: "view_item",
    ga4Event: "view_item",
    metaEvent: "ViewContent",
    dataLayerData: ga4Data,
    ga4Data,
    metaData,
  });
};

export const trackAddToCart = ({
  value = 0,
  productName = "",
  productId = "",
  quantity = 1,
  category = "",
} = {}) => {
  const item = cleanObject({
    item_id: productId,
    item_name: productName || "Produit ajouté au devis",
    item_category: category,
    quantity,
  });

  const ga4Data = {
    currency: DEFAULT_CURRENCY,
    value,
    items: [item],
  };

  const metaData = {
    content_name: productName || "Produit ajouté au devis",
    content_ids: productId ? [String(productId)] : undefined,
    content_category: category,
    value,
    currency: DEFAULT_CURRENCY,
    quantity,
  };

  trackAll({
    dataLayerEvent: "add_to_cart",
    ga4Event: "add_to_cart",
    metaEvent: "AddToCart",
    dataLayerData: ga4Data,
    ga4Data,
    metaData,
  });
};

export const trackInitiateCheckout = ({
  value = 0,
  itemsCount = 1,
  source = "devis",
} = {}) => {
  const ga4Data = {
    currency: DEFAULT_CURRENCY,
    value,
    items_count: itemsCount,
    source,
  };

  const metaData = {
    value,
    currency: DEFAULT_CURRENCY,
    num_items: itemsCount,
    content_category: source,
  };

  trackAll({
    dataLayerEvent: "begin_checkout",
    ga4Event: "begin_checkout",
    metaEvent: "InitiateCheckout",
    dataLayerData: ga4Data,
    ga4Data,
    metaData,
  });
};

export const trackLead = ({
  source = "devis",
  value = 0,
  city = "",
  productName = "",
} = {}) => {
  const ga4Data = {
    currency: DEFAULT_CURRENCY,
    value,
    source,
    city,
    product_name: productName,
  };

  const metaData = {
    content_name: productName || "Demande de devis",
    content_category: source,
    value,
    currency: DEFAULT_CURRENCY,
    city,
  };

  trackAll({
    dataLayerEvent: "generate_lead",
    ga4Event: "generate_lead",
    metaEvent: "Lead",
    dataLayerData: ga4Data,
    ga4Data,
    metaData,
  });
};

export const trackContact = ({
  method = "whatsapp",
  source = "",
  productName = "",
  value = 0,
  city = "",
} = {}) => {
  const ga4Data = {
    method,
    source,
    product_name: productName,
    value,
    currency: DEFAULT_CURRENCY,
    city,
  };

  const metaData = {
    content_name: productName || "Contact Marbre De Classe",
    content_category: source,
    contact_method: method,
    value,
    currency: DEFAULT_CURRENCY,
    city,
  };

  trackAll({
    dataLayerEvent: "contact",
    ga4Event: "contact",
    metaEvent: "Contact",
    dataLayerData: ga4Data,
    ga4Data,
    metaData,
  });
};

export const trackWhatsAppClick = (data = {}) => {
  const payload = {
    method: "whatsapp",
    ...data,
  };

  trackContact(payload);

  trackAll({
    dataLayerEvent: "whatsapp_click",
    ga4Event: "whatsapp_click",
    metaCustomEvent: "WhatsAppClick",
    dataLayerData: payload,
    ga4Data: payload,
    metaData: payload,
  });
};

export const trackPhoneClick = (data = {}) => {
  const payload = {
    method: "phone",
    ...data,
  };

  trackContact(payload);

  trackAll({
    dataLayerEvent: "phone_click",
    ga4Event: "phone_click",
    metaCustomEvent: "PhoneClick",
    dataLayerData: payload,
    ga4Data: payload,
    metaData: payload,
  });
};

export const trackPurchase = ({
  value = 0,
  orderId = "",
  itemsCount = 1,
} = {}) => {
  const ga4Data = {
    transaction_id: orderId,
    currency: DEFAULT_CURRENCY,
    value,
    items_count: itemsCount,
  };

  const metaData = {
    value,
    currency: DEFAULT_CURRENCY,
    order_id: orderId,
    num_items: itemsCount,
  };

  trackAll({
    dataLayerEvent: "purchase",
    ga4Event: "purchase",
    metaEvent: "Purchase",
    dataLayerData: ga4Data,
    ga4Data,
    metaData,
  });
};

export const trackSearch = ({ searchTerm = "" } = {}) => {
  const ga4Data = {
    search_term: searchTerm,
  };

  const metaData = {
    search_string: searchTerm,
  };

  trackAll({
    dataLayerEvent: "search",
    ga4Event: "search",
    metaEvent: "Search",
    dataLayerData: ga4Data,
    ga4Data,
    metaData,
  });
};

export const trackCompleteRegistration = ({ method = "website" } = {}) => {
  const ga4Data = {
    method,
  };

  const metaData = {
    registration_method: method,
  };

  trackAll({
    dataLayerEvent: "sign_up",
    ga4Event: "sign_up",
    metaEvent: "CompleteRegistration",
    dataLayerData: ga4Data,
    ga4Data,
    metaData,
  });
};

export const trackCustomEvent = (eventName, data = {}) => {
  trackAll({
    dataLayerEvent: eventName,
    ga4Event: eventName,
    metaCustomEvent: eventName,
    dataLayerData: data,
    ga4Data: data,
    metaData: data,
  });
};