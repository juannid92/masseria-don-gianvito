import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import aerialAsset from "@/assets/masseria-aerial.asset.json";
import terraImg from "@/assets/allev-a-terra.jpg";
import panoramaImg from "@/assets/allev-panorama.jpg";
import granoImg from "@/assets/allev-c-grano.jpg";
import bridgeLatteImg from "@/assets/allev-bridge-latte.jpg";
import pBovino from "@/assets/allev-p-bovino.jpg";
import pOvino from "@/assets/allev-p-ovino.jpg";
import pSuino from "@/assets/allev-p-suino.jpg";
import pEquino from "@/assets/allev-p-equino.jpg";
import pAvicolo from "@/assets/allev-p-avicolo.jpg";

/* ─────────────────────────────────────────────────────────────
 * /allevamento — LA DISCESA
 * Cielo → Orizzonte → Terra → Mandria → Colture → Latte
 * ───────────────────────────────────────────────────────────── */

type Specie = {
  id: string;
  nome: string;
  tag: string;
  sub: string;
  micro: string;
  img: string | null;
};

const SPECIES: Specie[] = [
  { id: "bovini", nome: "Bovini", tag: "BOVINI", sub: "LATTE · CARNE", micro: "Incrocio Pezzata Rossa × Frisona.", img: pBovino },
  { id: "ovini", nome: "Ovini", tag: "OVINI", sub: "ALLEVAMENTO", micro: "Fra terra bassa e pietre.", img: pOvino },
  { id: "suini", nome: "Suini", tag: "SUINI", sub: "ALLEVAMENTO", micro: "Nel lavoro della macelleria.", img: pSuino },
  { id: "equini", nome: "Equini", tag: "EQUINI", sub: "PRESENZA AGRICOLA", micro: "Presenza quotidiana in Masseria.", img: pEquino },
  { id: "avicoli", nome: "Avicoli", tag: "AVICOLI", sub: "ALLEVAMENTO", micro: "Alla luce dell'aia.", img: pAvicolo },
];

const COLTURE = [
  { word: "FORAGGIO", note: "Per gli animali della Masseria." },
  { word: "ORTAGGI", note: "Per la tavola quotidiana." },
  { word: "FRUTTA", note: "Nei terreni intorno agli edifici." },
  { word: "GRANO TENERO", note: "La farina va anche in focaccia e frittelle." },
];

/* ─────────────────────────────────────────────────────────── */

