import { createFileRoute } from "@tanstack/react-router";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";
import { Breadcrumb } from "@/components/site/Breadcrumb";

const RECENSIONI = [
  {
    autore: "Marco R.",
    testo:
      "Un'esperienza autentica. La carne della macelleria interna è eccezionale, i formaggi del caseificio hanno un sapore che non trovi da nessuna parte. Si sente che tutto nasce qui.",
    luogo: "Bari",
  },
  {
    autore: "Giulia e Francesco",
    testo:
      "Abbiamo festeggiato il nostro anniversario qui. Atmosfera bellissima, personale gentile e cibo straordinario. Le orecchiette fatte in casa sono indimenticabili.",
    luogo: "Taranto",
  },
  {
    autore: "Famiglia De Luca",
    testo:
      "Portiamo i bambini ogni domenica a pranzo. Loro adorano vedere gli animali e noi ci godiamo una cucina vera, senza scorciatoie. Il prezzo è onesto per la qualità offerta.",
    luogo: "Noci",
  },
  {
    autore: "Alessandro M.",
    testo:
      "Ho comprato formaggi e salumi al banco della macelleria. Prodotti di altissima qualità, si vede la cura artigianale. Tornerò sicuramente.",
    luogo: "Alberobello",
  },
];

export const Route = createFileRoute("/recensioni")({
  head: () => ({
    meta: [
      { title: "Recensioni — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Cosa dicono i nostri ospiti: recensioni e opinioni sull'agriturismo, il caseificio e la macelleria della Masseria Don Gianvito a Noci.",
      },
      { property: "og:title", content: "Recensioni — Masseria Don Gianvito" },
      {
        property: "og:description",
        content:
          "Cosa dicono i nostri ospiti: recensioni e opinioni sull'agriturismo, il caseificio e la macelleria della Masseria Don Gianvito a Noci.",
      },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { property: "og:url", content: getAbsoluteUrl("/recensioni") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/recensioni") }],
  }),
  component: RecensioniPage,
});

function RecensioniPage() {
  return (
    <div data-tone="light" className="bg-[color:var(--bianco-calce)] pt-[var(--page-header-safe-offset)]">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Recensioni" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Masseria Don Gianvito",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: String(RECENSIONI.length),
              bestRating: "5",
            },
            review: RECENSIONI.map((r) => ({
              "@type": "Review",
              author: { "@type": "Person", name: r.autore },
              reviewBody: r.testo,
            })),
          }),
        }}
      />
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <p className="font-eyebrow text-xs tracking-[0.28em] text-[color:var(--oro-antico)]">
            Le voci dei nostri ospiti
          </p>
          <h1 className="mt-6 font-display text-4xl md:text-5xl text-[color:var(--carbone)]">
            Recensioni
          </h1>
          <div className="hairline-oro mx-auto mt-8 max-w-[120px]" />
        </div>

        <div className="mt-16 space-y-0">
          {RECENSIONI.map((r, i) => (
            <div key={i} className="border-t border-[color:var(--carbone)]/10 py-8">
              <p className="text-lg leading-relaxed text-[color:var(--carbone)]/80 italic">
                "{r.testo}"
              </p>
              <p className="mt-4 font-eyebrow text-[11px] tracking-[0.26em] text-[color:var(--terra-cotta)]">
                {r.autore} — {r.luogo}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
