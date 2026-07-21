import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

// Sostituire con fotografia autentica del banco della Macelleria.
import bancoImg from "@/assets/macel-banco.jpg";
// Sostituire con fotografia autentica del grano/farina della Masseria.
import granoImg from "@/assets/allev-c-grano.jpg";

/* ─────────────────────────────────────────────────────────────
 * /macelleria — A VISTA
 * Un solo movimento in cinque momenti:
 *   I   Il Vetro       — ingresso davanti al banco
 *   II  La Scelta      — Guarda / Scegli / Siedi
 *   III Il Taglio      — Atlante inciso + filo tracciabilità
 *   IV  Il Tempo       — Frollatura, salumi, farina
 *   V   Dopo il Banco  — passaggio verso /agriturismo
 * ───────────────────────────────────────────────────────────── */

type Voce = {
  id: "filetto" | "bombette" | "salsiccia" | "altri";
  label: string;
  cat: "TAGLIO" | "PREPARAZIONE" | "BANCO";
  titolo: string;
  testo: string;
  nota?: string;
  x: number; // viewBox 400×260
  y: number;
  side: "cut" | "prep" | "beyond"; // cut = silhouette, prep = piano laterale, beyond = oltre bordo
};

const VOCI: Voce[] = [
  {
    id: "filetto",
    label: "Filetto di vitello",
    cat: "TAGLIO",
    titolo: "Filetto di vitello",
    testo: "Tra i tagli emersi dal banco della Masseria.",
    nota: "Frollatura indicativa di circa quindici giorni.",
    x: 240,
    y: 118,
    side: "cut",
  },
  {
    id: "bombette",
    label: "Bombette",
    cat: "PREPARAZIONE",
    titolo: "Bombette",
    testo: "Tra le preparazioni scelte al banco e portate alla cottura.",
    x: 358,
    y: 78,
    side: "prep",
  },
  {
    id: "salsiccia",
    label: "Salsiccia",
    cat: "PREPARAZIONE",
    titolo: "Salsiccia",
    testo: "Una delle preparazioni ricordate insieme alle bombette.",
    x: 358,
    y: 138,
    side: "prep",
  },
  {
    id: "altri",
    label: "Altri tagli al banco",
    cat: "BANCO",
    titolo: "La scelta cambia.",
    testo:
      "Gli altri tagli seguono la disponibilità del banco e devono essere confermati direttamente con la Masseria.",
    x: 384,
    y: 210,
    side: "beyond",
  },
];

const SALUMI = ["PROSCIUTTO CRUDO", "SOPPRESSATA", "SALSICCIA SECCA", "PANCETTA TESA"];
const FILO = ["ALLEVAMENTO", "TEMPO", "BANCO"] as const;

/* ═════════════════════════════════════════════════════════════ */

