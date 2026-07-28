import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHomeSectionNav } from "@/lib/nav";

/**
 * ATTO 05 — LA TAVOLA.
 * Regia: "quadri a sipario". Nessun pin, nessuno sticky a piena altezza,
 * nessun path SVG continuo, nessuna maschera a fessura. Ogni quadro entra
 * coperto da un pannello che si ritira lungo lo scroll (clip-path), la luce
 * dorata respira lungo il quadro, i segni entrano stagger dopo il 60% di
 * rivelazione del sipario. Trigger locali totali: 6 (apertura + 4 quadri +
 * chiusura). Solo transform / opacity / clip-path. Nessun filtro animato.
 *
 * Regole cromatiche: fondo pietra-800 pieno per tutta la sezione (non varia
 * fra quadri: varia la luce). Oro massimo 2 per quadro (max 1 testuale).
 * Carminio SOLO nell'Arrosto (secondo ed ultimo uso del sito). Zero oliva.
 * I "segni" delle portate sono forme grafiche pure (cerchi, ovali, archi):
 * → SOSTITUIRE con fotografie autentiche dei piatti prima della pubblicazione.
 */

type QuadroId = "antipasto" | "cucina" | "arrosto" | "dolce";
type SipariateDir = "right" | "left";

type Quadro = {
  id: QuadroId;
  occhiello: string;
  titolo: [string, string];
  testo: string;
  nota?: string;
  liste?: { titolo: string; voci: string }[];
  dir: SipariateDir; // 1,3 → right ; 2,4 → left
  luceX: string; // origine della luce respirante
  luceY: string;
};

const QUADRI: Quadro[] = [
  {
    id: "antipasto",
    occhiello: "01 · L'ANTIPASTO",
    titolo: ["Si comincia", "dalla tavola."],
    testo:
      "Salumi e formaggi della masseria, frittelle di grano, ricotta piccante, pomodorini e zucchine marinate.",
    liste: [
      {
        titolo: "SALUMI",
        voci: "Prosciutto crudo · Soppressata · Salsiccia secca · Pancetta tesa",
      },
      { titolo: "FORMAGGI", voci: "Mozzarella · Nodini · Primo sale · Ricotta" },
    ],
    dir: "right",
    luceX: "22%",
    luceY: "26%",
  },
  {
    id: "cucina",
    occhiello: "02 · LA CUCINA",
    titolo: ["Piatti che", "chiedono tempo."],
    testo: "Polpettine al sugo nel pignatiello, spezzatino di vitello e maiale, Pecora in Pignata.",
    nota:
      "La Pecora in Pignata cuoce circa cinque ore nel forno a legna, in una pignata chiusa con pasta di pane.",
    dir: "left",
    luceX: "72%",
    luceY: "34%",
  },
  {
    id: "arrosto",
    occhiello: "03 · L'ARROSTO",
    titolo: ["Quello che scegli", "al banco."],
    testo:
      "Filetto, bombette, salsiccia e la scelta del banco, cotti sui carboni e serviti durante il pasto.",
    nota:
      "La frollatura è indicativa, circa quindici giorni, e varia in base al taglio.",
    dir: "right",
    luceX: "28%",
    luceY: "58%",
  },
  {
    id: "dolce",
    occhiello: "04 · IL DOLCE",
    titolo: ["Finisce", "piano."],
    testo: "Dolcini artigianali chiudono il pasto.",
    dir: "left",
    luceX: "68%",
    luceY: "42%",
  },
];

