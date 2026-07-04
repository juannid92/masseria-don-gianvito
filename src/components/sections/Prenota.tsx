import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * PRENOTA — Terra & Pietra. Alba lenta --marrone → --crema.
 * Orari completi + Mappa embedded + CTA + Indirizzo/GPS/Distanze.
 * Nessuna brace, nessuna scintilla, nessun glow.
 * ───────────────────────────────────────────────────────────── */

const WHATSAPP = "https://wa.me/393339395750";
const MAPS = "https://www.google.com/maps?q=40.642739,17.042600";
const MAPS_EMBED =
  "https://www.google.com/maps?q=40.642739,17.042600&z=15&output=embed";

const ORARI: Array<{ giorno: string; stato: string; chiuso?: boolean }> = [
  { giorno: "Mercoledì", stato: "Cena" },
  { giorno: "Giovedì", stato: "Cena" },
  { giorno: "Venerdì", stato: "Cena" },
  { giorno: "Sabato", stato: "Cena" },
  { giorno: "Domenica", stato: "Pranzo" },
  { giorno: "Festivi", stato: "Pranzo" },
  { giorno: "Lunedì", stato: "Chiuso", chiuso: true },
  { giorno: "Martedì", stato: "Chiuso", chiuso: true },
];

const MARGINALIA = [
  "SP237 EX SS377 PER MOTTOLA KM 6,5",
  "ZONA C 76 · 70015 NOCI (BA)",
  "40.642° N — 17.042° E",
];

