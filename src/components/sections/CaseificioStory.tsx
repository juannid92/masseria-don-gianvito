import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import milkMacro from "@/assets/case-milk-macro.jpg";
import latteImg from "@/assets/case-a-latte.jpg";
import maniImg from "@/assets/case-b-mani.jpg";
import filaturaImg from "@/assets/case-filatura.jpg";
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
  /** posizione broken-grid: colonna, offset verticale (rem), rotazione (deg) */
  col: 1 | 2 | 3 | 4;
  push: number;
  rot: number;
};

// {DA CONFERMARE col cliente — gamma reale}
const PRODUCTS: Product[] = [
  {
    id: "mozzarella",
    name: "Mozzarella",
    tag: "TAG · fresca del giorno",
    line: "Ancora tiepida, con la sua acqua. Va mangiata oggi.",
    img: mozzarellaImg,
    col: 1,
    push: 0,
    rot: -1.2,
  },
  {
    id: "burrata",
    name: "Burrata",
    tag: "TAG · cuore di stracciatella",
    line: "Chiusa a mano, una a una. Dentro, la panna del giorno.",
    img: burrataImg,
    col: 3,
    push: 12,
    rot: 1.4,
  },
  {
    id: "ricotta",
    name: "Ricotta",
    tag: "TAG · dal siero, non dallo scarto",
    line: "Il secondo dono del latte, quando è ancora caldo.",
    img: ricottaImg,
    col: 2,
    push: 24,
    rot: -0.8,
  },
  {
    id: "caciocavallo",
    name: "Caciocavallo",
    tag: "TAG · appeso in cantina",
    line: "Riposa a coppia sulla trave. Il tempo lo scrive.",
    img: caciocavalloImg,
    col: 4,
    push: 6,
    rot: 1.1,
  },
];

