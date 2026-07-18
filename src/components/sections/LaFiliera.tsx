import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * LA FILIERA — "Una materia che cambia forma"
 * Un unico palco centrale. 8 stati (Terra → Pascolo → Allevamento
 * → Latte → Formaggio → Carne → Cottura → Tavola). La stessa
 * materia si trasforma: bordo organico + colore + traccia continua.
 * Terracotta appare SOLO nello stato 07 (Cottura).
 * ───────────────────────────────────────────────────────────── */

type State = {
  n: string;
  key: string;
  cat: string;
  title: [string, string];
  body: string;
  detail?: string;
  // materia
  radius: string;
  scaleX: number;
  scaleY: number;
  rotate: number;
  skewX: number;
  bg: string; // gradient interno materia
  core: string; // colore nucleo interno
  coreOpacity: number;
  ring: string; // colore contorno
  stageBg: string; // colore fondo palco
  textOnLight?: boolean;
  products?: string[]; // annotazioni intorno alla materia
};

const STATES: State[] = [
  {
    n: "01",
    key: "terra",
    cat: "01 — TERRA",
    title: ["Tutto comincia", "da ciò che coltiviamo."],
    body: "Foraggio, ortaggi, frutta e grano tenero nascono nei terreni della Masseria.",
    detail: "La nostra farina viene utilizzata anche per focaccia e frittelle.",
    radius: "58% 42% 62% 38% / 38% 55% 45% 62%",
    scaleX: 1.15,
    scaleY: 0.62,
    rotate: -3,
    skewX: -2,
    bg: "radial-gradient(70% 60% at 50% 55%, #6b4a2f 0%, #3D2A1E 55%, #1a1210 100%)",
    core: "#8a6a45",
    coreOpacity: 0.35,
    ring: "rgba(196,154,74,0.20)",
    stageBg: "linear-gradient(180deg, #241812 0%, #1A1210 100%)",
  },
  {
    n: "02",
    key: "pascolo",
    cat: "02 — PASCOLO",
    title: ["La terra", "diventa nutrimento."],
    body: "Ciò che viene coltivato continua nel lavoro quotidiano dell’allevamento.",
    radius: "55% 45% 55% 45% / 42% 50% 50% 58%",
    scaleX: 1.25,
    scaleY: 0.68,
    rotate: -1,
    skewX: -1,
    bg: "radial-gradient(72% 60% at 50% 55%, #7a7a3e 0%, #4a4a24 45%, #211a10 100%)",
    core: "#9DA85A",
    coreOpacity: 0.38,
    ring: "rgba(157,168,90,0.28)",
    stageBg: "linear-gradient(180deg, #2a2618 0%, #1c1810 100%)",
  },
  {
    n: "03",
    key: "allevamento",
    cat: "03 — ALLEVAMENTO",
    title: ["Animali cresciuti", "nel luogo che conosciamo."],
    body: "Bovini, ovini, suini, equini e avicoli fanno parte della vita agricola della Masseria.",
    detail: "I bovini sono un incrocio tra Pezzata Rossa e Frisona, destinati alla produzione di latte e carne.",
    radius: "50% 50% 55% 45% / 55% 50% 50% 45%",
    scaleX: 1.05,
    scaleY: 0.85,
    rotate: 1,
    skewX: 0,
    bg: "radial-gradient(60% 55% at 50% 45%, #7a5c3a 0%, #4a2f1e 55%, #1a1210 100%)",
    core: "#C49A4A",
    coreOpacity: 0.32,
    ring: "rgba(196,154,74,0.30)",
    stageBg: "linear-gradient(180deg, #2b1e15 0%, #1A1210 100%)",
  },
  {
    n: "04",
    key: "latte",
    cat: "04 — LATTE",
    title: ["Ogni mattina,", "il primo gesto."],
    body: "Il latte viene munto ogni mattina e passa direttamente al lavoro del caseificio.",
    radius: "50% 50% 50% 50% / 60% 60% 40% 40%",
    scaleX: 0.78,
    scaleY: 1.05,
    rotate: 0,
    skewX: 0,
    bg: "radial-gradient(60% 70% at 50% 45%, #f7efdd 0%, #e6d7b8 55%, #a89778 100%)",
    core: "#ffffff",
    coreOpacity: 0.55,
    ring: "rgba(196,154,74,0.22)",
    stageBg: "linear-gradient(180deg, #33261b 0%, #1c130f 100%)",
  },
  {
    n: "05",
    key: "formaggio",
    cat: "05 — CASEIFICIO",
    title: ["Il bianco", "prende forma."],
    body: "Mozzarelle, nodini, primo sale e ricotta nascono dal latte lavorato nella Masseria.",
    radius: "48% 52% 46% 54% / 50% 48% 52% 50%",
    scaleX: 0.92,
    scaleY: 0.92,
    rotate: 2,
    skewX: 1,
    bg: "radial-gradient(55% 55% at 50% 50%, #fbf6e8 0%, #efe4c8 55%, #b09a72 100%)",
    core: "#fff8e6",
    coreOpacity: 0.5,
    ring: "rgba(196,154,74,0.25)",
    stageBg: "linear-gradient(180deg, #2e2318 0%, #1A1210 100%)",
    products: ["MOZZARELLA", "NODINI", "PRIMO SALE", "RICOTTA"],
  },
  {
    n: "06",
    key: "carne",
    cat: "06 — MACELLERIA",
    title: ["La scelta", "avviene a vista."],
    body: "La carne viene esposta al banco e scelta prima di sedersi a tavola.",
    detail: "Frollatura indicativa di circa quindici giorni — variabile secondo il taglio.",
    radius: "45% 55% 50% 50% / 55% 45% 55% 45%",
    scaleX: 1.0,
    scaleY: 0.82,
    rotate: -2,
    skewX: -1,
    bg: "radial-gradient(60% 60% at 50% 50%, #7a2018 0%, #4a120e 55%, #1a0a08 100%)",
    core: "#a83028",
    coreOpacity: 0.55,
    ring: "rgba(110,26,20,0.55)",
    stageBg: "linear-gradient(180deg, #2a1512 0%, #1A1210 100%)",
  },
  {
    n: "07",
    key: "cottura",
    cat: "07 — COTTURA",
    title: ["Il calore", "completa il passaggio."],
    body: "Dopo la scelta al banco, la carne viene cotta arrosto sui carboni e servita durante il pasto.",
    radius: "50% 50% 48% 52% / 48% 52% 48% 52%",
    scaleX: 1.05,
    scaleY: 0.78,
    rotate: 3,
    skewX: 2,
    // unica scena in cui appare il terracotta
    bg: "radial-gradient(58% 60% at 50% 55%, #d05a20 0%, #B33A1A 45%, #4a1a10 100%)",
    core: "#f2a04a",
    coreOpacity: 0.6,
    ring: "rgba(179,58,26,0.60)",
    stageBg: "linear-gradient(180deg, #2a1610 0%, #1A1210 100%)",
  },
  {
    n: "08",
    key: "tavola",
    cat: "08 — TAVOLA",
    title: ["La filiera", "diventa ospitalità."],
    body: "Antipasti, primi, carne e dolci artigianali compongono un’esperienza completa.",
    radius: "40% 60% 40% 60% / 45% 45% 55% 55%",
    scaleX: 1.55,
    scaleY: 0.42,
    rotate: 0,
    skewX: 0,
    bg: "radial-gradient(70% 55% at 50% 55%, #f2e8d5 0%, #d9c8a4 55%, #8a7458 100%)",
    core: "#f7efdd",
    coreOpacity: 0.45,
    ring: "rgba(107,115,64,0.35)",
    stageBg: "linear-gradient(180deg, #2a2015 0%, #1c150f 100%)",
    textOnLight: false,
    products: ["ANTIPASTI", "PRIMI", "CARNE", "DOLCI"],
  },
];

