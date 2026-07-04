import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Panel = {
  ghost: string;
  chapter: string;
  title: React.ReactNode;
  text: string;
  cue?: string;
  imgGradient: string;
};

const PANELS: Panel[] = [
  {
    ghost: "1500",
    chapter: "I — Le origini",
    title: (
      <>
        Una masseria del <em style={{ fontStyle: "italic" }}>Cinquecento</em>
      </>
    ),
    text:
      "Pietra su pietra, tra gli ulivi secolari della Murgia. La masseria nasce come presidio rurale: un tetto per raccolti, bestie e famiglie.",
    imgGradient:
      "radial-gradient(ellipse at 30% 40%, #3d2a1e 0%, #1a1210 60%, #0d0806 100%)",
  },
  {
    ghost: "2002",
    chapter: "II — Il mestiere",
    title: <>Tutto comincia qui</>,
    text:
      "La famiglia iscrive l'azienda agricola nel 2002. Bovini Pezzata Rossa × Frisona, ovini, suini, equini, avicoli. Foraggio, ortaggi e grano tenero coltivati in masseria.",
    imgGradient:
      "radial-gradient(ellipse at 60% 55%, #6b7340 0%, #3d2a1e 55%, #1a1210 100%)",
  },
  {
    ghost: "4",
    chapter: "III — La filiera",
    title: <>Quattro mestieri, una sola masseria</>,
    text:
      "Allevamento. Caseificio. Macelleria. Braceria. Ogni anello nasce qui dentro. Il latte di oggi è la mozzarella di domani. Il vitello di primavera è la tavola di settembre.",
    imgGradient:
      "radial-gradient(ellipse at 50% 50%, #6b7340 0%, #3d2a1e 55%, #1a1210 100%)",
  },
  {
    ghost: "OGGI",
    chapter: "IV — La tavola",
    title: <>Ogni sera</>,
    text:
      "Scegli la carne al banco. Ti siedi. Te la portano cotta sulla brace a carboni. Niente arriva da fuori. Dalla terra alla tavola, ogni sera, a Noci.",
    cue: "scorri →",
    imgGradient:
      "radial-gradient(ellipse at 45% 60%, #c49a4a 0%, #6b4a2a 40%, #1a1210 100%)",
  },
];

