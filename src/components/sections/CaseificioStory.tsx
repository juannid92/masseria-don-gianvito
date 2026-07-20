import { useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// TEMP · Sostituire con macro autentica del latte o della tina della Masseria.
import milkMacro from "@/assets/case-milk-macro.jpg";
// TEMP · Sostituire con fotografie autentiche di Mozzarella e Ricotta della Masseria.
import prodMozzarella from "@/assets/case-prod-mozzarella.jpg";
import prodRicotta from "@/assets/case-prod-ricotta.jpg";

/* ─────────────────────────────────────────────────────────────
 * /caseificio — IL BIANCO
 * Movimenti: Superficie → Densità (4 stati) → 4 Forme → Bianco/Oro
 * Regia unica, un solo pin desktop (Colonna Bianca).
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

      /* ═══ MOV I · LA SUPERFICIE — entrare nel bianco ═══ */
      const act1 = root.querySelector<HTMLElement>("[data-act='1']");
      const tinaMask = root.querySelector<HTMLElement>("[data-tina-mask]");
      const tinaSurface = root.querySelector<HTMLElement>("[data-tina-surface]");
      const tinaTitle = root.querySelector<HTMLElement>("[data-tina-title]");
      const tinaBorder = root.querySelector<HTMLElement>("[data-tina-border]");
      const tinaHint = root.querySelector<HTMLElement>("[data-tina-hint]");

      if (act1 && tinaMask && tinaSurface) {
        gsap.set(tinaSurface, { scale: 1.02 });
        if (tinaBorder) gsap.set(tinaBorder, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: act1,
          start: "top top",
          end: "bottom top",
          scrub: 0.7,
          onUpdate: (self) => {
            if (!mounted) return;
            const p = self.progress;
            // Sequenza: (0→.2) superficie ferma; (.2→.5) bordo tina; (.5→1) attraversamento
            const size = 34 + p * 240;
            tinaMask.style.clipPath = `ellipse(${size}% ${size * 0.72}% at 50% 50%)`;
            gsap.set(tinaSurface, { scale: 1.02 + p * 0.22, y: -p * 30 });
            if (tinaBorder) {
              gsap.set(tinaBorder, {
                autoAlpha: gsap.utils.clamp(0, 1, (p - 0.15) * 3) * (1 - Math.max(0, (p - 0.7) * 3)),
                scale: 1 + p * 0.18,
              });
            }
            if (tinaTitle) {
              gsap.set(tinaTitle, {
                y: -p * 60,
                autoAlpha: 1 - Math.max(0, (p - 0.55) * 2.4),
              });
            }
            if (tinaHint) {
              gsap.set(tinaHint, { autoAlpha: 1 - p * 2 });
            }
          },
        });
      }

      /* ═══ MOV I.b · IL MATTINO — cambio di luce ═══ */
      const luce = root.querySelector<HTMLElement>("[data-luce]");
      const mattinoAtmo = root.querySelector<HTMLElement>("[data-mattino-atmo]");
      const mattinoSection = root.querySelector<HTMLElement>("[data-mattino-section]");
      if (luce && mattinoSection) {
        gsap.fromTo(
          luce,
          { x: "-40%", autoAlpha: 0 },
          {
            x: "10%",
            autoAlpha: 0.75,
            ease: "power2.out",
            scrollTrigger: { trigger: mattinoSection, start: "top 85%", end: "bottom 30%", scrub: 0.8 },
          },
        );
      }
      if (mattinoAtmo) {
        // Compare per un istante nel mezzo, poi svanisce (non sovrapposto al body)
        gsap.fromTo(
          mattinoAtmo,
          { autoAlpha: 0, x: -60 },
          {
            autoAlpha: 0.09,
            x: 0,
            ease: "none",
            scrollTrigger: {
              trigger: mattinoSection!,
              start: "top 65%",
              end: "bottom 40%",
              scrub: 1,
            },
          },
        );
      }

      /* ═══ MOV II · LA COLONNA BIANCA — 4 stati (desktop pin) ═══ */
      mm.add("(min-width: 768px)", () => {
        const act3 = root.querySelector<HTMLElement>("[data-act='3']");
        const stage = root.querySelector<HTMLElement>("[data-column-stage]");
        const material = root.querySelector<HTMLElement>("[data-material]");
        const materialFold = root.querySelector<HTMLElement>("[data-material-fold]");
        const materialGloss = root.querySelector<HTMLElement>("[data-material-gloss]");
        const materialShadow = root.querySelector<HTMLElement>("[data-material-shadow]");
        const copies = root.querySelectorAll<HTMLElement>("[data-copy]");
        const idxItems = root.querySelectorAll<HTMLElement>("[data-idx]");
        const counter = root.querySelector<HTMLElement>("[data-counter]");
        const progress = root.querySelector<HTMLElement>("[data-progress]");
        const steam = root.querySelectorAll<HTMLElement>("[data-steam]");
        const volumes = root.querySelector<HTMLElement>("[data-volumes]");
        const volumeItems = root.querySelectorAll<HTMLElement>("[data-vol]");
        if (!act3 || !stage || !material) return;

        gsap.set(copies, { autoAlpha: 0, y: 24 });
        gsap.set(copies[0], { autoAlpha: 1, y: 0 });
        gsap.set(volumes, { autoAlpha: 0 });
        gsap.set(volumeItems, { autoAlpha: 0, scale: 0.5 });
        gsap.set(steam, { autoAlpha: 0 });
        if (materialFold) gsap.set(materialFold, { autoAlpha: 0.35, scaleY: 0.6 });

        const setActiveIdx = (i: number) => {
          idxItems.forEach((el, j) => el.classList.toggle("is-active", j === i));
          if (counter) counter.textContent = `0${i + 1} / 04`;
        };
        setActiveIdx(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: act3,
            start: "top top",
            end: "+=420%",
            pin: stage,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress) progress.style.transform = `scaleY(${self.progress})`;
            },
          },
        });

        /* 01 LIQUIDO — verticale morbida, lieve movimento */
        tl.addLabel("liquido")
          .fromTo(
            material,
            {
              scaleY: 0.72,
              scaleX: 0.62,
              borderRadius: "48% 52% 44% 56% / 62% 58% 42% 44%",
              backgroundColor: "#f4ecd8",
              y: 30,
            },
            { scaleY: 1.05, scaleX: 0.7, y: 0, duration: 1.1 },
          )
          .to(materialGloss, { y: -18, autoAlpha: 0.55, duration: 1.1 }, "<")
          .to({}, { duration: 0.5, onStart: () => setActiveIdx(0) }, "<");

        /* 01 → 02 CAGLIATA */
        tl.addLabel("toCagliata")
          .to(copies[0], { autoAlpha: 0, y: -24, duration: 0.4 })
          .to(
            material,
            {
              scaleY: 0.86,
              scaleX: 0.82,
              borderRadius: "42% 46% 40% 44% / 44% 46% 42% 46%",
              backgroundColor: "#efe6ce",
              duration: 1.0,
            },
            "<",
          )
          .to(materialFold, { scaleY: 0.9, autoAlpha: 0.55, duration: 1.0 }, "<")
          .to(materialShadow, { scaleX: 0.9, autoAlpha: 0.4, duration: 1.0 }, "<")
          .fromTo(
            copies[1],
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.5, onStart: () => setActiveIdx(1) },
          );

        /* 02 → 03 FILATURA — momento più spettacolare */
        tl.addLabel("toFilatura")
          .to(copies[1], { autoAlpha: 0, y: -24, duration: 0.4 })
          .to(
            material,
            {
              scaleY: 1.55,
              scaleX: 0.36,
              borderRadius: "38% 38% 40% 40% / 22% 22% 22% 22%",
              backgroundColor: "#f8f1dc",
              duration: 1.2,
            },
            "<",
          )
          .to(materialFold, { scaleY: 1.4, autoAlpha: 0.75, duration: 1.2 }, "<")
          .to(materialGloss, { y: -50, autoAlpha: 0.8, duration: 1.2 }, "<")
          .to(steam, { autoAlpha: 0.28, stagger: 0.08, duration: 0.7 }, "<0.2")
          .fromTo(
            copies[2],
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.5, onStart: () => setActiveIdx(2) },
          );

        /* 03 → 04 FORMA — nucleo si raccoglie, 4 volumi emergono */
        tl.addLabel("toForma")
          .to(copies[2], { autoAlpha: 0, y: -24, duration: 0.4 })
          .to(
            material,
            {
              scaleY: 0.75,
              scaleX: 0.75,
              borderRadius: "50%",
              backgroundColor: "#f9f1dc",
              duration: 0.9,
            },
            "<",
          )
          .to(materialFold, { autoAlpha: 0, duration: 0.6 }, "<")
          .to(materialGloss, { autoAlpha: 0.35, y: -10, duration: 0.9 }, "<")
          .to(steam, { autoAlpha: 0, stagger: 0.05, duration: 0.6 }, "<")
          .to(material, { autoAlpha: 0.12, scale: 0.85, duration: 0.7 })
          .to(volumes, { autoAlpha: 1, duration: 0.5 }, "<")
          .to(volumeItems, { autoAlpha: 1, scale: 1, stagger: 0.12, duration: 0.7, ease: "power2.out" }, "<")
          .fromTo(
            copies[3],
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.5, onStart: () => setActiveIdx(3) },
          );
      });

      /* ═══ MOV III · reveal parole grandi ═══ */
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

      /* Prodotti — focus su scroll (desktop) */
      mm.add("(min-width: 768px)", () => {
        const prods = root.querySelectorAll<HTMLElement>("[data-prod-item]");
        prods.forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0.45, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 78%", end: "top 38%", scrub: 0.6 },
            },
          );
        });
      });

      /* ═══ MOV IV · linea che attraversa le 3 parole ═══ */
      const solo = root.querySelector<HTMLElement>("[data-solo]");
      if (solo) {
        const line = solo.querySelector<SVGPathElement>("path[data-line]");
        if (line) {
          const len = line.getTotalLength();
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(line, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: solo, start: "top 78%", end: "bottom 45%", scrub: 0.6 },
          });
        }
      }

      /* ═══ MOV V · Bianco → Oro — chiusura ═══ */
      const bridge = root.querySelector<HTMLElement>("[data-bridge]");
      const goldLine = root.querySelector<SVGPathElement>("path[data-gold-line]");
      const bridgeStone = root.querySelector<HTMLElement>("[data-bridge-stone]");
      const bridgeEdge = root.querySelector<HTMLElement>("[data-bridge-edge]");
      const bridgeContent = root.querySelector<HTMLElement>("[data-bridge-content]");
      if (bridge) {
        if (goldLine) {
          const len = goldLine.getTotalLength();
          gsap.set(goldLine, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(goldLine, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: bridge, start: "top 80%", end: "center 40%", scrub: 0.7 },
          });
        }
        if (bridgeStone) {
          gsap.fromTo(
            bridgeStone,
            { autoAlpha: 0 },
            {
              autoAlpha: 0.55,
              ease: "none",
              scrollTrigger: { trigger: bridge, start: "top 60%", end: "bottom bottom", scrub: 0.7 },
            },
          );
        }
        if (bridgeEdge) {
          gsap.fromTo(
            bridgeEdge,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: bridge, start: "top 40%", end: "bottom bottom", scrub: 0.7 },
            },
          );
        }
        if (bridgeContent) {
          gsap.fromTo(
            bridgeContent,
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: bridge, start: "top 45%", once: true },
            },
          );
        }
      }

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

      {/* ══════════ MOV I · LA SUPERFICIE — DENTRO LA TINA ══════════ */}
      <section data-act="1" className="relative h-[220vh]" aria-label="Dentro la tina">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden" style={{ background: "#e8dfc4" }}>
          {/* Superficie del latte — crop macro, mai per intero */}
          <div
            data-tina-surface
            className="absolute inset-[-6%] will-change-transform"
            style={{
              backgroundImage: `url(${milkMacro})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(1.05) contrast(0.92) saturate(0.75)",
            }}
            role="img"
            aria-label="Superficie del latte nel Caseificio di Masseria Don Gianvito"
          />
          {/* Variazione avorio/crema — temperatura */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-multiply"
            style={{
              background:
                "radial-gradient(ellipse 90% 60% at 30% 40%, rgba(249,241,220,0.55) 0%, transparent 60%), radial-gradient(ellipse 80% 60% at 75% 65%, rgba(61,42,30,0.18) 0%, transparent 55%)",
            }}
            aria-hidden
          />
          {/* Ombra interna profonda (bordo tina implicito) */}
          <div
            data-tina-mask
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 42%, rgba(61,42,30,0.30) 72%, rgba(26,18,16,0.72) 100%)",
              clipPath: "ellipse(34% 26% at 50% 50%)",
            }}
            aria-hidden
          />
          {/* Bordo materico della tina — appare a metà */}
          <div
            data-tina-border
            className="absolute inset-0 pointer-events-none flex items-center justify-center will-change-transform"
            aria-hidden
          >
            <div
              className="rounded-full"
              style={{
                width: "78vmin",
                height: "78vmin",
                border: "1px solid rgba(61,42,30,0.35)",
                boxShadow:
                  "inset 0 0 60px rgba(26,18,16,0.35), inset 0 0 200px rgba(255,255,255,0.15), 0 0 80px rgba(26,18,16,0.35)",
              }}
            />
          </div>
          {/* Vignettatura finale */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(26,18,16,0.35) 100%)" }}
            aria-hidden
          />

          {/* Rail sx */}
          <div className="absolute left-4 md:left-8 top-0 h-full flex items-center pointer-events-none z-10" aria-hidden>
            <div
              className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/75"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.32em" }}
            >
              CASEIFICIO — MASSERIA DON GIANVITO
            </div>
          </div>

          {/* Titolo lungo il bordo, in basso a sinistra */}
          <div className="absolute inset-x-0 bottom-16 md:bottom-20 px-6 md:px-14 pointer-events-none">
            <div className="max-w-6xl mx-auto">
              <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/70 tracking-[0.35em] mb-4">
                IL BIANCO — UNA MATERIA CHE CAMBIA
              </div>
              <h1
                data-tina-title
                className="font-display leading-[0.88] text-[color:var(--marrone)]"
                style={{ fontSize: "clamp(2.6rem, 9vw, 7rem)", fontWeight: 300, letterSpacing: "-0.01em" }}
                aria-label="Dentro il bianco."
              >
                <span>Dentro</span>
                <span aria-hidden="true"> </span>
                <span className="block">il bianco.</span>
              </h1>
              <p className="mt-6 max-w-lg text-[color:var(--marrone)]/80 text-base md:text-lg leading-relaxed">
                Ogni mattina il latte lascia l'allevamento e comincia una nuova trasformazione.
              </p>
            </div>
          </div>

          {/* Hint di scorrimento */}
          <div data-tina-hint className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none">
            <div className="font-eyebrow text-[10px] text-[color:var(--marrone)]/55 tracking-[0.4em]">
              ATTRAVERSA LA SUPERFICIE ↓
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ MOV I.b · IL MATTINO ══════════ */}
      <section
        data-mattino-section
        className="relative overflow-hidden py-28 md:py-40 px-6 md:px-14"
        aria-label="Ogni mattina, il primo gesto"
        style={{
          background: "linear-gradient(180deg, #e8dfc4 0%, #f2e8d0 55%, #efe6ce 100%)",
          color: "var(--marrone)",
        }}
      >
        {/* Luce che attraversa da sinistra */}
        <div
          data-luce
          className="absolute inset-y-0 left-0 w-3/4 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,251,240,0.85) 0%, rgba(255,251,240,0.15) 55%, rgba(255,251,240,0) 100%)",
            mixBlendMode: "screen",
          }}
          aria-hidden
        />

        {/* MATTINO — atmosferico, tagliato dai bordi in alto a destra, non sopra il body */}
        <div
          data-mattino-atmo
          className="absolute top-0 -right-[8vw] font-display leading-none text-[color:var(--marrone)] pointer-events-none select-none"
          style={{
            fontSize: "clamp(9rem, 28vw, 26rem)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            opacity: 0,
            transform: "translateY(-30%)",
          }}
          aria-hidden
        >
          MATTINO
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/70 tracking-[0.35em] mb-6">
              IL PRIMO GESTO
            </div>
            <h2
              data-bigword
              className="font-display text-[color:var(--marrone)] leading-[0.92] mb-8"
              style={{ fontSize: "clamp(2.2rem, 6.5vw, 5rem)", fontWeight: 300, letterSpacing: "-0.01em" }}
            >
              Ogni mattina,<br/>il primo gesto.
            </h2>
            <p data-bigword className="text-[color:var(--marrone)]/85 text-lg md:text-xl leading-relaxed">
              Il latte viene munto e passa dall'allevamento al Caseificio.
            </p>
          </div>

          {/* Linea sottile che introduce la Colonna */}
          <div className="relative mt-24 md:mt-32 flex justify-start">
            <div
              className="h-40 w-px"
              style={{ background: "linear-gradient(180deg, transparent, var(--marrone), transparent)", opacity: 0.4 }}
              aria-hidden
            />
          </div>
        </div>
      </section>

      {/* ══════════ MOV II · LA COLONNA BIANCA ══════════ */}
      <section
        data-act="3"
        className="relative"
        aria-label="La Colonna Bianca — quattro stati"
        style={{ background: "linear-gradient(180deg, #efe6ce 0%, #e8dfc4 100%)" }}
      >
        {/* Desktop pin stage */}
        <div data-column-stage className={`${reduced ? "hidden" : "hidden md:block"} relative h-[100dvh] w-full overflow-hidden`}>
          {/* Vapore ridotto — 2 livelli, molto discreti, appaiono solo in filatura/forma */}
          {[0, 1].map((i) => (
            <div
              key={i}
              data-steam
              className="pointer-events-none absolute"
              style={{
                left: `${52 + i * 5}%`,
                top: `${22 + i * 8}%`,
                width: 260 - i * 30,
                height: 260 - i * 30,
                background: "radial-gradient(ellipse at center, rgba(255,251,240,0.65) 0%, rgba(255,251,240,0) 68%)",
                filter: "blur(22px)",
                opacity: 0,
              }}
              aria-hidden
            />
          ))}

          {/* Copy a SINISTRA */}
          <div className="absolute top-1/2 left-8 lg:left-14 -translate-y-1/2 z-10 w-[min(30rem,38vw)] min-h-[300px]">
            {STATI.map((s, i) => (
              <div
                key={s.id}
                data-copy
                className="absolute inset-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <div className="font-eyebrow text-[10px] text-[color:var(--oliva)] tracking-[0.35em] mb-4">
                  {s.n} — {s.cat}
                </div>
                <h3
                  className="font-display text-[color:var(--marrone)] leading-[1.02] mb-6 whitespace-pre-line"
                  style={{ fontSize: "clamp(2rem, 3.6vw, 3.4rem)", fontWeight: 300, letterSpacing: "-0.01em" }}
                >
                  {s.titolo}
                </h3>
                <p className="text-[color:var(--marrone)]/80 text-base md:text-lg leading-relaxed max-w-md">
                  {s.testo}
                </p>
              </div>
            ))}
          </div>

          {/* Materia centrale spostata leggermente a destra */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingLeft: "18%" }}>
            <div className="relative" style={{ width: "min(48vh, 420px)", height: "min(66vh, 560px)" }}>
              {/* Ombra a terra */}
              <div
                data-material-shadow
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: -30,
                  width: "72%",
                  height: 36,
                  background: "radial-gradient(ellipse at center, rgba(61,42,30,0.35) 0%, transparent 70%)",
                  filter: "blur(10px)",
                }}
                aria-hidden
              />
              {/* Nucleo — materia principale */}
              <div
                data-material
                className="absolute inset-0 will-change-transform origin-center"
                style={{
                  background:
                    "radial-gradient(ellipse at 35% 30%, #fbf5e2 0%, #f4ecd8 45%, #ead9b8 100%)",
                  borderRadius: "48% 52% 44% 56% / 62% 58% 42% 44%",
                  boxShadow:
                    "inset -34px -26px 70px rgba(61,42,30,0.20), inset 22px 22px 60px rgba(255,255,255,0.9), 0 26px 60px rgba(61,42,30,0.18)",
                }}
                aria-hidden
              />
              {/* Piega centrale — SVG per continuità tra stati */}
              <svg
                data-material-fold
                className="absolute inset-0 w-full h-full will-change-transform origin-center pointer-events-none"
                viewBox="0 0 200 300"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  <linearGradient id="foldGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(61,42,30,0)" />
                    <stop offset="50%" stopColor="rgba(61,42,30,0.28)" />
                    <stop offset="100%" stopColor="rgba(61,42,30,0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M100 20 C 96 90, 108 160, 100 280"
                  stroke="url(#foldGrad)"
                  strokeWidth="1.5"
                  fill="none"
                />
              </svg>
              {/* Riflesso alto — gloss */}
              <div
                data-material-gloss
                className="absolute pointer-events-none will-change-transform"
                style={{
                  top: "12%",
                  left: "22%",
                  width: "36%",
                  height: "22%",
                  background:
                    "radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)",
                  filter: "blur(6px)",
                  opacity: 0.5,
                }}
                aria-hidden
              />
            </div>

            {/* 4 volumi finali — appaiono in stato Forma */}
            <div data-volumes className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0" style={{ paddingLeft: "18%" }}>
              <div className="relative" style={{ width: "min(62vh, 540px)", height: "min(52vh, 440px)" }}>
                {[
                  { top: "8%", left: "12%", size: 140, r: "50% 50% 48% 52% / 52% 48% 50% 50%", label: "MOZZARELLA" },
                  { top: "0%", left: "58%", size: 96, r: "44% 56% 48% 52%", label: "NODINI" },
                  { top: "58%", left: "8%", size: 112, r: "18% 22% 20% 24%", label: "PRIMO SALE" },
                  { top: "52%", left: "58%", size: 142, r: "50% 46% 54% 48% / 46% 52% 46% 54%", label: "RICOTTA" },
                ].map((v) => (
                  <div key={v.label} data-vol className="absolute" style={{ top: v.top, left: v.left }}>
                    <div
                      style={{
                        width: v.size,
                        height: v.size,
                        background:
                          "radial-gradient(ellipse at 32% 28%, #fbf5e2 0%, #f4ecd8 55%, #e6d3ad 100%)",
                        borderRadius: v.r,
                        boxShadow:
                          "inset -14px -12px 32px rgba(61,42,30,0.18), inset 12px 12px 32px rgba(255,255,255,0.9), 0 14px 32px rgba(61,42,30,0.15)",
                      }}
                      aria-hidden
                    />
                    <div className="mt-3 font-eyebrow text-[10px] text-[color:var(--marrone)]/75 tracking-[0.28em] text-center">
                      {v.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Indice verticale — discreto, a destra */}
          <ul className="absolute right-8 lg:right-14 top-1/2 -translate-y-1/2 z-20 space-y-3">
            {STATI.map((s) => (
              <li key={s.id} data-idx className="flex items-center gap-3 justify-end transition-all">
                <span className="font-eyebrow text-[10px] tracking-[0.28em] text-[color:var(--marrone)]/40 idx-lab">
                  {s.n} {s.cat}
                </span>
                <span className="h-1 w-1 rounded-full bg-[color:var(--oliva)] opacity-0 idx-dot" />
              </li>
            ))}
          </ul>

          {/* Progress bar sottilissima */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-48 w-px bg-[color:var(--marrone)]/10">
            <div data-progress className="h-full w-full origin-top" style={{ background: "var(--marrone)", opacity: 0.55, transform: "scaleY(0)" }} />
          </div>

          {/* Contatore in basso a destra */}
          <div data-counter className="absolute bottom-6 right-6 z-20 font-eyebrow text-[11px] text-[color:var(--marrone)]/60 tracking-[0.25em]">
            01 / 04
          </div>

          <style>{`
            [data-idx].is-active .idx-dot { opacity: 1; }
            [data-idx].is-active .idx-lab { color: var(--marrone); opacity: 1; transform: translateX(-4px); }
            [data-idx] .idx-lab { transition: color .3s, opacity .3s, transform .3s; }
            [data-idx] .idx-dot { transition: opacity .3s; }
          `}</style>
        </div>

        {/* Mobile — verticale, ogni stato ≈ 90dvh */}
        <div className={`${reduced ? "block" : "md:hidden"} px-5 py-16`}>
          <div className="font-eyebrow text-[10px] text-[color:var(--marrone)]/70 tracking-[0.35em] mb-4">
            LA COLONNA BIANCA
          </div>
          {STATI.map((s, i) => (
            <article key={s.id} className="min-h-[80dvh] flex flex-col justify-center py-10">
              <div className="relative mx-auto mb-8" style={{ width: "60vw", maxWidth: 240 }}>
                <div
                  style={{
                    width: "100%",
                    height:
                      i === 0 ? 300 :
                      i === 1 ? 240 :
                      i === 2 ? 360 :
                      220,
                    background:
                      "radial-gradient(ellipse at 32% 28%, #fbf5e2 0%, #f4ecd8 50%, #e6d3ad 100%)",
                    borderRadius:
                      i === 0 ? "48% 52% 44% 56% / 62% 58% 42% 44%" :
                      i === 1 ? "42% 46% 40% 44% / 44% 46% 42% 46%" :
                      i === 2 ? "38% 38% 40% 40% / 22% 22% 22% 22%" :
                      "50%",
                    boxShadow:
                      "inset -24px -16px 44px rgba(61,42,30,0.18), inset 14px 14px 40px rgba(255,255,255,0.9), 0 16px 34px rgba(61,42,30,0.15)",
                  }}
                  aria-hidden
                />
              </div>
              <div className="font-eyebrow text-[10px] text-[color:var(--oliva)] tracking-[0.35em] mb-3">
                {s.n} — {s.cat}
              </div>
              <h3
                className="font-display text-3xl leading-tight text-[color:var(--marrone)] mb-4 whitespace-pre-line"
                style={{ fontWeight: 300, letterSpacing: "-0.01em" }}
              >
                {s.titolo}
              </h3>
              <p className="text-[color:var(--marrone)]/80 text-base leading-relaxed">{s.testo}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════ MOV III · LE QUATTRO FORME — atlante sensoriale ══════════ */}
      <section
        className="relative py-24 md:py-40 px-6 md:px-14"
        aria-label="Quattro modi di diventare bianco"
        style={{ background: "#e8dfc4" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/70 tracking-[0.35em] mb-6">
            LE FORME
          </div>
          <h2
            data-bigword
            className="font-display text-[color:var(--marrone)] leading-[0.92] mb-20 md:mb-32 max-w-4xl"
            style={{ fontSize: "clamp(2.2rem, 6.5vw, 5rem)", fontWeight: 300, letterSpacing: "-0.01em" }}
          >
            Quattro modi<br/>di diventare bianco.
          </h2>

          {/* Composizione asimmetrica editoriale */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-y-32 md:gap-x-8">

            {/* Mozzarella — larga, dominante, nota editoriale */}
            <article data-prod-item className="md:col-span-7">
              <div className="relative aspect-[5/4] overflow-hidden">
                <img
                  src={prodMozzarella}
                  alt="Mozzarella del Caseificio di Masseria Don Gianvito"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={{ filter: "brightness(1.02) saturate(0.85) contrast(0.95)" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, transparent 60%, rgba(61,42,30,0.15) 100%)" }}
                  aria-hidden
                />
              </div>
              <div className="mt-6 flex items-baseline gap-5">
                <h3
                  className="font-display text-5xl md:text-6xl text-[color:var(--marrone)]"
                  style={{ fontWeight: 300, letterSpacing: "-0.02em" }}
                >
                  Mozzarella
                </h3>
                <span className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--oliva)] tracking-[0.35em]">
                  — km zero
                </span>
              </div>
            </article>

            {/* Nodini — SVG linea che si piega, nato dal volume finale */}
            <article data-prod-item className="md:col-span-5 md:pt-40">
              <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, #f4ecd8 0%, #ead9b8 100%)",
                  aspectRatio: "4/5",
                }}
              >
                <svg viewBox="0 0 400 500" className="w-4/5 h-4/5" aria-hidden>
                  <path
                    d="M80 100 C 80 60, 180 60, 180 130 S 320 200, 320 260 S 200 340, 200 400 S 320 460, 300 460"
                    fill="none"
                    stroke="var(--marrone)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    opacity="0.82"
                  />
                </svg>
              </div>
              <div className="mt-6">
                <h3
                  className="font-display text-5xl md:text-6xl text-[color:var(--marrone)]"
                  style={{ fontWeight: 300, letterSpacing: "-0.01em" }}
                >
                  Nodini
                </h3>
              </div>
            </article>

            {/* Primo sale — geometrico, materico */}
            <article data-prod-item className="md:col-span-5 md:col-start-2">
              <div
                className="relative overflow-hidden flex items-center justify-center"
                style={{
                  background: "linear-gradient(160deg, #f9f1dc 0%, #e6d3ad 100%)",
                  aspectRatio: "5/4",
                }}
              >
                <div
                  className="relative"
                  style={{
                    width: "58%",
                    aspectRatio: "1.25/1",
                    background:
                      "linear-gradient(140deg, #fbf5e2 0%, #f0e5c8 60%, #e2cf9f 100%)",
                    borderRadius: "4px",
                    boxShadow:
                      "inset -22px -18px 44px rgba(61,42,30,0.22), inset 16px 16px 40px rgba(255,255,255,0.9), 0 18px 40px rgba(61,42,30,0.18)",
                  }}
                  aria-hidden
                />
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-[2px]"
                  style={{ background: "var(--oliva)" }}
                  aria-hidden
                />
              </div>
              <div className="mt-6">
                <h3
                  className="font-display text-5xl md:text-6xl text-[color:var(--marrone)] uppercase"
                  style={{ fontWeight: 400, letterSpacing: "-0.02em" }}
                >
                  Primo sale
                </h3>
              </div>
            </article>

            {/* Ricotta — leggera, spazio, luce calda */}
            <article data-prod-item className="md:col-span-6 md:col-start-7 md:pt-20">
              <div
                className="relative aspect-[6/5] overflow-hidden"
                style={{ background: "#faf3e0" }}
              >
                <img
                  src={prodRicotta}
                  alt="Ricotta del Caseificio di Masseria Don Gianvito"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={{ filter: "brightness(1.06) saturate(0.82) contrast(0.92)", mixBlendMode: "multiply" }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 30% 30%, rgba(255,251,240,0.5) 0%, transparent 60%)",
                    mixBlendMode: "screen",
                  }}
                  aria-hidden
                />
              </div>
              <div className="mt-6 flex items-baseline gap-5">
                <h3
                  className="font-display text-5xl md:text-6xl text-[color:var(--marrone)] italic"
                  style={{ fontWeight: 300, letterSpacing: "-0.01em" }}
                >
                  Ricotta
                </h3>
                <span className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/50 tracking-[0.35em]">
                  — forma leggera
                </span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ══════════ MOV III.b · UN SOLO LUOGO — passaggio breve ══════════ */}
      <section
        data-solo
        className="relative py-24 md:py-32 px-6 md:px-14"
        aria-label="Un solo luogo"
        style={{ background: "#e8dfc4" }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-[color:var(--marrone)]/85 text-lg md:text-xl max-w-3xl leading-relaxed mb-16 md:mb-20">
            Il Caseificio non è un reparto isolato.<br/>
            Il latte arriva dall'allevamento e continua nei prodotti che entrano nella tavola della Masseria.
          </p>

          <div className="relative">
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 1000 200"
            >
              <path
                data-line
                d="M 40 130 Q 250 60, 500 90 T 960 100"
                fill="none"
                stroke="var(--marrone)"
                strokeWidth="1.5"
                opacity="0.55"
              />
            </svg>
            <div className="relative grid grid-cols-3 items-center py-6 md:py-10">
              <div className="font-display text-[color:var(--marrone)]/45 text-base md:text-2xl" style={{ fontWeight: 300 }}>
                ALLEVAMENTO
              </div>
              <div
                className="font-display text-[color:var(--marrone)] text-center leading-none"
                style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.8rem)", fontWeight: 300, letterSpacing: "-0.02em" }}
              >
                CASEIFICIO
              </div>
              <div className="font-display text-[color:var(--marrone)]/45 text-base md:text-2xl text-right" style={{ fontWeight: 300 }}>
                TAVOLA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ MOV IV · DAL BIANCO ALL'ORO ══════════ */}
      <section
        data-bridge
        className="relative py-32 md:py-44 px-6 md:px-14 overflow-hidden"
        aria-label="Dal bianco alla scelta"
        style={{
          background:
            "linear-gradient(180deg, #e8dfc4 0%, #e6d5a8 30%, #c9a86a 55%, #7d5a3a 82%, var(--marrone) 100%)",
          color: "var(--crema)",
        }}
      >
        {/* Superficie pietra chiara accennata */}
        <div
          data-bridge-stone
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 30% 70%, rgba(61,42,30,0.35) 0%, transparent 65%), radial-gradient(ellipse 80% 50% at 75% 40%, rgba(26,18,16,0.25) 0%, transparent 60%)",
            opacity: 0,
          }}
          aria-hidden
        />

        {/* Linea oro che attraversa la scena */}
        <svg
          aria-hidden
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 w-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 1000 120"
        >
          <defs>
            <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(196,154,74,0)" />
              <stop offset="45%" stopColor="rgba(196,154,74,0.85)" />
              <stop offset="55%" stopColor="rgba(196,154,74,0.85)" />
              <stop offset="100%" stopColor="rgba(196,154,74,0)" />
            </linearGradient>
          </defs>
          <path
            data-gold-line
            d="M 0 60 Q 300 20, 500 60 T 1000 55"
            fill="none"
            stroke="url(#goldStroke)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Bordo del banco che entra */}
        <div
          data-bridge-edge
          className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(26,18,16,0.4) 60%, rgba(26,18,16,0.75) 100%)",
            borderTop: "1px solid rgba(196,154,74,0.5)",
            opacity: 0,
          }}
          aria-hidden
        />

        <div data-bridge-content className="relative max-w-4xl mx-auto text-center">
          <div className="font-eyebrow text-[10px] md:text-[11px] tracking-[0.35em] mb-6" style={{ color: "color-mix(in oklab, var(--crema) 88%, transparent)" }}>
            IL PASSAGGIO
          </div>
          <h2
            className="font-display leading-[0.92] mb-8"
            style={{ fontSize: "clamp(2.2rem, 6.5vw, 5rem)", fontWeight: 300, color: "var(--crema)", letterSpacing: "-0.01em" }}
          >
            Dal bianco<br/>alla scelta.
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: "color-mix(in oklab, var(--crema) 88%, transparent)" }}>
            Il percorso continua nella Macelleria, dove la carne viene mostrata e scelta a vista.
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

/* ─────────────────── Nav Anime ─────────────────── */
function NavAnime({ current }: { current: "allevamento" | "caseificio" | "macelleria" | "agriturismo" }) {
  const items = [
    { key: "allevamento", n: "01", nome: "ALLEVAMENTO", sub: "La terra e gli animali", to: "/allevamento" as const },
    { key: "caseificio", n: "02", nome: "CASEIFICIO", sub: "Pagina corrente", to: "/caseificio" as const },
    { key: "macelleria", n: "03", nome: "MACELLERIA", sub: "La scelta avviene a vista", to: "/macelleria" as const },
    { key: "agriturismo", n: "04", nome: "AGRITURISMO", sub: "La cucina e l'ospitalità", to: "/agriturismo" as const },
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
