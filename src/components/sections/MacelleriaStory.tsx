import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import bancoImg from "@/assets/macel-banco.jpg";
import carneImg from "@/assets/case-bridge-carne.jpg";

/* ─────────────────────────── DATA ─────────────────────────── */

type Cut = {
  id: string;
  label: string;
  detail: string;
  // hotspot on the bovine silhouette (viewBox 0 0 200 120)
  x: number;
  y: number;
  w: number;
  h: number;
  // callout anchor on the same viewBox
  cx: number;
  cy: number;
  // side of the callout: left | right
  side: "left" | "right";
};

const CUTS: Cut[] = [
  {
    id: "filetto",
    label: "Filetto",
    detail: "Pezzata Rossa × Frisona · frollatura 15 giorni · al sangue",
    x: 108, y: 46, w: 22, h: 12,
    cx: 165, cy: 22, side: "right",
  },
  {
    id: "bombette",
    label: "Bombette",
    detail: "di nostra produzione",
    x: 78, y: 48, w: 22, h: 12,
    cx: 55, cy: 20, side: "left",
  },
  {
    id: "salsiccia",
    label: "Salsiccia",
    detail: "di nostra produzione",
    x: 140, y: 56, w: 20, h: 10,
    cx: 178, cy: 96, side: "right",
  },
  {
    id: "sopressata",
    label: "Sopressata",
    detail: "stagionata in masseria",
    x: 62, y: 62, w: 18, h: 10,
    cx: 30, cy: 96, side: "left",
  },
  {
    id: "pancetta",
    label: "Pancetta tesa",
    detail: "di nostra produzione",
    x: 96, y: 72, w: 30, h: 8,
    cx: 100, cy: 108, side: "right",
  },
];

const PRODUCTS = [
  {
    id: "filetto",
    name: "Filetto di vitello",
    weight: "±280 g",
    line: "Pezzata Rossa × Frisona · frollatura 15 gg · al sangue.",
  },
  {
    id: "bombette",
    name: "Bombette",
    weight: "6 pz",
    line: "Involtini di capocollo, caciocavallo, prezzemolo.",
  },
  {
    id: "salsiccia",
    name: "Salsiccia",
    weight: "al metro",
    line: "Grana grossa, semi di finocchio, sale.",
  },
  {
    id: "sopressata",
    name: "Sopressata",
    weight: "stagionata",
    line: "Stagionatura in masseria, taglio grosso.",
  },
  {
    id: "focaccia",
    name: "Focaccia della casa",
    weight: "sab · dom",
    line: "Con la farina del nostro grano tenero.",
  },
];

const QUOTES = [
  {
    text: "La carne è tenerissima e molto saporita, soprattutto la salsiccia e le bombette.",
    from: "Tripadvisor",
  },
  {
    text: "Filetto di vitello con circa 15 giorni di frollatura, alla brace rigorosamente al sangue. Si taglia come il burro.",
    from: "Luciano Pignataro Wine Blog",
  },
];

/* ─────────────────────────── COMPONENT ─────────────────────────── */

