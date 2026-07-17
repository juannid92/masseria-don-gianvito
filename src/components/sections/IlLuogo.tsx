import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aerial from "@/assets/home-luogo-aerial.jpg";
import olivesFg from "@/assets/home-olives-foreground.png";

gsap.registerPlugin(ScrollTrigger);

const GMAPS_URL = "https://www.google.com/maps?q=40.642739,17.042600";

/**
 * IL LUOGO — Fase 3
 * Profondità → Avvicinamento → Arrivo.
 * Un unico palco pinnato desktop, tre atti nello stesso spazio.
 * Mobile: struttura verticale senza pin lungo.
 */
export function IlLuogo() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let mounted = true;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {}, root);

    mm.add(
      {
        desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      },
      (mmCtx) => {
        const conds = mmCtx.conditions as { desktop: boolean; mobile: boolean };
        const isDesktop = !!conds.desktop;

        const wrapper = root.querySelector<HTMLElement>("[data-luogo-wrapper]");
        const stage = root.querySelector<HTMLElement>("[data-luogo-stage]");
        if (!wrapper || !stage) return;

        const bg = stage.querySelector<HTMLElement>("[data-l-background]");
        const land = stage.querySelector<HTMLElement>("[data-l-land]");
        const masseria = stage.querySelector<HTMLElement>("[data-l-masseria]");
        const fg = stage.querySelector<HTMLElement>("[data-l-foreground]");
        const ghost = stage.querySelector<HTMLElement>("[data-l-ghost]");
        const horizon = stage.querySelector<HTMLElement>("[data-l-horizon]");
        const overlayI = stage.querySelector<HTMLElement>("[data-l-overlay-1]");
        const overlayII = stage.querySelector<HTMLElement>("[data-l-overlay-2]");
        const overlayIII = stage.querySelector<HTMLElement>("[data-l-overlay-3]");

        const actI = stage.querySelector<HTMLElement>("[data-act-1]");
        const actII = stage.querySelector<HTMLElement>("[data-act-2]");
        const actIII = stage.querySelector<HTMLElement>("[data-act-3]");
        const notebook = stage.querySelector<HTMLElement>("[data-l-notebook]");
        const closure = stage.querySelector<HTMLElement>("[data-l-closure]");

        const topoPaths = stage.querySelectorAll<SVGPathElement>("[data-topo]");
        const mapPath = stage.querySelector<SVGPathElement>("[data-map-path]");
        const mapDot = stage.querySelector<SVGElement>("[data-map-dot]");

        // Prepara stroke-dashoffset per SVG animati
        [...Array.from(topoPaths), mapPath].forEach((p) => {
          if (!p) return;
          const len = (p as SVGPathElement).getTotalLength();
          (p as SVGPathElement).style.strokeDasharray = `${len}`;
          (p as SVGPathElement).style.strokeDashoffset = `${len}`;
        });

        if (isDesktop) {
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: wrapper,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              pin: stage,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // 0 - stato iniziale
          tl.set([actII, actIII, notebook, closure], { autoAlpha: 0 });
          tl.set(actI, { autoAlpha: 1 });

          // ATTO I — 0 → 0.25 : entrata orizzonte + NOCI + titolo I
          tl.fromTo(ghost, { autoAlpha: 0, yPercent: 4 }, { autoAlpha: 0.12, yPercent: 0, duration: 0.15 }, 0);
          tl.fromTo(horizon, { scaleX: 0, autoAlpha: 0 }, { scaleX: 1, autoAlpha: 1, duration: 0.15 }, 0);
          tl.fromTo(actI, { y: 24 }, { y: 0, duration: 0.15 }, 0.02);

          // ATTO II — 0.25 → 0.65 : depth zoom + parallasse + linee topo + swap testo
          tl.to(bg, { scale: 1.06, duration: 0.4 }, 0.25);
          tl.to(land, { scale: 1.1, yPercent: -3, duration: 0.4 }, 0.25);
          tl.to(masseria, { scale: 1.14, yPercent: -4, duration: 0.4 }, 0.25);
          tl.to(fg, { yPercent: 9, duration: 0.4 }, 0.25);
          tl.to(ghost, { yPercent: -6, autoAlpha: 0.06, duration: 0.4 }, 0.25);
          tl.to(overlayI, { autoAlpha: 0, duration: 0.15 }, 0.25);
          tl.to(overlayII, { autoAlpha: 1, duration: 0.15 }, 0.28);

          tl.to(actI, { autoAlpha: 0, y: -20, duration: 0.1 }, 0.28);
          tl.fromTo(actII, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.15 }, 0.36);

          if (topoPaths.length) {
            tl.to(topoPaths, { strokeDashoffset: 0, duration: 0.35, stagger: 0.05 }, 0.3);
          }

          // ATTO III — 0.65 → 1 : arrivo + taccuino + coordinate + mappa + closure
          tl.to(overlayII, { autoAlpha: 0, duration: 0.1 }, 0.65);
          tl.to(overlayIII, { autoAlpha: 1, duration: 0.15 }, 0.66);
          tl.to(actII, { autoAlpha: 0, y: -20, duration: 0.08 }, 0.65);
          tl.fromTo(actIII, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.7);
          tl.fromTo(
            notebook,
            { autoAlpha: 0, y: 32, rotate: 1.5 },
            { autoAlpha: 1, y: 0, rotate: 0, duration: 0.15 },
            0.75
          );
          if (mapPath) {
            tl.to(mapPath, { strokeDashoffset: 0, duration: 0.25 }, 0.7);
          }
          if (mapDot) {
            tl.fromTo(mapDot, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.1 }, 0.92);
          }
          tl.fromTo(closure, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.88);
        } else {
          // MOBILE — nessun pin lungo, reveals leggeri
          const reveals = stage.querySelectorAll<HTMLElement>("[data-mobile-reveal]");
          reveals.forEach((el) => {
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: { trigger: el, start: "top 82%", once: true },
              }
            );
          });

          // Ghost + horizon rivelati subito
          gsap.set([ghost, horizon, actI, actII, actIII, notebook, closure], { autoAlpha: 1 });
          if (mapPath) gsap.to(mapPath, { strokeDashoffset: 0, duration: 1.6, ease: "none", scrollTrigger: { trigger: mapPath, start: "top 80%" } });
          if (mapDot) gsap.set(mapDot, { autoAlpha: 1, scale: 1 });
          topoPaths.forEach((p) => gsap.set(p, { strokeDashoffset: 0 }));
        }

        return () => {};
      }
    );

    // Reduced motion fallback: rivela tutto
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      root
        .querySelectorAll<HTMLElement>("[data-act-1],[data-act-2],[data-act-3],[data-l-notebook],[data-l-closure],[data-l-ghost],[data-l-horizon]")
        .forEach((el) => (el.style.visibility = "visible"));
    }

    // ── HANDOFF Luogo → Filiera (bridge in uscita, additivo)
    // Il tratto cartografico esce dalla mappa, diventa solco marrone,
    // il fondo transita al carbone della Filiera. Nessun pin nuovo.
    ctx.add(() => {
      const bridge = root.querySelector<HTMLElement>("[data-luogo-exit]");
      if (!bridge) return;
      const furrow = bridge.querySelector<SVGPathElement>("[data-furrow]");
      const bridgeBg = bridge.querySelector<HTMLElement>("[data-furrow-bg]");
      const notebook = root.querySelector<HTMLElement>("[data-l-notebook]");
      if (furrow) {
        const len = furrow.getTotalLength();
        furrow.style.strokeDasharray = `${len}`;
        furrow.style.strokeDashoffset = `${len}`;
        gsap.to(furrow, {
          strokeDashoffset: 0,
          strokeWidth: 6,
          stroke: "#2a1a10",
          ease: "none",
          scrollTrigger: {
            trigger: bridge,
            start: "top 92%",
            end: "bottom bottom",
            scrub: 0.65,
          },
        });
      }
      if (bridgeBg) {
        gsap.fromTo(
          bridgeBg,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: bridge,
              start: "top 80%",
              end: "bottom bottom",
              scrub: 0.65,
            },
          }
        );
      }
      if (notebook) {
        gsap.to(notebook, {
          autoAlpha: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: bridge,
            start: "top 88%",
            end: "top 40%",
            scrub: 0.5,
          },
        });
      }
    });


    // Refresh sicuro dopo font + immagine
    const safeRefresh = () => {
      if (!mounted) return;
      ScrollTrigger.refresh();
    };
    const img = root.querySelector<HTMLImageElement>("img[data-l-image]");
    const ready: Promise<unknown>[] = [];
    if (document.fonts?.ready) ready.push(document.fonts.ready);
    if (img && !img.complete) {
      ready.push(
        new Promise((res) => {
          img.addEventListener("load", res, { once: true });
          img.addEventListener("error", res, { once: true });
        })
      );
    }
    Promise.all(ready).then(safeRefresh);

    return () => {
      mounted = false;
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="luogo-title"
      className="relative text-crema"
      style={{ backgroundColor: "var(--marrone, #2a1f1a)" }}
    >
      {/* Wrapper alto per il pin desktop (~300vh) */}
      <div
        data-luogo-wrapper
        className="relative md:h-[300vh]"
      >
        {/* PALCO */}
        <div
          data-luogo-stage
          className="relative w-full overflow-hidden md:h-[100dvh]"
          style={{ minHeight: "100dvh" }}
        >
          {/* ============ VISUAL LAYERS ============ */}
          <div className="absolute inset-0 overflow-hidden">
            {/* L1 sfondo */}
            <div
              data-l-background
              className="absolute inset-0 will-change-transform"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, #4a3a2c 0%, #2a1f1a 70%)",
                transformOrigin: "50% 50%",
              }}
            />
            {/* L2 paesaggio (foto aerea) */}
            <div
              data-l-land
              className="absolute inset-0 will-change-transform"
              style={{ transformOrigin: "50% 60%" }}
            >
              <img
                data-l-image
                src={aerial}
                alt="Le campagne di Noci intorno a Masseria Don Gianvito"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 55%" }}
              />
            </div>
            {/* L3 area Masseria (crop più stretto della stessa foto) */}
            <div
              data-l-masseria
              className="absolute inset-0 will-change-transform"
              style={{ transformOrigin: "50% 60%" }}
              aria-hidden
            >
              <img
                src={aerial}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-0 md:opacity-100"
                style={{ objectPosition: "50% 60%", transform: "scale(1.15)" }}
              />
            </div>
            {/* L4 foreground olivi */}
            <div
              data-l-foreground
              className="pointer-events-none absolute inset-x-0 bottom-[-6%] h-[38%] will-change-transform"
              aria-hidden
            >
              <img
                src={olivesFg}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover opacity-40"
                style={{ objectPosition: "50% 100%" }}
              />
            </div>

            {/* Linea orizzonte */}
            <div
              data-l-horizon
              className="pointer-events-none absolute left-0 right-0 top-[54%] h-px origin-left"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--oro, #c9a961) 60%, transparent) 20%, color-mix(in oklab, var(--oro, #c9a961) 60%, transparent) 80%, transparent 100%)",
              }}
            />

            {/* Overlay per atto (gradient localizzato dietro i testi) */}
            <div
              data-l-overlay-1
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(26,18,16,0.35) 0%, rgba(26,18,16,0.05) 30%, rgba(26,18,16,0.05) 55%, rgba(26,18,16,0.75) 100%)",
              }}
            />
            <div
              data-l-overlay-2
              className="pointer-events-none absolute inset-0 opacity-0"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 70%, rgba(26,18,16,0.7) 0%, rgba(26,18,16,0.25) 40%, rgba(26,18,16,0) 70%)",
              }}
            />
            <div
              data-l-overlay-3
              className="pointer-events-none absolute inset-0 opacity-0"
              style={{
                background:
                  "linear-gradient(105deg, rgba(26,18,16,0.85) 0%, rgba(26,18,16,0.45) 45%, rgba(26,18,16,0) 70%)",
              }}
            />

            {/* Linee topografiche */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 1600 900"
              preserveAspectRatio="none"
              aria-hidden
            >
              <g
                fill="none"
                stroke="color-mix(in oklab, var(--oro, #c9a961) 55%, transparent)"
                strokeWidth="0.8"
                opacity="0.7"
              >
                <path data-topo d="M 0 620 C 300 580, 600 600, 900 560 S 1400 520, 1600 500" />
                <path data-topo d="M 0 680 C 320 640, 620 660, 940 620 S 1420 580, 1600 560" />
                <path data-topo d="M 0 740 C 280 710, 580 720, 880 690 S 1400 650, 1600 630" />
                <path data-topo d="M 0 560 C 340 520, 640 540, 960 500 S 1440 460, 1600 440" opacity="0.5" />
              </g>
            </svg>

            {/* Parola fantasma NOCI */}
            <span
              data-l-ghost
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-[8%] flex select-none justify-center will-change-transform"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                fontSize: "clamp(9rem, 26vw, 28rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.06em",
                color: "color-mix(in oklab, var(--crema, #f0e4d0) 10%, transparent)",
                whiteSpace: "nowrap",
                visibility: "hidden",
              }}
            >
              NOCI
            </span>
          </div>

          {/* ============ COPY GRID ============ */}
          <div className="relative z-20 mx-auto flex h-full max-w-[1400px] flex-col justify-between px-6 py-[6svh] md:px-12 md:py-[8svh]">
            {/* Occhiello */}
            <p
              className="uppercase"
              data-mobile-reveal
              style={{
                fontFamily: "'Oswald', 'Inter', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.34em",
                color: "color-mix(in oklab, var(--crema, #f0e4d0) 55%, transparent)",
              }}
            >
              03 — Il Luogo
            </p>

            {/* Zona centrale che ospita i tre atti sovrapposti (desktop) o in colonna (mobile) */}
            <div className="relative mt-auto grid grid-cols-1 gap-8 md:min-h-[52dvh]">
              {/* ATTO I */}
              <div
                data-act-1
                data-mobile-reveal
                className="md:absolute md:inset-0 md:flex md:flex-col md:justify-end"
                style={{ visibility: "hidden" }}
              >
                <div className="max-w-2xl">
                  <h2
                    id="luogo-title"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 300,
                      fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)",
                      lineHeight: 1.02,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Dove la strada
                    <br />
                    <em style={{ color: "var(--oro, #c9a961)", fontStyle: "italic" }}>
                      incontra la terra.
                    </em>
                  </h2>
                  <p
                    className="mt-6 max-w-md"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "1rem",
                      lineHeight: 1.55,
                      color: "color-mix(in oklab, var(--crema, #f0e4d0) 78%, transparent)",
                    }}
                  >
                    Nelle campagne di Noci, lungo la strada verso Mottola,
                    la Masseria emerge tra ulivi, campi e pietra.
                  </p>
                </div>
              </div>

              {/* ATTO II */}
              <div
                data-act-2
                data-mobile-reveal
                className="md:absolute md:inset-0 md:flex md:flex-col md:justify-end"
                style={{ visibility: "hidden" }}
              >
                <div className="max-w-2xl">
                  <p
                    className="mb-4 uppercase"
                    style={{
                      fontFamily: "'Oswald', 'Inter', sans-serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.32em",
                      color: "color-mix(in oklab, var(--oro, #c9a961) 85%, transparent)",
                    }}
                  >
                    L'avvicinamento
                  </p>
                  <h3
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 300,
                      fontSize: "clamp(2rem, 4.6vw, 4.2rem)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Il paesaggio
                    <br />
                    prima dell'ingresso.
                  </h3>
                  <p
                    className="mt-5 max-w-md"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "1rem",
                      lineHeight: 1.55,
                      color: "color-mix(in oklab, var(--crema, #f0e4d0) 78%, transparent)",
                    }}
                  >
                    La città resta alle spalle. La strada attraversa la campagna
                    e conduce a un complesso rurale del Cinquecento ancora
                    legato al lavoro agricolo.
                  </p>
                </div>
              </div>

              {/* ATTO III */}
              <div
                data-act-3
                data-mobile-reveal
                className="md:absolute md:inset-0 md:grid md:grid-cols-12 md:gap-8"
                style={{ visibility: "hidden" }}
              >
                <div className="md:col-span-6 md:flex md:flex-col md:justify-end">
                  <p
                    className="mb-4 uppercase"
                    style={{
                      fontFamily: "'Oswald', 'Inter', sans-serif",
                      fontSize: "0.7rem",
                      letterSpacing: "0.32em",
                      color: "color-mix(in oklab, var(--oro, #c9a961) 85%, transparent)",
                    }}
                  >
                    L'arrivo
                  </p>
                  <h3
                    style={{
                      fontFamily: "'Fraunces', serif",
                      fontWeight: 300,
                      fontSize: "clamp(2.2rem, 5vw, 4.6rem)",
                      lineHeight: 1.02,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Masseria
                    <br />
                    <em style={{ color: "var(--oro, #c9a961)", fontStyle: "italic" }}>
                      Don Gianvito.
                    </em>
                  </h3>
                </div>

                {/* Taccuino */}
                <aside
                  data-l-notebook
                  className="mt-8 md:col-span-5 md:col-start-8 md:mt-0 md:self-end"
                  style={{ visibility: "hidden", willChange: "transform, opacity" }}
                >
                  <div
                    className="relative p-7"
                    style={{
                      backgroundColor: "var(--crema, #f0e4d0)",
                      color: "var(--marrone, #2a1f1a)",
                      border: "1px solid color-mix(in oklab, #6b7d3a 40%, transparent)",
                      clipPath:
                        "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute left-4 top-0 h-full w-px"
                      style={{ backgroundColor: "color-mix(in oklab, #6b7d3a 30%, transparent)" }}
                    />
                    <p
                      className="uppercase"
                      style={{
                        fontFamily: "'Oswald', 'Inter', sans-serif",
                        fontSize: "0.7rem",
                        letterSpacing: "0.32em",
                        color: "color-mix(in oklab, #6b7d3a 85%, black)",
                      }}
                    >
                      Masseria Don Gianvito
                    </p>
                    <address
                      className="mt-4 not-italic"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontSize: "1.05rem",
                        lineHeight: 1.5,
                      }}
                    >
                      SP237 ex SS377 per Mottola, km 6,5
                      <br />
                      Zona C 76 · Noci BA
                    </address>
                    <p
                      className="mt-4"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.85rem",
                        letterSpacing: "0.06em",
                        color: "color-mix(in oklab, var(--marrone, #2a1f1a) 75%, transparent)",
                      }}
                    >
                      40.642739° N
                      <br />
                      17.042600° E
                    </p>
                    <a
                      href={GMAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-block uppercase transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2"
                      style={{
                        fontFamily: "'Oswald', 'Inter', sans-serif",
                        fontSize: "0.8rem",
                        letterSpacing: "0.3em",
                        color: "#7a1e2b",
                        borderBottom: "1px solid #7a1e2b",
                        paddingBottom: "3px",
                      }}
                    >
                      Apri su Google Maps →
                    </a>
                  </div>
                </aside>
              </div>
            </div>

            {/* Chiusura */}
            <div
              data-l-closure
              data-mobile-reveal
              className="mt-10 md:mt-6"
              style={{ visibility: "hidden" }}
            >
              <p
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "clamp(1.1rem, 1.6vw, 1.5rem)",
                  color: "color-mix(in oklab, var(--crema, #f0e4d0) 70%, transparent)",
                  letterSpacing: "-0.01em",
                }}
              >
                Qui comincia la filiera.
              </p>
            </div>
          </div>

          {/* Mappa SVG editoriale — angolo in basso a destra */}
          <div
            className="pointer-events-none absolute bottom-6 right-6 z-10 hidden w-[280px] md:block"
            aria-hidden
          >
            <MapEditorial />
          </div>
        </div>
      </div>

      {/* Mappa mobile sotto il visual */}
      <div className="mx-auto max-w-[600px] px-6 py-10 md:hidden" data-mobile-reveal>
        <MapEditorial />
      </div>
    </section>
  );
}

