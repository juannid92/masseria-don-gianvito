import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimaPagina, FotoSegnaposto } from "@/components/anime/AnimaPagina";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";
import { useHomeSectionNav } from "@/lib/nav";
import { ANIME } from "@/data/masseria";

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
  const goToSection = useHomeSectionNav();
  const allevamento = ANIME.find(a => a.id === 'allevamento');
  const agriturismo = ANIME.find(a => a.id === 'agriturismo');

  return (
    <AnimaPagina>
      {/* 1. HERO MATERICA - 3 LIVELLI */}
      <section 
        data-tone="dark" 
        data-reveal-group
        className="relative min-h-[90dvh] flex items-center justify-center bg-[color:var(--biscotto-scuro)] p-5 overflow-hidden"
        style={{ paddingTop: "var(--page-header-safe-offset)" }}
      >
        {/* Livello 1: Fondo Materico (Cornice) */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] border-[40px] border-[color:var(--biscotto)]" />
        </div>

        <div className="relative z-10 w-full max-w-[1200px] grid md:grid-cols-12 gap-12 items-center">
           {/* Livello 2: Testo Spezzato */}
           <div className="md:col-span-7">
              <p data-reveal className="font-eyebrow text-[12px] tracking-[0.4em] text-[color:var(--oro-su-scuro)] uppercase mb-6">
                Capitolo III · Macelleria
              </p>
              <h1 data-reveal className="font-display text-[clamp(3rem,10vw,7.5rem)] leading-[0.85] text-[color:var(--bianco-calce)]">
                Si sceglie<br />
                <span className="italic text-[color:var(--oro-su-scuro)] ml-[10%]">guardando.</span><br />
                Non leggendo.
              </h1>
           </div>

           {/* Livello 3: Banco Fotografico */}
           <div className="md:col-span-5 relative">
              <div data-reveal className="relative z-20 shadow-2xl translate-y-12">
                <FotoSegnaposto 
                  etichetta="BANCO A VISTA DIETRO VETRO" 
                  ratio="3 / 4" 
                  tone="dark"
                  className="border border-[color:var(--biscotto)]/20"
                />
                {/* Cornice Vetro */}
                <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none" />
              </div>
           </div>
        </div>
      </section>

      {/* 2. CAPITOLO BANCO: IL MODO PIÙ CORTO */}
      <section data-reveal-group className="py-24 md:py-40 bg-[color:var(--biscotto-scuro)] text-[color:var(--bianco-calce)]">
        <div className="mx-auto w-full max-w-[1100px] px-5 md:px-12">
          <div className="grid md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-5">
              <h2 data-reveal className="font-display text-[2.5rem] md:text-[3.5rem] leading-[0.95] mb-8">
                Tutto è<br />in vista
              </h2>
            </div>
            <div className="md:col-span-7">
              <p data-reveal className="text-[18px] md:text-[20px] leading-relaxed opacity-80 mb-10">
                Dietro il vetro la carne è disposta. Si indica il pezzo. È il modo più corto di scegliere, quello che elimina la distanza fra chi produce e chi mangia.
              </p>
              <div data-reveal className="relative max-w-[400px]">
                 <FotoSegnaposto 
                  etichetta="BANCO REFRIGERATO DETTAGLIO" 
                  ratio="16 / 9" 
                  tone="dark"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MATERIA E COLTELLO: IL RIPOSO */}
      <section data-reveal-group className="py-24 md:py-40 bg-[color:var(--carbone)] text-[color:var(--bianco-calce)] overflow-hidden">
        <div className="mx-auto w-full max-w-[1100px] px-5 md:px-12">
          <div className="flex flex-col items-center text-center max-w-[700px] mx-auto">
            <div data-reveal className="w-px h-24 bg-[color:var(--oro-antico)] mb-12 opacity-40" />
            <h2 data-reveal className="font-display text-[2.2rem] md:text-[3rem] leading-none mb-10">
              Quello che c'è cambia
            </h2>
            <p data-reveal className="text-[17px] leading-relaxed opacity-60">
              Non forziamo la materia. Quello che c'è in masseria è quello che trovi al banco. Si guarda e si sceglie fra quello che la terra e il tempo hanno reso pronto.
            </p>
            <div data-reveal className="mt-16 w-full">
               <FotoSegnaposto 
                etichetta="DETTAGLIO COLTELLO E MATERIA" 
                ratio="21 / 9" 
                tone="dark"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHIUSURA MATERICA */}
      <section data-reveal-group className="py-24 md:py-32 bg-[color:var(--biscotto-scuro)] border-t border-[color:var(--biscotto)]/10">
        <div className="mx-auto w-full max-w-[1100px] px-5 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div>
              <h2 data-reveal className="font-display text-[2rem] text-[color:var(--bianco-calce)] mb-8">
                Dall'allevamento<br />alla tavola
              </h2>
              <div className="flex flex-col gap-6">
                {allevamento && (
                  <Link 
                    to={allevamento.to}
                    data-reveal
                    className="group border-b border-[color:var(--biscotto)]/20 pb-6 flex justify-between items-center"
                  >
                    <span className="font-eyebrow text-[11px] tracking-[0.3em] text-[color:var(--oro-su-scuro)] uppercase">Origine</span>
                    <span className="font-display text-[20px] text-[color:var(--bianco-calce)] group-hover:translate-x-2 transition-transform">Allevamento</span>
                  </Link>
                )}
                {agriturismo && (
                  <Link 
                    to={agriturismo.to}
                    data-reveal
                    className="group border-b border-[color:var(--biscotto)]/20 pb-6 flex justify-between items-center"
                  >
                    <span className="font-eyebrow text-[11px] tracking-[0.3em] text-[color:var(--oro-su-scuro)] uppercase">Esperienza</span>
                    <span className="font-display text-[20px] text-[color:var(--bianco-calce)] group-hover:translate-x-2 transition-transform">Agriturismo</span>
                  </Link>
                )}
              </div>
            </div>
            <div className="text-center md:text-right">
               <button 
                onClick={() => goToSection('prenota')}
                className="font-eyebrow inline-flex h-[56px] items-center px-12 bg-[color:var(--oro-su-scuro)] text-[color:var(--carbone)] text-[11px] font-bold tracking-[0.3em] transition-all hover:bg-[color:var(--bianco-calce)]"
              >
                PRENOTA ORA
              </button>
            </div>
          </div>
        </div>
      </section>
    </AnimaPagina>
  );
}