export function Prenota() {
  const rootRef = useRef<HTMLElement>(null);
  const dawnRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ALBA scrub
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "center center",
        scrub: 0.6,
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

      mm.add("(min-width: 768px)", () => {
        // Orari stagger
        ScrollTrigger.create({
          trigger: root,
          start: "top 60%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              root.querySelectorAll<HTMLElement>("[data-orari-row]"),
              { autoAlpha: 0, y: 10 },
              { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" }
            );
            gsap.fromTo(
              root.querySelectorAll<HTMLElement>("[data-marginalia]"),
              { autoAlpha: 0, y: 12 },
              { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", delay: 0.2 }
            );
            if (mapRef.current) {
              gsap.fromTo(
                mapRef.current,
                { autoAlpha: 0, scale: 0.95 },
                { autoAlpha: 1, scale: 1, duration: 1.1, ease: "power2.out" }
              );
            }
          },
        });
      });

      mm.add("(max-width: 767px)", () => {
        ScrollTrigger.create({
          trigger: root,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(
              root.querySelectorAll<HTMLElement>(
                "[data-orari-row], [data-marginalia]"
              ),
              { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.04 }
            );
            if (mapRef.current)
              gsap.to(mapRef.current, { autoAlpha: 1, duration: 0.6 });
          },
        });
      });

      const safety = window.setTimeout(() => {
        if (titleRef.current) titleRef.current.style.clipPath = "inset(0 0 0 0)";
        gsap.set(
          root.querySelectorAll<HTMLElement>(
            "[data-orari-row], [data-marginalia]"
          ),
          { autoAlpha: 1, y: 0 }
        );
        if (mapRef.current) gsap.set(mapRef.current, { autoAlpha: 1, scale: 1 });
      }, 3000);
      return () => {
        window.clearTimeout(safety);
        mm.revert();
      };
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
      {/* Alba */}
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

      {/* Filo d'oro */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-[1px] w-full"
        viewBox="0 0 1000 1"
        preserveAspectRatio="none"
      >
        <path
          ref={threadRef}
          d="M1000 0.5 L0 0.5"
          stroke="var(--oro)"
          strokeWidth="1"
          opacity="0.4"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={reduced ? 0 : 1}
        />
      </svg>

      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-28 md:px-10 md:py-36">
        {/* GRID ASIMMETRICO */}
        <div className="grid grid-cols-1 gap-16 md:grid-cols-100 md:gap-14">
          {/* SINISTRA 55% */}
          <div className="md:col-span-55">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60">
              07 — Vieni
            </p>

            <h2
              ref={titleRef}
              className="mt-8 font-display leading-[0.95] text-[color:var(--marrone)]"
              style={{
                fontSize: "clamp(2.8rem, 7vw, 6.5rem)",
                clipPath: reduced ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
              }}
            >
              Prenota un{" "}
              <em className="italic text-[color:var(--oro)]">tavolo</em>.
            </h2>

            <p className="mt-8 max-w-xl font-body text-base text-[color:var(--marrone)]/70 md:text-lg">
              Mercoledì–Sabato a cena. Domenica e festivi a pranzo.
            </p>

            {/* ORARI */}
            <div className="mt-12">
              <p className="mb-5 font-eyebrow text-[11px] uppercase tracking-[0.32em] text-[color:var(--marrone)]/60">
                Orari
              </p>
              <ul className="max-w-md">
                {ORARI.map((r, i) => (
                  <li
                    key={r.giorno}
                    data-orari-row
                    className="flex items-baseline justify-between py-3"
                    style={{
                      opacity: reduced ? 1 : 0,
                      borderTop:
                        i === 0
                          ? "1px solid color-mix(in oklab, var(--oro) 30%, transparent)"
                          : "none",
                      borderBottom:
                        "1px solid color-mix(in oklab, var(--oro) 20%, transparent)",
                    }}
                  >
                    <span
                      className="font-eyebrow text-[13px] uppercase tracking-[0.22em] text-[color:var(--marrone)]"
                      style={{ opacity: r.chiuso ? 0.4 : 1 }}
                    >
                      {r.giorno}
                    </span>
                    <span
                      className="font-body text-sm text-[color:var(--marrone)] md:text-base"
                      style={{
                        opacity: r.chiuso ? 0.4 : 0.85,
                        fontStyle: r.chiuso ? "italic" : "normal",
                      }}
                    >
                      {r.stato}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
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

          {/* DESTRA 45% */}
          <div className="md:col-span-45">
            <div
              ref={mapRef}
              className="relative w-full overflow-hidden"
              style={{
                opacity: reduced ? 1 : 0,
                borderRadius: 4,
                border:
                  "1px solid color-mix(in oklab, var(--marrone) 25%, transparent)",
              }}
            >
              <iframe
                title="Mappa Masseria Don Gianvito — Noci (BA)"
                src={MAPS_EMBED}
                width="100%"
                height="320"
                style={{
                  border: 0,
                  display: "block",
                  filter: "sepia(0.3) saturate(0.8)",
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <ul className="mt-8 space-y-3">
              {MARGINALIA.map((m) => (
                <li
                  key={m}
                  data-marginalia
                  className="font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/50"
                  style={{ opacity: reduced ? 1 : 0 }}
                >
                  {m}
                </li>
              ))}
              <li data-marginalia style={{ opacity: reduced ? 1 : 0 }}>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--oro)] transition-opacity hover:opacity-80"
                >
                  Apri in Google Maps →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* DISTANZE full-width */}
        <div
          className="mt-20 pt-8"
          style={{
            borderTop:
              "1px solid color-mix(in oklab, var(--oro) 20%, transparent)",
          }}
        >
          <p className="text-center font-eyebrow text-[10px] uppercase tracking-[0.32em] text-[color:var(--marrone)]/45 md:text-[11px]">
            Da Alberobello 15 min · Da Putignano 20 min · Da Martina Franca 25
            min · Dalla Valle d'Itria 30 min
          </p>
        </div>
      </div>

      <style>{`
        .md\\:grid-cols-100 { }
        @media (min-width: 768px) {
          .md\\:grid-cols-100 { grid-template-columns: 55fr 45fr; }
          .md\\:col-span-55 { grid-column: span 1; }
          .md\\:col-span-45 { grid-column: span 1; }
        }
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
