import { createFileRoute } from "@tanstack/react-router";
import { GalleriaProdotti } from "@/components/galleria/GalleriaProdotti";
import { RouteAtmosphere } from "@/components/journey/RouteAtmosphere";

export const Route = createFileRoute("/prodotti")({
  component: ProdottiPage,
  meta: [
    {
      title: "Prodotti — Masseria Don Gianvito",
      description:
        "Scopri la nostra selezione di prodotti: mozzarella e formaggi artigianali, carne di razze pugliesi, olio extravergine e vini DOC.",
    },
  ],
});

function ProdottiPage() {
  return (
    <>
      <RouteAtmosphere />
      {/* Hero della pagina */}
      <section
        className="relative py-20 md:py-32 px-4 md:px-8 overflow-hidden"
        style={{ backgroundColor: "var(--biscotto-scuro)" }}
      >
        <div className="max-w-6xl mx-auto relative z-10">
          <p
            className="font-eyebrow text-xs tracking-widest uppercase mb-4"
            style={{ color: "var(--oro-su-scuro)" }}
          >
            La Nostra Terra
          </p>
          <h1
            className="font-display text-4xl md:text-6xl font-light tracking-tight max-w-2xl mb-6"
            style={{ color: "var(--bianco-calce)" }}
          >
            I Prodotti della{" "}
            <em style={{ color: "var(--oro-su-scuro)", fontStyle: "normal" }}>Masseria</em>
          </h1>
          <p className="text-lg max-w-xl leading-relaxed" style={{ color: "var(--pietra-200)" }}>
            Dal caseificio alla macelleria, dall'olio al vino: ogni prodotto racconta la storia di
            una filiera corta, trasparente e radicata nella terra di Noci.
          </p>
        </div>
        {/* Decorazione geometrica */}
        <div
          className="absolute right-0 top-0 w-1/3 h-full opacity-10"
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
        className="py-16 px-4 md:px-8 border-t border-pietra-200"
        style={{ backgroundColor: "var(--bianco-calce)" }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <p
            className="font-eyebrow text-xs tracking-widest uppercase mb-4"
            style={{ color: "var(--oro-antico)" }}
          >
            Acquista i Nostri Prodotti
          </p>
          <h2
            className="font-display text-2xl md:text-3xl font-light tracking-tight mb-4"
            style={{ color: "var(--carbone)" }}
          >
            Vieni a Trovarci in Masseria
          </h2>
          <p
            className="text-base max-w-xl mx-auto mb-8"
            style={{ color: "var(--muted-foreground)" }}
          >
            Acquista direttamente dal caseificio o prenota la tua selezione di carne al chiodo. Ti
            aspettiamo per farti scoprire i sapori autentici della Puglia.
          </p>
          <a
            href="mailto:info@masseriadongianvito.it"
            className="inline-flex items-center justify-center border px-8 py-4 font-eyebrow text-sm tracking-wider uppercase transition-colors hover:bg-[color:var(--oro-antico)] hover:text-[color:var(--bianco-calce)]"
            style={{
              borderColor: "var(--oro-antico)",
              color: "var(--oro-antico)",
            }}
          >
            Contattaci per Informazioni
          </a>
        </div>
      </section>
    </>
  );
}
