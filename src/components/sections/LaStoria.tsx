import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Panel = {
  id: string;
  ghost: string;
  chapter: string;
  title: React.ReactNode;
  text: React.ReactNode;
  note?: string;
  accent: string; // css color for progress bar
  surface: string; // background gradient
};

const PANELS: Panel[] = [
  {
    id: "p1",
    ghost: "1500",
    chapter: "LE ORIGINI",
    title: (
      <>
        Cinque secoli
        <br />
        di pietra.
      </>
    ),
    text: (
      <>
        La Masseria nasce in un complesso rurale del Cinquecento, tra le
        campagne di Noci e la strada per Mottola.
      </>
    ),
    note: "Muri, corti e volumi agricoli custodiscono ancora la forma originaria del luogo.",
    accent: "#6b4a2a",
    surface:
      "linear-gradient(115deg, #d9c9a8 0%, #c9b48b 45%, #a8916a 100%)",
  },
  {
    id: "p2",
    ghost: "2002",
    chapter: "UN DATO CERTO",
    title: (
      <>
        Una storia
        <br />
        registrata.
      </>
    ),
    text: <>Dal 2002 Masseria Don Gianvito risulta iscritta alla Camera di Commercio.</>,
    note: "È un riferimento documentale, non necessariamente l'inizio della storia familiare.",
    accent: "#7a1d2a",
    surface:
      "linear-gradient(180deg, #ece3d0 0%, #e2d6bc 60%, #d4c39f 100%)",
  },
  {
    id: "p3",
    ghost: "QUATTRO",
    chapter: "UNA SOLA FILIERA",
    title: (
      <>
        Quattro mestieri.
        <br />
        Un solo luogo.
      </>
    ),
    text: (
      <>
        Ogni attività continua nella successiva, senza interrompere il rapporto
        tra ciò che nasce qui e ciò che arriva a tavola.
      </>
    ),
    accent: "#8a7a2c",
    surface:
      "linear-gradient(90deg, #3d2a1e 0%, #6b7340 50%, #c49a4a 100%)",
  },
  {
    id: "p4",
    ghost: "OGGI",
    chapter: "LA MASSERIA VIVA",
    title: (
      <>
        Non un ricordo.
        <br />
        Un luogo che lavora.
      </>
    ),
    text: (
      <>
        Ogni giorno la Masseria coltiva, alleva e trasforma. La sera accoglie
        gli ospiti; la domenica e nei giorni festivi apre la tavola per il
        pranzo.
      </>
    ),
    note: "La storia continua nel lavoro quotidiano.",
    accent: "#6b7340",
    surface:
      "linear-gradient(135deg, #ece3d0 0%, #b8b088 55%, #6b7340 100%)",
  },
];

const CRAFTS = ["ALLEVAMENTO", "CASEIFICIO", "MACELLERIA", "CUCINA"];
const RHYTHM = ["COLTIVA", "ALLEVA", "TRASFORMA", "ACCOGLIE"];

