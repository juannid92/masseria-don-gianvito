import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import aerialAsset from "@/assets/masseria-aerial.asset.json";
import terraImg from "@/assets/allev-a-terra.jpg";
import panoramaImg from "@/assets/allev-panorama.jpg";
import latteImg from "@/assets/allev-bridge-latte.jpg";
import pBovino from "@/assets/allev-p-bovino.jpg";
import pOvino from "@/assets/allev-p-ovino.jpg";
import pSuino from "@/assets/allev-p-suino.jpg";
import pEquino from "@/assets/allev-p-equino.jpg";
import pAvicolo from "@/assets/allev-p-avicolo.jpg";

/* ───────────────────────────────────────── DATA ────────────────────────────── */

type Portrait = {
  id: string;
  tag: string;
  name: string;
  species: string;
  micro: string;
  img: string;
  at: number;
  depth: number;
  vy: number;
};

const PORTRAITS: Portrait[] = [
  { id: "bovino",  tag: "N° 047", name: "La prima del mattino",         species: "Podolica · Bovino",           micro: "Mangia solo il grano che coltiviamo a Noci.",   img: pBovino,  at: 0.08, depth: 0.95, vy: 6 },
  { id: "ovino",   tag: "N° 112", name: "Nata qui tre primavere fa",    species: "Agnello · Ovino",             micro: "Cresce libera sull'erba dell'Alta Murgia.",     img: pOvino,   at: 0.28, depth: 0.6,  vy: -8 },
  { id: "suino",   tag: "N° 203", name: "Il custode del tartufo",       species: "Suino nero · Allevamento brado", micro: "Razzola tra ulivi e ghiande, senza fretta.",  img: pSuino,   at: 0.5,  depth: 1,    vy: 4 },
  { id: "equino",  tag: "N° 018", name: "Lo sguardo lungo della campagna", species: "Cavallo murgese",          micro: "Pascola con noi da sette inverni.",             img: pEquino,  at: 0.72, depth: 0.7,  vy: -10 },
  { id: "avicolo", tag: "N° 318", name: "Le ore piccole dell'aia",      species: "Avicoli · Aia rustica",       micro: "Razzolano libere all'ombra del fienile.",       img: pAvicolo, at: 0.92, depth: 0.85, vy: 8 },
];

const SPOTLIGHT_WORDS = [
  "Tempo","lento.","Niente","scorciatoie.","Solo","la","nostra","terra,",
  "le","nostre","mani,","il","rispetto","di","ogni","stagione.",
];

const FILIERA = [
  { label: "Allevamento", to: "/allevamento" as const, active: true },
  { label: "Caseificio",  to: "/caseificio"  as const, active: false },
  { label: "Macelleria",  to: "/macelleria"  as const, active: false },
  { label: "Braceria",    to: "/braceria"    as const, active: false },
];

/* ───────────────────────────────────────── COMPONENT ────────────────────────── */

