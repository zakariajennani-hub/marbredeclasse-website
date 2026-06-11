const PIXEL_ID = "864493949510284";

export const initPixel = () => {
  if (typeof window === "undefined") return;

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

  window.fbq("track", "PageView");
};

export const trackPageView = () => {
  if (window.fbq) window.fbq("track", "PageView");
};

export const trackLead = () => {
  if (window.fbq) window.fbq("track", "Lead");
};

export const trackViewContent = (productName = "Marbre De Classe Product") => {
  if (window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: productName,
    });
  }
};

export const trackWhatsAppClick = () => {
  if (window.fbq) window.fbq("trackCustom", "WhatsAppClick");
};

export const trackAddToCart = (value = 0) => {
  if (window.fbq) {
    window.fbq("track", "AddToCart", {
      value,
      currency: "MAD",
    });
  }
};