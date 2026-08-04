import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimaChiusura, AnimaHero, AnimaPagina, AnimaSezione } from "@/components/anime/AnimaPagina";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";

export const Route = createFileRoute("/agriturismo")({
  head: () => ({
    meta: [
      { title: "Agriturismo — Masseria Don Gianvito · Noci" },
      { name: "description", content: "Cucina del tempo lungo: Pecora in Pignata, brace e tavola serale." },
      { property: "og:title", content: "Agriturismo — Masseria Don Gianvito" },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { property: "og:url", content: getAbsoluteUrl("/agriturismo") },
      { property: "og:type", content: "restaurant" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/agriturismo") }],
  }),
  component: AgriturismoPage,
});

function AgriturismoPage() {
  return (
    <AnimaPagina>
      {/* HERO: Biscotto scuro caldo, luce, tavola */}
      <section data-tone="dark" data-reveal-group className="relative min-h-[85dvh] flex flex-col justify-end bg-[color:var(--biscotto-scuro)] pb-24" style={{ paddingTop: "var(--page-header-safe-offset)" }}>
         <div className="absolute inset-0 opacity-40">
           <div className="w-full h-full bg-gradient-to-tr from-[color:var(--carbone)] to-[color:var(--oro-antico)]/20" />
           <div data-reveal className="absolute inset-0 flex items-center justify-center font-eyebrow text-[12px]">FOTO HERO — TAVOLA SERALE</div>
         </div>
         <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5">
           <p data-reveal className="font-eyebrow text-[13px] tracking-[0.3em] text-[color:var(--oro-su-scuro)] italic">IV · Agriturismo</p>
           <h1 data-reveal className="mt-8 font-display text-[clamp(2.5rem,8vw,5rem)] leading-[0.9] text-[color:var(--bianco-calce)]">
             Cinque ore<br />
             <span className="italic text-[color:var(--oro-su-scuro)]">prima che</span><br />
             tu ti sieda.
           </h1>
         </div>
      </section>

      <AnimaSezione tone="dark" layout="full-width" occhiello="01 · La Pecora" titolo="La Pecora in Pignata" 
        paragrafi={["È il piatto che porta il tempo lungo in tavola. Cinque ore di fuoco."]}
        fotoEtichetta="DETTAGLIO PIGNATA SUL FUOCO" ratio="21 / 9" />

      <div className="bg-[color:var(--biscotto)] text-[color:var(--carbone)] py-16 text-center px-5">
        <h2 className="font-display text-[2rem]">Prenotazione consigliata</h2>
        <p className="mt-4">Contattaci per confermare il tuo tavolo.</p>
        <a href="/#prenota" className="inline-block mt-8 bg-[color:var(--carbone)] text-[color:var(--bianco-calce)] px-8 py-4 font-eyebrow text-[11px] tracking-[0.2em]">PRENOTA ORA</a>
      </div>

      <AnimaChiusura corrente="agriturismo" />
    </AnimaPagina>
  );
}
