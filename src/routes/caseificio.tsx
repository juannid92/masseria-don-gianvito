import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimaChiusura, AnimaHero, AnimaPagina, AnimaSezione } from "@/components/anime/AnimaPagina";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";

export const Route = createFileRoute("/caseificio")({
  head: () => ({
    meta: [
      { title: "Caseificio — Masseria Don Gianvito · Noci" },
      { name: "description", content: "Caseificio artigianale a Noci: il latte lavorato ogni mattina a pochi metri dalle stalle." },
      { property: "og:title", content: "Caseificio — Masseria Don Gianvito" },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { property: "og:url", content: getAbsoluteUrl("/caseificio") },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/caseificio") }],
  }),
  component: CaseificioPage,
});

function CaseificioPage() {
  return (
    <AnimaPagina>
      {/* HERO: Compatta, dettagli ravvicinati */}
      <section data-tone="light" className="relative min-h-[60dvh] flex flex-col justify-end bg-[color:var(--bianco-calce)] pb-16" style={{ paddingTop: "var(--page-header-safe-offset)" }}>
        <div className="mx-auto w-full max-w-[800px] px-5 flex flex-col md:flex-row items-end gap-8">
           <div className="w-full md:w-1/2 aspect-[3/4] bg-[color:var(--biscotto)] flex items-center justify-center">
             <span className="font-eyebrow text-[12px]">FOTO HERO — DETTAGLIO FILATURA</span>
           </div>
           <div className="w-full md:w-1/2 pb-4">
              <p className="font-eyebrow text-[13px] tracking-[0.3em] text-[color:var(--oro-antico-testo)]">II · Caseificio</p>
              <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4rem)] leading-[0.95] text-[color:var(--carbone)]">
                Il latte non<br />
                fa strada.<br />
                <span className="italic text-[color:var(--oro-antico-testo)]">Fa pochi metri.</span>
              </h1>
           </div>
        </div>
      </section>

      <AnimaSezione tone="dark" layout="text-only" occhiello="01 · La mattina" titolo="Il latte entra subito" 
        paragrafi={["Il latte arriva dalle stalle e non aspetta. Quello che entra la mattina si lavora nella stessa mattina."]} />

      <AnimaSezione tone="light" layout="text-left" occhiello="02 · Le mani" titolo="Si lavora a mano" 
        paragrafi={["La pasta si tira, si gira, si chiude. La mozzarella prende forma nelle mani, una alla volta."]}
        fotoEtichetta="Sostituire con fotografia autentica prima della pubblicazione" ratio="4 / 5" />

      <AnimaChiusura corrente="caseificio" />
    </AnimaPagina>
  );
}
