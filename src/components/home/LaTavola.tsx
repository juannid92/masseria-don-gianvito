import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHomeSectionNav } from "@/lib/nav";

/**
 * ATTO 05 — LA TAVOLA.
 * Regia: L'ACCUMULO. Una sola inquadratura fissa (sticky, non pin) che si
 * apparecchia mentre lo scroll avanza. Gli elementi arrivano uno dopo l'altro
 * e NON escono mai: si sommano fino a comporre un quadro pieno.
 *
 * Struttura: sezione 240dvh desktop, 260dvh mobile. Dentro, un contenitore
 * `sticky` a piena altezza di viewport contiene la scena. UNA sola timeline
 * scrub aggancia lo scroll dell'intera sezione. Nessun pin GSAP.
 *
 * Livelli fissi: fondo pietra-800, piano (hairline oro), titolo, occhiello 05.
 * Elementi che si accumulano (7):
 *   1. luce che si accende (continua per tutto l'atto)
 *   2. primo segno antipasto + "Si comincia dalla tavola."
 *   3. secondo segno antipasto
 *   4. segno centrale del piatto principale + "Piatti che chiedono tempo."
 *   5. carminio (unica occorrenza dell'atto e ultima del sito)
 *   6. ultimo segno + "Finisce piano."
 *   7. frase di chiusura + CTA
 * Handoff finale: luce si abbassa, entra l'occhiello 06 — LA VOCE.
 *
 * Regole cromatiche: fondo pietra-800 pieno, luce oro-antico crescente,
 * un solo testo oro (display italic "un pasto." in --oro-su-scuro),
 * carminio SOLO al piatto principale, zero oliva, nessuna finta materia.
 * I "segni" sono forme grafiche pure → sostituire con fotografie autentiche
 * prima della pubblicazione.
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
    const willChangeEls: HTMLElement[] = [];

    const ctx = gsap.context(() => {
      const q = (sel: string) => root.querySelector<HTMLElement>(sel);
      const qq = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));

      const cover = q("[data-cover]");
      const luce = q("[data-luce]");
      const arrivi = qq("[data-arrivo]");
      const handoffEye = q("[data-handoff-eyebrow]");

      [cover, luce, handoffEye, ...arrivi].forEach((el) => {
        if (!el) return;
        el.style.willChange = "transform, opacity";
        willChangeEls.push(el);
      });

      // UNA sola timeline scrub sull'intera sezione. Nessun pin.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      // Stacco dal bianco della Filiera → pietra scura (0-8%).
      if (cover) tl.fromTo(cover, { opacity: 1 }, { opacity: 0, duration: 0.08 }, 0);

      // Luce: unico parametro continuo per tutto l'atto (0.15 → 0.95).
      if (luce) tl.fromTo(luce, { opacity: 0.15 }, { opacity: 0.95, duration: 0.82 }, 0.06);

      // Momenti di arrivo (0..1). Ogni elemento arriva UNA volta e resta.
      // start times per data-arrivo index:
      const arrivalStarts = [0.12, 0.20, 0.30, 0.40, 0.50, 0.62, 0.72];
      arrivi.forEach((el, i) => {
        const start = arrivalStarts[i] ?? 0.72;
        tl.fromTo(
          el,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.14 },
          start,
        );
      });

      // Chiusura: luce si abbassa, entra occhiello Atto 06.
      if (luce) tl.to(luce, { opacity: 0.42, duration: 0.1 }, 0.9);
      if (handoffEye) tl.fromTo(handoffEye, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.08 }, 0.94);
    }, root);

    return () => {
      ctx.revert();
      willChangeEls.forEach((el) => (el.style.willChange = ""));
    };
  }, [reduced]);

  const statico = reduced;

  return (
    <section
      id="tavola"
      data-act="tavola"
      data-tone="dark"
      ref={rootRef}
      aria-label="La Tavola"
      className="relative isolate w-full overflow-hidden bg-[color:var(--pietra-800)] text-[color:var(--bianco-calce)] min-h-[260dvh] [@media(min-width:900px)]:min-h-[240dvh]"
    >
      {/* Grana statica, materia senza costo paint. */}
      <div
        aria-hidden
        className="grain pointer-events-none absolute inset-0 z-0 opacity-15"
        style={{ transform: "translateZ(0)" }}
      />

      {/* ========================================================
          SCENA STICKY — una sola inquadratura, tenuta ferma mentre
          lo scroll avanza. Sticky CSS, non pin GSAP.
          ======================================================== */}
      <div
        className="sticky top-0 z-[1] flex h-[100dvh] w-full items-center justify-center overflow-hidden"
      >
        {/* Cover bianco-calce → sfuma per stacco dalla Filiera. */}
        <div
          data-cover
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6]"
          style={{
            opacity: statico ? 0 : 1,
            background:
              "linear-gradient(180deg, var(--bianco-calce) 0%, color-mix(in oklab, var(--bianco-calce) 55%, var(--pietra-800)) 55%, var(--pietra-800) 100%)",
          }}
        />

        {/* LUCE dorata direzionale — unico parametro continuo. */}
        <div
          data-luce
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            opacity: statico ? 0.9 : 0.15,
            background:
              "radial-gradient(58% 46% at 50% 42%, color-mix(in oklab, var(--oro-antico) 26%, transparent) 0%, transparent 68%)",
          }}
        />

        {/* PIANO — hairline oro orizzontale, ancora la scena. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-[62%] z-[2] h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--oro-antico) 45%, transparent) 22%, var(--oro-antico) 50%, color-mix(in oklab, var(--oro-antico) 45%, transparent) 78%, transparent 100%)",
          }}
        />

        {/* SEGNI grafici che si accumulano sul piano.
            → Sostituire con fotografie autentiche prima della pubblicazione. */}
        <div className="pointer-events-none absolute inset-0 z-[3]" aria-hidden>
          {/* 1. antipasto A — piccolo cerchio in alto a sinistra del piano */}
          <span
            data-arrivo="antipasto-a"
            className="absolute left-[16%] top-[46%] block h-[110px] w-[110px] rounded-full border border-[color:var(--oro-antico)]/55 md:h-[140px] md:w-[140px]"
            style={{ opacity: statico ? 1 : 0 }}
          />
          {/* 2. antipasto B — ovale piccolo accanto */}
          <span
            data-arrivo="antipasto-b"
            className="absolute left-[30%] top-[54%] block h-[36px] w-[110px] rounded-full bg-[color:var(--bianco-calce)]/10 ring-1 ring-[color:var(--bianco-calce)]/25 md:h-[46px] md:w-[150px]"
            style={{ opacity: statico ? 1 : 0 }}
          />
          {/* 3. piatto principale — cerchio grande al centro */}
          <span
            data-arrivo="piatto-centrale"
            className="absolute left-1/2 top-[52%] block h-[180px] w-[180px] -translate-x-1/2 rounded-full border-2 border-[color:var(--oro-antico)]/65 md:h-[220px] md:w-[220px]"
            style={{ opacity: statico ? 1 : 0 }}
          />
          {/* 4. carminio — brace al centro del piatto principale (unico e ultimo del sito) */}
          <span
            data-arrivo="carminio"
            data-carminio
            className="absolute left-1/2 top-[52%] block h-[64px] w-[64px] -translate-x-1/2 rounded-full md:h-[84px] md:w-[84px]"
            style={{
              opacity: statico ? 0.95 : 0,
              background:
                "radial-gradient(circle at 50% 50%, var(--carminio) 0%, color-mix(in oklab, var(--carminio-scuro) 90%, transparent) 65%, transparent 100%)",
            }}
          />
          {/* 5. dolce — arco piccolo a destra del piano */}
          <span
            data-arrivo="ultimo-segno"
            className="absolute right-[16%] top-[50%] block h-[70px] w-[70px] rounded-full border border-[color:var(--bianco-calce)]/40 md:h-[86px] md:w-[86px]"
            style={{ opacity: statico ? 1 : 0 }}
          />
          <span
            aria-hidden
            data-arrivo-ghost
            className="absolute right-[26%] top-[60%] hidden h-[8px] w-[100px] rounded-full bg-[color:var(--oro-antico)]/30"
          />
        </div>

        {/* CONTENUTO EDITORIALE fisso: occhiello + titolo dell'atto. */}
        <div className="relative z-[4] mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 text-center md:px-10">
          <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70 md:text-[11px]">
            05 — LA TAVOLA
          </p>
          <h2 className="mt-6 max-w-[14ch] font-display text-[clamp(2.4rem,6.8vw,5.4rem)] leading-[0.94] text-[color:var(--bianco-calce)] md:mt-8">
            <span className="block">La filiera</span>
            <span className="ml-[3%] block">diventa</span>
            <span className="ml-[1%] block italic text-[color:var(--oro-su-scuro)]">un pasto.</span>
          </h2>

          {/* MOMENTI — arrivano uno per volta, restano.
              Sono didascalie brevi accanto ai segni. */}
          <div className="mt-10 flex w-full max-w-[52ch] flex-col items-center gap-3 text-[15px] leading-relaxed text-[color:var(--bianco-calce)]/85 md:text-[16px]">
            <p
              data-arrivo="momento-1"
              className="italic"
              style={{ opacity: statico ? 1 : 0 }}
            >
              Si comincia dalla tavola.
            </p>
            <p
              data-arrivo="momento-2"
              className="italic"
              style={{ opacity: statico ? 1 : 0 }}
            >
              Piatti che chiedono tempo.
            </p>
            <p
              data-arrivo="momento-3"
              className="italic"
              style={{ opacity: statico ? 1 : 0 }}
            >
              Finisce piano.
            </p>
          </div>

          {/* CHIUSURA — frase + CTA, ultimo arrivo. Non se ne va. */}
          <div
            data-arrivo="chiusura"
            className="mt-10 flex w-full flex-col items-center gap-6 md:mt-12"
            style={{ opacity: statico ? 1 : 0 }}
          >
            <p className="max-w-[22ch] font-display text-[clamp(1.4rem,2.8vw,2.1rem)] leading-[1.1] text-[color:var(--bianco-calce)]">
              Il rito completo <span className="italic">è nell'Agriturismo.</span>
            </p>
            <div className="flex w-full max-w-md flex-col items-stretch gap-3 md:w-auto md:flex-row md:items-center md:justify-center">
              <Link
                to="/agriturismo"
                className="inline-flex min-h-[48px] items-center justify-center border border-[color:var(--oro-antico)] bg-[color:var(--oro-antico)] px-7 py-3 font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--carbone)] transition-colors hover:bg-[color:var(--bianco-calce)] hover:border-[color:var(--bianco-calce)]"
              >
                SCOPRI L'AGRITURISMO →
              </Link>
              <button
                type="button"
                onClick={() => goToSection("prenota")}
                className="inline-flex min-h-[48px] items-center justify-center border border-[color:var(--bianco-calce)]/50 px-7 py-3 font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--bianco-calce)] transition-colors hover:border-[color:var(--oro-antico)] hover:text-[color:var(--oro-antico)]"
              >
                PRENOTA UN TAVOLO
              </button>
            </div>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-[color:var(--bianco-calce)]/70">
              Piatti e disponibilità possono cambiano. Contatta la Masseria per confermare il menu del giorno.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          HANDOFF — bordo inferiore della sezione. Fondo pietra-800
          pieno, coincidente con l'inizio dell'Atto 06. Gap 0px.
          ======================================================== */}
      <div className="relative z-[2] bg-[color:var(--pietra-800)]">
        <div aria-hidden className="hairline-oro" />
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 py-6 md:px-10 md:py-8">
          <span aria-hidden className="h-px w-10 bg-[color:var(--oro-antico)]/70" />
          <p
            data-handoff-eyebrow
            className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--bianco-calce)]/80 md:text-[10px]"
            style={{ opacity: statico ? 1 : 0 }}
          >
            06 — LA VOCE
          </p>
        </div>
      </div>
    </section>
  );
}
