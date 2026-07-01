import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import bancoImg from "@/assets/macel-banco.jpg";

/* ─────────────────────────── DATA ─────────────────────────── */

type Cut = {
  id: string;
  name: string;
  weight: string;
  cottura: string;
  /** viewBox coords of a rounded rect region on the bovine silhouette (100x60 viewBox) */
  x: number;
  y: number;
  w: number;
  h: number;
  /** callout anchor px on the same viewBox */
  cx: number;
  cy: number;
  /** provenance link back to /allevamento animal */
  from: string;
  fromNote: string;
};

const CUTS: Cut[] = [
  { id: "filetto",    name: "Filetto",    weight: "≈ 350 g", cottura: "brace alta · scottatura rapida",
    x: 55, y: 20, w: 10, h: 8, cx: 60, cy: 8,   from: "N° 047", fromNote: "Podolica · nata qui" },
  { id: "fiorentina", name: "Fiorentina", weight: "≈ 1,2 kg", cottura: "brace ardente · 4 min lato",
    x: 40, y: 18, w: 18, h: 10, cx: 30, cy: 6,  from: "N° 047", fromNote: "Podolica · nata qui" },
  { id: "costata",    name: "Costata",    weight: "≈ 800 g", cottura: "brace forte · 3 min lato",
    x: 26, y: 22, w: 14, h: 10, cx: 15, cy: 10, from: "N° 047", fromNote: "Podolica · nata qui" },
  { id: "scamone",    name: "Scamone",    weight: "≈ 600 g", cottura: "brace media · 6 min lato",
    x: 66, y: 22, w: 12, h: 10, cx: 88, cy: 12, from: "N° 018", fromNote: "Murgese · 7 inverni" },
  { id: "girello",    name: "Girello",    weight: "≈ 500 g", cottura: "brace bassa · lento",
    x: 76, y: 30, w: 10, h: 14, cx: 92, cy: 44, from: "N° 018", fromNote: "Murgese · 7 inverni" },
];

const FROLLATURA_STEPS = [
  { d: 21, label: "morbida" },
  { d: 30, label: "equilibrio" },
  { d: 45, label: "profonda" },
];

const PRODOTTI = [
  { name: "Salsiccia a punta di coltello", peso: "500 g", nota: "Suino nero, macinata a mano",       rot: -3, top:  4, left:  6, w: 30 },
  { name: "Braciole al sugo",              peso: "6 pz",  nota: "Battute, prezzemolo, pecorino",     rot:  2, top: 24, left: 40, w: 26 },
  { name: "Bombette di Noci",              peso: "8 pz",  nota: "Capocollo + caciocavallo interno",  rot: -2, top: 52, left: 12, w: 28 },
  { name: "Zampina alla nocese",           peso: "1 m",   nota: "Spirale, spezie della masseria",    rot:  4, top: 44, left: 62, w: 30 },
  { name: "Tagliata di podolica",          peso: "600 g", nota: "Frollatura 30 gg",                   rot: -1, top: 72, left: 34, w: 32 },
];

const FILIERA = [
  { label: "Allevamento", to: "/allevamento" as const, active: false },
  { label: "Caseificio",  to: "/caseificio"  as const, active: false },
  { label: "Macelleria",  to: "/macelleria"  as const, active: true  },
  { label: "Braceria",    to: "/braceria"    as const, active: false },
];

/* ─────────────────────────── COMPONENT ─────────────────────────── */

