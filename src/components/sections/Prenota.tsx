import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * 07 · PRENOTA — "La strada finisce a tavola"
 * Composizione asimmetrica: titolo, orari, mappa editoriale.
 * Handoff dal carbone di La Voce → terra/pietra/crema.
 * Nessun pin. Nessun Lenis. Nessun orario numerico inventato.
 * ───────────────────────────────────────────────────────────── */

const TEL_PRIMARY = "+393339395750";
const TEL_PRIMARY_DISPLAY = "333 939 5750";
const WA_TEXT = encodeURIComponent(
  "Buonasera, vorrei prenotare un tavolo a Masseria Don Gianvito."
);
const WA_URL = `https://wa.me/393339395750?text=${WA_TEXT}`;
const MAPS_URL = "https://www.google.com/maps?q=40.642739,17.042600";
const MAPS_EMBED =
  "https://www.google.com/maps?q=40.642739,17.042600&z=15&output=embed";

type Servizio = "Chiuso" | "Cena" | "Pranzo";
const ORARI: Array<{ giorno: string; servizio: Servizio; jsDay: number }> = [
  { giorno: "Lunedì", servizio: "Chiuso", jsDay: 1 },
  { giorno: "Martedì", servizio: "Chiuso", jsDay: 2 },
  { giorno: "Mercoledì", servizio: "Cena", jsDay: 3 },
  { giorno: "Giovedì", servizio: "Cena", jsDay: 4 },
  { giorno: "Venerdì", servizio: "Cena", jsDay: 5 },
  { giorno: "Sabato", servizio: "Cena", jsDay: 6 },
  { giorno: "Domenica e festivi", servizio: "Pranzo", jsDay: 0 },
];

function useOggi(): number | null {
  const [day, setDay] = useState<number | null>(null);
  useEffect(() => {
    try {
      const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Rome",
        weekday: "short",
      });
      const map: Record<string, number> = {
        Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
      };
      setDay(map[fmt.format(new Date())] ?? new Date().getDay());
    } catch {
      setDay(new Date().getDay());
    }
  }, []);
  return day;
}