export function LaTavola() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const goToSection = useHomeSectionNav();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    // Bookkeeping will-change per cleanup memoria video.
    const willChangeEls: HTMLElement[] = [];

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Trigger 1 · APERTURA — filo dorato dall'alto si allarga fino a
      // diventare la linea del piano; il fondo passa dal bianco calce
      // (coda Filiera) alla pietra scura. Momento di stacco chiaro→scuro.
      const apertura = root.querySelector<HTMLElement>("[data-apertura]");
      if (apertura) {
        const filo = apertura.querySelector<HTMLElement>("[data-apertura-filo]");
        const cover = apertura.querySelector<HTMLElement>("[data-apertura-cover]");
        const piano = apertura.querySelector<HTMLElement>("[data-apertura-piano]");
        const eyebrow = apertura.querySelector<HTMLElement>("[data-apertura-eyebrow]");
        const titolo = apertura.querySelector<HTMLElement>("[data-apertura-titolo]");
        if (filo) filo.style.willChange = "transform, opacity";
        if (cover) cover.style.willChange = "opacity";
        if (piano) piano.style.willChange = "transform, opacity";
        [filo, cover, piano].forEach((el) => el && willChangeEls.push(el));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: apertura,
            start: "top 95%",
            end: "top 30%",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });
        // Filo che si allarga in orizzontale
        if (filo) tl.fromTo(filo, { scaleX: 0.02, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 1 }, 0);
        // Cover bianco → pietra
        if (cover) tl.fromTo(cover, { opacity: 1 }, { opacity: 0, duration: 0.7 }, 0.15);
        // Piano: hairline che si distende
        if (piano) tl.fromTo(piano, { scaleX: 0.1, opacity: 0.4 }, { scaleX: 1, opacity: 1, duration: 0.8 }, 0.2);
        if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 0.55);
        if (titolo) tl.fromTo(titolo, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 0.65);
      }

      // Trigger 2-5 · QUATTRO QUADRI
      const quadri = Array.from(root.querySelectorAll<HTMLElement>("[data-quadro]"));
      quadri.forEach((q) => {
        const dir = q.dataset.sipariateDir === "left" ? "left" : "right";
        const sipario = q.querySelector<HTMLElement>("[data-sipario]");
        const luce = q.querySelector<HTMLElement>("[data-luce]");
        const segni = Array.from(q.querySelectorAll<HTMLElement>("[data-segno]"));
        const editorial = q.querySelector<HTMLElement>("[data-editorial]");
        const carminio = q.querySelector<HTMLElement>("[data-carminio]");

        [sipario, luce, editorial, carminio, ...segni].forEach((el) => {
          if (!el) return;
          el.style.willChange = "transform, opacity, clip-path";
          willChangeEls.push(el);
        });

        mm.add(
          {
            desktop: "(min-width: 900px)",
            mobile: "(max-width: 899px)",
          },
          (context) => {
            const isMobile = context.conditions?.mobile === true;

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: q,
                start: isMobile ? "top 100%" : "top 88%",
                end: "top 45%",
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
              defaults: { ease: "none" },
            });

            // SIPARIO — clip-path che si ritira dal lato opposto.
            // dir=right: inset(0 0 0 0) → inset(0 0 0 100%) (scopre da dx→sx: pannello esce a sinistra)
            // dir=left:  inset(0 0 0 0) → inset(0 100% 0 0) (scopre da sx→dx)
            // Su mobile: wipe dal basso, uniforme per tutti.
            if (sipario) {
              if (isMobile) {
                tl.fromTo(
                  sipario,
                  { clipPath: "inset(0% 0% 0% 0%)" },
                  { clipPath: "inset(100% 0% 0% 0%)", duration: 1 },
                  0,
                );
              } else if (dir === "right") {
                tl.fromTo(
                  sipario,
                  { clipPath: "inset(0% 0% 0% 0%)" },
                  { clipPath: "inset(0% 0% 0% 100%)", duration: 1 },
                  0,
                );
              } else {
                tl.fromTo(
                  sipario,
                  { clipPath: "inset(0% 0% 0% 0%)" },
                  { clipPath: "inset(0% 100% 0% 0%)", duration: 1 },
                  0,
                );
              }
            }

            // LUCE che respira — sposta e cambia intensità (transform + opacity).
            if (luce) {
              tl.fromTo(
                luce,
                { xPercent: -6, yPercent: -4, opacity: 0.55 },
                { xPercent: 6, yPercent: 4, opacity: 0.95, duration: 1 },
                0,
              );
            }

            // SEGNI — entrano dopo il 60% della rivelazione del sipario,
            // stagger 100 ms, traslazione ≤ 20 px + opacità.
            if (segni.length) {
              tl.fromTo(
                segni,
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, duration: 0.35, stagger: 0.1 },
                0.6,
              );
            }

            // EDITORIAL — parallasse contro il quadro (livello più veloce).
            if (editorial) {
              const mult = isMobile ? 0.5 : 1;
              tl.fromTo(
                editorial,
                { yPercent: 6 * mult },
                { yPercent: -6 * mult, duration: 1 },
                0,
              );
            }

            // CARMINIO (solo Arrosto): entra al 40%, massimo al 60%, esce al 90%.
            if (carminio) {
              tl.fromTo(carminio, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.15 }, 0.4);
              tl.to(carminio, { opacity: 1, duration: 0.2 }, 0.6);
              tl.to(carminio, { opacity: 0, duration: 0.15 }, 0.9);
            }
          },
        );
      });

      // Trigger 6 · CHIUSURA — luce si abbassa, segni escono, entra occhiello 06.
      const chiusura = root.querySelector<HTMLElement>("[data-chiusura]");
      if (chiusura) {
        const handoff = root.querySelector<HTMLElement>("[data-handoff]");
        const handoffEye = handoff?.querySelector<HTMLElement>("[data-handoff-eyebrow]");
        const cluce = chiusura.querySelector<HTMLElement>("[data-chiusura-luce]");
        const csegni = Array.from(chiusura.querySelectorAll<HTMLElement>("[data-chiusura-segno]"));
        const ctitolo = chiusura.querySelector<HTMLElement>("[data-chiusura-titolo]");
        const ccta = chiusura.querySelector<HTMLElement>("[data-chiusura-cta]");

        [cluce, ctitolo, ccta, handoffEye, ...csegni].forEach((el) => {
          if (!el) return;
          el.style.willChange = "transform, opacity";
          willChangeEls.push(el);
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chiusura,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });

        if (ctitolo) tl.fromTo(ctitolo, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, 0.05);
        if (ccta) tl.fromTo(ccta, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, 0.35);
        // Segni escono uno a uno verso i bordi
        csegni.forEach((s, i) => {
          const outX = i % 2 === 0 ? -60 : 60;
          tl.to(s, { xPercent: outX, opacity: 0, duration: 0.4 }, 0.55 + i * 0.05);
        });
        // Luce dorata si abbassa
        if (cluce) tl.to(cluce, { opacity: 0.15, duration: 0.6 }, 0.5);
        // Occhiello 06 entra
        if (handoffEye) tl.fromTo(handoffEye, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, 0.8);
      }
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
      className="relative isolate w-full overflow-hidden bg-[color:var(--pietra-800)] text-[color:var(--bianco-calce)]"
    >
      {/* Grana molto discreta e statica: dà materia senza costare paint animato. */}
      <div
        aria-hidden
        className="grain pointer-events-none absolute inset-0 z-0 opacity-20"
        style={{ transform: "translateZ(0)" }}
      />

      {/* ============================================================
          APERTURA — 90dvh su mobile, 110dvh desktop.
          Il filo dorato della Filiera continua qui, si allarga fino a
          diventare la linea del piano. Cover bianco-calce che sfuma
          per rivelare la pietra scura: passaggio chiaro→scuro.
          ============================================================ */}
      <div
        data-apertura
        className="relative flex min-h-[100dvh] flex-col items-center justify-center px-5 md:px-10 [@media(min-width:900px)]:min-h-[90dvh]"
      >
        {/* Cover bianco calce che copre l'apertura all'inizio dello scroll,
            poi svanisce lasciando la pietra scura. */}
        <div
          data-apertura-cover
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            opacity: statico ? 0 : 1,
            background:
              "linear-gradient(180deg, var(--bianco-calce) 0%, color-mix(in oklab, var(--bianco-calce) 60%, var(--pietra-800)) 55%, var(--pietra-800) 100%)",
          }}
        />
        {/* Luce direzionale della sezione (statica, ora respira solo nei quadri) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(60% 44% at 50% 40%, color-mix(in oklab, var(--oro-antico) 14%, transparent) 0%, transparent 68%)",
          }}
        />

        {/* Filo dorato che si allarga fino a diventare la linea del piano */}
        <div
          data-apertura-filo
          aria-hidden
          className="absolute left-1/2 top-[26%] z-[2] h-px w-[min(72%,1100px)] -translate-x-1/2 origin-center"
          style={{
            opacity: statico ? 1 : 0,
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--oro-antico) 60%, transparent) 20%, var(--oro-antico) 50%, color-mix(in oklab, var(--oro-antico) 60%, transparent) 80%, transparent 100%)",
          }}
        />
        {/* Linea del piano — hairline oro che ancora tutta la sezione */}
        <div
          data-apertura-piano
          aria-hidden
          className="absolute left-1/2 top-[52%] z-[2] h-px w-full -translate-x-1/2 origin-center"
          style={{
            opacity: statico ? 1 : 0,
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--oro-antico) 45%, transparent) 30%, color-mix(in oklab, var(--oro-antico) 60%, transparent) 50%, color-mix(in oklab, var(--oro-antico) 45%, transparent) 70%, transparent 100%)",
          }}
        />

        <div className="relative z-[3] flex w-full max-w-[1400px] flex-col items-center pt-[calc(var(--page-header-safe-offset)+2vh)] text-center">
          <p
            data-apertura-eyebrow
            className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--pietra-800)]/85 md:text-[11px]"
            style={{ opacity: statico ? 1 : 0 }}
          >
            05 — LA TAVOLA
          </p>
          <h2
            data-apertura-titolo
            className="mt-6 max-w-[14ch] font-display text-[clamp(2.6rem,7.2vw,5.6rem)] leading-[0.94] text-[color:var(--bianco-calce)] md:mt-10"
            style={{ opacity: statico ? 1 : 0 }}
          >
            <span className="block">La filiera</span>
            <span className="ml-[3%] block">diventa</span>
            <span className="ml-[1%] block italic text-[color:var(--oro-su-scuro)]">un pasto.</span>
          </h2>
          <p className="mt-8 max-w-[46ch] text-[16px] leading-relaxed text-[color:var(--bianco-calce)]/80 md:text-[17px]">
            Tutto quello che cresce nei campi, passa dal caseificio e dalla macelleria, arriva sulla
            stessa tavola.
          </p>
        </div>
      </div>

      {/* ============================================================
          I QUATTRO QUADRI
          ============================================================ */}
      {QUADRI.map((q) => (
        <QuadroBlocco key={q.id} q={q} statico={statico} />
      ))}

      {/* ============================================================
          DISCLAIMER — editorial, non card, tra i quadri e la chiusura.
          ============================================================ */}
      <div
        data-disclaimer
        className="relative z-[3] mx-auto flex w-full max-w-[1200px] items-center gap-4 px-5 py-16 md:px-10 md:py-20"
      >
        <span aria-hidden className="hidden h-px flex-1 bg-[color:var(--bianco-calce)]/20 md:block" />
        <p className="text-center text-[15px] leading-relaxed text-[color:var(--bianco-calce)]/80 md:max-w-[52ch] md:text-[15px]">
          Piatti e disponibilità possono cambiare. Contatta la Masseria per confermare il menu del
          giorno.
        </p>
        <span aria-hidden className="hidden h-px flex-1 bg-[color:var(--bianco-calce)]/20 md:block" />
      </div>

      {/* ============================================================
          CHIUSURA — tavola che si spegne + CTA.
          ============================================================ */}
      <div
        data-chiusura
        className="relative flex min-h-[100dvh] flex-col items-center justify-center px-5 pb-20 pt-16 text-center md:px-10 [@media(min-width:900px)]:min-h-[85dvh]"
      >
        <div
          data-chiusura-luce
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            opacity: statico ? 0.4 : 0.85,
            background:
              "radial-gradient(50% 40% at 50% 42%, color-mix(in oklab, var(--oro-antico) 22%, transparent) 0%, transparent 70%)",
          }}
        />
        {/* Tre segni residui, che al reveal della chiusura escono ai bordi. */}
        <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
          <span
            data-chiusura-segno
            className="absolute left-[18%] top-[30%] block h-[46px] w-[46px] rounded-full border border-[color:var(--oro-antico)]/45"
          />
          <span
            data-chiusura-segno
            className="absolute right-[20%] top-[38%] block h-[24px] w-[70px] rounded-full border border-[color:var(--bianco-calce)]/30"
          />
          <span
            data-chiusura-segno
            className="absolute left-[40%] bottom-[26%] block h-[8px] w-[120px] rounded-full bg-[color:var(--oro-antico)]/35"
          />
        </div>

        <div className="relative z-[3] flex max-w-[900px] flex-col items-center">
          <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70 md:text-[11px]">
            IL RITO COMPLETO
          </p>
          <h3
            data-chiusura-titolo
            className="mt-6 max-w-[18ch] font-display text-[clamp(2.2rem,5.4vw,4.2rem)] leading-[0.98] text-[color:var(--bianco-calce)]"
            style={{ opacity: statico ? 1 : 0 }}
          >
            <span className="block">Il rito completo</span>
            <span className="ml-[2%] block italic">è nell'Agriturismo.</span>
          </h3>
          <p className="mt-8 max-w-[46ch] text-[16px] leading-relaxed text-[color:var(--bianco-calce)]/80 md:text-[17px]">
            Dalla scelta al banco all'ultimo dolce, tutto il percorso si vive in sala.
          </p>

          <div
            data-chiusura-cta
            className="mt-12 flex w-full max-w-md flex-col items-stretch gap-4 md:mt-16 md:w-auto md:flex-row md:items-center md:justify-center"
            style={{ opacity: statico ? 1 : 0 }}
          >
            <Link
              to="/agriturismo"
              className="inline-flex min-h-[54px] items-center justify-center border border-[color:var(--oro-antico)] bg-[color:var(--oro-antico)] px-8 py-4 font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--carbone)] transition-colors hover:bg-[color:var(--bianco-calce)] hover:border-[color:var(--bianco-calce)]"
            >
              SCOPRI L'AGRITURISMO →
            </Link>
            <button
              type="button"
              onClick={() => goToSection("prenota")}
              className="inline-flex min-h-[54px] items-center justify-center border border-[color:var(--bianco-calce)]/50 px-8 py-4 font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--bianco-calce)] transition-colors hover:border-[color:var(--oro-antico)] hover:text-[color:var(--oro-antico)]"
            >
              PRENOTA UN TAVOLO
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
          HANDOFF verso l'Atto 06 — LA VOCE.
          Fondo finale della sezione: pietra-800 pieno (#4b4636), coerente
          con l'ipotesi di partenza dell'Atto 06 quando arriverà. Nessun
          gradiente decorativo, nessun gap.
          ============================================================ */}
      <div
        data-handoff
        className="relative z-[3] bg-[color:var(--pietra-800)]"
      >
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