/* ────────────────────── MILK COLUMN (SVG) ─────────────────────── */
function MilkColumn({
  liquidRef,
  curdRef,
  stretchRef,
  formRef,
  goldRef,
}: {
  liquidRef: React.RefObject<SVGPathElement | null>;
  curdRef: React.RefObject<SVGPathElement | null>;
  stretchRef: React.RefObject<SVGGElement | null>;
  formRef: React.RefObject<SVGGElement | null>;
  goldRef: React.RefObject<SVGPathElement | null>;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-1/2 w-[240px] -translate-x-1/2 md:w-[320px]"
      style={{ mixBlendMode: "screen" }}
    >
      <svg viewBox="0 0 200 1000" preserveAspectRatio="none" className="h-full w-full">
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

        <path
          ref={liquidRef}
          d="M 100 0 C 130 120, 70 260, 100 400 C 130 540, 70 700, 100 1000"
          fill="none"
          stroke="url(#milkGrad)"
          strokeWidth="70"
          strokeLinecap="round"
          filter="url(#milkBlur)"
        />
        <path
          ref={curdRef}
          d="M 100 0 C 115 180, 85 320, 100 500 C 115 680, 88 820, 100 1000"
          fill="none"
          stroke="url(#milkGrad)"
          strokeWidth="46"
          strokeLinecap="round"
          opacity="0"
        />
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
        <g ref={formRef} opacity="0">
          <ellipse cx="100" cy="200" rx="70" ry="55" fill="url(#milkGrad)" />
          <ellipse cx="100" cy="440" rx="55" ry="45" fill="url(#milkGrad)" />
          <ellipse cx="100" cy="650" rx="65" ry="50" fill="url(#milkGrad)" />
          <ellipse cx="100" cy="860" rx="45" ry="40" fill="url(#milkGrad)" />
        </g>
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

  // INGRESSO · dentro la tina
  const enterRef = useRef<HTMLElement>(null);
  const milkMacroRef = useRef<HTMLDivElement>(null);
  const milkTiltRef = useRef<HTMLDivElement>(null);
  const onMilkTitleRef = useRef<HTMLDivElement>(null);
  const railTempRef = useRef<HTMLSpanElement>(null);

  // stage con colonna
  const stageRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<SVGPathElement>(null);
  const curdRef = useRef<SVGPathElement>(null);
  const stretchRef = useRef<SVGGElement>(null);
  const formRef = useRef<SVGGElement>(null);
  const goldRef = useRef<SVGPathElement>(null);

  // stato 2
  const cagliataRef = useRef<HTMLDivElement>(null);
  const tempoBarRef = useRef<HTMLDivElement>(null);

  const bridgeRef = useRef<HTMLElement>(null);

  const [tempC, setTempC] = useState(18);
  const [diving, setDiving] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* INGRESSO · macro latte immobile che fuma, poi si inclina e arretra */
      // Il testo "Il latte di ogni mattina" affiora SOPRA il latte
      if (enterRef.current) {
        // temperatura del rail: sale continuamente 18→37 sul primo viewport
        ScrollTrigger.create({
          trigger: enterRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
          onUpdate: (self) => {
            const t = 18 + Math.round(self.progress * 19);
            if (railTempRef.current) railTempRef.current.textContent = `${t}°`;
          },
        });

        // inclinazione+arretramento del piano di latte (tilt scrub)
        if (milkTiltRef.current) {
          gsap.to(milkTiltRef.current, {
            rotateX: 42,
            scale: 0.88,
            yPercent: -8,
            ease: "none",
            scrollTrigger: {
              trigger: enterRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        }

        // Titolo "sulla superficie": mask reveal via clip-path che si apre
        if (onMilkTitleRef.current) {
          gsap.fromTo(
            onMilkTitleRef.current,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              ease: "power2.out",
              scrollTrigger: {
                trigger: enterRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
        }
      }

      /* COLONNA LATTE · morph a stati sull'intera stage */
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

        tl.to(liquidRef.current, { opacity: 0, duration: 0.15 }, 0.25)
          .to(curdRef.current, { opacity: 1, duration: 0.15 }, 0.25)
          .to(curdRef.current, { opacity: 0, duration: 0.1 }, 0.5)
          .to(stretchRef.current, { opacity: 1, duration: 0.1 }, 0.5)
          .fromTo(
            stretchRef.current,
            { scaleY: 0.85, transformOrigin: "50% 0%" },
            { scaleY: 1.2, ease: "power2.out", duration: 0.3 },
            0.5,
          )
          .to(stretchRef.current, { opacity: 0, duration: 0.1 }, 0.78)
          .to(formRef.current, { opacity: 1, duration: 0.15 }, 0.78);
      }

      /* STATO 2 · scala termica animata */
      if (cagliataRef.current && tempoBarRef.current) {
        ScrollTrigger.create({
          trigger: cagliataRef.current,
          start: "top 75%",
          end: "bottom 35%",
          scrub: 0.5,
          onUpdate: (self) => {
            const t = 20 + Math.round(self.progress * 17);
            setTempC(t);
            if (tempoBarRef.current) {
              tempoBarRef.current.style.transform = `scaleY(${self.progress})`;
            }
          },
        });
      }

      /* Reveal generici (visibili di default → si limitano ad animare y/opacity) */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      /* Prodotti broken-grid: entrata sfalsata */
      gsap.utils.toArray<HTMLElement>("[data-product]").forEach((el, i) => {
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: (i % 3) * 0.06,
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
      });

      /* BRIDGE · filo bianco → oro */
      if (bridgeRef.current) {
        gsap.to(goldRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: bridgeRef.current, start: "top 80%" },
        });
        gsap.to(formRef.current, {
          opacity: 0,
          duration: 0.6,
          scrollTrigger: { trigger: bridgeRef.current, start: "top 75%" },
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

  useEffect(() => {
    if (reduced) return;
    const lenis = (window as unknown as {
      __lenis?: { on: (e: string, cb: () => void) => void };
    }).__lenis;
    if (!lenis) return;
    lenis.on("scroll", () => ScrollTrigger.update());
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
      {/* ─────────── PERSISTENT NAV (minima) ─────────── */}
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
          02 / 04
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

      {/* ═══════════════════════════════════════════════════════════
          INGRESSO · DENTRO LA TINA (NO HERO)
          Solo materia + rail verticale a sinistra. Nessun titolo qui.
         ═══════════════════════════════════════════════════════════ */}
      <section
        ref={enterRef}
        aria-label="Dentro la tina"
        className="relative h-[180svh] w-full"
      >
        {/* piano di latte pinnato, si inclina scendendo */}
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden [perspective:1200px]">
          <div
            ref={milkMacroRef}
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: `url(${milkMacro})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            ref={milkTiltRef}
            aria-hidden
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${milkMacro})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transformOrigin: "50% 100%",
              transform: "rotateX(0deg) scale(1)",
            }}
          />
          {/* grade caldo minimale (leggibilità del titolo su latte scuro-ambra) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 50% 55%, transparent 0%, rgba(26,18,16,0.5) 85%)",
            }}
          />

          {/* RAIL VERTICALE SINISTRO · marginalia (l'unico testo) */}
          <div className="pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 md:left-8">
            <div
              className="flex origin-left -rotate-90 items-center gap-6 whitespace-nowrap"
              style={{ transform: "rotate(-90deg) translateY(-50%)" }}
            >
              <span className="font-eyebrow text-[10px] tracking-[0.42em] text-[color:var(--carbone)]/70">
                CASEIFICIO · II · NOCI
              </span>
              <span aria-hidden className="h-px w-10 bg-[color:var(--carbone)]/40" />
              <span className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--bordeaux)]">
                18° →{" "}
                <span ref={railTempRef} className="text-[color:var(--terracotta)]">
                  18°
                </span>{" "}
                → 37°
              </span>
            </div>
          </div>

          {/* Titolo che affiora SULLA SUPERFICIE del latte (mask reveal) */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center pb-[18vh]">
            <div
              ref={onMilkTitleRef}
              className="font-display px-6 text-center italic leading-[0.95] text-[color:var(--carbone)]/85 mix-blend-multiply"
              style={{
                fontSize: "clamp(2.4rem, 7vw, 6.2rem)",
                clipPath: "inset(0 100% 0 0)",
                letterSpacing: "-0.01em",
              }}
            >
              Il latte di ogni mattina
            </div>
          </div>

          {/* Scroll cue */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2 text-[color:var(--carbone)]/70">
            <span className="font-eyebrow text-[10px] tracking-[0.32em]">
              scendi nella tina
            </span>
            <span
              aria-hidden
              className="h-8 w-px animate-pulse bg-gradient-to-b from-[color:var(--carbone)]/70 to-transparent"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STAGE · 4 stati con colonna di latte sticky (SVG morph).
          Il testo cambia POSIZIONE ad ogni stato.
         ═══════════════════════════════════════════════════════════ */}
      <div ref={stageRef} className="relative">
        <div className="pointer-events-none sticky top-0 z-10 h-[100svh] w-full">
          <MilkColumn
            liquidRef={liquidRef}
            curdRef={curdRef}
            stretchRef={stretchRef}
            formRef={formRef}
            goldRef={goldRef}
          />
        </div>

        <div className="relative z-20 -mt-[100svh]">
          {/* ══════ STATO 2 · LA CAGLIATA — testo = etichette DESTRA ══════ */}
          <section
            ref={cagliataRef}
            className="relative min-h-[130svh] w-full overflow-hidden"
            aria-label="Stato 2 · La cagliata"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${maniImg})`,
                backgroundSize: "cover",
                backgroundPosition: "left center",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(90deg, rgba(26,18,16,0.35) 0%, rgba(26,18,16,0.55) 55%, rgba(26,18,16,0.95) 100%)",
              }}
            />

            {/* etichette da laboratorio a DESTRA, allineate a scala termica verticale */}
            <div className="absolute inset-y-0 right-0 flex w-full max-w-md items-center px-6 md:px-10">
              <div className="flex w-full items-stretch gap-6">
                {/* scala termica */}
                <div
                  aria-hidden
                  className="relative h-[62vh] w-px shrink-0 bg-[color:var(--crema)]/15"
                >
                  <div
                    ref={tempoBarRef}
                    className="absolute inset-0 w-px origin-top bg-[color:var(--terracotta)]"
                    style={{ transform: "scaleY(0)" }}
                  />
                  {[20, 25, 30, 35, 37].map((t, i) => (
                    <span
                      key={t}
                      className="font-eyebrow absolute -left-8 text-[9px] tracking-[0.28em] text-[color:var(--crema)]/50"
                      style={{ top: `${(i / 4) * 100}%` }}
                    >
                      {t}°
                    </span>
                  ))}
                </div>

                {/* etichette process */}
                <ul className="flex-1 space-y-8" data-reveal>
                  <li>
                    <p className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)]">
                      STATO 02 / CAGLIATA
                    </p>
                    <p className="font-display mt-1 text-[color:var(--crema)] text-2xl italic md:text-3xl">
                      {tempC}° · l'attesa
                    </p>
                  </li>
                  <li className="border-l border-[color:var(--oro)]/40 pl-4">
                    <p className="font-eyebrow text-[10px] tracking-[0.28em] text-[color:var(--crema)]/55">
                      OP · caglio naturale
                    </p>
                    <p className="font-sans mt-1 text-sm text-[color:var(--crema)]/85">
                      30 minuti di riposo. Nessuna agitazione.
                    </p>
                  </li>
                  <li className="border-l border-[color:var(--oro)]/40 pl-4">
                    <p className="font-eyebrow text-[10px] tracking-[0.28em] text-[color:var(--crema)]/55">
                      DEC · a mano
                    </p>
                    <p className="font-sans mt-1 text-sm text-[color:var(--crema)]/85">
                      La rottura la decide il polso, non un timer.
                    </p>
                  </li>
                  <li className="border-l border-[color:var(--crema)]/15 pl-4">
                    <p className="font-eyebrow text-[9px] tracking-[0.28em] text-[color:var(--crema)]/40">
                      Tempi DA CONFERMARE
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ══════ STATO 3 · LA FILATURA — testo = didascalia BASSA ══════ */}
          <section
            className="relative min-h-[140svh] w-full overflow-hidden"
            aria-label="Stato 3 · La filatura"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${filaturaImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, rgba(26,18,16,0.25) 40%, rgba(26,18,16,0.95) 100%)",
              }}
            />

            {/* didascalia bassa, corsivo Fraunces */}
            <figcaption
              data-reveal
              className="absolute inset-x-0 bottom-[14vh] mx-auto max-w-2xl px-6 text-center text-[color:var(--crema)]"
            >
              <span className="font-eyebrow inline-block text-[10px] tracking-[0.32em] text-[color:var(--oro)]">
                — stato 03 · filatura · 90° · mani nude —
              </span>
              <p
                className="font-display mt-4 italic leading-[1.05]"
                style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)" }}
              >
                Il filo{" "}
                <span className="text-[color:var(--terracotta)]">
                  non si spezza
                </span>{" "}
                mai. Non da noi.
              </p>
              <p className="font-sans mt-3 text-xs text-[color:var(--crema)]/70 md:text-sm">
                Come la filiera: se tieni ferma la mano dal primo gesto
                all'ultimo, il bianco tiene.
              </p>
            </figcaption>

            {/* marginalia laterale — piccolo cartellino tempi */}
            <div className="pointer-events-none absolute right-6 top-1/3 hidden md:block">
              <div className="border border-[color:var(--oro)]/40 bg-[color:var(--carbone)]/60 px-3 py-2 text-[color:var(--crema)]/85 backdrop-blur">
                <p className="font-eyebrow text-[9px] tracking-[0.32em] text-[color:var(--oro)]">
                  N° 03
                </p>
                <p className="font-eyebrow mt-1 text-[9px] tracking-[0.28em]">
                  acqua · 90°
                </p>
                <p className="font-eyebrow text-[9px] tracking-[0.28em]">
                  tirata · +40 cm
                </p>
              </div>
            </div>
          </section>

          {/* ══════ STATO 4 · LE FORME & IL TEMPO — targhette broken-grid ══════ */}
          <section
            className="relative min-h-[100svh] w-full overflow-hidden pb-40 pt-24"
            aria-label="Stato 4 · Le forme e il tempo"
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
                  "linear-gradient(180deg, rgba(26,18,16,0.95) 0%, rgba(26,18,16,0.9) 100%)",
              }}
            />

            {/* Nessun titolo grande centrato. Solo una marginalia in alto a destra. */}
            <div className="mx-auto max-w-6xl px-6 md:px-10">
              <div className="flex items-start justify-end" data-reveal>
                <p className="font-eyebrow max-w-xs text-right text-[10px] tracking-[0.32em] text-[color:var(--crema)]/55">
                  STATO 04 / FORME · quattro modi di chiamare la stessa mattina
                </p>
              </div>

              {/* broken grid a 4 colonne su desktop */}
              <ul className="mt-16 grid grid-cols-2 gap-x-8 gap-y-20 md:mt-24 md:grid-cols-4 md:gap-x-6">
                {PRODUCTS.map((p) => (
                  <li
                    key={p.id}
                    data-product
                    className="group relative"
                    style={{
                      gridColumn: `${p.col} / span 1`,
                      marginTop: `${p.push * 4}px`,
                      transform: `rotate(${p.rot}deg)`,
                    }}
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[color:var(--marrone)]/40">
                      <img
                        src={p.img}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />
                    </div>
                    {/* targhetta da caseificio */}
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-eyebrow text-[9px] tracking-[0.32em] text-[color:var(--oro)]">
                          {p.tag}
                        </p>
                        <h3
                          className="font-display mt-1 leading-none text-[color:var(--crema)]"
                          style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)" }}
                        >
                          {p.name}
                        </h3>
                      </div>
                      <span
                        aria-hidden
                        className="mt-2 h-px w-6 shrink-0 bg-[color:var(--oro)]/60"
                      />
                    </div>
                    <p className="font-sans mt-2 max-w-[26ch] text-xs leading-relaxed text-[color:var(--crema)]/70">
                      {p.line}
                    </p>
                  </li>
                ))}
              </ul>

              <p className="font-eyebrow mt-20 text-right text-[10px] tracking-[0.28em] text-[color:var(--crema)]/40">
                Gamma completa DA CONFERMARE — mozzarella, burrata, stracciatella,
                nodini, caciocavallo, ricotta, scamorza
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* ══════════════ BRIDGE → MACELLERIA ══════════════ */}
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
              "linear-gradient(180deg, rgba(26,18,16,0.9) 0%, rgba(110,26,20,0.55) 50%, rgba(26,18,16,0.95) 100%)",
          }}
        />

        {/* filo d'oro esce dal centro come continuazione della colonna */}
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
            strokeWidth="1.3"
            strokeOpacity="0.75"
          />
        </svg>

        <div className="mx-auto flex min-h-[95svh] max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p
            data-reveal
            className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)]"
          >
            — il filo cambia colore —
          </p>
          <p
            data-reveal
            className="font-display mt-8 text-balance italic leading-[1.05] text-[color:var(--crema)]"
            style={{ fontSize: "clamp(1.6rem, 3.4vw, 2.6rem)" }}
          >
            E dallo stesso pascolo, dalle stesse bestie,{" "}
            <span className="text-[color:var(--terracotta)]">arriva la carne.</span>
          </p>

          <button
            data-reveal
            onClick={goMacelleria}
            className="group mt-14 inline-flex items-center gap-4 border border-[color:var(--oro)]/40 px-8 py-4 text-[color:var(--crema)] transition-colors hover:border-[color:var(--oro)] hover:bg-[color:var(--oro)]/10"
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
