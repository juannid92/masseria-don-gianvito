import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import latteImg from "@/assets/case-a-latte.jpg";
import maniImg from "@/assets/case-b-mani.jpg";
import filaturaImg from "@/assets/case-filatura.jpg";
import formeImg from "@/assets/case-c-forme.jpg";
import stagionaturaImg from "@/assets/case-d-stagionatura.jpg";
import carneImg from "@/assets/case-bridge-carne.jpg";

import mozzarellaImg from "@/assets/case-prod-mozzarella.jpg";
import burrataImg from "@/assets/case-prod-burrata.jpg";
import caciocavalloImg from "@/assets/case-prod-caciocavallo.jpg";
import ricottaImg from "@/assets/case-prod-ricotta.jpg";

/* ───────────────────────────── DATA ───────────────────────────── */

const FILIERA = [
  { label: "Allevamento", to: "/allevamento" as const, active: false },
  { label: "Caseificio", to: "/caseificio" as const, active: true },
  { label: "Macelleria", to: "/macelleria" as const, active: false },
  { label: "Braceria", to: "/braceria" as const, active: false },
];

type Product = {
  id: string;
  name: string;
  tag: string;
  line: string;
  img: string;
};

// {DA CONFERMARE col cliente — gamma reale}
const PRODUCTS: Product[] = [
  {
    id: "mozzarella",
    name: "Mozzarella",
    tag: "Fatta al mattino",
    line: "Ancora tiepida, con la sua acqua. Va mangiata oggi.",
    img: mozzarellaImg,
  },
  {
    id: "burrata",
    name: "Burrata",
    tag: "Cuore di stracciatella",
    line: "Chiusa a mano, una a una. Dentro, la panna del giorno.",
    img: burrataImg,
  },
  {
    id: "ricotta",
    name: "Ricotta",
    tag: "Dal siero, non dallo scarto",
    line: "Il secondo dono del latte, quando è ancora caldo.",
    img: ricottaImg,
  },
  {
    id: "caciocavallo",
    name: "Caciocavallo",
    tag: "Appeso, in attesa",
    line: "Riposa a coppia sulla trave. Il tempo lo scrive.",
    img: caciocavalloImg,
  },
];

/* ────────────────────── MILK COLUMN (SVG) ─────────────────────── */
/**
 * Colonna di latte SVG: 3 path che coprono i 4 stati.
 * - pathLiquid: colata larga con "gocce" (stato 1)
 * - pathCurd:   massa più stretta e irregolare (stato 2)
 * - pathStretch: stringhe verticali lunghissime (stato 3)
 * - pathForm:   raccolta in "gocce/forme" chiuse (stato 4)
 * Morph via attributeplugin (semplice: opacity+scaleY tra 4 path preset).
 */
