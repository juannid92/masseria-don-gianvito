import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import aerialAsset from "@/assets/masseria-aerial.asset.json";
import terraImg from "@/assets/allev-a-terra.jpg";
import panoramaImg from "@/assets/allev-panorama.jpg";
import pBovino from "@/assets/allev-p-bovino.jpg";
import pOvino from "@/assets/allev-p-ovino.jpg";
import pSuino from "@/assets/allev-p-suino.jpg";
import pEquino from "@/assets/allev-p-equino.jpg";
import pAvicolo from "@/assets/allev-p-avicolo.jpg";
import granoImg from "@/assets/allev-c-grano.jpg";

/* ─────────────────────────── DATA ─────────────────────────── */

type Species = {
  id: string;
  tag: string;   // ear-tag number
  title: string; // name/label
  species: string;
  line: string;  // single-line description
  micro: string; // micro-anima
  img: string;
};

const SPECIES: Species[] = [
  {
    id: "bovini",
    tag: "N° 047",
    title: "La prima del mattino",
    species: "Bovini · Pezzata Rossa × Frisona",
    line: "Pezzata Rossa × Frisona. Per il latte e la carne.",
    micro: "Centinaia di capi, mungitura all'alba.",
    img: pBovino,
  },
  {
    id: "ovini",
    tag: "N° 112",
    title: "Cinque ore nel forno a legna",
    species: "Ovini",
    line: "Per la Pecora in Pignata, cinque ore nel forno a legna.",
    micro: "Cresce sull'erba dell'Alta Murgia.",
    img: pOvino,
  },
  {
    id: "suini",
    tag: "N° 203",
    title: "Bombette e salsicce",
    species: "Suini",
    line: "Per salsicce, bombette e salumi di propria produzione.",
    micro: "Razzola tra ulivi e ghiande.",
    img: pSuino,
  },
  {
    id: "equini",
    tag: "N° 018",
    title: "Lo sguardo lungo",
    species: "Equini",
    line: "Al pascolo nella Murgia.",
    micro: "Con noi da sette inverni.",
    img: pEquino,
  },
  {
    id: "avicoli",
    tag: "N° 318",
    title: "Ore piccole dell'aia",
    species: "Avicoli",
    line: "Liberi tra gli ulivi.",
    micro: "Razzolano all'ombra del fienile.",
    img: pAvicolo,
  },
];

const MANIFESTO = [
  "Coltiviamo", "il", "foraggio", "per", "le", "bestie.",
  "L'ortaggio", "per", "la", "tavola.",
  "Il", "grano", "tenero", "per", "la", "focaccia",
  "e", "le", "frittelle.",
  "Tutto", "nasce", "qui.",
  "Tutto", "resta", "qui.",
  "Qui", "non", "arriva", "niente", "da", "fuori.",
];

/* ─────────────────────────── COMPONENT ─────────────────────────── */

