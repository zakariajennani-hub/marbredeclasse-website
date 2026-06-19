const PIXEL_ID = "864493949510284";
const DEFAULT_CURRENCY = "MAD";

const isBrowser = () => typeof window !== "undefined";

const hasFbq = () => isBrowser() && typeof window.fbq === "function";

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
  metaEvent,
  metaCustomEvent,
  dataLayerData = {},
  metaData = {},
}) => {
  if (dataLayerEvent) {
    pushDataLayer(dataLayerEvent, dataLayerData);
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
    metaEvent: "PageView",
    dataLayerData: pageData,
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
    price: value,
    quantity: 1,
  });

  const dataLayerData = {
    currency: DEFAULT_CURRENCY,
    value,
    items: [item],
    item_id: productId,
    item_name: productName,
    item_category: category,
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
    metaEvent: "ViewContent",
    dataLayerData,
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
    price: value,
    quantity,
  });

  const dataLayerData = {
    currency: DEFAULT_CURRENCY,
    value,
    items: [item],
    item_id: productId,
    item_name: productName || "Produit ajouté au devis",
    item_category: category,
    quantity,
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
    metaEvent: "AddToCart",
    dataLayerData,
    metaData,
  });
};

export const trackInitiateCheckout = ({
  value = 0,
  itemsCount = 1,
  source = "devis",
} = {}) => {
  const dataLayerData = {
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
    metaEvent: "InitiateCheckout",
    dataLayerData,
    metaData,
  });
};

export const trackLead = ({
  source = "devis",
  value = 0,
  city = "",
  productName = "",
} = {}) => {
  const dataLayerData = {
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
    metaEvent: "Lead",
    dataLayerData,
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
  const dataLayerData = {
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
    metaEvent: "Contact",
    dataLayerData,
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
    metaCustomEvent: "WhatsAppClick",
    dataLayerData: payload,
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
    metaCustomEvent: "PhoneClick",
    dataLayerData: payload,
    metaData: payload,
  });
};

export const trackPurchase = ({
  value = 0,
  orderId = "",
  itemsCount = 1,
} = {}) => {
  const dataLayerData = {
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
    metaEvent: "Purchase",
    dataLayerData,
    metaData,
  });
};

export const trackSearch = ({ searchTerm = "" } = {}) => {
  const dataLayerData = {
    search_term: searchTerm,
  };

  const metaData = {
    search_string: searchTerm,
  };

  trackAll({
    dataLayerEvent: "search",
    metaEvent: "Search",
    dataLayerData,
    metaData,
  });
};

export const trackCompleteRegistration = ({ method = "website" } = {}) => {
  const dataLayerData = {
    method,
  };

  const metaData = {
    registration_method: method,
  };

  trackAll({
    dataLayerEvent: "sign_up",
    metaEvent: "CompleteRegistration",
    dataLayerData,
    metaData,
  });
};

export const trackCustomEvent = (eventName, data = {}) => {
  trackAll({
    dataLayerEvent: eventName,
    metaCustomEvent: eventName,
    dataLayerData: data,
    metaData: data,
  });
};