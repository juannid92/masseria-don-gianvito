import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimaChiusura, AnimaHero, AnimaPagina, AnimaSezione } from "@/components/anime/AnimaPagina";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";

export const Route = createFileRoute("/macelleria")({
  head: () => ({
    meta: [
      { title: "Macelleria — Masseria Don Gianvito · Noci" },
      { name: "description", content: "Macelleria con banco a vista: i tagli della masseria scelti guardando." },
      { property: "og:title", content: "Macelleria — Masseria Don Gianvito" },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { property: "og:url", content: getAbsoluteUrl("/macelleria") },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/macelleria") }],
  }),
  component: MacelleriaPage,
});

function MacelleriaPage() {
  return (
    <AnimaPagina>
      {/* HERO: Pietra (scuro), Vetro, Banco */}
      <section data-tone="dark" data-reveal-group className="relative min-h-[70dvh] bg-[color:var(--biscotto-scuro)] flex items-center justify-center p-5" style={{ paddingTop: "var(--page-header-safe-offset)" }}>
         <div className="relative w-full max-w-[900px] border-l-4 border-t-4 border-[color:var(--biscotto)]/30 p-8">
            <p data-reveal className="font-eyebrow text-[13px] tracking-[0.3em] text-[color:var(--oro-su-scuro)]">III · Macelleria</p>
            <h1 data-reveal className="mt-6 font-display text-[clamp(3rem,8vw,5.5rem)] leading-[0.9] text-[color:var(--bianco-calce)]">
              Si sceglie<br />
              <span className="italic text-[color:var(--oro-su-scuro)]">guardando.</span><br />
              Non leggendo.
            </h1>
            <div data-reveal className="absolute right-0 bottom-[-15%] md:bottom-[-20%] w-[45%] aspect-[3/2] bg-[color:var(--pietra-800)] flex items-center justify-center font-eyebrow text-[12px] opacity-90 border border-[color:var(--biscotto)]/20 shadow-xl">
              FOTO HERO — BANCO A VISTA
            </div>
         </div>
      </section>

      <AnimaSezione tone="dark" layout="text-right" occhiello="01 · Il banco" titolo="Tutto è in vista" 
        paragrafi={["Dietro il vetro la carne è disposta. Si indica il pezzo. È il modo più corto di scegliere."]}
        fotoEtichetta="BANCO REFRIGERATO A VISTA" ratio="16 / 9" />

      <AnimaSezione tone="light" layout="text-left" occhiello="02 · I tagli" titolo="Materia e coltello" 
        paragrafi={["Quello che c'è cambia. Si guarda e si sceglie fra quello che c'è."]}
        fotoEtichetta="DETTAGLIO COLTELLO E TAGLIO" ratio="1 / 1" />

      <AnimaChiusura corrente="macelleria" />
    </AnimaPagina>
  );
}