export function AllevamentoStory() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [quota, setQuota] = useState(120);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (reduced) return;

      const mm = gsap.matchMedia();

      /* ══════════ MOV 1 · L'ATTERRAGGIO ══════════ */
      const mov1 = root.querySelector<HTMLElement>("[data-mov='1']");
      const aerial = root.querySelector<HTMLElement>("[data-aerial]");
      const terra = root.querySelector<HTMLElement>("[data-terra]");
      const horizonTitle = root.querySelector<HTMLElement>("[data-horizon-title]");

      if (mov1 && aerial && terra) {
        // Focus-pull + morph aerial → terra
        gsap.set(terra, { autoAlpha: 0, scale: 1.1, filter: "blur(6px)" });
        gsap.set(aerial, { autoAlpha: 1, scale: 1.0, filter: "blur(0px)" });

        ScrollTrigger.create({
          trigger: mov1,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            // aerial fades out first half, terra fades in second half
            gsap.set(aerial, {
              autoAlpha: 1 - Math.min(1, p * 1.6),
              scale: 1 + p * 0.15,
              filter: `blur(${p * 4}px)`,
            });
            gsap.set(terra, {
              autoAlpha: Math.max(0, (p - 0.35) * 2),
              scale: 1.1 - p * 0.1,
              filter: `blur(${Math.max(0, 6 - p * 10)}px)`,
            });
            setQuota(Math.round(120 * (1 - p)));
          },
        });

        // Horizon title mask reveal (near end of MOV 1)
        if (horizonTitle) {
          gsap.fromTo(
            horizonTitle,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              ease: "power2.out",
              scrollTrigger: {
                trigger: mov1,
                start: "70% top",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }
      }

      /* ══════════ MOV 2 · LA MANDRIA ══════════ */
      mm.add("(min-width: 900px)", () => {
        const mov2 = root.querySelector<HTMLElement>("[data-mov='2']");
        const track = root.querySelector<HTMLElement>("[data-mandria-track]");
        if (!mov2 || !track) return;

        const distance = () => track.scrollWidth - window.innerWidth;

        const tw = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: mov2,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // portrait parallax + reveal
        root.querySelectorAll<HTMLElement>("[data-portrait]").forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: 40, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                containerAnimation: tw,
                start: "left 85%",
                once: true,
              },
            },
          );
          const depth = Number(el.dataset.depth ?? 1);
          gsap.to(el, {
            y: -30 * depth,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              containerAnimation: tw,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          });
          // Counter
          const counter = root.querySelector<HTMLElement>("[data-counter]");
          if (counter) {
            ScrollTrigger.create({
              trigger: el,
              containerAnimation: tw,
              start: "left center",
              end: "right center",
              onToggle: (self) => {
                if (self.isActive) counter.textContent = `0${i + 1} / 0${SPECIES.length}`;
              },
            });
          }
        });
      });

      mm.add("(max-width: 899px)", () => {
        root.querySelectorAll<HTMLElement>("[data-portrait]").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 30, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        });
      });

      /* ══════════ MOV 3 · LA TERRA NUTRE — spotlight reading ══════════ */
      const mov3 = root.querySelector<HTMLElement>("[data-mov='3']");
      const spotWrap = root.querySelector<HTMLElement>("[data-spotlight]");
      if (mov3 && spotWrap) {
        const words = spotWrap.querySelectorAll<HTMLElement>("[data-word]");
        gsap.set(words, { color: "rgba(242,232,213,0.18)" });

        ScrollTrigger.create({
          trigger: mov3,
          start: "top top",
          end: "+=" + words.length * 60,
          pin: spotWrap,
          scrub: 1,
          onUpdate: (self) => {
            const active = Math.floor(self.progress * words.length);
            words.forEach((w, i) => {
              const dist = Math.abs(i - active);
              if (dist === 0) w.style.color = "rgba(242,232,213,1)";
              else if (dist === 1) w.style.color = "rgba(242,232,213,0.6)";
              else if (dist === 2) w.style.color = "rgba(242,232,213,0.35)";
              else w.style.color = "rgba(242,232,213,0.18)";
            });
          },
        });
      }

      /* ══════════ Filo d'oro — continuo, esce verso caseificio ══════════ */
      const thread = root.querySelector<HTMLElement>("[data-thread] path");
      if (thread) {
        const len = (thread as unknown as SVGPathElement).getTotalLength?.() ?? 4000;
        gsap.set(thread, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(thread, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="relative w-full text-[color:var(--crema)]"
      style={{ background: "var(--marrone)" }}
    >
      {/* Filo d'oro globale (fixed, dietro tutto) */}
      <svg
        data-thread
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 1000"
      >
        <path
          d="M 50 0 C 30 200, 70 400, 40 600 S 60 900, 55 1000"
          fill="none"
          stroke="var(--oro)"
          strokeWidth="0.25"
          opacity="0.55"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* ═════════════════════════════════════════════════════════
          MOV 1 · L'ATTERRAGGIO
          ═════════════════════════════════════════════════════════ */}
      <section
        data-mov="1"
        className="relative h-[220vh]"
        aria-label="L'atterraggio"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Aerial (dall'hero) */}
          <div
            data-aerial
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${aerialAsset.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Terra (crossfade) */}
          <div
            data-terra
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${terraImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center 55%",
            }}
          />
          {/* Vignette + tint marrone → oliva */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(61,42,30,0.35) 0%, rgba(61,42,30,0.1) 40%, rgba(107,115,64,0.35) 100%)",
            }}
          />

          {/* Rail verticale sx */}
          <div
            className="absolute left-4 md:left-8 top-0 h-full flex items-center pointer-events-none z-10"
            aria-hidden
          >
            <div
              className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/70"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                letterSpacing: "0.3em",
              }}
            >
              ALLEVAMENTO · I · NOCI · QUOTA {String(quota).padStart(3, "0")}m
            </div>
          </div>

          {/* Titolo sull'orizzonte */}
          <div className="absolute inset-x-0 top-[58%] flex justify-center pointer-events-none px-6">
            <h1
              data-horizon-title
              className="font-display text-[color:var(--crema)] text-center leading-[0.9]"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 6.5rem)",
                textShadow: "0 2px 30px rgba(26,18,16,0.6)",
                fontWeight: 300,
              }}
            >
              Dove tutto comincia
            </h1>
          </div>

          {/* Grana */}
          <div className="grain absolute inset-0 pointer-events-none" />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          MOV 2 · LA MANDRIA — carrellata orizzontale
          ═════════════════════════════════════════════════════════ */}
      <section
        data-mov="2"
        className="relative"
        aria-label="La Mandria"
        style={{
          background:
            "linear-gradient(180deg, var(--oliva) 0%, color-mix(in oklab, var(--oliva) 40%, var(--marrone)) 100%)",
        }}
      >
        {/* Desktop: track orizzontale · Mobile: stack verticale */}
        <div className="hidden md:block relative h-screen overflow-hidden">
          {/* Panorama di sfondo */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url(${panoramaImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "sepia(0.2) saturate(0.8)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(61,42,30,0.55) 0%, rgba(61,42,30,0.25) 50%, rgba(61,42,30,0.75) 100%)",
            }}
          />

          {/* Header pinnato */}
          <div className="absolute top-8 left-8 z-20 font-eyebrow text-[11px] text-[color:var(--crema)]/60">
            LA MANDRIA · PIANO SEQUENZA
          </div>
          <div
            data-counter
            className="absolute bottom-8 right-8 z-20 font-eyebrow text-[13px] text-[color:var(--crema)]/70"
          >
            01 / 0{SPECIES.length}
          </div>

          <div
            data-mandria-track
            className="absolute top-0 left-0 h-full flex items-center gap-16 pl-[10vw] pr-[20vw] will-change-transform"
            style={{ width: "max-content" }}
          >
            {SPECIES.map((s, i) => (
              <PortraitCard key={s.id} s={s} idx={i} depth={0.6 + (i % 3) * 0.2} />
            ))}
          </div>
        </div>

        {/* Mobile: stack verticale */}
        <div className="md:hidden px-5 py-16 space-y-10">
          <div className="font-eyebrow text-[10px] text-[color:var(--crema)]/60 tracking-[0.3em]">
            LA MANDRIA
          </div>
          {SPECIES.map((s, i) => (
            <PortraitCard key={s.id} s={s} idx={i} depth={1} mobile />
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════
          MOV 3 · LA TERRA NUTRE — spotlight reading
          ═════════════════════════════════════════════════════════ */}
      <section
        data-mov="3"
        className="relative"
        aria-label="La Terra nutre"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--oliva) 30%, var(--marrone)) 0%, var(--marrone) 40%, #2a1c14 100%)",
        }}
      >
        {/* Contenitore spotlight — pinnato */}
        <div
          data-spotlight
          className="relative h-screen w-full flex flex-col items-center justify-center px-6"
        >
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--oro)]/70 mb-8 tracking-[0.3em]">
            LA TERRA NUTRE · MANIFESTO
          </div>
          <p
            className="font-display text-center max-w-5xl leading-[1.15]"
            style={{ fontSize: "clamp(1.6rem, 3.4vw, 3rem)", fontWeight: 300 }}
          >
            {MANIFESTO.map((w, i) => (
              <span key={i} data-word className="inline-block transition-colors duration-200">
                {w}
                {i < MANIFESTO.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
          </p>
        </div>

        {/* Striscia dati reali */}
        <div className="relative border-y border-[color:var(--oro)]/25 py-8 md:py-10 overflow-hidden">
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `url(${granoImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative flex flex-wrap justify-center items-center gap-x-8 gap-y-3 px-6 text-center font-eyebrow text-[11px] md:text-[13px] text-[color:var(--crema)]/85 tracking-[0.28em]">
            <span>FORAGGIO</span>
            <span className="text-[color:var(--oro)]">·</span>
            <span>ORTAGGI</span>
            <span className="text-[color:var(--oro)]">·</span>
            <span>GRANO TENERO</span>
            <span className="text-[color:var(--oro)]">·</span>
            <span>FRUTTA</span>
            <span className="text-[color:var(--oro)]">—</span>
            <span className="text-[color:var(--oro)]/90">COLTIVATI IN MASSERIA</span>
          </div>
          <div className="relative mt-4 text-center font-display italic text-[color:var(--crema)]/60 text-sm md:text-base">
            Masseria del '500 · iscritta CCIAA dal 2002 · oltre vent'anni di filiera chiusa
          </div>
        </div>

        {/* Ponte al Caseificio — il filo prosegue */}
        <div className="relative py-24 md:py-32 flex flex-col items-center justify-center px-6 text-center">
          <div className="font-eyebrow text-[10px] text-[color:var(--crema)]/50 tracking-[0.35em] mb-6">
            CONTINUA · CAPITOLO II
          </div>
          <Link
            to="/caseificio"
            className="group inline-block font-display text-[color:var(--crema)] hover:text-[color:var(--oro)] transition-colors"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 300 }}
          >
            Il Caseificio
            <span
              aria-hidden
              className="block mx-auto mt-3 h-px bg-[color:var(--oro)] transition-all duration-500"
              style={{ width: "40%" }}
            />
          </Link>
          <p className="mt-6 max-w-xl text-[color:var(--crema)]/60 text-sm md:text-base italic">
            Il latte della mattina non aspetta. Segue il filo.
          </p>

          {/* Filo che esce in basso */}
          <svg
            aria-hidden
            className="mt-16 h-24 w-px opacity-70"
            viewBox="0 0 1 100"
            preserveAspectRatio="none"
          >
            <line x1="0.5" y1="0" x2="0.5" y2="100" stroke="var(--oro)" strokeWidth="1" />
          </svg>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── Portrait Card ─────────────────────────── */

function PortraitCard({
  s,
  idx,
  depth,
  mobile = false,
}: {
  s: Species;
  idx: number;
  depth: number;
  mobile?: boolean;
}) {
  return (
    <article
      data-portrait
      data-depth={depth}
      className={`relative shrink-0 ${mobile ? "w-full" : "w-[62vw] max-w-[540px]"}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-2xl">
        <img
          src={s.img}
          alt={`${s.species} — ${s.title}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ filter: "saturate(0.85) contrast(1.05)" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(61,42,30,0) 40%, rgba(26,18,16,0.75) 100%)",
          }}
        />

        {/* Marchio auricolare */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center rounded-sm px-2 py-1 font-eyebrow text-[10px] tracking-[0.2em]"
            style={{
              background: "var(--oro)",
              color: "var(--marrone)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            }}
          >
            {s.tag}
          </span>
          <span className="font-eyebrow text-[10px] text-[color:var(--crema)]/85 tracking-[0.25em]">
            0{idx + 1}
          </span>
        </div>

        {/* Testo in basso */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--oro)]/90 tracking-[0.3em] mb-2">
            {s.species}
          </div>
          <h3
            className="font-display text-[color:var(--crema)] leading-[1.05] mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)", fontWeight: 300 }}
          >
            {s.title}
          </h3>
          <p className="text-[color:var(--crema)]/85 text-sm md:text-base leading-snug">
            {s.line}
          </p>
          <p className="mt-1 text-[color:var(--crema)]/55 text-xs md:text-sm italic">
            {s.micro}
          </p>
        </div>
      </div>
    </article>
  );
}