function MilkColumn({
  columnRef,
  liquidRef,
  curdRef,
  stretchRef,
  formRef,
  goldRef,
}: {
  columnRef: React.RefObject<HTMLDivElement>;
  liquidRef: React.RefObject<SVGPathElement>;
  curdRef: React.RefObject<SVGPathElement>;
  stretchRef: React.RefObject<SVGGElement>;
  formRef: React.RefObject<SVGGElement>;
  goldRef: React.RefObject<SVGPathElement>;
}) {
  return (
    <div
      ref={columnRef}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-[260px] md:w-[320px]"
      style={{ mixBlendMode: "screen" }}
    >
      <svg
        viewBox="0 0 200 1000"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="milkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2E8D5" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#F2E8D5" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#F2E8D5" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2E8D5" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#C49A4A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#B33A1A" stopOpacity="0.85" />
          </linearGradient>
          <filter id="milkBlur">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
        </defs>

        {/* STATO 1 · liquido: colata larga con leggera ondulazione */}
        <path
          ref={liquidRef}
          d="M 100 0 C 130 120, 70 260, 100 400 C 130 540, 70 700, 100 1000"
          fill="none"
          stroke="url(#milkGrad)"
          strokeWidth="70"
          strokeLinecap="round"
          filter="url(#milkBlur)"
        />

        {/* STATO 2 · cagliata: massa più stretta e irregolare */}
        <path
          ref={curdRef}
          d="M 100 0 C 115 180, 85 320, 100 500 C 115 680, 88 820, 100 1000"
          fill="none"
          stroke="url(#milkGrad)"
          strokeWidth="46"
          strokeLinecap="round"
          opacity="0"
        />

        {/* STATO 3 · filatura: 5 fili sottili paralleli */}
        <g ref={stretchRef} opacity="0">
          {[70, 88, 100, 112, 130].map((x, i) => (
            <path
              key={i}
              d={`M ${x} 0 C ${x - 4} 250, ${x + 4} 500, ${x} 750 L ${x} 1000`}
              fill="none"
              stroke="url(#milkGrad)"
              strokeWidth={i === 2 ? "8" : "5"}
              strokeLinecap="round"
              opacity="0.85"
            />
          ))}
        </g>

        {/* STATO 4 · forme: gocce chiuse impilate */}
        <g ref={formRef} opacity="0">
          <ellipse cx="100" cy="200" rx="70" ry="55" fill="url(#milkGrad)" />
          <ellipse cx="100" cy="440" rx="55" ry="45" fill="url(#milkGrad)" />
          <ellipse cx="100" cy="650" rx="65" ry="50" fill="url(#milkGrad)" />
          <ellipse cx="100" cy="860" rx="45" ry="40" fill="url(#milkGrad)" />
        </g>

        {/* FILO D'ORO finale: sostituisce il bianco al bridge */}
        <path
          ref={goldRef}
          d="M 100 0 C 130 200, 70 400, 100 600 C 130 800, 70 950, 100 1000"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1400"
          strokeDashoffset="1400"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

/* ───────────────────────── COMPONENT ─────────────────────── */

export function CaseificioStory() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const rootRef = useRef<HTMLDivElement>(null);

  // stato 1 — atterraggio
  const stageRef = useRef<HTMLDivElement>(null);
  const albaImgRef = useRef<HTMLDivElement>(null);
  const albaCoverRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<HTMLDivElement>(null);

  // colonna latte
  const columnRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<SVGPathElement>(null);
  const curdRef = useRef<SVGPathElement>(null);
  const stretchRef = useRef<SVGGElement>(null);
  const formRef = useRef<SVGGElement>(null);
  const goldRef = useRef<SVGPathElement>(null);

  // stato 2
  const tempoRef = useRef<HTMLDivElement>(null);
  const tempoBarRef = useRef<HTMLDivElement>(null);

  // bridge
  const bridgeRef = useRef<HTMLElement>(null);

  const [tempC, setTempC] = useState(20);
  const [diving, setDiving] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* INTRO · raccogli il ponte dell'allevamento (cremoso) → alba + vapore */
      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      introTl
        .to(albaCoverRef.current, { autoAlpha: 0, duration: 1.4 }, 0)
        .fromTo(
          albaImgRef.current,
          { scale: 1.2, filter: "brightness(0.55) saturate(0.5)" },
          { scale: 1.05, filter: "brightness(0.9) saturate(1)", duration: 2.2 },
          0,
        )
        .from(
          "[data-alba-reveal]",
          { yPercent: 110, duration: 1, stagger: 0.1 },
          0.6,
        )
        .from(
          "[data-alba-fade]",
          { opacity: 0, y: 18, duration: 0.7, stagger: 0.08 },
          1.1,
        );

      // vapore lento in alto
      if (steamRef.current) {
        gsap.to(steamRef.current, {
          yPercent: -35,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: ".alba-sec",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* COLONNA LATTE · morph a stati lungo l'intera stage */
      // stage copre stati 1-4. Progress 0→1 = 0..1 (alba) 1..2 (cagliata) 2..3 (filatura) 3..4 (forme)
      // Usiamo un'unica timeline scrubbed sul contenitore stageRef.
      if (stageRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        // Segmento 0→0.25 : liquido stabile (stato 1)
        // Segmento 0.25→0.5 : liquido→cagliata
        tl.to(liquidRef.current, { opacity: 0, duration: 0.15 }, 0.25)
          .to(curdRef.current, { opacity: 1, duration: 0.15 }, 0.25)

          // Segmento 0.5→0.75 : cagliata→filatura (stretch verticale del gruppo)
          .to(curdRef.current, { opacity: 0, duration: 0.1 }, 0.5)
          .to(stretchRef.current, { opacity: 1, duration: 0.1 }, 0.5)
          .fromTo(
            stretchRef.current,
            { scaleY: 0.85, transformOrigin: "50% 0%" },
            { scaleY: 1.15, ease: "power2.out", duration: 0.25 },
            0.5,
          )

          // Segmento 0.75→1 : filatura→forme
          .to(stretchRef.current, { opacity: 0, duration: 0.1 }, 0.78)
          .to(formRef.current, { opacity: 1, duration: 0.15 }, 0.78);
      }

      /* STATO 2 · scala tempo/temperatura */
      if (tempoRef.current && tempoBarRef.current) {
        ScrollTrigger.create({
          trigger: tempoRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 0.5,
          onUpdate: (self) => {
            const t = 20 + Math.round(self.progress * 17); // 20°→37°
            setTempC(t);
            if (tempoBarRef.current) {
              tempoBarRef.current.style.transform = `scaleY(${self.progress})`;
            }
          },
        });
      }

      /* Reveal generici sui blocchi copy */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      /* Reveal prodotti */
      gsap.utils.toArray<HTMLElement>("[data-product]").forEach((el, i) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: i * 0.05,
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });

      /* BRIDGE · bianco → oro */
      if (bridgeRef.current) {
        gsap.to(goldRef.current, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bridgeRef.current,
            start: "top 80%",
          },
        });
        gsap.to(formRef.current, {
          opacity: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: bridgeRef.current,
            start: "top 70%",
          },
        });
      }
    }, rootRef);

    const onReady = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(onReady);
    window.addEventListener("load", onReady);

    return () => {
      window.removeEventListener("load", onReady);
      ctx.revert();
    };
  }, [reduced]);

  // Sync Lenis ↔ ScrollTrigger
  useEffect(() => {
    if (reduced) return;
    const lenis = (window as unknown as {
      __lenis?: { on: (e: string, cb: () => void) => void };
    }).__lenis;
    if (!lenis) return;
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
  }, [reduced]);

  const goMacelleria = () => {
    if (reduced) {
      navigate({ to: "/macelleria" });
      return;
    }
    setDiving(true);
    setTimeout(() => navigate({ to: "/macelleria" }), 850);
  };

  return (
    <div
      ref={rootRef}
      className="relative bg-[color:var(--carbone)] text-[color:var(--crema)]"
    >
      {/* ─────────── PERSISTENT NAV ─────────── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
        <Link
          to="/"
          className="pointer-events-auto font-eyebrow group inline-flex items-center gap-2 text-[11px] text-[color:var(--crema)]/85 transition-colors hover:text-[color:var(--oro)]"
          aria-label="Torna alla masseria"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">
            ←
          </span>
          La masseria
        </Link>
        <p className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)] md:text-[11px]">
          02 / 04 — Caseificio
        </p>
      </div>

      <nav
        aria-label="Filiera"
        className="pointer-events-none fixed inset-x-0 top-16 z-50 mx-auto hidden max-w-3xl items-center justify-center gap-6 md:flex"
      >
        {FILIERA.map((f, i) => (
          <div key={f.to} className="pointer-events-auto flex items-center gap-6">
            <Link
              to={f.to}
              className={[
                "font-eyebrow text-[10px] tracking-[0.28em] transition-colors",
                f.active
                  ? "text-[color:var(--oro)]"
                  : "text-[color:var(--crema)]/55 hover:text-[color:var(--crema)]",
              ].join(" ")}
              aria-current={f.active ? "page" : undefined}
            >
              <span className="text-[color:var(--oro)]/70 mr-2">0{i + 1}</span>
              {f.label}
            </Link>
            {i < FILIERA.length - 1 && (
              <span aria-hidden className="h-px w-6 bg-[color:var(--crema)]/15" />
            )}
          </div>
        ))}
      </nav>

      {/* ══════════════════════════════════════════════════════
          STAGE = contenitore continuo dei 4 stati.
          La colonna di latte è UN SOLO elemento position:sticky
          che vive dentro qui e cambia stato via GSAP scrub.
         ══════════════════════════════════════════════════════ */}
      <div ref={stageRef} className="relative">
        {/* Colonna latte sticky, alta 100svh, cambia stato lungo la stage */}
        <div className="pointer-events-none sticky top-0 z-10 h-[100svh] w-full">
          <MilkColumn
            columnRef={columnRef}
            liquidRef={liquidRef}
            curdRef={curdRef}
            stretchRef={stretchRef}
            formRef={formRef}
            goldRef={goldRef}
          />
        </div>

        {/* Sposto tutto il contenuto sopra la colonna con margin negativo
            così i due layer occupano lo stesso spazio verticale */}
        <div className="relative z-20 -mt-[100svh]">
          {/* ════════ STATO 1 · L'ALBA & IL VAPORE ════════ */}
          <section
            className="alba-sec relative min-h-[100svh] w-full overflow-hidden"
            aria-label="Stato 1 · L'alba e il vapore"
          >
            <div
              ref={albaImgRef}
              aria-hidden
              className="absolute inset-0 -z-10 will-change-transform"
              style={{
                backgroundImage: `url(${latteImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(26,18,16,0.65) 0%, rgba(26,18,16,0.25) 40%, rgba(26,18,16,0.9) 100%)",
              }}
            />
            {/* vapore */}
            <div
              ref={steamRef}
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 top-1/3 mix-blend-screen"
              style={{
                background:
                  "radial-gradient(ellipse 45% 55% at 50% 75%, rgba(242,232,213,0.22) 0%, transparent 70%)",
              }}
            />
            {/* cover cremoso (raccoglie il ponte allevamento) */}
            <div
              ref={albaCoverRef}
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 55%, rgba(242,232,213,0.95) 0%, rgba(196,154,74,0.7) 35%, rgba(26,18,16,0.95) 80%)",
              }}
            />

            {/* parola-fantasma "LATTE" */}
            <p
              aria-hidden
              className="font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap italic text-[color:var(--crema)]/[0.055]"
              style={{
                fontSize: "clamp(9rem, 26vw, 24rem)",
                letterSpacing: "-0.02em",
              }}
            >
              LATTE
            </p>

            {/* Copy — spostata a sinistra per non coprire la colonna */}
            <div className="absolute inset-0 flex flex-col items-start justify-center px-6 pt-24 md:pl-[8vw] md:pt-0">
              <div className="max-w-xl">
                <div className="overflow-hidden">
                  <p
                    data-alba-reveal
                    className="font-eyebrow text-[11px] tracking-[0.32em] text-[color:var(--oro)] md:text-xs"
                  >
                    02 — Dalla terra alla brace · Il secondo anello
                  </p>
                </div>

                <h1
                  className="font-display mt-6 text-balance leading-[0.95] text-[color:var(--crema)]"
                  style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.6rem)" }}
                >
                  <span className="block overflow-hidden">
                    <span data-alba-reveal className="block">
                      Il latte di ogni
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span
                      data-alba-reveal
                      className="block italic text-[color:var(--terracotta)]"
                    >
                      mattina.
                    </span>
                  </span>
                </h1>

                <div className="mt-8 max-w-md overflow-hidden">
                  <p
                    data-alba-reveal
                    className="font-sans text-sm leading-relaxed text-[color:var(--crema)]/85 md:text-base"
                  >
                    Quello che munciamo all'alba è delle bestie che hai appena
                    lasciato al pascolo. Fuma nel secchio d'acciaio. Non
                    aspetta.
                  </p>
                </div>
              </div>
            </div>

            <div
              data-alba-fade
              className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3 text-[color:var(--crema)]/70"
            >
              <span className="font-eyebrow text-[10px] tracking-[0.28em]">
                Scendi: il bianco diventa
              </span>
              <span
                aria-hidden
                className="h-8 w-px animate-pulse bg-gradient-to-b from-[color:var(--crema)]/70 to-transparent"
              />
            </div>
          </section>

          {/* ════════ STATO 2 · LA CAGLIATA ════════ */}
          <section
            ref={tempoRef}
            className="relative min-h-[110svh] w-full overflow-hidden"
            aria-label="Stato 2 · La cagliata"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${maniImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(26,18,16,0.92) 0%, rgba(61,42,30,0.55) 40%, rgba(26,18,16,0.92) 100%)",
              }}
            />

            <div className="mx-auto flex min-h-[110svh] max-w-6xl items-center px-6 md:px-10">
              {/* Scala termica a sinistra */}
              <aside
                aria-hidden
                className="mr-8 hidden h-[60vh] w-px shrink-0 bg-[color:var(--crema)]/15 md:block"
              >
                <div className="relative h-full w-px">
                  <div
                    ref={tempoBarRef}
                    className="absolute inset-0 w-px origin-top bg-[color:var(--terracotta)]"
                    style={{ transform: "scaleY(0)" }}
                  />
                </div>
              </aside>

              <div className="max-w-xl" data-reveal>
                <p className="font-eyebrow text-[11px] tracking-[0.32em] text-[color:var(--oro)]">
                  Stato 02 · La cagliata
                </p>
                <p className="font-display mt-3 text-[color:var(--oro)]/85 text-3xl italic md:text-4xl">
                  {tempC}° · l'attesa
                </p>
                <h2
                  className="font-display mt-4 text-balance leading-[0.98] text-[color:var(--crema)]"
                  style={{ fontSize: "clamp(2.2rem, 5vw, 4.4rem)" }}
                >
                  Il liquido{" "}
                  <span className="italic text-[color:var(--terracotta)]">
                    si rapprende.
                  </span>
                </h2>
                <p className="font-sans mt-6 max-w-md text-base leading-relaxed text-[color:var(--crema)]/85">
                  Nessuna scorciatoia. La temperatura sale piano, il caglio
                  entra, e poi ci sono solo le mani a decidere quando la massa
                  è pronta. Come si è sempre fatto.
                </p>
                <p className="font-eyebrow mt-6 text-[10px] tracking-[0.28em] text-[color:var(--crema)]/45">
                  Tempi di lavorazione DA CONFERMARE
                </p>
              </div>
            </div>
          </section>

          {/* ════════ STATO 3 · LA FILATURA ════════ */}
          <section
            className="relative min-h-[130svh] w-full overflow-hidden"
            aria-label="Stato 3 · La filatura"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${filaturaImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center right",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(90deg, rgba(26,18,16,0.95) 0%, rgba(26,18,16,0.75) 40%, rgba(26,18,16,0.25) 100%)",
              }}
            />

            <div className="mx-auto flex min-h-[130svh] max-w-6xl items-center px-6 md:px-10">
              <div className="max-w-xl" data-reveal>
                <p className="font-eyebrow text-[11px] tracking-[0.32em] text-[color:var(--oro)]">
                  Stato 03 · La filatura
                </p>
                <h2
                  className="font-display mt-4 text-balance leading-[0.98] text-[color:var(--crema)]"
                  style={{ fontSize: "clamp(2.2rem, 5.4vw, 4.8rem)" }}
                >
                  Un filo che{" "}
                  <span className="italic text-[color:var(--terracotta)]">
                    non si spezza.
                  </span>
                </h2>
                <p className="font-sans mt-6 max-w-md text-base leading-relaxed text-[color:var(--crema)]/85">
                  La pasta si tira, si allunga, si piega. Come la filiera: se
                  tieni la mano ferma dal primo gesto all'ultimo, il filo non
                  si spezza. Da noi non si spezza mai.
                </p>
                <p className="font-eyebrow mt-6 inline-block border-l border-[color:var(--oro)]/50 pl-3 text-[10px] tracking-[0.28em] text-[color:var(--crema)]/60">
                  90° · acqua bollente · mani nude
                </p>
              </div>
            </div>
          </section>

          {/* ════════ STATO 4 · LA FORMA & IL TEMPO ════════ */}
          <section
            className="relative min-h-[100svh] w-full overflow-hidden pb-32 pt-24"
            aria-label="Stato 4 · La forma e il tempo"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${stagionaturaImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(26,18,16,0.95) 0%, rgba(26,18,16,0.85) 100%)",
              }}
            />

            <div className="mx-auto max-w-6xl px-6 md:px-10">
              <div className="max-w-2xl" data-reveal>
                <p className="font-eyebrow text-[11px] tracking-[0.32em] text-[color:var(--oro)]">
                  Stato 04 · La forma e il tempo
                </p>
                <h2
                  className="font-display mt-4 text-balance leading-[0.98] text-[color:var(--crema)]"
                  style={{ fontSize: "clamp(2.2rem, 5.4vw, 4.8rem)" }}
                >
                  Il bianco{" "}
                  <span className="italic text-[color:var(--terracotta)]">
                    prende forma.
                  </span>
                </h2>
                <p className="font-sans mt-6 max-w-lg text-base leading-relaxed text-[color:var(--crema)]/85">
                  Quattro modi di chiamare la stessa mattina. Alcuni si
                  mangiano oggi, altri riposano sulla trave. Noi sappiamo
                  quando sono pronti.
                </p>
              </div>

              <ul className="mt-16 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2 lg:mt-24">
                {PRODUCTS.map((p, i) => (
                  <li
                    key={p.id}
                    data-product
                    className={[
                      "group relative",
                      i % 2 === 1 ? "md:mt-24" : "",
                    ].join(" ")}
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[color:var(--marrone)]/40">
                      <img
                        src={p.img}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 55%, rgba(26,18,16,0.85) 100%)",
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 pb-4">
                        <p className="font-eyebrow text-[10px] tracking-[0.28em] text-[color:var(--oro)]">
                          {p.tag}
                        </p>
                        <span
                          aria-hidden
                          className="h-px w-8 bg-[color:var(--oro)]/60"
                        />
                      </div>
                    </div>
                    <div className="mt-5">
                      <h3
                        className="font-display leading-none text-[color:var(--crema)]"
                        style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.2rem)" }}
                      >
                        {p.name}
                      </h3>
                      <p className="font-sans mt-3 max-w-sm text-sm leading-relaxed text-[color:var(--crema)]/75">
                        {p.line}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="font-eyebrow mt-16 text-center text-[10px] tracking-[0.28em] text-[color:var(--crema)]/45">
                Gamma completa DA CONFERMARE col cliente
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* ══════════════ BRIDGE → MACELLERIA (bianco → oro) ══════════════ */}
      <section
        ref={bridgeRef}
        className="relative min-h-[95svh] w-full overflow-hidden"
        aria-label="Ponte verso la macelleria"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${carneImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.55) saturate(1.05)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,18,16,0.85) 0%, rgba(110,26,20,0.6) 50%, rgba(26,18,16,0.95) 100%)",
          }}
        />

        {/* filo d'oro verticale che intreccia il bianco */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <path
            d="M 720 0 C 780 200, 660 400, 720 600 S 780 800, 720 900"
            fill="none"
            stroke="var(--oro)"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />
        </svg>

        <div className="mx-auto flex min-h-[95svh] max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p
            data-reveal
            className="font-eyebrow text-[11px] tracking-[0.32em] text-[color:var(--oro)]"
          >
            Il filo cambia colore
          </p>
          <h2
            data-reveal
            className="font-display mt-6 text-balance leading-[0.98] text-[color:var(--crema)]"
            style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)" }}
          >
            E dallo stesso pascolo,{" "}
            <span className="italic text-[color:var(--terracotta)]">
              arriva la carne.
            </span>
          </h2>
          <p
            data-reveal
            className="font-sans mt-8 max-w-lg text-base leading-relaxed text-[color:var(--crema)]/85"
          >
            Le stesse bestie del primo capitolo, cresciute con il nostro grano.
            La macelleria è la stanza a fianco.
          </p>

          <button
            data-reveal
            onClick={goMacelleria}
            className="group mt-12 inline-flex items-center gap-4 border border-[color:var(--oro)]/40 px-8 py-4 text-[color:var(--crema)] transition-colors hover:border-[color:var(--oro)] hover:bg-[color:var(--oro)]/10"
            aria-label="Continua verso la macelleria"
          >
            <span className="font-eyebrow text-[11px] tracking-[0.32em]">
              Continua · La Macelleria
            </span>
            <span
              aria-hidden
              className="h-px w-8 bg-[color:var(--oro)] transition-all group-hover:w-16"
            />
            <span aria-hidden className="text-[color:var(--oro)]">
              →
            </span>
          </button>

          <Link
            data-reveal
            to="/allevamento"
            className="font-eyebrow group mt-8 inline-flex items-center gap-2 text-[10px] tracking-[0.28em] text-[color:var(--crema)]/55 transition-colors hover:text-[color:var(--crema)]"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            Torna all'allevamento
          </Link>
        </div>
      </section>

      {/* DIVE overlay */}
      {diving && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100]"
          style={{
            background:
              "radial-gradient(circle at 50% 55%, rgba(110,26,20,0.98) 0%, rgba(26,18,16,1) 70%)",
            animation: "fadeIn 0.85s ease-out forwards",
          }}
        />
      )}
    </div>
  );
}
