import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * FOOTER — Taccuino che chiude il racconto.
 * Filo d'oro orizzontale che completa il cerchio.
 * ───────────────────────────────────────────────────────────── */

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const closingRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cols = root.querySelectorAll<HTMLElement>("[data-footer-col]");
      gsap.set(cols, { autoAlpha: 0, y: 20 });
      gsap.set(closingRef.current, { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" });
      if (threadRef.current) {
        threadRef.current.style.strokeDasharray = "1";
        threadRef.current.style.strokeDashoffset = "1";
      }

      ScrollTrigger.create({
        trigger: root,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(cols, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.1,
            ease: "power2.out",
          });
          if (threadRef.current) {
            gsap.to(threadRef.current, {
              strokeDashoffset: 0,
              duration: 1.8,
              ease: "power2.inOut",
            });
          }
          gsap.to(closingRef.current, {
            autoAlpha: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 1.2,
            delay: 0.6,
            ease: "cubic-bezier(.16,1,.3,1)",
          });
        },
      });

      // Fallback 3s
      const safety = window.setTimeout(() => {
        gsap.set(cols, { autoAlpha: 1, y: 0, clearProps: "clipPath" });
        gsap.set(closingRef.current, { autoAlpha: 1, clipPath: "none" });
        if (threadRef.current) threadRef.current.style.strokeDashoffset = "0";
      }, 3000);
      return () => window.clearTimeout(safety);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <footer
      ref={rootRef}
      className="relative mt-0 border-t border-[color:var(--oro)]/30 bg-[#12100E]"
    >
      {/* Filo d'oro orizzontale */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-8 z-0 h-[1px] w-full"
        viewBox="0 0 1000 1"
        preserveAspectRatio="none"
      >
        <path
          ref={threadRef}
          d="M0 0.5 L1000 0.5"
          stroke="var(--oro)"
          strokeWidth="1"
          opacity="0.22"
          pathLength={1}
        />
      </svg>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 py-20 md:grid-cols-4 lg:py-24">
        {/* Logo lockup */}
        <div data-footer-col className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--oro)]/60 font-display text-sm text-[color:var(--oro)]">
              DG
            </span>
            <div className="leading-tight">
              <p className="font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--oro)]">
                Masseria
              </p>
              <p className="font-display text-lg text-[color:var(--crema)]">
                Don Gianvito
              </p>
            </div>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-[color:var(--crema)]/50">
            Braceria, macelleria e azienda agricola a filiera propria nella Murgia.
          </p>
        </div>

        {/* Contatti */}
        <div data-footer-col className="space-y-3">
          <p className="font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--oro)]">
            Contatti
          </p>
          <address className="text-sm not-italic leading-relaxed text-[color:var(--crema)]/80">
            SP237 ex SS377 per Mottola km 6,5
            <br />
            Zona C 76, 70015 Noci (BA)
          </address>
          <p className="font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--crema)]/40">
            40.642° N — 17.042° E
          </p>
          <ul className="space-y-1 pt-2 text-sm text-[color:var(--crema)]/80">
            <li>
              <a
                href="tel:+393339395750"
                className="transition-colors hover:text-[color:var(--terracotta)]"
              >
                333 939 5750
              </a>
            </li>
            <li>
              <a
                href="tel:+393333870292"
                className="transition-colors hover:text-[color:var(--terracotta)]"
              >
                333 387 0292
              </a>
            </li>
          </ul>
        </div>

        {/* Orari */}
        <div data-footer-col className="space-y-3">
          <p className="font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--oro)]">
            Orari
          </p>
          <ul className="space-y-1.5 text-sm text-[color:var(--crema)]/80">
            <li>Mercoledì–Sabato · Cena</li>
            <li>Domenica e festivi · Pranzo</li>
            <li className="text-[color:var(--crema)]/45">
              Chiuso: lunedì e martedì
            </li>
          </ul>
        </div>

        {/* Social */}
        <div data-footer-col className="space-y-3">
          <p className="font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--oro)]">
            Social
          </p>
          <ul className="space-y-1.5 text-sm text-[color:var(--crema)]/80">
            <li>
              <a
                href="https://facebook.com/masseriadongianvito"
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors hover:text-[color:var(--terracotta)]"
              >
                facebook.com/masseriadongianvito
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/masseria_don_gianvito"
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors hover:text-[color:var(--terracotta)]"
              >
                @masseria_don_gianvito
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Frase di chiusura */}
      <div className="relative z-10 px-6 pb-6 text-center">
        <p
          ref={closingRef}
          className="font-display text-sm italic text-[color:var(--oro)] md:text-base"
        >
          Dalla terra alla brace. Ogni sera, a Noci.
        </p>
      </div>

      {/* P.IVA + copyright */}
      <div className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 font-eyebrow text-[10px] uppercase tracking-[0.25em] text-[color:var(--crema)]/30 md:flex-row md:items-center">
          <span>P.IVA 05839280723</span>
          <span>© 2024 Masseria Don Gianvito · Tutti i diritti riservati</span>
        </div>
      </div>
    </footer>
  );
}