export function MacelleriaStory() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const rootRef = useRef<HTMLDivElement>(null);

  // MOV 1 · IL BANCO
  const bancoSectionRef = useRef<HTMLDivElement>(null);
  const bancoImgRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const silhouetteRef = useRef<SVGPathElement>(null);

  // MOV A · DIAGRAMMA
  const diagRef = useRef<HTMLDivElement>(null);
  const cutRegionsRef = useRef<(SVGRectElement | null)[]>([]);
  const [activeCut, setActiveCut] = useState(0);

  // MOV B · TRACCIABILITÀ / FROLLATURA
  const traceRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState(21);

  // MOV C · BANCONE
  const bankRef = useRef<HTMLDivElement>(null);

  // BRIDGE
  const bridgeRef = useRef<HTMLDivElement>(null);
  const [diving, setDiving] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined" || reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* ═══ MOV 1 · IL BANCO ═══ */
      if (bancoSectionRef.current) {
        // il banco si solleva/deriva (dolly-out); il timbro appare a fine sezione
        gsap.to(bancoImgRef.current, {
          scale: 1.08,
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: bancoSectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        gsap.set(stampRef.current, { autoAlpha: 0, scale: 1.35, rotate: -8 });
        gsap.to(stampRef.current, {
          autoAlpha: 1,
          scale: 1,
          rotate: -4,
          duration: 0.6,
          ease: "power4.out",
          scrollTrigger: {
            trigger: bancoSectionRef.current,
            start: "40% top",
            toggleActions: "play none none reverse",
          },
        });

        // sagoma anatomica si disegna
        const path = silhouetteRef.current;
        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: bancoSectionRef.current,
              start: "top top",
              end: "bottom center",
              scrub: 0.6,
            },
          });
        }
      }

      /* ═══ SEZIONE A · IL DIAGRAMMA (pin + tagli in sequenza) ═══ */
      const diag = diagRef.current;
      if (diag) {
        const total = CUTS.length;
        ScrollTrigger.create({
          trigger: diag,
          start: "top top",
          end: () => `+=${total * 90}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(total - 1, Math.floor(self.progress * total));
            setActiveCut(idx);
            cutRegionsRef.current.forEach((r, i) => {
              if (!r) return;
              gsap.to(r, {
                opacity: i === idx ? 1 : 0.12,
                duration: 0.3,
                overwrite: "auto",
              });
            });
          },
        });
      }

      /* ═══ SEZIONE B · TRACCIABILITÀ + FROLLATURA (counter scrub) ═══ */
      if (traceRef.current) {
        const obj = { v: 21 };
        gsap.to(obj, {
          v: 45,
          ease: "none",
          scrollTrigger: {
            trigger: traceRef.current,
            start: "top 60%",
            end: "bottom 30%",
            scrub: 0.6,
            onUpdate: () => setDays(Math.round(obj.v)),
          },
        });

        gsap.from("[data-cell]", {
          y: 24,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: traceRef.current, start: "top 70%" },
        });

        // draw filo taglio↔animale
        gsap.fromTo(
          "[data-trace-line]",
          { strokeDashoffset: 400 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: traceRef.current,
              start: "top 70%",
              end: "top 20%",
              scrub: 0.6,
            },
          },
        );
      }

      /* ═══ SEZIONE C · IL BANCONE (broken grid stamp reveal) ═══ */
      if (bankRef.current) {
        gsap.from("[data-prod]", {
          y: 40,
          autoAlpha: 0,
          rotate: (i) => (i % 2 === 0 ? -6 : 6),
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: bankRef.current, start: "top 75%" },
        });
      }

      /* ═══ BRIDGE (heat morph) ═══ */
      if (bridgeRef.current) {
        gsap.fromTo(
          "[data-heat]",
          { opacity: 0, scale: 1.6 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: bridgeRef.current,
              start: "top 80%",
              end: "bottom bottom",
              scrub: 0.6,
            },
          },
        );
        gsap.fromTo(
          "[data-cut-into-fire]",
          { x: -80, rotate: -12, opacity: 0.4 },
          {
            x: 40,
            rotate: 8,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: bridgeRef.current,
              start: "top 70%",
              end: "bottom bottom",
              scrub: 0.6,
            },
          },
        );
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
    const lenis = (window as unknown as { __lenis?: { on: (e: string, cb: () => void) => void } }).__lenis;
    if (!lenis) return;
    lenis.on("scroll", () => ScrollTrigger.update());
  }, [reduced]);

  const goBraceria = () => {
    if (reduced) { navigate({ to: "/braceria" }); return; }
    setDiving(true);
    setTimeout(() => navigate({ to: "/braceria" }), 850);
  };

  const cut = CUTS[activeCut];

  return (
    <div ref={rootRef} className="relative bg-[color:var(--carbone)] text-[color:var(--crema)]">
      {/* ── PERSISTENT NAV ── */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
        <Link
          to="/"
          className="pointer-events-auto font-eyebrow group inline-flex items-center gap-2 text-[11px] text-[color:var(--crema)]/85 transition-colors hover:text-[color:var(--oro)]"
          aria-label="Torna alla masseria"
        >
          <span aria-hidden className="transition-transform group-hover:-translate-x-1">←</span>
          La masseria
        </Link>
        <p className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)] md:text-[11px]">
          03 / 04 — Macelleria
        </p>
      </div>

      <nav
        aria-label="Filiera"
        className="pointer-events-none fixed inset-x-0 top-16 z-40 mx-auto hidden max-w-3xl items-center justify-center gap-6 md:flex"
      >
        {FILIERA.map((f, i) => (
          <div key={f.to} className="pointer-events-auto flex items-center gap-6">
            <Link
              to={f.to}
              className={[
                "font-eyebrow text-[10px] tracking-[0.28em] transition-colors",
                f.active ? "text-[color:var(--oro)]" : "text-[color:var(--crema)]/55 hover:text-[color:var(--crema)]",
              ].join(" ")}
              aria-current={f.active ? "page" : undefined}
            >
              <span className="text-[color:var(--oro)]/70 mr-2">0{i + 1}</span>
              {f.label}
            </Link>
            {i < FILIERA.length - 1 && <span aria-hidden className="h-px w-6 bg-[color:var(--crema)]/15" />}
          </div>
        ))}
      </nav>

      {/* ════════════════════ MOV 1 · IL BANCO (no hero) ════════════════════ */}
      <section
        ref={bancoSectionRef}
        aria-label="Il banco di marmo"
        className="relative h-[130svh] w-full overflow-hidden"
      >
        <div
          ref={bancoImgRef}
          aria-hidden
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${bancoImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center 60%",
          }}
        />
        {/* grade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, rgba(26,18,16,0.10) 40%, rgba(26,18,16,0.85) 100%)",
          }}
        />

        {/* SAGOMA ANATOMICA che si disegna a tratto d'oro */}
        <svg
          aria-hidden
          className="pointer-events-none absolute right-[6vw] top-[18vh] hidden md:block"
          viewBox="0 0 100 60"
          width="42%"
          style={{ maxWidth: 620, mixBlendMode: "screen" }}
        >
          <path
            ref={silhouetteRef}
            d="M 6 40 Q 4 32 8 28 L 14 20 Q 18 14 26 14 L 30 10 Q 32 6 36 8 L 40 12 L 60 12 Q 70 12 78 16 L 88 20 Q 94 22 94 30 L 92 40 L 88 42 L 84 50 L 80 50 L 82 42 L 66 42 L 62 50 L 58 50 L 60 42 L 30 42 L 26 50 L 22 50 L 24 42 L 16 42 L 14 50 L 10 50 L 12 42 Z"
            fill="none"
            stroke="var(--oro)"
            strokeWidth="0.4"
            strokeOpacity="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 4px rgba(196,154,74,0.6))" }}
          />
        </svg>

        {/* RAIL sinistro */}
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 md:left-8">
          <div
            className="flex flex-col items-center gap-6"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            <span className="font-eyebrow text-[10px] tracking-[0.5em] text-[color:var(--oro)]/85">
              MACELLERIA · III · NOCI
            </span>
            <span className="h-16 w-px bg-gradient-to-b from-[color:var(--oro)]/70 to-transparent" />
            <span className="font-eyebrow text-[10px] tracking-[0.35em] text-[color:var(--crema)]/70">
              FROLLATURA · 30 GG
            </span>
          </div>
        </div>

        {/* TITOLO = TIMBRO su carta da macellaio */}
        <div
          ref={stampRef}
          className="pointer-events-none absolute left-1/2 top-[62%] -translate-x-1/2"
          style={{ willChange: "transform, opacity" }}
        >
          <div
            className="relative px-8 py-5"
            style={{
              transform: "rotate(-4deg)",
              border: "2.5px solid var(--terracotta)",
              color: "var(--terracotta)",
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(242,232,213,0.06) 0%, rgba(242,232,213,0) 60%)",
              boxShadow: "inset 0 0 40px rgba(179,58,26,0.15)",
              mixBlendMode: "screen",
              opacity: 0.92,
            }}
          >
            <p className="font-eyebrow text-[10px] tracking-[0.45em] text-[color:var(--terracotta)]/80">
              TIMBRO · III
            </p>
            <p
              className="font-display italic mt-1 leading-[0.95]"
              style={{ fontSize: "clamp(1.6rem, 4.2vw, 3.4rem)", letterSpacing: "-0.01em" }}
            >
              La carne, a vista.
            </p>
            {/* stampe grezze — piccole imperfezioni */}
            <span
              aria-hidden
              className="absolute -left-2 -top-2 h-3 w-3 rounded-full"
              style={{ background: "var(--terracotta)", opacity: 0.4 }}
            />
            <span
              aria-hidden
              className="absolute -right-3 -bottom-3 h-2 w-6"
              style={{ background: "var(--terracotta)", opacity: 0.35, transform: "rotate(15deg)" }}
            />
          </div>
        </div>

        {/* cue scroll */}
        <div className="pointer-events-none absolute right-6 bottom-8 flex flex-col items-center gap-3 md:right-10">
          <span className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--crema)]/70">
            Al diagramma
          </span>
          <span aria-hidden className="h-10 w-px animate-pulse bg-gradient-to-b from-[color:var(--oro)] to-transparent" />
        </div>
      </section>

      {/* ════════════════════ SEZIONE A · DIAGRAMMA ════════════════════ */}
      <section
        ref={diagRef}
        aria-label="Diagramma anatomico dei tagli"
        className="relative h-[100svh] w-full overflow-hidden bg-[color:var(--carbone)]"
      >
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-[1fr_1.4fr_1fr] items-center px-6 md:px-16 gap-8">
          {/* left callout: taglio attivo — nome/peso */}
          <div className="hidden md:block">
            <p className="font-eyebrow text-[10px] tracking-[0.5em] text-[color:var(--oro)]">
              TAGLIO · {String(activeCut + 1).padStart(2, "0")} / {String(CUTS.length).padStart(2, "0")}
            </p>
            <p
              className="font-display italic mt-3 leading-[0.95]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
            >
              {cut.name}
            </p>
            <p className="font-eyebrow mt-4 text-xs tracking-[0.28em] text-[color:var(--crema)]/70">
              {cut.weight}
            </p>
            <span aria-hidden className="hairline-ember mt-6 block max-w-[220px]" />
            <p className="font-sans mt-6 text-sm text-[color:var(--crema)]/80 max-w-xs">
              Cottura: <span className="text-[color:var(--terracotta)]">{cut.cottura}</span>
            </p>
          </div>

          {/* center: bovine silhouette + cuts overlay */}
          <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 100 60" className="w-full max-w-[720px]" role="img" aria-label="Diagramma bovino con tagli">
              {/* silhouette */}
              <path
                d="M 6 40 Q 4 32 8 28 L 14 20 Q 18 14 26 14 L 30 10 Q 32 6 36 8 L 40 12 L 60 12 Q 70 12 78 16 L 88 20 Q 94 22 94 30 L 92 40 L 88 42 L 84 50 L 80 50 L 82 42 L 66 42 L 62 50 L 58 50 L 60 42 L 30 42 L 26 50 L 22 50 L 24 42 L 16 42 L 14 50 L 10 50 L 12 42 Z"
                fill="rgba(242,232,213,0.03)"
                stroke="var(--oro)"
                strokeWidth="0.35"
                strokeOpacity="0.7"
                strokeLinejoin="round"
              />
              {/* cut regions */}
              {CUTS.map((c, i) => (
                <g key={c.id}>
                  <rect
                    ref={(el) => { cutRegionsRef.current[i] = el; }}
                    x={c.x}
                    y={c.y}
                    width={c.w}
                    height={c.h}
                    rx={1}
                    fill="var(--terracotta)"
                    opacity={0.12}
                    style={{ mixBlendMode: "screen" }}
                  />
                  <text
                    x={c.x + c.w / 2}
                    y={c.y + c.h / 2 + 1}
                    textAnchor="middle"
                    fontSize="1.8"
                    fill="var(--crema)"
                    opacity={i === activeCut ? 0.9 : 0.25}
                    style={{ fontFamily: "Oswald, sans-serif", letterSpacing: "0.05em" }}
                  >
                    {c.name.toUpperCase()}
                  </text>
                </g>
              ))}
              {/* leader line to active cut */}
              <line
                x1={cut.x + cut.w / 2}
                y1={cut.y}
                x2={cut.cx}
                y2={cut.cy}
                stroke="var(--oro)"
                strokeWidth="0.25"
                strokeOpacity="0.9"
              />
              <circle cx={cut.cx} cy={cut.cy} r="0.7" fill="var(--oro)" />
            </svg>
          </div>

          {/* right callout: cottura e origine */}
          <div className="hidden md:block text-right">
            <p className="font-eyebrow text-[10px] tracking-[0.5em] text-[color:var(--oro)]/85">
              ORIGINE
            </p>
            <p
              className="font-display italic mt-3"
              style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.5rem)" }}
            >
              {cut.from}
            </p>
            <p className="font-sans mt-2 text-sm text-[color:var(--crema)]/75">
              {cut.fromNote}
            </p>
            <Link
              to="/allevamento"
              className="font-eyebrow inline-block mt-6 text-[10px] tracking-[0.32em] text-[color:var(--crema)]/70 hover:text-[color:var(--oro)] transition-colors"
            >
              vedi al pascolo →
            </Link>
          </div>

          {/* MOBILE callout compatto */}
          <div className="md:hidden">
            <p className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro)]">
              {cut.name.toUpperCase()} · {cut.weight}
            </p>
            <p className="font-sans mt-2 text-sm text-[color:var(--crema)]/80">
              {cut.cottura} · da {cut.from}
            </p>
          </div>
        </div>

        {/* marginalia sotto */}
        <p className="font-eyebrow absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.35em] text-[color:var(--crema)]/45">
          A · il diagramma — niente si nasconde
        </p>
      </section>

      {/* ════════════════════ SEZIONE B · TRACCIABILITÀ + FROLLATURA ════════════════════ */}
      <section
        ref={traceRef}
        aria-label="Tracciabilità e frollatura"
        className="relative w-full overflow-hidden bg-[color:var(--carbone)] px-6 md:px-16 py-32"
      >
        {/* filo d'oro taglio↔animale */}
        <div className="relative mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* CARD TAGLIO */}
          <div className="relative">
            <p className="font-eyebrow text-[10px] tracking-[0.5em] text-[color:var(--oro)]">
              ETICHETTA · PROVENIENZA
            </p>
            <div
              className="mt-6 border border-[color:var(--oro)]/40 bg-[color:var(--crema)]/[0.03] p-8"
              style={{ backdropFilter: "blur(2px)" }}
            >
              <p className="font-eyebrow text-[9px] tracking-[0.35em] text-[color:var(--crema)]/60">
                TAGLIO
              </p>
              <p className="font-display italic mt-2 text-2xl md:text-3xl">
                {cut.name}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-eyebrow text-[9px] tracking-[0.28em] text-[color:var(--crema)]/50">Peso</p>
                  <p className="font-sans mt-1 text-[color:var(--crema)]/85">{cut.weight}</p>
                </div>
                <div>
                  <p className="font-eyebrow text-[9px] tracking-[0.28em] text-[color:var(--crema)]/50">Cottura</p>
                  <p className="font-sans mt-1 text-[color:var(--crema)]/85">{cut.cottura}</p>
                </div>
              </div>
              <span aria-hidden className="hairline-ember mt-6 block" />
              <p className="font-sans mt-6 text-xs text-[color:var(--crema)]/70">
                Da <span className="text-[color:var(--terracotta)]">{cut.from}</span> · {cut.fromNote} ·
                pascolo della masseria
              </p>
            </div>
          </div>

          {/* filo d'oro tra le due card (solo desktop) */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 hidden md:block h-full"
            width="200"
            viewBox="0 0 200 400"
            preserveAspectRatio="none"
          >
            <path
              data-trace-line
              d="M 0 80 C 80 120, 120 280, 200 320"
              fill="none"
              stroke="var(--oro)"
              strokeWidth="1"
              strokeOpacity="0.8"
              strokeDasharray="400"
              strokeDashoffset="400"
              style={{ filter: "drop-shadow(0 0 6px rgba(196,154,74,0.5))" }}
            />
          </svg>

          {/* CARD ANIMALE — richiama la marca auricolare */}
          <div className="relative md:mt-32">
            <p className="font-eyebrow text-[10px] tracking-[0.5em] text-[color:var(--oro)]/85 text-right">
              PASCOLO · CAPITOLO I
            </p>
            <div
              className="mt-6 border border-[color:var(--crema)]/15 bg-[color:var(--marrone)]/25 p-8"
            >
              <div
                className="inline-flex items-center gap-2 border border-[color:var(--oro)]/70 bg-[color:var(--carbone)]/70 px-3 py-1.5"
                style={{ clipPath: "polygon(0 50%, 8px 0, 100% 0, 100% 100%, 8px 100%)", paddingLeft: "14px" }}
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[color:var(--oro)] shadow-[0_0_8px_var(--oro)]" />
                <span className="font-eyebrow text-[9px] tracking-[0.28em] text-[color:var(--oro)]">
                  {cut.from}
                </span>
              </div>
              <p className="font-display italic mt-4 text-xl">
                {cut.fromNote}
              </p>
              <p className="font-sans mt-3 text-xs text-[color:var(--crema)]/70">
                Cresciuta a Noci, alimentata col grano coltivato in masseria.
                Rispettato il tempo, rispettata la bestia.
              </p>
              <Link
                to="/allevamento"
                className="font-eyebrow inline-block mt-6 text-[10px] tracking-[0.32em] text-[color:var(--crema)]/70 hover:text-[color:var(--oro)] transition-colors"
              >
                vai al capitolo I →
              </Link>
            </div>
          </div>
        </div>

        {/* ARMADIO FROLLATURA */}
        <div className="relative mx-auto max-w-6xl mt-32">
          <div className="flex items-baseline justify-between">
            <p className="font-eyebrow text-[10px] tracking-[0.5em] text-[color:var(--oro)]">
              B · ARMADIO DI FROLLATURA
            </p>
            <p className="font-eyebrow text-[10px] tracking-[0.35em] text-[color:var(--crema)]/50">
              scorri per far avanzare il tempo
            </p>
          </div>
          <div className="mt-8 grid grid-cols-3 gap-4 md:gap-8">
            {FROLLATURA_STEPS.map((s) => {
              const isActive = days >= s.d;
              return (
                <div
                  key={s.d}
                  data-cell
                  className={[
                    "relative border p-6 md:p-10 transition-colors",
                    isActive
                      ? "border-[color:var(--oro)]/60 bg-[color:var(--bordeaux)]/15"
                      : "border-[color:var(--crema)]/10 bg-[color:var(--crema)]/[0.02]",
                  ].join(" ")}
                >
                  <p className="font-eyebrow text-[9px] tracking-[0.35em] text-[color:var(--crema)]/50">
                    CELLA · {s.label}
                  </p>
                  <p
                    className="font-display mt-4 tabular-nums leading-none"
                    style={{
                      fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                      color: isActive ? "var(--oro)" : "var(--crema)",
                      opacity: isActive ? 1 : 0.35,
                    }}
                  >
                    {s.d}
                    <span className="font-eyebrow ml-2 align-baseline text-xs tracking-[0.35em] opacity-60">GG</span>
                  </p>
                </div>
              );
            })}
          </div>
          <p className="font-display italic text-center mt-10 text-lg text-[color:var(--crema)]/85">
            oggi in cella: <span className="text-[color:var(--terracotta)] tabular-nums">{days}</span> giorni
          </p>
        </div>
      </section>

      {/* ════════════════════ SEZIONE C · IL BANCONE ════════════════════ */}
      <section
        ref={bankRef}
        aria-label="Il bancone — i prodotti"
        className="relative w-full overflow-hidden bg-[color:var(--carbone)] px-6 md:px-16 py-32"
      >
        <p className="font-eyebrow text-[10px] tracking-[0.5em] text-[color:var(--oro)]">
          C · IL BANCONE — i timbri del giorno
        </p>

        {/* broken grid */}
        <div className="relative mx-auto max-w-6xl mt-16 h-[900px] md:h-[820px] hidden md:block">
          {PRODOTTI.map((p, i) => (
            <article
              key={p.name}
              data-prod
              className="absolute"
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: `${p.w}%`,
                transform: `rotate(${p.rot}deg)`,
              }}
            >
              <ProdottoStamp p={p} index={i} />
            </article>
          ))}
        </div>

        {/* mobile stack */}
        <div className="mt-12 space-y-6 md:hidden">
          {PRODOTTI.map((p, i) => (
            <article key={p.name} data-prod>
              <ProdottoStamp p={p} index={i} />
            </article>
          ))}
        </div>
      </section>

      {/* ════════════════════ BRIDGE → BRACERIA ════════════════════ */}
      <section
        ref={bridgeRef}
        aria-label="Ponte alla Braceria"
        className="relative h-[85svh] w-full overflow-hidden"
      >
        {/* heat glow che cresce */}
        <div
          data-heat
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 65%, rgba(179,58,26,0.85) 0%, rgba(110,26,20,0.7) 40%, rgba(26,18,16,1) 80%)",
          }}
        />
        {/* embers */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 30% 80%, rgba(196,154,74,0.35) 0%, transparent 30%), radial-gradient(circle at 70% 60%, rgba(179,58,26,0.4) 0%, transparent 25%)",
            mixBlendMode: "screen",
          }}
        />

        {/* taglio che entra nel fuoco */}
        <div
          data-cut-into-fire
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            className="border border-[color:var(--oro)]/60 bg-[color:var(--carbone)]/60 px-6 py-4 backdrop-blur"
            style={{ boxShadow: "0 0 60px rgba(179,58,26,0.6)" }}
          >
            <p className="font-eyebrow text-[9px] tracking-[0.35em] text-[color:var(--oro)]/80">
              FIORENTINA · N° 047
            </p>
            <p className="font-display italic text-xl md:text-2xl">
              va sul fuoco.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-16 px-6 text-center">
          <button
            type="button"
            onClick={goBraceria}
            className="pointer-events-auto group inline-flex flex-col items-center gap-3 text-[color:var(--crema)] focus-visible:outline-none"
            aria-label="Continua alla Braceria"
          >
            <span className="font-eyebrow text-[10px] tracking-[0.5em] text-[color:var(--oro)]">
              IV · BRACERIA
            </span>
            <span className="font-display italic text-lg text-[color:var(--crema)]/85">
              continua ↓
            </span>
          </button>
        </div>
      </section>

      {diving && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] animate-[fade-in_0.35s_ease-out]"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 55%, rgba(179,58,26,0.92) 0%, rgba(110,26,20,0.96) 45%, var(--carbone) 100%)",
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────── PRODOTTO STAMP ─────────────────────────── */

function ProdottoStamp({
  p,
  index,
}: {
  p: (typeof PRODOTTI)[number];
  index: number;
}) {
  const inkColor = index % 2 === 0 ? "var(--terracotta)" : "var(--oro)";
  return (
    <div
      className="relative border-2 px-6 py-5"
      style={{
        borderColor: inkColor,
        color: inkColor,
        background:
          "radial-gradient(ellipse at 25% 20%, rgba(242,232,213,0.05) 0%, rgba(242,232,213,0) 60%)",
        boxShadow: "inset 0 0 32px rgba(0,0,0,0.35)",
      }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-eyebrow text-[9px] tracking-[0.35em]" style={{ color: inkColor, opacity: 0.85 }}>
          TIMBRO N° {String(index + 1).padStart(2, "0")}
        </p>
        <p className="font-eyebrow text-[9px] tracking-[0.28em] text-[color:var(--crema)]/60">
          {p.peso}
        </p>
      </div>
      <p
        className="font-display italic mt-2 leading-tight"
        style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)", color: "var(--crema)" }}
      >
        {p.name}
      </p>
      <p className="font-sans mt-2 text-xs text-[color:var(--crema)]/70">
        {p.nota}
      </p>
      <span
        aria-hidden
        className="absolute -left-2 -top-2 h-2 w-2 rounded-full"
        style={{ background: inkColor, opacity: 0.5 }}
      />
    </div>
  );
}
