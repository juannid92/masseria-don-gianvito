import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * PRENOTA — Terra & Pietra.
 * Alba lenta --marrone → --crema. Nessuna brace, nessuna scintilla.
 * Titolo tipografico + CTA underline animato.
 * ───────────────────────────────────────────────────────────── */

const WHATSAPP = "https://wa.me/393339395750";
const MAPS = "https://www.google.com/maps?q=40.642739,17.042600";

export function Prenota() {
  const rootRef = useRef<HTMLElement>(null);
  const dawnRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ALBA: sfondo si schiarisce dal fondo su scroll
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "center center",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (dawnRef.current) dawnRef.current.style.opacity = String(p);
          if (titleRef.current) {
            const inset = Math.max(0, 100 - p * 140);
            titleRef.current.style.clipPath = `inset(${inset}% 0 0 0)`;
          }
          if (threadRef.current) {
            threadRef.current.style.strokeDashoffset = String(1 - p);
          }
        },
      });

      // Marginalia stagger reveal
      ScrollTrigger.create({
        trigger: root,
        start: "top 70%",
        once: true,
        onEnter: () => {
          const items = root.querySelectorAll<HTMLElement>("[data-marginalia]");
          gsap.fromTo(
            items,
            { autoAlpha: 0, y: 12 },
            { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power2.out" }
          );
        },
      });

      // Fallback 3s
      const safety = window.setTimeout(() => {
        if (titleRef.current) titleRef.current.style.clipPath = "inset(0 0 0 0)";
        const items = root.querySelectorAll<HTMLElement>("[data-marginalia]");
        gsap.set(items, { autoAlpha: 1, y: 0 });
      }, 3000);
      return () => window.clearTimeout(safety);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="Prenota un tavolo"
      className="relative isolate overflow-hidden"
      style={{ minHeight: "100vh", backgroundColor: "var(--marrone)" }}
    >
      {/* Alba: crema che sale dal fondo */}
      <div
        ref={dawnRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: reduced ? 1 : 0,
          background:
            "linear-gradient(to top, var(--crema) 0%, var(--crema) 35%, #d9c7a4 60%, #8a6a4a 82%, var(--marrone) 100%)",
        }}
      />

      {/* Filo d'oro orizzontale (dx→sx) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 z-10 h-[1px] w-full"
        viewBox="0 0 1000 1"
        preserveAspectRatio="none"
      >
        <path
          ref={threadRef}
          d="M1000 0.5 L0 0.5"
          stroke="var(--oro)"
          strokeWidth="1"
          opacity="0.5"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={reduced ? 0 : 1}
        />
      </svg>

      {/* Contenuto */}
      <div className="relative z-20 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-16 px-6 py-32 md:grid-cols-5 md:gap-10 md:px-10 md:py-40">
        {/* SINISTRA 60% */}
        <div className="md:col-span-3">
          <p className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60">
            07 — Vieni
          </p>

          <h2
            ref={titleRef}
            className="mt-8 font-display leading-[0.95] text-[color:var(--marrone)]"
            style={{
              fontSize: "clamp(2.8rem, 8vw, 7rem)",
              clipPath: reduced ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
            }}
          >
            Prenota un{" "}
            <em className="italic text-[color:var(--oro)]">tavolo</em>.
          </h2>

          <p className="mt-8 max-w-xl font-body text-base text-[color:var(--marrone)]/70 md:text-lg">
            Mercoledì–Sabato a cena. Domenica e festivi a pranzo.
          </p>

          <div className="mt-12 space-y-5">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer noopener"
              className="prenota-link group inline-block font-eyebrow text-[13px] uppercase tracking-[0.28em] text-[color:var(--marrone)] md:text-[15px]"
            >
              Scrivici su WhatsApp <span aria-hidden>→</span>
              <span className="prenota-underline" aria-hidden />
            </a>
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.28em] text-[color:var(--marrone)]/50">
              Oppure chiama:{" "}
              <a
                href="tel:+393339395750"
                className="transition-opacity hover:opacity-80"
              >
                333 939 5750
              </a>{" "}
              ·{" "}
              <a
                href="tel:+393333870292"
                className="transition-opacity hover:opacity-80"
              >
                333 387 0292
              </a>
            </p>
          </div>
        </div>

        {/* DESTRA 40% — marginalia taccuino */}
        <aside className="flex flex-col justify-end space-y-3 md:col-span-2 md:items-end md:text-right">
          <p
            data-marginalia
            className="font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/40"
          >
            SP237 per Mottola km 6,5
          </p>
          <p
            data-marginalia
            className="font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/40"
          >
            Zona C 76 · 70015 Noci (BA)
          </p>
          <p
            data-marginalia
            className="font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/40"
          >
            40.642° N — 17.042° E
          </p>
          <a
            data-marginalia
            href={MAPS}
            target="_blank"
            rel="noreferrer noopener"
            className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--oro)] transition-opacity hover:opacity-80"
          >
            Apri in mappa →
          </a>
        </aside>
      </div>

      <style>{`
        .prenota-link { position: relative; padding-bottom: 6px; }
        .prenota-underline {
          position: absolute; left: 0; bottom: 0; height: 1px; width: 0;
          background: var(--oro); transition: width .5s cubic-bezier(.16,1,.3,1);
        }
        .prenota-link:hover .prenota-underline,
        .prenota-link:focus-visible .prenota-underline { width: 100%; }
        @media (prefers-reduced-motion: reduce) {
          .prenota-underline { width: 100%; }
        }
      `}</style>
    </section>
  );
}
