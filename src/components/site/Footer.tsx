import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * FOOTER — Taccuino di giorno. Terra e pietra.
 * Sfondo --crema, testo --marrone. Filo d'oro chiude il cerchio.
 * ───────────────────────────────────────────────────────────── */

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const rightItems = root.querySelectorAll<HTMLElement>("[data-foot-right]");
      gsap.set(leftRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(rightItems, { autoAlpha: 0, y: 12 });
      if (threadRef.current) {
        threadRef.current.style.strokeDasharray = "1";
        threadRef.current.style.strokeDashoffset = "1";
      }

      ScrollTrigger.create({
        trigger: root,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(leftRef.current, {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.2,
            ease: "cubic-bezier(.16,1,.3,1)",
          });
          gsap.to(rightItems, {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.3,
          });
          if (threadRef.current) {
            gsap.to(threadRef.current, {
              strokeDashoffset: 0,
              duration: 1.8,
              ease: "power2.inOut",
            });
          }
        },
      });

      const safety = window.setTimeout(() => {
        gsap.set(leftRef.current, { clipPath: "inset(0 0 0 0)" });
        gsap.set(rightItems, { autoAlpha: 1, y: 0 });
        if (threadRef.current) threadRef.current.style.strokeDashoffset = "0";
      }, 3000);
      return () => window.clearTimeout(safety);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <footer
      ref={rootRef}
      className="relative border-t border-[color:var(--marrone)]/20"
      style={{ backgroundColor: "var(--crema)" }}
    >
      {/* Filo d'oro orizzontale — chiude il cerchio */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[1px] w-full"
        viewBox="0 0 1000 1"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="footThread" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--marrone)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--oro)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path
          ref={threadRef}
          d="M0 0.5 L1000 0.5"
          stroke="url(#footThread)"
          strokeWidth="1"
          pathLength={1}
        />
      </svg>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-14 px-6 py-20 md:grid-cols-5 md:gap-10 md:px-10 md:py-24">
        {/* SINISTRA 60% */}
        <div ref={leftRef} className="md:col-span-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--marrone)]/60 font-display text-sm text-[color:var(--marrone)]">
              DG
            </span>
            <div className="leading-tight">
              <p className="font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60">
                Masseria
              </p>
              <p className="font-display text-xl text-[color:var(--marrone)]">
                Don Gianvito
              </p>
            </div>
          </div>
          <p className="mt-8 max-w-lg font-display text-lg italic text-[color:var(--oro)] md:text-2xl">
            Dalla terra alla tavola. A Noci, dal 2002.
          </p>
          <address className="mt-6 max-w-md text-sm not-italic leading-relaxed text-[color:var(--marrone)]/70">
            SP237 ex SS377 per Mottola km 6,5 — Zona C 76, 70015 Noci (BA)
          </address>
        </div>

        {/* DESTRA 40% — lista tipografica */}
        <ul className="space-y-3 md:col-span-2 md:justify-self-end md:text-right">
          <li data-foot-right>
            <a
              href="https://facebook.com/masseriadongianvito"
              target="_blank"
              rel="noreferrer noopener"
              className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/50 transition-colors hover:text-[color:var(--marrone)]"
            >
              Facebook / masseriadongianvito
            </a>
          </li>
          <li data-foot-right>
            <a
              href="https://instagram.com/masseria_don_gianvito"
              target="_blank"
              rel="noreferrer noopener"
              className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/50 transition-colors hover:text-[color:var(--marrone)]"
            >
              Instagram / @masseria_don_gianvito
            </a>
          </li>
          <li data-foot-right>
            <a
              href="tel:+393339395750"
              className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/50 transition-colors hover:text-[color:var(--marrone)]"
            >
              Tel / 333 939 5750
            </a>
          </li>
          <li data-foot-right>
            <span className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/50">
              P.IVA / 05839280723
            </span>
          </li>
        </ul>
      </div>

      <div className="relative z-10 border-t border-[color:var(--marrone)]/15">
        <div className="mx-auto w-full max-w-7xl px-6 py-6 text-center md:px-10 md:text-left">
          <p className="font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/30">
            © 2024 · Masseria Don Gianvito · Noci (BA) · Puglia
          </p>
        </div>
      </div>
    </footer>
  );
}
