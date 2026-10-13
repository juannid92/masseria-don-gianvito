import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHomeSectionNav } from "@/lib/nav";

/**
 * ATTO 05 — LA TAVOLA.
 * Regia: MANIFESTO TIPOGRAFICO ASIMMETRICO. 
 * Sezione in flusso naturale (no sticky, no pins).
 * Altezza ridotta (150dvh desktop). 
 * Colore: biscotto-scuro (marrone caldo).
 * Gerarchia: 1. Titolo dominante, 2. Frasi coordinate, 3. CTA.
 */
export function LaTavola() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const goToSection = useHomeSectionNav();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const texts = root.querySelectorAll("[data-tavola-anim]");
      const line = root.querySelector("[data-tavola-line]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 70%",
          end: "bottom 80%",
          scrub: 0.8,
        }
      });

      if (line) {
        tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0);
      }

      texts.forEach((el, i) => {
        tl.fromTo(el, 
          { opacity: 0, y: 24 }, 
          { opacity: 1, y: 0, duration: 0.4 }, 
          0.1 + (i * 0.15)
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="tavola"
      data-act="tavola"
      data-tone="dark"
      ref={rootRef}
      className="relative isolate w-full bg-[color:var(--biscotto-scuro)] text-[color:var(--bianco-calce)] overflow-hidden py-24 md:py-32 min-h-[140dvh] md:min-h-[150dvh]"
    >
      <div aria-hidden className="grain absolute inset-0 opacity-10 pointer-events-none" />
      
      <div className="relative z-10 mx-auto max-w-[1400px] px-5 md:px-10 h-full flex flex-col justify-center">
        <Link to="/agriturismo" hash="menu" className="journey-text-link mb-8 inline-block">Esplora il menù dell’agriturismo ↗</Link>
        {/* Composizione Tipografica Asimmetrica */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 md:gap-x-10">
          
          {/* Titolo Protagonista */}
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-[clamp(2.6rem,8vw,7.2rem)] leading-[0.92] font-light">
              <span className="block">La filiera</span>
              <span className="ml-[8%] block">diventa</span>
              <span className="ml-[4%] block italic text-[color:var(--oro-su-scuro)]">un pasto.</span>
            </h2>
          </div>

          {/* Linea Oro di collegamento */}
          <div className="col-span-12 py-4">
             <div data-tavola-line className="h-px w-full origin-left bg-[color:var(--oro-antico)]/40" />
          </div>

          {/* Frasi Secondarie Coordinate */}
          <div data-tavola-anim className="col-span-12 md:col-span-4 md:mt-12">
            <p className="font-display text-[clamp(1.4rem,2.2vw,1.8rem)] italic leading-tight text-[color:var(--bianco-calce)]/90">
              Si comincia <br className="hidden md:block"/> dalla tavola.
            </p>
          </div>

          <div data-tavola-anim className="col-span-12 md:col-span-4 md:mt-24">
            <p className="text-[17px] md:text-[18px] leading-relaxed text-[color:var(--bianco-calce)]/80 max-w-[28ch]">
              Piatti che chiedono il tempo del fuoco e della brace.
            </p>
          </div>

          <div data-tavola-anim className="col-span-12 md:col-span-4 md:mt-6 md:text-right">
            <p className="font-display text-[clamp(1.8rem,3.2vw,2.4rem)] italic leading-none">
              Finisce{" "}
              <span className="relative inline-block px-3 py-1 bg-[color:var(--carminio)] text-[color:var(--bianco-calce)]">
                piano
              </span>
              .
            </p>
          </div>

          {/* Chiusura e CTA */}
          <div data-tavola-anim className="col-span-12 mt-16 md:mt-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
            <div className="max-w-md">
              <p className="font-display text-[22px] md:text-[26px] leading-tight">
                Il rito completo <br className="hidden md:block"/> <span className="italic">è nell'Agriturismo.</span>
              </p>
              <p className="mt-4 text-[15px] text-[color:var(--bianco-calce)]/60 max-w-[45ch]">
                Disponibilità e menu variano con la stagione e il banco del giorno.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link
                to="/agriturismo"
                className="inline-flex min-h-[52px] items-center justify-center border border-[color:var(--oro-antico)] bg-[color:var(--oro-antico)] px-8 font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--carbone)] transition-colors hover:bg-[color:var(--bianco-calce)] hover:border-[color:var(--bianco-calce)]"
              >
                SCOPRI L'AGRITURISMO →
              </Link>
              <button
                type="button"
                onClick={() => goToSection("prenota")}
                className="inline-flex min-h-[52px] items-center justify-center border border-[color:var(--bianco-calce)]/30 px-8 font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--bianco-calce)] transition-colors hover:border-[color:var(--oro-antico)] hover:text-[color:var(--oro-antico)]"
              >
                PRENOTA UN TAVOLO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Handoff immediato */}
      <div className="absolute inset-x-0 bottom-0">
        <div aria-hidden className="hairline-oro opacity-30" />
      </div>
    </section>
  );
}
