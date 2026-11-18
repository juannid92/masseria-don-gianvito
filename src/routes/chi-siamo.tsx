import { createFileRoute } from "@tanstack/react-router";
import { getAbsoluteUrl } from "@/config/site";
import { MASSERIA } from "@/data/masseria";

export const Route = createFileRoute("/chi-siamo")({
  head: () => ({
    meta: [
      { title: "Chi Siamo — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "La storia della Masseria Don Gianvito: dal Cinquecento a oggi, una famiglia che alleva, produce e cucina nella Murgia di Noci.",
      },
      { property: "og:title", content: "Chi Siamo — Masseria Don Gianvito" },
      { property: "og:url", content: getAbsoluteUrl("/chi-siamo") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/chi-siamo") }],
  }),
  component: ChiSiamoPage,
});

function ChiSiamoPage() {
  return (
    <div className="bg-[color:var(--bianco-calce)] pt-[var(--page-header-safe-offset)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            mainEntity: {
              "@type": "Organization",
              name: MASSERIA.nome,
              foundingDate: `${MASSERIA.cciaaDal}`,
              description:
                "Azienda agricola a filiera propria a Noci (BA): allevamento, caseificio, macelleria e agriturismo della Murgia.",
              address: {
                "@type": "PostalAddress",
                streetAddress: MASSERIA.indirizzo,
                addressLocality: "Noci",
                addressRegion: "BA",
                postalCode: "70015",
                addressCountry: "IT",
              },
              url: getAbsoluteUrl("/"),
            },
          }),
        }}
      />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-eyebrow text-xs tracking-[0.28em] text-[color:var(--oro-antico)]">
          La nostra storia
        </p>
        <h1 className="mt-6 font-display text-4xl md:text-5xl text-[color:var(--carbone)]">
          Dal Cinquecento,
          <br />
          <em className="text-[color:var(--terra-cotta)]">la stessa terra.</em>
        </h1>
        <div className="hairline-oro mx-auto mt-8 max-w-[120px]" />
        <p className="mt-10 text-lg leading-relaxed text-[color:var(--carbone)]/80">
          La Masseria Don Gianvito nasce come insediamento rurale nel Cinquecento. Da allora,
          generazione dopo generazione, questa terra continua a produrre ciò che serve alla tavola:
          gli animali sono allevati qui, il latte diventa formaggio nel caseificio interno, la carne
          viene lavorata nella macelleria della masseria e cucinata nell'agriturismo.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-[color:var(--carbone)]/80">
          Non importiamo nulla da fuori. Ogni piatto che arriva in sala racconta il lavoro di chi
          vive e lavora in questa masseria, ogni giorno, prima che si apra la tavola.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-[color:var(--carbone)]/80">
          Oggi la masseria è iscritta alla Camera di Commercio dal {MASSERIA.cciaaDal}, e porta
          avanti la tradizione di un'agricoltura che non separa la produzione dalla cucina.
          Allevamento, caseificio, macelleria e agriturismo non sono reparti diversi: sono i
          passaggi di un'unica filiera.
        </p>
      </section>
    </div>
  );
}
