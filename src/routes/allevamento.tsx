import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimaChiusura, AnimaHero, AnimaPagina, AnimaSezione } from "@/components/anime/AnimaPagina";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";

export const Route = createFileRoute("/allevamento")({
  head: () => ({
    meta: [
      { title: "Allevamento — Masseria Don Gianvito · Noci" },
      { name: "description", content: "L'allevamento della Masseria Don Gianvito a Noci: animali cresciuti negli stessi campi che li nutrono." },
      { property: "og:title", content: "Allevamento — Masseria Don Gianvito" },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { property: "og:url", content: getAbsoluteUrl("/allevamento") },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/allevamento") }],
  }),
  component: AllevamentoPage,
});

function AllevamentoPage() {
  return (
    <AnimaPagina>
      {/* HERO: Ariosa, orizzontale, linea dorata */}
      <section data-tone="light" data-reveal-group className="relative min-h-[85dvh] flex flex-col justify-end bg-[color:var(--bianco-calce)] pb-24" style={{ paddingTop: "var(--page-header-safe-offset)" }}>
        <div className="absolute inset-0 z-0 opacity-20 bg-[color:var(--biscotto)]">
           <div data-reveal className="h-full w-full flex items-center justify-center font-eyebrow text-[12px] tracking-[0.3em]">FOTO HERO — PANORAMICA PASCOLO</div>
        </div>
        
        {/* Linea orizzontale dorata */}
        <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[color:var(--oro-antico)] to-transparent opacity-50 z-10" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5">
           <p data-reveal className="font-eyebrow text-[13px] tracking-[0.3em] italic text-[color:var(--oro-antico-testo)]">I · Allevamento</p>
           <h1 data-reveal className="mt-8 font-display text-[clamp(3rem,9vw,6rem)] leading-[0.9] text-[color:var(--carbone)]">
             Gli animali<br />
             crescono<br />
             <span className="italic text-[color:var(--oro-antico-testo)]">dove mangiano.</span>
           </h1>
        </div>
      </section>

      <AnimaSezione tone="light" layout="full-width" occhiello="01 · Gli animali" titolo="Chi vive in masseria" 
        paragrafi={["I bovini sono di Pezzata Rossa incrociata con Frisona: danno il latte del mattino e la carne del banco.", "Ogni specie ha il suo spazio e il suo ritmo."]}
        fotoEtichetta="PANORAMICA PASCOLO ESTERNO" ratio="21 / 9" />

      <AnimaSezione tone="dark" layout="text-left" occhiello="02 · La terra" titolo="Quello che cresce qui" 
        paragrafi={["Il foraggio va agli animali, il resto va in cucina. Quando il campo dà meno, si dà meno anche a tavola."]}
        fotoEtichetta="DETTAGLIO FORAGGIO E CAMPO" />

      <AnimaChiusura corrente="allevamento" />
    </AnimaPagina>
  );
}
