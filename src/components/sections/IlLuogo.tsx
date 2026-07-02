import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aerial from "@/assets/home-luogo-aerial.jpg";

gsap.registerPlugin(ScrollTrigger);

const GMAPS = "https://www.google.com/maps?q=40.642739,17.042600";

const NOTES = [
  "40.642° N — 17.042° E",
  "Murgia dei Trulli · altopiano",
  "Noci (BA) · Puglia",
  "Ulivi · pietra · pane",
];

export function IlLuogo() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { reduced, mobile } = ctx.conditions as {
          desktop: boolean;
          mobile: boolean;
          reduced: boolean;
        };
        if (reduced) return;

        const photo = root.querySelector<HTMLElement>("[data-luogo-photo]");
        const ghost = root.querySelector<HTMLElement>("[data-luogo-ghost]");
        const notebook = root.querySelector<HTMLElement>("[data-luogo-notebook]");
        const stage = root.querySelector<HTMLElement>("[data-luogo-stage]");

        // 1) Depth zoom + focus-pull on the photo
        if (photo && stage) {
          gsap.fromTo(
            photo,
            { scale: 1.0, filter: "blur(6px)", yPercent: 4 },
            {
              scale: mobile ? 1.2 : 1.35,
              filter: "blur(0px)",
              yPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: stage,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        // 2) Parallax layers (ghost slower, notebook faster)
        if (ghost) {
          gsap.fromTo(
            ghost,
            { yPercent: 12 },
            {
              yPercent: -16,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
        if (notebook && !mobile) {
          gsap.fromTo(
            notebook,
            { yPercent: -3 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        // 3) Staggered reveals: marker → title words → notebook items
        const marker = root.querySelector<HTMLElement>("[data-luogo-marker]");
        const titleWords = root.querySelectorAll<HTMLElement>("[data-luogo-word]");
        const notes = root.querySelectorAll<HTMLElement>("[data-luogo-note]");

        if (marker) {
          gsap.fromTo(
            marker,
            { autoAlpha: 0, y: 12 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: { trigger: stage, start: "top 78%", once: true },
            }
          );
        }
        if (titleWords.length) {
          gsap.fromTo(
            titleWords,
            { autoAlpha: 0, yPercent: 100 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.9,
              stagger: 0.08,
              ease: "cubic-bezier(.16,1,.3,1)",
              scrollTrigger: { trigger: stage, start: "top 68%", once: true },
              delay: 0.15,
            }
          );
        }
        if (notes.length) {
          gsap.fromTo(
            notes,
            { autoAlpha: 0, x: 24 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: "power2.out",
              scrollTrigger: { trigger: stage, start: "top 60%", once: true },
              delay: 0.35,
            }
          );
        }

        // 4) Map draw-in
        const roads = root.querySelectorAll<SVGPathElement>("[data-map-road]");
        const dotMasseria = root.querySelector<SVGElement>("[data-map-dot-masseria]");
        const dotNoci = root.querySelector<SVGElement>("[data-map-dot-noci]");
        const labels = root.querySelectorAll<SVGElement>("[data-map-label]");
        const mapEl = root.querySelector<HTMLElement>("[data-luogo-map]");

        roads.forEach((path) => {
          const len = path.getTotalLength();
          path.style.strokeDasharray = `${len}`;
          path.style.strokeDashoffset = `${len}`;
        });

        if (mapEl && roads.length) {
          gsap.to(roads, {
            strokeDashoffset: 0,
            ease: "none",
            stagger: 0.15,
            scrollTrigger: {
              trigger: mapEl,
              start: "top 85%",
              end: "bottom 55%",
              scrub: 1,
            },
          });
        }
        if (mapEl && (dotMasseria || dotNoci)) {
          gsap.fromTo(
            [dotMasseria, dotNoci].filter(Boolean),
            { autoAlpha: 0, scale: 0 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.6,
              stagger: 0.2,
              ease: "back.out(2)",
              transformOrigin: "center",
              scrollTrigger: { trigger: mapEl, start: "top 60%", once: true },
              delay: 0.4,
            }
          );
        }
        if (mapEl && labels.length) {
          gsap.fromTo(
            labels,
            { autoAlpha: 0 },
            {
              autoAlpha: 1,
              duration: 0.5,
              stagger: 0.1,
              scrollTrigger: { trigger: mapEl, start: "top 55%", once: true },
              delay: 0.8,
            }
          );
        }
      },
      root
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="luogo-title"
      className="relative overflow-hidden text-crema"
      style={{ backgroundColor: "var(--marrone)" }}
    >
      {/* STAGE: photo + overlays */}
      <div
        data-luogo-stage
        className="relative h-[130svh] w-full overflow-hidden max-md:h-[110svh]"
      >
        {/* L1 Photo */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            data-luogo-photo
            src={aerial}
            alt="Masseria Don Gianvito tra gli ulivi di Noci al tramonto"
            loading="lazy"
            width={1920}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            style={{ transformOrigin: "50% 55%" }}
          />
          {/* Vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, rgba(26,18,16,0.15) 25%, rgba(26,18,16,0.15) 65%, rgba(26,18,16,0.85) 100%)",
            }}
          />
        </div>

        {/* L2 Ghost word NOCI */}
        <span
          data-luogo-ghost
          aria-hidden
          className="pointer-events-none absolute inset-x-[-10vw] top-[18%] flex select-none justify-center will-change-transform"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            fontSize: "clamp(14rem, 32vw, 34rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.05em",
            color: "color-mix(in oklab, var(--crema) 4%, transparent)",
            whiteSpace: "nowrap",
          }}
        >
          NOCI
        </span>

        {/* Content grid */}
        <div className="relative z-20 mx-auto flex h-full max-w-[1400px] flex-col justify-between px-6 py-[8svh] md:px-12 md:py-[10svh]">
          {/* L3 Marker */}
          <p
            data-luogo-marker
            className="text-[0.7rem] uppercase"
            style={{
              fontFamily: "'Oswald', 'Inter', sans-serif",
              letterSpacing: "0.32em",
              color: "color-mix(in oklab, var(--crema) 45%, transparent)",
              visibility: "hidden",
            }}
          >
            03 — Il Luogo
          </p>

          <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:items-end md:gap-8">
            {/* L4 Title */}
            <h2
              id="luogo-title"
              className="md:col-span-7"
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                fontSize: "clamp(2.4rem, 5.6vw, 5.8rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
              }}
            >
              {["Tra", "gli"].map((w, i) => (
                <TitleWord key={`a-${i}`}>{w}</TitleWord>
              ))}
              <TitleWord italic accent>
                ulivi
              </TitleWord>
              <br />
              {["di", "Noci"].map((w, i) => (
                <TitleWord key={`b-${i}`}>{w}</TitleWord>
              ))}
            </h2>

            {/* L5 Notebook */}
            <aside
              data-luogo-notebook
              className="md:col-span-4 md:col-start-9 will-change-transform"
            >
              <div
                className="border-l pl-6"
                style={{
                  borderColor: "color-mix(in oklab, var(--oro) 40%, transparent)",
                }}
              >
                <p
                  className="mb-5 uppercase"
                  style={{
                    fontFamily: "'Oswald', 'Inter', sans-serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.34em",
                    color: "color-mix(in oklab, var(--oro) 85%, transparent)",
                  }}
                >
                  Taccuino
                </p>
                <ul className="space-y-3">
                  {NOTES.map((n, i) => (
                    <li
                      key={i}
                      data-luogo-note
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.95rem",
                        lineHeight: 1.5,
                        color: "color-mix(in oklab, var(--crema) 72%, transparent)",
                        visibility: "hidden",
                      }}
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* MAP + address */}
      <div
        data-luogo-map
        className="relative mx-auto max-w-[1400px] px-6 py-[14svh] md:px-12"
      >
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-8">
            <MapSVG />
          </div>
          <div className="md:col-span-4 md:pt-8">
            <p
              className="mb-4 uppercase"
              style={{
                fontFamily: "'Oswald', 'Inter', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.34em",
                color: "color-mix(in oklab, var(--oro) 85%, transparent)",
              }}
            >
              Come raggiungerci
            </p>
            <p
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 300,
                fontSize: "clamp(1.3rem, 1.6vw, 1.6rem)",
                lineHeight: 1.35,
                color: "var(--crema)",
              }}
            >
              SP237 ex SS377 per Mottola km 6,5
              <br />
              Zona C 76 — 70015 Noci (BA)
            </p>
            <p
              className="mt-3"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.9rem",
                color: "color-mix(in oklab, var(--crema) 60%, transparent)",
              }}
            >
              A breve distanza da Noci, Alberobello e Valle d'Itria.
            </p>
            <a
              href={GMAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block uppercase transition-opacity hover:opacity-70"
              style={{
                fontFamily: "'Oswald', 'Inter', sans-serif",
                fontSize: "0.85rem",
                letterSpacing: "0.3em",
                color: "var(--oro)",
                borderBottom: "1px solid color-mix(in oklab, var(--oro) 60%, transparent)",
                paddingBottom: "4px",
              }}
            >
              Apri in mappa →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TitleWord({
  children,
  italic,
  accent,
}: {
  children: React.ReactNode;
  italic?: boolean;
  accent?: boolean;
}) {
  return (
    <span
      className="mr-[0.28em] inline-block overflow-hidden align-baseline"
      style={{ paddingBottom: "0.08em" }}
    >
      <span
        data-luogo-word
        className="inline-block"
        style={{
          fontStyle: italic ? "italic" : "normal",
          color: accent ? "var(--oro)" : "var(--crema)",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </span>
    </span>
  );
}

function MapSVG() {
  const stroke = "var(--oro)";
  return (
    <svg
      viewBox="0 0 800 420"
      className="h-auto w-full"
      style={{ maxHeight: "60vh" }}
      role="img"
      aria-label="Mappa stilistica: Masseria Don Gianvito tra Noci e Mottola"
    >
      {/* frame */}
      <rect
        x="1"
        y="1"
        width="798"
        height="418"
        fill="none"
        stroke="color-mix(in oklab, var(--crema) 12%, transparent)"
        strokeDasharray="4 6"
      />

      {/* roads */}
      <path
        data-map-road
        d="M 40 340 C 180 300, 300 260, 420 250 S 640 240, 760 200"
        fill="none"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        data-map-road
        d="M 420 250 C 460 200, 500 160, 600 110"
        fill="none"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        data-map-road
        d="M 420 250 C 380 300, 340 340, 260 380"
        fill="none"
        stroke={stroke}
        strokeWidth="0.9"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Noci dot */}
      <g data-map-dot-noci style={{ visibility: "hidden" }}>
        <circle cx="600" cy="110" r="4" fill="var(--crema)" />
        <circle
          cx="600"
          cy="110"
          r="10"
          fill="none"
          stroke="var(--crema)"
          strokeOpacity="0.3"
        />
      </g>

      {/* Masseria dot (accent) */}
      <g data-map-dot-masseria style={{ visibility: "hidden" }}>
        <circle cx="420" cy="250" r="6" fill="var(--terracotta)" />
        <circle
          cx="420"
          cy="250"
          r="14"
          fill="none"
          stroke="var(--terracotta)"
          strokeOpacity="0.5"
        />
        <circle
          cx="420"
          cy="250"
          r="24"
          fill="none"
          stroke="var(--terracotta)"
          strokeOpacity="0.2"
        />
      </g>

      {/* Labels */}
      <g
        style={{
          fontFamily: "Oswald, Inter, sans-serif",
          fontSize: "11px",
          letterSpacing: "0.28em",
          fill: "color-mix(in oklab, var(--crema) 70%, transparent)",
          textTransform: "uppercase",
        }}
      >
        <text data-map-label x="616" y="106" style={{ visibility: "hidden" }}>
          NOCI
        </text>
        <text
          data-map-label
          x="438"
          y="246"
          style={{
            visibility: "hidden",
            fill: "var(--oro)",
            fontSize: "12px",
          }}
        >
          MASSERIA DON GIANVITO
        </text>
        <text
          data-map-label
          x="438"
          y="262"
          style={{
            visibility: "hidden",
            fill: "color-mix(in oklab, var(--crema) 55%, transparent)",
            fontSize: "9px",
            letterSpacing: "0.22em",
          }}
        >
          40.642° N — 17.042° E
        </text>
        <text data-map-label x="250" y="400" style={{ visibility: "hidden" }}>
          MOTTOLA →
        </text>
        <text
          data-map-label
          x="200"
          y="322"
          style={{
            visibility: "hidden",
            fill: "color-mix(in oklab, var(--crema) 45%, transparent)",
            fontSize: "9px",
          }}
        >
          SP237
        </text>
      </g>
    </svg>
  );
}

export default IlLuogo;
