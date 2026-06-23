import { useEffect, useMemo, useState } from "react";
import "./AdminQuotesPage.css";

const ADMIN_TOKEN_KEY = "marbre_admin_token";

const STATUS_OPTIONS = [
  { value: "new", label: "Nouveau" },
  { value: "reviewing", label: "En révision" },
  { value: "sent", label: "Devis envoyé" },
  { value: "contacted", label: "Contacté" },
  { value: "negotiation", label: "Négociation" },
  { value: "confirmed", label: "Confirmé" },
  { value: "production", label: "Production" },
  { value: "delivered", label: "Livré" },
  { value: "sold", label: "Vendu" },
  { value: "cancelled", label: "Annulé" },
  { value: "closed", label: "Clôturé" },
];

export default function AdminQuotesPage() {
  const [token, setToken] = useState(
    localStorage.getItem(ADMIN_TOKEN_KEY) || ""
  );
  const [loginToken, setLoginToken] = useState("");
  const [quotes, setQuotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState({});

  const isLoggedIn = Boolean(token);

  const money = (value) =>
    `${Math.round(Number(value || 0)).toLocaleString("fr-FR")} MAD`;

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("fr-FR");
  };

  const fetchQuotes = async (adminToken = token) => {
    if (!adminToken) return;

    setLoading(true);
    setPageError("");

    try {
      const response = await fetch("/api/get-quotes", {
        headers: {
          "x-admin-token": adminToken,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || result.error || "Erreur");
      }

      setQuotes(result.quotes || []);
      setStats(result.stats || null);
    } catch (error) {
      setPageError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchQuotes(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: loginToken }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Code incorrect");
      }

      localStorage.setItem(ADMIN_TOKEN_KEY, loginToken);
      setToken(loginToken);
      setLoginToken("");
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken("");
    setQuotes([]);
    setStats(null);
  };

  const filteredQuotes = useMemo(() => {
    const q = search.trim().toLowerCase();

    return quotes.filter((quote) => {
      const matchesStatus =
        statusFilter === "all" || quote.status === statusFilter;

      const text = [
        quote.client_name,
        quote.name,
        quote.phone,
        quote.city,
        quote.product_name,
        quote.product_category,
        quote.id,
        quote.gclid,
        quote.gbraid,
        quote.wbraid,
        quote.utm_campaign,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!q || text.includes(q));
    });
  }, [quotes, search, statusFilter]);

  const updateDraft = (id, field, value) => {
    setEditing((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const getDraft = (quote) => {
    return {
      status: editing[quote.id]?.status ?? quote.status ?? "new",
      sale_amount:
        editing[quote.id]?.sale_amount ??
        quote.sale_amount ??
        quote.total_price ??
        "",
      admin_notes: editing[quote.id]?.admin_notes ?? quote.admin_notes ?? "",
    };
  };

  const saveQuote = async (quote) => {
    const draft = getDraft(quote);

    try {
      const response = await fetch("/api/update-quote-sale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({
          quote_id: quote.id,
          status: draft.status,
          sale_amount: draft.sale_amount,
          admin_notes: draft.admin_notes,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || result.error || "Erreur");
      }

      setQuotes((prev) =>
        prev.map((item) => (item.id === quote.id ? result.quote : item))
      );

      setEditing((prev) => {
        const next = { ...prev };
        delete next[quote.id];
        return next;
      });

      await fetchQuotes();
    } catch (error) {
      alert(error.message);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="admin-quotes-page admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <h1>Administration MARBRE DE CLASSE</h1>
          <p>Entrez le code administrateur pour accéder aux demandes.</p>

          <input
            type="password"
            value={loginToken}
            onChange={(e) => setLoginToken(e.target.value)}
            placeholder="Code administrateur"
            autoFocus
          />

          {loginError && <div className="admin-error">{loginError}</div>}

          <button type="submit">Connexion</button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-quotes-page">
      <header className="admin-quotes-header">
        <div>
          <span>MARBRE DE CLASSE CRM</span>
          <h1>Demandes de devis</h1>
          <p>Suivi des leads, ventes confirmées et valeurs finales.</p>
        </div>

        <div className="admin-header-actions">
          <button type="button" onClick={() => fetchQuotes()}>
            Actualiser
          </button>
          <button type="button" className="logout-btn" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </header>

      {stats && (
        <section className="admin-stats-grid">
          <div>
            <small>Total demandes</small>
            <strong>{stats.total}</strong>
          </div>
          <div>
            <small>Nouvelles</small>
            <strong>{stats.new}</strong>
          </div>
          <div>
            <small>En révision</small>
            <strong>{stats.reviewing}</strong>
          </div>
          <div>
            <small>Devis envoyés</small>
            <strong>{stats.sent}</strong>
          </div>
          <div>
            <small>Ventes</small>
            <strong>{stats.sold}</strong>
          </div>
          <div>
            <small>CA confirmé</small>
            <strong>{money(stats.revenue)}</strong>
          </div>
        </section>
      )}

      <section className="admin-filters">
        <input
          type="search"
          placeholder="Rechercher nom, téléphone, ville, produit, gclid..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </section>

      {loading && <p className="admin-info">Chargement...</p>}
      {pageError && <p className="admin-error">{pageError}</p>}

      <section className="admin-quotes-list">
        {filteredQuotes.map((quote) => {
          const draft = getDraft(quote);

          return (
            <article className="admin-quote-card" key={quote.id}>
              <div className="admin-quote-main">
                <div>
                  <span className={`status-pill status-${quote.status}`}>
                    {quote.status || "new"}
                  </span>
                  <h2>
                    #{quote.id} —{" "}
                    {quote.client_name || quote.name || "Client sans nom"}
                  </h2>
                  <p>
                    {quote.phone || "-"} · {quote.city || quote.area || "-"}
                  </p>
                </div>

                <div className="quote-price-block">
                  <small>Devis estimé</small>
                  <strong>{money(quote.total_price)}</strong>
                </div>
              </div>

              <div className="admin-quote-details">
                <div>
                  <small>Produit</small>
                  <strong>{quote.product_name || "-"}</strong>
                </div>

                <div>
                  <small>Catégorie</small>
                  <strong>{quote.product_category || "-"}</strong>
                </div>

                <div>
                  <small>Date</small>
                  <strong>{formatDate(quote.created_at)}</strong>
                </div>

                <div>
                  <small>Vente finale</small>
                  <strong>
                    {quote.converted_to_sale ? money(quote.sale_amount) : "-"}
                  </strong>
                </div>
              </div>

              {(quote.address || quote.note) && (
                <div className="admin-note-box">
                  {quote.address && <p>Adresse: {quote.address}</p>}
                  {quote.note && <p>Note client: {quote.note}</p>}
                </div>
              )}

              {(quote.gclid ||
                quote.gbraid ||
                quote.wbraid ||
                quote.fbclid ||
                quote.utm_source ||
                quote.utm_campaign ||
                quote.landing_page ||
                quote.referrer) && (
                <div className="admin-note-box">
                  <p>
                    <strong>Google Ads / Tracking</strong>
                  </p>

                  {quote.gclid && <p>GCLID: {quote.gclid}</p>}
                  {quote.gbraid && <p>GBRAID: {quote.gbraid}</p>}
                  {quote.wbraid && <p>WBRAID: {quote.wbraid}</p>}
                  {quote.fbclid && <p>FBCLID: {quote.fbclid}</p>}

                  {quote.utm_source && <p>UTM Source: {quote.utm_source}</p>}
                  {quote.utm_medium && <p>UTM Medium: {quote.utm_medium}</p>}
                  {quote.utm_campaign && (
                    <p>UTM Campaign: {quote.utm_campaign}</p>
                  )}
                  {quote.utm_term && <p>UTM Term: {quote.utm_term}</p>}
                  {quote.utm_content && <p>UTM Content: {quote.utm_content}</p>}

                  {quote.landing_page && (
                    <p>Landing page: {quote.landing_page}</p>
                  )}
                  {quote.referrer && <p>Referrer: {quote.referrer}</p>}

                  {quote.device_type && <p>Device: {quote.device_type}</p>}
                </div>
              )}

              <div className="admin-sale-controls">
                <label>
                  Statut
                  <select
                    value={draft.status}
                    onChange={(e) =>
                      updateDraft(quote.id, "status", e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Montant final MAD
                  <input
                    type="number"
                    min="0"
                    value={draft.sale_amount}
                    onChange={(e) =>
                      updateDraft(quote.id, "sale_amount", e.target.value)
                    }
                    placeholder="Ex: 28000"
                  />
                </label>

                <label className="admin-notes-field">
                  Notes internes
                  <input
                    type="text"
                    value={draft.admin_notes}
                    onChange={(e) =>
                      updateDraft(quote.id, "admin_notes", e.target.value)
                    }
                    placeholder="Acompte reçu, client à relancer..."
                  />
                </label>

                <button type="button" onClick={() => saveQuote(quote)}>
                  Enregistrer
                </button>
              </div>

              {quote.converted_to_sale && (
                <div className="conversion-status">
                  ✅ Vente confirmée le {formatDate(quote.sale_date)}
                </div>
              )}
            </article>
          );
        })}

        {!loading && filteredQuotes.length === 0 && (
          <div className="admin-empty">Aucune demande trouvée.</div>
        )}
      </section>
    </main>
  );
}