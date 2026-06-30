import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import terraImg from "@/assets/allev-a-terra.jpg";
import animaliImg from "@/assets/allev-b-animali.jpg";
import granoImg from "@/assets/allev-c-grano.jpg";
import tempoImg from "@/assets/allev-d-tempo.jpg";
import latteImg from "@/assets/allev-bridge-latte.jpg";

type Chapter = {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  note?: string;
  img: string;
  /** color-grade overlay sopra la foto, AA-safe */
  grade: string;
};

const CHAPTERS: Chapter[] = [
  {
    id: "terra",
    index: "Cap. A",
    eyebrow: "La terra",
    title: "Tutto nasce ",
    accent: "qui.",
    body: "Sulla nostra terra di Noci, all'aria dell'Alta Murgia, gli animali crescono con il ritmo lento della campagna.",
    note: "Noci, Alta Murgia · estensione DA CONFERMARE",
    img: terraImg,
    grade:
      "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, rgba(107,115,64,0.18) 55%, rgba(26,18,16,0.78) 100%)",
  },
  {
    id: "animali",
    index: "Cap. B",
    eyebrow: "I nostri animali",
    title: "Li conosciamo ",
    accent: "uno per uno.",
    body: "Bovini, ovini, suini, equini e avicoli, allevati in masseria. Non sono numeri: sono il nostro lavoro di ogni giorno.",
    note: "Specie e capi DA CONFERMARE col cliente",
    img: animaliImg,
    grade:
      "linear-gradient(180deg, rgba(26,18,16,0.45) 0%, rgba(179,58,26,0.10) 55%, rgba(26,18,16,0.78) 100%)",
  },
  {
    id: "grano",
    index: "Cap. C",
    eyebrow: "Ciò che mangiano",
    title: "Mangiano quello che ",
    accent: "coltiviamo noi.",
    body: "Foraggio e grano nascono nei nostri campi. Per questo sappiamo esattamente cosa arriva nel tuo piatto.",
    note: "Filiera mangimi DA CONFERMARE",
    img: granoImg,
    grade:
      "linear-gradient(180deg, rgba(26,18,16,0.35) 0%, rgba(196,154,74,0.15) 50%, rgba(26,18,16,0.8) 100%)",
  },
  {
    id: "tempo",
    index: "Cap. D",
    eyebrow: "Il loro tempo",
    title: "Crescono con il ",
    accent: "loro tempo.",
    body: "Senza fretta. È lentezza che si sente, poi, sulla brace: nel sapore, nella consistenza, nella memoria del fuoco.",
    img: tempoImg,
    grade:
      "linear-gradient(180deg, rgba(26,18,16,0.40) 0%, rgba(179,58,26,0.25) 50%, rgba(26,18,16,0.88) 100%)",
  },
];

const FILIERA = [
  { label: "Allevamento", to: "/allevamento" as const, active: true },
  { label: "Caseificio", to: "/caseificio" as const, active: false },
  { label: "Macelleria", to: "/macelleria" as const, active: false },
  { label: "Braceria", to: "/braceria" as const, active: false },
];

