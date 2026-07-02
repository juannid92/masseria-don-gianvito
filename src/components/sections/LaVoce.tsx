import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * LA VOCE — Volo 3D attraverso 10 recensioni sospese nel buio.
 * 5 onde Z (2 recensioni per onda, una sx e una dx).
 * Focus system: la recensione vicina alla camera è nitida,
 * le altre si smorzano nel buio.
 * ───────────────────────────────────────────────────────────── */

type Review = {
  text: string;
  source: string;
  /** Indice dell'onda Z (0..4) → determina translateZ */
  wave: number;
  /** Lato dell'onda: -1 = sinistra, +1 = destra */
  side: -1 | 1;
  /** Offset verticale in vh (mai due sullo stesso Y) */
  y: number;
  /** Offset X aggiuntivo rispetto al lato (in vw), per variare */
  xJitter: number;
};

/* 5 onde Z × 2 recensioni (sx/dx) = 10.
 * Y disperse su range ampio (-30vh..+30vh), tutte diverse. */
const REVIEWS: Review[] = [
  // Onda 0 (più vicina, wave=0 → Z -100)
  { text: "Una delle mie masserie preferite in Puglia.", source: "Instagram", wave: 0, side: -1, y: -18, xJitter: -4 },
  { text: "Da ritornarci assolutamente.", source: "Tripadvisor", wave: 0, side: +1, y: 22, xJitter: 3 },
  // Onda 1 (Z -450)
  { text: "Cibo a km 0 di buona qualità, rapporto qualità-prezzo vantaggioso.", source: "Tripadvisor", wave: 1, side: -1, y: 12, xJitter: 2 },
  { text: "Gli orologi si fermano quando la trasportano dal forno alla cucina.", source: "Luciano Pignataro Wine Blog", wave: 1, side: +1, y: -24, xJitter: -3 },
  // Onda 2 (Z -800)
  { text: "Servizio veloce e cordiale, prezzi onestissimi.", source: "Tripadvisor", wave: 2, side: -1, y: 28, xJitter: -2 },
  { text: "Posto rustico, interni in pietra bianca, molto bella davvero.", source: "Tripadvisor", wave: 2, side: +1, y: -6, xJitter: 4 },
  // Onda 3 (Z -1150)
  { text: "Tutto di loro produzione, carne squisita e tenera.", source: "Tripadvisor", wave: 3, side: -1, y: -12, xJitter: 3 },
  { text: "Si sceglie la carne nella macelleria e poi la fai cucinare. Tutto spettacolare.", source: "Tripadvisor", wave: 3, side: +1, y: 18, xJitter: -4 },
  // Onda 4 (più lontana, Z -1500)
  { text: "Le mozzarelle km0 sono sublimi.", source: "Tripadvisor", wave: 4, side: -1, y: 6, xJitter: -3 },
  { text: "L'antipasto non finisce mai.", source: "Tripadvisor", wave: 4, side: +1, y: -28, xJitter: 2 },
];

const WAVE_Z = [-100, -450, -800, -1150, -1500] as const;
/** Lato SX/DX espresso in vw (centrato nel viewport) */
const SIDE_BASE_VW = 22; // 22vw da centro → ampia dispersione ma dentro schermo
const CAM_END = 1600; // px di avanzamento camera (0.4x rispetto ai 4000px di pin, vedi sotto)
const FOCUS_RANGE = 200; // ±px di piena leggibilità
const FADE_RANGE = 600; // oltre → completamente buio/blur

