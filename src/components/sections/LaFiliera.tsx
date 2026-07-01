import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ────────────────────────────────────────────────────────────
 * LA FILIERA — nastro orizzontale pinnato a 4 anelli.
 * Reveal DIVERSO per ogni anello + frecce d'oro SVG tra gli
 * anelli con parole-legame (pascolo → latte → carne → brace).
 * ─────────────────────────────────────────────────────────── */

type Ring = {
  n: string;
  kicker: string;
  title: React.ReactNode;
  body: string;
  data: string;
  to: "/allevamento" | "/caseificio" | "/macelleria" | "/braceria";
  photoTone: string;
  alt: string;
  side: "left" | "right"; // dove sta la foto
  reveal: "center-out" | "slide-right" | "inset-top" | "ember-glow";
};

const RINGS: Ring[] = [
  {
    n: "01",
    kicker: "ALLEVAMENTO",
    title: (
      <>
        Dove tutto <em className="font-display italic">comincia</em>
      </>
    ),
    body: "Centinaia di capi al pascolo. Bovini Pezzata Rossa × Frisona, ovini, suini, equini, avicoli. Foraggio, ortaggi e grano tenero coltivati in masseria.",
    data: "DAL 2002 · 5 SPECIE · KM 0",
    to: "/allevamento",
    photoTone:
      "linear-gradient(135deg, #3D2A1E 0%, #6B7340 55%, #1A1210 100%)",
    alt: "Bovini al pascolo nella Murgia",
    side: "left",
    reveal: "center-out",
  },
  {
    n: "02",
    kicker: "CASEIFICIO",
    title: (
      <>
        Il latte di ogni <em className="font-display italic">mattina</em>
      </>
    ),
    body: "Il latte munto all'alba, lavorato a mano. Mozzarelle km0, nodini, primo sale, ricotta.",
    data: "LATTE NOSTRO · PRODUZIONE GIORNALIERA",
    to: "/caseificio",
    photoTone:
      "linear-gradient(135deg, #F2E8D5 0%, #d8ccb4 55%, #3D2A1E 100%)",
    alt: "Mozzarelle e latte fresco nel caseificio",
    side: "right",
    reveal: "slide-right",
  },
  {
    n: "03",
    kicker: "MACELLERIA",
    title: (
      <>
        La carne, <em className="font-display italic">a vista</em>
      </>
    ),
    body: "Ogni taglio si traccia al pascolo. Frollatura ~15 giorni. Scegli al banco quello che vuoi alla brace.",
    data: "FROLLATURA 15 GIORNI",
    to: "/macelleria",
    photoTone:
      "linear-gradient(135deg, #6E1A14 0%, #2a120f 55%, #1A1210 100%)",
    alt: "Banco macelleria con tagli di carne frollata",
    side: "left",
    reveal: "inset-top",
  },
  {
    n: "04",
    kicker: "BRACERIA",
    title: (
      <>
        La brace, ogni <em className="font-display italic" style={{ color: "var(--oro)" }}>sera</em>
      </>
    ),
    body: "Scegli la carne. Ti siedi. Te la portano cotta sulla brace a carboni. Dalla terra alla brace, ogni sera.",
    data: "MER–SAB CENA · DOMENICA PRANZO",
    to: "/braceria",
    photoTone:
      "radial-gradient(80% 80% at 50% 55%, #B33A1A 0%, #6E1A14 40%, #1A1210 100%)",
    alt: "Braci ardenti nella braceria della masseria",
    side: "right",
    reveal: "ember-glow",
  },
];

const LINKS = [
  "ciò che pascola → ciò che mungi",
  "il latte → la carne",
  "il banco → la brace",
];

