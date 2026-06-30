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
  tag: string;           // "N° 047" — sigillo/marca auricolare
  name: string;          // "La prima del mattino"
  species: string;       // "Podolica · Bovino"
  micro: string;         // micro-storia di una riga
  img: string;
  /** posizione orizzontale lungo la carrellata, 0..1 */
  at: number;
  /** profondità: 0 lontano, 1 vicino — definisce parallax & scala */
  depth: number;
  /** offset verticale in vh (per non allineare le card) */
  vy: number;
};

const PORTRAITS: Portrait[] = [
  {
    id: "bovino",
    tag: "N° 047",
    name: "La prima del mattino",
    species: "Podolica · Bovino",
    micro: "Mangia solo il grano che coltiviamo a Noci.",
    img: pBovino,
    at: 0.08,
    depth: 0.95,
    vy: 6,
  },
  {
    id: "ovino",
    tag: "N° 112",
    name: "Nata qui tre primavere fa",
    species: "Agnello · Ovino",
    micro: "Cresce libera sull'erba dell'Alta Murgia.",
    img: pOvino,
    at: 0.28,
    depth: 0.6,
    vy: -8,
  },
  {
    id: "suino",
    tag: "N° 203",
    name: "Il custode del tartufo",
    species: "Suino nero · Allevamento brado",
    micro: "Razzola tra ulivi e ghiande, senza fretta.",
    img: pSuino,
    at: 0.5,
    depth: 1,
    vy: 4,
  },
  {
    id: "equino",
    tag: "N° 018",
    name: "Lo sguardo lungo della campagna",
    species: "Cavallo murgese",
    micro: "Pascola con noi da sette inverni.",
    img: pEquino,
    at: 0.72,
    depth: 0.7,
    vy: -10,
  },
  {
    id: "avicolo",
    tag: "N° 318",
    name: "Le ore piccole dell'aia",
    species: "Avicoli · Aia rustica",
    micro: "Razzolano libere all'ombra del fienile.",
    img: pAvicolo,
    at: 0.92,
    depth: 0.85,
    vy: 8,
  },
];

const SPOTLIGHT_WORDS = [
  "Tempo",
  "lento.",
  "Niente",
  "scorciatoie.",
  "Solo",
  "la",
  "nostra",
  "terra,",
  "le",
  "nostre",
  "mani,",
  "il",
  "rispetto",
  "di",
  "ogni",
  "stagione.",
];

const FILIERA = [
  { label: "Allevamento", to: "/allevamento" as const, active: true },
  { label: "Caseificio", to: "/caseificio" as const, active: false },
  { label: "Macelleria", to: "/macelleria" as const, active: false },
  { label: "Braceria", to: "/braceria" as const, active: false },
];

/* ───────────────────────────────────────── COMPONENT ────────────────────────── */