export function MacelleriaStory() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Voce["id"]>("filetto");
  // aria-live parla solo dopo attivazione intenzionale (click / Enter / Space)
  const [announce, setAnnounce] = useState<string>("");

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    let mounted = true;

    const ctx = gsap.context(() => {
      /* ═══ I · IL VETRO — sequenza marmo → vetro → linea → titolo → timbro ═══ */
      const open = root.querySelector<HTMLElement>("[data-act='vetro']");
      const marmo = root.querySelector<HTMLElement>("[data-marmo]");
      const vetro = root.querySelector<HTMLElement>("[data-vetro]");
      const banco = root.querySelector<HTMLElement>("[data-banco-img]");
      const bordoLine = root.querySelector<HTMLElement>("[data-bordo-oro]");
      const titolo = root.querySelectorAll<HTMLElement>("[data-h1-line]");
      const testoOpen = root.querySelector<HTMLElement>("[data-open-testo]");
      const stamp = root.querySelector<HTMLElement>("[data-stamp]");

      if (open) {
        // Intro one-shot: marmo entra, banco emerge dietro il vetro, il vetro si vela.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: open, start: "top 80%", once: true },
          defaults: { ease: "power2.out" },
        });
        if (marmo) tl.fromTo(marmo, { autoAlpha: 0.4, scale: 1.05 }, { autoAlpha: 1, scale: 1, duration: 1.6 }, 0);
        if (banco) tl.fromTo(banco, { autoAlpha: 0, scale: 1.15, filter: "blur(14px)" }, { autoAlpha: 0.9, scale: 1.04, filter: "blur(0px)", duration: 1.8 }, 0.2);
        if (vetro) tl.fromTo(vetro, { autoAlpha: 1 }, { autoAlpha: 0.4, duration: 1.4 }, 0.5);

        // Handoff scrub: negli ultimi 30% dello scroll dell'hero, il fondo
        // del banco si scurisce, i testi si alleggeriscono, e la banda di
        // raccordo (linea oro + "GUARDA") entra a legare il Rito.
        const handoff = root.querySelector<HTMLElement>("[data-handoff]");
        const handoffContent = root.querySelector<HTMLElement>("[data-handoff-content]");
        const scrim = root.querySelector<HTMLElement>("[data-hero-scrim]");
        const editorial = root.querySelector<HTMLElement>("[data-editorial]");
        gsap.timeline({
          scrollTrigger: { trigger: open, start: "top top", end: "bottom bottom", scrub: 0.5 },
        })
          .fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1 }, 0)
          .fromTo(editorial, { autoAlpha: 1, y: 0 }, { autoAlpha: 0.35, y: -24 }, 0)
          .fromTo(handoff, { autoAlpha: 0 }, { autoAlpha: 1 }, 0.15)
          .fromTo(handoffContent, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, 0.35);
      }

      if (bordoLine) {
        gsap.fromTo(
          bordoLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "power2.out",
            duration: 1.3,
            scrollTrigger: { trigger: open, start: "top 70%", once: true },
          },
        );
      }

      titolo.forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 110 },
          {
            yPercent: 0,
            ease: "power3.out",
            duration: 1,
            delay: 0.4 + i * 0.15,
            scrollTrigger: { trigger: open, start: "top 70%", once: true },
          },
        );
      });

      if (testoOpen) {
        gsap.fromTo(
          testoOpen,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            delay: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: open, start: "top 70%", once: true },
          },
        );
      }

      if (stamp) {
        gsap.fromTo(
          stamp,
          { autoAlpha: 0, scale: 1.15, rotate: -3 },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: -1.4,
            duration: 0.35,
            ease: "power4.out",
            delay: 1.3,
            scrollTrigger: { trigger: open, start: "top 70%", once: true },
          },
        );
      }

      /* ═══ II · IL RITO — verbi in cascata + linea attraversante ═══ */
      root.querySelectorAll<HTMLElement>("[data-verb]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, yPercent: 30, clipPath: "inset(0 0 100% 0)" },
          {
            autoAlpha: 1,
            yPercent: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            delay: i * 0.18,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          },
        );
      });

      const ritoLine = root.querySelector<SVGPathElement>("path[data-rito-line]");
      if (ritoLine) {
        const len = ritoLine.getTotalLength();
        gsap.set(ritoLine, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(ritoLine, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ritoLine.ownerSVGElement,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 0.6,
          },
        });
      }

      /* ═══ Big words ═══ */
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

      /* ═══ III · FILO tracciabilità ═══ */
      const filoLine = root.querySelector<SVGPathElement>("path[data-filo-line]");
      if (filoLine) {
        const len = filoLine.getTotalLength();
        gsap.set(filoLine, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(filoLine, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: filoLine.ownerSVGElement,
            start: "top 78%",
            end: "bottom 45%",
            scrub: 0.6,
          },
        });
      }

      /* ═══ IV · FROLLATURA — 15 incisioni, unica timeline con stagger ═══ */
      const frollSect = root.querySelector<HTMLElement>("[data-frollatura]");
      if (frollSect) {
        const segni = frollSect.querySelectorAll<HTMLElement>("[data-segno]");
        gsap.fromTo(
          segni,
          { scaleY: 0, autoAlpha: 0 },
          {
            scaleY: 1,
            autoAlpha: 1,
            transformOrigin: "bottom center",
            stagger: 0.045,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: { trigger: frollSect, start: "top 72%", once: true },
          },
        );
        const numero = frollSect.querySelector<HTMLElement>("[data-num15]");
        if (numero) {
          gsap.fromTo(
            numero,
            { autoAlpha: 0, scale: 1.08 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 1.4,
              ease: "power2.out",
              scrollTrigger: { trigger: frollSect, start: "top 72%", once: true },
            },
          );
        }
      }

      /* ═══ IV · SALUMI — reveal singolo per riga ═══ */
      root.querySelectorAll<HTMLElement>("[data-salume]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, x: -20, clipPath: "inset(0 100% 0 0)" },
          {
            autoAlpha: 1,
            x: 0,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.9,
            delay: i * 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });

      /* ═══ V · PASSAGGIO — COTTURA locale terracotta ═══ */
      const cottura = root.querySelector<HTMLElement>("[data-parola-cottura]");
      if (cottura) {
        gsap.fromTo(
          cottura,
          { color: "var(--crema)" },
          {
            color: "#e88b5c",
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: { trigger: cottura, start: "top 75%", once: true },
          },
        );
      }

      const doRefresh = () => { if (mounted) ScrollTrigger.refresh(); };
      if (document.fonts?.ready) document.fonts.ready.then(doRefresh).catch(() => {});
      const t = window.setTimeout(doRefresh, 200);
      return () => window.clearTimeout(t);
    }, root);

    return () => {
      mounted = false;
      ctx.revert();
    };
  }, [reduced]);

  const activeVoce = VOCI.find((v) => v.id === active) ?? VOCI[0];

  const activate = (id: Voce["id"]) => {
    setActive(id);
    const v = VOCI.find((x) => x.id === id);
    if (v) setAnnounce(`${v.titolo}. ${v.testo}`);
  };

  return (
    <div
      ref={rootRef}
      className="relative w-full"
      style={{ background: "#1a1210", color: "var(--marrone)" }}
    >
      {/* ══════════════════════════ I · PIETRA → VETRO → BANCO ══════════════════════════
          Palcoscenico di pietra continuo, colonna di vetro a destra come
          feritoia sul banco. Wrapper 130dvh: 100dvh di scena + 30dvh di
          handoff scrub che porta il visitatore direttamente dentro il Rito
          (senza mostrare fondo crema nudo). */}
      <section
        data-act="vetro"
        className="relative h-[130dvh]"
        aria-label="La scelta avviene a vista"
      >
        <div
          className="sticky top-0 h-[100dvh] w-full overflow-hidden"
          style={{ background: "#1a1210" }}
        >
          {/* Fondo pietra caldo — tutta la superficie */}
          <div
            data-marmo
            aria-hidden
            className="absolute inset-0"
            style={{
              background: [
                "radial-gradient(120% 90% at 18% 22%, #f6ecd6 0%, #e2d0a8 32%, #b39770 58%, #6a4e36 84%, #2e2018 100%)",
                "repeating-linear-gradient(104deg, rgba(255,247,232,0.05) 0 2px, transparent 2px 32px)",
                "repeating-linear-gradient(72deg, rgba(48,32,22,0.06) 0 1px, transparent 1px 52px)",
              ].join(", "),
              backgroundBlendMode: "normal, overlay, overlay",
            }}
          />
          {/* Luce radente da sinistra */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 100% at -5% 30%, rgba(255,240,210,0.28) 0%, transparent 55%)",
              mixBlendMode: "screen",
            }}
          />
          {/* Vignettatura basso */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, transparent 60%, rgba(26,18,16,0.42) 100%)",
            }}
          />

          {/* Colonna di vetro a destra — feritoia sul banco (desktop only) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-0 right-0 h-full w-[26%] lg:w-[22%] overflow-hidden"
          >
            {/* Banco dietro il vetro */}
            <div
              data-banco-img
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${bancoImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center 55%",
                filter: "brightness(0.38) contrast(1.2) saturate(0.35) sepia(0.18)",
              }}
            />
            {/* Velo vetro */}
            <div
              data-vetro
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(210deg, rgba(242,232,213,0.28) 0%, rgba(26,18,16,0.42) 50%, rgba(26,18,16,0.85) 100%)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
              }}
            />
            {/* Riflesso obliquo sul vetro */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(115deg, transparent 40%, rgba(255,247,232,0.10) 48%, transparent 56%)",
              }}
            />
            {/* Cerniera oro sul bordo sinistro del vetro */}
            <div
              className="absolute top-[10%] bottom-[10%] left-0 w-px"
              style={{
                background:
                  "linear-gradient(180deg, transparent, color-mix(in oklab, var(--oro) 80%, transparent) 18%, color-mix(in oklab, var(--oro) 80%, transparent) 82%, transparent)",
                boxShadow: "0 0 16px rgba(197,161,89,0.4)",
              }}
            />
            {/* Traccia verticale sul vetro */}
            <div
              className="absolute right-4 lg:right-6 top-0 h-full flex items-center"
            >
              <div
                className="font-eyebrow text-[10px] lg:text-[11px] tracking-[0.42em] text-[color:var(--crema)]/50"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                GUARDA · SCEGLI · SIEDI
              </div>
            </div>
          </div>

          {/* Bordo oro orizzontale — sotto l'eyebrow, sotto la navbar */}
          <div
            data-bordo-oro
            aria-hidden
            className="absolute left-6 md:left-14 h-px origin-left"
            style={{
              top: "calc(var(--page-header-safe-offset, 88px) + 40px)",
              right: "min(30%, 30vw)",
              background:
                "linear-gradient(90deg, color-mix(in oklab, var(--oro) 75%, transparent), transparent)",
            }}
          />

          {/* CONTENUTO EDITORIALE — colonna sinistra ampia, tutto in pietra */}
          <div
            data-editorial
            className="absolute inset-0 z-10 flex flex-col justify-between px-6 md:px-14 pointer-events-none"
            style={{
              paddingTop: "calc(var(--page-header-safe-offset, 88px) + 12px)",
              paddingBottom: "clamp(2.5rem, 7vh, 5rem)",
            }}
          >
            <div className="font-eyebrow text-[10px] md:text-[11px] tracking-[0.42em] text-[color:var(--marrone)]/80">
              MACELLERIA · A&nbsp;VISTA
            </div>

            <div className="w-full md:max-w-[70%] lg:max-w-[68%] xl:max-w-[62%]">
              <h1
                className="font-display leading-[0.9] text-[color:var(--marrone)]"
                style={{
                  fontSize: "clamp(2.8rem, 8.4vw, 7.2rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  textShadow:
                    "0 1px 0 rgba(255,247,232,0.4), 0 6px 24px rgba(26,18,16,0.18)",
                }}
                aria-label="La scelta avviene a vista."
              >
                <span data-h1-line className="block overflow-hidden">
                  <span className="inline-block">La&nbsp;scelta</span>
                </span>
                <span data-h1-line className="block overflow-hidden">
                  <em
                    className="inline-block"
                    style={{
                      fontStyle: "italic",
                      color:
                        "color-mix(in oklab, var(--bordeaux) 78%, var(--marrone))",
                    }}
                  >
                    avviene
                  </em>
                </span>
                <span data-h1-line className="block overflow-hidden">
                  <em
                    className="inline-block"
                    style={{
                      fontStyle: "italic",
                      color:
                        "color-mix(in oklab, var(--bordeaux) 78%, var(--marrone))",
                    }}
                  >
                    a&nbsp;vista.
                  </em>
                </span>
              </h1>
              <p
                data-open-testo
                className="mt-6 md:mt-8 max-w-[36ch] text-[color:var(--marrone)]/90 text-[15px] md:text-[17px] leading-relaxed"
              >
                Prima di sedersi, si passa dal banco. Il taglio si sceglie
                guardando.
              </p>
            </div>

            {/* Timbro — sigillo in basso a sinistra, sulla pietra */}
            <div
              data-stamp
              className="inline-flex flex-col items-start px-4 py-2.5"
              style={{
                alignSelf: "flex-start",
                transform: "rotate(-2deg)",
                border: "1.5px solid var(--bordeaux)",
                borderRadius: "2px",
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--crema) 92%, transparent) 0%, color-mix(in oklab, var(--crema) 84%, transparent) 100%)",
                boxShadow:
                  "0 6px 22px rgba(26,18,16,0.28), inset 0 0 8px rgba(110,26,20,0.10)",
              }}
              aria-hidden
            >
              <span
                className="font-eyebrow text-[9px] tracking-[0.42em]"
                style={{ color: "var(--bordeaux)" }}
              >
                MASSERIA DON GIANVITO
              </span>
              <span
                className="mt-1 font-eyebrow text-[9px] tracking-[0.36em]"
                style={{
                  color: "color-mix(in oklab, var(--marrone) 88%, transparent)",
                }}
              >
                NOCI · DAL 2002
              </span>
            </div>
          </div>

          {/* SCRIM di handoff — pietra → carbone morbido: si accende con lo scrub */}
          <div
            data-hero-scrim
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, transparent 45%, rgba(26,18,16,0.55) 78%, #2a1e18 100%)",
            }}
          />

          {/* BANDA DI HANDOFF — la linea oro del banco continua verso il basso
              e introduce la parola GUARDA del Rito. Vive dentro il sticky, quindi
              nessun fondo crema è mai visibile tra le due sezioni. */}
          <div
            data-handoff
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 md:px-14 pb-8 md:pb-10"
          >
            <div className="mx-auto max-w-6xl">
              <div
                aria-hidden
                className="h-px w-full origin-left"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, color-mix(in oklab, var(--oro) 90%, transparent) 15%, color-mix(in oklab, var(--oro) 90%, transparent) 85%, transparent)",
                  boxShadow: "0 0 18px rgba(197,161,89,0.35)",
                }}
              />
              <div
                data-handoff-content
                className="mt-4 flex items-baseline justify-between gap-6"
              >
                <span
                  className="font-eyebrow text-[10px] md:text-[11px] tracking-[0.42em]"
                  style={{ color: "color-mix(in oklab, var(--crema) 78%, transparent)" }}
                >
                  IL RITO
                </span>
                <span
                  className="font-display italic text-[color:var(--crema)]"
                  style={{
                    fontSize: "clamp(1.2rem, 2.4vw, 2rem)",
                    fontWeight: 300,
                    letterSpacing: "-0.01em",
                  }}
                >
                  guarda&nbsp;·&nbsp;scegli&nbsp;·&nbsp;siedi
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ══════════════════════════ II · IL RITO ══════════════════════════ */}
      <section
        className="relative overflow-hidden py-24 md:py-40 px-6 md:px-14"
        aria-label="Guarda, scegli, siedi"
        style={{
          background:
            "linear-gradient(180deg, #2a1e18 0%, #3d2a1e 30%, #5a4230 65%, #8a6a4a 100%)",
          color: "var(--crema)",
        }}
      >
        <div className="relative max-w-6xl mx-auto">
          {/* Linea unica che attraversa i tre verbi */}
          <svg
            aria-hidden
            className="absolute inset-x-0 top-8 md:top-14 h-[85%] w-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 1000 600"
          >
            <path
              data-rito-line
              d="M 20 80 Q 250 60, 480 260 T 980 500"
              fill="none"
              stroke="var(--oro)"
              strokeWidth="1.4"
              opacity="0.75"
            />
          </svg>

          <div className="relative grid md:grid-cols-3 gap-16 md:gap-10">
            {[
              { verb: "GUARDA", txt: "La carne è esposta a vista.", accent: false, offset: 0 },
              { verb: "SCEGLI", txt: "Il taglio viene scelto al banco.", accent: true, offset: 6 },
              { verb: "SIEDI", txt: "La scelta continua nella cucina e arriva al tavolo.", accent: false, offset: 12 },
            ].map((v) => (
              <div
                key={v.verb}
                data-verb
                className="relative"
                style={{ marginTop: `${v.offset}rem` }}
              >
                {v.accent && (
                  <span
                    aria-hidden
                    className="absolute -left-5 top-4 h-2 w-2 rounded-full"
                    style={{
                      background: "var(--oro)",
                      boxShadow: "0 0 12px rgba(197,161,89,0.9)",
                    }}
                  />
                )}
                <div
                  className="font-display leading-none mb-4"
                  style={{
                    fontSize: "clamp(2.6rem, 5.5vw, 5rem)",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    color: "var(--crema)",
                  }}
                >
                  {v.verb}
                </div>
                <p
                  className="text-base md:text-lg italic max-w-xs leading-relaxed"
                  style={{ color: "color-mix(in oklab, var(--crema) 82%, transparent)" }}
                >
                  {v.txt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ III · IL TAGLIO ══════════════════════════ */}
      <section
        className="relative py-24 md:py-36 px-6 md:px-14 overflow-hidden"
        aria-label="Atlante a vista"
        style={{
          background:
            "linear-gradient(180deg, #8a6a4a 0%, #b39a72 25%, #d9c9a8 55%, #efe4c8 100%)",
          color: "var(--marrone)",
        }}
      >
        {/* Texture pietra / carta alimentare */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(2px 2px at 20% 30%, rgba(61,42,30,0.6) 0, transparent 60%), radial-gradient(1.5px 1.5px at 70% 60%, rgba(61,42,30,0.4) 0, transparent 60%), radial-gradient(2px 2px at 45% 85%, rgba(61,42,30,0.5) 0, transparent 60%)",
            backgroundSize: "180px 180px, 240px 240px, 300px 300px",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <h2
            data-bigword
            className="font-display text-[color:var(--marrone)] leading-[0.95] mb-6 max-w-4xl"
            style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)", fontWeight: 300 }}
          >
            <span className="block overflow-hidden"><span className="inline-block">Atlante</span></span>
            <span className="block overflow-hidden"><span className="inline-block">a vista.</span></span>
          </h2>
          <p className="text-[color:var(--marrone)]/85 text-lg max-w-2xl leading-relaxed mb-3">
            Il banco mostra tagli e preparazioni diverse. La disponibilità segue il lavoro e il momento.
          </p>
          <p className="text-[color:var(--marrone)]/60 text-sm italic max-w-2xl mb-14">
            Il diagramma è una rappresentazione narrativa e non costituisce il menu del giorno.
          </p>

          <Diagramma
            active={active}
            activate={activate}
            activeVoce={activeVoce}
            announce={announce}
          />
        </div>
      </section>

      {/* ══════════════════════════ III · IL FILO ══════════════════════════ */}
      <section
        className="relative py-24 md:py-32 px-6 md:px-14"
        aria-label="Il filo della tracciabilità"
        style={{
          background: "linear-gradient(180deg, #efe4c8 0%, #e0cfa6 100%)",
          color: "var(--marrone)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <h2
            data-bigword
            className="font-display text-[color:var(--marrone)] leading-[0.95] mb-6 max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300 }}
          >
            <span className="block overflow-hidden"><span className="inline-block">La scelta</span></span>
            <span className="block overflow-hidden"><span className="inline-block">non comincia dal banco.</span></span>
          </h2>
          <p className="text-[color:var(--marrone)]/85 text-lg max-w-2xl leading-relaxed mb-16 md:mb-20">
            Prima della Macelleria ci sono l&apos;allevamento, il lavoro agricolo e il tempo.
          </p>

          <div className="relative">
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 1000 160"
            >
              <path
                data-filo-line
                d="M 40 90 Q 300 30, 500 100 T 960 70"
                fill="none"
                stroke="var(--oro)"
                strokeWidth="1.4"
                opacity="0.9"
              />
              {[
                { cx: 60, cy: 88 },
                { cx: 500, cy: 100 },
                { cx: 940, cy: 74 },
              ].map((n, i) => (
                <circle key={i} cx={n.cx} cy={n.cy} r="3.5" fill="var(--oro)" opacity="0.95" />
              ))}
            </svg>
            <div className="relative grid grid-cols-3 items-center py-12 md:py-16">
              {FILO.map((word, i) => (
                <div
                  key={word}
                  className={i === 1 ? "text-center" : i === 2 ? "text-right" : ""}
                >
                  {word === "ALLEVAMENTO" ? (
                    <Link
                      to="/allevamento"
                      className="font-display leading-none inline-block transition-colors hover:text-[color:var(--bordeaux)]"
                      style={{
                        fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)",
                        fontWeight: 300,
                        color: "var(--marrone)",
                      }}
                    >
                      {word}
                    </Link>
                  ) : (
                    <div
                      className="font-display leading-none"
                      style={{
                        fontSize: "clamp(1.4rem, 2.8vw, 2.4rem)",
                        fontWeight: 300,
                        color: "var(--marrone)",
                      }}
                    >
                      {word}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ IV · IL TEMPO — FROLLATURA ══════════════════════════ */}
      <section
        data-frollatura
        className="relative py-24 md:py-36 px-6 md:px-14 overflow-hidden"
        aria-label="Il tempo prima del taglio"
        style={{
          background:
            "linear-gradient(180deg, #e0cfa6 0%, #6b4a34 35%, #3d2a1e 100%)",
          color: "var(--crema)",
        }}
      >
        {/* Luce laterale radente */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 100% at 12% 55%, rgba(255,230,180,0.22) 0%, transparent 60%)",
            mixBlendMode: "screen",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-10 items-end">
            <div className="md:col-span-6">
              <div
                className="font-eyebrow tracking-[0.42em] mb-2"
                style={{
                  fontSize: "clamp(0.9rem, 1.6vw, 1.2rem)",
                  fontWeight: 500,
                  color: "color-mix(in oklab, var(--crema) 85%, transparent)",
                }}
              >
                CIRCA
              </div>
              <div
                data-num15
                className="font-display leading-[0.8]"
                style={{
                  fontSize: "clamp(6rem, 15vw, 14rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.04em",
                  color: "var(--crema)",
                  textShadow: "0 6px 40px rgba(0,0,0,0.35)",
                }}
              >
                15
              </div>
              <div
                className="font-eyebrow tracking-[0.35em] mt-3"
                style={{
                  fontSize: "clamp(0.9rem, 1.6vw, 1.2rem)",
                  fontWeight: 500,
                  color: "color-mix(in oklab, var(--crema) 85%, transparent)",
                }}
              >
                GIORNI · INDICATIVO
              </div>
            </div>
            <div className="md:col-span-6">
              {/* 15 incisioni sulla superficie */}
              <div
                className="relative h-40 md:h-56 mb-8 flex items-end gap-[6px] md:gap-2 px-1"
                aria-hidden
              >
                {Array.from({ length: 15 }).map((_, i) => {
                  const h = 45 + ((i * 7) % 30);
                  const isLast = i === 14;
                  return (
                    <div
                      key={i}
                      data-segno
                      className="flex-1"
                      style={{
                        height: `${h}%`,
                        background: isLast
                          ? "linear-gradient(180deg, var(--oro) 0%, color-mix(in oklab, var(--oro) 60%, transparent) 100%)"
                          : "linear-gradient(180deg, color-mix(in oklab, var(--crema) 90%, transparent) 0%, color-mix(in oklab, var(--crema) 20%, transparent) 100%)",
                        width: isLast ? "3px" : undefined,
                        opacity: isLast ? 1 : 0.7,
                        boxShadow: isLast ? "0 0 14px rgba(197,161,89,0.7)" : "none",
                      }}
                    />
                  );
                })}
              </div>
              <p className="text-[color:var(--crema)]/85 text-base md:text-lg leading-relaxed">
                Il tempo lavora la materia. Ogni segno è un giorno di attesa.
              </p>
              <p className="text-[color:var(--crema)]/60 text-sm italic mt-3 leading-relaxed">
                Tempi e disponibilità possono variare in base al taglio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ IV · SALUMI PROPRI ══════════════════════════ */}
      <section
        className="relative py-24 md:py-40 px-6 md:px-14 overflow-hidden"
        aria-label="Salumi propri"
        style={{
          background: "linear-gradient(180deg, #3d2a1e 0%, #2a1e18 100%)",
          color: "var(--crema)",
        }}
      >
        {/* Luce di stagionatura, molto rada */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(50% 80% at 85% 20%, rgba(255,220,170,0.14) 0%, transparent 55%)",
            mixBlendMode: "screen",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <h2
            data-bigword
            className="font-display leading-[0.95] mb-6 max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300, color: "var(--crema)" }}
          >
            <span className="block overflow-hidden"><span className="inline-block">Il tempo</span></span>
            <span className="block overflow-hidden"><span className="inline-block">continua nelle forme.</span></span>
          </h2>
          <p className="text-[color:var(--crema)]/75 text-lg max-w-2xl leading-relaxed mb-20 md:mb-28">
            La Masseria produce salumi propri.
          </p>

          {/* Nomi editoriali: una parola per riga, linea verticale, ombra lunga */}
          <ul className="relative flex flex-col gap-10 md:gap-14 max-w-4xl">
            {SALUMI.map((nome, i) => (
              <li
                key={nome}
                data-salume
                className="relative flex items-baseline gap-6 md:gap-10"
              >
                <span
                  aria-hidden
                  className="font-eyebrow tracking-[0.3em] shrink-0 w-8 md:w-12"
                  style={{
                    color: "color-mix(in oklab, var(--crema) 45%, transparent)",
                    fontSize: "clamp(0.7rem, 1vw, 0.85rem)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  aria-hidden
                  className="h-px w-6 md:w-12 shrink-0"
                  style={{
                    background:
                      "linear-gradient(90deg, color-mix(in oklab, var(--crema) 45%, transparent), transparent)",
                    transform: "translateY(-0.6em)",
                  }}
                />
                <span
                  className="font-display leading-none"
                  style={{
                    fontSize: "clamp(1.6rem, 4.5vw, 3.6rem)",
                    fontWeight: 300,
                    color: "var(--crema)",
                    letterSpacing: "-0.01em",
                    textShadow: "0 12px 40px rgba(0,0,0,0.45)",
                    // ombra lunga tipografica
                    // eslint-disable-next-line
                  }}
                >
                  {nome}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════ IV · FARINA E FOCACCIA ══════════════════════════ */}
      <section
        className="relative py-24 md:py-36 px-6 md:px-14 overflow-hidden"
        aria-label="La farina della Masseria"
        style={{
          background:
            "linear-gradient(180deg, #2a1e18 0%, #6b4a34 15%, #d9c9a8 45%, #f4ecd8 100%)",
          color: "var(--marrone)",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url(${granoImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(1.15) saturate(0.55) sepia(0.2)",
            maskImage: "linear-gradient(180deg, transparent 0%, black 35%, black 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 35%, black 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(60% 60% at 50% 30%, rgba(255,240,210,0.35) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto">
          <h2
            data-bigword
            className="font-display text-[color:var(--marrone)] leading-[0.95] mb-8 max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300 }}
          >
            <span className="block overflow-hidden"><span className="inline-block">Accanto al banco,</span></span>
            <span className="block overflow-hidden"><span className="inline-block">la farina della Masseria.</span></span>
          </h2>
          <p className="text-[color:var(--marrone)]/85 text-lg md:text-xl max-w-3xl leading-relaxed mb-6">
            Il grano tenero coltivato nei terreni della Masseria diventa farina utilizzata anche per focaccia e frittelle.
          </p>
          <p className="text-[color:var(--marrone)]/65 text-sm md:text-base italic max-w-2xl leading-relaxed">
            La focaccia è stata segnalata nel fine settimana. La disponibilità va confermata direttamente.
          </p>

          {/* Un solo segno oro sulla superficie chiara */}
          <div className="relative mt-16 md:mt-20 flex justify-center">
            <svg viewBox="0 0 600 120" className="w-full max-w-3xl" aria-hidden>
              <path
                d="M 20 60 Q 200 20, 300 60 T 580 60"
                fill="none"
                stroke="var(--oro)"
                strokeWidth="1.3"
                opacity="0.75"
              />
              <circle cx="300" cy="60" r="3" fill="var(--oro)" opacity="0.9" />
            </svg>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ V · DOPO IL BANCO ══════════════════════════ */}
      <section
        className="relative py-28 md:py-40 px-6 md:px-14 overflow-hidden"
        aria-label="Dopo il banco"
        style={{
          background:
            "linear-gradient(180deg, #f4ecd8 0%, #d9c9a8 25%, #a5715a 60%, #6b3d2e 100%)",
          color: "var(--crema)",
        }}
      >
        {/* Linea oro attraversante */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <path
            d="M 8 12 Q 42 28, 55 55 T 92 90"
            fill="none"
            stroke="var(--oro)"
            strokeWidth="0.35"
            opacity="0.7"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative max-w-5xl mx-auto text-center">
          <h2
            data-bigword
            className="font-display leading-[0.95] mb-10"
            style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)", fontWeight: 300, color: "var(--crema)" }}
          >
            <span className="block overflow-hidden"><span className="inline-block">Hai scelto.</span></span>
            <span className="block overflow-hidden"><span className="inline-block">Ora siediti.</span></span>
          </h2>

          {/* Sequenza SCEGLI — SIEDI — COTTURA (terracotta locale) — TAVOLA */}
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 mb-14 font-eyebrow text-xs md:text-sm tracking-[0.32em]">
            {["SCEGLI", "SIEDI", "COTTURA", "TAVOLA"].map((w, i) => (
              <li key={w} className="flex items-center gap-4">
                <span
                  data-parola-cottura={w === "COTTURA" ? "" : undefined}
                  style={{
                    color: "color-mix(in oklab, var(--crema) 90%, transparent)",
                    fontWeight: w === "COTTURA" ? 600 : 400,
                  }}
                >
                  {w}
                </span>
                {i < 3 && (
                  <span aria-hidden style={{ color: "var(--oro)", opacity: 0.7 }}>—</span>
                )}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Link
              to="/agriturismo"
              className="group inline-flex items-center gap-3 px-8 py-4 min-h-[52px] font-eyebrow text-xs tracking-[0.35em] transition-all hover:gap-4 w-full sm:w-auto justify-center"
              style={{ background: "var(--crema)", color: "var(--marrone)" }}
            >
              ENTRA NELL’AGRITURISMO
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/caseificio"
              className="group inline-flex items-center gap-3 px-6 py-4 min-h-[52px] font-eyebrow text-xs tracking-[0.35em] border transition-all hover:bg-[color:var(--crema)]/10 w-full sm:w-auto justify-center"
              style={{
                borderColor: "color-mix(in oklab, var(--crema) 55%, transparent)",
                color: "var(--crema)",
              }}
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              TORNA AL CASEIFICIO
            </Link>
          </div>
        </div>
      </section>

      <NavAnime current="macelleria" />
    </div>
  );
}

/* ═══════════════════ Diagramma (accessibile, inciso nel banco) ═══════════════════ */

function Diagramma({
  active,
  activate,
  activeVoce,
  announce,
}: {
  active: Voce["id"];
  activate: (id: Voce["id"]) => void;
  activeVoce: Voce;
  announce: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  // Filo oro: si ridisegna una sola volta al cambio voce attiva
  useEffect(() => {
    if (!lineRef.current) return;
    const line = lineRef.current;
    const len = line.getTotalLength();
    line.style.strokeDasharray = String(len);
    line.style.strokeDashoffset = String(len);
    void line.getBoundingClientRect();
    line.style.transition = "stroke-dashoffset .9s cubic-bezier(.22,.61,.36,1)";
    line.style.strokeDashoffset = "0";
  }, [active]);

  // Path del filo dal nodo attivo verso il pannello (dx)
  const filoPath =
    activeVoce.side === "prep"
      ? `M ${activeVoce.x} ${activeVoce.y} C 380 ${activeVoce.y}, 395 ${activeVoce.y}, 400 ${activeVoce.y}`
      : activeVoce.side === "beyond"
      ? `M 250 ${activeVoce.y} Q 340 ${activeVoce.y - 10}, 400 ${activeVoce.y + 8}`
      : `M ${activeVoce.x} ${activeVoce.y} L 400 ${activeVoce.y}`;

  return (
    <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
      {/* SILHOUETTE incisa nella superficie */}
      <div className="md:col-span-7 relative">
        <div
          className="relative p-4 md:p-8"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--crema) 55%, transparent) 0%, color-mix(in oklab, var(--crema) 30%, transparent) 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.4), 0 20px 60px rgba(61,42,30,0.15)",
          }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 400 260"
            className="w-full h-auto"
            role="img"
            aria-label="Silhouette editoriale di un bovino con piano laterale delle preparazioni"
          >
            {/* Silhouette bovina — tratto sottile, riempimento quasi invisibile */}
            <g
              stroke="color-mix(in oklab, var(--marrone) 80%, transparent)"
              strokeWidth="1"
              fill="color-mix(in oklab, var(--crema) 20%, transparent)"
              strokeLinejoin="round"
              strokeLinecap="round"
            >
              <path d="M 60 150
                       Q 55 100, 90 90
                       L 110 80
                       Q 130 65, 155 72
                       Q 175 66, 195 80
                       L 265 82
                       Q 300 82, 315 100
                       L 325 130
                       L 315 160
                       L 305 165
                       L 300 200
                       L 285 205
                       L 285 175
                       L 210 175
                       L 210 205
                       L 195 205
                       L 195 175
                       L 130 175
                       L 130 205
                       L 115 205
                       L 115 172
                       Q 78 175, 68 165 Z" />
              <circle cx="102" cy="100" r="1.6" fill="var(--marrone)" stroke="none" />
              <path d="M 92 82 L 88 70 L 96 78 Z" fill="var(--marrone)" opacity="0.5" />
              <path d="M 325 130 Q 340 130, 340 155 Q 340 170, 335 175" fill="none" />
            </g>

            {/* Piano laterale — PREPARAZIONI DEL BANCO */}
            <g>
              <line
                x1="335"
                y1="50"
                x2="335"
                y2="180"
                stroke="color-mix(in oklab, var(--marrone) 45%, transparent)"
                strokeWidth="0.6"
                strokeDasharray="2 3"
              />
              <text
                x="345"
                y="42"
                fill="color-mix(in oklab, var(--marrone) 75%, transparent)"
                style={{ font: "600 7px sans-serif", letterSpacing: "0.22em" }}
              >
                PREPARAZIONI
              </text>
              <text
                x="345"
                y="52"
                fill="color-mix(in oklab, var(--marrone) 55%, transparent)"
                style={{ font: "7px sans-serif", letterSpacing: "0.22em" }}
              >
                DEL BANCO
              </text>
            </g>

            {/* Filo oro dal nodo attivo verso il pannello */}
            <path
              ref={lineRef}
              d={filoPath}
              stroke="var(--oro)"
              strokeWidth="1.4"
              fill="none"
              opacity="0.9"
            />

            {/* Nodi */}
            {VOCI.map((v) => {
              const isActive = v.id === active;
              const isCut = v.side === "cut";
              return (
                <g key={v.id}>
                  {/* touch target 44×44 invisibile */}
                  <rect
                    x={v.x - 22}
                    y={v.y - 22}
                    width="44"
                    height="44"
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onClick={() => activate(v.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isActive}
                    aria-label={`${v.label} — ${v.cat.toLowerCase()}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        activate(v.id);
                      }
                    }}
                  />
                  {/* punto: stato inattivo crema/marrone, attivo terracotta + anello oro */}
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r={isActive ? 6 : 3.5}
                    fill={
                      isActive
                        ? "#c96f4a"
                        : "color-mix(in oklab, var(--crema) 85%, transparent)"
                    }
                    stroke={
                      isActive
                        ? "var(--oro)"
                        : "color-mix(in oklab, var(--marrone) 55%, transparent)"
                    }
                    strokeWidth={isActive ? 1.4 : 1}
                    style={{
                      transition: "r .3s, fill .3s, stroke .3s",
                      opacity: isActive ? 1 : 0.75,
                    }}
                  />
                  {isActive && (
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r="11"
                      fill="none"
                      stroke="var(--oro)"
                      strokeWidth="0.8"
                      opacity="0.75"
                    />
                  )}
                  {isCut && !isActive && (
                    <text
                      x={v.x + 8}
                      y={v.y + 3}
                      fill="color-mix(in oklab, var(--marrone) 50%, transparent)"
                      style={{ font: "6.5px sans-serif", letterSpacing: "0.15em" }}
                    >
                      {v.label.split(" ")[0].toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* PANNELLO INFO — annuncio solo dopo attivazione intenzionale */}
      <div className="md:col-span-5">
        <div
          className="relative p-6 md:p-8"
          style={{
            background: "color-mix(in oklab, var(--crema) 88%, transparent)",
            borderLeft: "2px solid var(--oro)",
            boxShadow: "0 12px 40px rgba(61,42,30,0.12)",
          }}
        >
          <div
            className="font-eyebrow text-[10px] tracking-[0.35em] mb-3"
            style={{
              color:
                activeVoce.side === "cut"
                  ? "var(--bordeaux)"
                  : activeVoce.side === "prep"
                  ? "var(--oliva)"
                  : "color-mix(in oklab, var(--marrone) 70%, transparent)",
            }}
          >
            {activeVoce.cat}
          </div>
          <h3
            className="font-display text-3xl md:text-4xl text-[color:var(--marrone)] leading-tight mb-4"
            style={{ fontWeight: 300 }}
          >
            {activeVoce.titolo}
          </h3>
          <p className="text-[color:var(--marrone)]/85 text-base md:text-lg leading-relaxed mb-4">
            {activeVoce.testo}
          </p>
          {activeVoce.nota && (
            <p
              className="text-[color:var(--marrone)]/65 text-sm italic pl-3"
              style={{ borderLeft: "1px solid var(--oro)" }}
            >
              {activeVoce.nota}
            </p>
          )}
        </div>

        {/* aria-live: parla solo dopo click / Enter / Space */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announce}
        </div>

        {/* Legenda tappabile */}
        <ul className="mt-6 grid grid-cols-2 md:grid-cols-1 gap-2">
          {VOCI.map((v) => {
            const isActive = v.id === active;
            return (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => activate(v.id)}
                  aria-pressed={isActive}
                  className="w-full text-left flex items-center gap-3 px-3 py-3 min-h-[44px] transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    background: isActive
                      ? "color-mix(in oklab, var(--marrone) 10%, transparent)"
                      : "transparent",
                    borderBottom: "1px solid color-mix(in oklab, var(--marrone) 18%, transparent)",
                  }}
                >
                  <span
                    aria-hidden
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{
                      background: isActive
                        ? "#c96f4a"
                        : "color-mix(in oklab, var(--marrone) 35%, transparent)",
                      boxShadow: isActive ? "0 0 8px rgba(201,111,74,0.6)" : "none",
                    }}
                  />
                  <span className="font-eyebrow text-[11px] tracking-[0.22em] text-[color:var(--marrone)]/85">
                    {v.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────── Nav Anime ─────────────────── */
function NavAnime({
  current,
}: {
  current: "allevamento" | "caseificio" | "macelleria" | "agriturismo";
}) {
  const items = [
    { key: "allevamento", n: "01", nome: "ALLEVAMENTO", sub: "La terra e gli animali", to: "/allevamento" as const },
    { key: "caseificio", n: "02", nome: "CASEIFICIO", sub: "Il bianco prende forma", to: "/caseificio" as const },
    { key: "macelleria", n: "03", nome: "MACELLERIA", sub: "Pagina corrente", to: "/macelleria" as const },
    { key: "agriturismo", n: "04", nome: "AGRITURISMO", sub: "La cucina e l’ospitalità", to: "/agriturismo" as const },
  ];

  return (
    <nav
      aria-label="Le quattro anime della Masseria"
      className="relative px-6 md:px-14 py-20 md:py-28"
      style={{ background: "var(--crema)", color: "var(--marrone)" }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-4xl md:text-5xl leading-tight mb-10 md:mb-14"
          style={{ fontWeight: 300 }}
        >
          Continua nella Masseria
        </h2>
        <ul className="divide-y divide-[color:var(--marrone)]/20 border-y border-[color:var(--marrone)]/20">
          {items.map((it) => {
            const isCurrent = it.key === current;
            const content = (
              <div className="flex items-center gap-4 md:gap-8 py-5 md:py-6 group">
                <span className="font-eyebrow text-xs md:text-sm opacity-60 tracking-[0.2em] w-10">
                  {it.n}
                </span>
                <span
                  className="font-display text-2xl md:text-4xl flex-shrink-0"
                  style={{ fontWeight: 300 }}
                >
                  {it.nome}
                </span>
                <span className="hidden md:block flex-1 h-px bg-[color:var(--marrone)]/25 group-hover:bg-[color:var(--marrone)]/50 transition-colors" />
                <span className="text-sm md:text-base italic opacity-70 flex-1 md:flex-none">
                  {it.sub}
                </span>
                {!isCurrent && (
                  <span className="font-eyebrow text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                )}
              </div>
            );
            return (
              <li key={it.key}>
                {isCurrent ? (
                  <div className="opacity-50 px-2" aria-current="page">
                    {content}
                  </div>
                ) : (
                  <Link
                    to={it.to}
                    className="block hover:bg-[color:var(--marrone)]/5 transition-colors px-2"
                  >
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
