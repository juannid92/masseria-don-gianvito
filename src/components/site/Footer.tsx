import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * FOOTER — Chiusura editoriale. Crema. Asimmetrico.
 * "Dalla terra alla tavola." + solco che collega indirizzo,
 * coordinate e contatti. Chiude il ciclo dall'Hero.
 * ───────────────────────────────────────────────────────────── */

const TEL_1 = "+393339395750";
const TEL_1_DISPLAY = "333 939 5750";
const TEL_2 = "+393333870292";
const TEL_2_DISPLAY = "333 387 0292";
const WA_URL = "https://wa.me/393339395750";
const INSTAGRAM = "https://instagram.com/masseria_don_gianvito";
const FACEBOOK = "https://facebook.com/masseriadongianvito";
const MAPS_URL = "https://www.google.com/maps?q=40.642739,17.042600";

const INTERNE = [
  { href: "/allevamento", label: "Allevamento" },
  { href: "/caseificio", label: "Caseificio" },
  { href: "/macelleria", label: "Macelleria" },
  { href: "/braceria", label: "Braceria" },
] as const;

export function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const claimRef = useRef<HTMLHeadingElement>(null);
  const solcoRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();
  const year = new Date().getFullYear();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (claimRef.current) claimRef.current.style.clipPath = "inset(100% 0 0 0)";
      const items = root.querySelectorAll<HTMLElement>("[data-foot]");
      gsap.set(items, { autoAlpha: 0, y: 10 });
      if (solcoRef.current) {
        solcoRef.current.style.strokeDasharray = "1";
        solcoRef.current.style.strokeDashoffset = "1";
      }
      ScrollTrigger.create({
        trigger: root,
        start: "top 78%",
        once: true,
        onEnter: () => {
          gsap.to(claimRef.current, {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.1,
            ease: "cubic-bezier(.16,1,.3,1)",
          });
          gsap.to(items, {
            autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.05, delay: 0.2, ease: "power2.out",
          });
          if (solcoRef.current) {
            gsap.to(solcoRef.current, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" });
          }
        },
      });
      const safety = window.setTimeout(() => {
        if (claimRef.current) claimRef.current.style.clipPath = "inset(0 0 0 0)";
        gsap.set(items, { autoAlpha: 1, y: 0 });
        if (solcoRef.current) solcoRef.current.style.strokeDashoffset = "0";
      }, 2500);
      return () => window.clearTimeout(safety);
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--crema)",
        borderTop: "1px solid color-mix(in oklab, var(--marrone) 15%, transparent)",
      }}
    >
      {/* solco */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[58%] z-0 h-[1px] w-full"
        viewBox="0 0 1000 1"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="foot-solco" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--marrone)" stopOpacity="0.05" />
            <stop offset="50%" stopColor="var(--oro)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--marrone)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          ref={solcoRef}
          d="M0 0.5 L1000 0.5"
          stroke="url(#foot-solco)"
          strokeWidth="1"
          pathLength={1}
          strokeDasharray={reduced ? undefined : 1}
          strokeDashoffset={reduced ? undefined : 1}
        />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-6 pt-24 pb-10 md:px-12 md:pt-32 md:pb-14">
        {/* CLAIM */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-9">
            <p
              data-foot
              className="font-eyebrow text-[11px] uppercase tracking-[0.34em] text-[color:var(--marrone)]/55"
            >
              Masseria Don Gianvito · Noci, Puglia
            </p>
            <h2
              ref={claimRef}
              className="mt-4 font-display leading-[0.88] text-[color:var(--marrone)]"
              style={{
                fontSize: "clamp(3.6rem, 8vw, 9rem)",
                clipPath: reduced ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
              }}
            >
              Dalla terra<br />
              <span className="italic text-[color:var(--oro)]">alla tavola.</span>
            </h2>
          </div>
          <div className="md:col-span-3 md:pt-8">
            <div
              data-foot
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border font-display text-[15px] text-[color:var(--marrone)]"
              style={{ borderColor: "color-mix(in oklab, var(--marrone) 55%, transparent)" }}
              aria-label="Monogramma Don Gianvito"
            >
              DG
            </div>
            <p
              data-foot
              className="mt-4 font-eyebrow text-[10px] uppercase tracking-[0.32em] text-[color:var(--marrone)]/55"
            >
              Allevamento · Caseificio<br />
              Macelleria · Braceria
            </p>
          </div>
        </div>

        {/* aree pratiche */}
        <div className="mt-20 grid grid-cols-1 gap-14 md:mt-28 md:grid-cols-12 md:gap-10">
          {/* Visita */}
          <div className="md:col-span-5">
            <p
              data-foot
              className="font-eyebrow text-[11px] uppercase tracking-[0.34em] text-[color:var(--marrone)]/55"
            >
              Visita
            </p>
            <address data-foot className="mt-4 not-italic font-body text-[15px] leading-relaxed text-[color:var(--marrone)]/90">
              SP237 ex SS377 per Mottola, km 6,5<br />
              Zona C 76<br />
              70015 Noci BA
            </address>
            <p data-foot className="mt-4 font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60">
              40.642739° N · 17.042600° E
            </p>
            <a
              data-foot
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="foot-link mt-5 inline-flex items-baseline gap-2 font-eyebrow text-[12px] uppercase tracking-[0.28em] text-[color:var(--marrone)]"
            >
              <span>Apri su Google Maps</span>
              <span aria-hidden className="foot-arrow">→</span>
            </a>
          </div>

          {/* Contatti */}
          <div className="md:col-span-4">
            <p
              data-foot
              className="font-eyebrow text-[11px] uppercase tracking-[0.34em] text-[color:var(--marrone)]/55"
            >
              Contatti
            </p>
            <ul className="mt-4 space-y-2">
              <li data-foot>
                <a href={`tel:${TEL_1}`} className="foot-link font-display text-xl text-[color:var(--marrone)]">
                  {TEL_1_DISPLAY}
                </a>
              </li>
              <li data-foot>
                <a href={`tel:${TEL_2}`} className="foot-link font-display text-base text-[color:var(--marrone)]/75">
                  {TEL_2_DISPLAY}
                </a>
              </li>
            </ul>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              <li data-foot>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Scrivici su WhatsApp"
                  className="foot-link font-eyebrow text-[11px] uppercase tracking-[0.28em] text-[color:var(--marrone)]"
                >
                  WhatsApp ↗
                </a>
              </li>
              <li data-foot>
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @masseria_don_gianvito"
                  className="foot-link font-eyebrow text-[11px] uppercase tracking-[0.28em] text-[color:var(--marrone)]"
                >
                  Instagram ↗
                </a>
              </li>
              <li data-foot>
                <a
                  href={FACEBOOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook Masseria Don Gianvito"
                  className="foot-link font-eyebrow text-[11px] uppercase tracking-[0.28em] text-[color:var(--marrone)]"
                >
                  Facebook ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Pagine interne */}
          <nav className="md:col-span-3" aria-label="Le quattro anime">
            <p
              data-foot
              className="font-eyebrow text-[11px] uppercase tracking-[0.34em] text-[color:var(--marrone)]/55"
            >
              Le quattro anime
            </p>
            <ul className="mt-4 space-y-2.5">
              {INTERNE.map((v) => (
                <li key={v.href} data-foot>
                  <Link
                    to={v.href}
                    className="foot-link font-display text-lg text-[color:var(--marrone)]"
                  >
                    {v.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Note legali */}
        <div
          className="mt-20 flex flex-col gap-3 pt-6 md:mt-24 md:flex-row md:items-baseline md:justify-between"
          style={{ borderTop: "1px solid color-mix(in oklab, var(--marrone) 15%, transparent)" }}
        >
          <p
            data-foot
            className="font-eyebrow text-[10px] uppercase tracking-[0.32em] text-[color:var(--marrone)]/50"
          >
            P.IVA / CF 05839280723
          </p>
          <p
            data-foot
            className="font-eyebrow text-[10px] uppercase tracking-[0.32em] text-[color:var(--marrone)]/40"
          >
            © {year} Masseria Don Gianvito · Noci (BA)
          </p>
        </div>
      </div>

      <style>{`
        footer .foot-link { position: relative; padding-bottom: 3px; }
        footer .foot-link::after {
          content: ""; position: absolute; left: 0; bottom: 0; height: 1px;
          width: 0; background: var(--oro);
          transition: width .5s cubic-bezier(.16,1,.3,1);
        }
        footer .foot-link:hover::after,
        footer .foot-link:focus-visible::after { width: 100%; }
        footer .foot-arrow { transition: transform .35s cubic-bezier(.16,1,.3,1); display: inline-block; }
        footer .foot-link:hover .foot-arrow { transform: translateX(4px); }
        @media (prefers-reduced-motion: reduce) {
          footer .foot-link::after { width: 100%; }
        }
      `}</style>
    </footer>
  );
}
