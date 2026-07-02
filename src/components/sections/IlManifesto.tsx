import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const QUOTE_LINES = [
  "C'è un posto tra gli ulivi di Noci",
  "dove la terra alleva le bestie,",
  "le bestie danno il latte,",
  "il latte diventa formaggi,",
  "la carne si sceglie al banco",
  "e finisce sulla tavola.",
  "Tutto qui.",
  "Niente arriva da fuori.",
];

const MARQUEE_ITEMS = [
  "ALLEVAMENTO",
  "CASEIFICIO",
  "MACELLERIA",
  "BRACERIA",
  "MASSERIA DEL '500",
  "KM 0",
  "NOCI · PUGLIA",
];

export function IlManifesto() {
  const rootRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const quote = quoteRef.current;
    if (!root || !quote) return;

    const words = Array.from(quote.querySelectorAll<HTMLElement>("[data-word]"));
    if (!words.length) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { motion, reduced } = ctx.conditions as { motion: boolean; reduced: boolean };

        if (reduced) {
          gsap.set(words, { color: "var(--crema)", opacity: 1, scale: 1 });
          return;
        }

        if (!motion) return;

        // Initial dim state
        gsap.set(words, {
          color: "color-mix(in oklab, var(--marrone) 85%, var(--carbone))",
          opacity: 0.28,
          scale: 1,
          transformOrigin: "50% 50%",
        });

        // Per-word tween tied to whether it's in the central reading band (40-60% vh)
        const tweens = words.map((w) =>
          gsap.to(w, {
            color: "var(--crema)",
            opacity: 1,
            scale: 1.02,
            duration: 0.35,
            ease: "power2.out",
            paused: true,
          })
        );

        const update = () => {
          const vh = window.innerHeight;
          const bandTop = vh * 0.4;
          const bandBottom = vh * 0.6;
          words.forEach((w, i) => {
            const r = w.getBoundingClientRect();
            const mid = r.top + r.height / 2;
            const lit = mid <= bandBottom;
            const active = mid >= bandTop && mid <= bandBottom;
            const t = tweens[i];
            if (lit) {
              t.play();
              gsap.to(w, {
                scale: active ? 1.02 : 1,
                duration: 0.25,
                ease: "power2.out",
                overwrite: "auto",
              });
            } else {
              t.reverse();
            }
          });
        };

        const st = ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onUpdate: update,
          invalidateOnRefresh: true,
        });

        update();

        return () => {
          st.kill();
          tweens.forEach((t) => t.kill());
        };
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
      aria-labelledby="manifesto-title"
      className="relative overflow-hidden text-crema"
      style={{ backgroundColor: "var(--carbone)" }}
    >
      {/* Marker */}
      <div className="mx-auto max-w-[1400px] px-6 pt-[14svh] md:px-12">
        <p
          className="text-[0.7rem] uppercase"
          style={{
            fontFamily: "'Oswald', 'Inter', sans-serif",
            letterSpacing: "0.32em",
            color: "color-mix(in oklab, var(--crema) 40%, transparent)",
          }}
        >
          01 — Il Manifesto
        </p>
      </div>

      {/* Quote */}
      <div className="mx-auto max-w-[1400px] px-6 py-[18svh] md:px-12">
        <h2 id="manifesto-title" className="sr-only">
          Il Manifesto — Masseria Don Gianvito
        </h2>
        <blockquote
          ref={quoteRef}
          className="relative"
          style={{
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(2rem, 5.2vw, 5.4rem)",
            lineHeight: 1.22,
            letterSpacing: "-0.015em",
          }}
        >
          {QUOTE_LINES.map((line, li) => (
            <p key={li} className="block">
              {line.split(" ").map((w, wi) => (
                <span key={wi} className="inline-block will-change-transform">
                  <span data-word className="inline-block will-change-transform">
                    {w}
                  </span>
                  {"\u00A0"}
                </span>
              ))}
            </p>
          ))}
        </blockquote>

        {/* Signature */}
        <p
          className="mt-[10svh] text-right"
          style={{
            fontFamily: "'Oswald', 'Inter', sans-serif",
            fontSize: "0.85rem",
            letterSpacing: "0.28em",
            color: "var(--oro)",
          }}
        >
          — MASSERIA DON GIANVITO, NOCI
        </p>
      </div>

      {/* Marquee */}
      <div
        className="relative border-y py-6"
        style={{ borderColor: "color-mix(in oklab, var(--crema) 8%, transparent)" }}
        aria-hidden
      >
        <Marquee direction="left" />
        <div className="h-4" />
        <Marquee direction="right" />
      </div>

      <style>{`
        @keyframes mdg-marquee-l {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes mdg-marquee-r {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .mdg-marquee-track {
          display: inline-flex;
          gap: 3rem;
          padding-right: 3rem;
          animation-duration: 45s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .mdg-marquee-track.left  { animation-name: mdg-marquee-l; }
        .mdg-marquee-track.right { animation-name: mdg-marquee-r; }
        .mdg-marquee:hover .mdg-marquee-track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .mdg-marquee-track { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

function Marquee({ direction }: { direction: "left" | "right" }) {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="mdg-marquee overflow-hidden whitespace-nowrap">
      <div className={`mdg-marquee-track ${direction}`}>
        {items.map((it, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-12 uppercase"
            style={{
              fontFamily: "'Oswald', 'Inter', sans-serif",
              fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)",
              letterSpacing: "0.35em",
              color: "color-mix(in oklab, var(--crema) 30%, transparent)",
            }}
          >
            {it}
            <span style={{ color: "var(--oro)", opacity: 0.6 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default IlManifesto;