export function LaFiliera() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    gsap.registerPlugin(ScrollTrigger);

    if (reduced) {
      // reveal statico: rendo visibile tutto
      track.querySelectorAll<HTMLElement>("[data-reveal-media],[data-reveal-copy]").forEach((el) => {
        el.style.opacity = "1";
        el.style.clipPath = "none";
        el.style.transform = "none";
      });
      root.querySelectorAll<SVGPathElement>("[data-arrow-path]").forEach((p) => {
        p.style.strokeDashoffset = "0";
      });
      root.querySelectorAll<HTMLElement>("[data-arrow-word]").forEach((w) => {
        w.style.opacity = "1";
      });
      return;
    }

    const mm = gsap.matchMedia();
    const triggers: ScrollTrigger[] = [];

    // ── header reveal
    const headerItems = gsap.utils.toArray<HTMLElement>("[data-header-item]", root);
    headerItems.forEach((el) => {
      el.style.clipPath = "inset(0 0 100% 0)";
      el.style.opacity = "1";
    });
    const trH = gsap.to(headerItems, {
      clipPath: "inset(0 0 0% 0)",
      duration: 1,
      ease: "cubic-bezier(.16,1,.3,1)",
      stagger: 0.12,
      scrollTrigger: { trigger: root, start: "top 80%", once: true },
    });
    if (trH.scrollTrigger) triggers.push(trH.scrollTrigger);

    mm.add("(min-width: 900px)", () => {
      // ── set-up reveal iniziali per anelli
      const panels = gsap.utils.toArray<HTMLElement>("[data-ring]", track);

      panels.forEach((panel) => {
        const media = panel.querySelector<HTMLElement>("[data-reveal-media]");
        const copy = panel.querySelector<HTMLElement>("[data-reveal-copy]");
        const reveal = panel.dataset.reveal as Ring["reveal"];
        if (!media || !copy) return;

        // stato iniziale per media
        switch (reveal) {
          case "center-out":
            media.style.clipPath = "circle(0% at 50% 50%)";
            media.style.opacity = "1";
            break;
          case "slide-right":
            gsap.set(media, { x: 120, autoAlpha: 0 });
            break;
          case "inset-top":
            media.style.clipPath = "inset(0 0 100% 0)";
            media.style.opacity = "1";
            break;
          case "ember-glow":
            media.style.clipPath = "circle(0% at 50% 55%)";
            media.style.opacity = "1";
            break;
        }
        // stato iniziale copy
        copy.style.opacity = "0";
      });

      // ── nastro orizzontale pinnato
      const totalScroll = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -totalScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => "+=" + totalScroll(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);

      // ── reveal per anello (containerAnimation-based)
      panels.forEach((panel, idx) => {
        const media = panel.querySelector<HTMLElement>("[data-reveal-media]");
        const copy = panel.querySelector<HTMLElement>("[data-reveal-copy]");
        const reveal = panel.dataset.reveal as Ring["reveal"];
        if (!media || !copy) return;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left 75%",
            end: "left 25%",
            once: true,
            onEnter: () => updateCounter(idx),
            onEnterBack: () => updateCounter(idx),
          },
        });

        switch (reveal) {
          case "center-out":
            tl.to(media, { clipPath: "circle(75% at 50% 50%)", duration: 1.2, ease: "cubic-bezier(.16,1,.3,1)" });
            tl.fromTo(copy, { clipPath: "inset(0 0 100% 0)", opacity: 1 }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "cubic-bezier(.16,1,.3,1)" }, "-=0.7");
            break;
          case "slide-right":
            tl.to(media, { x: 0, autoAlpha: 1, duration: 1.1, ease: "cubic-bezier(.16,1,.3,1)" });
            {
              const words = copy.querySelectorAll<HTMLElement>("[data-word]");
              tl.to(copy, { opacity: 1, duration: 0.01 }, "-=0.6");
              tl.fromTo(words, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: "power2.out" }, "-=0.4");
            }
            break;
          case "inset-top":
            tl.to(media, { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "cubic-bezier(.16,1,.3,1)" });
            {
              const title = copy.querySelector<HTMLElement>("[data-etch]");
              tl.to(copy, { opacity: 1, duration: 0.01 }, "-=0.7");
              if (title) {
                tl.fromTo(title, { letterSpacing: "0.4em", opacity: 0 }, { letterSpacing: "-0.01em", opacity: 1, duration: 1.0, ease: "power3.out" }, "-=0.6");
              }
              const rest = copy.querySelectorAll<HTMLElement>("[data-etch-rest]");
              tl.fromTo(rest, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, "-=0.4");
            }
            break;
          case "ember-glow":
            tl.to(media, { clipPath: "circle(80% at 50% 55%)", duration: 1.3, ease: "cubic-bezier(.16,1,.3,1)" });
            tl.fromTo(copy, { clipPath: "inset(0 0 100% 0)", opacity: 1 }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "cubic-bezier(.16,1,.3,1)" }, "-=0.7");
            break;
        }
      });

      // ── frecce d'oro tra gli anelli
      const arrows = gsap.utils.toArray<HTMLElement>("[data-arrow]", track);
      arrows.forEach((arrow) => {
        const path = arrow.querySelector<SVGPathElement>("[data-arrow-path]");
        const word = arrow.querySelector<HTMLElement>("[data-arrow-word]");
        if (!path || !word) return;
        const len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
        word.style.opacity = "0";

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: arrow,
            containerAnimation: tween,
            start: "left 80%",
            end: "left 30%",
            scrub: 0.6,
          },
        });
        tl.to(path, { strokeDashoffset: 0, ease: "none" });
        tl.to(word, { opacity: 1, duration: 0.3 }, ">-0.2");
      });

      return () => {};
    });

    // ── mobile: verticale, reveal semplici
    mm.add("(max-width: 899px)", () => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-ring]", track);
      panels.forEach((panel, idx) => {
        const items = panel.querySelectorAll<HTMLElement>("[data-reveal-media],[data-reveal-copy]");
        items.forEach((el) => {
          el.style.opacity = "0";
          el.style.clipPath = "none";
        });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 80%",
            once: true,
            onEnter: () => updateCounter(idx),
          },
        });
      });
      const arrows = gsap.utils.toArray<HTMLElement>("[data-arrow]", track);
      arrows.forEach((arrow) => {
        const path = arrow.querySelector<SVGPathElement>("[data-arrow-path]");
        const word = arrow.querySelector<HTMLElement>("[data-arrow-word]");
        if (!path || !word) return;
        const len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len);
        word.style.opacity = "0";
        gsap.to(path, {
          strokeDashoffset: 0,
          scrollTrigger: { trigger: arrow, start: "top 85%", end: "bottom 60%", scrub: 0.6 },
        });
        gsap.to(word, {
          opacity: 1,
          duration: 0.5,
          scrollTrigger: { trigger: arrow, start: "top 70%", once: true },
        });
      });
    });

    function updateCounter(idx: number) {
      if (counterRef.current) {
        counterRef.current.textContent = String(idx + 1).padStart(2, "0");
      }
    }

    // ── refresh dopo font ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    // fallback 3s anti-invisibilità
    const fb = window.setTimeout(() => {
      track.querySelectorAll<HTMLElement>("[data-reveal-media],[data-reveal-copy]").forEach((el) => {
        if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
          el.style.opacity = "1";
          el.style.clipPath = "none";
          el.style.transform = "none";
        }
      });
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
      aria-label="La Filiera — quattro mestieri, una masseria"
      className="relative isolate w-full overflow-hidden bg-[color:var(--carbone)] text-[color:var(--crema)]"
    >
      {/* Header intro (verticale) */}
      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pt-24 pb-10 md:px-10 md:pt-32 md:pb-16">
        <p
          data-header-item
          className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--crema)]/40 md:text-[11px]"
        >
          04 — LA FILIERA
        </p>
        <h2
          data-header-item
          className="mt-6 max-w-4xl text-[color:var(--crema)]"
          style={{
            fontSize: "clamp(1.9rem, 4.4vw, 3.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            fontWeight: 300,
          }}
        >
          Quattro <em className="font-display italic">mestieri</em>, una sola masseria.
        </h2>
        <p
          data-header-item
          className="mt-5 max-w-2xl text-[color:var(--crema)]/60 md:text-lg"
          style={{ lineHeight: 1.6 }}
        >
          Qui non arriva niente da fuori.
        </p>
      </div>

      {/* Nastro */}
      <div className="relative">
        <div
          ref={trackRef}
          className="filiera-track flex items-stretch"
          style={{ willChange: "transform" }}
        >
          {RINGS.map((r, i) => (
            <FiliereFragments key={r.n} ring={r} arrowAfter={i < RINGS.length - 1 ? LINKS[i] : null} />
          ))}
          {/* piccolo spazio finale */}
          <div className="shrink-0" style={{ width: "10vw" }} />
        </div>
      </div>

      {/* Counter */}
      <div className="pointer-events-none absolute bottom-8 left-0 right-0 z-20 flex justify-center">
        <span className="font-eyebrow text-[11px] tracking-[0.4em] text-[color:var(--crema)]/40">
          <span ref={counterRef}>01</span> / 04
        </span>
      </div>

      <style>{`
        .filiera-track {
          width: max-content;
        }
        .filiera-panel {
          width: 90vw;
          max-width: 1180px;
          height: 100vh;
          flex-shrink: 0;
          display: grid;
          align-items: center;
          padding: 0 6vw;
        }
        .filiera-arrow {
          width: 26vw;
          min-width: 220px;
          height: 100vh;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
        }
        @media (max-width: 899px) {
          .filiera-track {
            width: 100%;
            flex-direction: column;
            transform: none !important;
          }
          .filiera-panel {
            width: 100%;
            height: auto;
            padding: 6vh 6vw;
          }
          .filiera-arrow {
            width: 100%;
            height: auto;
            padding: 4vh 0;
          }
        }
        [data-reveal-media], [data-reveal-copy] { will-change: clip-path, opacity, transform; }
      `}</style>
    </section>
  );
}