export function AllevamentoStory() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const rootRef = useRef<HTMLDivElement>(null);

  // MOV 1 — La Caduta
  const fallSectionRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const aerialRef = useRef<HTMLDivElement>(null);
  const terraRef = useRef<HTMLDivElement>(null);
  const horizonTitleRef = useRef<HTMLDivElement>(null);
  const horizonLineRef = useRef<HTMLDivElement>(null);
  const [altitude, setAltitude] = useState(120);

  // MOV 2
  const mandriaRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panoBgRef = useRef<HTMLDivElement>(null);

  // MOV 3
  const pattoRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const [activeWord, setActiveWord] = useState(0);

  // Bridge
  const bridgeRef = useRef<HTMLDivElement>(null);

  const [diving, setDiving] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* ═══ MOV 1 · LA CADUTA — pin + scrub ═══ */
      const fallSection = fallSectionRef.current;
      if (fallSection && skyRef.current && aerialRef.current && terraRef.current) {
        // stato iniziale: siamo in cielo, l'aerea è piccola/sfocata (POV alto)
        gsap.set(skyRef.current,    { autoAlpha: 1 });
        gsap.set(aerialRef.current, { autoAlpha: 0.85, scale: 0.42, filter: "blur(6px) brightness(0.6)" });
        gsap.set(terraRef.current,  { autoAlpha: 0, scale: 1.18 });
        gsap.set(horizonTitleRef.current, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(horizonLineRef.current,  { scaleX: 0, transformOrigin: "50% 50%" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: fallSection,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            pin: ".fall-stage",
            pinSpacing: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // quota 120m → 0m
              const alt = Math.max(0, Math.round(120 * (1 - self.progress)));
              setAltitude(alt);
            },
          },
        });

        // fase 1 (0 → 0.5): precipita — l'aerea cresce, sfocatura sparisce
        tl.to(aerialRef.current,
          { scale: 1.6, filter: "blur(0px) brightness(0.8)", duration: 0.5, ease: "power2.in" },
          0
        );
        // fase 2 (0.4 → 0.75): morph aerea → terra (Flip-like via crossfade + scala)
        tl.to(skyRef.current,    { autoAlpha: 0, duration: 0.2, ease: "none" }, 0.35);
        tl.to(aerialRef.current, { autoAlpha: 0, scale: 1.9, duration: 0.25, ease: "power2.out" }, 0.5);
        tl.to(terraRef.current,  { autoAlpha: 1, scale: 1.02, duration: 0.35, ease: "power2.out" }, 0.5);
        // fase 3 (0.78 → 1): affiora la linea d'orizzonte e la frase si scrive SULL'orizzonte
        tl.to(horizonLineRef.current,  { scaleX: 1, duration: 0.1, ease: "power2.out" }, 0.78);
        tl.to(horizonTitleRef.current, { clipPath: "inset(0 0% 0 0)", duration: 0.2, ease: "power3.out" }, 0.82);
      }

      /* ═══ MOV 2 · LA MANDRIA (matchMedia) ═══ */
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const section = mandriaRef.current;
        const track = trackRef.current;
        if (!section || !track) return;
        const distance = () => track.scrollWidth - window.innerWidth;

        const st = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        if (panoBgRef.current) {
          gsap.to(panoBgRef.current, {
            xPercent: -25,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: true,
            },
          });
        }

        track.querySelectorAll<HTMLElement>("[data-portrait]").forEach((el) => {
          gsap.from(el, {
            yPercent: 12,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              containerAnimation: st,
              start: "left 90%",
              toggleActions: "play none none reverse",
            },
          });
        });

        return () => st.kill();
      });

      mm.add("(max-width: 767px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-portrait-mobile]").forEach((el) => {
          gsap.from(el, {
            y: 40,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });
      });

      /* ═══ MOV 3 · SPOTLIGHT READING ═══ */
      const patto = pattoRef.current;
      if (patto && wordsRef.current.length) {
        const total = wordsRef.current.length;
        gsap.set(wordsRef.current, { opacity: 0.18 });

        ScrollTrigger.create({
          trigger: patto,
          start: "top top",
          end: () => `+=${total * 80}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          onUpdate: (self) => {
            const idx = Math.min(total - 1, Math.floor(self.progress * total));
            setActiveWord(idx);
            wordsRef.current.forEach((w, i) => {
              const dist = Math.abs(i - idx);
              const op = i === idx ? 1 : Math.max(0.12, 0.6 - dist * 0.18);
              gsap.to(w, { opacity: op, duration: 0.25, overwrite: "auto" });
            });
          },
        });
      }

      /* ═══ BRIDGE — il filo d'oro che esce dal fondo ═══ */
      if (bridgeRef.current) {
        gsap.fromTo(
          "[data-filo-bridge]",
          { strokeDashoffset: 800 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: bridgeRef.current,
              start: "top 90%",
              end: "bottom bottom",
              scrub: 0.8,
            },
          }
        );
        gsap.from("[data-bridge-cue]", {
          y: 20, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: bridgeRef.current, start: "top 55%" },
        });
      }
    }, rootRef);

    // Refresh locale dopo che i font della pagina sono pronti (le altezze cambiano).
    // Il sync globale Lenis↔ScrollTrigger e i refresh su load/immagini sono in <SmoothScroll/>.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);
    }

    return () => {
      ctx.revert();
    };
  }, [reduced]);


  const goCaseificio = () => {
    if (reduced) { navigate({ to: "/caseificio" }); return; }
    setDiving(true);
    setTimeout(() => navigate({ to: "/caseificio" }), 850);
  };

  return (
    <div ref={rootRef} className="relative bg-[color:var(--carbone)] text-[color:var(--crema)]">
      {/* ─── PERSISTENT NAV ─── */}
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
          01 / 04 — Allevamento
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

      {/* ════════════════════ MOV 1 · LA CADUTA (no hero) ════════════════════ */}
      <section
        ref={fallSectionRef}
        aria-label="La caduta dal cielo alla terra"
        className="relative w-full"
        style={{ height: "260svh" }}
      >
        <div className="fall-stage relative h-[100svh] w-full overflow-hidden">
          {/* L0 — cielo (POV alto) */}
          <div
            ref={skyRef}
            aria-hidden
            className="absolute inset-0 will-change-[opacity]"
            style={{
              background:
                "linear-gradient(180deg, #d9c9a8 0%, #b89f7a 32%, #6b5a44 62%, #2a1e17 100%)",
            }}
          />
          {/* aria in caduta — micro-strisce chiare */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(180deg, transparent 0 12px, rgba(242,232,213,0.08) 12px 13px)",
                animation: "fall-streaks 1.6s linear infinite",
              }}
            />
          </div>

          {/* L1 — aerea (drone: si ingrandisce mentre precipitiamo) */}
          <div
            ref={aerialRef}
            aria-hidden
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${aerialAsset.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center 48%",
            }}
          />

          {/* L2 — terra (atterraggio) */}
          <div
            ref={terraRef}
            aria-hidden
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${terraImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center 60%",
            }}
          />

          {/* warm grade + vignette bassa */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(26,18,16,0.35) 0%, rgba(26,18,16,0) 40%, rgba(26,18,16,0.85) 100%)",
            }}
          />

          {/* linea d'orizzonte + titolo SULL'orizzonte */}
          <div className="pointer-events-none absolute inset-x-0 top-[56%] flex flex-col items-center px-6">
            <div
              ref={horizonLineRef}
              aria-hidden
              className="h-px w-[min(72vw,900px)]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--oro) 20%, var(--oro) 80%, transparent)",
                boxShadow: "0 0 12px rgba(196,154,74,0.45)",
              }}
            />
            <div
              ref={horizonTitleRef}
              className="mt-4 will-change-[clip-path]"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              <h1
                className="font-display italic text-center text-balance leading-[1]"
                style={{
                  fontSize: "clamp(1.6rem, 4.2vw, 3.6rem)",
                  color: "var(--crema)",
                  textShadow: "0 2px 24px rgba(0,0,0,0.65)",
                  letterSpacing: "-0.005em",
                }}
              >
                Dove tutto <span className="text-[color:var(--terracotta)]">comincia.</span>
              </h1>
            </div>
          </div>

          {/* RAIL sinistro — marginalia verticale */}
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 md:left-8">
            <div
              className="flex flex-col items-center gap-6"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              <span className="font-eyebrow text-[10px] tracking-[0.5em] text-[color:var(--oro)]/85">
                ALLEVAMENTO · I · NOCI
              </span>
              <span className="h-16 w-px bg-gradient-to-b from-[color:var(--oro)]/70 to-transparent" />
              <span className="font-eyebrow text-[10px] tracking-[0.35em] text-[color:var(--crema)]/70 tabular-nums">
                QUOTA {altitude.toString().padStart(3, "0")}m
              </span>
            </div>
          </div>

          {/* RAIL destro — cue scroll */}
          <div className="pointer-events-none absolute right-4 bottom-8 flex flex-col items-center gap-3 md:right-8">
            <span className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--crema)]/70">
              Scendi
            </span>
            <span aria-hidden className="h-10 w-px animate-pulse bg-gradient-to-b from-[color:var(--oro)] to-transparent" />
          </div>
        </div>
      </section>

      {/* ════════════════════ MOV 2 · LA MANDRIA (desktop) ════════════════════ */}
      <section
        ref={mandriaRef}
        aria-label="La mandria — carrellata cinematografica"
        className="relative hidden md:block h-[100svh] w-full overflow-hidden bg-[color:var(--carbone)]"
      >
        <div
          ref={panoBgRef}
          aria-hidden
          className="absolute inset-y-0 left-0 will-change-transform"
          style={{
            width: "180%",
            backgroundImage: `url(${panoramaImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, rgba(26,18,16,0.10) 45%, rgba(26,18,16,0.85) 100%)",
          }}
        />

        {/* marginalia verticale destra — cambio di posizione del testo rispetto a MOV1 */}
        <div className="pointer-events-none absolute right-6 top-1/2 z-10 -translate-y-1/2">
          <div
            className="flex flex-col items-center gap-4"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            <span className="font-eyebrow text-[10px] tracking-[0.5em] text-[color:var(--oro)]/85">
              LA MANDRIA · II
            </span>
            <span className="h-14 w-px bg-gradient-to-b from-[color:var(--oro)]/60 to-transparent" />
          </div>
        </div>

        {/* track orizzontale — SOLO ritratti + marchi auricolari */}
        <div
          ref={trackRef}
          className="relative flex h-full items-center will-change-transform"
          style={{ width: "320vw", paddingLeft: "12vw", paddingRight: "12vw" }}
        >
          {PORTRAITS.map((p) => {
            const left = `${12 + p.at * 280}vw`;
            const scale = 0.7 + p.depth * 0.5;
            const z = Math.round(p.depth * 10);
            return (
              <article
                key={p.id}
                data-portrait
                className="absolute"
                style={{
                  left,
                  top: `calc(50% + ${p.vy}vh)`,
                  transform: `translate(-50%, -50%) scale(${scale})`,
                  zIndex: z,
                  width: "clamp(280px, 26vw, 460px)",
                }}
              >
                <PortraitCard p={p} />
              </article>
            );
          })}
        </div>
      </section>

      {/* ════════════════════ MOV 2 · MOBILE ════════════════════ */}
      <section
        aria-label="La mandria — versione mobile"
        className="relative block md:hidden bg-[color:var(--carbone)] px-6 py-20"
      >
        <p className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)]">
          II · La mandria
        </p>
        <div className="mt-10 space-y-8">
          {PORTRAITS.map((p) => (
            <article key={p.id} data-portrait-mobile>
              <PortraitCard p={p} />
            </article>
          ))}
        </div>
      </section>

      {/* ════════════════════ MOV 3 · IL PATTO COL TEMPO (banda centrale) ════════════════════ */}
      <section
        ref={pattoRef}
        aria-label="Il patto col tempo"
        className="relative h-[100svh] w-full overflow-hidden bg-[color:var(--carbone)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(179,58,26,0.10) 0%, rgba(26,18,16,0) 60%)",
          }}
        />

        {/* marginalia in basso, non occhiello grande */}
        <p className="font-eyebrow absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.35em] text-[color:var(--crema)]/45">
          III · il patto col tempo — Masseria Don Gianvito, Noci
        </p>

        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <p
            className="font-display max-w-5xl text-balance leading-[1.15]"
            style={{ fontSize: "clamp(1.6rem, 4.2vw, 3.4rem)" }}
          >
            {SPOTLIGHT_WORDS.map((w, i) => (
              <span
                key={`${w}-${i}`}
                ref={(el) => { if (el) wordsRef.current[i] = el; }}
                className={i === activeWord ? "text-[color:var(--crema)]" : "text-[color:var(--crema)]"}
                style={{ display: "inline-block", marginRight: "0.35em" }}
              >
                {w}
              </span>
            ))}
          </p>
        </div>
      </section>

      {/* ════════════════════ BRIDGE → CASEIFICIO (filo d'oro che esce dal fondo) ════════════════════ */}
      <section
        ref={bridgeRef}
        aria-label="Ponte al Caseificio"
        className="relative h-[85svh] w-full overflow-hidden"
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${latteImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,18,16,0.92) 0%, rgba(26,18,16,0.45) 45%, rgba(242,232,213,0.55) 100%)",
          }}
        />

        {/* filo d'oro che scende ed esce dal fondo */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 400 800"
          preserveAspectRatio="none"
        >
          <path
            data-filo-bridge
            d="M 200 0 C 220 200, 180 380, 210 560 S 190 740, 200 820"
            fill="none"
            stroke="var(--oro)"
            strokeWidth="1.2"
            strokeOpacity="0.85"
            strokeDasharray="800"
            strokeDashoffset="800"
            style={{ filter: "drop-shadow(0 0 6px rgba(196,154,74,0.6))" }}
          />
        </svg>

        {/* CUE minimo, non un titolo */}
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-16 px-6 text-center">
          <button
            data-bridge-cue
            type="button"
            onClick={goCaseificio}
            className="pointer-events-auto group inline-flex flex-col items-center gap-3 text-[color:var(--crema)] focus-visible:outline-none"
            aria-label="Continua al Caseificio"
          >
            <span className="font-eyebrow text-[10px] tracking-[0.5em] text-[color:var(--oro)]">
              II · CASEIFICIO
            </span>
            <span className="font-display italic text-lg text-[color:var(--crema)]/85">
              continua ↓
            </span>
          </button>
        </div>
      </section>

      {/* dive cover */}
      {diving && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] animate-[fade-in_0.35s_ease-out]"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(242,232,213,0.95) 0%, rgba(242,232,213,1) 60%, var(--carbone) 100%)",
          }}
        />
      )}

      {/* keyframes locali per le strisce di aria in caduta */}
      <style>{`
        @keyframes fall-streaks {
          0%   { transform: translateY(-30%); }
          100% { transform: translateY(30%); }
        }
      `}</style>
    </div>
  );
}