export function AllevamentoStory() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [quota, setQuota] = useState(120);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    let mounted = true;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ═══ ACT 1 · LA DISCESA ═══ */
      const act1 = root.querySelector<HTMLElement>("[data-act='1']");
      const aerial = root.querySelector<HTMLElement>("[data-aerial]");
      const terra = root.querySelector<HTMLElement>("[data-terra]");
      const horizonTitle = root.querySelector<HTMLElement>("[data-horizon-title]");

      if (act1 && aerial && terra) {
        gsap.set(terra, { autoAlpha: 0, scale: 1.14, filter: "blur(8px)" });
        gsap.set(aerial, { autoAlpha: 1, scale: 1.0, filter: "blur(0px)" });

        ScrollTrigger.create({
          trigger: act1,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          pin: false,
          onUpdate: (self) => {
            if (!mounted) return;
            const p = self.progress;
            gsap.set(aerial, {
              autoAlpha: 1 - Math.min(1, p * 1.5),
              scale: 1 + p * 0.10,
              y: -p * 40,
              filter: `blur(${p * 3}px)`,
            });
            gsap.set(terra, {
              autoAlpha: Math.max(0, (p - 0.30) * 1.8),
              scale: 1.14 - p * 0.10,
              filter: `blur(${Math.max(0, 8 - p * 12)}px)`,
            });
            setQuota(Math.max(0, Math.round(120 * (1 - p))));
          },
        });

        if (horizonTitle) {
          gsap.fromTo(
            horizonTitle,
            { clipPath: "inset(0 100% 0 0)", y: 20 },
            {
              clipPath: "inset(0 0% 0 0)",
              y: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: act1, start: "55% top", end: "bottom top", scrub: 0.6 },
            },
          );
        }
      }

      /* ═══ ACT 2 · IL PRINCIPIO — parole grandi ═══ */
      const bigWords = root.querySelectorAll<HTMLElement>("[data-bigword]");
      bigWords.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 60, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            autoAlpha: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          },
        );
      });

      /* ═══ ACT 3 · LA MANDRIA — carrellata orizzontale (desktop) ═══ */
      mm.add("(min-width: 900px)", () => {
        const act3 = root.querySelector<HTMLElement>("[data-act='3']");
        const track = root.querySelector<HTMLElement>("[data-mandria-track]");
        if (!act3 || !track) return;

        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tw = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: act3,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        root.querySelectorAll<HTMLElement>("[data-scene]").forEach((el, i) => {
          gsap.fromTo(
            el.querySelector("[data-scene-txt]"),
            { y: 30, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                containerAnimation: tw,
                start: "left 70%",
                once: true,
              },
            },
          );
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

      /* ═══ ACT 5 · SPOTLIGHT COLTURE ═══ */
      const act5 = root.querySelector<HTMLElement>("[data-act='5']");
      const spot = root.querySelector<HTMLElement>("[data-spot]");
      if (act5 && spot) {
        const items = spot.querySelectorAll<HTMLElement>("[data-coltura]");
        gsap.set(items, { autoAlpha: 0.15 });

        ScrollTrigger.create({
          trigger: act5,
          start: "top top",
          end: "+=" + items.length * 400,
          pin: spot,
          pinSpacing: true,
          scrub: 0.55,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const active = Math.min(items.length - 1, Math.floor(self.progress * items.length));
            items.forEach((it, i) => {
              const dist = Math.abs(i - active);
              gsap.set(it, {
                autoAlpha: dist === 0 ? 1 : dist === 1 ? 0.4 : 0.15,
                scale: dist === 0 ? 1 : 0.95,
              });
            });
          },
        });
      }

      /* ═══ Refresh dopo font ═══ */
      const doRefresh = () => { if (mounted) ScrollTrigger.refresh(); };
      if (document.fonts?.ready) {
        document.fonts.ready.then(doRefresh).catch(() => {});
      }
      setTimeout(doRefresh, 200);
    }, root);

    return () => {
      mounted = false;
      ctx.revert();
    };
  }, [reduced]);

  return (
    <div ref={rootRef} className="relative w-full text-[color:var(--crema)]" style={{ background: "var(--marrone)" }}>

      {/* ══════════ ACT 1 · LA DISCESA ══════════ */}
      <section data-act="1" className="relative h-[220vh]" aria-label="La Discesa">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          <div
            data-aerial
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${aerialAsset.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center 40%",
            }}
            role="img"
            aria-label="Veduta aerea dell'area agricola di Masseria Don Gianvito nelle campagne di Noci"
          />
          <div
            data-terra
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${terraImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center 60%",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(26,18,16,0.25) 0%, rgba(26,18,16,0.05) 50%, rgba(61,42,30,0.55) 100%)",
            }}
          />
          {/* Rail sx */}
          <div className="absolute left-4 md:left-8 top-0 h-full flex items-center pointer-events-none z-10" aria-hidden>
            <div
              className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--crema)]/75"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.3em" }}
            >
              ALLEVAMENTO — MASSERIA DON GIANVITO · QUOTA {String(quota).padStart(3, "0")}m
            </div>
          </div>
          {/* Linea orizzonte */}
          <div
            className="absolute inset-x-0 top-[60%] h-px opacity-60 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, var(--oro), transparent)" }}
            aria-hidden
          />
          {/* Titolo sull'orizzonte */}
          <div className="absolute inset-x-0 top-[42%] flex flex-col items-center pointer-events-none px-6 text-center">
            <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--crema)]/70 tracking-[0.35em] mb-4">
              ALLEVAMENTO — MASSERIA DON GIANVITO
            </div>
            <h1
              data-horizon-title
              className="font-display text-[color:var(--crema)] leading-[0.9]"
              style={{
                fontSize: "clamp(2.4rem, 8vw, 6.5rem)",
                fontWeight: 300,
                textShadow: "0 2px 30px rgba(26,18,16,0.6)",
              }}
            >
              Dove il cielo<br/>tocca la terra.
            </h1>
          </div>
          {/* Indicatore */}
          <div className="absolute inset-x-0 bottom-8 md:bottom-10 flex justify-center pointer-events-none">
            <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--crema)]/70 tracking-[0.4em]">
              SCENDI A TERRA ↓
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ACT 2 · IL PRINCIPIO ══════════ */}
      <section
        data-act="2"
        className="relative py-24 md:py-40 px-6 md:px-14 overflow-hidden"
        aria-label="Il principio"
        style={{
          background:
            "linear-gradient(180deg, var(--marrone) 0%, color-mix(in oklab, var(--marrone) 70%, var(--oliva)) 100%)",
        }}
      >
        {/* Solchi decorativi */}
        <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.12] pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 25 Q 50 20, 100 30" stroke="var(--oro)" strokeWidth="0.15" fill="none" vectorEffect="non-scaling-stroke"/>
          <path d="M0 55 Q 50 60, 100 50" stroke="var(--oro)" strokeWidth="0.15" fill="none" vectorEffect="non-scaling-stroke"/>
          <path d="M0 82 Q 50 78, 100 85" stroke="var(--oro)" strokeWidth="0.15" fill="none" vectorEffect="non-scaling-stroke"/>
        </svg>

        <div className="relative max-w-6xl mx-auto">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--oro)]/85 tracking-[0.35em] mb-8">
            01 — IL PRINCIPIO
          </div>
          <h2
            data-bigword
            className="font-display text-[color:var(--crema)] leading-[0.95] mb-10 md:mb-14"
            style={{ fontSize: "clamp(2rem, 6vw, 5rem)", fontWeight: 300 }}
          >
            Prima degli animali,<br/>c'è ciò che li circonda.
          </h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-4xl">
            <p data-bigword className="text-[color:var(--crema)]/90 text-lg md:text-xl leading-relaxed">
              Terra, coltivazioni e lavoro agricolo formano il primo livello della Masseria.
            </p>
            <p data-bigword className="text-[color:var(--crema)]/65 text-base md:text-lg italic leading-relaxed">
              L'allevamento non è un'immagine separata dal resto: continua nel caseificio, nella macelleria e nella cucina.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ ACT 3 · LA MANDRIA ══════════ */}
      <section
        data-act="3"
        className="relative"
        aria-label="La Mandria"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--marrone) 40%, var(--oliva)) 0%, var(--oliva) 100%)",
        }}
      >
        {/* Desktop: carrellata orizzontale */}
        <div className="hidden md:block relative h-[100dvh] overflow-hidden">
          {/* Panorama continuo di sfondo */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${panoramaImg})`,
              backgroundSize: "auto 100%",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
              opacity: 0.35,
              filter: "sepia(0.15) saturate(0.85)",
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(61,42,30,0.55) 0%, rgba(61,42,30,0.2) 40%, rgba(61,42,30,0.7) 100%)",
            }}
            aria-hidden
          />

          {/* Header pin */}
          <div className="absolute top-8 left-8 z-20 flex flex-col gap-2">
            <div className="font-eyebrow text-[11px] text-[color:var(--crema)]/60 tracking-[0.3em]">
              LA MANDRIA · CARRELLATA
            </div>
            <div className="font-display text-[color:var(--crema)]/90 text-2xl" style={{ fontWeight: 300 }}>
              Cinque presenze diverse
            </div>
          </div>
          <div data-counter className="absolute bottom-8 right-8 z-20 font-eyebrow text-[13px] text-[color:var(--crema)]/70 tracking-[0.2em]">
            01 / 0{SPECIES.length}
          </div>
          {/* Linea di terreno */}
          <div
            className="absolute bottom-[15%] inset-x-0 h-px z-10 pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, var(--oro)/40, transparent)", opacity: 0.4 }}
            aria-hidden
          />

          <div
            data-mandria-track
            className="absolute top-0 left-0 h-full flex items-end gap-12 pl-[8vw] pr-[20vw] pb-[10vh] will-change-transform"
            style={{ width: "max-content" }}
          >
            {SPECIES.map((s, i) => (
              <SceneCard key={s.id} s={s} idx={i} />
            ))}
          </div>
        </div>

        {/* Mobile: sequenza verticale alternata */}
        <div className="md:hidden px-5 py-16 space-y-14">
          <div className="font-eyebrow text-[10px] text-[color:var(--crema)]/60 tracking-[0.3em]">
            LA MANDRIA — CINQUE PRESENZE
          </div>
          {SPECIES.map((s, i) => (
            <article
              key={s.id}
              className={`relative ${i % 2 === 0 ? "pr-6 text-left" : "pl-6 text-right ml-auto"}`}
              style={{ maxWidth: "92%" }}
            >
              {s.img && (
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm mb-4 shadow-xl">
                  <img
                    src={s.img}
                    alt={`${s.nome} — Masseria Don Gianvito`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                    style={{ filter: "saturate(0.85) contrast(1.05)" }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(26,18,16,0.7) 100%)" }} />
                  <TagBadge tag={s.tag} sub={s.sub} className={i % 2 === 0 ? "left-3 top-3" : "right-3 top-3"} />
                </div>
              )}
              <h3 className="font-display text-[color:var(--crema)] text-3xl leading-tight mb-2" style={{ fontWeight: 300 }}>
                {s.nome}
              </h3>
              <p className="text-[color:var(--crema)]/75 text-sm italic">{s.micro}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ══════════ ACT 4 · BOVINI — LATTE / CARNE ══════════ */}
      <section
        className="relative py-24 md:py-36 px-6 md:px-14 overflow-hidden"
        aria-label="Bovini · latte e carne"
        style={{
          background:
            "linear-gradient(180deg, var(--oliva) 0%, color-mix(in oklab, var(--marrone) 70%, var(--oliva)) 100%)",
        }}
      >
        <div className="relative max-w-6xl mx-auto">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--oro)]/85 tracking-[0.35em] mb-6">
            02 — I BOVINI
          </div>
          <h2
            data-bigword
            className="font-display text-[color:var(--crema)] leading-[0.95] mb-10 md:mb-16 max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300 }}
          >
            Due direzioni<br/>nello stesso allevamento.
          </h2>

          <p className="text-[color:var(--crema)]/85 text-lg md:text-xl max-w-3xl leading-relaxed mb-14 md:mb-20">
            I bovini sono un <span className="text-[color:var(--oro)]">incrocio tra Pezzata Rossa e Frisona</span> e contribuiscono
            alla produzione di latte e carne.
          </p>

          {/* Composizione divisa da una linea centrale */}
          <div className="relative grid grid-cols-2 gap-0 min-h-[280px] md:min-h-[380px] items-stretch">
            {/* Linea centrale */}
            <div
              className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-10"
              style={{ background: "linear-gradient(180deg, transparent, var(--oro), transparent)" }}
              aria-hidden
            />
            {/* Lato LATTE */}
            <div
              className="relative flex flex-col items-end justify-center pr-6 md:pr-14 py-10"
              style={{
                background: "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--crema) 30%, transparent) 100%)",
              }}
            >
              <div className="font-eyebrow text-[10px] text-[color:var(--crema)]/60 tracking-[0.35em] mb-3">→ CASEIFICIO</div>
              <div
                className="font-display leading-none text-right"
                style={{ fontSize: "clamp(3rem, 10vw, 8rem)", fontWeight: 300, color: "var(--crema)" }}
              >
                LATTE
              </div>
              <p className="mt-4 text-[color:var(--crema)]/75 text-sm md:text-base text-right max-w-xs italic">
                Ogni mattina prende la via del caseificio.
              </p>
            </div>
            {/* Lato CARNE */}
            <div
              className="relative flex flex-col items-start justify-center pl-6 md:pl-14 py-10"
              style={{
                background: "linear-gradient(270deg, transparent 0%, color-mix(in oklab, var(--bordeaux) 40%, transparent) 100%)",
              }}
            >
              <div className="font-eyebrow text-[10px] text-[color:var(--crema)]/60 tracking-[0.35em] mb-3">→ MACELLERIA</div>
              <div
                className="font-display leading-none"
                style={{ fontSize: "clamp(3rem, 10vw, 8rem)", fontWeight: 300, color: "var(--crema)" }}
              >
                CARNE
              </div>
              <p className="mt-4 text-[color:var(--crema)]/75 text-sm md:text-base max-w-xs italic">
                Passa al banco della macelleria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ACT 5 · LE COLTURE — SPOTLIGHT ══════════ */}
      <section
        data-act="5"
        className="relative"
        aria-label="Le Colture"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--marrone) 70%, var(--oliva)) 0%, #2a1c14 100%)",
        }}
      >
        {/* Desktop: pin spotlight */}
        <div className="hidden md:block h-[100dvh]">
          <div data-spot className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center px-6">
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: `url(${granoImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "sepia(0.3) saturate(0.7)",
              }}
              aria-hidden
            />
            {/* Solchi */}
            <svg aria-hidden className="absolute inset-0 h-full w-full opacity-[0.15] pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0 30 Q 50 25, 100 35" stroke="var(--oro)" strokeWidth="0.2" fill="none" vectorEffect="non-scaling-stroke"/>
              <path d="M0 65 Q 50 70, 100 60" stroke="var(--oro)" strokeWidth="0.2" fill="none" vectorEffect="non-scaling-stroke"/>
            </svg>

            <div className="relative z-10 font-eyebrow text-[10px] md:text-[11px] text-[color:var(--oro)]/85 tracking-[0.35em] mb-8">
              03 — CIÒ CHE COLTIVIAMO
            </div>
            <h2
              className="relative z-10 font-display text-[color:var(--crema)] text-center leading-[0.95] mb-10"
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 300 }}
            >
              La terra continua<br/>nel lavoro quotidiano.
            </h2>

            <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
              {COLTURE.map((c, i) => (
                <div key={c.word} data-coltura className="flex flex-col items-center transition-all duration-300 will-change-transform">
                  <div
                    className="font-display text-[color:var(--crema)] leading-none tracking-wide"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3.6rem)", fontWeight: 300 }}
                  >
                    {c.word}
                  </div>
                  <div className="mt-2 text-[color:var(--crema)]/70 text-sm md:text-base italic">
                    {c.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: verticale */}
        <div className="md:hidden px-5 py-20 space-y-10">
          <div className="font-eyebrow text-[10px] text-[color:var(--oro)]/85 tracking-[0.35em]">
            03 — CIÒ CHE COLTIVIAMO
          </div>
          <h2 className="font-display text-[color:var(--crema)] text-3xl leading-tight" style={{ fontWeight: 300 }}>
            La terra continua<br/>nel lavoro quotidiano.
          </h2>
          <div className="space-y-8">
            {COLTURE.map((c) => (
              <div key={c.word} data-bigword className="border-t border-[color:var(--oro)]/25 pt-4">
                <div className="font-display text-[color:var(--crema)] text-3xl leading-none" style={{ fontWeight: 300 }}>
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

      {/* ══════════ ACT 6 · PONTE VERSO IL CASEIFICIO ══════════ */}
      <section
        className="relative py-28 md:py-40 px-6 md:px-14 overflow-hidden"
        aria-label="Ponte verso il Caseificio"
        style={{
          background:
            "linear-gradient(180deg, #2a1c14 0%, color-mix(in oklab, var(--marrone) 50%, var(--crema)) 60%, var(--crema) 100%)",
        }}
      >
        {/* Immagine ponte, morbida */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `url(${bridgeLatteImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(1.1) blur(1px)",
            maskImage: "linear-gradient(180deg, transparent 0%, black 40%, black 70%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 40%, black 70%, transparent 100%)",
          }}
          aria-hidden
        />
        {/* Linea crema che si allarga */}
        <svg aria-hidden className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M 50 0 L 50 100" stroke="var(--crema)" strokeWidth="0.3" opacity="0.6" vectorEffect="non-scaling-stroke"/>
        </svg>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/80 tracking-[0.35em] mb-6">
            04 — IL PASSAGGIO
          </div>
          <h2
            data-bigword
            className="font-display text-[color:var(--marrone)] leading-[0.95] mb-8"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300 }}
          >
            Ogni mattina,<br/>il latte cambia luogo.
          </h2>
          <p className="text-[color:var(--marrone)]/85 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Dall'allevamento il latte passa al caseificio, dove comincia una nuova trasformazione.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Link
              to="/caseificio"
              className="group inline-flex items-center gap-3 px-8 py-4 min-h-[52px] font-eyebrow text-xs tracking-[0.35em] transition-all"
              style={{ background: "var(--marrone)", color: "var(--crema)" }}
            >
              ENTRA NEL CASEIFICIO
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/macelleria"
              className="group inline-flex items-center gap-3 px-6 py-4 min-h-[52px] font-eyebrow text-xs tracking-[0.35em] border transition-all hover:bg-[color:var(--marrone)]/5"
              style={{ borderColor: "color-mix(in oklab, var(--marrone) 60%, transparent)", color: "var(--marrone)" }}
            >
              SCOPRI LA MACELLERIA
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ NAV · LE QUATTRO ANIME ══════════ */}
      <NavAnime />
    </div>
  );
}

/* ─────────────────── Scene Card (desktop track) ─────────────────── */
function SceneCard({ s, idx }: { s: Specie; idx: number }) {
  return (
    <article
      data-scene
      className="relative shrink-0 h-[70vh] w-[50vw] max-w-[560px] flex items-end"
    >
      {s.img ? (
        <div className="relative w-full h-full overflow-hidden rounded-sm shadow-2xl">
          <img
            src={s.img}
            alt={`${s.nome} — Masseria Don Gianvito`}
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover"
            style={{ filter: "saturate(0.85) contrast(1.05)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(26,18,16,0) 45%, rgba(26,18,16,0.85) 100%)" }}
          />
          <TagBadge tag={s.tag} sub={s.sub} className="left-4 top-4" />
          <div data-scene-txt className="absolute bottom-0 left-0 right-0 p-6">
            <div className="font-eyebrow text-[10px] text-[color:var(--oro)]/90 tracking-[0.3em] mb-2">
              0{idx + 1} / 0{SPECIES.length}
            </div>
            <h3
              className="font-display text-[color:var(--crema)] leading-[1.02] mb-2"
              style={{ fontSize: "clamp(1.8rem, 2.6vw, 2.6rem)", fontWeight: 300 }}
            >
              {s.nome}
            </h3>
            <p className="text-[color:var(--crema)]/80 text-sm md:text-base italic max-w-sm">{s.micro}</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full border border-[color:var(--oro)]/25 flex flex-col items-center justify-center p-8">
          <TagBadge tag={s.tag} sub={s.sub} className="left-4 top-4" />
          <div className="font-display text-[color:var(--crema)] text-5xl" style={{ fontWeight: 300 }}>
            {s.nome}
          </div>
          <p className="mt-4 text-[color:var(--crema)]/60 text-sm text-center italic">{s.micro}</p>
        </div>
      )}
    </article>
  );
}

/* ─────────────────── Targhetta editoriale ─────────────────── */
function TagBadge({ tag, sub, className = "" }: { tag: string; sub: string; className?: string }) {
  return (
    <div
      className={`absolute ${className} inline-flex flex-col items-start px-3 py-2 rounded-sm shadow-md z-10`}
      style={{
        background: "var(--crema)",
        color: "var(--carbone, #1a1210)",
        borderLeft: "3px solid var(--oliva)",
      }}
      aria-label={`${tag} — ${sub}`}
    >
      <span className="font-eyebrow text-[10px] tracking-[0.28em] leading-none">{tag}</span>
      <span className="mt-1 font-eyebrow text-[9px] tracking-[0.22em] leading-none opacity-70">{sub}</span>
    </div>
  );
}

/* ─────────────────── Nav Anime ─────────────────── */
function NavAnime() {
  const items = [
    { key: "allevamento", n: "01", nome: "ALLEVAMENTO", sub: "Pagina corrente", to: null },
    { key: "caseificio", n: "02", nome: "CASEIFICIO", sub: "Il bianco prende forma", to: "/caseificio" },
    { key: "macelleria", n: "03", nome: "MACELLERIA", sub: "La scelta avviene a vista", to: "/macelleria" },
    { key: "braceria", n: "04", nome: "BRACERIA", sub: "La sera prende posto", to: "/braceria" },
  ] as const;

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
            const content = (
              <div className="flex items-center gap-4 md:gap-8 py-5 md:py-6 group">
                <span className="font-eyebrow text-xs md:text-sm opacity-60 tracking-[0.2em] w-10">{it.n}</span>
                <span className="font-display text-2xl md:text-4xl flex-shrink-0" style={{ fontWeight: 300 }}>
                  {it.nome}
                </span>
                <span className="hidden md:block flex-1 h-px bg-[color:var(--marrone)]/25 group-hover:bg-[color:var(--marrone)]/50 transition-colors" />
                <span className="text-sm md:text-base italic opacity-70 flex-1 md:flex-none">{it.sub}</span>
                {it.to && (
                  <span className="font-eyebrow text-lg transition-transform group-hover:translate-x-1">→</span>
                )}
              </div>
            );
            return (
              <li key={it.key}>
                {it.to ? (
                  <Link to={it.to} className="block hover:bg-[color:var(--marrone)]/5 transition-colors px-2">
                    {content}
                  </Link>
                ) : (
                  <div className="opacity-50 px-2" aria-current="page">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
