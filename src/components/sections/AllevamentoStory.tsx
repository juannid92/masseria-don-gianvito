import { useLayoutEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import aerialAsset from "@/assets/masseria-aerial.asset.json";
import terraImg from "@/assets/allev-a-terra.jpg";
import panoramaImg from "@/assets/allev-panorama.jpg";
import granoImg from "@/assets/allev-c-grano.jpg";
import bridgeLatteImg from "@/assets/allev-bridge-latte.jpg";
// NOTE INTERNA — Le fotografie animali sono materiali editoriali temporanei.
// Sostituire con fotografie autentiche della Masseria prima della pubblicazione.
import pBovino from "@/assets/allev-p-bovino.jpg";
import pOvino from "@/assets/allev-p-ovino.jpg";
import pSuino from "@/assets/allev-p-suino.jpg";
import pEquino from "@/assets/allev-p-equino.jpg";
import pAvicolo from "@/assets/allev-p-avicolo.jpg";

/* ─────────────────────────────────────────────────────────────
 * /allevamento — Un unico film sul paesaggio agricolo
 *   I.   LA DISCESA        cielo → orizzonte → terra
 *   II.  LA MANDRIA        carrellata continua, cinque presenze
 *   III. CIÒ CHE NUTRE     colture come parole nella terra
 *   IV.  IL BIANCO         la materia si schiarisce → Caseificio
 * ───────────────────────────────────────────────────────────── */

type Specie = {
  id: string;
  nome: string;
  linea: string;      // riga narrativa unica
  img: string;
  focus: "wide" | "low" | "side" | "close";
};

const SPECIES: Specie[] = [
  { id: "bovini",  nome: "Bovini",  linea: "Pezzata Rossa × Frisona · latte e carne", img: pBovino,  focus: "wide" },
  { id: "ovini",   nome: "Ovini",   linea: "Fra terra bassa e pietre.",               img: pOvino,   focus: "wide" },
  { id: "suini",   nome: "Suini",   linea: "Nel lavoro della macelleria.",            img: pSuino,   focus: "low"  },
  { id: "equini",  nome: "Equini",  linea: "Presenza quotidiana in Masseria.",        img: pEquino,  focus: "side" },
  { id: "avicoli", nome: "Avicoli", linea: "Alla luce dell'aia.",                     img: pAvicolo, focus: "close"},
];

const COLTURE = [
  { word: "FORAGGIO",     note: "Per gli animali della Masseria." },
  { word: "ORTAGGI",      note: "Per la tavola quotidiana." },
  { word: "FRUTTA",       note: "Nei terreni intorno agli edifici." },
  { word: "GRANO TENERO", note: "La farina va anche in focaccia e frittelle." },
];

/* ─────────────────────────────────────────────────────────── */

export function AllevamentoStory() {
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

      /* ═══ I · LA DISCESA ═══ */
      const act1   = root.querySelector<HTMLElement>("[data-act='discesa']");
      const aerial = root.querySelector<HTMLElement>("[data-aerial]");
      const terra  = root.querySelector<HTMLElement>("[data-terra]");
      const grain  = root.querySelector<HTMLElement>("[data-grain]");
      const title  = root.querySelector<HTMLElement>("[data-horizon-title]");
      const eye    = root.querySelector<HTMLElement>("[data-horizon-eye]");
      const line   = root.querySelector<HTMLElement>("[data-horizon-line]");

      if (act1 && aerial && terra) {
        gsap.set(aerial, { autoAlpha: 1, scale: 1, y: 0, filter: "blur(0px)" });
        gsap.set(terra,  { autoAlpha: 0, scale: 1.18, filter: "blur(10px)" });
        gsap.set(grain,  { autoAlpha: 0 });

        ScrollTrigger.create({
          trigger: act1,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => {
            if (!mounted) return;
            const p = self.progress;
            // camera avanza, l'orizzonte scende
            gsap.set(aerial, {
              autoAlpha: 1 - Math.min(1, Math.max(0, (p - 0.25) * 1.7)),
              scale: 1 + p * 0.14,
              y: -p * 60,
              filter: `blur(${p * 3}px)`,
            });
            gsap.set(terra, {
              autoAlpha: Math.max(0, (p - 0.35) * 2.0),
              scale: 1.18 - p * 0.14,
              y: 20 - p * 20,
              filter: `blur(${Math.max(0, 10 - p * 14)}px)`,
            });
            gsap.set(grain, { autoAlpha: Math.min(0.55, p * 0.9) });
          },
        });

        if (title && eye && line) {
          // Mobile/tablet: titolo sempre visibile a rest, la scrub esiste solo da 900px in su.
          mm.add("(max-width: 899px)", () => {
            gsap.set(title, { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0% 0)" });
            gsap.set(line, { autoAlpha: 0.55, scaleX: 1 });
          });
          mm.add("(min-width: 900px)", () => {
            // il titolo emerge dalla terra, l'occhiello si dissolve
            gsap.fromTo(
              title,
              { y: 70, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
              {
                y: 0, autoAlpha: 1, clipPath: "inset(0 0 0% 0)",
                ease: "power3.out",
                scrollTrigger: { trigger: act1, start: "top top", end: "55% top", scrub: 0.7 },
              },
            );
            gsap.to(eye, {
              autoAlpha: 0, y: -20,
              scrollTrigger: { trigger: act1, start: "top top", end: "25% top", scrub: 0.5 },
            });
            gsap.fromTo(
              line,
              { scaleX: 0.15, autoAlpha: 0 },
              {
                scaleX: 1, autoAlpha: 0.55,
                scrollTrigger: { trigger: act1, start: "10% top", end: "60% top", scrub: 0.6 },
              },
            );
          });
        }
      }

      /* ═══ Transizione materiale cielo → mandria ═══ */
      const bridge = root.querySelector<HTMLElement>("[data-earth-bridge]");
      if (bridge) {
        gsap.fromTo(
          bridge,
          { scaleY: 0.2, transformOrigin: "50% 100%" },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: bridge, start: "top bottom", end: "bottom center", scrub: 0.5 },
          },
        );
      }

      /* ═══ II · LA MANDRIA — carrellata continua (desktop) ═══ */
      mm.add("(min-width: 900px)", () => {
        const act2 = root.querySelector<HTMLElement>("[data-act='mandria']");
        const track = root.querySelector<HTMLElement>("[data-mandria-track]");
        const bg = root.querySelector<HTMLElement>("[data-mandria-bg]");
        const fg = root.querySelector<HTMLElement>("[data-mandria-fg]");
        if (!act2 || !track) return;

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tw = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: act2,
            start: "top top",
            end: () => `+=${distance() * 1.15}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        // Parallax orizzonte + primo piano (fondo lento, primo piano ~1.12x)
        if (bg) {
          gsap.to(bg, {
            xPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: act2, start: "top top",
              end: () => `+=${distance() * 1.15}`, scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });
        }
        if (fg) {
          gsap.to(fg, {
            xPercent: -14,
            ease: "none",
            scrollTrigger: {
              trigger: act2, start: "top top",
              end: () => `+=${distance() * 1.15}`, scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });
        }

        // reveal per scena (nome grande, linea, targhetta)
        root.querySelectorAll<HTMLElement>("[data-scene]").forEach((el) => {
          const nome = el.querySelector<HTMLElement>("[data-scene-name]");
          const meta = el.querySelector<HTMLElement>("[data-scene-meta]");
          if (nome) {
            gsap.fromTo(nome,
              { y: 60, autoAlpha: 0 },
              {
                y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out",
                scrollTrigger: { trigger: el, containerAnimation: tw, start: "left 75%", once: true },
              });
          }
          if (meta) {
            gsap.fromTo(meta,
              { y: 20, autoAlpha: 0 },
              {
                y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out", delay: 0.1,
                scrollTrigger: { trigger: el, containerAnimation: tw, start: "left 60%", once: true },
              });
          }
        });
      });

      /* ═══ III · SPOTLIGHT COLTURE (desktop) ═══ */
      mm.add("(min-width: 900px)", () => {
        const act3 = root.querySelector<HTMLElement>("[data-act='colture']");
        const spot = root.querySelector<HTMLElement>("[data-spot]");
        const beam = root.querySelector<HTMLElement>("[data-spot-beam]");
        if (!act3 || !spot) return;
        const items = spot.querySelectorAll<HTMLElement>("[data-coltura]");
        gsap.set(items, { autoAlpha: 0.18 });

        ScrollTrigger.create({
          trigger: act3,
          start: "top top",
          end: "+=" + items.length * 480,
          pin: spot,
          pinSpacing: true,
          scrub: 0.55,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!mounted) return;
            const active = Math.min(items.length - 1, Math.floor(self.progress * items.length));
            items.forEach((it, i) => {
              const d = Math.abs(i - active);
              gsap.set(it, {
                autoAlpha: d === 0 ? 1 : d === 1 ? 0.35 : 0.14,
              });
              const note = it.querySelector<HTMLElement>("[data-coltura-note]");
              if (note) gsap.set(note, { autoAlpha: d === 0 ? 1 : 0 });
            });
            if (beam) {
              // fascio di luce che scorre lentamente verso il basso
              const y = 8 + self.progress * 76;
              gsap.set(beam, { top: `${y}%` });
            }
          },
        });
      });

      /* ═══ IV · IL BIANCO — chiusura scrubbata ═══ */
      const bianco = root.querySelector<HTMLElement>("[data-act='bianco']");
      const biancoBg = root.querySelector<HTMLElement>("[data-bianco-bg]");
      const biancoStripe = root.querySelector<HTMLElement>("[data-bianco-stripe]");
      if (bianco && biancoBg && biancoStripe) {
        gsap.fromTo(
          biancoBg,
          { filter: "saturate(1) brightness(1)", background: "var(--marrone)" },
          {
            filter: "saturate(0.15) brightness(1.12)",
            background: "var(--crema)",
            ease: "none",
            scrollTrigger: { trigger: bianco, start: "top bottom", end: "60% center", scrub: 0.7 },
          },
        );
        gsap.fromTo(
          biancoStripe,
          { scaleX: 0.05, autoAlpha: 0.4, transformOrigin: "50% 50%" },
          {
            scaleX: 1, autoAlpha: 1,
            scrollTrigger: { trigger: bianco, start: "top bottom", end: "70% center", scrub: 0.7 },
          },
        );
      }

      /* refresh dopo font */
      const doRefresh = () => { if (mounted) ScrollTrigger.refresh(); };
      if (document.fonts?.ready) document.fonts.ready.then(doRefresh).catch(() => {});
      setTimeout(doRefresh, 220);
    }, root);

    return () => {
      mounted = false;
      ctx.revert();
    };
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="relative w-full text-[color:var(--crema)]"
      style={{ background: "var(--marrone)" }}
    >
      {/* ══════════════════════════ I · LA DISCESA ══════════════════════════ */}
      <section
        data-act="discesa"
        className="relative h-[240vh]"
        aria-label="Dove il cielo tocca la terra"
      >
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          {/* Cielo (aerea) */}
          <div
            data-aerial
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${aerialAsset.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center 42%",
            }}
            role="img"
            aria-label="Veduta aerea di Masseria Don Gianvito nelle campagne di Noci"
          />
          {/* Terra (avvicinamento) */}
          <div
            data-terra
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${terraImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center 62%",
            }}
            aria-hidden
          />
          {/* Grana progressiva */}
          <div
            data-grain
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.04) 0, transparent 40%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.15) 0, transparent 45%)",
            }}
            aria-hidden
          />
          {/* Vignettatura */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(26,18,16,0.55) 100%), linear-gradient(180deg, rgba(26,18,16,0.15) 0%, transparent 45%, rgba(26,18,16,0.55) 100%)",
            }}
            aria-hidden
          />

          {/* Occhiello discreto (in alto, non compete con Navbar) */}
          <div
            data-horizon-eye
            className="absolute inset-x-0 top-[var(--page-header-safe-offset)] flex justify-center pointer-events-none"
          >
            <div className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--crema)]/60">
              ALLEVAMENTO
            </div>
          </div>

          {/* Linea d'orizzonte */}
          <div
            data-horizon-line
            className="absolute inset-x-[6vw] top-[52%] md:top-[58%] h-px pointer-events-none origin-center"
            style={{ background: "linear-gradient(90deg, transparent, var(--oro), transparent)" }}
            aria-hidden
          />

          {/* Titolo che emerge dalla terra — mobile spinto più in alto per rientrare nel primo viewport */}
          <div className="absolute inset-x-0 top-[38%] md:top-[60%] flex justify-center pointer-events-none px-6">
            <h1
              data-horizon-title
              className="font-display text-[color:var(--crema)] text-center leading-[0.9]"
              style={{
                fontSize: "clamp(2.4rem, 9vw, 7.2rem)",
                fontWeight: 300,
                letterSpacing: "-0.01em",
                maxWidth: "22ch",
              }}
              aria-label="Dove il cielo tocca la terra."
            >
              <span>Dove il cielo</span>
              <span aria-hidden="true"> </span>
              <span className="block">tocca la terra.</span>
            </h1>
          </div>

          {/* Sotto-testo minimo, quasi al bordo inferiore */}
          <div className="absolute inset-x-0 bottom-[8%] md:bottom-[10%] flex justify-center pointer-events-none px-6">
            <p
              className="text-[color:var(--crema)]/80 text-base md:text-lg italic text-center max-w-md"
              style={{ letterSpacing: "0.005em" }}
            >
              L'allevamento comincia qui, nelle campagne di Noci.
            </p>
          </div>
        </div>
      </section>



      {/* ═══════════ Raccordo materiale: la terra si espande ═══════════ */}
      <div
        data-earth-bridge
        aria-hidden
        className="relative h-[22vh] md:h-[26vh] w-full origin-bottom will-change-transform overflow-hidden"
        style={{
          background: "linear-gradient(180deg, transparent 0%, var(--marrone) 40%, color-mix(in oklab, var(--marrone) 60%, var(--oliva)) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${terraImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            maskImage: "linear-gradient(180deg, black 0%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(180deg, black 0%, transparent 90%)",
          }}
        />
      </div>

      {/* ══════════════════════════ II · LA MANDRIA ══════════════════════════ */}
      <section
        data-act="mandria"
        className="relative"
        aria-label="La Mandria — cinque presenze del paesaggio agricolo"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--marrone) 55%, var(--oliva)) 0%, var(--oliva) 55%, color-mix(in oklab, var(--oliva) 70%, var(--marrone)) 100%)",
        }}
      >
        {/* Desktop — carrellata cinematografica continua */}
        <div className="hidden md:block relative h-[100dvh] overflow-hidden">
          {/* Fondo: panorama unico che scorre lento */}
          <div
            data-mandria-bg
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${panoramaImg})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
              opacity: 0.32,
              filter: "sepia(0.18) saturate(0.8)",
              width: "130%",
              left: "-15%",
            }}
            aria-hidden
          />
          {/* Cielo/oscuramento superiore, terra scura in basso */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(26,18,16,0.45) 0%, rgba(26,18,16,0.05) 30%, rgba(26,18,16,0.15) 65%, rgba(26,18,16,0.75) 100%)",
            }}
            aria-hidden
          />

          {/* Linea di terreno continua */}
          <div
            className="absolute inset-x-0 bottom-[18%] h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--oro) 60%, transparent), transparent)", opacity: 0.5 }}
            aria-hidden
          />

          {/* Primo piano (recinzione/erba stilizzata) */}
          <svg
            data-mandria-fg
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[18%] w-[130%] -left-[15%] will-change-transform pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 1000 100"
          >
            <path
              d="M0 60 Q 100 55 200 60 T 400 62 T 600 58 T 800 60 T 1000 62 L 1000 100 L 0 100 Z"
              fill="rgba(26,18,16,0.85)"
            />
          </svg>

          {/* Track continuo */}
          <div
            data-mandria-track
            className="absolute top-0 left-0 h-full flex items-end gap-[10vw] pl-[10vw] pr-[22vw] pb-[22vh] will-change-transform"
            style={{ width: "max-content" }}
          >
            {SPECIES.map((s, i) => (
              <SceneShot key={s.id} s={s} idx={i} />
            ))}
          </div>
        </div>

        {/* Mobile — montaggio verticale continuo */}
        <div className="md:hidden relative">
          {SPECIES.map((s, i) => (
            <SceneMobile key={s.id} s={s} idx={i} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════ Focus BOVINI ══════════════════════════ */}
      <section
        className="relative py-28 md:py-40 px-6 md:px-14 overflow-hidden"
        aria-label="Bovini · Pezzata Rossa × Frisona, latte e carne"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--oliva) 60%, var(--marrone)) 0%, var(--marrone) 100%)",
        }}
      >
        <div className="relative max-w-6xl mx-auto">
          <h2
            className="font-display text-[color:var(--crema)] leading-[0.92] mb-10 md:mb-14 max-w-4xl"
            style={{ fontSize: "clamp(2.2rem, 6vw, 5.2rem)", fontWeight: 300, letterSpacing: "-0.01em" }}
          >
            Un incrocio<br/>tra Pezzata Rossa<br/>e&nbsp;Frisona.
          </h2>

          {/* Diagramma linea che si apre da un punto centrale */}
          <div className="relative grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-10 items-center min-h-[220px] md:min-h-[320px]">
            {/* LATTE (crema) */}
            <div className="flex flex-col items-end text-right">
              <div
                className="font-display leading-none"
                style={{
                  fontSize: "clamp(2.6rem, 8vw, 6rem)",
                  fontWeight: 300,
                  color: "var(--crema)",
                  letterSpacing: "-0.01em",
                }}
              >
                LATTE
              </div>
              <p className="mt-3 text-[color:var(--crema)]/70 text-sm md:text-base italic max-w-[22ch]">
                Ogni mattina prende la via del caseificio.
              </p>
            </div>

            {/* Nodo con linea a Y */}
            <svg aria-hidden viewBox="0 0 80 200" className="h-40 md:h-64 w-16 md:w-20" preserveAspectRatio="none">
              <path
                d="M40 0 L40 90 L4 200 M40 90 L76 200"
                stroke="var(--oro)"
                strokeWidth="0.6"
                fill="none"
                vectorEffect="non-scaling-stroke"
                opacity="0.85"
              />
              <circle cx="40" cy="90" r="3" fill="var(--oro)" />
            </svg>

            {/* CARNE (bordeaux) */}
            <div className="flex flex-col items-start text-left">
              <div
                className="font-display leading-none"
                style={{
                  fontSize: "clamp(2.6rem, 8vw, 6rem)",
                  fontWeight: 300,
                  color: "var(--bordeaux, #6b1f2a)",
                  letterSpacing: "-0.01em",
                }}
              >
                CARNE
              </div>
              <p className="mt-3 text-[color:var(--crema)]/70 text-sm md:text-base italic max-w-[22ch]">
                Passa al banco della macelleria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ III · CIÒ CHE NUTRE ══════════════════════════ */}
      <section
        data-act="colture"
        className="relative"
        aria-label="Ciò che nutre — foraggio, ortaggi, frutta, grano tenero"
        style={{
          background:
            "linear-gradient(180deg, var(--marrone) 0%, #2a1c14 100%)",
        }}
      >
        {/* Desktop — spotlight naturale */}
        <div className="hidden md:block h-[100dvh]">
          <div
            data-spot
            className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center px-6"
          >
            {/* Terra dall'alto */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url(${granoImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "sepia(0.35) saturate(0.7) brightness(0.9)",
              }}
              aria-hidden
            />
            {/* Fascio di luce morbido che si muove */}
            <div
              data-spot-beam
              className="absolute inset-x-0 pointer-events-none"
              style={{
                top: "8%",
                height: "36%",
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(245,232,204,0.18) 40%, rgba(245,232,204,0.28) 50%, rgba(245,232,204,0.18) 60%, transparent 100%)",
                mixBlendMode: "screen",
              }}
              aria-hidden
            />

            <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6">
              <h2 className="sr-only">Ciò che nutre</h2>
              {COLTURE.map((c) => (
                <div
                  key={c.word}
                  data-coltura
                  className="flex flex-col items-center will-change-[opacity]"
                >
                  <div
                    className="font-display text-[color:var(--crema)] leading-none text-center"
                    style={{
                      fontSize: "clamp(2.4rem, 5.4vw, 4.6rem)",
                      fontWeight: 300,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {c.word}
                  </div>
                  <div
                    data-coltura-note
                    className="mt-2 text-[color:var(--crema)]/75 text-sm md:text-base italic text-center"
                  >
                    {c.note}
                  </div>
                </div>
              ))}
            </div>

            <p className="absolute bottom-8 inset-x-0 text-center text-[color:var(--crema)]/50 text-xs md:text-sm italic px-6">
              Foraggio, ortaggi, frutta e grano tenero crescono nei terreni della Masseria.
            </p>
          </div>
        </div>

        {/* Mobile — verticale essenziale */}
        <div className="md:hidden px-5 py-24 space-y-12">
          <h2
            className="font-display text-[color:var(--crema)] leading-[0.95]"
            style={{ fontSize: "clamp(2rem, 8vw, 2.8rem)", fontWeight: 300 }}
          >
            Prima degli animali,<br/>c'è ciò che li circonda.
          </h2>
          <div className="space-y-9">
            {COLTURE.map((c) => (
              <div key={c.word}>
                <div
                  className="font-display text-[color:var(--crema)] leading-none"
                  style={{ fontSize: "clamp(2rem, 10vw, 3rem)", fontWeight: 300, letterSpacing: "0.02em" }}
                >
                  {c.word}
                </div>
                <div className="mt-2 text-[color:var(--crema)]/70 text-sm italic">{c.note}</div>
              </div>
            ))}
          </div>
          <p className="text-[color:var(--crema)]/60 text-sm italic pt-4">
            La farina ottenuta dal grano viene utilizzata anche per focaccia e frittelle.
          </p>
        </div>
      </section>

      {/* ══════════════════════════ IV · IL BIANCO ══════════════════════════ */}
      <section
        data-act="bianco"
        className="relative py-32 md:py-48 px-6 md:px-14 overflow-hidden"
        aria-label="Il bianco — verso il Caseificio"
      >
        {/* Fondo che si schiarisce */}
        <div
          data-bianco-bg
          aria-hidden
          className="absolute inset-0 will-change-[filter,background]"
          style={{ background: "var(--marrone)" }}
        />
        {/* Texture latte come velatura tenue */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `url(${bridgeLatteImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(1.2) saturate(0.4)",
            mixBlendMode: "screen",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />
        {/* Striscia crema che si allarga */}
        <div
          data-bianco-stripe
          aria-hidden
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] pointer-events-none origin-center"
          style={{ background: "linear-gradient(90deg, transparent, var(--crema), transparent)" }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <h2
            className="font-display leading-[0.92] mb-8"
            style={{
              fontSize: "clamp(2.2rem, 6vw, 5rem)",
              fontWeight: 300,
              color: "var(--marrone)",
              letterSpacing: "-0.01em",
            }}
          >
            Ogni mattina,<br/>il latte cambia luogo.
          </h2>
          <p
            className="text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
            style={{ color: "color-mix(in oklab, var(--marrone) 82%, transparent)" }}
          >
            Dall'allevamento il latte passa al Caseificio e comincia una nuova trasformazione.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Link
              to="/caseificio"
              className="group inline-flex items-center gap-3 px-9 py-4 min-h-[52px] font-eyebrow text-xs tracking-[0.35em] transition-all hover:gap-4"
              style={{ background: "var(--marrone)", color: "var(--crema)" }}
            >
              ENTRA NEL CASEIFICIO
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/macelleria"
              className="group inline-flex items-center gap-3 px-6 py-4 min-h-[52px] font-eyebrow text-xs tracking-[0.35em] border transition-colors hover:bg-[color:var(--marrone)]/5"
              style={{ borderColor: "color-mix(in oklab, var(--marrone) 55%, transparent)", color: "var(--marrone)" }}
            >
              SCOPRI LA MACELLERIA
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─────────────── Scena Mandria — desktop ─────────────── */
function SceneShot({ s, idx }: { s: Specie; idx: number }) {
  // ogni specie ha un'inquadratura e altezza diverse
  // (composizione della "camera" senza cambiare layout)
  const shot = {
    wide:  { h: "78vh", w: "60vw", pos: "center 45%", scale: "1.00" },
    low:   { h: "70vh", w: "54vw", pos: "center 62%", scale: "1.08" },
    side:  { h: "76vh", w: "62vw", pos: "70% 50%",    scale: "1.02" },
    close: { h: "66vh", w: "48vw", pos: "center 55%", scale: "1.12" },
  }[s.focus];

  return (
    <article
      data-scene
      className="relative shrink-0 flex items-end"
      style={{ height: shot.h, width: shot.w, maxWidth: "760px" }}
      aria-label={`${s.nome} — ${s.linea}`}
    >
      {/* fotografia in mask morbida (integrata nel paesaggio) */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={s.img}
          alt=""
          loading={idx === 0 ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
          style={{
            objectPosition: shot.pos,
            transform: `scale(${shot.scale})`,
            filter: "saturate(0.75) contrast(1.05) brightness(0.92)",
            maskImage:
              "linear-gradient(180deg, transparent 0%, black 18%, black 78%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0%, black 18%, black 78%, transparent 100%)",
          }}
        />
      </div>

      {/* nome grande, integrato nel paesaggio */}
      <div className="relative z-10 w-full pl-2 pr-6 pb-2">
        <div
          data-scene-meta
          className="font-eyebrow text-[10px] tracking-[0.35em] text-[color:var(--oro)]/85 mb-3"
        >
          0{idx + 1} — {s.nome.toUpperCase()}
        </div>
        <h3
          data-scene-name
          className="font-display text-[color:var(--crema)] leading-[0.88] mb-3"
          style={{
            fontSize: "clamp(2.6rem, 5.5vw, 5.4rem)",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            textShadow: "0 2px 24px rgba(26,18,16,0.55)",
          }}
        >
          {s.nome}
        </h3>
        <p
          data-scene-meta
          className="text-[color:var(--crema)]/85 text-sm md:text-base italic max-w-[38ch]"
        >
          {s.linea}
        </p>
      </div>
    </article>
  );
}

/* ─────────────── Scena Mandria — mobile ─────────────── */
function SceneMobile({ s, idx }: { s: Specie; idx: number }) {
  return (
    <article
      className="relative min-h-[92dvh] flex flex-col justify-end px-5 pb-14 pt-24"
      aria-label={`${s.nome} — ${s.linea}`}
    >
      {/* fondo fotografico full-bleed morbido */}
      <div className="absolute inset-0 overflow-hidden -z-0">
        <img
          src={s.img}
          alt=""
          loading={idx === 0 ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
          style={{
            filter: "saturate(0.75) contrast(1.05) brightness(0.9)",
            maskImage: "linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 20%, black 80%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(26,18,16,0.5) 0%, transparent 40%, rgba(26,18,16,0.7) 100%)" }}
        />
      </div>

      <div className="relative z-10">
        <div className="font-eyebrow text-[10px] tracking-[0.35em] text-[color:var(--oro)]/85 mb-3">
          0{idx + 1} — {s.nome.toUpperCase()}
        </div>
        <h3
          className="font-display text-[color:var(--crema)] leading-[0.9] mb-3"
          style={{
            fontSize: "clamp(2.6rem, 12vw, 4rem)",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            textShadow: "0 2px 20px rgba(26,18,16,0.55)",
          }}
        >
          {s.nome}
        </h3>
        <p className="text-[color:var(--crema)]/85 text-base italic max-w-[34ch]">
          {s.linea}
        </p>
      </div>
    </article>
  );
}