// ============================================================
// QUADRO — un singolo blocco a sipario
// ============================================================
function QuadroBlocco({ q, statico }: { q: Quadro; statico: boolean }) {
  const isArrosto = q.id === "arrosto";
  const altezzaClass =
    q.id === "cucina"
      ? "min-h-[115dvh] [@media(min-width:900px)]:min-h-[105dvh]"
      : q.id === "arrosto"
        ? "min-h-[125dvh] [@media(min-width:900px)]:min-h-[110dvh]"
        : q.id === "dolce"
          ? "min-h-[95dvh] [@media(min-width:900px)]:min-h-[85dvh]"
          : "min-h-[105dvh] [@media(min-width:900px)]:min-h-[95dvh]";

  return (
    <article
      data-quadro={q.id}
      data-sipariate-dir={q.dir}
      className={`relative isolate flex ${altezzaClass} w-full items-center overflow-hidden`}
    >
      {/* LUCE che respira (transform/opacity, mai filtri) */}
      <div
        data-luce
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          opacity: statico ? 0.85 : 0.5,
          background: `radial-gradient(52% 42% at ${q.luceX} ${q.luceY}, color-mix(in oklab, var(--oro-antico) 22%, transparent) 0%, transparent 70%)`,
        }}
      />

      {/* SIPARIO — pannello pietra-800 che copre la scena a inizio scroll
          e si ritira lungo lo scrub tramite clip-path.
          NB: il sipario è il PANNELLO che nasconde: parte pieno (inset 0)
          e si scopre riducendosi da un lato. */}
      <div
        data-sipario
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-[color:var(--pietra-800)]"
        style={{
          clipPath: statico ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 0%)",
        }}
      />

      {/* SEGNI — forme grafiche pure. Nessuna finta materia.
          → Sostituire con fotografie autentiche dei piatti prima della pubblicazione. */}
      <div className="pointer-events-none absolute inset-0 z-[3]" aria-hidden>
        {q.id === "antipasto" && (
          <>
            <span
              data-segno
              className="absolute right-[12%] top-[22%] block h-[140px] w-[140px] rounded-full border border-[color:var(--oro-antico)]/55"
              style={{ opacity: statico ? 1 : 0 }}
            />
            <span
              data-segno
              className="absolute right-[26%] top-[54%] block h-[90px] w-[90px] rounded-full bg-[color:var(--bianco-calce)]/8 ring-1 ring-[color:var(--bianco-calce)]/25"
              style={{ opacity: statico ? 1 : 0 }}
            />
            <span
              data-segno
              className="absolute right-[8%] top-[72%] block h-[16px] w-[180px] rounded-full bg-[color:var(--oro-antico)]/30"
              style={{ opacity: statico ? 1 : 0 }}
            />
          </>
        )}
        {q.id === "cucina" && (
          <>
            <span
              data-segno
              className="absolute left-[10%] top-[30%] block h-[160px] w-[220px] rounded-[50%] border border-[color:var(--oro-antico)]/50"
              style={{ opacity: statico ? 1 : 0 }}
            />
            <span
              data-segno
              className="absolute left-[22%] top-[60%] block h-[70px] w-[70px] rounded-full bg-[color:var(--oro-antico)]/25"
              style={{ opacity: statico ? 1 : 0 }}
            />
          </>
        )}
        {q.id === "arrosto" && (
          <>
            <span
              data-segno
              className="absolute right-[12%] top-[24%] block h-[10px] w-[220px] rounded-full bg-[color:var(--oro-antico)]/40"
              style={{ opacity: statico ? 1 : 0 }}
            />
            <span
              data-segno
              className="absolute right-[22%] top-[38%] block h-[10px] w-[160px] rounded-full bg-[color:var(--oro-antico)]/30"
              style={{ opacity: statico ? 1 : 0 }}
            />
            {/* Il carminio: unica occorrenza di questo colore in tutto l'atto
                (e secondo ed ultimo del sito). Braci al centro del quadro. */}
            <span
              data-carminio
              className="absolute right-[18%] top-[62%] block h-[64px] w-[64px] rounded-full"
              style={{
                opacity: statico ? 0.85 : 0,
                background:
                  "radial-gradient(circle at 50% 50%, var(--carminio) 0%, color-mix(in oklab, var(--carminio-scuro) 90%, transparent) 65%, transparent 100%)",
              }}
            />
          </>
        )}
        {q.id === "dolce" && (
          <>
            <span
              data-segno
              className="absolute left-[14%] top-[32%] block h-[70px] w-[70px] rounded-full border border-[color:var(--bianco-calce)]/40"
              style={{ opacity: statico ? 1 : 0 }}
            />
            <span
              data-segno
              className="absolute left-[26%] top-[56%] block h-[46px] w-[46px] rounded-full bg-[color:var(--oro-antico)]/30"
              style={{ opacity: statico ? 1 : 0 }}
            />
            <span
              data-segno
              className="absolute left-[18%] top-[76%] block h-[30px] w-[30px] rounded-full border border-[color:var(--oro-antico)]/45"
              style={{ opacity: statico ? 1 : 0 }}
            />
          </>
        )}
      </div>

      {/* EDITORIAL — occhiello, titolo, testo, annotazioni */}
      <div
        data-editorial
        className={`relative z-[4] mx-auto flex w-full max-w-[1400px] px-5 md:px-10 ${
          q.dir === "right" ? "justify-start" : "justify-end"
        }`}
      >
        <div className={`max-w-[46ch] ${q.dir === "left" ? "text-left md:text-right" : ""}`}>
          <p
            className={`font-eyebrow text-[10px] tracking-[0.34em] md:text-[11px] ${
              isArrosto
                ? "text-[color:var(--carminio)]"
                : "text-[color:var(--bianco-calce)]/70"
            }`}
          >
            {q.occhiello}
          </p>
          <h3 className="mt-5 max-w-[16ch] font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1] text-[color:var(--bianco-calce)] md:mt-7">
            <span className="block">{q.titolo[0]}</span>
            <span className="ml-[2%] block italic">{q.titolo[1]}</span>
          </h3>
          <p className="mt-6 text-[16px] leading-relaxed text-[color:var(--bianco-calce)]/85 md:mt-8 md:text-[17px]">
            {q.testo}
          </p>

          {q.liste && (
            <div className="mt-8 space-y-5 md:mt-10">
              {q.liste.map((l) => (
                <div key={l.titolo}>
                  <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/60">
                    {l.titolo}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--bianco-calce)]/85 md:text-[16px]">
                    {l.voci}
                  </p>
                </div>
              ))}
            </div>
          )}

          {q.nota && (
            <div className="mt-8 flex items-start gap-3 border-l border-[color:var(--bianco-calce)]/25 pl-4 md:mt-10">
              <p className="text-[15px] leading-relaxed text-[color:var(--bianco-calce)]/80 md:text-[15px]">
                {q.nota}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}