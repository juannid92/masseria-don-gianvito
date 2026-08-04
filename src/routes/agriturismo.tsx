import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimaPagina, FotoSegnaposto } from "@/components/anime/AnimaPagina";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";
import { useHomeSectionNav } from "@/lib/nav";
import { ANIME } from "@/data/masseria";

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
  const goToSection = useHomeSectionNav();
  const allevamento = ANIME.find(a => a.id === 'allevamento');
  const caseificio = ANIME.find(a => a.id === 'caseificio');

  return (
    <AnimaPagina>
      {/* 1. HERO LA SERA */}
      <section 
        data-tone="dark" 
        data-reveal-group
        className="relative min-h-[90dvh] flex flex-col justify-end bg-[color:var(--biscotto-scuro)] pb-16 md:pb-24 overflow-hidden"
        style={{ paddingTop: "var(--page-header-safe-offset)" }}
      >
        {/* Luce Dorata Direzionale */}
        <div className="absolute top-0 right-0 w-[60%] h-[100%] z-0 pointer-events-none opacity-40">
           <div className="w-full h-full bg-gradient-to-bl from-[color:var(--oro-antico)]/30 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <div>
              <p data-reveal className="font-eyebrow text-[12px] tracking-[0.4em] text-[color:var(--oro-su-scuro)] uppercase mb-6 italic">
                Capitolo IV · Agriturismo
              </p>
              <h1 data-reveal className="font-display text-[clamp(2.8rem,9vw,6rem)] leading-[0.9] text-[color:var(--bianco-calce)]">
                Cinque ore<br />
                <span className="italic text-[color:var(--oro-su-scuro)]">prima che</span><br />
                tu ti sieda.
              </h1>
            </div>
            <div data-reveal className="relative">
               <FotoSegnaposto 
                etichetta="TAVOLA SERALE NELLA LUCE" 
                ratio="16 / 9" 
                tone="dark"
                className="shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SCENA DOMINANTE: PECORA IN PIGNATA */}
      <section data-reveal-group className="py-24 md:py-40 bg-[color:var(--carbone)] text-[color:var(--bianco-calce)]">
        <div className="mx-auto w-full max-w-[1100px] px-5 md:px-12">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-6 md:col-start-7">
               <p data-reveal className="font-eyebrow text-[11px] tracking-[0.3em] text-[color:var(--oro-su-scuro)] mb-4">01 · La Pecora</p>
               <h2 data-reveal className="font-display text-[2.5rem] md:text-[3.5rem] leading-[0.95] mb-8">
                 La Pecora<br />in Pignata
               </h2>
               <p data-reveal className="text-[18px] md:text-[20px] leading-relaxed opacity-80 mb-10">
                 È il piatto che porta il tempo lungo in tavola. Cinque ore di fuoco, dove la materia si trasforma lentamente. Non è solo cibo, è l'attesa che diventa sapore.
               </p>
            </div>
            <div data-reveal className="md:col-span-12 mt-12">
               <FotoSegnaposto 
                etichetta="DETTAGLIO PIGNATA SUL FUOCO" 
                ratio="21 / 9" 
                tone="dark"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPITOLO CORALE: LA TAVOLA */}
      <section data-reveal-group className="py-24 md:py-40 bg-[color:var(--biscotto-scuro)] text-[color:var(--bianco-calce)]">
        <div className="mx-auto w-full max-w-[800px] px-5 text-center">
           <h2 data-reveal className="font-display text-[2.2rem] md:text-[3.2rem] leading-none mb-10">
             Cucina del tempo lungo
           </h2>
           <p data-reveal className="text-[17px] md:text-[18px] leading-relaxed opacity-70 max-w-[62ch] mx-auto">
             Oltre alla pignata, la brace e i piatti della nostra terra. In agriturismo non si consuma un pasto, si partecipa al ritmo della nostra giornata, che culmina nell'incontro serale intorno alla tavola apparecchiata.
           </p>
           <div data-reveal className="mt-16 grid grid-cols-2 gap-4">
              <FotoSegnaposto etichetta="BRACE VIVA" ratio="1 / 1" tone="dark" />
              <FotoSegnaposto etichetta="DETTAGLIO TAVOLA" ratio="1 / 1" tone="dark" />
           </div>
        </div>
      </section>

      {/* 4. BLOCCO PRATICO: PRENOTAZIONE */}
      <section data-reveal-group className="py-24 md:py-32 bg-[color:var(--bianco-calce)] text-[color:var(--carbone)]">
        <div className="mx-auto w-full max-w-[1100px] px-5 md:px-12">
          <div className="bg-[color:var(--pietra-100)] p-8 md:p-16 border border-[color:var(--carbone)]/5">
             <div className="grid md:grid-cols-2 gap-12">
                <div>
                   <h2 data-reveal className="font-display text-[2.2rem] leading-tight mb-8">
                     Ti aspettiamo<br />per cena
                   </h2>
                   <div data-reveal className="space-y-6">
                      <div>
                        <span className="font-eyebrow text-[10px] tracking-[0.3em] opacity-40 block mb-1">Giorni</span>
                        <p className="text-[17px] font-bold">Dal giovedì alla domenica</p>
                      </div>
                      <div>
                        <span className="font-eyebrow text-[10px] tracking-[0.3em] opacity-40 block mb-1">Orario</span>
                        <p className="text-[17px]">Dalle venti in poi</p>
                      </div>
                   </div>
                </div>
                <div className="flex flex-col justify-end gap-8">
                   <div data-reveal className="space-y-4">
                      <p className="text-[15px] opacity-70">
                        La prenotazione è necessaria per permetterci di preparare la pignata e rispettare i tempi della cucina.
                      </p>
                      <button 
                        onClick={() => goToSection('prenota')}
                        className="w-full font-eyebrow h-[60px] flex items-center justify-center bg-[color:var(--carbone)] text-[color:var(--bianco-calce)] text-[11px] tracking-[0.3em] transition-colors hover:bg-[color:var(--oro-antico)]"
                      >
                        PRENOTA UN TAVOLO
                      </button>
                   </div>
                   <div data-reveal className="pt-4 border-t border-[color:var(--carbone)]/10">
                      <p className="font-eyebrow text-[11px] tracking-[0.2em] opacity-60">
                         Oppure chiamaci: <a href="tel:+39000000000" className="font-bold underline">+39 080 000000</a>
                      </p>
                   </div>
                </div>
             </div>
          </div>
          
          <div data-reveal className="mt-24 grid md:grid-cols-2 gap-8">
             {allevamento && (
               <Link to={allevamento.to} className="group p-8 border border-[color:var(--carbone)]/10 transition-colors hover:bg-[color:var(--pietra-100)]">
                 <span className="font-eyebrow text-[10px] tracking-[0.3em] opacity-40 block mb-4">L'inizio</span>
                 <span className="font-display text-[22px] group-hover:text-[color:var(--oro-antico-testo)] transition-colors">Allevamento</span>
               </Link>
             )}
             {caseificio && (
               <Link to={caseificio.to} className="group p-8 border border-[color:var(--carbone)]/10 transition-colors hover:bg-[color:var(--pietra-100)]">
                 <span className="font-eyebrow text-[10px] tracking-[0.3em] opacity-40 block mb-4">La mattina</span>
                 <span className="font-display text-[22px] group-hover:text-[color:var(--oro-antico-testo)] transition-colors">Caseificio</span>
               </Link>
             )}
          </div>
        </div>
      </section>
    </AnimaPagina>
  );
}
