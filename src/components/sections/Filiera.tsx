import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * FILIERA — "Dalla terra alla brace"
 * Sezione editoriale post-hero: soglia + striscia dati + 4 anelli
 * cuciti da un filo d'oro verticale. Sobria, densa, con contenuto reale.
 * ───────────────────────────────────────────────────────────── */

type Ring = {
  n: string;
  title: string;
  to: "/allevamento" | "/caseificio" | "/macelleria" | "/braceria";
  lede: string;
  fact: string;
  alt: string;
  tone: string; // background gradient per il placeholder
};

const RINGS: Ring[] = [
  {
    n: "01",
    title: "Allevamento",
    to: "/allevamento",
    lede: "Centinaia di capi al pascolo. Bovini Pezzata Rossa × Frisona, ovini, suini, equini, avicoli.",
    fact: "foraggio e grano coltivati in masseria",
    alt: "Bovini Pezzata Rossa al pascolo nella Murgia, Masseria Don Gianvito",
    tone: "linear-gradient(135deg, #3D2A1E 0%, #1A1210 60%, #2a1e15 100%)",
  },
  {
    n: "02",
    title: "Caseificio",
    to: "/caseificio",
    lede: "Il latte munto ogni mattina, lavorato a mano.",
    fact: "mozzarelle km0 · nodini · primo sale · ricotta",
    alt: "Lavorazione della mozzarella nel caseificio della masseria",
    tone: "linear-gradient(135deg, #2b241f 0%, #1A1210 55%, #3D2A1E 100%)",
  },
  {
    n: "03",
    title: "Macelleria",
    to: "/macelleria",
    lede: "La carne, a vista. Ogni taglio si traccia al pascolo.",
    fact: "frollatura ~15 giorni",
    alt: "Banco macelleria con tagli di carne frollata",
    tone: "linear-gradient(135deg, #6E1A14 0%, #2a120f 60%, #1A1210 100%)",
  },
  {
    n: "04",
    title: "Braceria",
    to: "/braceria",
    lede: "Scegli la carne al banco. La porti al fornello. Te la cuociono sulla brace a carboni.",
    fact: "mer–sab cena · domenica pranzo",
    alt: "Braci ardenti nella braceria della masseria",
    tone: "linear-gradient(135deg, #B33A1A 0%, #6E1A14 55%, #1A1210 100%)",
  },
];

const STATS = [
  { n: "DAL 2002", label: "Oltre 20 anni" },
  { n: "5 SPECIE", label: "Bovini · ovini · suini · equini · avicoli" },
  { n: "FILOFORAGGIO", label: "Ortaggi · grano tenero coltivati qui" },
  { n: "4 MESTIERI", label: "1 masseria" },
];