const INDEX_LABELS = [
  "Terra",
  "Pascolo",
  "Allevamento",
  "Latte",
  "Caseificio",
  "Macelleria",
  "Cottura",
  "Tavola",
];

export function LaFiliera() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const matterRef = useRef<HTMLDivElement>(null);
  const matterInnerRef = useRef<HTMLDivElement>(null);
  const matterCoreRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const traceRef = useRef<SVGPathElement>(null);
  const stageBgRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  // Desktop timeline
  useEffect(() => {
    if (typeof window === "undefined" || reduced) return;
    const root = rootRef.current;
    const stage = stageRef.current;
    const matter = matterRef.current;
    const inner = matterInnerRef.current;
    const core = matterCoreRef.current;
    const shadow = shadowRef.current;
    const trace = traceRef.current;
    const stageBg = stageBgRef.current;
    const progressBar = progressBarRef.current;
    if (!root || !stage || !matter || !inner || !core || !shadow) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    let cancelled = false;

    mm.add("(min-width: 900px)", () => {
      const N = STATES.length; // 8
      const perState = 68; // vh per stato (~544vh totali)
      const scrollLen = N * perState;

      // Set iniziale = stato 0
      const s0 = STATES[0];
      gsap.set(matter, {
        scaleX: s0.scaleX,
        scaleY: s0.scaleY,
        rotate: s0.rotate,
        skewX: s0.skewX,
        borderRadius: s0.radius,
        borderColor: s0.ring,
        backgroundImage: s0.bg,
      });
      gsap.set(core, { backgroundColor: s0.core, opacity: s0.coreOpacity });
      gsap.set(stageBg, { backgroundImage: s0.stageBg });

      // Timeline scrubbata: label per stato, tween tra stati
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${scrollLen}%`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const idx = Math.min(N - 1, Math.floor(p * N));
            setActive((prev) => (prev !== idx ? idx : prev));
            if (progressBar) progressBar.style.transform = `scaleX(${p})`;
          },
        },
      });

      STATES.forEach((s, i) => {
        tl.addLabel(s.key, i);
        if (i === 0) return;
        tl.to(
          matter,
          {
            scaleX: s.scaleX,
            scaleY: s.scaleY,
            rotate: s.rotate,
            skewX: s.skewX,
            borderRadius: s.radius,
            borderColor: s.ring,
            backgroundImage: s.bg,
            duration: 1,
          },
          i - 1,
        );
        tl.to(
          core,
          { backgroundColor: s.core, opacity: s.coreOpacity, duration: 1 },
          i - 1,
        );
        tl.to(
          stageBg,
          { backgroundImage: s.stageBg, duration: 1 },
          i - 1,
        );
      });

      // trace continua (arc oro-oliva che cresce lungo tutta la sezione)
      if (trace) {
        const len = trace.getTotalLength();
        trace.style.strokeDasharray = String(len);
        trace.style.strokeDashoffset = String(len);
        gsap.to(trace, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: `+=${scrollLen}%`,
            scrub: 0.7,
          },
        });
      }

      return () => {
        tl.kill();
      };
    });

    // Refresh dopo fonts
    const onReady = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };
    if (document.fonts && (document.fonts as unknown as { ready?: Promise<unknown> }).ready) {
      (document.fonts as unknown as { ready: Promise<unknown> }).ready.then(onReady);
    }

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, [reduced]);

  // Mobile: sticky matter + IntersectionObserver su blocchi verticali
  useEffect(() => {
    if (typeof window === "undefined" || reduced) return;
    if (window.matchMedia("(min-width: 900px)").matches) return;
    const root = rootRef.current;
    const matter = matterRef.current;
    const core = matterCoreRef.current;
    const stageBg = stageBgRef.current;
    if (!root || !matter || !core || !stageBg) return;

    const applyState = (i: number) => {
      const s = STATES[i];
      gsap.to(matter, {
        scaleX: s.scaleX,
        scaleY: s.scaleY,
        rotate: s.rotate,
        skewX: s.skewX,
        borderRadius: s.radius,
        borderColor: s.ring,
        backgroundImage: s.bg,
        duration: 0.7,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(core, {
        backgroundColor: s.core,
        opacity: s.coreOpacity,
        duration: 0.7,
        overwrite: "auto",
      });
      gsap.to(stageBg, {
        backgroundImage: s.stageBg,
        duration: 0.7,
        overwrite: "auto",
      });
    };
    applyState(0);

    const blocks = root.querySelectorAll<HTMLElement>("[data-mobile-block]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.mobileBlock);
            if (!Number.isNaN(i)) {
              setActive(i);
              applyState(i);
            }
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );
    blocks.forEach((b) => io.observe(b));
    return () => io.disconnect();
  }, [reduced]);

  /* ============================ REDUCED MOTION ============================ */
  if (reduced) {
    return (
      <section
        id="filiera"
        aria-label="La Filiera — una materia che cambia forma"
        className="relative w-full bg-[color:var(--carbone)] px-6 py-24 text-[color:var(--crema)] md:px-10"
      >
        <div className="mx-auto max-w-4xl">
          <p className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro)]/70">
            04 — LA FILIERA
          </p>
          <h2
            className="font-display italic mt-6"
            style={{ fontSize: "clamp(2rem,4.5vw,3.4rem)", lineHeight: 1.02, fontWeight: 300 }}
          >
            Una materia
            <br />
            che cambia forma.
          </h2>
          <p className="mt-6 max-w-xl text-[color:var(--crema)]/70">
            Dalla terra alla tavola, ogni passaggio continua nel successivo.
          </p>
          <ol className="mt-14 space-y-14">
            {STATES.map((s) => (
              <li key={s.key} className="grid gap-5 md:grid-cols-[220px_1fr] md:gap-10">
                <div
                  aria-hidden
                  className="relative h-40 w-full overflow-hidden border border-[color:var(--oro)]/20"
                  style={{
                    backgroundImage: s.bg,
                    borderRadius: s.radius,
                  }}
                />
                <div>
                  <p className="font-eyebrow text-[10px] tracking-[0.35em] text-[color:var(--oro)]/80">
                    {s.cat}
                  </p>
                  <p
                    className="font-display italic mt-3"
                    style={{ fontSize: "clamp(1.4rem,2.4vw,2rem)", fontWeight: 300, lineHeight: 1.1 }}
                  >
                    {s.title[0]}
                    <br />
                    {s.title[1]}
                  </p>
                  <p className="mt-3 text-[color:var(--crema)]/75">{s.body}</p>
                  {s.detail && (
                    <p className="mt-2 text-[13px] text-[color:var(--crema)]/55">— {s.detail}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p
            className="font-display italic mt-16"
            style={{ fontSize: "clamp(1.2rem,2vw,1.6rem)", fontWeight: 300 }}
          >
            Non è soltanto ciò che serviamo.
            <br />È il percorso che lo porta fin qui.
          </p>
        </div>
      </section>
    );
  }

  const s = STATES[active];
  const isCottura = active === 6;

  /* ============================ DESKTOP + MOBILE ============================ */
  return (
    <section
      ref={rootRef}
      aria-label="La Filiera — una materia che cambia forma"
      className="filiera-root relative isolate w-full overflow-hidden text-[color:var(--crema)]"
      style={{ backgroundColor: "var(--carbone)" }}
    >
      {/* PALCO (pinned su desktop, sticky-ish su mobile via layout) */}
      <div
        ref={stageRef}
        className="filiera-stage relative flex w-full flex-col overflow-hidden"
        style={{ minHeight: "100dvh" }}
      >
        {/* Sfondo palco (cambia per stato) */}
        <div
          ref={stageBgRef}
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ backgroundImage: STATES[0].stageBg }}
        />
        {/* grana */}
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-[5] opacity-[0.06]" />

        {/* HEADER */}
        <header className="filiera-heading relative z-10 flex flex-col gap-2 px-6 pt-8 md:px-12 md:pt-10">
          <div className="flex items-center justify-between">
            <p className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro)]/75">
              04 — LA FILIERA
            </p>
            <p className="font-eyebrow hidden text-[10px] tracking-[0.4em] text-[color:var(--crema)]/40 md:block">
              UNA MATERIA · OTTO STATI
            </p>
          </div>
        </header>

        {/* CORPO: sx=testo · centro=materia · dx=indice */}
        <div className="relative z-10 grid flex-1 grid-cols-1 gap-6 px-6 pt-6 pb-10 md:grid-cols-[minmax(280px,420px)_1fr_180px] md:gap-10 md:px-12 md:pt-4 md:pb-14">
          {/* TESTO SX */}
          <div className="filiera-copy relative flex flex-col justify-center md:min-h-[60dvh]">
            <div key={"cat-" + s.key} className="filiera-fade">
              <p className="font-eyebrow text-[11px] tracking-[0.42em] text-[color:var(--oro)]/85">
                {s.cat}
              </p>
            </div>
            <h2
              key={"ttl-" + s.key}
              className="filiera-fade font-display italic mt-4 text-[color:var(--crema)]"
              style={{
                fontSize: "clamp(2.2rem, 5.2vw, 5.8rem)",
                lineHeight: 0.98,
                fontWeight: 300,
                letterSpacing: "-0.01em",
              }}
            >
              {s.title[0]}
              <br />
              {s.title[1]}
            </h2>
            <p
              key={"bd-" + s.key}
              className="filiera-fade mt-6 max-w-[420px] text-[color:var(--crema)]/75"
              style={{ fontSize: "clamp(15px, 1.05vw, 17px)", lineHeight: 1.55 }}
            >
              {s.body}
            </p>
            {s.detail && (
              <p
                key={"dt-" + s.key}
                className="filiera-fade mt-3 max-w-[420px] text-[13px] text-[color:var(--crema)]/50"
                style={{ lineHeight: 1.5 }}
              >
                — {s.detail}
              </p>
            )}
          </div>

          {/* MATERIA CENTRALE */}
          <div className="filiera-material-wrap relative flex items-center justify-center">
            {/* trace continua (arco oliva→oro attraverso tutta la sezione) */}
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="filiera-trace" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6B7340" stopOpacity="0.5" />
                  <stop offset="60%" stopColor="#C49A4A" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#C49A4A" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <path
                ref={traceRef}
                d="M 8 82 C 22 68, 30 42, 50 40 C 72 38, 82 60, 92 30"
                fill="none"
                stroke="url(#filiera-trace)"
                strokeWidth="0.35"
                vectorEffect="non-scaling-stroke"
                style={{ mixBlendMode: "screen", opacity: 0.85 }}
              />
            </svg>

            {/* ombra costante (continuità tra stati) */}
            <div
              ref={shadowRef}
              aria-hidden
              className="absolute left-1/2 top-[68%] h-[24px] w-[46%] -translate-x-1/2 rounded-[50%]"
              style={{
                background:
                  "radial-gradient(60% 100% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)",
                filter: "blur(6px)",
              }}
            />

            {/* MATERIA (unica) */}
            <div
              ref={matterRef}
              aria-hidden
              className="filiera-matter relative border will-change-transform"
              style={{
                width: "min(38vw, 480px)",
                height: "min(50vh, 460px)",
                borderRadius: STATES[0].radius,
                backgroundImage: STATES[0].bg,
                borderColor: STATES[0].ring,
                borderWidth: "1px",
                boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
                transformOrigin: "50% 62%",
              }}
            >
              {/* nucleo interno (traccia continua di colore) */}
              <div
                ref={matterCoreRef}
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[38%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
                style={{
                  backgroundColor: STATES[0].core,
                  opacity: STATES[0].coreOpacity,
                  filter: "blur(14px)",
                }}
              />
              {/* inner mask per texture */}
              <div
                ref={matterInnerRef}
                aria-hidden
                className="absolute inset-0"
                style={{
                  borderRadius: "inherit",
                  background:
                    "radial-gradient(120% 80% at 50% 30%, rgba(255,255,255,0.08) 0%, transparent 55%), radial-gradient(80% 80% at 50% 100%, rgba(0,0,0,0.35) 0%, transparent 70%)",
                  mixBlendMode: "overlay",
                }}
              />
            </div>

            {/* annotazioni prodotti (stato 05 e 08) */}
            {s.products && (
              <div className="pointer-events-none absolute inset-0">
                {s.products.map((p, i) => {
                  const pos = [
                    { top: "12%", left: "10%" },
                    { top: "16%", right: "8%" },
                    { bottom: "18%", left: "6%" },
                    { bottom: "12%", right: "12%" },
                  ][i];
                  return (
                    <motion.span
                      key={s.key + p}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
                      className="font-eyebrow absolute text-[10px] tracking-[0.35em] text-[color:var(--crema)]/80"
                      style={{ ...pos }}
                    >
                      <span
                        aria-hidden
                        className="mr-2 inline-block h-px w-4 align-middle"
                        style={{ background: "var(--oro)", opacity: 0.6 }}
                      />
                      {p}
                    </motion.span>
                  );
                })}
              </div>
            )}

            {/* targhetta pezzata rossa × frisona (stato 03) */}
            {active === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="pointer-events-none absolute bottom-[8%] right-[6%] rounded-sm border border-[color:var(--oro)]/40 bg-black/50 px-3 py-2 text-right"
              >
                <p className="font-eyebrow text-[9px] tracking-[0.32em] text-[color:var(--crema)]/85">
                  PEZZATA ROSSA × FRISONA
                </p>
                <p className="font-eyebrow mt-1 text-[9px] tracking-[0.32em] text-[color:var(--oro)]/85">
                  LATTE · CARNE
                </p>
              </motion.div>
            )}
          </div>

          {/* INDICE DX */}
          <aside className="filiera-index hidden md:flex md:flex-col md:justify-center">
            <ol className="flex flex-col gap-[10px]">
              {INDEX_LABELS.map((lbl, i) => {
                const on = i === active;
                const isThisCottura = i === 6;
                return (
                  <li
                    key={lbl}
                    className="flex items-center gap-2 transition-all duration-300"
                    style={{
                      opacity: on ? 1 : 0.28,
                      transform: on ? "translateX(4px)" : "translateX(0)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="h-[6px] w-[6px] rounded-full transition-colors duration-300"
                      style={{
                        background: on
                          ? isThisCottura
                            ? "var(--terracotta)"
                            : "var(--oliva)"
                          : "rgba(242,232,213,0.25)",
                      }}
                    />
                    <span
                      className="font-eyebrow text-[10px] tracking-[0.35em]"
                      style={{
                        color: on ? "var(--crema)" : "rgba(242,232,213,0.7)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")} {lbl}
                    </span>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>

        {/* PROGRESS BAR (basso) */}
        <div className="relative z-10 px-6 pb-6 md:px-12 md:pb-8">
          <div className="flex items-center gap-4">
            <span
              className="font-eyebrow text-[10px] tracking-[0.35em]"
              style={{
                color: isCottura ? "var(--terracotta)" : "var(--crema)",
                opacity: 0.85,
              }}
            >
              {String(active + 1).padStart(2, "0")} / 08
            </span>
            <div className="relative h-px flex-1 bg-[color:var(--crema)]/15">
              <div
                ref={progressBarRef}
                className="absolute left-0 top-0 h-full origin-left"
                style={{
                  width: "100%",
                  transform: "scaleX(0)",
                  background: isCottura ? "var(--terracotta)" : "var(--oro)",
                  transition: "background-color 400ms ease",
                }}
              />
              {/* 8 punti */}
              <div className="pointer-events-none absolute inset-0 flex justify-between">
                {STATES.map((_, i) => (
                  <span
                    key={i}
                    className="h-[6px] w-[6px] -translate-y-[2.5px] rounded-full"
                    style={{
                      background:
                        i <= active
                          ? i === 6
                            ? "var(--terracotta)"
                            : "var(--oro)"
                          : "rgba(242,232,213,0.25)",
                    }}
                  />
                ))}
              </div>
            </div>
            <span className="font-eyebrow hidden text-[10px] tracking-[0.35em] text-[color:var(--crema)]/60 md:inline">
              {INDEX_LABELS[active].toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* MOBILE: blocchi verticali di lettura (invisibili su desktop) */}
      <div className="filiera-mobile-blocks relative z-10 md:hidden">
        {STATES.map((st, i) => (
          <div
            key={st.key}
            data-mobile-block={i}
            className="relative flex min-h-[70dvh] flex-col justify-center px-6 py-16"
          >
            <p className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro)]/85">
              {st.cat}
            </p>
            <h3
              className="font-display italic mt-3 text-[color:var(--crema)]"
              style={{ fontSize: "clamp(1.9rem, 8vw, 2.6rem)", lineHeight: 1, fontWeight: 300 }}
            >
              {st.title[0]}
              <br />
              {st.title[1]}
            </h3>
            <p className="mt-4 max-w-[36ch] text-[color:var(--crema)]/75" style={{ fontSize: 16, lineHeight: 1.55 }}>
              {st.body}
            </p>
            {st.detail && (
              <p className="mt-2 max-w-[36ch] text-[13px] text-[color:var(--crema)]/55" style={{ lineHeight: 1.5 }}>
                — {st.detail}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* CHIUSURA + CTA */}
      <div className="relative z-10 bg-[color:var(--carbone)] px-6 pb-24 pt-10 md:px-12 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="font-display italic text-[color:var(--crema)]"
            style={{
              fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
              lineHeight: 1.25,
              fontWeight: 300,
            }}
          >
            Non è soltanto ciò che serviamo.
            <br />
            <span className="text-[color:var(--crema)]/70">
              È il percorso che lo porta fin qui.
            </span>
          </p>
          <motion.a
            href="#tavola"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 150, damping: 30, mass: 0.4 }}
            className="font-eyebrow mt-10 inline-flex items-center gap-3 border-b border-[color:var(--oro)]/50 pb-1 text-[11px] tracking-[0.35em] text-[color:var(--crema)] hover:text-[color:var(--oro)]"
            onClick={(e) => {
              e.preventDefault();
              const el =
                document.querySelector("[data-section='la-tavola']") ||
                document.querySelector("[aria-label*='Tavola']");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            SCOPRI LA TAVOLA <span aria-hidden>→</span>
          </motion.a>
        </div>
      </div>

      <style>{`
        .filiera-fade {
          animation: filieraFade .55s ease both;
        }
        @keyframes filieraFade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .filiera-matter {
          transition: background-color 400ms ease;
        }
        @media (max-width: 899px) {
          .filiera-stage {
            position: sticky;
            top: 0;
            min-height: 62dvh !important;
            height: 62dvh;
            overflow: hidden;
          }
          .filiera-copy { display: none !important; }
          .filiera-material-wrap {
            grid-column: 1 / -1;
            min-height: 40dvh;
          }
          .filiera-stage .grid {
            grid-template-columns: 1fr !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          .filiera-matter {
            width: min(70vw, 340px) !important;
            height: min(38dvh, 300px) !important;
          }
        }
      `}</style>
    </section>
  );
}