function MapEditorial() {
  return (
    <svg
      viewBox="0 0 320 200"
      className="h-auto w-full"
      role="img"
      aria-label="Rappresentazione cartografica editoriale: Noci, direzione Mottola, Masseria Don Gianvito"
    >
      <rect
        x="1"
        y="1"
        width="318"
        height="198"
        fill="none"
        stroke="color-mix(in oklab, var(--crema, #f0e4d0) 20%, transparent)"
        strokeDasharray="3 5"
      />
      <text
        x="14"
        y="24"
        style={{
          fontFamily: "Oswald, Inter, sans-serif",
          fontSize: "9px",
          letterSpacing: "0.3em",
          fill: "color-mix(in oklab, var(--crema, #f0e4d0) 55%, transparent)",
          textTransform: "uppercase",
        }}
      >
        NOCI
      </text>
      <circle cx="46" cy="42" r="3" fill="var(--crema, #f0e4d0)" />
      <path
        data-map-path
        d="M 46 42 C 100 60, 160 100, 210 130"
        fill="none"
        stroke="#6b7d3a"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <g data-map-dot style={{ visibility: "hidden" }}>
        <circle cx="210" cy="130" r="4" fill="#7a1e2b" />
        <circle cx="210" cy="130" r="10" fill="none" stroke="#7a1e2b" strokeOpacity="0.4" />
        <circle cx="210" cy="130" r="18" fill="none" stroke="var(--crema, #f0e4d0)" strokeOpacity="0.25" />
      </g>
      <text
        x="222"
        y="128"
        style={{
          fontFamily: "Oswald, Inter, sans-serif",
          fontSize: "8px",
          letterSpacing: "0.24em",
          fill: "var(--oro, #c9a961)",
          textTransform: "uppercase",
        }}
      >
        MASSERIA
      </text>
      <text
        x="222"
        y="140"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "7px",
          letterSpacing: "0.14em",
          fill: "color-mix(in oklab, var(--crema, #f0e4d0) 50%, transparent)",
        }}
      >
        40.642° N · 17.042° E
      </text>
      <text
        x="270"
        y="188"
        style={{
          fontFamily: "Oswald, Inter, sans-serif",
          fontSize: "8px",
          letterSpacing: "0.28em",
          fill: "color-mix(in oklab, var(--crema, #f0e4d0) 45%, transparent)",
          textTransform: "uppercase",
        }}
      >
        MOTTOLA →
      </text>
    </svg>
  );
}

export default IlLuogo;