export function LaStoria() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { motion } = ctx.conditions as { motion: boolean; reduced: boolean };
        if (!motion) return;

        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);
        const getDistance = () => track.scrollWidth - window.innerWidth;

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        panels.forEach((p) => {
          const ghost = p.querySelector<HTMLElement>("[data-ghost]");
          const photo = p.querySelector<HTMLElement>("[data-photo]");
          if (ghost) {
            gsap.fromTo(
              ghost,
              { xPercent: 15 },
              {
                xPercent: -15,
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
          if (photo) {
            gsap.fromTo(
              photo,
              { xPercent: 6 },
              {
                xPercent: -6,
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
        });

        panels.forEach((p, i) => {
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
      aria-labelledby="storia-title"
      className="relative overflow-hidden text-crema"
      style={{ backgroundColor: "var(--carbone)" }}
    >
      {/* Marker + intro (visible before pin engages) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto max-w-[1400px] px-6 pt-[6svh] md:px-12">
        <p
          className="text-[0.7rem] uppercase"
          style={{
            fontFamily: "'Oswald', 'Inter', sans-serif",
            letterSpacing: "0.32em",
            color: "color-mix(in oklab, var(--crema) 40%, transparent)",
          }}
        >
          02 — La Storia
        </p>
        <h2
          id="storia-title"
          className="mt-4 max-w-[18ch]"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            fontSize: "clamp(1.75rem, 3.6vw, 3.6rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
          }}
        >
          Dal <em style={{ fontStyle: "italic", color: "var(--oro)" }}>Cinquecento</em> a oggi
        </h2>
        <p
          className="mt-3 max-w-[38ch] text-sm md:text-base"
          style={{
            fontFamily: "'Inter', sans-serif",
            color: "color-mix(in oklab, var(--crema) 65%, transparent)",
          }}
        >
          Dove la terra nutre la bestia, la bestia nutre la tavola.
        </p>
      </div>

      {/* Horizontal pinned track (desktop + mobile) */}
      <div className="relative h-[100dvh] w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full w-max will-change-transform"
        >
          {PANELS.map((p, i) => (
            <article
              key={i}
              data-panel
              className="relative flex h-[100dvh] w-[100vw] shrink-0 items-center overflow-hidden box-border"
              style={{ background: p.imgGradient }}
            >
              {/* Ghost year */}
              <span
                data-ghost
                aria-hidden
                className="pointer-events-none absolute inset-0 flex select-none items-center justify-center will-change-transform"
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontWeight: 300,
                  fontSize: "clamp(9rem, 40vw, 46rem)",
                  lineHeight: 0.85,
                  letterSpacing: "-0.05em",
                  color: "color-mix(in oklab, var(--crema) 6%, transparent)",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                }}
              >
                {p.ghost}
              </span>

              {/* Photo placeholder */}
              <div
                data-photo
                className="absolute inset-0 will-change-transform"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 20%, rgba(196,154,74,0.08), transparent 60%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.35), transparent 55%)",
                  mixBlendMode: "overlay",
                  opacity: 0.7,
                }}
              />
              {/* Vignette */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, rgba(26,18,16,0) 30%, rgba(26,18,16,0) 70%, rgba(26,18,16,0.75) 100%)",
                }}
              />

              {/* Content */}
              <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-start px-5 md:px-16">
                <p
                  className="mb-4 md:mb-6 text-[0.7rem] uppercase"
                  style={{
                    fontFamily: "'Oswald', 'Inter', sans-serif",
                    letterSpacing: "0.34em",
                    color: "color-mix(in oklab, var(--crema) 55%, transparent)",
                  }}
                >
                  {p.chapter}
                </p>
                <h3
                  className="max-w-[16ch]"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 300,
                    fontSize: "clamp(1.8rem, 8vw, 5.6rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    color: "var(--crema)",
                    overflowWrap: "break-word",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="mt-5 md:mt-8 max-w-[46ch]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(1rem, 4vw, 1.15rem)",
                    lineHeight: 1.6,
                    color: "color-mix(in oklab, var(--crema) 82%, transparent)",
                  }}
                >
                  {p.text}
                </p>
                {p.cue && (
                  <p
                    className="mt-10 uppercase"
                    style={{
                      fontFamily: "'Oswald', 'Inter', sans-serif",
                      fontSize: "0.85rem",
                      letterSpacing: "0.3em",
                      color: "var(--oro)",
                    }}
                  >
                    {p.cue}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Counter */}
        <div
          className="pointer-events-none absolute left-5 z-20 md:left-12"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 3svh)" }}
          aria-hidden
        >
          <p
            className="uppercase"
            style={{
              fontFamily: "'Oswald', 'Inter', sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.32em",
              color: "color-mix(in oklab, var(--crema) 55%, transparent)",
            }}
          >
            <span style={{ color: "var(--crema)" }}>
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="mx-2" style={{ color: "color-mix(in oklab, var(--crema) 25%, transparent)" }}>
              /
            </span>
            {String(PANELS.length).padStart(2, "0")}
          </p>
        </div>

        {/* scroll cue */}
        <div
          className="pointer-events-none absolute right-5 z-20 md:right-12"
          style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 3svh)" }}
          aria-hidden
        >
          <p
            className="uppercase"
            style={{
              fontFamily: "'Oswald', 'Inter', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.4em",
              color: "color-mix(in oklab, var(--crema) 40%, transparent)",
            }}
          >
            scorri →
          </p>
        </div>
      </div>
    </section>
  );
}

export default LaStoria;