export function AllevamentoStory() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const introRef = useRef<HTMLElement>(null);
  const introImgRef = useRef<HTMLDivElement>(null);
  const introCoverRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);
  const panelsRef = useRef<HTMLDivElement[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const bridgeRef = useRef<HTMLElement>(null);
  const bridgeMaskRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [diving, setDiving] = useState(false);

  // --- INTRO + STAGE GSAP ---
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // INTRO: dissolvenza dal "tuffo" + ken-burns
      if (introCoverRef.current && introImgRef.current) {
        const tl = gsap.timeline();
        tl.fromTo(
          introCoverRef.current,
          { opacity: 1 },
          { opacity: 0, duration: 1.6, ease: "power3.out" },
        )
          .fromTo(
            introImgRef.current,
            { scale: 1.18, filter: "brightness(0.55) saturate(0.6)" },
            {
              scale: 1.05,
              filter: "brightness(0.85) saturate(0.95)",
              duration: 2.2,
              ease: "power2.out",
            },
            0,
          )
          .from(
            "[data-intro-reveal]",
            {
              yPercent: 110,
              duration: 1,
              ease: "power4.out",
              stagger: 0.12,
            },
            0.55,
          )
          .from(
            "[data-intro-fade]",
            { opacity: 0, y: 18, duration: 0.7, stagger: 0.08 },
            1.2,
          );
      }

      // Ken-burns lentissimo sull'intro
      if (introImgRef.current) {
        gsap.to(introImgRef.current, {
          scale: 1.18,
          yPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: introRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // STAGE pinnato con cross-fade dei 4 capitoli
      if (stageRef.current && stickyRef.current) {
        const layers = layersRef.current;
        const panels = panelsRef.current;

        // Setup iniziale dei layer (A visibile, gli altri spenti)
        layers.forEach((l, i) => {
          gsap.set(l, { opacity: i === 0 ? 1 : 0, scale: 1.04 });
        });
        panels.forEach((p, i) => {
          gsap.set(p, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 30 });
        });

        const segments = CHAPTERS.length; // 4
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top top",
            end: () => `+=${segments * 100}%`,
            scrub: 0.6,
            pin: stickyRef.current,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              const idx = Math.min(
                segments - 1,
                Math.floor(st.progress * segments),
              );
              setActiveIdx(idx);
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${st.progress})`;
              }
            },
          },
        });

        // Per ogni transizione i -> i+1
        for (let i = 0; i < segments - 1; i++) {
          const from = layers[i];
          const to = layers[i + 1];
          const pFrom = panels[i];
          const pTo = panels[i + 1];
          tl.to(pFrom, { autoAlpha: 0, y: -30, duration: 0.4 }, i + 0.55)
            .to(to, { opacity: 1, duration: 0.6 }, i + 0.5)
            .to(from, { opacity: 0, duration: 0.6 }, i + 0.65)
            .fromTo(
              pTo,
              { autoAlpha: 0, y: 30 },
              { autoAlpha: 1, y: 0, duration: 0.5 },
              i + 0.8,
            );
        }

        // micro parallax/ken-burns su ogni layer durante la sua presenza
        layers.forEach((l) => {
          gsap.to(l, {
            scale: 1.12,
            yPercent: -2,
            ease: "none",
            scrollTrigger: {
              trigger: stageRef.current,
              start: "top top",
              end: () => `+=${segments * 100}%`,
              scrub: true,
            },
          });
        });
      }

      // BRIDGE: rivelazione del latte con mask
      if (bridgeRef.current) {
        gsap.from("[data-bridge-text]", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: bridgeRef.current,
            start: "top 70%",
          },
        });
        if (bridgeMaskRef.current) {
          gsap.fromTo(
            bridgeMaskRef.current,
            { clipPath: "inset(50% 0 50% 0)" },
            {
              clipPath: "inset(0% 0 0% 0)",
              duration: 1.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: bridgeRef.current,
                start: "top 80%",
              },
            },
          );
        }
      }
    });

    return () => ctx.revert();
  }, [reduced]);

  // --- DIVE -> /caseificio ---
  const goCaseificio = () => {
    if (reduced) {
      navigate({ to: "/caseificio" });
      return;
    }
    setDiving(true);
    setTimeout(() => navigate({ to: "/caseificio" }), 850);
  };

  return (
    <div className="relative">
      {/* ============ INTRO ============ */}
      <section
        ref={introRef}
        className="relative h-[100svh] w-full overflow-hidden"
        aria-label="Apertura del capitolo Allevamento"
      >
        {/* foto */}
        <div
          ref={introImgRef}
          className="absolute inset-0 -z-10 will-change-transform"
          style={{
            backgroundImage: `url(${terraImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center 55%",
          }}
        />
        {/* grading AA */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,18,16,0.45) 0%, rgba(26,18,16,0.20) 35%, rgba(26,18,16,0.80) 100%)",
          }}
        />
        {/* "tuffo" warm cover, ereditato dall'hero */}
        <div
          ref={introCoverRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(179,58,26,0.85) 0%, rgba(110,26,20,0.95) 45%, rgba(26,18,16,1) 80%)",
          }}
        />

        {/* TOP overlay: back link + chapter index */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
          <Link
            to="/"
            data-intro-fade
            className="font-eyebrow group inline-flex items-center gap-2 text-[11px] text-[color:var(--crema)]/80 transition-colors hover:text-[color:var(--oro)]"
            aria-label="Torna alla masseria"
          >
            <span aria-hidden className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            La masseria
          </Link>
          <p
            data-intro-fade
            className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)] md:text-[11px]"
          >
            01 / 04 — Allevamento
          </p>
        </div>

        {/* Mini-indice filiera */}
        <nav
          data-intro-fade
          aria-label="Filiera"
          className="absolute inset-x-0 top-16 z-20 mx-auto hidden max-w-3xl items-center justify-center gap-6 md:flex"
        >
          {FILIERA.map((f, i) => (
            <div key={f.to} className="flex items-center gap-6">
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
                <span className="text-[color:var(--oro)]/70 mr-2">
                  0{i + 1}
                </span>
                {f.label}
              </Link>
              {i < FILIERA.length - 1 && (
                <span aria-hidden className="h-px w-6 bg-[color:var(--crema)]/15" />
              )}
            </div>
          ))}
        </nav>

        {/* TITOLO d'ingresso */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <div className="overflow-hidden">
            <p
              data-intro-reveal
              className="font-eyebrow text-[11px] tracking-[0.32em] text-[color:var(--oro)] md:text-xs"
            >
              Capitolo 01 · Allevamento
            </p>
          </div>

          <h1
            className="font-display mt-6 max-w-4xl text-balance leading-[0.95] text-[color:var(--crema)]"
            style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
          >
            <span className="block overflow-hidden">
              <span data-intro-reveal className="block">
                Dove tutto{" "}
                <span className="italic text-[color:var(--terracotta)]">
                  comincia.
                </span>
              </span>
            </span>
          </h1>

          <div className="mt-8 max-w-xl overflow-hidden">
            <p
              data-intro-reveal
              className="font-sans text-sm leading-relaxed text-[color:var(--crema)]/85 md:text-base"
            >
              Prima della carne, prima della brace, c'è la nostra terra e i
              nostri animali.
            </p>
          </div>
        </div>

        {/* scroll cue */}
        <div
          data-intro-fade
          className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-3 text-[color:var(--crema)]/70"
        >
          <span className="font-eyebrow text-[10px] tracking-[0.28em]">
            Scendi nella masseria
          </span>
          <motion.span
            aria-hidden
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-[color:var(--oro)] to-transparent"
          />
        </div>
      </section>

      {/* ============ STAGE PINNATO (desktop) ============ */}
      <section
        ref={stageRef}
        aria-label="Il risveglio della masseria"
        className="relative hidden md:block"
        style={{ height: `${CHAPTERS.length * 100}vh` }}
      >
        <div
          ref={stickyRef}
          className="sticky top-0 h-[100svh] w-full overflow-hidden"
        >
          {/* Layer immagini */}
          {CHAPTERS.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                if (el) layersRef.current[i] = el;
              }}
              aria-hidden
              className="absolute inset-0 will-change-[opacity,transform]"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${c.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                className="absolute inset-0"
                style={{ background: c.grade }}
              />
            </div>
          ))}

          {/* Top progress overlay */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8">
            <Link
              to="/"
              className="font-eyebrow group inline-flex items-center gap-2 text-[11px] text-[color:var(--crema)]/85 transition-colors hover:text-[color:var(--oro)]"
            >
              <span aria-hidden className="transition-transform group-hover:-translate-x-1">
                ←
              </span>
              La masseria
            </Link>
            <p className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)] md:text-[11px]">
              01 / 04 — Allevamento
            </p>
          </div>

          {/* Progress bar capitoli */}
          <div className="absolute inset-x-0 top-16 z-20 mx-auto max-w-6xl px-6 md:px-10">
            <div className="flex items-center gap-2">
              {CHAPTERS.map((c, i) => (
                <div key={c.id} className="flex-1">
                  <p
                    className={[
                      "font-eyebrow mb-2 text-[9px] tracking-[0.28em] transition-colors",
                      i === activeIdx
                        ? "text-[color:var(--oro)]"
                        : "text-[color:var(--crema)]/40",
                    ].join(" ")}
                  >
                    {c.index} · {c.eyebrow}
                  </p>
                  <div className="h-px w-full bg-[color:var(--crema)]/15">
                    <motion.div
                      animate={{
                        scaleX:
                          i < activeIdx
                            ? 1
                            : i === activeIdx
                              ? 0.5
                              : 0,
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ transformOrigin: "left" }}
                      className="h-full origin-left bg-[color:var(--oro)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pannelli testo (uno per capitolo, sovrapposti) */}
          {CHAPTERS.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => {
                if (el) panelsRef.current[i] = el;
              }}
              className="pointer-events-none absolute inset-0 z-10 flex items-end"
            >
              <div className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-10 md:pb-32">
                <p className="font-eyebrow text-[10px] tracking-[0.32em] text-[color:var(--oro)]">
                  {c.index} · {c.eyebrow}
                </p>
                <h2
                  className="font-display mt-5 max-w-4xl text-balance leading-[0.95] text-[color:var(--crema)]"
                  style={{ fontSize: "clamp(2.4rem, 6.5vw, 5.5rem)" }}
                >
                  {c.title}
                  <span className="italic text-[color:var(--terracotta)]">
                    {c.accent}
                  </span>
                </h2>
                <p className="font-sans mt-6 max-w-xl text-base leading-relaxed text-[color:var(--crema)]/85 md:text-lg">
                  {c.body}
                </p>
                {c.note && (
                  <p className="font-eyebrow mt-5 text-[10px] tracking-[0.24em] text-[color:var(--crema)]/45">
                    ⓘ {c.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ STACKED FALLBACK (mobile + reduced-motion) ============ */}
      <section
        aria-label="Il risveglio della masseria — versione mobile"
        className="relative md:hidden"
      >
        {CHAPTERS.map((c) => (
          <article
            key={c.id}
            className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                backgroundImage: `url(${c.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{ background: c.grade }}
            />
            <div className="px-6 pb-16 pt-32">
              <p className="font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--oro)]">
                {c.index} · {c.eyebrow}
              </p>
              <h2
                className="font-display mt-4 text-balance leading-[0.98] text-[color:var(--crema)]"
                style={{ fontSize: "clamp(2.2rem, 9vw, 3.4rem)" }}
              >
                {c.title}
                <span className="italic text-[color:var(--terracotta)]">
                  {c.accent}
                </span>
              </h2>
              <p className="font-sans mt-5 text-[15px] leading-relaxed text-[color:var(--crema)]/85">
                {c.body}
              </p>
              {c.note && (
                <p className="font-eyebrow mt-4 text-[10px] tracking-[0.24em] text-[color:var(--crema)]/50">
                  ⓘ {c.note}
                </p>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* ============ BRIDGE → CASEIFICIO ============ */}
      <section
        ref={bridgeRef}
        aria-label="Ponte verso il Caseificio"
        className="relative min-h-[100svh] w-full overflow-hidden"
      >
        <div
          ref={bridgeMaskRef}
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: `url(${latteImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,18,16,0.85) 0%, rgba(26,18,16,0.55) 45%, rgba(26,18,16,0.92) 100%)",
          }}
        />

        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-5xl flex-col items-center justify-center px-6 text-center">
          <p
            data-bridge-text
            className="font-eyebrow text-[11px] tracking-[0.32em] text-[color:var(--oro)]"
          >
            Continua il racconto
          </p>
          <h2
            data-bridge-text
            className="font-display mt-6 max-w-3xl text-balance leading-[0.98] text-[color:var(--crema)]"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4.6rem)" }}
          >
            E ogni mattina, da questa terra,{" "}
            <span className="italic text-[color:var(--terracotta)]">
              arriva il latte.
            </span>
          </h2>
          <p
            data-bridge-text
            className="font-sans mt-6 max-w-xl text-[color:var(--crema)]/80 md:text-lg"
          >
            Dal pascolo al caseificio: la prossima tappa del racconto.
          </p>

          <motion.button
            data-bridge-text
            type="button"
            onClick={goCaseificio}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-grad-brace mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--crema)] shadow-[0_18px_50px_-12px_rgba(179,58,26,0.7)] ring-1 ring-[color:var(--oro)]/30"
          >
            Continua
            <span aria-hidden className="text-[color:var(--oro)]">
              →
            </span>
            Il Caseificio
          </motion.button>

          <p
            data-bridge-text
            className="font-eyebrow mt-6 text-[10px] tracking-[0.28em] text-[color:var(--crema)]/45"
          >
            02 / 04 — Caseificio
          </p>
        </div>

        {/* Progress globale capitolo, in basso */}
        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-6xl px-6 pb-6 md:px-10">
          <div className="h-px w-full bg-[color:var(--crema)]/15">
            <div
              ref={progressRef}
              className="h-full origin-left bg-[color:var(--oro)]"
              style={{ transform: "scaleX(1)" }}
            />
          </div>
        </div>
      </section>

      {/* DIVE overlay (transizione coerente con l'hero) */}
      <AnimatePresence>
        {diving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-0 z-[100]"
            aria-hidden
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1.6, opacity: 1 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 55%, rgba(242,232,213,0.95) 0%, rgba(196,154,74,0.85) 30%, rgba(26,18,16,1) 75%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