export function AllevamentoStory() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const rootRef = useRef<HTMLDivElement>(null);
  const aerialRef = useRef<HTMLDivElement>(null);
  const terraRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  const mandriaRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panoBgRef = useRef<HTMLDivElement>(null);

  const pattoRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const bridgeRef = useRef<HTMLDivElement>(null);

  const [activeWord, setActiveWord] = useState(0);
  const [diving, setDiving] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (reduced) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      /* ───── MOV 1 · ATTERRAGGIO ───── */
      // morph aerea → terra all'apertura: cover si dissolve, aerial si scala, terra svela
      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      introTl
        .set(terraRef.current, { autoAlpha: 0, scale: 1.15 })
        .set(aerialRef.current, { autoAlpha: 1, scale: 1, filter: "blur(0px) brightness(0.55)" })
        .to(coverRef.current, { autoAlpha: 0, duration: 1.4 }, 0)
        .to(
          aerialRef.current,
          { scale: 1.35, filter: "blur(6px) brightness(0.7)", duration: 2.4 },
          0.1,
        )
        .to(terraRef.current, { autoAlpha: 1, scale: 1.05, duration: 1.8 }, 0.6)
        .to(aerialRef.current, { autoAlpha: 0, duration: 1.1 }, 1.1)
        .from(
          "[data-mov1-reveal]",
          { yPercent: 110, duration: 1, stagger: 0.1 },
          1.0,
        )
        .from(
          "[data-mov1-fade]",
          { opacity: 0, y: 18, duration: 0.7, stagger: 0.08 },
          1.4,
        )
        .fromTo(
          "[data-filo-mov1]",
          { strokeDashoffset: 900 },
          { strokeDashoffset: 0, duration: 1.6, ease: "power2.out" },
          1.0,
        );

      // Ken-burns leggero sulla terra durante il primo scroll
      gsap.to(terraRef.current, {
        scale: 1.16,
        yPercent: -3,
        ease: "none",
        scrollTrigger: {
          trigger: ".mov1",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* ───── MOV 2 · LA MANDRIA (matchMedia: desktop pin+translateX) ───── */
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

        // panorama parallax (più lento del dolly)
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

        // ritratti: stagger di entrata sui rispettivi at%
        track.querySelectorAll<HTMLElement>("[data-portrait]").forEach((el) => {
          gsap.from(el, {
            yPercent: 12,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              containerAnimation: st,
              start: "left 85%",
              toggleActions: "play none none reverse",
            },
          });
        });

        return () => st.kill();
      });

      mm.add("(max-width: 767px)", () => {
        // mobile: card verticali con micro-reveal
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

      /* ───── MOV 3 · IL PATTO COL TEMPO (spotlight reading) ───── */
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

      /* ───── BRIDGE → CASEIFICIO ───── */
      if (bridgeRef.current) {
        gsap.from("[data-bridge-text]", {
          y: 26,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: bridgeRef.current, start: "top 70%" },
        });
      }
    }, rootRef);

    // refresh dopo fonts e immagini
    const onReady = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(onReady);
    window.addEventListener("load", onReady);

    return () => {
      window.removeEventListener("load", onReady);
      ctx.revert();
    };
  }, [reduced]);

  // sync con lenis
  useEffect(() => {
    if (reduced) return;
    const lenis = (window as unknown as { __lenis?: { on: (e: string, cb: () => void) => void } })
      .__lenis;
    if (!lenis) return;
    const update = () => ScrollTrigger.update();
    lenis.on("scroll", update);
  }, [reduced]);

  const goCaseificio = () => {
    if (reduced) {
      navigate({ to: "/caseificio" });
      return;
    }
    setDiving(true);
    setTimeout(() => navigate({ to: "/caseificio" }), 850);
  };

  return (
    <div ref={rootRef} className="relative bg-[color:var(--carbone)] text-[color:var(--crema)]">
      {/* ──────────────── PERSISTENT NAV ──────────────── */}
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

      {/* ════════════════════ MOV 1 · ATTERRAGGIO ════════════════════ */}
      <section
        className="mov1 relative h-[100svh] w-full overflow-hidden"
        aria-label="Atterraggio dal volo del drone"
      >
        {/* aerial layer */}
        <div
          ref={aerialRef}
          aria-hidden
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${aerialAsset.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center 45%",
          }}
        />
        {/* terra layer */}
        <div
          ref={terraRef}
          aria-hidden
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${terraImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
          }}
        />
        {/* warm grade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, rgba(26,18,16,0.18) 38%, rgba(26,18,16,0.85) 100%)",
          }}
        />
        {/* hero "tuffo" cover */}
        <div
          ref={coverRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(179,58,26,0.92) 0%, rgba(110,26,20,0.96) 45%, rgba(26,18,16,1) 80%)",
          }}
        />

        {/* parola-fantasma "TERRA" */}
        <p
          aria-hidden
          className="font-display pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[color:var(--crema)]/[0.06] italic"
          style={{ fontSize: "clamp(10rem, 28vw, 26rem)", letterSpacing: "-0.02em" }}
        >
          TERRA
        </p>

        {/* filo d'oro — discesa dall'hero */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          <path
            data-filo-mov1
            d="M 720 -20 C 720 220, 900 360, 720 540 S 540 760, 720 920"
            fill="none"
            stroke="var(--oro)"
            strokeWidth="1"
            strokeOpacity="0.55"
            strokeDasharray="900"
            strokeDashoffset="900"
          />
        </svg>

        {/* COPY */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <div className="overflow-hidden">
            <p
              data-mov1-reveal
              className="font-eyebrow text-[11px] tracking-[0.32em] text-[color:var(--oro)] md:text-xs"
            >
              01 — Dalla terra alla brace · Il primo anello
            </p>
          </div>

          <h1
            className="font-display mt-6 max-w-4xl text-balance leading-[0.95]"
            style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
          >
            <span className="block overflow-hidden">
              <span data-mov1-reveal className="block">
                Dove tutto{" "}
                <span className="italic text-[color:var(--terracotta)]">comincia.</span>
              </span>
            </span>
          </h1>

          <div className="mt-8 max-w-xl overflow-hidden">
            <p
              data-mov1-reveal
              className="font-sans text-sm leading-relaxed text-[color:var(--crema)]/85 md:text-base"
            >
              La rugiada sul pascolo, il fiato delle bestie all'alba, la mano callosa sul recinto.
              Qui non arriva niente da fuori.
            </p>
          </div>
        </div>

        <div
          data-mov1-fade
          className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3 text-[color:var(--crema)]/70"
        >
          <span className="font-eyebrow text-[10px] tracking-[0.28em]">Scendi nella mandria</span>
          <span
            aria-hidden
            className="h-8 w-px animate-pulse bg-gradient-to-b from-[color:var(--oro)] to-transparent"
          />
        </div>
      </section>

      {/* ════════════════════ MOV 2 · LA MANDRIA (desktop) ════════════════════ */}
      <section
        ref={mandriaRef}
        aria-label="La mandria — carrellata cinematografica"
        className="relative hidden md:block h-[100svh] w-full overflow-hidden bg-[color:var(--carbone)]"
      >
        {/* panorama background (più lento) */}
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
        {/* grade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, rgba(26,18,16,0.10) 45%, rgba(26,18,16,0.85) 100%)",
          }}
        />

        {/* track orizzontale */}
        <div
          ref={trackRef}
          className="relative flex h-full items-center will-change-transform"
          style={{ width: "320vw", paddingLeft: "12vw", paddingRight: "12vw" }}
        >
          {/* eyebrow intro fluttuante */}
          <div className="absolute left-[10vw] top-[18vh] max-w-md">
            <p className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)] md:text-xs">
              MOV 02 · La mandria
            </p>
            <h2
              className="font-display mt-4 text-balance leading-[0.95]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4.6rem)" }}
            >
              Li conosciamo <span className="italic text-[color:var(--terracotta)]">uno per uno.</span>
            </h2>
            <p className="font-sans mt-5 text-sm text-[color:var(--crema)]/80 md:text-base">
              Un piano-sequenza lungo il pascolo. Ogni ritratto è una bestia che cresce qui,
              col suo nome, il suo tempo, la sua storia.
            </p>
          </div>

          {/* portraits */}
          {PORTRAITS.map((p) => {
            const left = `${12 + p.at * 280}vw`; // distribuzione lungo la track (320vw - padding)
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

          {/* outro micro-frase a fine carrellata */}
          <div className="absolute right-[6vw] top-[64vh] max-w-sm text-right">
            <p className="font-eyebrow text-[10px] tracking-[0.28em] text-[color:var(--oro)]/80">
              Specie e capi DA CONFERMARE
            </p>
            <p
              className="font-display mt-3 italic text-[color:var(--crema)]/90"
              style={{ fontSize: "clamp(1.25rem, 2.2vw, 1.8rem)" }}
            >
              Non sono numeri. Sono il nostro lavoro di ogni giorno.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════ MOV 2 · MOBILE (stack verticale) ════════════════════ */}
      <section
        aria-label="La mandria — versione mobile"
        className="relative block md:hidden bg-[color:var(--carbone)] px-6 py-20"
      >
        <p className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)]">
          MOV 02 · La mandria
        </p>
        <h2
          className="font-display mt-3 text-balance leading-[0.95]"
          style={{ fontSize: "clamp(2.2rem, 9vw, 3.2rem)" }}
        >
          Li conosciamo <span className="italic text-[color:var(--terracotta)]">uno per uno.</span>
        </h2>
        <p className="font-sans mt-4 text-sm text-[color:var(--crema)]/80">
          Ogni ritratto è una bestia che cresce qui. Col suo nome, il suo tempo, la sua storia.
        </p>
        <div className="mt-10 space-y-8">
          {PORTRAITS.map((p) => (
            <article key={p.id} data-portrait-mobile>
              <PortraitCard p={p} />
            </article>
          ))}
        </div>
      </section>

      {/* ════════════════════ MOV 3 · IL PATTO COL TEMPO ════════════════════ */}
      <section
        ref={pattoRef}
        aria-label="Il patto col tempo"
        className="relative h-[100svh] w-full overflow-hidden bg-[color:var(--carbone)]"
      >
        {/* vignetta calda */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(179,58,26,0.10) 0%, rgba(26,18,16,0) 60%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <p className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)] md:text-xs">
            MOV 03 · Il patto col tempo
          </p>
          <p
            className="font-display mt-10 max-w-5xl text-balance leading-[1.1]"
            style={{ fontSize: "clamp(1.6rem, 4.2vw, 3.4rem)" }}
          >
            {SPOTLIGHT_WORDS.map((w, i) => (
              <span
                key={`${w}-${i}`}
                ref={(el) => {
                  if (el) wordsRef.current[i] = el;
                }}
                className={
                  i === activeWord
                    ? "text-[color:var(--crema)]"
                    : "text-[color:var(--crema)]"
                }
                style={{ display: "inline-block", marginRight: "0.35em" }}
              >
                {w}
              </span>
            ))}
          </p>
          <p className="font-eyebrow mt-12 text-[10px] tracking-[0.32em] text-[color:var(--crema)]/45">
            Il giuramento dell'allevamento — Masseria Don Gianvito, Noci
          </p>
        </div>
      </section>

      {/* ════════════════════ BRIDGE → CASEIFICIO ════════════════════ */}
      <section
        ref={bridgeRef}
        aria-label="Ponte al Caseificio"
        className="relative h-[100svh] w-full overflow-hidden"
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
              "linear-gradient(180deg, rgba(26,18,16,0.78) 0%, rgba(26,18,16,0.35) 40%, rgba(26,18,16,0.92) 100%)",
          }}
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <p
            data-bridge-text
            className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)] md:text-xs"
          >
            Capitolo 02 · in arrivo
          </p>
          <h2
            data-bridge-text
            className="font-display mt-6 max-w-3xl text-balance leading-[0.95]"
            style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)" }}
          >
            E ogni mattina, da questa terra,{" "}
            <span className="italic text-[color:var(--terracotta)]">arriva il latte.</span>
          </h2>
          <p
            data-bridge-text
            className="font-sans mt-6 max-w-xl text-sm text-[color:var(--crema)]/80 md:text-base"
          >
            La stessa cura della stalla si sposta nelle mani del casaro, prima che il giorno cominci.
          </p>
          <button
            data-bridge-text
            type="button"
            onClick={goCaseificio}
            className="group mt-12 inline-flex items-center gap-3 border border-[color:var(--oro)]/60 px-6 py-3 text-[color:var(--crema)] transition-colors hover:bg-[color:var(--oro)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--oro)]"
          >
            <span className="font-eyebrow text-[11px] tracking-[0.32em]">
              Continua → Il Caseificio
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
        {/* sigillo / marca auricolare */}
        <div className="absolute left-3 top-3 flex items-center gap-2 border border-[color:var(--oro)]/70 bg-[color:var(--carbone)]/70 px-2.5 py-1 backdrop-blur">
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
