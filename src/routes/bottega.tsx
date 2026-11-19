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
import "@/styles/bottega.css";

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
    <div className="bg-[color:var(--bottega-oat-milk)] min-h-screen pt-[var(--page-header-safe-offset)]">
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

      {/* Hero editoriale */}
      <section className="bottega-hero">
        <p className="bottega-hero-kicker">Consegna a domicilio · Noci e dintorni</p>
        <h1 className="bottega-hero-title">
          La Bottega
          <br />
          <em>della Masseria</em>
        </h1>
        <p className="bottega-hero-desc">
          Carne dei nostri allevamenti, formaggi del caseificio interno, salumi stagionati, farine
          macinate a pietra e legumi della Murgia. Componi il tuo ordine e ricevilo a casa.
        </p>
      </section>

      {/* Filtri categoria — tabs minimali */}
      <nav className="bottega-filters">
        <button
          onClick={() => setActiveCategory("tutti")}
          className="bottega-filter-tab"
          data-active={activeCategory === "tutti"}
        >
          Tutti
        </button>
        {CATEGORIE_BOTTEGA.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="bottega-filter-tab"
            data-active={activeCategory === cat.id}
          >
            {cat.nome}
          </button>
        ))}
      </nav>

      {/* Griglia prodotti editoriale */}
      <section className="bottega-grid pb-32">
        {filteredProducts.map((product) => {
          const qty = getQty(product.id);
          return (
            <article key={product.id} className="bottega-product">
              {/* Immagine protagonista */}
              <div className="bottega-product-img-wrap">
                <span className="bottega-product-badge">
                  {CATEGORIE_BOTTEGA.find((c) => c.id === product.categoria)?.nome}
                </span>
                <img
                  src={product.immagine}
                  alt={product.nome}
                  className="bottega-product-img"
                  loading="lazy"
                />
              </div>

              {/* Info prodotto */}
              <div className="bottega-product-info">
                <h2 className="bottega-product-name">{product.nome}</h2>
                <p className="bottega-product-desc">{product.descrizione}</p>

                <div className="bottega-product-footer">
                  <div>
                    {product.prezzo != null ? (
                      <>
                        <span className="bottega-product-price">€{product.prezzo}</span>
                        <span className="bottega-product-unit">/ {product.unita}</span>
                      </>
                    ) : (
                      <span className="bottega-product-unit italic">Su richiesta</span>
                    )}
                  </div>

                  {/* Azioni */}
                  {qty === 0 ? (
                    <div className="bottega-product-actions">
                      <button onClick={() => addToCart(product.id)} className="bottega-btn-add">
                        Aggiungi
                      </button>
                      <a
                        href={buildWhatsappInfo(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bottega-btn-info"
                      >
                        Info
                      </a>
                    </div>
                  ) : (
                    <div className="bottega-qty-controls">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="bottega-qty-btn"
                        aria-label={`Rimuovi uno ${product.nome}`}
                      >
                        −
                      </button>
                      <span className="bottega-qty-value">{qty}</span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="bottega-qty-btn"
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
        })}
      </section>

      {/* Disclaimer */}
      <div className="bottega-disclaimer mb-24">
        I prezzi indicati sono indicativi e soggetti a variazione. Conferma prezzo e disponibilità
        via WhatsApp o chiamata prima dell'ordine. Le foto sono illustrative.
      </div>

      {/* Floating cart FAB */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 left-1/2 z-40">
          <button
            onClick={() => setShowCart(!showCart)}
            className="bottega-cart-fab flex items-center gap-3 rounded-full bg-[color:var(--bottega-red-ruby)] px-7 py-3.5 text-[color:var(--bottega-cream)] shadow-xl transition-transform hover:scale-105"
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
          <div className="relative w-full max-w-md rounded-t-xl bg-[color:var(--bottega-cream)] p-8 shadow-2xl sm:rounded-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-2xl text-[color:var(--bottega-forest-green)]">
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

            <ul className="max-h-60 space-y-4 overflow-y-auto">
              {cart.map((item) => {
                const p = PRODOTTI_BOTTEGA.find((pr) => pr.id === item.id);
                if (!p) return null;
                return (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-display text-base text-[color:var(--bottega-forest-green)]">
                        {p.nome}
                      </span>
                      <span className="ml-2 text-[color:var(--carbone)]/40">× {item.qty}</span>
                    </div>
                    <span className="font-display text-[color:var(--bottega-red-ruby)]">
                      €{((p.prezzo ?? 0) * item.qty).toFixed(2)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="my-6 h-px bg-[color:var(--bottega-forest-green)]/10" />

            <div className="mb-8 flex items-center justify-between">
              <span className="font-eyebrow text-xs tracking-widest uppercase text-[color:var(--bottega-forest-green)]">
                Totale stimato
              </span>
              <span className="font-display text-3xl text-[color:var(--bottega-red-ruby)]">
                €{cartTotal.toFixed(2)}
              </span>
            </div>

            <a
              href={buildWhatsappOrder(cart, PRODOTTI_BOTTEGA)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[color:var(--bottega-forest-green)] py-4 text-center font-eyebrow text-xs tracking-[0.18em] uppercase text-[color:var(--bottega-cream)] transition-opacity hover:opacity-90"
            >
              Ordina su WhatsApp
            </a>

            <a
              href={MASSERIA.telefonoHref}
              className="mt-3 block w-full border border-[color:var(--bottega-forest-green)]/20 py-3.5 text-center font-eyebrow text-xs tracking-[0.18em] uppercase text-[color:var(--bottega-forest-green)] transition-colors hover:bg-[color:var(--carbone)]/5"
            >
              Oppure chiama {MASSERIA.telefono}
            </a>

            <p className="mt-5 text-center text-xs text-[color:var(--carbone)]/40">
              Prezzo e disponibilità da confermare. Consegna a domicilio nella zona di Noci.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