export function LaVoce() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const sorted = useMemo(
    () => [...REVIEWS].sort((a, b) => WAVE_Z[a.wave] - WAVE_Z[b.wave]),
    []
  );

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    const stage = stageRef.current;
    const intro = introRef.current;
    if (!root || !stage) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── DESKTOP · VOLO 3D con focus system ─────────────────
      mm.add("(min-width: 768px)", () => {
        const quotes = Array.from(
          stage.querySelectorAll<HTMLElement>("[data-quote]")
        );

        // Stato iniziale
        quotes.forEach((el) => {
          const baseZ = Number(el.dataset.z || 0);
          const xPct = Number(el.dataset.xpct || 0); // in vw
          const yPct = Number(el.dataset.ypct || 0); // in vh
          el.style.left = "50%";
          el.style.top = "50%";
          el.style.transform = `translate3d(calc(-50% + ${xPct}vw), calc(-50% + ${yPct}vh), ${baseZ}px)`;
          el.style.opacity = "0.2";
          el.style.filter = "blur(2px)";
        });

        // Intro title
        if (intro) {
          gsap.set(intro, { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" });
          ScrollTrigger.create({
            trigger: root,
            start: "top 75%",
            once: true,
            onEnter: () =>
              gsap.to(intro, {
                autoAlpha: 1,
                clipPath: "inset(0 0% 0 0)",
                duration: 1.2,
                ease: "cubic-bezier(.16,1,.3,1)",
              }),
          });
        }

        // Focus system: la camera avanza, ogni recensione è nitida solo
        // quando |currentZ| < FOCUS_RANGE (cioè quando il piano di camera
        // la attraversa). Le altre sono smorzate.
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "+=4000", // pin lungo → più tempo per leggere ogni onda
          pin: true,
          scrub: 2, // più lento, più controllo
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const cam = self.progress * CAM_END; // camera Z avanza a 0.4x della lunghezza pin

            if (intro) {
              const introOp = Math.max(0, 1 - self.progress / 0.12);
              gsap.set(intro, { autoAlpha: introOp });
            }

            quotes.forEach((el) => {
              const baseZ = Number(el.dataset.z || 0);
              const xPct = Number(el.dataset.xpct || 0);
              const yPct = Number(el.dataset.ypct || 0);
              // currentZ: 0 quando la camera è esattamente sulla recensione
              const currentZ = baseZ + cam;
              const dist = Math.abs(currentZ);

              let opacity: number;
              let scale: number;
              let blur: number;

              if (currentZ > FOCUS_RANGE) {
                // già passata dietro la camera → sparisce
                const t = Math.min(1, (currentZ - FOCUS_RANGE) / 300);
                opacity = 1 - t;
                scale = 1.15 + t * 0.3;
                blur = t * 4;
              } else if (dist <= FOCUS_RANGE) {
                // FUOCO: nitida, leggibile
                const k = 1 - dist / FOCUS_RANGE; // 1 al centro, 0 ai bordi
                opacity = 0.3 + 0.7 * k;
                scale = 0.85 + 0.2 * k; // fino a 1.05
                blur = (1 - k) * 0.8;
              } else {
                // lontana davanti alla camera → attesa nel buio
                const t = Math.min(1, (dist - FOCUS_RANGE) / (FADE_RANGE - FOCUS_RANGE));
                opacity = 0.3 * (1 - t) + 0.05;
                scale = 0.85 - t * 0.25;
                blur = 1 + t * 2.5;
              }

              el.style.transform = `translate3d(calc(-50% + ${xPct}vw), calc(-50% + ${yPct}vh), ${currentZ}px) scale(${scale})`;
              el.style.opacity = String(Math.max(0, opacity));
              el.style.filter = `blur(${blur}px)`;

              // classe per boost tipografico quando in fuoco
              if (dist < FOCUS_RANGE * 0.6) {
                el.setAttribute("data-focused", "true");
              } else {
                el.removeAttribute("data-focused");
              }
            });
          },
        });
      });

      // ── MOBILE · parallasse verticale (fallback leggibile) ─
      mm.add("(max-width: 767px)", () => {
        const quotes = Array.from(
          stage.querySelectorAll<HTMLElement>("[data-quote]")
        );
        quotes.forEach((el, i) => {
          el.style.transform = "none";
          el.style.position = "relative";
          el.style.left = "auto";
          el.style.top = "auto";
          el.style.opacity = "1";
          el.style.filter = "none";
          gsap.to(el, {
            y: -30 - (i % 3) * 20,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      });

      // Safety fallback
      const safety = window.setTimeout(() => {
        if (window.innerWidth < 768) {
          stage.querySelectorAll<HTMLElement>("[data-quote]").forEach((el) => {
            if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
              el.style.opacity = "1";
              el.style.filter = "none";
            }
          });
        }
      }, 3000);

      return () => window.clearTimeout(safety);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="La Voce — chi c'è stato racconta"
      className="relative isolate overflow-hidden bg-[color:var(--carbone)]"
      style={{ minHeight: "100vh" }}
    >
      {/* Marcatore */}
      <div className="pointer-events-none absolute left-6 top-8 z-30 md:left-10 md:top-10">
        <p className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--crema)]/40">
          06 — La Voce
        </p>
      </div>

      {/* Intro title */}
      <div
        ref={introRef}
        className="pointer-events-none absolute left-1/2 top-[14%] z-30 w-[92%] -translate-x-1/2 text-center md:top-[10%] md:w-auto"
      >
        <h2 className="font-display text-3xl leading-[1.05] text-[color:var(--crema)] md:text-6xl">
          Chi c'è <em className="italic text-[color:var(--oro)]">stato</em> racconta.
        </h2>
      </div>

      {/* Stage 3D */}
      <div
        ref={stageRef}
        className="relative mx-auto flex min-h-screen w-full items-center justify-center md:block"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative mx-auto w-full max-w-5xl px-6 py-32 md:absolute md:inset-0 md:h-screen md:max-w-none md:px-0 md:py-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {sorted.map((r, i) => {
            const z = WAVE_Z[r.wave];
            const xPct = r.side * SIDE_BASE_VW + r.xJitter; // vw
            const yPct = r.y; // vh
            return (
              <figure
                key={i}
                data-quote
                data-z={z}
                data-xpct={xPct}
                data-ypct={yPct}
                className="voce-quote mb-16 max-w-md text-left md:absolute md:mb-0 md:w-[min(440px,32vw)] md:max-w-none md:will-change-transform"
                style={{
                  transformStyle: "preserve-3d",
                  textAlign: r.side < 0 ? "left" : "right",
                }}
              >
                <blockquote
                  className="voce-text font-display italic leading-snug text-[color:var(--crema)]"
                  style={{
                    fontSize: "clamp(1.3rem, 2.6vw, 2.3rem)",
                    textShadow:
                      "0 0 14px rgba(196,154,74,0.25), 0 0 3px rgba(242,232,213,0.18)",
                  }}
                >
                  <span className="text-[color:var(--oro)]">“</span>
                  {r.text}
                  <span className="text-[color:var(--oro)]">”</span>
                </blockquote>
                <figcaption className="mt-3 font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--crema)]/40">
                  — {r.source}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      {/* Vignette per profondità */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(26,18,16,0.9) 92%)",
        }}
      />

      {/* Boost tipografico per la recensione in fuoco */}
      <style>{`
        .voce-quote[data-focused="true"] .voce-text {
          color: var(--crema);
          font-weight: 500;
          text-shadow:
            0 0 28px rgba(196,154,74,0.55),
            0 0 8px rgba(242,232,213,0.4) !important;
        }
      `}</style>
    </section>
  );
}
