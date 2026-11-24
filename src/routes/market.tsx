import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { getAbsoluteUrl } from "@/config/site";
import { MASSERIA } from "@/data/masseria";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import {
  PRODOTTI_MARKET,
  CATEGORIE_MARKET,
  type CategoriaMarket,
  type ProdottoMarket,
} from "@/data/market";
import "@/styles/market.css";

export const Route = createFileRoute("/market")({
  head: () => ({
    meta: [
      { title: "Market — Prodotti Tipici · Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "Carne, formaggi, salumi, farine e panificio della Masseria Don Gianvito. Ordina per la consegna a domicilio o chiedi informazioni su ogni prodotto.",
      },
      { property: "og:title", content: "Market — Prodotti Tipici · Masseria Don Gianvito" },
      { property: "og:url", content: getAbsoluteUrl("/market") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/market") }],
  }),
  component: MarketPage,
});

// ── Carrello state ─────────────────────────────────────────────────────────────
type CartItem = { id: string; qty: number };

function buildWhatsappOrder(items: CartItem[], products: ProdottoMarket[]) {
  const lines = items
    .map((item) => {
      const p = products.find((pr) => pr.id === item.id);
      if (!p) return null;
      const prezzo = p.prezzo != null ? `€${p.prezzo}/kg` : "su richiesta";
      return `• ${p.nome} × ${item.qty} (${prezzo})`;
    })
    .filter(Boolean);

  const totale = items.reduce((sum, item) => {
    const p = products.find((pr) => pr.id === item.id);
    return sum + (p?.prezzo ?? 0) * item.qty;
  }, 0);

  const msg = [
    `Buongiorno, vorrei ordinare dal Market della Masseria Don Gianvito:`,
    ``,
    ...lines,
    ``,
    `Totale stimato: €${totale.toFixed(2)}`,
    ``,
    `Consegna a domicilio. Attendo conferma di disponibilità e orario. Grazie!`,
  ].join("\n");

  return `${MASSERIA.whatsapp.split("?")[0]}?text=${encodeURIComponent(msg)}`;
}

function buildWhatsappInfo(product: ProdottoMarket) {
  const msg = `Buongiorno, vorrei informazioni su "${product.nome}" dal Market della Masseria Don Gianvito. Prezzo, disponibilità e consegna a domicilio. Grazie!`;
  return `${MASSERIA.whatsapp.split("?")[0]}?text=${encodeURIComponent(msg)}`;
}

// ── Componente ─────────────────────────────────────────────────────────────────

function MarketPage() {
  const [activeCategory, setActiveCategory] = useState<CategoriaMarket | "tutti">("tutti");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = useMemo(
    () =>
      activeCategory === "tutti"
        ? PRODOTTI_MARKET
        : PRODOTTI_MARKET.filter((p) => p.categoria === activeCategory),
    [activeCategory],
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const p = PRODOTTI_MARKET.find((pr) => pr.id === item.id);
        return sum + (p?.prezzo ?? 0) * item.qty;
      }, 0),
    [cart],
  );

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);

  const addToCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item));
      }
      return [...prev, { id, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing && existing.qty > 1) {
        return prev.map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item));
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const getQty = (id: string) => cart.find((item) => item.id === id)?.qty ?? 0;

  // Raggruppa prodotti per categoria quando filtro è "tutti"
  const groupedProducts = useMemo(() => {
    if (activeCategory !== "tutti") return null;
    const groups: Record<string, ProdottoMarket[]> = {};
    for (const cat of CATEGORIE_MARKET) {
      const items = PRODOTTI_MARKET.filter((p) => p.categoria === cat.id);
      if (items.length > 0) groups[cat.id] = items;
    }
    return groups;
  }, [activeCategory]);

  return (
    <div className="market-page min-h-screen pt-[var(--page-header-safe-offset)]">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Market" }]} />

      {/* JSON-LD Store */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Market — Masseria Don Gianvito",
            description:
              "Prodotti tipici della Masseria: carne, formaggi, salumi, farine e legumi con consegna a domicilio.",
            url: getAbsoluteUrl("/market"),
            telephone: "+393339395750",
            address: {
              "@type": "PostalAddress",
              streetAddress: MASSERIA.indirizzo,
              addressLocality: "Noci",
              addressRegion: "BA",
              postalCode: "70015",
              addressCountry: "IT",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Prodotti del Market",
              itemListElement: PRODOTTI_MARKET.map((p) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Product", name: p.nome, description: p.descrizione },
                price: p.prezzo,
                priceCurrency: "EUR",
                unitCode: "KGM",
                availability: "https://schema.org/InStock",
              })),
            },
          }),
        }}
      />

      {/* Hero */}
      <section className="market-hero">
        <p className="market-hero-kicker">Consegna a domicilio · Noci e dintorni</p>
        <h1 className="market-hero-title">
          Il Market
          <br />
          <em>della Masseria</em>
        </h1>
        <p className="market-hero-desc">
          Carne dei nostri allevamenti, formaggi del caseificio interno, salumi stagionati, farine
          macinate a pietra e legumi della Murgia. Componi il tuo ordine e ricevilo a casa.
        </p>
      </section>

      {/* Filtri categoria */}
      <nav className="market-filters">
        <button
          onClick={() => setActiveCategory("tutti")}
          className="market-filter-tab"
          data-active={activeCategory === "tutti"}
        >
          Tutti
        </button>
        {CATEGORIE_MARKET.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="market-filter-tab"
            data-active={activeCategory === cat.id}
          >
            {cat.nome}
          </button>
        ))}
      </nav>

      {/* Lista prodotti */}
      <section className="market-list pb-32">
        {groupedProducts ? (
          // Vista raggruppata per categoria
          Object.entries(groupedProducts).map(([catId, products]) => {
            const catName = CATEGORIE_MARKET.find((c) => c.id === catId)?.nome ?? catId;
            return (
              <div key={catId} className="market-category-group">
                <h2 className="market-category-title">{catName}</h2>
                <div className="market-items">
                  {products.map((product) => (
                    <MarketItem
                      key={product.id}
                      product={product}
                      qty={getQty(product.id)}
                      onAdd={() => addToCart(product.id)}
                      onRemove={() => removeFromCart(product.id)}
                      onInfo={() => buildWhatsappInfo(product)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Vista filtrata per singola categoria
          <div className="market-items">
            {filteredProducts.map((product) => (
              <MarketItem
                key={product.id}
                product={product}
                qty={getQty(product.id)}
                onAdd={() => addToCart(product.id)}
                onRemove={() => removeFromCart(product.id)}
                onInfo={() => buildWhatsappInfo(product)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Disclaimer */}
      <div className="market-disclaimer mb-24">
        I prezzi indicati sono al kg e soggetti a variazione. Conferma prezzo e disponibilità via
        WhatsApp o chiamata prima dell'ordine.
      </div>

      {/* Floating cart FAB */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2">
          <button
            onClick={() => setShowCart(!showCart)}
            className="market-cart-fab flex items-center gap-3 rounded-full bg-[color:var(--market-accent)] px-7 py-3.5 text-[color:var(--market-surface)] shadow-xl transition-transform hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            <span className="font-eyebrow text-xs tracking-widest uppercase">
              {cartCount} {cartCount === 1 ? "prodotto" : "prodotti"}
            </span>
            <span className="font-display text-lg">€{cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Cart drawer */}
      {showCart && cartCount > 0 && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />
          <div className="relative w-full max-w-md rounded-t-xl bg-[color:var(--market-surface)] p-8 shadow-2xl sm:rounded-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-2xl text-[color:var(--market-text)]">
                Il tuo ordine
              </h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-2xl leading-none text-[color:var(--market-text-muted)]/40 hover:text-[color:var(--market-text)]"
                aria-label="Chiudi carrello"
              >
                ×
              </button>
            </div>

            <ul className="max-h-60 space-y-4 overflow-y-auto">
              {cart.map((item) => {
                const p = PRODOTTI_MARKET.find((pr) => pr.id === item.id);
                if (!p) return null;
                return (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-display text-base text-[color:var(--market-text)]">
                        {p.nome}
                      </span>
                      <span className="ml-2 text-[color:var(--market-text-muted)]/40">× {item.qty}</span>
                    </div>
                    <span className="font-display text-[color:var(--market-accent)]">
                      €{((p.prezzo ?? 0) * item.qty).toFixed(2)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="my-6 h-px bg-[color:var(--market-accent)]/10" />

            <div className="mb-8 flex items-center justify-between">
              <span className="font-eyebrow text-xs tracking-widest uppercase text-[color:var(--market-text)]">
                Totale stimato
              </span>
              <span className="font-display text-3xl text-[color:var(--market-accent)]">
                €{cartTotal.toFixed(2)}
              </span>
            </div>

            <a
              href={buildWhatsappOrder(cart, PRODOTTI_MARKET)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[color:var(--market-accent)] py-4 text-center font-eyebrow text-xs tracking-[0.18em] uppercase text-[color:var(--market-surface)] transition-opacity hover:opacity-90"
            >
              Ordina su WhatsApp
            </a>

            <a
              href={MASSERIA.telefonoHref}
              className="mt-3 block w-full border border-[color:var(--market-accent)]/20 py-3.5 text-center font-eyebrow text-xs tracking-[0.18em] uppercase text-[color:var(--market-text)] transition-colors hover:bg-[color:var(--market-text-muted)]/5"
            >
              Oppure chiama {MASSERIA.telefono}
            </a>

            <p className="mt-5 text-center text-xs text-[color:var(--market-text-muted)]/40">
              Prezzo e disponibilità da confermare. Consegna a domicilio nella zona di Noci.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Singolo prodotto — riga compatta e uniforme ────────────────────────────────

function MarketItem({
  product,
  qty,
  onAdd,
  onRemove,
  onInfo,
}: {
  product: ProdottoMarket;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  onInfo: () => string;
}) {
  return (
    <article className="market-item">
      <div className="market-item-image">
        <img
          src={product.immagine}
          alt={product.nome}
          loading="lazy"
          decoding="async"
          width={400}
          height={300}
        />
      </div>
      <div className="market-item-main">
        <div className="market-item-info">
          <h3 className="market-item-name">{product.nome}</h3>
          <p className="market-item-desc">{product.descrizione}</p>
        </div>
        <div className="market-item-right">
          {product.prezzo != null && (
            <div className="market-item-price-block">
              <span className="market-item-price">€{product.prezzo}</span>
              <span className="market-item-unit">/kg</span>
            </div>
          )}
          {qty === 0 ? (
            <div className="market-item-actions">
              <button
                onClick={onAdd}
                className="market-btn-add"
                aria-label={`Aggiungi ${product.nome}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <a
                href={onInfo()}
                target="_blank"
                rel="noopener noreferrer"
                className="market-btn-info"
                aria-label={`Info su ${product.nome}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  width="16"
                  height="16"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
              </a>
            </div>
          ) : (
            <div className="market-qty-controls">
              <button
                onClick={onRemove}
                className="market-qty-btn"
                aria-label={`Rimuovi uno ${product.nome}`}
              >
                −
              </button>
              <span className="market-qty-value">{qty}</span>
              <button
                onClick={onAdd}
                className="market-qty-btn"
                aria-label={`Aggiungi uno ${product.nome}`}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
