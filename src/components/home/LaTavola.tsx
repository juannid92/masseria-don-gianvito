import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHomeSectionNav } from "@/lib/nav";

/**
 * ATTO 05 — LA TAVOLA.
 * Regia: L'ACCUMULO CON SCENA GIÀ COMPOSTA A METÀ.
 * Al primo frame visibile: luce al 50%, piano orizzontale pieno, segno
 * centrale del piatto già presente (non ancora illuminato dal carminio),
 * titolo e occhiello leggibili. La scena NON parte mai vuota.
 *
 * Sezione: 200dvh desktop, 220dvh mobile. Contenitore sticky CSS a piena
 * altezza. UNA sola timeline scrub, aggancio quando la sezione entra dal
 * fondo (top 90% desktop, top 100% mobile): al momento in cui la scena si
 * ferma in cima, la progressione è già ~0.20.
 *
 * Quattro momenti larghi (non sette piccoli innesti):
 *   1. luce che sale al massimo (continua)
 *   2. i due segni laterali entrano INSIEME, con le due prime didascalie
 *   3. il carminio si accende sul piatto centrale + terza didascalia
 *   4. la chiusura con le due CTA
 * Ultimo arrivo completato entro il 75%. L'ultimo quarto è solo chiusura
 * e handoff (luce che si abbassa, occhiello Atto 06).
 *
 * Regole cromatiche: fondo pietra-800 pieno, un solo testo oro (display
 * italic "un pasto." in --oro-su-scuro), occhielli in bianco-calce/70,
 * carminio unico e permanente sul piatto principale, oliva assente.
 * I "segni" sono forme grafiche pure e grandi (centrale ≥ 30% della scena,
 * laterali ≥ 15%): vanno sostituiti con fotografie autentiche prima
 * della pubblicazione — se dopo l'ingrandimento la composizione appare
 * povera, il problema sono le foto mancanti, non decorazioni da aggiungere.
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
      const lateraliGroup = qq("[data-arrivo='laterali']");
      const carminio = q("[data-arrivo='carminio']");
      const chiusura = q("[data-arrivo='chiusura']");
      const handoffEye = q("[data-handoff-eyebrow]");

      [luce, carminio, chiusura, handoffEye, ...lateraliGroup].forEach((el) => {
        if (!el) return;
        el.style.willChange = "transform, opacity";
        willChangeEls.push(el);
      });

      // UNA sola timeline scrub sull'intera sezione. Nessun pin.
      // Aggancio anticipato: parte quando la sezione entra nello schermo
      // (top 90% desktop, top 100% mobile), non quando la si incolla in
      // cima. All'istante dello "stick" (top top) la progression è ~0.20.
      const isMobile = window.matchMedia("(max-width: 899px)").matches;
      const startEdge = isMobile ? "top 100%" : "top 90%";
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: startEdge,
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      // 1. Luce: 0.50 → 0.95 (continua, fino al 70% della progression).
      if (luce) tl.fromTo(luce, { opacity: 0.5 }, { opacity: 0.95, duration: 0.7 }, 0);

      // 2. Segni laterali + prime due didascalie, insieme (0.15 → 0.35).
      if (lateraliGroup.length) {
        tl.fromTo(
          lateraliGroup,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.2, stagger: 0 },
          0.15,
        );
      }

      // 3. Carminio sul piatto centrale + terza didascalia (0.45 → 0.6).
      if (carminio) {
        tl.fromTo(carminio, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.15 }, 0.45);
      }

      // 4. Chiusura con due CTA — ultimo arrivo, completato entro 0.75.
      if (chiusura) {
        tl.fromTo(chiusura, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.15 }, 0.6);
      }

      // Handoff: luce si abbassa, entra occhiello Atto 06 (ultimo quarto).
      if (luce) tl.to(luce, { opacity: 0.42, duration: 0.12 }, 0.82);
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
      className="relative isolate w-full overflow-hidden bg-[color:var(--pietra-800)] text-[color:var(--bianco-calce)] min-h-[220dvh] [@media(min-width:900px)]:min-h-[200dvh]"
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
        {/* LUCE dorata direzionale — parte già al 50%, sale al 95%. */}
        <div
          data-luce
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            opacity: statico ? 0.95 : 0.5,
            background:
              "radial-gradient(62% 50% at 50% 44%, color-mix(in oklab, var(--oro-antico) 30%, transparent) 0%, transparent 70%)",
          }}
        />

        {/* PIANO — hairline oro orizzontale, ancora la scena. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[6%] right-[6%] top-[62%] z-[2] h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--oro-antico) 55%, transparent) 14%, var(--oro-antico) 50%, color-mix(in oklab, var(--oro-antico) 55%, transparent) 86%, transparent 100%)",
          }}
        />

        {/* SEGNI grafici GRANDI sul piano — forme dichiarate, non finta materia.
            → Sostituire con fotografie autentiche prima della pubblicazione.
            Centrale ≥ 30% larghezza scena, laterali ≥ 15% ciascuno, tratti spessi. */}
        <div className="pointer-events-none absolute inset-0 z-[3]" aria-hidden>
          {/* SEGNO CENTRALE — piatto principale, già presente al primo frame.
              ≥ 30% larghezza scena. Non è un arrivo: è composizione iniziale. */}
          <span
            className="absolute left-1/2 top-[52%] block aspect-square w-[62vmin] max-w-[520px] -translate-x-1/2 rounded-full border-[6px] border-[color:var(--oro-antico)]/70 md:w-[36vw]"
          />
          {/* SEGNO LATERALE SX — antipasto, arriva col gruppo laterali. */}
          <span
            data-arrivo="laterali"
            className="absolute left-[6%] top-[48%] block aspect-square w-[22vmin] max-w-[220px] rounded-full border-[4px] border-[color:var(--bianco-calce)]/45 md:left-[10%] md:w-[17vw]"
            style={{ opacity: statico ? 1 : 0 }}
          />
          {/* SEGNO LATERALE DX — dolce, arriva col gruppo laterali. */}
          <span
            data-arrivo="laterali"
            className="absolute right-[6%] top-[50%] block aspect-square w-[20vmin] max-w-[200px] rounded-full border-[4px] border-[color:var(--bianco-calce)]/45 md:right-[10%] md:w-[15vw]"
            style={{ opacity: statico ? 1 : 0 }}
          />
          {/* CARMINIO — brace al centro del piatto principale (unico del sito). */}
          <span
            data-arrivo="carminio"
            data-carminio
            className="absolute left-1/2 top-[52%] block aspect-square w-[20vmin] max-w-[160px] -translate-x-1/2 rounded-full md:w-[11vw]"
            style={{
              opacity: statico ? 0.95 : 0,
              background:
                "radial-gradient(circle at 50% 50%, var(--carminio) 0%, color-mix(in oklab, var(--carminio-scuro) 90%, transparent) 65%, transparent 100%)",
            }}
          />
        </div>

        {/* CONTENUTO EDITORIALE fisso: occhiello + titolo dell'atto,
            leggibili già al primo frame. Le didascalie compaiono coi
            momenti di arrivo a cui appartengono. */}
        <div className="relative z-[4] mx-auto flex w-full max-w-[1200px] flex-col items-center px-5 text-center md:px-10">
          <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70 md:text-[11px]">
            05 — LA TAVOLA
          </p>
          <h2 className="mt-6 max-w-[14ch] font-display text-[clamp(2.4rem,6.8vw,5.4rem)] leading-[0.94] text-[color:var(--bianco-calce)] md:mt-8">
            <span className="block">La filiera</span>
            <span className="ml-[3%] block">diventa</span>
            <span className="ml-[1%] block italic text-[color:var(--oro-su-scuro)]">un pasto.</span>
          </h2>

          {/* DIDASCALIE — le prime due arrivano col gruppo laterali,
              la terza col momento carminio. */}
          <div className="mt-10 flex w-full max-w-[52ch] flex-col items-center gap-3 text-[15px] leading-relaxed text-[color:var(--bianco-calce)]/85 md:text-[16px]">
            <p
              data-arrivo="laterali"
              className="italic"
              style={{ opacity: statico ? 1 : 0 }}
            >
              Si comincia dalla tavola.
            </p>
            <p
              data-arrivo="laterali"
              className="italic"
              style={{ opacity: statico ? 1 : 0 }}
            >
              Piatti che chiedono tempo.
            </p>
            <p
              data-arrivo="carminio"
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
              Piatti e disponibilità possono cambiare. Contatta la Masseria per confermare il menu del giorno.
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