export function Prenota() {
  const rootRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const orariRef = useRef<HTMLDListElement>(null);
  const mapWinRef = useRef<HTMLDivElement>(null);
  const addrRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const oggi = useOggi();

  const oggiIndex = useMemo(() => {
    if (oggi === null) return -1;
    return ORARI.findIndex((r) => r.jsDay === oggi);
  }, [oggi]);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const rows = orariRef.current?.querySelectorAll<HTMLElement>("[data-row]") ?? [];
      gsap.set(eyebrowRef.current, { autoAlpha: 0, y: 10 });
      if (titleRef.current) titleRef.current.style.clipPath = "inset(100% 0 0 0)";
      gsap.set(textRef.current, { autoAlpha: 0, y: 12 });
      gsap.set(ctaRef.current, { autoAlpha: 0, y: 12 });
      gsap.set(rows, { autoAlpha: 0, y: 8 });
      if (mapWinRef.current) mapWinRef.current.style.clipPath = "inset(0 0 100% 0)";
      gsap.set(addrRef.current, { autoAlpha: 0, y: 8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power2.out" },
      });

      tl.to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.5 })
        .to(titleRef.current, {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.0,
          ease: "cubic-bezier(.16,1,.3,1)",
        }, "-=0.2")
        .to(textRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, "-=0.4")
        .to(ctaRef.current, { autoAlpha: 1, y: 0, duration: 0.55 }, "-=0.35")
        .to(rows, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05 }, "-=0.3")
        .to(mapWinRef.current, {
          clipPath: "inset(0% 0 0% 0)",
          duration: 0.9,
          ease: "cubic-bezier(.16,1,.3,1)",
        }, "-=0.5")
        .to(addrRef.current, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.5");

      const safety = window.setTimeout(() => {
        gsap.set([eyebrowRef.current, textRef.current, ctaRef.current, addrRef.current, ...Array.from(rows)], {
          autoAlpha: 1, y: 0,
        });
        if (titleRef.current) titleRef.current.style.clipPath = "inset(0 0 0 0)";
        if (mapWinRef.current) mapWinRef.current.style.clipPath = "inset(0 0 0 0)";
      }, 2500);
      return () => window.clearTimeout(safety);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="prenota"
      ref={rootRef}
      aria-labelledby="prenota-title"
      className="prenota relative isolate overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--carbone) 0%, #201a15 22%, var(--marrone) 55%, #b89a72 82%, var(--crema) 100%)",
      }}
    >
      {/* linea topografica sottile */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[42%] z-0 h-[1px] w-full opacity-30"
        viewBox="0 0 1000 1"
        preserveAspectRatio="none"
      >
        <path d="M0 0.5 L1000 0.5" stroke="var(--oro)" strokeWidth="0.5" />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-6 pt-28 pb-24 md:px-12 md:pt-40 md:pb-32">
        {/* GRID asimmetrica */}
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-x-10 md:gap-y-20">
          {/* ── PRINCIPALE ── */}
          <div className="md:col-span-7 md:pr-6">
            <p
              ref={eyebrowRef}
              className="font-eyebrow text-[11px] uppercase tracking-[0.34em] text-[color:var(--crema)]/55"
            >
              07 — Prenota
            </p>
            <h2
              id="prenota-title"
              ref={titleRef}
              className="mt-6 font-display leading-[0.92] text-[color:var(--crema)]"
              style={{
                fontSize: "clamp(3.4rem, 7vw, 8rem)",
                clipPath: reduced ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
              }}
            >
              Prendi posto<br />
              <span className="italic text-[color:var(--oro)]">alla Masseria.</span>
            </h2>

            <div
              ref={textRef}
              className="mt-8 max-w-[46ch] space-y-3"
              style={{ opacity: reduced ? 1 : 0 }}
            >
              <p className="font-display text-lg leading-snug text-[color:var(--crema)]/85 md:text-xl">
                La sera dal mercoledì al sabato.<br />
                La domenica e nei giorni festivi a pranzo.
              </p>
              <p className="font-body text-sm text-[color:var(--crema)]/60 md:text-base">
                Per prenotare, scrivici su WhatsApp o chiamaci direttamente.
              </p>
            </div>

            <div
              ref={ctaRef}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-stretch"
              style={{ opacity: reduced ? 1 : 0 }}
            >
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Prenota un tavolo su WhatsApp al ${TEL_PRIMARY_DISPLAY}`}
                className="cta-primary group inline-flex min-h-[54px] items-center justify-center gap-3 px-7 font-eyebrow text-[12px] uppercase tracking-[0.28em] md:text-[13px]"
              >
                <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.7.9 3.7 1.5 5.8 1.5 6.6 0 12-5.4 12-12 0-3.2-1.3-6.2-3.5-8.4Zm-8.5 18.4c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-3.7 1 1-3.6-.2-.4a10 10 0 0 1-1.5-5.2C1.9 6.4 6.4 1.9 12 1.9s10.1 4.5 10.1 10.1S17.6 22 12 22Zm5.5-7.5c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2c-.2.3-.8 1-1 1.2-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.5-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.2-.5 0-.2 0-.4-.1-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.2 0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.8 3 .7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.4Z"/>
                </svg>
                <span>Prenota su WhatsApp</span>
                <span aria-hidden className="cta-arrow">→</span>
              </a>
              <a
                href={`tel:${TEL_PRIMARY}`}
                aria-label={`Chiama la Masseria al ${TEL_PRIMARY_DISPLAY}`}
                className="cta-secondary group inline-flex min-h-[54px] flex-col items-center justify-center gap-0.5 px-7 font-eyebrow text-[11px] uppercase tracking-[0.28em]"
              >
                <span>Chiama ora</span>
                <span className="font-display text-sm normal-case tracking-normal">{TEL_PRIMARY_DISPLAY}</span>
              </a>
            </div>

            <p className="mt-6 max-w-[46ch] font-body text-[13px] italic leading-relaxed text-[color:var(--crema)]/50">
              Per gruppi, ricorrenze e giorni festivi, contattaci direttamente.
            </p>
          </div>

          {/* ── ORARI ── */}
          <aside className="md:col-span-5 md:pl-4">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.34em] text-[color:var(--crema)]/55">
              Orari
            </p>
            <dl
              ref={orariRef}
              className="mt-6 divide-y divide-[color:var(--crema)]/12"
              style={{ borderTop: "1px solid color-mix(in oklab, var(--crema) 18%, transparent)" }}
            >
              {ORARI.map((r, i) => {
                const isToday = i === oggiIndex;
                const chiuso = r.servizio === "Chiuso";
                const dot =
                  r.servizio === "Cena" ? "var(--oliva)" :
                  r.servizio === "Pranzo" ? "var(--oro)" : "transparent";
                return (
                  <div
                    key={r.giorno}
                    data-row
                    className="flex items-baseline justify-between gap-4 py-3.5"
                    style={{
                      borderBottom: "1px solid color-mix(in oklab, var(--crema) 12%, transparent)",
                      opacity: reduced ? 1 : 0,
                    }}
                  >
                    <dt className="flex items-baseline gap-3">
                      <span
                        className="font-eyebrow text-[12px] uppercase tracking-[0.22em] text-[color:var(--crema)] md:text-[13px]"
                        style={{ opacity: chiuso ? 0.55 : 1 }}
                      >
                        {r.giorno}
                      </span>
                      {isToday && (
                        <span
                          className="font-eyebrow text-[9px] uppercase tracking-[0.3em] text-[color:var(--carbone)]"
                          style={{
                            padding: "2px 6px",
                            background: "var(--oro)",
                            borderRadius: 1,
                          }}
                        >
                          Oggi
                        </span>
                      )}
                    </dt>
                    <dd className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: dot,
                          opacity: chiuso ? 0 : 0.9,
                        }}
                      />
                      <span
                        className="font-display text-sm text-[color:var(--crema)] md:text-base"
                        style={{
                          opacity: chiuso ? 0.55 : 0.92,
                          fontStyle: chiuso ? "italic" : "normal",
                        }}
                      >
                        {r.servizio}
                      </span>
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="mt-5 max-w-[38ch] font-body text-[13px] italic leading-relaxed text-[color:var(--crema)]/50">
              Gli orari possono variare nei giorni festivi. Contattaci per confermare il servizio.
            </p>
          </aside>

          {/* ── LUOGO / MAPPA ── */}
          <div className="md:col-span-12 md:mt-4">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-10">
              <div
                ref={mapWinRef}
                className="prenota-mapwin md:col-span-8"
                style={{ clipPath: reduced ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }}
              >
                <iframe
                  title="Mappa di Masseria Don Gianvito"
                  src={MAPS_EMBED}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[360px] w-full md:h-[440px]"
                  style={{ border: 0, display: "block", filter: "sepia(0.22) saturate(0.85) contrast(0.95)" }}
                />
              </div>
              <div
                ref={addrRef}
                className="md:col-span-4 md:pt-4"
                style={{ opacity: reduced ? 1 : 0 }}
              >
                <p className="font-eyebrow text-[11px] uppercase tracking-[0.34em] text-[color:var(--marrone)]/70">
                  Il luogo
                </p>
                <address className="mt-5 not-italic">
                  <p className="font-display text-lg leading-snug text-[color:var(--marrone)] md:text-xl">
                    Masseria Don Gianvito
                  </p>
                  <p className="mt-3 font-body text-[15px] leading-relaxed text-[color:var(--marrone)]/85">
                    SP237 ex SS377 per Mottola, km 6,5<br />
                    Zona C 76<br />
                    70015 Noci BA
                  </p>
                  <p className="mt-4 font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60">
                    40.642739° N · 17.042600° E
                  </p>
                </address>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-map group mt-6 inline-flex items-baseline gap-2 font-eyebrow text-[12px] uppercase tracking-[0.28em] text-[color:var(--marrone)]"
                >
                  <span>Apri su Google Maps</span>
                  <span aria-hidden className="cta-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .prenota .cta-primary {
          background: var(--bordeaux, #6b1e28);
          color: var(--crema);
          border: 1px solid color-mix(in oklab, var(--crema) 25%, transparent);
          transition: background .35s ease, transform .35s ease;
        }
        .prenota .cta-primary:hover { background: color-mix(in oklab, var(--bordeaux, #6b1e28) 88%, black); }
        .prenota .cta-primary .cta-arrow { transition: transform .35s cubic-bezier(.16,1,.3,1); }
        .prenota .cta-primary:hover .cta-arrow { transform: translateX(4px); }

        .prenota .cta-secondary {
          color: var(--crema);
          border: 1px solid color-mix(in oklab, var(--crema) 55%, transparent);
          background: transparent;
          transition: background .35s ease, color .35s ease;
        }
        .prenota .cta-secondary:hover {
          background: color-mix(in oklab, var(--crema) 8%, transparent);
        }

        .prenota .cta-map { position: relative; padding-bottom: 4px; }
        .prenota .cta-map::after {
          content: ""; position: absolute; left: 0; bottom: 0; height: 1px;
          width: 0; background: var(--oro);
          transition: width .5s cubic-bezier(.16,1,.3,1);
        }
        .prenota .cta-map:hover::after,
        .prenota .cta-map:focus-visible::after { width: 100%; }
        .prenota .cta-map .cta-arrow { transition: transform .35s cubic-bezier(.16,1,.3,1); }
        .prenota .cta-map:hover .cta-arrow { transform: translateX(4px); }

        .prenota .prenota-mapwin {
          position: relative;
          overflow: hidden;
          background: var(--crema);
          border: 1px solid color-mix(in oklab, var(--marrone) 30%, transparent);
          /* finestra editoriale — angolo tagliato */
          clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px));
        }

        @media (prefers-reduced-motion: reduce) {
          .prenota .cta-map::after { width: 100%; }
        }

        @media (max-width: 767px) {
          .prenota .cta-primary,
          .prenota .cta-secondary { width: 100%; }
          .prenota .prenota-mapwin {
            clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
          }
        }
      `}</style>
    </section>
  );
}
