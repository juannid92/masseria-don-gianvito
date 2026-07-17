import { useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import milkMacro from "@/assets/case-milk-macro.jpg";
import filaturaImg from "@/assets/case-filatura.jpg";
import formeImg from "@/assets/case-c-forme.jpg";
import maniImg from "@/assets/case-b-mani.jpg";
import bridgeCarne from "@/assets/case-bridge-carne.jpg";
import prodMozzarella from "@/assets/case-prod-mozzarella.jpg";
import prodRicotta from "@/assets/case-prod-ricotta.jpg";

/* ─────────────────────────────────────────────────────────────
 * /caseificio — IL BIANCO
 * Latte → Cagliata → Filatura → Forma
 * ───────────────────────────────────────────────────────────── */

type Stato = {
  id: "liquido" | "cagliata" | "filatura" | "forma";
  n: string;
  cat: string;
  titolo: string;
  testo: string;
};

const STATI: Stato[] = [
  {
    id: "liquido",
    n: "01",
    cat: "LIQUIDO",
    titolo: "La materia\nnon ha ancora forma.",
    testo: "Il latte entra nel Caseificio e apre il processo di trasformazione.",
  },
  {
    id: "cagliata",
    n: "02",
    cat: "CAGLIATA",
    titolo: "Il bianco\nacquista consistenza.",
    testo: "La materia cambia densità e prepara il passaggio successivo.",
  },
  {
    id: "filatura",
    n: "03",
    cat: "FILATURA",
    titolo: "La materia\nsi allunga.",
    testo: "Il bianco cambia ancora e si prepara a diventare prodotto.",
  },
  {
    id: "forma",
    n: "04",
    cat: "FORMA",
    titolo: "Il bianco\ndiventa riconoscibile.",
    testo:
      "Mozzarella, nodini, primo sale e ricotta sono le forme del Caseificio di Masseria Don Gianvito.",
  },
];

/* ─────────────────────────────────────────────────────────── */

export function CaseificioStory() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    let mounted = true;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ═══ ACT 1 · ENTRARE NELLA TINA ═══ */
      const act1 = root.querySelector<HTMLElement>("[data-act='1']");
      const tinaMask = root.querySelector<HTMLElement>("[data-tina-mask]");
      const tinaSurface = root.querySelector<HTMLElement>("[data-tina-surface]");
      const tinaTitle = root.querySelector<HTMLElement>("[data-tina-title]");

      if (act1 && tinaMask && tinaSurface) {
        gsap.set(tinaSurface, { scale: 1.0 });
        ScrollTrigger.create({
          trigger: act1,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => {
            if (!mounted) return;
            const p = self.progress;
            // La camera avanza: la maschera ellittica si allarga da 40% a 200%
            const size = 40 + p * 220;
            tinaMask.style.clipPath = `ellipse(${size}% ${size * 0.75}% at 50% 50%)`;
            gsap.set(tinaSurface, { scale: 1 + p * 0.16 });
            if (tinaTitle) {
              gsap.set(tinaTitle, {
                y: -p * 40,
                autoAlpha: 1 - Math.max(0, (p - 0.6) * 2.5),
              });
            }
          },
        });
      }

      /* ═══ ACT 2 · IL PRIMO GESTO — reveal luce laterale ═══ */
      const luce = root.querySelector<HTMLElement>("[data-luce]");
      const mattinoWord = root.querySelector<HTMLElement>("[data-mattino]");
      if (luce && mattinoWord) {
        gsap.fromTo(
          luce,
          { x: "-30%", autoAlpha: 0 },
          {
            x: "0%",
            autoAlpha: 0.6,
            ease: "power2.out",
            scrollTrigger: { trigger: luce.parentElement!, start: "top 80%", end: "top 20%", scrub: 0.6 },
          },
        );
        gsap.fromTo(
          mattinoWord,
          { y: 40, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            autoAlpha: 1,
            clipPath: "inset(0 0 0% 0)",
            ease: "power3.out",
            duration: 1.1,
            scrollTrigger: { trigger: mattinoWord, start: "top 82%", once: true },
          },
        );
      }

      /* ═══ ACT 3 · LA COLONNA BIANCA (desktop pin) ═══ */
      mm.add("(min-width: 768px)", () => {
        const act3 = root.querySelector<HTMLElement>("[data-act='3']");
        const stage = root.querySelector<HTMLElement>("[data-column-stage]");
        const material = root.querySelector<HTMLElement>("[data-material]");
        const copies = root.querySelectorAll<HTMLElement>("[data-copy]");
        const idxItems = root.querySelectorAll<HTMLElement>("[data-idx]");
        const counter = root.querySelector<HTMLElement>("[data-counter]");
        const progress = root.querySelector<HTMLElement>("[data-progress]");
        const steam = root.querySelectorAll<HTMLElement>("[data-steam]");
        const volumes = root.querySelector<HTMLElement>("[data-volumes]");
        if (!act3 || !stage || !material) return;

        // Stati iniziali: solo la 01 visibile
        gsap.set(copies, { autoAlpha: 0, y: 30 });
        gsap.set(copies[0], { autoAlpha: 1, y: 0 });
        gsap.set(volumes, { autoAlpha: 0 });
        gsap.set(steam, { autoAlpha: 0 });

        const setActiveIdx = (i: number) => {
          idxItems.forEach((el, j) => {
            el.classList.toggle("is-active", j === i);
          });
          if (counter) counter.textContent = `0${i + 1} / 04`;
        };
        setActiveIdx(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: act3,
            start: "top top",
            end: "+=380%",
            pin: stage,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress) progress.style.transform = `scaleY(${self.progress})`;
            },
          },
        });

        /* 01 LIQUIDO — sale, morbido, avorio */
        tl.addLabel("liquido")
          .fromTo(
            material,
            {
              scaleY: 0.6,
              scaleX: 0.55,
              borderRadius: "45% 45% 40% 40% / 60% 60% 40% 40%",
              backgroundColor: "#f4ecd8",
              y: 40,
            },
            { scaleY: 1, y: 0, duration: 1 },
          )
          .to({}, { duration: 0.6, onStart: () => setActiveIdx(0) }, "<");

        /* 01 → 02 CAGLIATA */
        tl.addLabel("toCagliata")
          .to(copies[0], { autoAlpha: 0, y: -30, duration: 0.4 })
          .to(
            material,
            {
              scaleY: 0.72,
              scaleX: 0.68,
              borderRadius: "38% 42% 34% 46% / 40% 44% 40% 44%",
              backgroundColor: "#efe6ce",
              duration: 0.9,
            },
            "<",
          )
          .fromTo(copies[1], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, onStart: () => setActiveIdx(1) });

        /* 02 → 03 FILATURA */
        tl.addLabel("toFilatura")
          .to(copies[1], { autoAlpha: 0, y: -30, duration: 0.4 })
          .to(
            material,
            {
              scaleY: 1.35,
              scaleX: 0.42,
              borderRadius: "36% 36% 36% 36% / 20% 20% 20% 20%",
              backgroundColor: "#f6efd9",
              duration: 1.0,
            },
            "<",
          )
          .to(steam, { autoAlpha: 0.35, stagger: 0.05, duration: 0.6 }, "<0.2")
          .fromTo(copies[2], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, onStart: () => setActiveIdx(2) });

        /* 03 → 04 FORMA */
        tl.addLabel("toForma")
          .to(copies[2], { autoAlpha: 0, y: -30, duration: 0.4 })
          .to(
            material,
            {
              scaleY: 0.9,
              scaleX: 0.85,
              borderRadius: "50% 50% 50% 50%",
              backgroundColor: "#f9f1dc",
              duration: 0.8,
            },
            "<",
          )
          .to(material, { autoAlpha: 0.15, duration: 0.5 })
          .to(volumes, { autoAlpha: 1, duration: 0.6 }, "<")
          .to(steam, { autoAlpha: 0, stagger: 0.03, duration: 0.5 }, "<")
          .fromTo(copies[3], { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5, onStart: () => setActiveIdx(3) });
      });

      /* ═══ Reveals generici (parole grandi) ═══ */
      root.querySelectorAll<HTMLElement>("[data-bigword]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            autoAlpha: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });

      /* ═══ Un solo luogo — linea che attraversa 3 parole ═══ */
      const solo = root.querySelector<HTMLElement>("[data-solo]");
      if (solo) {
        const line = solo.querySelector<SVGPathElement>("path[data-line]");
        if (line) {
          const len = line.getTotalLength();
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(line, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: solo, start: "top 75%", end: "bottom 40%", scrub: 0.6 },
          });
        }
      }

      /* refresh dopo font */
      const doRefresh = () => { if (mounted) ScrollTrigger.refresh(); };
      if (document.fonts?.ready) document.fonts.ready.then(doRefresh).catch(() => {});
      setTimeout(doRefresh, 200);
    }, root);

    return () => {
      mounted = false;
      ctx.revert();
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className="relative w-full" style={{ background: "var(--crema)", color: "var(--marrone)" }}>

      {/* ══════════ ACT 1 · ENTRARE NELLA TINA ══════════ */}
      <section data-act="1" className="relative h-[200vh]" aria-label="Entrare nella tina">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden" style={{ background: "#efe6ce" }}>
          {/* Superficie del latte, ripresa macro */}
          <div
            data-tina-surface
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${milkMacro})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(1.08) contrast(0.95) saturate(0.85)",
            }}
            role="img"
            aria-label="Superficie del latte nel Caseificio di Masseria Don Gianvito"
          />
          {/* Maschera ellittica (bordo tina) */}
          <div
            data-tina-mask
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(61,42,30,0.35) 75%, rgba(26,18,16,0.55) 100%)",
              clipPath: "ellipse(40% 30% at 50% 50%)",
              transition: "none",
            }}
            aria-hidden
          />
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse at center, transparent 55%, rgba(26,18,16,0.35) 100%)"
          }} aria-hidden />

          {/* Rail sx */}
          <div className="absolute left-4 md:left-8 top-0 h-full flex items-center pointer-events-none z-10" aria-hidden>
            <div
              className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/80"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.3em" }}
            >
              CASEIFICIO — MASSERIA DON GIANVITO · IL BIANCO
            </div>
          </div>

          {/* Titolo dentro la forma */}
          <div className="absolute inset-x-0 top-[42%] flex flex-col items-center px-6 text-center pointer-events-none">
            <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/70 tracking-[0.35em] mb-4">
              CASEIFICIO — MASSERIA DON GIANVITO
            </div>
            <h1
              data-tina-title
              className="font-display leading-[0.9] text-[color:var(--marrone)]"
              style={{ fontSize: "clamp(2.4rem, 8vw, 6.5rem)", fontWeight: 300 }}
            >
              Dentro<br/>il bianco.
            </h1>
          </div>

          {/* Indicatore */}
          <div className="absolute inset-x-0 bottom-8 md:bottom-10 flex justify-center pointer-events-none">
            <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/75 tracking-[0.4em]">
              ENTRA NEL CASEIFICIO ↓
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ACT 2 · IL PRIMO GESTO — OGNI MATTINA ══════════ */}
      <section
        className="relative overflow-hidden py-24 md:py-40 px-6 md:px-14"
        aria-label="Il primo gesto — ogni mattina"
        style={{
          background: "linear-gradient(180deg, #efe6ce 0%, #f4ecd8 100%)",
          color: "var(--marrone)",
        }}
      >
        {/* Luce laterale */}
        <div
          data-luce
          className="absolute inset-y-0 left-0 w-2/3 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 100%)",
            mixBlendMode: "screen",
          }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-12 gap-8 md:gap-14 items-center">
          <div className="md:col-span-7">
            <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/70 tracking-[0.35em] mb-6">
              01 — OGNI MATTINA
            </div>
            <h2
              data-bigword
              className="font-display text-[color:var(--marrone)] leading-[0.95] mb-8"
              style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300 }}
            >
              Il primo gesto<br/>è il latte.
            </h2>
            <p data-bigword className="text-[color:var(--marrone)]/85 text-lg md:text-xl leading-relaxed max-w-2xl">
              Il latte viene munto ogni mattina e passa dall'allevamento al lavoro del Caseificio.
            </p>
            <p data-bigword className="mt-6 text-[color:var(--marrone)]/65 text-base md:text-lg italic leading-relaxed max-w-2xl">
              Da questo passaggio nascono mozzarella, nodini, primo sale e ricotta.
            </p>
          </div>
          <div className="md:col-span-5 flex justify-end items-end">
            <div
              data-mattino
              className="font-display leading-none text-right text-[color:var(--marrone)]/25"
              style={{ fontSize: "clamp(4rem, 14vw, 12rem)", fontWeight: 300, letterSpacing: "-0.02em" }}
              aria-hidden
            >
              MATTINO
            </div>
          </div>
        </div>

        {/* Linea verticale chiara che introduce la Colonna */}
        <div className="relative mt-16 md:mt-24 flex justify-center">
          <div
            className="h-32 w-px"
            style={{ background: "linear-gradient(180deg, transparent, var(--marrone), transparent)", opacity: 0.35 }}
            aria-hidden
          />
        </div>
      </section>

      {/* ══════════ ACT 3 · LA COLONNA BIANCA ══════════ */}
      <section
        data-act="3"
        className="relative"
        aria-label="La Colonna Bianca — quattro stati"
        style={{ background: "linear-gradient(180deg, #f4ecd8 0%, #efe6ce 100%)" }}
      >
        {/* Desktop stage pinned */}
        <div data-column-stage className={`${reduced ? "hidden" : "hidden md:block"} relative h-[100dvh] w-full overflow-hidden`}>
          {/* Vapore molto leggero (4 forme) */}
          {[0,1,2,3].map((i) => (
            <div
              key={i}
              data-steam
              className="pointer-events-none absolute"
              style={{
                left: `${44 + i * 3}%`,
                top: `${18 + (i % 2) * 6}%`,
                width: 220 - i * 20,
                height: 220 - i * 20,
                background: "radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 65%)",
                filter: "blur(18px)",
                opacity: 0,
              }}
              aria-hidden
            />
          ))}

          {/* Header (staccato dalla Navbar) */}
          <div className="absolute top-24 left-8 z-20 flex flex-col gap-2 pr-6 max-w-[42%]">
            <div className="font-eyebrow text-[11px] text-[color:var(--marrone)]/70 tracking-[0.3em]">
              LA COLONNA BIANCA
            </div>
            <div className="font-display text-xl lg:text-2xl text-[color:var(--marrone)]" style={{ fontWeight: 300 }}>
              Quattro stati della stessa materia
            </div>
          </div>

          {/* Contatore */}
          <div data-counter className="absolute bottom-8 right-8 z-20 font-eyebrow text-[13px] text-[color:var(--marrone)]/75 tracking-[0.2em]">
            01 / 04
          </div>
          {/* Barra progress */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 h-64 w-px bg-[color:var(--marrone)]/15">
            <div data-progress className="h-full w-full origin-top" style={{ background: "var(--marrone)", transform: "scaleY(0)" }} />
          </div>

          {/* Indice verticale */}
          <ul className="absolute left-8 top-1/2 -translate-y-1/2 z-20 space-y-4">
            {STATI.map((s, i) => (
              <li key={s.id} data-idx className="flex items-center gap-3 transition-all">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--oliva)] opacity-0 idx-dot" />
                <span className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--marrone)]/45 idx-lab">
                  {s.n} {s.cat}
                </span>
              </li>
            ))}
          </ul>

          {/* Materia centrale */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              data-material
              className="will-change-transform"
              style={{
                width: "min(46vh, 380px)",
                height: "min(60vh, 520px)",
                background: "#f4ecd8",
                borderRadius: "45% 45% 40% 40% / 60% 60% 40% 40%",
                boxShadow: "inset -30px -20px 60px rgba(61,42,30,0.15), inset 20px 20px 60px rgba(255,255,255,0.8), 0 20px 60px rgba(61,42,30,0.15)",
              }}
              aria-hidden
            />
            {/* 4 volumi finali — visibili in stato Forma */}
            <div data-volumes className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
              <div className="relative" style={{ width: "min(60vh, 520px)", height: "min(50vh, 420px)" }}>
                {[
                  { top: "10%", left: "15%", size: 130, r: "50%", label: "MOZZARELLA" },
                  { top: "5%", left: "60%", size: 100, r: "44% 56% 48% 52%", label: "NODINI" },
                  { top: "55%", left: "10%", size: 110, r: "40%", label: "PRIMO SALE" },
                  { top: "50%", left: "58%", size: 130, r: "48% 52% 46% 54%", label: "RICOTTA" },
                ].map((v) => (
                  <div key={v.label} className="absolute" style={{ top: v.top, left: v.left }}>
                    <div
                      style={{
                        width: v.size, height: v.size,
                        background: "#f9f1dc",
                        borderRadius: v.r,
                        boxShadow: "inset -12px -10px 30px rgba(61,42,30,0.15), inset 10px 10px 30px rgba(255,255,255,0.9), 0 12px 30px rgba(61,42,30,0.12)",
                        borderLeft: "1px solid rgba(197,161,89,0.35)",
                      }}
                      aria-hidden
                    />
                    <div className="mt-2 font-eyebrow text-[10px] text-[color:var(--marrone)]/80 tracking-[0.25em] text-center">
                      {v.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copy sovrapposte (dx) */}
          <div className="absolute right-24 top-1/2 -translate-y-1/2 z-10 w-[min(28rem,32vw)] min-h-[280px]">

            {STATI.map((s, i) => (
              <div
                key={s.id}
                data-copy
                className="absolute inset-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <div className="font-eyebrow text-[10px] text-[color:var(--oliva)] tracking-[0.35em] mb-3">
                  {s.n} — {s.cat}
                </div>
                <h3
                  className="font-display text-[color:var(--marrone)] leading-[1.05] mb-4 whitespace-pre-line"
                  style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 300 }}
                >
                  {s.titolo}
                </h3>
                <p className="text-[color:var(--marrone)]/80 text-base md:text-lg leading-relaxed">
                  {s.testo}
                </p>
              </div>
            ))}
          </div>

          <style>{`
            [data-idx].is-active .idx-dot { opacity: 1; }
            [data-idx].is-active .idx-lab { color: var(--marrone); opacity: 1; transform: translateX(4px); }
            [data-idx] .idx-lab { transition: color .3s, opacity .3s, transform .3s; }
            [data-idx] .idx-dot { transition: opacity .3s; }
          `}</style>
        </div>

        {/* Mobile — quattro stati verticali statici (anche desktop in reduced motion) */}
        <div className={`${reduced ? "block" : "md:hidden"} px-5 py-20 space-y-16`}>

          <div className="font-eyebrow text-[10px] text-[color:var(--marrone)]/70 tracking-[0.35em]">
            LA COLONNA BIANCA — QUATTRO STATI
          </div>
          {STATI.map((s, i) => (
            <article key={s.id} className="relative">
              <div
                className="mx-auto mb-6"
                style={{
                  width: i === 0 ? 180 : i === 1 ? 200 : i === 2 ? 140 : 240,
                  height: i === 0 ? 240 : i === 1 ? 200 : i === 2 ? 320 : 200,
                  background: "#f4ecd8",
                  borderRadius:
                    i === 0 ? "45% 45% 40% 40% / 60% 60% 40% 40%" :
                    i === 1 ? "38% 42% 34% 46% / 40% 44% 40% 44%" :
                    i === 2 ? "36% 36% 36% 36% / 20% 20% 20% 20%" :
                    "50%",
                  boxShadow: "inset -20px -12px 40px rgba(61,42,30,0.15), inset 12px 12px 40px rgba(255,255,255,0.85), 0 12px 30px rgba(61,42,30,0.12)",
                }}
                aria-hidden
              />
              <div className="font-eyebrow text-[10px] text-[color:var(--oliva)] tracking-[0.35em] mb-2">
                {s.n} — {s.cat}
              </div>
              <h3 className="font-display text-2xl leading-tight text-[color:var(--marrone)] mb-3 whitespace-pre-line" style={{ fontWeight: 300 }}>
                {s.titolo}
              </h3>
              <p className="text-[color:var(--marrone)]/80 text-base leading-relaxed">{s.testo}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════ ACT 4 · LE FORME — I PRODOTTI ══════════ */}
      <section
        className="relative py-24 md:py-36 px-6 md:px-14"
        aria-label="Le forme — i prodotti"
        style={{ background: "#efe6ce" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/70 tracking-[0.35em] mb-6">
            02 — LE FORME
          </div>
          <h2
            data-bigword
            className="font-display text-[color:var(--marrone)] leading-[0.95] mb-8 max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300 }}
          >
            Quattro modi<br/>di diventare bianco.
          </h2>
          <p className="text-[color:var(--marrone)]/80 text-lg max-w-2xl leading-relaxed mb-14 md:mb-20">
            Dal latte lavorato nella Masseria nascono prodotti diversi per consistenza e forma.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 items-start">
            {/* Mozzarella — morbida + KM ZERO */}
            <article className="md:col-span-6 relative">
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={prodMozzarella}
                  alt="Mozzarella del Caseificio di Masseria Don Gianvito"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={{ filter: "brightness(1.02) saturate(0.9)" }}
                />
                <span
                  className="absolute top-4 right-4 rounded-full px-3 py-1 font-eyebrow text-[10px] tracking-[0.3em]"
                  style={{ background: "var(--marrone)", color: "var(--crema)" }}
                >
                  KM ZERO
                </span>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <span className="h-3 w-3 rounded-full" style={{ background: "var(--marrone)" }} aria-hidden />
                <h3 className="font-display text-4xl md:text-5xl text-[color:var(--marrone)]" style={{ fontWeight: 300 }}>
                  Mozzarella
                </h3>
              </div>
            </article>

            {/* Nodini — linea che si piega (SVG) */}
            <article className="md:col-span-6 relative md:pt-24">
              <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{ background: "#f4ecd8", aspectRatio: "5/4" }}
              >
                <svg viewBox="0 0 400 320" className="w-3/4 h-3/4" aria-hidden>
                  <path
                    d="M60 160 C 60 90, 140 90, 140 160 S 220 230, 220 160 S 300 90, 300 160 S 360 230, 340 200"
                    fill="none"
                    stroke="var(--marrone)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                </svg>
                <div className="absolute inset-x-0 bottom-4 text-center font-eyebrow text-[10px] text-[color:var(--marrone)]/60 tracking-[0.3em]">
                  LA LINEA CHE SI PIEGA
                </div>
              </div>
              <div className="mt-5">
                <h3 className="font-display text-4xl md:text-5xl text-[color:var(--marrone)] tracking-wide" style={{ fontWeight: 300 }}>
                  Nodini
                </h3>
              </div>
            </article>

            {/* Primo sale — geometrico */}
            <article className="md:col-span-5 md:col-start-2 relative">
              <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, #f9f1dc 0%, #ede2c4 100%)",
                  aspectRatio: "5/4",
                }}
              >
                <div
                  className="relative"
                  style={{
                    width: "58%",
                    aspectRatio: "1.2/1",
                    background: "#f4ecd8",
                    borderRadius: "6px",
                    boxShadow: "inset -20px -14px 40px rgba(61,42,30,0.18), inset 14px 14px 40px rgba(255,255,255,0.85), 0 14px 40px rgba(61,42,30,0.15)",
                    borderLeft: "3px solid var(--oliva)",
                  }}
                  aria-hidden
                />
              </div>
              <div className="mt-5">
                <h3
                  className="font-display text-4xl md:text-5xl text-[color:var(--marrone)] uppercase"
                  style={{ fontWeight: 400, letterSpacing: "-0.01em" }}
                >
                  Primo sale
                </h3>
              </div>
            </article>

            {/* Ricotta — leggera + spazio */}
            <article className="md:col-span-6 md:col-start-7 relative">
              <div className="relative aspect-[5/4] overflow-hidden" style={{ background: "#faf3e0" }}>
                <img
                  src={prodRicotta}
                  alt="Ricotta del Caseificio di Masseria Don Gianvito"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={{ filter: "brightness(1.05) saturate(0.85)", mixBlendMode: "multiply" }}
                />
              </div>
              <div className="mt-5 flex items-baseline gap-4">
                <h3 className="font-display text-4xl md:text-5xl text-[color:var(--marrone)] italic" style={{ fontWeight: 300 }}>
                  Ricotta
                </h3>
                <span className="font-eyebrow text-[10px] text-[color:var(--marrone)]/50 tracking-[0.3em]">
                  · FORMA LEGGERA
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ══════════ ACT 5 · UN SOLO LUOGO ══════════ */}
      <section
        data-solo
        className="relative py-24 md:py-36 px-6 md:px-14"
        aria-label="Un solo luogo"
        style={{ background: "#efe6ce" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/70 tracking-[0.35em] mb-6">
            03 — UN SOLO LUOGO
          </div>
          <h2
            data-bigword
            className="font-display text-[color:var(--marrone)] leading-[0.95] mb-8 max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300 }}
          >
            Il Caseificio<br/>non è un reparto isolato.
          </h2>
          <p className="text-[color:var(--marrone)]/85 text-lg md:text-xl max-w-3xl leading-relaxed mb-4">
            Il latte arriva dall'allevamento della Masseria e continua in prodotti che entrano nella sua tavola.
          </p>
          <p className="text-[color:var(--marrone)]/60 text-base md:text-lg italic max-w-2xl leading-relaxed mb-14 md:mb-20">
            Il passaggio tra allevamento, Caseificio e cucina avviene all'interno dello stesso racconto agricolo.
          </p>

          {/* Tre parole attraversate da una linea */}
          <div className="relative">
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 1000 200"
            >
              <path
                data-line
                d="M 40 130 Q 250 60, 500 100 T 960 90"
                fill="none"
                stroke="var(--marrone)"
                strokeWidth="2"
                opacity="0.55"
              />
            </svg>
            <div className="relative grid grid-cols-3 items-center py-6 md:py-10">
              <div className="font-display text-[color:var(--marrone)]/50 text-lg md:text-2xl" style={{ fontWeight: 300 }}>
                ALLEVAMENTO
              </div>
              <div
                className="font-display text-[color:var(--marrone)] text-center leading-none"
                style={{ fontSize: "clamp(2.4rem, 6vw, 5rem)", fontWeight: 300 }}
              >
                CASEIFICIO
              </div>
              <div className="font-display text-[color:var(--marrone)]/50 text-lg md:text-2xl text-right" style={{ fontWeight: 300 }}>
                TAVOLA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ACT 6 · PONTE VERSO LA MACELLERIA — DAL BIANCO ALL'ORO ══════════ */}
      <section
        className="relative py-28 md:py-40 px-6 md:px-14 overflow-hidden"
        aria-label="Ponte verso la Macelleria"
        style={{
          background: "linear-gradient(180deg, #efe6ce 0%, #e6d5a8 35%, #c5a159 65%, var(--marrone) 100%)",
          color: "var(--crema)",
        }}
      >
        {/* Superficie tipo marmo/pietra chiara accennata */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `url(${bridgeCarne})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(1.05) contrast(0.9) saturate(0.7)",
            maskImage: "linear-gradient(180deg, transparent 0%, black 45%, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 45%, black 80%, transparent 100%)",
          }}
          aria-hidden
        />
        {/* Linea oro */}
        <div
          className="absolute inset-x-0 top-1/2 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, var(--oro), transparent)", opacity: 0.7 }}
          aria-hidden
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="font-eyebrow text-[10px] md:text-[11px] tracking-[0.35em] mb-6" style={{ color: "color-mix(in oklab, var(--crema) 90%, transparent)" }}>
            04 — IL PASSAGGIO
          </div>
          <h2
            data-bigword
            className="font-display leading-[0.95] mb-8"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300, color: "var(--crema)" }}
          >
            Dal bianco<br/>alla scelta.
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: "color-mix(in oklab, var(--crema) 85%, transparent)" }}>
            Nella Masseria il percorso continua verso la Macelleria, dove la carne viene mostrata e scelta a vista.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Link
              to="/macelleria"
              className="group inline-flex items-center gap-3 px-8 py-4 min-h-[52px] font-eyebrow text-xs tracking-[0.35em] transition-all"
              style={{ background: "var(--crema)", color: "var(--marrone)" }}
            >
              ENTRA NELLA MACELLERIA
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/allevamento"
              className="group inline-flex items-center gap-3 px-6 py-4 min-h-[52px] font-eyebrow text-xs tracking-[0.35em] border transition-all hover:bg-[color:var(--crema)]/10"
              style={{ borderColor: "color-mix(in oklab, var(--crema) 60%, transparent)", color: "var(--crema)" }}
            >
              TORNA ALL'ALLEVAMENTO
              <span className="transition-transform group-hover:-translate-x-1">←</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ NAV · LE QUATTRO ANIME ══════════ */}
      <NavAnime current="caseificio" />
    </div>
  );
}

/* ─────────────────── Nav Anime (coerente con /allevamento) ─────────────────── */
function NavAnime({ current }: { current: "allevamento" | "caseificio" | "macelleria" | "agriturismo" }) {
  const items = [
    { key: "allevamento", n: "01", nome: "ALLEVAMENTO", sub: "La terra e gli animali", to: "/allevamento" as const },
    { key: "caseificio", n: "02", nome: "CASEIFICIO", sub: "Pagina corrente", to: "/caseificio" as const },
    { key: "macelleria", n: "03", nome: "MACELLERIA", sub: "La scelta avviene a vista", to: "/macelleria" as const },
    { key: "agriturismo", n: "04", nome: "AGRITURISMO", sub: "La cucina e l’ospitalità", to: "/agriturismo" as const },
  ];

  return (
    <nav
      aria-label="Le quattro anime della Masseria"
      className="relative px-6 md:px-14 py-20 md:py-28"
      style={{ background: "var(--crema)", color: "var(--marrone)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="font-eyebrow text-[10px] md:text-[11px] tracking-[0.35em] opacity-70 mb-4">
          CONTINUA NELLA MASSERIA
        </div>
        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-10 md:mb-14" style={{ fontWeight: 300 }}>
          Continua nella Masseria
        </h2>
        <ul className="divide-y divide-[color:var(--marrone)]/20 border-y border-[color:var(--marrone)]/20">
          {items.map((it) => {
            const isCurrent = it.key === current;
            const content = (
              <div className="flex items-center gap-4 md:gap-8 py-5 md:py-6 group">
                <span className="font-eyebrow text-xs md:text-sm opacity-60 tracking-[0.2em] w-10">{it.n}</span>
                <span className="font-display text-2xl md:text-4xl flex-shrink-0" style={{ fontWeight: 300 }}>
                  {it.nome}
                </span>
                <span className="hidden md:block flex-1 h-px bg-[color:var(--marrone)]/25 group-hover:bg-[color:var(--marrone)]/50 transition-colors" />
                <span className="text-sm md:text-base italic opacity-70 flex-1 md:flex-none">{it.sub}</span>
                {!isCurrent && <span className="font-eyebrow text-lg transition-transform group-hover:translate-x-1">→</span>}
              </div>
            );
            return (
              <li key={it.key}>
                {isCurrent ? (
                  <div className="opacity-50 px-2" aria-current="page">{content}</div>
                ) : (
                  <Link to={it.to} className="block hover:bg-[color:var(--marrone)]/5 transition-colors px-2">
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
