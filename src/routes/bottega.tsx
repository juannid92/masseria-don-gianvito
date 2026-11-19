import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { getAbsoluteUrl } from "@/config/site";
import { MASSERIA } from "@/data/masseria";
import { Breadcrumb } from "@/components/site/Breadcrumb";
import {
  PRODOTTI_BOTTEGA,
  CATEGORIE_BOTTEGA,
  type CategoriaBottega,
  type ProdottoBottega,
} from "@/data/bottega";

export const Route = createFileRoute("/bottega")({
  head: () => ({
    meta: [
      { title: "Bottega — Prodotti Tipici · Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "Carne, formaggi, salumi, farine e legumi della Masseria Don Gianvito. Ordina per la consegna a domicilio o chiedi informazioni su ogni prodotto.",
      },
      { property: "og:title", content: "Bottega — Prodotti Tipici · Masseria Don Gianvito" },
      { property: "og:url", content: getAbsoluteUrl("/bottega") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/bottega") }],
  }),
  component: BottegaPage,
});

// ── Palette Bottega (OAT MILK / FOREST GREEN / RED RUBY) ───────────────────────
const BOTTEGA_COLORS = {
  oatMilk: "#f5efe0",
  forestGreen: "#2d5a3d",
  redRuby: "#9b1b30",
  cream: "#faf6ec",
} as const;

// ── Carrello state ─────────────────────────────────────────────────────────────
type CartItem = { id: string; qty: number };

function buildWhatsappOrder(items: CartItem[], products: ProdottoBottega[]) {
  const lines = items
    .map((item) => {
      const p = products.find((pr) => pr.id === item.id);
      if (!p) return null;
      const prezzo = p.prezzo != null ? `€${p.prezzo}/${p.unita}` : "su richiesta";
      return `• ${p.nome} × ${item.qty} (${prezzo})`;
    })
    .filter(Boolean);

  const totale = items.reduce((sum, item) => {
    const p = products.find((pr) => pr.id === item.id);
    return sum + (p?.prezzo ?? 0) * item.qty;
  }, 0);

  const msg = [
    `Buongiorno, vorrei ordinare dalla Bottega della Masseria Don Gianvito:`,
    ``,
    ...lines,
    ``,
    `Totale stimato: €${totale.toFixed(2)}`,
    ``,
    `Consegna a domicilio. Attendo conferma di disponibilità e orario. Grazie!`,
  ].join("\n");

  return `${MASSERIA.whatsapp.split("?")[0]}?text=${encodeURIComponent(msg)}`;
}

function buildWhatsappInfo(product: ProdottoBottega) {
  const msg = `Buongiorno, vorrei informazioni su "${product.nome}" dalla Bottega della Masseria Don Gianvito. Prezzo, disponibilità e consegna a domicilio. Grazie!`;
  return `${MASSERIA.whatsapp.split("?")[0]}?text=${encodeURIComponent(msg)}`;
}

// ── Componente ─────────────────────────────────────────────────────────────────

function BottegaPage() {
  const [activeCategory, setActiveCategory] = useState<CategoriaBottega | "tutti">("tutti");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = useMemo(
    () =>
      activeCategory === "tutti"
        ? PRODOTTI_BOTTEGA
        : PRODOTTI_BOTTEGA.filter((p) => p.categoria === activeCategory),
    [activeCategory],
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const p = PRODOTTI_BOTTEGA.find((pr) => pr.id === item.id);
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

  return (
    <div
      className="min-h-screen pt-[var(--page-header-safe-offset)]"
      style={{ backgroundColor: BOTTEGA_COLORS.oatMilk }}
    >
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Bottega" }]} />

      {/* JSON-LD Store */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Bottega — Masseria Don Gianvito",
            description:
              "Prodotti tipici della Masseria: carne, formaggi, salumi, farine e legumi con consegna a domicilio.",
            url: getAbsoluteUrl("/bottega"),
            telephone: MASSERIA.telefono,
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
              name: "Prodotti della Bottega",
              itemListElement: PRODOTTI_BOTTEGA.map((p) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Product", name: p.nome, description: p.descrizione },
                price: p.prezzo,
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
              })),
            },
          }),
        }}
      />

      {/* Header sezione */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <p
          className="font-eyebrow text-xs tracking-[0.28em] uppercase"
          style={{ color: BOTTEGA_COLORS.forestGreen }}
        >
          Consegna a domicilio
        </p>
        <h1
          className="mt-4 font-display text-4xl md:text-6xl"
          style={{ color: BOTTEGA_COLORS.forestGreen }}
        >
          La Bottega
          <br />
          <em style={{ color: BOTTEGA_COLORS.redRuby }}>della Masseria</em>
        </h1>
        <div
          className="mx-auto mt-8 h-px w-24"
          style={{ backgroundColor: BOTTEGA_COLORS.forestGreen, opacity: 0.3 }}
        />
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[color:var(--carbone)]/80">
          Carne dei nostri allevamenti, formaggi del caseificio interno, salumi stagionati,
          farine macinate a pietra e legumi della Murgia. Scegli i prodotti, componi il tuo
          ordine e ricevilo a casa. Ogni prodotto è disponibile anche singolarmente: chiedi
          informazioni e ci accordiamo sulla consegna.
        </p>
      </section>

      {/* Filtri categoria */}
      <nav className="mx-auto max-w-5xl px-6 pb-8">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCategory("tutti")}
            className="bottega-filter-btn"
            data-active={activeCategory === "tutti"}
            style={{
              "--btn-bg": BOTTEGA_COLORS.forestGreen,
              "--btn-text": BOTTEGA_COLORS.cream,
              "--btn-border": BOTTEGA_COLORS.forestGreen,
            } as React.CSSProperties}
          >
            Tutti
          </button>
          {CATEGORIE_BOTTEGA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="bottega-filter-btn"
              data-active={activeCategory === cat.id}
              style={{
                "--btn-bg": BOTTEGA_COLORS.forestGreen,
                "--btn-text": BOTTEGA_COLORS.cream,
                "--btn-border": BOTTEGA_COLORS.forestGreen,
              } as React.CSSProperties}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      </nav>

      {/* Griglia prodotti */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => {
            const qty = getQty(product.id);
            return (
              <article
                key={product.id}
                className="bottega-card group relative overflow-hidden rounded-sm border transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: BOTTEGA_COLORS.cream,
                  borderColor: `${BOTTEGA_COLORS.forestGreen}20`,
                }}
              >
                <div className="p-6">
                  {/* Badge categoria */}
                  <span
                    className="inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${BOTTEGA_COLORS.forestGreen}12`,
                      color: BOTTEGA_COLORS.forestGreen,
                    }}
                  >
                    {CATEGORIE_BOTTEGA.find((c) => c.id === product.categoria)?.nome}
                  </span>

                  <h2
                    className="mt-3 font-display text-xl leading-tight"
                    style={{ color: BOTTEGA_COLORS.forestGreen }}
                  >
                    {product.nome}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-[color:var(--carbone)]/70">
                    {product.descrizione}
                  </p>

                  {/* Prezzo */}
                  <div className="mt-4 flex items-baseline gap-1">
                    {product.prezzo != null ? (
                      <>
                        <span
                          className="font-display text-2xl font-semibold"
                          style={{ color: BOTTEGA_COLORS.redRuby }}
                        >
                          €{product.prezzo}
                        </span>
                        <span className="text-sm text-[color:var(--carbone)]/50">
                          / {product.unita}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm italic text-[color:var(--carbone)]/50">
                        Su richiesta
                      </span>
                    )}
                  </div>

                  {/* Azioni */}
                  <div className="mt-5 flex flex-col gap-2">
                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="bottega-add-btn w-full rounded-sm py-3 text-sm font-semibold uppercase tracking-wider transition-colors"
                        style={{
                          backgroundColor: BOTTEGA_COLORS.forestGreen,
                          color: BOTTEGA_COLORS.cream,
                        }}
                      >
                        Aggiungi al carrello
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-sm text-lg font-bold transition-colors"
                          style={{
                            backgroundColor: `${BOTTEGA_COLORS.forestGreen}15`,
                            color: BOTTEGA_COLORS.forestGreen,
                          }}
                          aria-label={`Rimuovi uno ${product.nome}`}
                        >
                          −
                        </button>
                        <span
                          className="min-w-[2ch] text-center font-display text-lg font-semibold"
                          style={{ color: BOTTEGA_COLORS.forestGreen }}
                        >
                          {qty}
                        </span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-sm text-lg font-bold transition-colors"
                          style={{
                            backgroundColor: BOTTEGA_COLORS.forestGreen,
                            color: BOTTEGA_COLORS.cream,
                          }}
                          aria-label={`Aggiungi uno ${product.nome}`}
                        >
                          +
                        </button>
                      </div>
                    )}

                    {/* Chiedi info sul singolo prodotto */}
                    <a
                      href={buildWhatsappInfo(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full rounded-sm border py-2.5 text-center text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-[color:var(--carbone)]/5"
                      style={{
                        borderColor: `${BOTTEGA_COLORS.forestGreen}30`,
                        color: BOTTEGA_COLORS.forestGreen,
                      }}
                    >
                      Chiedi info su WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Floating cart summary */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2">
          <button
            onClick={() => setShowCart(!showCart)}
            className="bottega-cart-fab flex items-center gap-3 rounded-full px-6 py-3 shadow-xl transition-transform hover:scale-105"
            style={{
              backgroundColor: BOTTEGA_COLORS.redRuby,
              color: BOTTEGA_COLORS.cream,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            <span className="font-semibold">
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
          <div
            className="relative w-full max-w-md rounded-t-xl p-6 shadow-2xl sm:rounded-xl"
            style={{ backgroundColor: BOTTEGA_COLORS.cream }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3
                className="font-display text-xl font-semibold"
                style={{ color: BOTTEGA_COLORS.forestGreen }}
              >
                Il tuo ordine
              </h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-2xl leading-none text-[color:var(--carbone)]/40 hover:text-[color:var(--carbone)]"
                aria-label="Chiudi carrello"
              >
                ×
              </button>
            </div>

            <ul className="max-h-60 space-y-3 overflow-y-auto">
              {cart.map((item) => {
                const p = PRODOTTI_BOTTEGA.find((pr) => pr.id === item.id);
                if (!p) return null;
                return (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium" style={{ color: BOTTEGA_COLORS.forestGreen }}>
                        {p.nome}
                      </span>
                      <span className="ml-2 text-[color:var(--carbone)]/50">× {item.qty}</span>
                    </div>
                    <span style={{ color: BOTTEGA_COLORS.redRuby }}>
                      €{((p.prezzo ?? 0) * item.qty).toFixed(2)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div
              className="my-4 h-px"
              style={{ backgroundColor: `${BOTTEGA_COLORS.forestGreen}20` }}
            />

            <div className="mb-6 flex items-center justify-between">
              <span className="font-semibold" style={{ color: BOTTEGA_COLORS.forestGreen }}>
                Totale stimato
              </span>
              <span
                className="font-display text-2xl font-bold"
                style={{ color: BOTTEGA_COLORS.redRuby }}
              >
                €{cartTotal.toFixed(2)}
              </span>
            </div>

            <a
              href={buildWhatsappOrder(cart, PRODOTTI_BOTTEGA)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-sm py-3.5 text-center text-sm font-bold uppercase tracking-wider transition-opacity hover:opacity-90"
              style={{
                backgroundColor: BOTTEGA_COLORS.forestGreen,
                color: BOTTEGA_COLORS.cream,
              }}
            >
              Ordina su WhatsApp
            </a>

            <a
              href={MASSERIA.telefonoHref}
              className="mt-3 block w-full rounded-sm border py-3 text-center text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-[color:var(--carbone)]/5"
              style={{
                borderColor: `${BOTTEGA_COLORS.forestGreen}30`,
                color: BOTTEGA_COLORS.forestGreen,
              }}
            >
              Oppure chiama {MASSERIA.telefono}
            </a>

            <p className="mt-4 text-center text-xs text-[color:var(--carbone)]/50">
              Prezzo e disponibilità da confermare. Consegna a domicilio nella zona di Noci e dintorni.
            </p>
          </div>
        </div>
      )}

      {/* CSS inline per i componenti Bottega */}
      <style>{`
        .bottega-filter-btn {
          padding: 8px 20px;
          border-radius: 999px;
          border: 1px solid var(--btn-border);
          background: transparent;
          color: var(--btn-bg);
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .bottega-filter-btn[data-active="true"],
        .bottega-filter-btn:hover {
          background: var(--btn-bg);
          color: var(--btn-text);
        }
        .bottega-card {
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .bottega-card:hover {
          transform: translateY(-2px);
        }
        .bottega-add-btn:hover {
          opacity: 0.9;
        }
        .bottega-cart-fab {
          animation: bottega-fab-enter 0.3s ease-out;
        }
        @keyframes bottega-fab-enter {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}