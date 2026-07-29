import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHomeSectionNav } from "@/lib/nav";

/**
 * ATTO 05 — LA TAVOLA (rifacimento tipografico).
 *
 * Regia: MANIFESTO STAMPATO. Niente cerchi né archi: solo tipografia
 * grande, fili oro sottili e una singola campitura carminio dietro una
 * parola. La scena è già una pagina composta a metà al primo frame,
 * poi le parole si aggiungono e restano — non se ne va mai nessuna.
 *
 * Struttura (una sola timeline scrub 0.8, un solo ScrollTrigger, zero pin):
 *   Section 200dvh desktop / 220dvh mobile.
 *   Sticky child 100dvh (CSS sticky, no pin GSAP).
 *   start "top 25%" → pre-scroll 25vh prima dell'aggancio in cima.
 *   end   "bottom bottom" → coincide ESATTAMENTE con la fine del sticky
 *     (section.bottom = viewport.bottom ⇔ sticky si stacca). Nessun tratto
 *     morto dopo l'ultima animazione: la scena si stacca subito e la
 *     sezione finisce. Verifica numerica nel report di consegna.
 *   Total scrub desktop: pre 25vh + sticky 100vh = 125vh; progressione allo
 *     stick ≈ 0.20. Mobile: pre 25vh + sticky 120vh = 145vh; stick ≈ 0.17.
 *
 * Quattro arrivi larghi:
 *   1. Titolo dell'atto (già in scena, entra opacità piena)      0.00–0.15
 *   2. Prima e seconda didascalia insieme                        0.20–0.35
 *   3. Terza didascalia + accensione della campitura carminio    0.45–0.60
 *      dietro la parola "piano" (unica occorrenza del rosso)
 *   4. Chiusura + CTA                                            0.65–0.75
 *   Handoff (luce che scende, occhiello Atto 06)                 0.85–1.00
 *
 * Palette: fondo --biscotto-scuro pieno (marrone caldo, zero verde),
 * luce dorata direzionale (l'unico elemento che cresce di continuo),
 * testo bianco-calce, un solo testo oro (Fraunces italic "un pasto"),
 * occhielli in bianco-calce/70, carminio come CAMPITURA dietro una parola.
 * L'unica grafica ammessa sono fili oro sottili (hairline) come separatori.
 *
 * Nota fotografie: la composizione NON dipende da immagini. Se in futuro
 * si volesse innestare una fotografia autentica (piatto, mani, tavola),
 * il punto naturale è la fascia sotto la terza didascalia, come ritaglio
 * orizzontale sottile; finché non esiste, il manifesto regge da solo.
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

      const luce = q("[data-luce]");
      const titolo = q("[data-arrivo='titolo']");
      const rulesTop = qq("[data-rule='top']");
      const didascalieAB = qq("[data-arrivo='didascalie-ab']");
      const didascaliaC = q("[data-arrivo='didascalia-c']");
      const carminioBlock = q("[data-carminio]");
      const chiusura = q("[data-arrivo='chiusura']");
      const handoffEye = q("[data-handoff-eyebrow]");

      [luce, titolo, chiusura, handoffEye, didascaliaC, carminioBlock, ...didascalieAB, ...rulesTop].forEach((el) => {
        if (!el) return;
        el.style.willChange = "transform, opacity";
        willChangeEls.push(el);
      });

      // UNA sola timeline scrub sull'intera sezione. Nessun pin.
      // Start "top 25%": pre-scroll di 25vh prima dello stick.
      // End "bottom bottom": coincide con la fine del sticky (section.bottom
      // = viewport.bottom ⇔ sticky si stacca). Nessun void residuo.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 25%",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      // Luce dorata: cresce in modo continuo per tutta la durata (0.55 → 0.95).
      // È l'unico elemento che si muove senza sosta.
      if (luce) tl.fromTo(luce, { opacity: 0.55 }, { opacity: 0.95, duration: 0.7 }, 0);

      // 1. Titolo — già in scena al primo frame, entra a piena opacità.
      if (titolo) tl.fromTo(titolo, { opacity: 0.35, y: 10 }, { opacity: 1, y: 0, duration: 0.15 }, 0);
      if (rulesTop.length) {
        tl.fromTo(
          rulesTop,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.2 },
          0.02,
        );
      }

      // 2. Prima e seconda didascalia insieme.
      if (didascalieAB.length) {
        tl.fromTo(
          didascalieAB,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.15, stagger: 0 },
          0.20,
        );
      }

      // 3. Terza didascalia + campitura carminio dietro "piano".
      if (didascaliaC) tl.fromTo(didascaliaC, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.15 }, 0.45);
      if (carminioBlock) {
        tl.fromTo(
          carminioBlock,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.18 },
          0.48,
        );
      }

      // 4. Chiusura + CTA — ultimo arrivo completato entro 0.75.
      if (chiusura) tl.fromTo(chiusura, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.15 }, 0.60);

      // Handoff nell'ultimo quarto: luce scende, occhiello Atto 06 entra.
      if (luce) tl.to(luce, { opacity: 0.5, duration: 0.1 }, 0.82);
      if (handoffEye) tl.fromTo(handoffEye, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.1 }, 0.88);
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
      className="relative isolate w-full bg-[color:var(--biscotto-scuro)] text-[color:var(--bianco-calce)] min-h-[220dvh] [@media(min-width:900px)]:min-h-[200dvh]"
    >
      {/* Grana statica: materia leggera senza costo di paint. */}
      <div
        aria-hidden
        className="grain pointer-events-none absolute inset-0 z-0 opacity-15"
        style={{ transform: "translateZ(0)" }}
      />

      {/* ========================================================
          SCENA STICKY — pagina di manifesto tenuta ferma mentre
          lo scroll avanza. Sticky CSS 100dvh: la fine del sticky
          coincide con la fine della sezione (nessun void).
          ======================================================== */}
      <div
        className="sticky top-0 z-[1] flex h-[100dvh] w-full items-stretch justify-center overflow-clip"
      >
        {/* LUCE dorata direzionale — parte già al 55%, sale al 95%, poi cala. */}
        <div
          data-luce
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            opacity: statico ? 0.9 : 0.55,
            background:
              "radial-gradient(70% 55% at 32% 30%, color-mix(in oklab, var(--oro-antico) 26%, transparent) 0%, transparent 72%), radial-gradient(55% 45% at 78% 74%, color-mix(in oklab, var(--oro-antico) 14%, transparent) 0%, transparent 74%)",
          }}
        />

        {/* MANIFESTO TIPOGRAFICO.
            Griglia 12 colonne desktop, layout impilato mobile. Le tre
            didascalie hanno pesi/dimensioni DIVERSI e vivono in colonne
            diverse — non sono una colonna centrata.
            Nota fotografie: se in futuro si aggiunge un'immagine autentica,
            va inserita come ritaglio orizzontale sottile subito sotto la
            didascalia C, senza sostituire nulla del manifesto. */}
        <div className="relative z-[4] mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-x-6 gap-y-0 px-5 pt-[calc(var(--header-offset)+16px)] pb-6 md:gap-x-8 md:px-10 md:pt-[calc(var(--header-offset)+14px)] md:pb-8">

          {/* OCCHIELLO + filo oro superiore */}
          <div className="col-span-12 flex items-center gap-4 md:col-span-8">
            <span
              data-rule="top"
              aria-hidden
              className="block h-px flex-1 origin-left bg-[color:var(--oro-antico)]/70"
              style={{ transform: statico ? "none" : "scaleX(0)" }}
            />
            <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70 md:text-[11px]">
              05 — LA TAVOLA
            </p>
          </div>
          <div className="col-span-12 hidden items-center md:col-span-4 md:flex">
            <span
              data-rule="top"
              aria-hidden
              className="block h-px w-full origin-left bg-[color:var(--oro-antico)]/40"
              style={{ transform: statico ? "none" : "scaleX(0)" }}
            />
          </div>

          {/* TITOLO — grande, sinistra, tre righe con offset diversi. */}
          <h2
            data-arrivo="titolo"
            className="col-span-12 mt-4 font-display text-[clamp(2.4rem,7.2vw,6.4rem)] font-light leading-[0.92] text-[color:var(--bianco-calce)] md:col-span-11 md:mt-6"
            style={{ opacity: statico ? 1 : 0.35 }}
          >
            <span className="block">La filiera</span>
            <span className="ml-[6%] block">diventa</span>
            <span className="ml-[2%] block italic text-[color:var(--oro-su-scuro)]">un pasto.</span>
          </h2>

          {/* DIDASCALIE — dimensioni diverse, colonne diverse, non allineate. */}
          {/* A — sinistra, sotto il titolo, media */}
          <p
            data-arrivo="didascalie-ab"
            className="col-span-12 mt-6 font-display text-[clamp(1.2rem,2.2vw,1.7rem)] italic leading-[1.15] text-[color:var(--bianco-calce)]/85 md:col-span-5 md:col-start-1 md:mt-8"
            style={{ opacity: statico ? 1 : 0 }}
          >
            Si comincia dalla tavola.
          </p>

          {/* B — destra, più piccola, in alto */}
          <p
            data-arrivo="didascalie-ab"
            className="col-span-12 mt-4 text-[16px] leading-[1.45] text-[color:var(--bianco-calce)]/75 md:col-span-4 md:col-start-9 md:mt-10 md:text-[16px]"
            style={{ opacity: statico ? 1 : 0 }}
          >
            Piatti che chiedono tempo.
          </p>

          {/* C — la frase finale con la parola "piano" su campitura carminio.
              Tipo grande, spinta a destra, come chiusa di paragrafo. */}
          <p
            data-arrivo="didascalia-c"
            className="col-span-12 mt-6 font-display text-[clamp(1.8rem,4vw,3rem)] italic leading-[1.05] text-[color:var(--bianco-calce)] md:col-span-9 md:col-start-4 md:mt-10 md:text-right"
            style={{ opacity: statico ? 1 : 0 }}
          >
            Finisce{" "}
            <span className="relative inline-block px-3 py-[0.02em] text-[color:var(--bianco-calce)]">
              <span
                data-carminio
                aria-hidden
                className="absolute inset-0 -z-[1] bg-[color:var(--carminio)]"
                style={{
                  clipPath: statico ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                }}
              />
              piano
            </span>
            .
          </p>

          {/* FILO ORO di chiusura */}
          <div className="col-span-12 mt-8 flex items-center gap-4 md:mt-10">
            <span aria-hidden className="block h-px flex-1 bg-[color:var(--oro-antico)]/45" />
            <span aria-hidden className="block h-px w-2 bg-[color:var(--oro-antico)]" />
            <span aria-hidden className="block h-px flex-1 bg-[color:var(--oro-antico)]/45" />
          </div>

          {/* CHIUSURA — frase editoriale + due CTA + disclaimer. */}
          <div
            data-arrivo="chiusura"
            className="col-span-12 mt-5 flex flex-col items-start gap-4 md:mt-6 md:gap-5"
            style={{ opacity: statico ? 1 : 0 }}
          >
            <p className="max-w-[28ch] font-display text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.15] text-[color:var(--bianco-calce)]">
              Il rito completo <span className="italic">è nell'Agriturismo.</span>
            </p>
            <div className="flex w-full flex-col items-stretch gap-3 md:w-auto md:flex-row md:items-center">
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
            <p className="max-w-[52ch] text-[16px] leading-snug text-[color:var(--bianco-calce)]/70">
              Piatti e disponibilità possono cambiare. Contatta la Masseria per confermare il menu del giorno.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          HANDOFF — bordo inferiore della sezione. Fondo biscotto-scuro
          pieno, coincidente con l'inizio dell'Atto 06. Gap 0px.
          Nota: questa fascia sta SOTTO il sticky (100dvh), quindi entra
          in scena solo quando la sezione si stacca. Non aggiunge void.
          ======================================================== */}
      <div className="relative z-[2] bg-[color:var(--biscotto-scuro)]">
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
