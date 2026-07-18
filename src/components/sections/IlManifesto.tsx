import { useEffect, useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────
 * IL MANIFESTO — "Qui ogni cosa ha un'origine."
 * Palco pinnato desktop, spotlight reading, quattro dichiarazioni
 * in dissolvenza materica, chiusura crema + marquee editoriale.
 * Palette: marrone/oliva/crema, oro come dettaglio, carbone solo
 * per la profondità iniziale. Nessuna brace, nessuna fiamma.
 * ───────────────────────────────────────────────────────────── */

const INTRO_TEXT = [
  "Prima", "della", "tavola", "c'è", "la", "terra.",
  "Prima", "del", "formaggio,", "il", "latte", "munto", "ogni", "mattina.",
  "Prima", "della", "carne,", "l'allevamento.",
  "Prima", "del", "pane,", "il", "grano", "coltivato", "qui.",
];

type Declaration = {
  n: string;
  key: string;
  line1: string;
  line2: string;
  word: string;
};

const DECLARATIONS: Declaration[] = [
  { n: "01", key: "terra",   line1: "Coltiviamo",   line2: "ciò che nutre.",       word: "TERRA" },
  { n: "02", key: "cura",    line1: "Alleviamo",    line2: "ciò che conosciamo.",  word: "CURA" },
  { n: "03", key: "materia", line1: "Trasformiamo", line2: "ciò che produciamo.",  word: "MATERIA" },
  { n: "04", key: "tavola",  line1: "Portiamo",     line2: "tutto a tavola.",      word: "TAVOLA" },
];

const MARQUEE = ["TERRA", "PASCOLO", "LATTE", "FORMAGGIO", "CARNE", "CUCINA", "TAVOLA"];

export function IlManifesto() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const materialRef = useRef<HTMLDivElement>(null);
  const closureRef = useRef<HTMLDivElement>(null);
  const phaseNumRef = useRef<HTMLSpanElement>(null);
  const phaseWordRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const intro = introRef.current;
    const title = titleRef.current;
    const material = materialRef.current;
    const closure = closureRef.current;
    if (!root || !stage || !intro || !title || !material || !closure) return;

    const words = Array.from(intro.querySelectorAll<HTMLElement>("[data-word]"));
    const decls = Array.from(stage.querySelectorAll<HTMLElement>("[data-decl]"));
    const decoSolchi = material.querySelector<HTMLElement>("[data-deco='solchi']");
    const decoOliva = material.querySelector<HTMLElement>("[data-deco='oliva']");
    const decoCrema = material.querySelector<HTMLElement>("[data-deco='crema']");
    const decoStone = material.querySelector<HTMLElement>("[data-deco='stone']");

    const setPhase = (n: string, w: string) => {
      if (phaseNumRef.current && phaseNumRef.current.textContent !== n) phaseNumRef.current.textContent = n;
      if (phaseWordRef.current && phaseWordRef.current.textContent !== w) phaseWordRef.current.textContent = w;
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ==================== DESKTOP (pinned stage) ==================== */
      mm.add(
        {
          isDesktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isMobile, reduced } = context.conditions as {
            isDesktop: boolean; isMobile: boolean; reduced: boolean;
          };

          // Reduced motion: mostra tutto, statico
          if (reduced) {
            gsap.set(words, { color: "var(--crema)", opacity: 1 });
            gsap.set(decls, { opacity: 1, y: 0, clearProps: "transform" });
            gsap.set(closure, { opacity: 1, y: 0 });
            root.style.setProperty("--mf-bg", "var(--carbone)");
            return;
          }

          if (!isDesktop && !isMobile) return;

          // Stato iniziale
          gsap.set(words, {
            color: "color-mix(in oklab, var(--crema) 20%, transparent)",
          });
          gsap.set(decls, { opacity: 0, y: 40, pointerEvents: "none" });
          gsap.set(closure, { opacity: 0, y: 30 });
          gsap.set([decoOliva, decoCrema, decoStone], { opacity: 0 });
          gsap.set(decoSolchi, { opacity: 0.55 });

          // Un unica timeline scrubbed che descrive TUTTO il palco.
          // Segmenti (0..1):
          //  0.00 - 0.22  Intro: spotlight sul testo introduttivo
          //  0.22 - 0.36  Uscita intro/titolo, entra 01
          //  0.36 - 0.50  01 esce, entra 02 (oliva)
          //  0.50 - 0.64  02 esce, entra 03 (materia crema attraversa)
          //  0.64 - 0.82  03 esce, entra 04 (fondo crema)
          //  0.82 - 1.00  Chiusura crema + marquee visibile
          const onStUpdate = (self: ScrollTrigger) => {
            const p = self.progress;
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleY(${p})`;
            }
            if (p < 0.22)      setPhase("00", "ORIGINE");
            else if (p < 0.38) setPhase("01", "TERRA");
            else if (p < 0.52) setPhase("02", "CURA");
            else if (p < 0.66) setPhase("03", "MATERIA");
            else               setPhase("04", "TAVOLA");
          };

          const trigger = isDesktop
            ? {
                trigger: root,
                start: "top top",
                end: () => "+=" + Math.round(window.innerHeight * 3.4),
                scrub: 0.7,
                pin: stage,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: onStUpdate,
              }
            : {
                trigger: root,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.6,
                invalidateOnRefresh: true,
                onUpdate: onStUpdate,
              };

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: trigger,
          });


          // --- 0.00 → 0.20 : Spotlight reading dell'intro
          words.forEach((w, i) => {
            const start = 0.02 + (i / words.length) * 0.18;
            tl.to(w, {
              color: "var(--crema)",
              duration: 0.02,
            }, start);
          });

          // --- 0.22 → 0.30 : intro/titolo escono
          tl.to([title, intro], {
            opacity: 0,
            y: -30,
            duration: 0.06,
          }, 0.22);

          // --- Dichiarazione 01 (TERRA — marrone, solchi verticali)
          tl.to(decls[0], { opacity: 1, y: 0, duration: 0.06 }, 0.24);
          tl.to(decoSolchi, { opacity: 0.75, duration: 0.06 }, 0.24);
          tl.to(decls[0], { opacity: 0, y: -40, duration: 0.06 }, 0.36);

          // --- Dichiarazione 02 (CURA — oliva entra da destra)
          tl.fromTo(decls[1],
            { opacity: 0, x: 60, y: 0 },
            { opacity: 1, x: 0, y: 0, duration: 0.06 }, 0.38);
          tl.to(decoOliva, { opacity: 0.5, duration: 0.08 }, 0.38);
          tl.to(decoSolchi, { opacity: 0.35, duration: 0.08 }, 0.40);
          tl.to(decls[1], { opacity: 0, x: -30, duration: 0.06 }, 0.50);

          // --- Dichiarazione 03 (MATERIA — crema attraversa)
          tl.fromTo(decls[2],
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.06 }, 0.52);
          tl.to(decoCrema, { opacity: 0.6, duration: 0.10 }, 0.52);
          tl.to(decoOliva, { opacity: 0.25, duration: 0.10 }, 0.56);
          tl.to(decls[2], { opacity: 0, y: -30, duration: 0.06 }, 0.64);

          // --- Dichiarazione 04 (TAVOLA — apertura crema, testo marrone)
          tl.fromTo(decls[3],
            { opacity: 0, y: 30, color: "var(--crema)" },
            { opacity: 1, y: 0, duration: 0.06 }, 0.66);
          tl.to(decoStone, { opacity: 1, duration: 0.10 }, 0.66);
          tl.to(decoSolchi, { opacity: 0, duration: 0.08 }, 0.66);
          tl.to(root, { "--mf-bg": "var(--crema)", duration: 0.10, ease: "none" } as gsap.TweenVars, 0.70);
          tl.to(decls[3], { color: "var(--marrone)", duration: 0.06 }, 0.74);
          tl.to(decls[3], { opacity: 0, y: -30, duration: 0.05 }, 0.82);

          // --- Chiusura crema
          tl.to(closure, { opacity: 1, y: 0, duration: 0.10 }, 0.84);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );

      return () => mm.revert();
    }, root);

    // Refresh dopo fonts pronte
    if (typeof document !== "undefined" && (document as Document).fonts) {
      (document as Document).fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => void 0);
    }

    return () => ctx.revert();
  }, []);

  // Intersection observer per attivare will-change solo durante la sezione
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) root.classList.add("mf-active");
        else root.classList.remove("mf-active");
      },
      { threshold: 0.01 },
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="manifesto"
      ref={rootRef}
      aria-labelledby="manifesto-title"
      className="mf-root relative w-full"
      style={{
        // fondo animato via GSAP
        ["--mf-bg" as string]: "var(--carbone)",
        backgroundColor: "var(--mf-bg)",
        color: "var(--crema)",
      }}
    >
      {/* ================= TRANSIZIONE DALL'HERO ================= */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[18vh] h-[22vh] z-[2]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--carbone) 60%, transparent) 55%, var(--carbone) 100%)",
        }}
      />

      {/* ================= PALCO (pinned su desktop) ================= */}
      <div
        ref={stageRef}
        className="mf-stage relative w-full overflow-hidden"
        style={{ minHeight: "100dvh" }}
      >
        {/* ---- Campo materico (sticky su mobile, pieno sul palco su desktop) ---- */}
        <div
          ref={materialRef}
          aria-hidden
          className="mf-material absolute inset-0 md:absolute md:inset-0"
        >
          {/* base marrone/carbone */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 70% 30%, color-mix(in oklab, var(--marrone) 80%, var(--carbone)) 0%, var(--carbone) 70%)",
            }}
          />
          {/* solchi verticali (materia asciutta) */}
          <div
            data-deco="solchi"
            className="absolute inset-0 mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(92deg, rgba(61,42,30,0.55) 0 2px, transparent 2px 14px), repeating-linear-gradient(88deg, rgba(0,0,0,0.25) 0 1px, transparent 1px 22px)",
            }}
          />
          {/* velo oliva (fase 2) */}
          <div
            data-deco="oliva"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 60% at 15% 85%, color-mix(in oklab, var(--oliva) 70%, transparent) 0%, transparent 60%)",
              mixBlendMode: "soft-light",
            }}
          />
          {/* forma crema che attraversa (fase 3) */}
          <div
            data-deco="crema"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 90% at 60% 40%, color-mix(in oklab, var(--crema) 40%, transparent) 0%, transparent 65%)",
              mixBlendMode: "screen",
            }}
          />
          {/* apertura pietra chiara (fase 4) */}
          <div
            data-deco="stone"
            className="absolute inset-0"
            style={{ background: "var(--grad-stone)" }}
          />
          {/* noise statico leggerissimo */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.2  0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
              backgroundSize: "220px 220px",
            }}
          />
          {/* vignettatura */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </div>

        {/* ---- Contenuto del palco ---- */}
        <div
          className="mf-inner relative z-10 mx-auto grid h-full w-full max-w-[1440px] gap-8 px-6 md:grid-cols-[minmax(160px,220px)_1fr_minmax(220px,280px)] md:px-12"
          style={{ minHeight: "100dvh" }}
        >
          {/* ===== Zona sinistra ===== */}
          <aside className="hidden md:flex flex-col justify-between py-[10vh]">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.4 }}
              className="text-[0.68rem] uppercase"
              style={{
                fontFamily: "'Oswald','Inter',sans-serif",
                letterSpacing: "0.34em",
                color: "color-mix(in oklab, var(--crema) 55%, transparent)",
              }}
            >
              01 — Il Manifesto
            </motion.p>

            <div className="flex items-center gap-4">
              <div
                className="relative h-40 w-[2px] overflow-hidden"
                style={{ backgroundColor: "color-mix(in oklab, var(--crema) 12%, transparent)" }}
              >
                <span
                  ref={progressBarRef}
                  className="absolute inset-0 origin-top"
                  style={{
                    backgroundColor: "var(--oro)",
                    transform: "scaleY(0)",
                    willChange: "transform",
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span
                  ref={phaseNumRef}
                  className="text-[1.05rem]"
                  style={{
                    fontFamily: "'Oswald','Inter',sans-serif",
                    letterSpacing: "0.24em",
                    color: "var(--oro)",
                  }}
                >
                  00
                </span>
                <span
                  ref={phaseWordRef}
                  className="text-[0.7rem]"
                  style={{
                    fontFamily: "'Oswald','Inter',sans-serif",
                    letterSpacing: "0.36em",
                    color: "color-mix(in oklab, var(--crema) 65%, transparent)",
                  }}
                >
                  ORIGINE
                </span>
              </div>
            </div>
          </aside>

          {/* ===== Zona centrale ===== */}
          <div className="relative flex flex-col justify-center py-[12vh]">
            {/* Occhiello mobile */}
            <p
              className="mb-8 md:hidden text-[0.68rem] uppercase"
              style={{
                fontFamily: "'Oswald','Inter',sans-serif",
                letterSpacing: "0.34em",
                color: "color-mix(in oklab, var(--crema) 55%, transparent)",
              }}
            >
              01 — Il Manifesto
            </p>

            <h2
              id="manifesto-title"
              ref={titleRef}
              className="mf-title"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(3rem, 8.5vw, 9rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
                color: "var(--crema)",
              }}
            >
              Qui ogni cosa<br />ha un&rsquo;origine.
            </h2>

            <p
              ref={introRef}
              className="mf-intro mt-8 md:mt-10 max-w-[52ch]"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                fontSize: "clamp(1.05rem, 1.5vw, 1.5rem)",
                lineHeight: 1.55,
              }}
            >
              {INTRO_TEXT.map((w, i) => (
                <span key={i} className="inline">
                  <span data-word className="inline transition-none">
                    {w}
                  </span>{" "}
                </span>
              ))}
            </p>

            {/* Contenitore dichiarazioni (sovrapposte in-place, animate da GSAP) */}
            <div className="mf-decls relative mt-10 md:mt-0" aria-live="polite">
              {DECLARATIONS.map((d, i) => (
                <article
                  key={d.key}
                  data-decl
                  className="mf-decl md:absolute md:inset-0 md:flex md:flex-col md:justify-center"
                  style={{
                    // su mobile scorrono in verticale; su desktop stanno sovrapposte
                    marginTop: i === 0 ? 0 : undefined,
                  }}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className="text-[0.75rem]"
                      style={{
                        fontFamily: "'Oswald','Inter',sans-serif",
                        letterSpacing: "0.32em",
                        color: "var(--oro)",
                      }}
                    >
                      {d.n}
                    </span>
                    <span
                      className="text-[0.65rem]"
                      style={{
                        fontFamily: "'Oswald','Inter',sans-serif",
                        letterSpacing: "0.36em",
                        color: "color-mix(in oklab, var(--crema) 55%, transparent)",
                      }}
                    >
                      {d.word}
                    </span>
                  </div>
                  <p
                    className="mt-4"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontStyle: "italic",
                      fontWeight: 300,
                      fontSize: "clamp(2.4rem, 7vw, 6.4rem)",
                      lineHeight: 0.98,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {d.line1}
                    <br />
                    {d.line2}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* ===== Zona destra ===== */}
          <aside className="hidden md:flex flex-col justify-end py-[10vh]">
            <div
              className="ml-auto h-[60vh] w-full max-w-[280px] rounded-sm"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--marrone) 60%, transparent) 0%, transparent 100%)",
                border: "1px solid color-mix(in oklab, var(--crema) 8%, transparent)",
              }}
              aria-hidden
            />
            <p
              className="mt-6 text-right text-[0.65rem]"
              style={{
                fontFamily: "'Oswald','Inter',sans-serif",
                letterSpacing: "0.36em",
                color: "color-mix(in oklab, var(--crema) 45%, transparent)",
              }}
            >
              NOCI — MURGIA
            </p>
          </aside>
        </div>

        {/* ---- Chiusura crema (posizionata sul palco) ---- */}
        <div
          ref={closureRef}
          className="mf-closure pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6"
          style={{ opacity: 0 }}
        >
          <p
            className="text-[0.68rem] uppercase"
            style={{
              fontFamily: "'Oswald','Inter',sans-serif",
              letterSpacing: "0.42em",
              color: "color-mix(in oklab, var(--marrone) 70%, transparent)",
            }}
          >
            Chiusura
          </p>
          <p
            className="mt-6 text-center"
            style={{
              fontFamily: "'Fraunces', serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: "clamp(2rem, 6vw, 5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.015em",
              color: "var(--marrone)",
            }}
          >
            Dalla terra alla tavola.<br />Senza salti.
          </p>
        </div>
      </div>

      {/* ================= MARQUEE FINALE (sotto il palco) ================= */}
      <div
        className="mf-marquee-wrap relative w-full"
        style={{
          backgroundColor: "var(--crema)",
          color: "var(--marrone)",
          borderTop: "1px solid color-mix(in oklab, var(--marrone) 12%, transparent)",
          borderBottom: "1px solid color-mix(in oklab, var(--marrone) 12%, transparent)",
        }}
        aria-hidden
      >
        <div className="mf-marquee overflow-hidden whitespace-nowrap py-8">
          <div className="mf-marquee-track">
            {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((it, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-10 uppercase"
                style={{
                  fontFamily: "'Oswald','Inter',sans-serif",
                  fontSize: "clamp(1rem, 1.3vw, 1.25rem)",
                  letterSpacing: "0.38em",
                }}
              >
                {it}
                <span style={{ color: "var(--oliva)" }}>—</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .mf-root { background-color: var(--mf-bg); transition: background-color 0.1s linear; }

        .mf-stage { background: transparent; }

        /* Mobile: campo materico sticky, dichiarazioni in verticale */
        @media (max-width: 767px) {
          .mf-stage { overflow: visible !important; min-height: auto !important; }
          .mf-material { position: sticky !important; top: 0; height: 100dvh; inset: auto !important; }
          .mf-inner { grid-template-columns: 1fr !important; gap: 0; padding: 12vh 20px 8vh !important; min-height: auto !important; margin-top: -100dvh; }
          .mf-decls { display: flex !important; flex-direction: column; gap: 12vh; margin-top: 6vh; position: relative; }
          .mf-decl { position: relative !important; opacity: 1 !important; transform: none !important; inset: auto !important; }
          .mf-title { font-size: clamp(3rem, 14vw, 5.2rem) !important; }
          .mf-closure { position: relative !important; opacity: 1 !important; padding: 14vh 24px 10vh !important; background: var(--crema); inset: auto !important; }
        }


        /* Marquee */
        @keyframes mf-marquee-l {
          from { transform: translateX(0); }
          to { transform: translateX(-25%); }
        }
        .mf-marquee-track {
          display: inline-flex;
          gap: 2.5rem;
          padding-right: 2.5rem;
          animation: mf-marquee-l 60s linear infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .mf-marquee-track { animation: none !important; }
          .mf-decl { opacity: 1 !important; transform: none !important; }
          .mf-closure { opacity: 1 !important; position: relative !important; }
        }
      `}</style>
    </section>
  );
}

export default IlManifesto;