export function Filiera() {
  const rootRef = useRef<HTMLElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    // default visibile — reveal solo se JS pronto
    const rows = gsap.utils.toArray<HTMLElement>("[data-reveal-row]", root);
    const thresholdItems = gsap.utils.toArray<HTMLElement>("[data-reveal-thr]", root);
    const stats = gsap.utils.toArray<HTMLElement>("[data-stat]", root);

    if (reduced) return;

    const mm = gsap.matchMedia();
    const triggers: ScrollTrigger[] = [];

    // ── Soglia + striscia dati
    thresholdItems.forEach((el) => {
      el.style.clipPath = "inset(0 0 100% 0)";
      el.style.opacity = "1";
    });
    const trThr = gsap.to(thresholdItems, {
      clipPath: "inset(0 0 0% 0)",
      duration: 1.1,
      ease: "cubic-bezier(.16,1,.3,1)",
      stagger: 0.12,
      scrollTrigger: { trigger: root, start: "top 78%", once: true },
    });
    if (trThr.scrollTrigger) triggers.push(trThr.scrollTrigger);

    // Count-up numeri
    stats.forEach((el) => {
      const raw = el.dataset.stat || "";
      const num = parseInt(raw, 10);
      if (!Number.isFinite(num) || raw !== String(num)) {
        // non numerico: solo fade
        gsap.fromTo(
          el,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
        return;
      }
      const obj = { v: 0 };
      const t = gsap.to(obj, {
        v: num,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v)) + (raw.endsWith("+") ? "+" : "");
        },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    });

    // ── Righe anelli: reveal + parallax foto
    rows.forEach((row) => {
      const media = row.querySelector<HTMLElement>("[data-media]");
      const items = row.querySelectorAll<HTMLElement>("[data-row-item]");

      items.forEach((it) => {
        it.style.clipPath = "inset(0 0 100% 0)";
        it.style.opacity = "1";
      });
      const rv = gsap.to(items, {
        clipPath: "inset(0 0 0% 0)",
        duration: 1.0,
        ease: "cubic-bezier(.16,1,.3,1)",
        stagger: 0.1,
        scrollTrigger: { trigger: row, start: "top 80%", once: true },
      });
      if (rv.scrollTrigger) triggers.push(rv.scrollTrigger);

      if (media) {
        const pr = gsap.fromTo(
          media,
          { yPercent: -3, scale: 1.02 },
          {
            yPercent: 3,
            scale: 1.02,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
        if (pr.scrollTrigger) triggers.push(pr.scrollTrigger);
      }
    });

    // ── Filo d'oro
    const path = threadRef.current;
    if (path) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      const tr = gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.querySelector("[data-rings]") as HTMLElement,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
      if (tr.scrollTrigger) triggers.push(tr.scrollTrigger);
    }

    // Fallback anti-invisibilità
    const fb = window.setTimeout(() => {
      [...thresholdItems, ...rows.flatMap((r) => Array.from(r.querySelectorAll<HTMLElement>("[data-row-item]")))].forEach(
        (el) => {
          if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
            el.style.opacity = "1";
            el.style.clipPath = "inset(0 0 0 0)";
          }
        },
      );
    }, 3000);

    return () => {
      window.clearTimeout(fb);
      triggers.forEach((t) => t.kill());
      mm.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="La Filiera — dalla terra alla brace"
      className="relative isolate w-full overflow-hidden bg-[color:var(--carbone)] text-[color:var(--crema)]"
    >
      {/* vignettatura calda sottile */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-24 pb-32 md:px-10 md:pt-32 md:pb-40">
        {/* ── A) SOGLIA ── */}
        <header className="mx-auto max-w-3xl text-center">
          <p
            data-reveal-thr
            className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro)]/80 md:text-[11px]"
          >
            LA FILIERA · DAL 2002
          </p>
          <h2
            data-reveal-thr
            className="font-display italic mt-6 text-[color:var(--crema)]"
            style={{
              fontSize: "clamp(1.75rem, 4.2vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              fontWeight: 300,
            }}
          >
            Qui non arriva niente da <span className="filiera-accent">fuori</span>.
          </h2>
          <p
            data-reveal-thr
            className="mt-6 text-[color:var(--crema)]/70 md:text-lg"
            style={{ lineHeight: 1.6 }}
          >
            Masseria del &apos;500 tra ulivi secolari. Alleviamo, coltiviamo,
            trasformiamo e cuciniamo tutto qui — da oltre vent&apos;anni.
          </p>
        </header>

        {/* ── B) STRISCIA DATI ── */}
        <div className="mt-16 md:mt-20">
          <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={
                  "flex flex-col items-center px-4 text-center md:px-6" +
                  (i > 0 ? " md:border-l md:border-[color:var(--oro)]/25" : "")
                }
              >
                <span
                  data-stat={s.n}
                  className="font-eyebrow text-[color:var(--oro)]"
                  style={{
                    fontSize: "clamp(0.95rem, 1.35vw, 1.15rem)",
                    lineHeight: 1.1,
                    letterSpacing: "0.22em",
                    fontWeight: 500,
                  }}
                >
                  {s.n}
                </span>
                <span className="mt-3 text-[13px] text-[color:var(--crema)]/65 md:text-sm" style={{ lineHeight: 1.4 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── C) 4 ANELLI ── */}
        <div data-rings className="relative mt-24 md:mt-32">
          {/* Filo d'oro verticale */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              ref={threadRef}
              d="M 50 0 C 30 20, 70 40, 50 50 C 30 60, 70 80, 50 100"
              fill="none"
              stroke="url(#filoOro)"
              strokeWidth="0.25"
              vectorEffect="non-scaling-stroke"
              style={{ mixBlendMode: "screen" }}
            />
            <defs>
              <linearGradient id="filoOro" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C49A4A" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#B33A1A" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#C49A4A" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>

          <ul className="relative flex flex-col gap-24 md:gap-36">
            {RINGS.map((r, i) => {
              const reverse = i % 2 === 1;
              return (
                <li
                  key={r.n}
                  data-reveal-row
                  className={
                    "grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12 " +
                    (reverse ? "md:[direction:rtl]" : "")
                  }
                >
                  {/* Media */}
                  <div className="md:col-span-6 md:[direction:ltr]">
                    <div
                      data-row-item
                      className="relative overflow-hidden rounded-sm border border-[color:var(--oro)]/15"
                      style={{ aspectRatio: "3 / 2" }}
                    >
                      <div
                        data-media
                        role="img"
                        aria-label={r.alt}
                        className="absolute inset-0 will-change-transform"
                        style={{ background: r.tone }}
                      />
                      {/* texture film-grain sottile */}
                      <div
                        aria-hidden
                        className="grain pointer-events-none absolute inset-0 opacity-[0.06]"
                      />
                      {/* etichetta */}
                      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-3">
                        <span className="font-eyebrow rounded-sm border border-[color:var(--oro)]/40 bg-black/30 px-2 py-1 text-[9px] tracking-[0.35em] text-[color:var(--crema)]/85">
                          CAP · {r.n}
                        </span>
                      </div>
                      {/* vignetta */}
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(100% 80% at 50% 60%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Testo */}
                  <div className="md:col-span-6 md:[direction:ltr]">
                    <div data-row-item>
                      <p className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro)]/85">
                        {r.n} · {r.title.toUpperCase()}
                      </p>
                      <h3
                        className="font-display italic mt-4 text-[color:var(--crema)]"
                        style={{
                          fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)",
                          lineHeight: 1.08,
                          letterSpacing: "-0.01em",
                          fontWeight: 300,
                        }}
                      >
                        {r.lede}
                      </h3>
                      <p className="mt-5 text-[color:var(--crema)]/65">
                        <span className="font-eyebrow text-[10px] tracking-[0.25em] text-[color:var(--crema)]/45">
                          NOTA ·{" "}
                        </span>
                        {r.fact}
                      </p>
                      <div className="mt-8">
                        <Link
                          to={r.to}
                          className="font-eyebrow group inline-flex items-center gap-3 border-b border-[color:var(--oro)]/40 pb-1 text-[11px] tracking-[0.3em] text-[color:var(--crema)] transition-colors hover:text-[color:var(--oro)] focus-visible:outline-none focus-visible:text-[color:var(--oro)]"
                        >
                          SCOPRI {r.title.toUpperCase()}
                          <span
                            aria-hidden
                            className="transition-transform group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── D) CHIUSURA ── */}
        <div className="mt-28 flex flex-col items-center gap-8 text-center md:mt-36">
          <p
            data-reveal-thr
            className="font-display italic max-w-2xl text-[color:var(--crema)]/85"
            style={{
              fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)",
              lineHeight: 1.35,
              fontWeight: 300,
            }}
          >
            Quattro mestieri, una masseria. Un solo ritmo:
            <span className="filiera-accent"> dalla terra alla brace.</span>
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link
              to="/allevamento"
              className="font-eyebrow inline-flex items-center gap-3 rounded-full border border-[color:var(--oro)]/40 px-7 py-3 text-[11px] tracking-[0.3em] text-[color:var(--crema)] transition-colors hover:bg-[color:var(--oro)]/10 focus-visible:outline-none focus-visible:bg-[color:var(--oro)]/10"
            >
              ENTRA NELLA MASSERIA →
            </Link>
            <a
              href="tel:+390000000000"
              className="font-eyebrow inline-flex items-center gap-3 rounded-full px-7 py-3 text-[11px] tracking-[0.3em] text-[color:var(--carbone)] transition-transform hover:scale-[1.02] focus-visible:outline-none"
              style={{
                background:
                  "linear-gradient(100deg, #B33A1A 0%, #C49A4A 55%, #B33A1A 100%)",
                boxShadow: "0 0 24px rgba(196,154,74,0.25)",
              }}
            >
              PRENOTA UN TAVOLO
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .filiera-accent {
          background-image: linear-gradient(100deg, #B33A1A 0%, #C49A4A 50%, #B33A1A 100%);
          background-size: 200% 100%;
          background-position: 30% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 12px rgba(196,154,74,0.22));
        }
        [data-reveal-thr], [data-row-item] { will-change: clip-path, opacity; }
        @media (prefers-reduced-motion: reduce) {
          [data-media] { transform: none !important; }
        }
      `}</style>
    </section>
  );
}