export function MacelleriaStory() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeCut, setActiveCut] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (reduced) return;
      const mm = gsap.matchMedia();

      /* ══════ INGRESSO · IL BANCO ══════ */
      const ing = root.querySelector<HTMLElement>("[data-mov='ing']");
      const banco = root.querySelector<HTMLElement>("[data-banco]");
      const stamp = root.querySelector<HTMLElement>("[data-stamp]");
      const silhouetteIntro = root.querySelector<HTMLElement>("[data-silhouette-intro] path");

      if (ing && banco) {
        ScrollTrigger.create({
          trigger: ing,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(banco, {
              scale: 1 + p * 0.12,
              y: -p * 40,
              autoAlpha: 1 - p * 0.3,
            });
          },
        });

        if (silhouetteIntro) {
          const len = (silhouetteIntro as unknown as SVGPathElement).getTotalLength?.() ?? 2000;
          gsap.set(silhouetteIntro, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(silhouetteIntro, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ing,
              start: "top top",
              end: "70% top",
              scrub: 1,
            },
          });
        }

        if (stamp) {
          gsap.set(stamp, { autoAlpha: 0, scale: 1.6, rotate: -12 });
          gsap.to(stamp, {
            autoAlpha: 1,
            scale: 1,
            rotate: -4,
            ease: "power4.out",
            duration: 0.7,
            scrollTrigger: {
              trigger: ing,
              start: "70% top",
              toggleActions: "play none none reverse",
            },
          });
        }
      }

      /* ══════ SEZIONE A · IL DIAGRAMMA (pinned desktop) ══════ */
      mm.add("(min-width: 900px)", () => {
        const secA = root.querySelector<HTMLElement>("[data-mov='A']");
        const diag = root.querySelector<HTMLElement>("[data-diagram-wrap]");
        if (!secA || !diag) return;
        ScrollTrigger.create({
          trigger: secA,
          start: "top top",
          end: "bottom bottom",
          pin: diag,
          pinSpacing: false,
        });
      });

      // Illuminazione tagli in stagger
      const secA = root.querySelector<HTMLElement>("[data-mov='A']");
      if (secA) {
        CUTS.forEach((c, i) => {
          const hotspot = root.querySelector<SVGRectElement>(`[data-hotspot='${c.id}']`);
          const callout = root.querySelector<HTMLElement>(`[data-callout='${c.id}']`);
          const leader = root.querySelector<SVGPathElement>(`[data-leader='${c.id}']`);
          if (hotspot) {
            gsap.set(hotspot, { autoAlpha: 0, transformOrigin: "center" });
            gsap.to(hotspot, {
              autoAlpha: 1,
              ease: "power2.out",
              duration: 0.4,
              scrollTrigger: {
                trigger: secA,
                start: `${10 + i * 15}% top`,
                toggleActions: "play none none reverse",
                onEnter: () => setActiveCut(c.id),
                onEnterBack: () => setActiveCut(c.id),
              },
            });
          }
          if (callout) {
            gsap.fromTo(
              callout,
              { autoAlpha: 0, y: 12 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: secA,
                  start: `${10 + i * 15}% top`,
                  toggleActions: "play none none reverse",
                },
              },
            );
          }
          if (leader) {
            const len = leader.getTotalLength?.() ?? 300;
            gsap.set(leader, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(leader, {
              strokeDashoffset: 0,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: secA,
                start: `${10 + i * 15}% top`,
                toggleActions: "play none none reverse",
              },
            });
          }
        });
      }

      /* ══════ SEZIONE B · Tracciabilità (linea oro taglio↔animale) ══════ */
      const traceLine = root.querySelector<SVGPathElement>("[data-trace-line]");
      if (traceLine) {
        const len = traceLine.getTotalLength?.() ?? 800;
        gsap.set(traceLine, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(traceLine, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: traceLine,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        });
      }

      /* ══════ SEZIONE C · prodotti broken grid ══════ */
      root.querySelectorAll<HTMLElement>("[data-prod]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            delay: (i % 3) * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      /* ══════ Ponte · taglio → brace (heat morph breve) ══════ */
      const heat = root.querySelector<HTMLElement>("[data-heat]");
      if (heat) {
        gsap.fromTo(
          heat,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: heat, start: "top 90%", end: "top 30%", scrub: 1 },
          },
        );
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
      {/* ══════════════════ INGRESSO · IL BANCO ══════════════════ */}
      <section
        data-mov="ing"
        className="relative h-[200vh]"
        aria-label="Il banco della macelleria"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Marmo di sfondo */}
          <div
            data-banco
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${bancoImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.85) saturate(0.75) contrast(1.05)",
            }}
          />
          {/* Marmo wash */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(61,42,30,0.35) 0%, rgba(26,18,16,0.15) 40%, rgba(61,42,30,0.55) 100%)",
            }}
          />

          {/* Rail sinistro */}
          <div
            aria-hidden
            className="absolute left-4 md:left-8 top-0 h-full flex items-center pointer-events-none z-10"
          >
            <div
              className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--crema)]/50"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                letterSpacing: "0.3em",
              }}
            >
              MACELLERIA · III · NOCI · FROLLATURA 15 GG
            </div>
          </div>

          {/* Sagoma bovino che si disegna */}
          <div
            data-silhouette-intro
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-70"
          >
            <svg
              viewBox="0 0 200 120"
              className="w-[min(70vw,700px)] h-auto"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              <BovineOutlinePath stroke="var(--oro)" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Timbro */}
          <div
            data-stamp
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          >
            <div
              className="border-4 px-8 py-6 text-center"
              style={{
                borderColor: "var(--oro)",
                background: "rgba(242,232,213,0.92)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
                borderRadius: "4px",
              }}
            >
              <div
                className="font-eyebrow text-[10px] md:text-[12px]"
                style={{ color: "var(--marrone)", letterSpacing: "0.3em" }}
              >
                MASSERIA DON GIANVITO · NOCI · CAP. III
              </div>
              <h1
                className="font-display mt-2"
                style={{
                  color: "var(--marrone)",
                  fontSize: "clamp(2rem, 5.5vw, 4.2rem)",
                  fontWeight: 400,
                  lineHeight: 0.95,
                  letterSpacing: "-0.01em",
                }}
              >
                La carne, a vista
              </h1>
              <div
                className="font-eyebrow text-[10px] mt-3"
                style={{ color: "var(--marrone)", opacity: 0.7, letterSpacing: "0.25em" }}
              >
                CONTROLLATA · FROLLATA · TRACCIATA
              </div>
            </div>
          </div>

          {/* Cue */}
          <div className="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none z-20">
            <div className="font-eyebrow text-[10px] text-[color:var(--crema)]/50 tracking-[0.3em]">
              ↓ AL BANCO
            </div>
          </div>
          <div className="grain absolute inset-0 pointer-events-none" />
        </div>
      </section>

      {/* ══════════════════ SEZIONE A · IL DIAGRAMMA ══════════════════ */}
      <section
        data-mov="A"
        className="relative"
        aria-label="Il diagramma anatomico dei tagli"
        style={{
          background:
            "linear-gradient(180deg, var(--marrone) 0%, var(--carbone) 100%)",
          minHeight: "260vh",
        }}
      >
        <div
          data-diagram-wrap
          className="relative h-screen w-full flex items-center justify-center overflow-hidden"
        >
          {/* Trama marmo/carboncino sottile */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(196,154,74,0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(196,154,74,0.12) 0%, transparent 40%)",
            }}
          />

          <div className="relative w-full h-full flex items-center justify-center px-4 md:px-8">
            <svg
              viewBox="0 0 200 120"
              className="w-[min(90vw,1000px)] h-auto max-h-[80vh]"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Sagoma completa in tratto oro */}
              <BovineOutlinePath stroke="var(--oro)" strokeWidth="0.4" opacity="0.9" />

              {/* Hotspot tagli */}
              {CUTS.map((c) => (
                <g key={c.id}>
                  <rect
                    data-hotspot={c.id}
                    x={c.x}
                    y={c.y}
                    width={c.w}
                    height={c.h}
                    rx="2"
                    fill="var(--terracotta)"
                    stroke="var(--oro)"
                    strokeWidth="0.5"
                    opacity={activeCut === c.id ? 0.95 : 0.75}
                    style={{
                      filter:
                        activeCut === c.id
                          ? "drop-shadow(0 0 4px rgba(196,154,74,0.9))"
                          : "drop-shadow(0 0 2px rgba(196,154,74,0.4))",
                      cursor: "pointer",
                      transition: "opacity 0.3s, filter 0.3s",
                    }}
                    onMouseEnter={() => setActiveCut(c.id)}
                    onFocus={() => setActiveCut(c.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`${c.label} — ${c.detail}`}
                  />
                  {/* Leader line */}
                  <path
                    data-leader={c.id}
                    d={`M ${c.x + c.w / 2} ${c.y + c.h / 2} L ${c.cx} ${c.cy}`}
                    stroke="var(--oro)"
                    strokeWidth="0.3"
                    opacity="0.75"
                    fill="none"
                  />
                  <circle cx={c.cx} cy={c.cy} r="1" fill="var(--oro)" />
                </g>
              ))}
            </svg>

            {/* Callout HTML (posizionati assoluto sopra la sagoma) */}
            <div className="absolute inset-0 pointer-events-none">
              {CUTS.map((c) => {
                const left = `${(c.cx / 200) * 100}%`;
                const top = `${(c.cy / 120) * 100}%`;
                const isActive = activeCut === c.id;
                return (
                  <div
                    key={c.id}
                    data-callout={c.id}
                    className="absolute -translate-y-1/2 max-w-[220px]"
                    style={{
                      left,
                      top,
                      transform: `translate(${c.side === "left" ? "-105%" : "10%"}, -50%)`,
                      textAlign: c.side === "left" ? "right" : "left",
                      opacity: isActive ? 1 : 0.85,
                      transition: "opacity 0.3s",
                    }}
                  >
                    <div
                      className="font-eyebrow text-[10px] md:text-[11px] mb-1"
                      style={{
                        color: "var(--oro)",
                        letterSpacing: "0.28em",
                      }}
                    >
                      {c.label.toUpperCase()}
                    </div>
                    <div
                      className="font-display text-[color:var(--crema)] text-sm md:text-base italic leading-snug"
                      style={{ fontWeight: 300 }}
                    >
                      {c.detail}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contatore basso */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-eyebrow text-[10px] text-[color:var(--crema)]/50 tracking-[0.3em]">
            {CUTS.findIndex((c) => c.id === activeCut) + 1 || 1} / {CUTS.length} · TAGLI
          </div>
        </div>

        {/* Riga di chiusura sezione */}
        <div className="relative z-10 text-center pb-24 px-6">
          <p
            className="font-display italic text-[color:var(--crema)]/85 max-w-2xl mx-auto"
            style={{ fontSize: "clamp(1.1rem, 1.7vw, 1.4rem)", fontWeight: 300 }}
          >
            Tutte le carni sono di produzione propria.
            <br />
            Ogni taglio nasce e cresce qui.
          </p>
        </div>
      </section>

      {/* ══════════════════ SEZIONE B · TRACCIABILITÀ ══════════════════ */}
      <section
        className="relative py-24 md:py-32 overflow-hidden"
        aria-label="Tracciabilità"
        style={{
          background:
            "linear-gradient(180deg, var(--carbone) 0%, var(--marrone) 100%)",
        }}
      >
        <div className="relative mx-auto max-w-6xl px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-center">
            {/* Sinistra · taglio */}
            <div className="relative">
              <div
                className="border border-[color:var(--oro)]/40 p-6"
                style={{
                  background: "rgba(26,18,16,0.6)",
                  borderRadius: "2px",
                }}
              >
                <div className="font-eyebrow text-[10px] text-[color:var(--oro)] tracking-[0.3em] mb-2">
                  TAGLIO · FILETTO
                </div>
                <div
                  className="font-display text-[color:var(--crema)] mb-4"
                  style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)", fontWeight: 300 }}
                >
                  Frollato 15 giorni
                </div>
                <div className="text-[color:var(--crema)]/75 text-sm md:text-base">
                  Cottura al sangue, rigorosamente. Si taglia come il burro.
                </div>
              </div>
            </div>

            {/* Linea oro che unisce */}
            <svg
              aria-hidden
              className="hidden md:block absolute left-1/2 top-0 h-full w-24 -translate-x-1/2 pointer-events-none"
              viewBox="0 0 100 400"
              preserveAspectRatio="none"
            >
              <path
                data-trace-line
                d="M 15 40 C 60 100, 30 250, 85 340"
                fill="none"
                stroke="var(--oro)"
                strokeWidth="1.2"
                opacity="0.85"
              />
            </svg>

            {/* Destra · animale */}
            <div className="relative">
              <div
                className="border border-[color:var(--oro)]/40 p-6"
                style={{
                  background: "rgba(61,42,30,0.7)",
                  borderRadius: "2px",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="inline-flex items-center justify-center rounded-sm px-2 py-1 font-eyebrow text-[10px] tracking-[0.2em]"
                    style={{ background: "var(--oro)", color: "var(--marrone)" }}
                  >
                    N° 047
                  </span>
                  <span className="font-eyebrow text-[10px] text-[color:var(--crema)]/60 tracking-[0.3em]">
                    MARCHIO AURICOLARE · ALLEVAMENTO
                  </span>
                </div>
                <div
                  className="font-display text-[color:var(--crema)] mb-2"
                  style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)", fontWeight: 300 }}
                >
                  Bovino Pezzata Rossa × Frisona
                </div>
                <div className="text-[color:var(--crema)]/75 text-sm md:text-base">
                  Nato e cresciuto qui · pascolo della masseria · foraggio di casa.
                </div>
                <Link
                  to="/allevamento"
                  className="mt-4 inline-block font-eyebrow text-[10px] text-[color:var(--oro)] tracking-[0.3em] hover:underline"
                >
                  ↗ RISALI ALL'ALLEVAMENTO
                </Link>
              </div>
            </div>
          </div>

          {/* Focaccia — micro dettaglio laterale */}
          <div className="mt-20 md:mt-28 border-t border-[color:var(--oro)]/25 pt-10 flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
            <div className="md:flex-1">
              <div className="font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.3em] mb-2">
                A LATO · FOCACCIA
              </div>
              <p
                className="font-display italic text-[color:var(--crema)] leading-snug"
                style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)", fontWeight: 300 }}
              >
                Ogni sabato e domenica, in macelleria trovate la nostra focaccia
                <br />
                prodotta con la farina del nostro grano tenero.
              </p>
            </div>
            <div className="md:w-52 font-eyebrow text-[10px] text-[color:var(--crema)]/50 tracking-[0.3em] text-right md:text-left">
              GRANO · FARINA · FORNO — LA FILIERA CHIUDE ANCHE NEL PANE.
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ SEZIONE C · IL BANCONE (prodotti) ══════════════════ */}
      <section
        className="relative py-24 md:py-32"
        aria-label="Il bancone"
        style={{
          background:
            "linear-gradient(180deg, var(--marrone) 0%, color-mix(in oklab, var(--marrone) 70%, var(--carbone)) 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-16 md:mb-20 max-w-3xl">
            <div className="font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.35em] mb-3">
              AL BANCONE · SI SCEGLIE E SI CUOCE
            </div>
            <p
              className="font-display italic text-[color:var(--crema)] leading-snug"
              style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)", fontWeight: 300 }}
            >
              “Si sceglie la carne nella macelleria e poi la fai cucinare.
              Tutto spettacolare.”
              <span className="block mt-2 font-eyebrow not-italic text-[10px] text-[color:var(--oro)]/70 tracking-[0.3em]">
                — TRIPADVISOR
              </span>
            </p>
          </div>

          {/* Broken grid prodotti */}
          <div className="grid grid-cols-12 gap-6 md:gap-8">
            {PRODUCTS.map((p, i) => {
              const layouts = [
                "col-span-12 md:col-span-6 md:col-start-1",
                "col-span-12 md:col-span-5 md:col-start-8 md:mt-24",
                "col-span-12 md:col-span-5 md:col-start-2 md:mt-8",
                "col-span-12 md:col-span-6 md:col-start-7 md:mt-16",
                "col-span-12 md:col-span-5 md:col-start-3 md:mt-8",
              ];
              return (
                <article
                  key={p.id}
                  data-prod
                  className={`${layouts[i]} relative`}
                >
                  {/* Ritratto su marmo */}
                  <div
                    className="relative aspect-[4/5] overflow-hidden shadow-2xl"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 40%, #e8dcc4 0%, #c9b98f 100%)",
                      borderRadius: "2px",
                    }}
                  >
                    {/* venature marmo */}
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-30 mix-blend-multiply"
                      style={{
                        backgroundImage:
                          "linear-gradient(120deg, transparent 40%, rgba(61,42,30,0.4) 50%, transparent 60%), linear-gradient(75deg, transparent 60%, rgba(61,42,30,0.3) 65%, transparent 70%)",
                      }}
                    />
                    {/* etichetta prodotto (timbro) */}
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <div
                        className="border-2 border-[color:var(--marrone)]/70 px-5 py-4 text-center max-w-[85%]"
                        style={{
                          background: "rgba(242,232,213,0.88)",
                          transform: `rotate(${i % 2 === 0 ? -2 : 3}deg)`,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                          borderRadius: "2px",
                        }}
                      >
                        <div
                          className="font-eyebrow text-[10px] mb-1"
                          style={{ color: "var(--marrone)", letterSpacing: "0.28em" }}
                        >
                          {String(i + 1).padStart(2, "0")} · BANCO
                        </div>
                        <div
                          className="font-display leading-tight"
                          style={{
                            color: "var(--marrone)",
                            fontSize: "clamp(1.2rem, 1.7vw, 1.6rem)",
                            fontWeight: 400,
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          className="font-eyebrow text-[10px] mt-2"
                          style={{ color: "var(--terracotta)", letterSpacing: "0.25em" }}
                        >
                          {p.weight}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-[color:var(--crema)]/75 text-sm md:text-base italic px-1">
                    {p.line}
                  </p>
                </article>
              );
            })}
          </div>

          {/* Recensioni fluttuanti */}
          <div className="relative mt-24 md:mt-32 flex flex-col md:flex-row gap-8 md:gap-16 justify-center items-start">
            {QUOTES.map((q, i) => (
              <blockquote
                key={i}
                data-prod
                className={`max-w-md ${i === 1 ? "md:mt-20" : ""}`}
              >
                <p
                  className="font-display italic text-[color:var(--crema)] leading-snug"
                  style={{ fontSize: "clamp(1.15rem, 1.9vw, 1.55rem)", fontWeight: 300 }}
                >
                  “{q.text}”
                </p>
                <footer className="mt-3 font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.3em]">
                  — {q.from}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ PONTE · TAGLIO → BRACE ══════════════════ */}
      <section
        aria-label="Ponte alla Braceria"
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--marrone) 70%, var(--carbone)) 0%, var(--carbone) 100%)",
        }}
      >
        {/* Heat morph — bagliore terracotta breve */}
        <div
          data-heat
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 80%, color-mix(in oklab, var(--terracotta) 45%, transparent) 0%, transparent 55%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url(${carneImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.5)",
          }}
        />

        <div className="relative text-center px-6">
          <div className="font-eyebrow text-[10px] text-[color:var(--crema)]/50 tracking-[0.35em] mb-4">
            IL TAGLIO ENTRA NEL FUOCO · CAPITOLO IV
          </div>
          <Link
            to="/braceria"
            className="group inline-block font-display text-[color:var(--crema)] hover:text-[color:var(--oro)] transition-colors"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 300 }}
          >
            La Braceria
            <span
              aria-hidden
              className="block mx-auto mt-3 h-px"
              style={{ width: "40%", background: "var(--oro)" }}
            />
          </Link>
          <p className="mt-6 max-w-xl mx-auto text-[color:var(--crema)]/60 text-sm md:text-base italic">
            Dal banco al carbone. La cottura è l'ultima parola.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── Bovino silhouette (editorial line) ─────────────────────────── */

function BovineOutlinePath({
  stroke,
  strokeWidth,
  opacity = 1,
}: {
  stroke: string;
  strokeWidth: string | number;
  opacity?: number;
}) {
  // Stilizzato: testa a sx, corpo, coda, 4 zampe. viewBox 200x120.
  const d =
    "M 42 44 Q 30 42 26 50 Q 22 58 28 62 L 34 62 Q 38 66 44 66 " +
    "L 60 66 L 66 82 L 66 108 M 66 82 L 90 82 L 94 108 " +
    "M 90 82 L 140 82 L 148 108 M 140 82 L 164 82 L 172 108 " +
    "M 164 82 Q 176 82 178 76 L 180 66 L 172 60 " +
    "Q 168 46 148 42 L 60 42 Q 50 42 44 46 Z " +
    "M 176 68 Q 184 66 186 72 Q 188 78 182 82";
  return (
    <path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      fill="none"
    />
  );
}