function FiliereFragments({
  ring,
  arrowAfter,
}: {
  ring: Ring;
  arrowAfter: string | null;
}) {
  const isLeft = ring.side === "left";
  const words = ring.body.split(" ");

  return (
    <>
      <article
        data-ring
        data-reveal={ring.reveal}
        className="filiera-panel"
      >
        <div
          className={
            "grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-14 " +
            (isLeft ? "" : "md:[direction:rtl]")
          }
        >
          {/* Media */}
          <div className="md:col-span-7 md:[direction:ltr]">
            <div
              className="relative overflow-hidden rounded-sm border border-[color:var(--oro)]/15"
              style={{ aspectRatio: "4 / 3" }}
            >
              <div
                data-reveal-media
                role="img"
                aria-label={ring.alt}
                className="absolute inset-0"
                style={{
                  background: ring.photoTone,
                  boxShadow:
                    ring.reveal === "ember-glow"
                      ? "inset 0 0 120px 20px rgba(179,58,26,0.45)"
                      : undefined,
                }}
              />
              {/* grain */}
              <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.06]" />
              {/* etichetta capitolo */}
              <div className="pointer-events-none absolute left-4 top-4">
                <span className="font-eyebrow rounded-sm border border-[color:var(--oro)]/40 bg-black/35 px-2 py-1 text-[9px] tracking-[0.35em] text-[color:var(--crema)]/85">
                  CAP · {ring.n}
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

          {/* Copy */}
          <div className="md:col-span-5 md:[direction:ltr]">
            <div data-reveal-copy>
              <p className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro)]/85">
                {ring.n} · {ring.kicker}
              </p>
              <h3
                data-etch={ring.reveal === "inset-top" ? true : undefined}
                className="mt-4 text-[color:var(--crema)]"
                style={{
                  fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.01em",
                  fontWeight: 300,
                }}
              >
                {ring.title}
              </h3>
              {ring.reveal === "slide-right" ? (
                <p
                  data-etch-rest={undefined}
                  className="mt-5 text-[color:var(--crema)]/70"
                  style={{ lineHeight: 1.6 }}
                >
                  {words.map((w, i) => (
                    <span key={i} data-word className="inline-block">
                      {w}
                      {i < words.length - 1 ? "\u00A0" : ""}
                    </span>
                  ))}
                </p>
              ) : (
                <p
                  data-etch-rest={ring.reveal === "inset-top" ? true : undefined}
                  className="mt-5 text-[color:var(--crema)]/70"
                  style={{ lineHeight: 1.6 }}
                >
                  {ring.body}
                </p>
              )}
              <p
                data-etch-rest={ring.reveal === "inset-top" ? true : undefined}
                className="font-eyebrow mt-6 text-[10px] tracking-[0.3em] text-[color:var(--crema)]/50"
              >
                {ring.data}
              </p>
              <div className="mt-8" data-etch-rest={ring.reveal === "inset-top" ? true : undefined}>
                <Link
                  to={ring.to}
                  className="font-eyebrow group inline-flex items-center gap-3 border-b border-[color:var(--oro)]/40 pb-1 text-[11px] tracking-[0.3em] text-[color:var(--crema)] transition-colors hover:text-[color:var(--oro)]"
                >
                  SCOPRI {ring.kicker}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {arrowAfter && (
        <div data-arrow className="filiera-arrow">
          <svg
            width="100%"
            height="80"
            viewBox="0 0 300 80"
            fill="none"
            aria-hidden
            className="w-full max-w-[240px]"
          >
            <defs>
              <linearGradient id={`filo-${arrowAfter}`} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#C49A4A" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#B33A1A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#C49A4A" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path
              data-arrow-path
              d="M 5 40 C 90 10, 200 70, 275 40"
              stroke={`url(#filo-${arrowAfter})`}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              data-arrow-path
              d="M 265 32 L 280 40 L 265 48"
              stroke="#C49A4A"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            data-arrow-word
            className="font-eyebrow text-center text-[10px] tracking-[0.3em] text-[color:var(--crema)]/70"
            style={{ maxWidth: "22ch", lineHeight: 1.5 }}
          >
            {arrowAfter.toUpperCase()}
          </span>
        </div>
      )}
    </>
  );
}
