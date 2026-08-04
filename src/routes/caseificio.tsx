import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimaPagina, FotoSegnaposto } from "@/components/anime/AnimaPagina";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";
import { useHomeSectionNav } from "@/lib/nav";
import { ANIME } from "@/data/masseria";

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
  const goToSection = useHomeSectionNav();
  const agriturismo = ANIME.find(a => a.id === 'agriturismo');
  const macelleria = ANIME.find(a => a.id === 'macelleria');

  return (
    <AnimaPagina>
      {/* 1. HERO IL GESTO */}
      <section 
        data-tone="light" 
        data-reveal-group
        className="relative min-h-[85dvh] md:min-h-[75dvh] flex items-center bg-[color:var(--bianco-calce)] overflow-hidden"
        style={{ paddingTop: "var(--page-header-safe-offset)" }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-full md:w-5/12 order-2 md:order-1">
              <div data-reveal className="relative">
                <FotoSegnaposto 
                  etichetta="DETTAGLIO FILATURA MANI" 
                  ratio="3 / 4" 
                  className="rounded-t-full"
                />
                {/* Linea grafica curva che accompagna il gesto */}
                <svg className="absolute -right-12 -bottom-12 w-32 h-32 text-[color:var(--oro-antico)] opacity-30" viewBox="0 0 100 100" fill="none">
                  <path d="M10,90 Q50,10 90,90" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
            <div className="w-full md:w-7/12 order-1 md:order-2">
              <p data-reveal className="font-eyebrow text-[12px] tracking-[0.4em] text-[color:var(--oro-antico-testo)] uppercase mb-6">
                Capitolo II · Caseificio
              </p>
              <h1 data-reveal className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] text-[color:var(--carbone)]">
                Il latte non<br />
                fa strada.<br />
                <span className="italic text-[color:var(--oro-antico-testo)]">Fa pochi metri.</span>
              </h1>
              <div data-reveal className="mt-10 max-w-[38ch]">
                <p className="text-[17px] leading-relaxed opacity-70">
                  Lavoriamo il latte dove nasce, rispettando la materia viva nel tempo breve del mattino.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SCENA CENTRALE: IL GESTO */}
      <section data-reveal-group className="py-24 md:py-40 bg-[color:var(--pietra-100)]">
        <div className="mx-auto w-full max-w-[800px] px-5 text-center">
          <h2 data-reveal className="font-display text-[2.2rem] md:text-[3.2rem] leading-none mb-12">
            Il latte entra subito
          </h2>
          <div className="flex flex-col gap-10">
            <p data-reveal className="text-[18px] md:text-[21px] leading-relaxed font-serif italic text-[color:var(--carbone)]/80">
              "Il latte arriva dalle stalle e non aspetta. Quello che entra la mattina si lavora nella stessa mattina."
            </p>
            <div data-reveal className="hairline-oro mx-auto max-w-[120px]" />
            <p data-reveal className="text-[17px] leading-relaxed opacity-70">
              La pasta si tira, si gira, si chiude. La mozzarella prende forma nelle mani, una alla volta, seguendo una gestualità che si ripete identica da generazioni nella nostra Masseria.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FASCIA EDITORIALE PRODOTTI */}
      <section data-reveal-group className="py-24 md:py-32 bg-[color:var(--bianco-calce)]">
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 md:gap-32 items-end">
            <div>
               <p data-reveal className="font-eyebrow text-[11px] tracking-[0.3em] opacity-40 mb-4">I prodotti del giorno</p>
               <h3 data-reveal className="font-display text-[2rem] leading-none mb-8">La freschezza<br />non ha orari</h3>
               <ul data-reveal className="space-y-4 border-l border-[color:var(--oro-antico)]/20 pl-6">
                 <li className="text-[17px] opacity-80">Mozzarella a mano</li>
                 <li className="text-[17px] opacity-80">Nodini di Noci</li>
                 <li className="text-[17px] opacity-80">Ricotta di siero</li>
                 <li className="text-[17px] opacity-80">Formaggi freschi</li>
               </ul>
            </div>
            <div data-reveal>
              <FotoSegnaposto 
                etichetta="DETTAGLIO NODINI E FORMAGGI" 
                ratio="1 / 1" 
                className="grayscale-[0.2]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHIUSURA CONNETTI */}
      <section data-reveal-group className="py-24 md:py-32 border-t border-[color:var(--carbone)]/5 bg-[color:var(--pietra-100)]">
        <div className="mx-auto w-full max-w-[1100px] px-5 md:px-12">
          <div className="grid md:grid-cols-3 gap-px bg-[color:var(--carbone)]/10 border border-[color:var(--carbone)]/10">
            <Link 
              to="/allevamento"
              data-reveal
              className="bg-[color:var(--bianco-calce)] p-10 flex flex-col justify-between aspect-square transition-colors hover:bg-[color:var(--pietra-100)]"
            >
              <span className="font-eyebrow text-[10px] tracking-[0.3em] opacity-40">Origine</span>
              <span className="font-display text-[20px]">Allevamento</span>
            </Link>
            {macelleria && (
              <Link 
                to={macelleria.to}
                data-reveal
                className="bg-[color:var(--bianco-calce)] p-10 flex flex-col justify-between aspect-square transition-colors hover:bg-[color:var(--pietra-100)]"
              >
                <span className="font-eyebrow text-[10px] tracking-[0.3em] opacity-40">Il banco</span>
                <span className="font-display text-[20px]">Macelleria</span>
              </Link>
            )}
            {agriturismo && (
              <Link 
                to={agriturismo.to}
                data-reveal
                className="bg-[color:var(--bianco-calce)] p-10 flex flex-col justify-between aspect-square transition-colors hover:bg-[color:var(--pietra-100)]"
              >
                <span className="font-eyebrow text-[10px] tracking-[0.3em] opacity-40">A tavola</span>
                <span className="font-display text-[20px]">Agriturismo</span>
              </Link>
            )}
          </div>
          <div className="mt-16 text-center">
             <button 
              onClick={() => goToSection('prenota')}
              className="font-eyebrow inline-flex h-[52px] items-center px-10 border border-[color:var(--carbone)] text-[10px] tracking-[0.3em] transition-all hover:bg-[color:var(--carbone)] hover:text-[color:var(--bianco-calce)]"
            >
              PRENOTA UN TAVOLO
            </button>
          </div>
        </div>
      </section>
    </AnimaPagina>
  );
}
