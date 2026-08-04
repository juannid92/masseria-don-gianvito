import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimaPagina, FotoSegnaposto } from "@/components/anime/AnimaPagina";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";
import { useHomeSectionNav } from "@/lib/nav";
import { ANIME } from "@/data/masseria";

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
  const goToSection = useHomeSectionNav();
  const caseificio = ANIME.find(a => a.id === 'caseificio');
  const macelleria = ANIME.find(a => a.id === 'macelleria');

  return (
    <AnimaPagina>
      {/* 1. HERO ORIZZONTE */}
      <section 
        data-tone="light" 
        data-reveal-group
        className="relative min-h-[90dvh] flex flex-col justify-end pb-12 md:pb-24 overflow-hidden"
        style={{ paddingTop: "var(--page-header-safe-offset)" }}
      >
        {/* Background Orizzonte */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="w-[120%] h-[120%] bg-gradient-to-b from-[color:var(--oro-antico)]/5 to-transparent rotate-1" />
        </div>

        {/* Linea Orizzonte Dorata */}
        <div 
          className="absolute top-[35%] left-0 w-full h-px z-10 opacity-30"
          style={{ 
            background: "linear-gradient(90deg, transparent 0%, var(--oro-antico) 50%, transparent 100%)" 
          }}
        />

        <div className="relative z-20 mx-auto w-full max-w-[1400px] px-5 md:px-12">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <p data-reveal className="font-eyebrow text-[12px] tracking-[0.4em] text-[color:var(--oro-antico-testo)] uppercase">
                Capitolo I · Allevamento
              </p>
              <h1 data-reveal className="mt-8 font-display text-[clamp(2.8rem,10vw,7rem)] leading-[0.85] text-[color:var(--carbone)]">
                Gli animali crescono<br />
                <span className="italic text-[color:var(--oro-antico-testo)]">dove mangiano.</span>
              </h1>
            </div>
            <div className="md:col-span-4 md:text-right">
              <p data-reveal className="text-[17px] leading-relaxed max-w-[32ch] ml-auto opacity-70">
                La terra di Noci nutre chi la abita. Una filiera che non conosce distanze.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CAPITOLO PANORAMICO */}
      <section data-reveal-group className="py-20 md:py-32">
        <div className="mx-auto w-full max-w-[1400px] px-5 md:px-12">
          <div data-reveal className="relative">
            <FotoSegnaposto 
              etichetta="PANORAMICA PASCOLO 21:9" 
              ratio="21 / 9" 
              className="shadow-sm"
            />
            {/* Numero editoriale */}
            <span className="absolute -top-8 md:-top-16 -left-4 md:-left-8 font-display text-[8rem] md:text-[14rem] leading-none opacity-5 text-[color:var(--oro-antico)] select-none pointer-events-none">
              01
            </span>
          </div>
          <div className="mt-12 md:mt-20 grid md:grid-cols-12 gap-10">
            <div className="md:col-span-4">
              <h2 data-reveal className="font-display text-[2.4rem] leading-none text-[color:var(--carbone)]">
                Chi vive<br />in masseria
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p data-reveal className="text-[18px] md:text-[20px] leading-relaxed text-[color:var(--carbone)]">
                I bovini sono di Pezzata Rossa incrociata con Frisona: danno il latte del mattino e la carne del banco. Ogni specie ha il suo spazio e il suo ritmo, seguendo l'andamento naturale delle stagioni pugliesi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPITOLO RAVVICINATO */}
      <section data-reveal-group className="pb-24 md:pb-40 bg-[color:var(--pietra-100)]">
        <div className="mx-auto w-full max-w-[1100px] px-5 md:px-12 pt-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <p data-reveal className="font-eyebrow text-[11px] tracking-[0.3em] opacity-50 mb-6">
                02 · La Terra
              </p>
              <h2 data-reveal className="font-display text-[2rem] md:text-[2.8rem] leading-[1.1] mb-8">
                Quello che<br />cresce qui
              </h2>
              <p data-reveal className="text-[17px] leading-relaxed opacity-80">
                Il foraggio va agli animali, il resto va in cucina. Quando il campo dà meno, si dà meno anche a tavola. È un patto di onestà con la terra: accettiamo quello che ci offre, senza forzature.
              </p>
            </div>
            <div data-reveal className="order-1 md:order-2">
              <FotoSegnaposto 
                etichetta="DETTAGLIO FORAGGIO E CAMPO" 
                ratio="4 / 5" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. CHIUSURA PASSAGGIO */}
      <section data-reveal-group className="py-24 md:py-32 border-t border-[color:var(--carbone)]/5">
        <div className="mx-auto w-full max-w-[1100px] px-5 md:px-12 text-center">
          <h2 data-reveal className="font-display text-[2.2rem] md:text-[3.2rem] leading-none mb-12">
            La filiera continua
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-[color:var(--carbone)]/10 border border-[color:var(--carbone)]/10">
            {caseificio && (
              <Link 
                to={caseificio.to}
                data-reveal
                className="group bg-[color:var(--bianco-calce)] p-12 transition-colors hover:bg-[color:var(--pietra-100)]"
              >
                <span className="font-eyebrow text-[11px] tracking-[0.3em] opacity-40 mb-4 block">Caseificio</span>
                <span className="font-display text-[24px] group-hover:text-[color:var(--oro-antico-testo)] transition-colors">Il latte fa pochi metri</span>
              </Link>
            )}
            {macelleria && (
              <Link 
                to={macelleria.to}
                data-reveal
                className="group bg-[color:var(--bianco-calce)] p-12 transition-colors hover:bg-[color:var(--pietra-100)]"
              >
                <span className="font-eyebrow text-[11px] tracking-[0.3em] opacity-40 mb-4 block">Macelleria</span>
                <span className="font-display text-[24px] group-hover:text-[color:var(--oro-antico-testo)] transition-colors">Si sceglie guardando</span>
              </Link>
            )}
          </div>
          
          <div data-reveal className="mt-20">
            <button 
              onClick={() => goToSection('prenota')}
              className="font-eyebrow inline-flex h-[56px] items-center px-10 bg-[color:var(--carbone)] text-[color:var(--bianco-calce)] text-[11px] tracking-[0.3em] transition-colors hover:bg-[color:var(--oro-antico)]"
            >
              PRENOTA UN TAVOLO
            </button>
          </div>
        </div>
      </section>
    </AnimaPagina>
  );
}
