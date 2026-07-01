import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * MANIFESTO — "LA FILIERA CHE SI CUCE"
 * Un filo d'oro entra dall'hero, cuce TERRA → LATTE → CARNE → BRACE
 * accendendole come brace, e chiude con la frase-manifesto.
 * Meccanismo-firma unico: cucitura tipografica scroll-driven.
 * ───────────────────────────────────────────────────────────── */

type Anchor = {
  id: "terra" | "latte" | "carne" | "brace";
  word: string;
  side: "left" | "right";
  /** posizione desktop in viewBox 1000x1800 (x,y del centro parola) */
  x: number;
  y: number;
  /** legame che segue (verso la prossima ancora) */
  link?: string;
};

const ANCHORS: Anchor[] = [
  { id: "terra", word: "TERRA", side: "left",  x: 240, y: 300,  link: "ciò che pascola" },
  { id: "latte", word: "LATTE", side: "right", x: 760, y: 720,  link: "ciò che nutre" },
  { id: "carne", word: "CARNE", side: "left",  x: 260, y: 1140, link: "ciò che cuoce" },
  { id: "brace", word: "BRACE", side: "right", x: 740, y: 1560 },
];

export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);
  const pathDesktopRef = useRef<SVGPathElement>(null);
  const pathMobileRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;

    if (reduced) {
      // parole già accese, filo già disegnato
      root.querySelectorAll<HTMLElement>("[data-anchor-word]").forEach((el) => {
        el.classList.add("is-lit");
      });
      root.querySelectorAll<HTMLElement>("[data-link-line], [data-manifesto-word]").forEach((el) => {
        el.style.opacity = "1";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const setupPath = (path: SVGPathElement | null) => {
        if (!path) return null;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        return len;
      };

      // stato iniziale: parole spente, righe/manifesto nascosti
      gsap.set(root.querySelectorAll("[data-anchor-word]"), { opacity: 0.14 });
      gsap.set(root.querySelectorAll("[data-link-line]"), { opacity: 0, y: 8 });
      gsap.set(root.querySelectorAll("[data-manifesto-word]"), { opacity: 0, y: 20 });

      const buildTL = (path: SVGPathElement | null) => {
        const len = setupPath(path);
        if (!path || !len) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=180%",
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 4 }, 0);

        // accende ogni ancora quando il filo la raggiunge (progressione lungo la timeline)
        const times = [0.6, 1.6, 2.6, 3.6];
        ANCHORS.forEach((a, i) => {
          const wordEl = root.querySelector(`[data-anchor-word="${a.id}"]`);
          const linkEl = root.querySelector(`[data-link-line="${a.id}"]`);
          if (wordEl) {
            tl.to(wordEl, { opacity: 1, duration: 0.25, onStart: () => wordEl.classList.add("is-lit") }, times[i]);
          }
          if (linkEl && a.link) {
            tl.to(linkEl, { opacity: 1, y: 0, duration: 0.3 }, times[i] + 0.15);
          }
        });

        // manifesto finale
        const manifestoWords = root.querySelectorAll("[data-manifesto-word]");
        tl.to(manifestoWords, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, 4.0);
      };

      mm.add("(min-width: 768px)", () => {
        buildTL(pathDesktopRef.current);
      });
      mm.add("(max-width: 767px)", () => {
        buildTL(pathMobileRef.current);
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // path desktop zig-zag tra le ancore
  const desktopPath = (() => {
    const [a, b, c, d] = ANCHORS;
    return `M 500 0
            C 500 120, ${a.x} 180, ${a.x} ${a.y}
            C ${a.x} ${a.y + 200}, ${b.x} ${b.y - 200}, ${b.x} ${b.y}
            C ${b.x} ${b.y + 200}, ${c.x} ${c.y - 200}, ${c.x} ${c.y}
            C ${c.x} ${c.y + 200}, ${d.x} ${d.y - 200}, ${d.x} ${d.y}
            C ${d.x} ${d.y + 160}, 500 ${d.y + 160}, 500 1800`;
  })();

  return (
    <section
      ref={rootRef}
      aria-label="Il giuramento — la filiera che si cuce"
      className="relative w-full overflow-hidden bg-[color:var(--carbone)] text-[color:var(--crema)]"
      style={{ minHeight: "100svh" }}
    >
      {/* rail marginalia */}
      <div className="pointer-events-none absolute left-3 top-6 z-10 hidden md:block">
        <p className="font-eyebrow text-[10px] text-[color:var(--oro)]/70 [writing-mode:vertical-rl] rotate-180">
          Il Giuramento · La Filiera
        </p>
      </div>
      <div className="pointer-events-none absolute right-4 top-6 z-10 md:hidden">
        <p className="font-eyebrow text-[9px] text-[color:var(--oro)]/70">Il Giuramento</p>
      </div>

      {/* grana sottile */}
      <div aria-hidden className="grain absolute inset-0 pointer-events-none" />

      {/* ─── DESKTOP: SVG a piena sezione con parole+filo ─── */}
      <div className="relative hidden md:block h-[100svh] w-full">
        <svg
          viewBox="0 0 1000 1800"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="oro-thread" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C49A4A" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#B33A1A" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#C49A4A" stopOpacity="0.9" />
            </linearGradient>
            <filter id="oro-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* filo d'oro */}
          <path
            ref={pathDesktopRef}
            d={desktopPath}
            fill="none"
            stroke="url(#oro-thread)"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#oro-glow)"
          />
        </svg>

        {/* parole-ancora in HTML posizionate in % (viewBox 1000x1800) */}
        {ANCHORS.map((a) => (
          <div
            key={a.id}
            className="absolute -translate-y-1/2"
            style={{
              left: `${(a.x / 1000) * 100}%`,
              top: `${(a.y / 1800) * 100}%`,
              transform: `translate(${a.side === "left" ? "-10%" : "-90%"}, -50%)`,
            }}
          >
            <span
              data-anchor-word={a.id}
              className="anchor-word font-display italic font-light leading-none text-[clamp(4rem,11vw,10rem)] tracking-tight"
            >
              {a.word}
            </span>
            {a.link && (
              <p
                data-link-line={a.id}
                className={`mt-3 max-w-[22ch] font-sans text-sm text-[color:var(--crema)]/70 ${
                  a.side === "left" ? "pl-1" : "pr-1 text-right"
                }`}
              >
                — {a.link}
              </p>
            )}
          </div>
        ))}

        {/* manifesto finale */}
        <div className="pointer-events-none absolute bottom-[6%] left-1/2 -translate-x-1/2 text-center">
          <p className="font-display italic text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.05] text-[color:var(--crema)]">
            <span data-manifesto-word className="inline-block">Dalla&nbsp;</span>
            <span data-manifesto-word className="inline-block">terra&nbsp;</span>
            <span data-manifesto-word className="inline-block">alla&nbsp;</span>
            <span data-manifesto-word className="inline-block text-[color:var(--terracotta)]">brace.</span>
          </p>
          <p className="mt-4 font-eyebrow text-[11px] md:text-xs tracking-[0.32em] text-[color:var(--oro)]">
            <span data-manifesto-word className="inline-block">Qui&nbsp;non&nbsp;arriva&nbsp;niente&nbsp;da&nbsp;fuori.</span>
          </p>
        </div>
      </div>

      {/* ─── MOBILE: colonna centrale con filo verticale ─── */}
      <div className="relative md:hidden w-full py-24">
        <svg
          viewBox="0 0 100 1200"
          preserveAspectRatio="none"
          className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2"
          aria-hidden
        >
          <path
            ref={pathMobileRef}
            d="M 50 0 L 50 1200"
            fill="none"
            stroke="#C49A4A"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.9"
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center gap-16 px-6">
          {ANCHORS.map((a) => (
            <div key={a.id} className="flex flex-col items-center text-center">
              <span
                data-anchor-word={a.id}
                className="anchor-word font-display italic font-light leading-none text-[clamp(3.5rem,18vw,6rem)]"
              >
                {a.word}
              </span>
              {a.link && (
                <p
                  data-link-line={a.id}
                  className="mt-3 max-w-[24ch] font-sans text-sm text-[color:var(--crema)]/70"
                >
                  — {a.link}
                </p>
              )}
            </div>
          ))}

          <div className="mt-8 text-center">
            <p className="font-display italic text-[clamp(1.6rem,7vw,2.4rem)] leading-tight text-[color:var(--crema)]">
              <span data-manifesto-word className="inline-block">Dalla&nbsp;</span>
              <span data-manifesto-word className="inline-block">terra&nbsp;</span>
              <span data-manifesto-word className="inline-block">alla&nbsp;</span>
              <span data-manifesto-word className="inline-block text-[color:var(--terracotta)]">brace.</span>
            </p>
            <p className="mt-4 font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--oro)]">
              <span data-manifesto-word className="inline-block">Qui non arriva niente da fuori.</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .anchor-word {
          color: color-mix(in oklab, var(--crema) 55%, transparent);
          transition: color 0.5s ease, text-shadow 0.5s ease, transform 0.5s ease;
          display: inline-block;
          will-change: transform, color;
        }
        .anchor-word.is-lit {
          color: var(--crema);
          text-shadow:
            0 0 18px color-mix(in oklab, var(--terracotta) 55%, transparent),
            0 0 44px color-mix(in oklab, var(--oro) 40%, transparent);
          transform: scale(1.02);
        }
        html.reduce-motion .anchor-word { color: var(--crema); }
      `}</style>
    </section>
  );
}