/* ───────────────────────────────────────── PORTRAIT CARD ────────────────────── */

function PortraitCard({ p }: { p: Portrait }) {
  return (
    <div className="group relative">
      <div
        className="relative overflow-hidden border border-[color:var(--crema)]/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"
        style={{ aspectRatio: "4/5" }}
      >
        <img
          src={p.img}
          alt={`${p.name} — ${p.species} alla Masseria Don Gianvito`}
          loading="lazy"
          width={768}
          height={960}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,18,16,0) 35%, rgba(26,18,16,0.85) 100%)",
          }}
        />
        {/* MARCA AURICOLARE — sigillo con clip a "tag" */}
        <div
          className="absolute -left-2 top-4 flex items-center gap-2 border border-[color:var(--oro)]/70 bg-[color:var(--carbone)]/85 px-3 py-1.5 backdrop-blur"
          style={{ clipPath: "polygon(0 50%, 8px 0, 100% 0, 100% 100%, 8px 100%)", paddingLeft: "14px" }}
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-[color:var(--oro)] shadow-[0_0_8px_var(--oro)]"
          />
          <span className="font-eyebrow text-[9px] tracking-[0.28em] text-[color:var(--oro)]">
            {p.tag}
          </span>
        </div>

        {/* meta */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-eyebrow text-[9px] tracking-[0.28em] text-[color:var(--crema)]/70">
            {p.species}
          </p>
          <p
            className="font-display mt-1 italic leading-tight text-[color:var(--crema)]"
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.35rem)" }}
          >
            {p.name}
          </p>
          <p className="font-sans mt-2 text-xs leading-snug text-[color:var(--crema)]/80">
            {p.micro}
          </p>
        </div>
      </div>
    </div>
  );
}