export function LaStoria() {
  const wrapperRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!wrapper || !stage || !track) return;
    if (typeof window === "undefined") return;

    let cancelled = false;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const c = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduced: boolean;
          };
          if (c.reduced) return;

          const getDistance = () =>
            Math.max(0, track.scrollWidth - window.innerWidth);
          if (getDistance() <= 0) return;

          const scrub = c.isMobile ? 0.5 : 0.6;
          const pinTarget = c.isMobile ? wrapper : stage;

          const tween = gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top top",
              end: () => `+=${getDistance()}`,
              pin: pinTarget,
              pinSpacing: true,
              scrub,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (progressRef.current) {
                  progressRef.current.style.transform = `scaleX(${self.progress})`;
                }
              },
            },
          });

          const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);
          panels.forEach((p, i) => {
            const ghost = p.querySelector<HTMLElement>("[data-ghost]");
            if (ghost) {
              gsap.fromTo(
                ghost,
                { xPercent: 12 },
                {
                  xPercent: -12,
                  ease: "none",
                  scrollTrigger: {
                    trigger: p,
                    containerAnimation: tween,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                }
              );
            }
            ScrollTrigger.create({
              trigger: p,
              containerAnimation: tween,
              start: "left center",
              end: "right center",
              onToggle: (self) => {
                if (self.isActive) setActive(i);
              },
            });
          });
        }
      );

      // ── HANDOFF Storia → Luogo (bridge in uscita, additivo)
      // OGGI perde opacità, la linea nasce e sopravvive oltre il rilascio del pin.
      const exit = wrapper.querySelector<HTMLElement>("[data-storia-exit]");
      if (exit) {
        const echo = exit.querySelector<HTMLElement>("[data-oggi-echo]");
        const line = exit.querySelector<HTMLElement>("[data-horizon-birth]");
        if (echo) {
          gsap.fromTo(
            echo,
            { autoAlpha: 0.16 },
            {
              autoAlpha: 0,
              ease: "none",
              scrollTrigger: {
                trigger: exit,
                start: "top 90%",
                end: "bottom 60%",
                scrub: 0.6,
              },
            }
          );
        }
        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: exit,
                start: "top 95%",
                end: "center 65%",
                scrub: 0.6,
              },
            }
          );
        }
      }

      // Safe refresh after fonts
      (async () => {
        try {
          if (document.fonts?.ready) await document.fonts.ready;
        } finally {
          if (!cancelled) ScrollTrigger.refresh();
        }
      })();
    }, wrapper);

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  const current = PANELS[active];

  return (
    <section
      ref={wrapperRef}
      aria-labelledby="storia-title"
      className="history-wrapper relative text-crema"
      style={{
        backgroundColor: "var(--carbone)",
        overflow: "clip",
      }}
    >
      <div ref={stageRef} className="history-stage relative h-[100dvh] w-full overflow-hidden">
        {/* Track */}
        <div
          ref={trackRef}
          className="history-track flex h-full w-max will-change-transform"
        >
          {PANELS.map((p, i) => (
            <article
              key={p.id}
              data-panel
              data-panel-id={p.id}
              className="relative flex h-[100dvh] w-[100vw] shrink-0 overflow-hidden box-border"
              style={{ background: p.surface }}
            >
              {/* Calcareous texture layer (SVG) */}
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
                style={{ mixBlendMode: "multiply", opacity: 0.18 }}
              >
                <filter id={`grain-${p.id}`}>
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={i + 1} />
                  <feColorMatrix values="0 0 0 0 0.15  0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0.35 0" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#grain-${p.id})`} />
              </svg>

              {/* Architectural line (only on p1 & p4) */}
              {(i === 0 || i === 3) && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0"
                  style={{
                    top: i === 0 ? "58%" : "42%",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(60,40,25,0.55) 20%, rgba(60,40,25,0.55) 80%, transparent 100%)",
                  }}
                />
              )}

              {/* Ghost year/word */}
              <span
                data-ghost
                aria-hidden
                className="pointer-events-none absolute inset-0 flex select-none items-center justify-center will-change-transform"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 300,
                  fontSize: i === 2 ? "clamp(4rem, 18vw, 20rem)" : "clamp(7rem, 38vw, 42rem)",
                  lineHeight: 0.85,
                  letterSpacing: "-0.05em",
                  color:
                    i === 2
                      ? "color-mix(in oklab, var(--crema) 10%, transparent)"
                      : "color-mix(in oklab, #2a1a10 9%, transparent)",
                  whiteSpace: "nowrap",
                }}
              >
                {p.ghost}
              </span>

              {/* Panel 02 stamp */}
              {i === 1 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    right: "8%",
                    top: "18%",
                    transform: "rotate(-3deg)",
                    border: "2px solid #7a1d2a",
                    color: "#7a1d2a",
                    padding: "10px 16px",
                    fontFamily: "'Oswald', 'Inter', sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.28em",
                    lineHeight: 1.4,
                    textAlign: "center",
                    opacity: 0.82,
                    background: "rgba(236,227,208,0.35)",
                  }}
                >
                  ISCRIZIONE CCIAA
                  <br />
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: "1.1rem", letterSpacing: "0.1em" }}>
                    2002
                  </span>
                </div>
              )}

              {/* Panel 03 crafts stack */}
              {i === 2 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-end justify-center gap-2 md:gap-4 pr-6 md:pr-24"
                >
                  {CRAFTS.map((w, idx) => (
                    <span
                      key={w}
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 300,
                        fontStyle: "italic",
                        fontSize: `clamp(1.4rem, ${4 + idx * 0.4}vw, ${2.8 + idx * 0.4}rem)`,
                        letterSpacing: "0.02em",
                        color: `color-mix(in oklab, var(--crema) ${55 + idx * 12}%, transparent)`,
                        textShadow: "0 2px 12px rgba(0,0,0,0.25)",
                      }}
                    >
                      {w}
                    </span>
                  ))}
                </div>
              )}

              {/* Panel 04 rhythm words */}
              {i === 3 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute z-[1]"
                  style={{ right: "6%", top: "22%" }}
                >
                  <div className="flex flex-col gap-2">
                    {RHYTHM.map((w) => (
                      <span
                        key={w}
                        style={{
                          fontFamily: "'Oswald', sans-serif",
                          fontSize: "clamp(0.75rem, 1.2vw, 0.95rem)",
                          letterSpacing: "0.4em",
                          color: "color-mix(in oklab, #2a1a10 65%, transparent)",
                        }}
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div
                className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col justify-end"
                style={{
                  padding: "clamp(20px, 4vw, 64px)",
                  paddingTop: "calc(env(safe-area-inset-top, 0px) + clamp(80px, 12vh, 140px))",
                  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + clamp(80px, 14vh, 140px))",
                }}
              >
                <p
                  className="mb-4 md:mb-6"
                  style={{
                    fontFamily: "'Oswald', 'Inter', sans-serif",
                    fontSize: "0.72rem",
                    letterSpacing: "0.36em",
                    color: i === 2
                      ? "color-mix(in oklab, var(--crema) 65%, transparent)"
                      : "color-mix(in oklab, #2a1a10 65%, transparent)",
                  }}
                >
                  {p.chapter}
                </p>
                <h3
                  className="max-w-[16ch]"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 300,
                    fontSize: "clamp(2.3rem, 7vw, 5.4rem)",
                    lineHeight: 0.98,
                    letterSpacing: "-0.02em",
                    color: i === 2 ? "var(--crema)" : "#1e130c",
                  }}
                >
                  {i === 0 && (
                    <>
                      Cinque secoli
                      <br />
                      di <em style={{ fontStyle: "italic", color: "#6b4a2a" }}>pietra</em>.
                    </>
                  )}
                  {i !== 0 && p.title}
                </h3>
                <p
                  className="mt-5 md:mt-7 max-w-[42ch]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1rem, 1.3vw, 1.1rem)",
                    lineHeight: 1.55,
                    color: i === 2
                      ? "color-mix(in oklab, var(--crema) 85%, transparent)"
                      : "color-mix(in oklab, #1e130c 80%, transparent)",
                  }}
                >
                  {p.text}
                </p>
                {p.note && (
                  <p
                    className="mt-4 max-w-[40ch]"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontStyle: "italic",
                      fontSize: "clamp(0.85rem, 1vw, 0.95rem)",
                      lineHeight: 1.5,
                      color: i === 2
                        ? "color-mix(in oklab, var(--crema) 60%, transparent)"
                        : "color-mix(in oklab, #1e130c 60%, transparent)",
                    }}
                  >
                    {p.note}
                  </p>
                )}
              </div>

              {/* Vignette */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(30,19,12,0.15) 0%, rgba(30,19,12,0) 25%, rgba(30,19,12,0) 75%, rgba(30,19,12,0.25) 100%)",
                }}
              />
            </article>
          ))}
        </div>

        {/* Fixed intro overlay (visible in first panel only, layered above track's first panel) */}
        <div
          className="pointer-events-none absolute left-0 top-0 z-20"
          style={{
            padding: "clamp(20px, 3vw, 48px)",
            paddingTop: "calc(env(safe-area-inset-top, 0px) + clamp(24px, 4vh, 56px))",
          }}
        >
          <p
            style={{
              fontFamily: "'Oswald', 'Inter', sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.36em",
              color: "color-mix(in oklab, #1e130c 70%, transparent)",
            }}
          >
            02 — LA STORIA
          </p>
        </div>

        {/* Counter */}
        <div
          className="pointer-events-none absolute z-20"
          style={{
            right: "clamp(20px, 3vw, 48px)",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + clamp(24px, 4vh, 48px))",
          }}
          aria-hidden
        >
          <p
            style={{
              fontFamily: "'Oswald', 'Inter', sans-serif",
              fontSize: "0.8rem",
              letterSpacing: "0.32em",
              color: active === 2
                ? "color-mix(in oklab, var(--crema) 80%, transparent)"
                : "color-mix(in oklab, #1e130c 75%, transparent)",
            }}
          >
            <span style={{ color: active === 2 ? "var(--crema)" : "#1e130c" }}>
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="mx-2" style={{ opacity: 0.4 }}>/</span>
            {String(PANELS.length).padStart(2, "0")}
          </p>
        </div>

        {/* Progress line */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-20"
          style={{ height: "2px", background: "rgba(30,19,12,0.08)" }}
          aria-hidden
        >
          <div
            ref={progressRef}
            className="h-full origin-left will-change-transform"
            style={{
              transform: "scaleX(0)",
              background: current.accent,
              transition: "background-color 400ms ease",
            }}
          />
        </div>
      </div>

      {/* ── HANDOFF: Storia → Luogo ─────────────────────────────
          Bridge decorativo in flusso normale, fuori dal pin.
          Traghetta il gradiente finale del p4 (cream/oliva) verso
          il marrone del Luogo, mentre "OGGI" si spegne e la linea
          d'orizzonte prende vita. Puramente presentazionale. */}
      <div
        data-storia-exit
        aria-hidden="true"
        className="pointer-events-none relative w-full overflow-hidden"
        style={{
          height: "clamp(220px, 32vh, 360px)",
          background:
            "linear-gradient(180deg, #6b7340 0%, #4a4530 45%, #3a2e22 78%, #2a1f1a 100%)",
        }}
      >
        <span
          data-oggi-echo
          className="pointer-events-none absolute inset-x-0 top-[8%] flex select-none justify-center will-change-transform"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            fontSize: "clamp(5rem, 20vw, 18rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
            color: "color-mix(in oklab, #1e130c 12%, transparent)",
            whiteSpace: "nowrap",
            opacity: 0,
          }}
        >
          OGGI
        </span>
        <div
          data-horizon-birth
          className="pointer-events-none absolute left-0 right-0 origin-center will-change-transform"
          style={{
            bottom: "38%",
            height: "1px",
            transform: "scaleX(0)",
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--oro, #c9a961) 55%, transparent) 18%, color-mix(in oklab, var(--oro, #c9a961) 55%, transparent) 82%, transparent 100%)",
          }}
        />
      </div>

      {/* Reduced-motion fallback: hidden by default, shown via CSS if needed */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .history-track { flex-direction: column; width: 100% !important; transform: none !important; }
          .history-track [data-panel] { width: 100% !important; height: auto !important; min-height: 80dvh; }
          .history-stage { height: auto !important; }
          [data-storia-exit] [data-oggi-echo] { opacity: 0.10 !important; visibility: visible !important; }
          [data-storia-exit] [data-horizon-birth] { transform: scaleX(1) !important; }
        }
      `}</style>
    </section>
  );
}

export default LaStoria;
