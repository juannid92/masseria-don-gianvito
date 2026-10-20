import { createFileRoute } from "@tanstack/react-router";
import { GalleriaProdotti } from "@/components/galleria/GalleriaProdotti";
import { getAbsoluteUrl } from "@/config/site";
import { MASSERIA } from "@/data/masseria";

export const Route = createFileRoute("/prodotti")({
  head: () => ({
    meta: [
      {
        title: "Prodotti del Caseificio, della Macelleria e dei Campi — Masseria Don Gianvito",
      },
      {
        name: "description",
        content:
          "Mozzarelle, nodini, primo sale, ricotta, formaggi stagionati, tagli bovini aziendali Pezzata Rossa × Frisona, salumi, focaccia di grano tenero e ortaggi dei campi a Noci.",
      },
      {
        property: "og:title",
        content: "Prodotti del Caseificio, della Macelleria e dei Campi — Masseria Don Gianvito",
      },
      {
        property: "og:description",
        content:
          "Dal caseificio alla macelleria e ai campi: i prodotti autentici della filiera di Masseria Don Gianvito a Noci.",
      },
      { property: "og:url", content: getAbsoluteUrl("/prodotti") },
      { property: "og:image", content: getAbsoluteUrl("/images/caseificio-mozzarelle-ai.svg") },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/prodotti") }],
  }),
  component: ProdottiPage,
});

function ProdottiPage() {
  return (
    <>
      {/* Hero della pagina */}
      <section
        data-tone="dark"
        className="relative py-24 md:py-32 px-5 md:px-10 overflow-hidden"
        style={{
          backgroundColor: "var(--biscotto-scuro)",
          paddingTop: "calc(var(--page-header-safe-offset) + 4rem)",
        }}
      >
        <div className="max-w-[1400px] mx-auto relative z-10">
          <p
            className="font-eyebrow text-[11px] tracking-[0.34em] uppercase mb-4"
            style={{ color: "var(--oro-su-scuro)" }}
          >
            La Filiera della Masseria
          </p>
          <h1
            className="font-display text-[clamp(2.6rem,6vw,4.8rem)] font-light leading-[0.95] tracking-tight max-w-3xl mb-6"
            style={{ color: "var(--bianco-calce)" }}
          >
            I Prodotti della{" "}
            <em style={{ color: "var(--oro-su-scuro)", fontStyle: "italic" }}>Masseria.</em>
          </h1>
          <p
            className="text-[17px] md:text-[19px] max-w-2xl leading-relaxed"
            style={{ color: "var(--pietra-200)" }}
          >
            Dal latte lavorato ogni mattina nel caseificio alla carne del nostro allevamento di
            Pezzata Rossa e Frisona, fino al grano tenero e agli ortaggi dei campi intorno a Noci.
          </p>
        </div>
        {/* Decorazione geometrica */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 70% 30%, var(--oro-su-scuro), transparent 60%)",
          }}
        />
      </section>

      {/* Filo decorativo */}
      <div className="hairline-oro" />

      {/* Galleria Prodotti */}
      <GalleriaProdotti />

      {/* Sezione contatti */}
      <section
        data-tone="light"
        className="py-20 px-5 md:px-10 border-t border-[color:var(--pietra-200)]"
        style={{ backgroundColor: "var(--bianco-calce)" }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="font-eyebrow text-[11px] tracking-[0.32em] uppercase mb-4"
            style={{ color: "var(--oro-antico)" }}
          >
            Acquista in Masseria o Ordina
          </p>
          <h2
            className="font-display text-3xl md:text-4xl font-light tracking-tight mb-4"
            style={{ color: "var(--carbone)" }}
          >
            Vieni a trovarci sulla provinciale per Mottola
          </h2>
          <p
            className="text-[16px] md:text-[17px] max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            La disponibilità dei formaggi e dei tagli varia ogni giorno in base alla lavorazione
            mattutina e al banco della macelleria. Contattaci per verificare le disponibilità o
            prenotare la tua spesa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={MASSERIA.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center bg-[color:var(--oro-antico)] px-8 font-eyebrow text-[11px] tracking-[0.26em] uppercase text-[color:var(--carbone)] transition-opacity hover:opacity-90"
            >
              Scrivici su WhatsApp
            </a>
            <a
              href={MASSERIA.telefonoHref}
              className="inline-flex min-h-[52px] w-full sm:w-auto items-center justify-center border border-[color:var(--oro-antico)] px-8 font-eyebrow text-[11px] tracking-[0.26em] uppercase text-[color:var(--carbone)] transition-colors hover:bg-[color:var(--oro-antico)]/10"
            >
              Chiama {MASSERIA.telefono}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
