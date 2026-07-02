import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * FOOTER — Taccuino di giorno. Terra e pietra. Su --crema.
 * Marchio + contatti + social + P.IVA + credits. Chiude il cerchio.
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
      const rightItems = root.querySelectorAll<HTMLElement>("[data-foot-item]");
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
            duration: 0.7,
            stagger: 0.06,
            ease: "power2.out",
            delay: 0.25,
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
      className="relative"
      style={{
        backgroundColor: "var(--crema)",
        borderTop:
          "1px solid color-mix(in oklab, var(--marrone) 15%, transparent)",
      }}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-10 md:gap-10">
          {/* SINISTRA 40% — marchio + frase */}
          <div ref={leftRef} className="md:col-span-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--marrone)]/60 font-display text-[11px] text-[color:var(--marrone)]">
                DG
              </span>
              <div className="leading-tight">
                <p className="font-display text-lg text-[color:var(--marrone)]">
                  Masseria
                </p>
                <p className="font-eyebrow text-[11px] uppercase tracking-[0.34em] text-[color:var(--marrone)]/80">
                  Don Gianvito
                </p>
              </div>
            </div>
            <p className="mt-8 max-w-md font-display text-lg italic text-[color:var(--oro)] md:text-2xl">
              Dalla terra alla tavola. A Noci, dal 2002.
            </p>
          </div>

          {/* CENTRO 30% — contatti reali */}
          <ul className="space-y-3 md:col-span-3">
            <li data-foot-item>
              <a
                href="tel:+393339395750"
                className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60 transition-colors hover:text-[color:var(--marrone)]"
              >
                Tel · 333 939 5750
              </a>
            </li>
            <li data-foot-item>
              <a
                href="tel:+393333870292"
                className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60 transition-colors hover:text-[color:var(--marrone)]"
              >
                Tel · 333 387 0292
              </a>
            </li>
            <li
              data-foot-item
              className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60"
            >
              SP237 ex SS377 km 6,5
            </li>
            <li
              data-foot-item
              className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60"
            >
              70015 Noci (BA)
            </li>
            <li
              data-foot-item
              className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60"
            >
              P.IVA · 05839280723
            </li>
          </ul>

          {/* DESTRA 30% — social + credits */}
          <ul className="space-y-3 md:col-span-3 md:justify-self-end md:text-right">
            <li data-foot-item>
              <a
                href="https://facebook.com/masseriadongianvito"
                target="_blank"
                rel="noreferrer noopener"
                className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60 transition-colors hover:text-[color:var(--marrone)]"
              >
                Facebook ↗
              </a>
            </li>
            <li data-foot-item>
              <a
                href="https://instagram.com/masseria_don_gianvito"
                target="_blank"
                rel="noreferrer noopener"
                className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60 transition-colors hover:text-[color:var(--marrone)]"
              >
                Instagram ↗
              </a>
            </li>
            <li data-foot-item>
              <a
                href="https://www.tripadvisor.it/Restaurant_Review-Masseria-Don-Gianvito"
                target="_blank"
                rel="noreferrer noopener"
                className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60 transition-colors hover:text-[color:var(--marrone)]"
              >
                Tripadvisor ↗ · 4.3
              </a>
            </li>
            <li data-foot-item className="pt-4">
              <a
                href="https://lovable.dev"
                target="_blank"
                rel="noreferrer noopener"
                className="font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/40 transition-colors hover:text-[color:var(--marrone)]/70"
              >
                Credits ↗
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Fondo + filo d'oro */}
      <div
        className="relative z-10"
        style={{
          borderTop:
            "1px solid color-mix(in oklab, var(--marrone) 12%, transparent)",
        }}
      >
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px] w-full"
          viewBox="0 0 1000 1"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="footThread" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--marrone)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--oro)" stopOpacity="0.6" />
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

        <div className="mx-auto w-full max-w-7xl px-6 py-6 md:px-10">
          <p className="text-center font-eyebrow text-[10px] uppercase tracking-[0.32em] text-[color:var(--marrone)]/25">
            © 2024 · Masseria Don Gianvito · Noci (BA) · Puglia
          </p>
        </div>
      </div>
    </footer>
  );
}
