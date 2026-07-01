import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * LA VOCE — Volo 3D attraverso 10 recensioni sospese nel buio.
 * Scroll = camera Z. Le voci vicine passano veloci, quelle
 * lontane si avvicinano. Glow pulsante --oro, buio assoluto.
 * ───────────────────────────────────────────────────────────── */

type Review = {
  text: string;
  source: string;
  /** Base translateZ in px (da -1400 lontano a -100 vicino) */
  z: number;
  /** Percentuali rispetto al centro del viewport */
  x: number;
  y: number;
};

const REVIEWS: Review[] = [
  { text: "L'antipasto non finisce mai.", source: "Tripadvisor", z: -1400, x: -18, y: -22 },
  { text: "Le mozzarelle km0 sono sublimi.", source: "Tripadvisor", z: -1200, x: 22, y: 14 },
  { text: "Si sceglie la carne nella macelleria e poi la fai cucinare. Tutto spettacolare.", source: "Tripadvisor", z: -1000, x: -26, y: 18 },
  { text: "Tutto di loro produzione, carne squisita e tenera.", source: "Tripadvisor", z: -850, x: 20, y: -18 },
  { text: "Posto rustico, interni in pietra bianca, molto bella davvero.", source: "Tripadvisor", z: -700, x: -14, y: 6 },
  { text: "Servizio veloce e cordiale, prezzi onestissimi.", source: "Tripadvisor", z: -550, x: 24, y: 22 },
  { text: "Gli orologi si fermano quando la trasportano dal forno alla cucina.", source: "Luciano Pignataro Wine Blog", z: -420, x: -22, y: -10 },
  { text: "Cibo a km 0 di buona qualità, rapporto qualità-prezzo vantaggioso.", source: "Tripadvisor", z: -300, x: 16, y: 4 },
  { text: "Da ritornarci assolutamente.", source: "Tripadvisor", z: -200, x: -12, y: 20 },
  { text: "Una delle mie masserie preferite in Puglia.", source: "Instagram", z: -100, x: 14, y: -16 },
];

export function LaVoce() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Riordino per Z (dal più lontano al più vicino) — aiuta il paint order
  const sorted = useMemo(
    () => [...REVIEWS].sort((a, b) => a.z - b.z),
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

      // ── DESKTOP · VOLO 3D ──────────────────────────────────
      mm.add("(min-width: 768px)", () => {
        const quotes = Array.from(
          stage.querySelectorAll<HTMLElement>("[data-quote]")
        );

        // Stato iniziale: ogni voce alla sua Z base, opacità piena
        quotes.forEach((el) => {
          const baseZ = Number(el.dataset.z || 0);
          gsap.set(el, {
            z: baseZ,
            autoAlpha: 1,
            filter: `blur(${Math.min(3, Math.abs(baseZ) / 500)}px)`,
          });
        });

        // Intro title: mask-wipe reveal, poi dissolve al volo
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

        // Volo: camera avanza. Applichiamo delta Z a tutte le quote
        // in modo che si "avvicinino" a Z=0 e oltrepassino.
        const state = { cam: 0 };
        const CAM_END = 1600; // px di avanzamento camera

        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "+=3000",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            state.cam = self.progress * CAM_END;

            // Fade dell'intro durante i primi 15% dello scroll
            if (intro) {
              const introOp = Math.max(0, 1 - self.progress / 0.15);
              gsap.set(intro, { autoAlpha: introOp });
            }

            quotes.forEach((el) => {
              const baseZ = Number(el.dataset.z || 0);
              const currentZ = baseZ + state.cam; // si avvicina a 0, poi oltrepassa
              // Scale e blur derivati dalla distanza
              const dist = Math.abs(currentZ);
              let opacity = 1;
              let blur = 0;

              if (currentZ > 100) {
                // passata: la voce è dietro la camera → sfuma via
                opacity = Math.max(0, 1 - (currentZ - 100) / 400);
                blur = Math.min(10, (currentZ - 100) / 60);
              } else if (currentZ < -1600) {
                opacity = 0;
              } else {
                opacity = 1;
                blur = Math.min(3, dist / 700);
              }

              el.style.transform = `translate3d(-50%, -50%, ${currentZ}px) translate(${el.dataset.x}%, ${el.dataset.y}%)`;
              el.style.opacity = String(opacity);
              el.style.filter = `blur(${blur}px)`;
            });
          },
        });

        // Glow pulsante per ogni voce (stagger)
        quotes.forEach((el, i) => {
          const q = el.querySelector<HTMLElement>("[data-glow]");
          if (!q) return;
          gsap.to(q, {
            textShadow:
              "0 0 24px rgba(196,154,74,0.55), 0 0 6px rgba(242,232,213,0.35)",
            duration: 3.5 + (i % 3) * 0.6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: (i * 0.3) % 2,
          });
        });
      });

      // ── MOBILE · PARALLASSE VERTICALE ───────────────────────
      mm.add("(max-width: 767px)", () => {
        const quotes = Array.from(
          stage.querySelectorAll<HTMLElement>("[data-quote]")
        );
        quotes.forEach((el, i) => {
          el.style.transform = "none";
          el.style.position = "relative";
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
          const q = el.querySelector<HTMLElement>("[data-glow]");
          if (q) {
            gsap.to(q, {
              textShadow:
                "0 0 18px rgba(196,154,74,0.5), 0 0 4px rgba(242,232,213,0.3)",
              duration: 3.5 + (i % 3) * 0.6,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: (i * 0.3) % 2,
            });
          }
        });
      });

      // Fallback: forza visibilità dopo 3s se qualcosa è rimasto invisibile
      const safety = window.setTimeout(() => {
        stage.querySelectorAll<HTMLElement>("[data-quote]").forEach((el) => {
          if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
            el.style.opacity = "1";
            el.style.filter = "none";
          }
        });
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

      {/* Intro title (dissolve al volo) */}
      <div
        ref={introRef}
        className="pointer-events-none absolute left-1/2 top-[18%] z-30 w-[92%] -translate-x-1/2 text-center md:top-[14%] md:w-auto"
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
          perspective: "1000px",
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Colonna mobile / spazio 3D desktop */}
        <div
          className="relative mx-auto w-full max-w-5xl px-6 py-32 md:absolute md:inset-0 md:h-screen md:max-w-none md:px-0 md:py-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {sorted.map((r, i) => (
            <figure
              key={i}
              data-quote
              data-z={r.z}
              data-x={r.x}
              data-y={r.y}
              className="mb-16 max-w-md md:absolute md:left-1/2 md:top-1/2 md:mb-0 md:w-[min(560px,60vw)] md:max-w-none md:will-change-transform"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              <blockquote
                data-glow
                className="font-display text-2xl italic leading-snug text-[color:var(--crema)] md:text-3xl lg:text-4xl"
                style={{
                  textShadow:
                    "0 0 16px rgba(196,154,74,0.25), 0 0 4px rgba(242,232,213,0.2)",
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
          ))}
        </div>
      </div>

      {/* Vignette per profondità */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(26,18,16,0.85) 90%)",
        }}
      />
    </section>
  );
}
