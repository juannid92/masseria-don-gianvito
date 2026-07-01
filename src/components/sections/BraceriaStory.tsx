import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import embersImg from "@/assets/brace-embers.jpg";
import handsImg from "@/assets/brace-hands.jpg";
import cotturaImg from "@/assets/brace-cottura.jpg";
import salaImg from "@/assets/brace-sala.jpg";
import aerialAsset from "@/assets/masseria-aerial.asset.json";

/* ─────────────────────── DATA ─────────────────────── */

const FILIERA = [
  { label: "Allevamento", to: "/allevamento" as const, active: false },
  { label: "Caseificio", to: "/caseificio" as const, active: false },
  { label: "Macelleria", to: "/macelleria" as const, active: false },
  { label: "Braceria", to: "/braceria" as const, active: true },
];

type CookStep = {
  id: string;
  img: string;
  title: string;
  caption: string;
  note: string;
};

const COOKING: CookStep[] = [
  {
    id: "arrivo",
    img: cotturaImg,
    title: "arriva il taglio",
    caption: "fiorentina · dalla N° 047 · appena posata sulla brace",
    note: "sale grosso, niente altro. il fuoco fa il resto.",
  },
  {
    id: "scottatura",
    img: cotturaImg,
    title: "la crosta",
    caption: "brace a 400° · 4 minuti per lato · le righe si scavano",
    note: "il grasso cola, sfrigola, torna su come fumo.",
  },
  {
    id: "riposo",
    img: handsImg,
    title: "tre dita di crosta",
    caption: "riposo di 3 minuti · il centro respira",
    note: "il taglio adesso è pronto. si porta caldo, subito.",
  },
];

type MenuItem = {
  name: string;
  desc: string;
  price?: string;
};
type MenuCat = {
  id: string;
  label: string;
  intro: string;
  items: MenuItem[];
};

const MENU: MenuCat[] = [
  {
    id: "brace",
    label: "Dalla Brace",
    intro: "carne nostra, cotta a vista sulla brace di quercia",
    items: [
      { name: "Fiorentina di podolica", desc: "1,2 kg · frollatura 30 gg · N° 047", price: "8 € / hg" },
      { name: "Costata", desc: "800 g · brace forte · 3 min lato", price: "7 € / hg" },
      { name: "Tagliata al sale grosso", desc: "600 g · rosmarino della masseria", price: "38" },
      { name: "Bombette di Noci", desc: "8 pz · capocollo + caciocavallo", price: "14" },
      { name: "Gnumeredde alla brace", desc: "6 pz · fegatini, alloro, spago", price: "12" },
      { name: "Salsiccia a punta di coltello", desc: "500 g · suino nero, macinata a mano", price: "16" },
      { name: "Spiedini misti della masseria", desc: "carne del giorno, alloro, pane", price: "18" },
    ],
  },
  {
    id: "caseificio",
    label: "Dal Caseificio",
    intro: "latte munto la mattina, in tavola la sera",
    items: [
      { name: "Burrata del mattino", desc: "cuore filato, panna fresca" },
      { name: "Mozzarella a mano", desc: "tirata al momento, calda" },
      { name: "Caciocavallo impiccato", desc: "sciolto sulla brace, su pane" },
      { name: "Ricotta forte con capocollo", desc: "cucchiaio, pane cotto a legna" },
    ],
  },
  {
    id: "orto",
    label: "Dall'Orto",
    intro: "verdure di stagione, sulla stessa brace",
    items: [
      { name: "Cicorielle di campo", desc: "olio della masseria, peperoncino" },
      { name: "Melanzane alla brace", desc: "menta, aglio, sale" },
      { name: "Peperoni cornetti", desc: "arrostiti, ammollicati" },
      { name: "Pane cotto a legna", desc: "grano nostro, lievito madre" },
    ],
  },
];

/* ─────────────────────── COMPONENT ─────────────────────── */

export function BraceriaStory() {
  const reduced = useReducedMotion();

  const rootRef = useRef<HTMLDivElement>(null);

  // Intro
  const introRef = useRef<HTMLDivElement>(null);
  const emberBedRef = useRef<HTMLDivElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [tempC, setTempC] = useState(380);

  // Sez A · luce
  const lightRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const lightRevealsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Sez B · cottura
  const cookRef = useRef<HTMLDivElement>(null);
  const [cookIdx, setCookIdx] = useState(0);
  const cookImgRef = useRef<HTMLDivElement>(null);
  const grillMarksRef = useRef<SVGGElement>(null);

  // Menù
  const menuRef = useRef<HTMLDivElement>(null);

  // Chiusura · aerial
  const closeRef = useRef<HTMLDivElement>(null);
  const aerialRef = useRef<HTMLDivElement>(null);
  const goldPathRef = useRef<SVGPathElement>(null);
  const finalPhraseRef = useRef<HTMLDivElement>(null);

  /* ─── GSAP orchestration ─── */
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // intro: brace respira
      if (!reduced && emberBedRef.current) {
        gsap.to(emberBedRef.current, {
          filter: "brightness(1.25) saturate(1.15)",
          duration: 2.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // titolo emerge dal fumo
      if (titleRef.current && introRef.current) {
        gsap.set(titleRef.current, { autoAlpha: 0, filter: "blur(28px)", y: 40 });
        ScrollTrigger.create({
          trigger: introRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(titleRef.current, {
              autoAlpha: Math.min(1, p * 2.2),
              filter: `blur(${Math.max(0, 28 - p * 34)}px)`,
              y: 40 - p * 40,
            });
            gsap.set(smokeRef.current, { y: -p * 180, opacity: 0.55 + p * 0.2 });
            setTempC(Math.round(380 + p * 40));
          },
        });
      }

      // sez A · spotlight scrub
      if (spotRef.current && lightRef.current) {
        ScrollTrigger.create({
          trigger: lightRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress; // 0..1
            const y = 20 + p * 60; // % verticale
            gsap.set(spotRef.current, { top: `${y}%` });
            lightRevealsRef.current.forEach((el, i) => {
              if (!el) return;
              const target = 20 + (i * 60) / Math.max(1, lightRevealsRef.current.length - 1);
              const dist = Math.abs(y - target);
              const near = gsap.utils.clamp(0, 1, 1 - dist / 22);
              gsap.set(el, { opacity: near, filter: `blur(${(1 - near) * 10}px)` });
            });
          },
        });
      }

      // sez B · cottura pinned
      if (cookRef.current && cookImgRef.current) {
        const media = gsap.matchMedia();
        media.add("(min-width: 768px)", () => {
          const st = ScrollTrigger.create({
            trigger: cookRef.current,
            start: "top top",
            end: "+=" + window.innerHeight * COOKING.length,
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => {
              const idx = Math.min(
                COOKING.length - 1,
                Math.floor(self.progress * COOKING.length),
              );
              setCookIdx(idx);
              const stepP = self.progress * COOKING.length - idx;
              // cottura: crudo→scottato: saturazione + contrasto + calore
              gsap.set(cookImgRef.current, {
                filter: `saturate(${0.6 + self.progress * 0.9}) contrast(${0.9 + self.progress * 0.4}) hue-rotate(${-self.progress * 12}deg) brightness(${0.9 + self.progress * 0.2})`,
              });
              // grill marks scale-x
              if (grillMarksRef.current) {
                gsap.set(grillMarksRef.current, {
                  opacity: self.progress,
                  scaleX: 0.2 + self.progress * 0.8,
                  transformOrigin: "center center",
                });
              }
              // subtle heat haze via y jitter on step
              gsap.set(cookImgRef.current, {
                y: Math.sin(stepP * Math.PI * 2) * 3,
              });
            },
          });
          return () => st.kill();
        });
      }

      // chiusura · zoom-out da brace a mappa aerea + filo d'oro
      if (closeRef.current && aerialRef.current) {
        gsap.set(aerialRef.current, { scale: 2.4, opacity: 0 });
        ScrollTrigger.create({
          trigger: closeRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(aerialRef.current, {
              scale: 2.4 - p * 1.4,
              opacity: gsap.utils.clamp(0, 1, p * 1.8),
            });
            if (goldPathRef.current) {
              const len = goldPathRef.current.getTotalLength();
              gsap.set(goldPathRef.current, {
                strokeDasharray: len,
                strokeDashoffset: len * (1 - p),
              });
            }
            gsap.set(finalPhraseRef.current, {
              autoAlpha: gsap.utils.clamp(0, 1, (p - 0.6) * 2.5),
              y: (1 - p) * 30,
            });
          },
        });
      }

      // refresh dopo mount
      ScrollTrigger.refresh();
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  /* ─── click su categoria menù (soft scroll interno via lenis) ─── */
  useEffect(() => {
    // niente: uso ancore native
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative w-full text-[color:var(--crema)]"
      style={{ background: "var(--carbone)" }}
    >
      {/* Filiera sub-nav */}
      <nav
        aria-label="Filiera"
        className="pointer-events-auto sticky top-16 z-30 mx-auto flex w-full max-w-6xl items-center justify-center gap-3 px-4 py-2"
      >
        {FILIERA.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className={[
              "font-eyebrow rounded-full px-3 py-1.5 text-[10px] transition-all",
              f.active
                ? "bg-[color:var(--terracotta)]/25 text-[color:var(--oro)] ring-1 ring-[color:var(--oro)]/40"
                : "text-[color:var(--crema)]/65 hover:text-[color:var(--crema)]",
            ].join(" ")}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {/* ────────────── INGRESSO · IL BUIO & LA BRACE ────────────── */}
      <section
        ref={introRef}
        className="relative h-[220svh] w-full"
        aria-label="Il buio e la brace"
      >
        <div className="sticky top-0 h-svh w-full overflow-hidden">
          {/* Rail marginalia (desktop) */}
          <div className="pointer-events-none absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 md:block">
            <div className="font-eyebrow flex flex-col items-start gap-6 text-[10px] text-[color:var(--crema)]/70 [writing-mode:vertical-rl] [transform:rotate(180deg)]">
              <span className="text-[color:var(--oro)]">BRACERIA · IV · NOCI</span>
              <span>
                brace ·{" "}
                <span className="text-[color:var(--terracotta)]">{tempC}°</span>
              </span>
              <span>mer–sab · sera</span>
            </div>
          </div>

          {/* letto di brace */}
          <div
            ref={emberBedRef}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${embersImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center 70%",
              filter: "brightness(1) saturate(1)",
            }}
          />
          {/* vignetta */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 55% at 50% 75%, transparent 0%, rgba(26,18,16,0.55) 55%, var(--carbone) 100%)",
            }}
          />
          {/* fumo che sale */}
          <div
            ref={smokeRef}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[80svh]"
            style={{
              background:
                "radial-gradient(ellipse 55% 40% at 50% 100%, rgba(242,232,213,0.14) 0%, rgba(242,232,213,0.06) 40%, transparent 75%)",
              opacity: 0.55,
              mixBlendMode: "screen",
            }}
          />
          {/* scintille */}
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => {
              const left = (i * 137) % 100;
              const delay = (i % 8) * 0.6;
              const dur = 4 + ((i * 7) % 5);
              return (
                <span
                  key={i}
                  className="absolute block h-1 w-1 rounded-full"
                  style={{
                    left: `${left}%`,
                    bottom: "45%",
                    background: "var(--terracotta)",
                    boxShadow: "0 0 6px var(--terracotta), 0 0 12px var(--oro)",
                    animation: `spark-rise ${dur}s ${delay}s linear infinite`,
                    opacity: 0.85,
                  }}
                />
              );
            })}
          </div>

          {/* Titolo che emerge dal fumo */}
          <div className="absolute inset-x-0 top-[38%] flex flex-col items-center px-6 text-center">
            <h1
              ref={titleRef}
              className="font-display text-4xl leading-[0.95] tracking-tight text-[color:var(--crema)] md:text-7xl"
              style={{ textShadow: "0 0 40px rgba(179,58,26,0.55)" }}
            >
              La brace,{" "}
              <em className="italic text-[color:var(--terracotta)]">ogni sera</em>.
            </h1>
          </div>

          {/* Cue */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-[color:var(--crema)]/60">
            <span className="font-eyebrow text-[10px]">siediti al buio</span>
            <span className="block h-8 w-px bg-[color:var(--oro)]/60" />
          </div>
        </div>
      </section>

      {/* ────────────── SEZIONE A · LA LUCE DELLA BRACE ────────────── */}
      <section
        ref={lightRef}
        className="relative w-full bg-[color:var(--carbone)] py-[10svh]"
        aria-label="La luce della brace"
      >
        {/* spotlight che segue lo scroll */}
        <div
          ref={spotRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-10 h-[80svh] w-[80svh] -translate-x-1/2 -translate-y-1/2"
          style={{
            top: "20%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(196,154,74,0.22) 0%, rgba(179,58,26,0.16) 25%, transparent 60%)",
            mixBlendMode: "screen",
          }}
        />

        <div className="relative z-20 mx-auto grid max-w-6xl grid-cols-1 gap-24 px-6 md:gap-40">
          {[
            {
              img: handsImg,
              eyebrow: "il gesto",
              title: "Mani che conoscono il fuoco",
              text: "Il brace-master gira, sposta, avvicina. Sente il calore col dorso. Non usa un timer: usa gli occhi e l'olfatto.",
            },
            {
              img: cotturaImg,
              eyebrow: "la griglia",
              title: "Solo quercia, solo brace viva",
              text: "Legna delle nostre campagne, mai carbonella. Quando la fiamma cala e il letto è rosso, si comincia a cuocere.",
            },
            {
              img: salaImg,
              eyebrow: "la sala",
              title: "Al buio, intorno al fuoco",
              text: "Poche luci, molto silenzio, il fuoco che parla. Si mangia come si mangiava una volta: tutto arriva dallo stesso posto.",
            },
          ].map((r, i) => (
            <div
              key={r.title}
              ref={(el) => {
                lightRevealsRef.current[i] = el;
              }}
              className={[
                "grid grid-cols-1 items-center gap-8 md:grid-cols-2",
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : "",
              ].join(" ")}
              style={{ opacity: 0.15 }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-[color:var(--oro)]/20">
                <img
                  src={r.img}
                  alt={r.title}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover"
                  style={{ filter: "brightness(0.9) contrast(1.05)" }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(26,18,16,0.15) 0%, rgba(26,18,16,0.55) 100%)",
                  }}
                />
              </div>
              <div>
                <div className="font-eyebrow mb-3 text-[11px] text-[color:var(--oro)]">
                  {r.eyebrow}
                </div>
                <h3 className="font-display text-3xl leading-tight md:text-4xl">
                  {r.title}
                </h3>
                <p className="mt-4 max-w-md text-[color:var(--crema)]/80">
                  {r.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ────────────── SEZIONE B · LA COTTURA ────────────── */}
      <section
        ref={cookRef}
        className="relative w-full overflow-hidden bg-[color:var(--carbone)]"
        aria-label="La cottura"
      >
        <div className="relative h-svh w-full">
          {/* Immagine cottura */}
          <div
            ref={cookImgRef}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${COOKING[cookIdx].img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "saturate(0.6) contrast(0.9)",
            }}
          />
          {/* grill marks overlay */}
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <g ref={grillMarksRef} opacity={0}>
              {[20, 35, 50, 65, 80].map((y) => (
                <line
                  key={y}
                  x1={5}
                  x2={95}
                  y1={y}
                  y2={y}
                  stroke="rgba(20,10,8,0.75)"
                  strokeWidth={2.2}
                />
              ))}
            </g>
          </svg>
          {/* heat haze */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 45% at 50% 60%, rgba(179,58,26,0.18) 0%, transparent 60%)",
              mixBlendMode: "screen",
            }}
          />
          {/* vignetta */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, transparent 40%, rgba(26,18,16,0.85) 100%)",
            }}
          />

          {/* marginalia superiore */}
          <div className="font-eyebrow absolute left-6 top-6 z-20 text-[10px] text-[color:var(--oro)]/80">
            II · la cottura
          </div>
          <div className="font-eyebrow absolute right-6 top-6 z-20 text-[10px] text-[color:var(--crema)]/60">
            {String(cookIdx + 1).padStart(2, "0")} / {String(COOKING.length).padStart(2, "0")}
          </div>

          {/* didascalia in basso */}
          <div className="absolute inset-x-0 bottom-0 z-20 px-6 pb-12 md:pb-16">
            <div className="mx-auto max-w-3xl">
              <div className="font-eyebrow mb-2 text-[10px] text-[color:var(--terracotta)]">
                {COOKING[cookIdx].title}
              </div>
              <div className="font-display text-2xl leading-tight md:text-4xl">
                {COOKING[cookIdx].caption}
              </div>
              <div className="mt-2 max-w-xl text-sm text-[color:var(--crema)]/70">
                {COOKING[cookIdx].note}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────── MENÙ DELLA SERA ────────────── */}
      <section
        ref={menuRef}
        id="menu"
        className="relative w-full bg-[color:var(--carbone)] px-6 py-24 md:py-36"
        aria-label="Menù della sera"
      >
        <div className="mx-auto max-w-5xl">
          {/* intestazione carta */}
          <div className="mb-16 border-b border-[color:var(--oro)]/25 pb-6">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-eyebrow text-[11px] text-[color:var(--oro)]">
                  III · la carta
                </div>
                <h2 className="font-display mt-1 text-4xl italic md:text-6xl">
                  Il menù della sera
                </h2>
              </div>
              <div className="font-eyebrow hidden text-right text-[10px] text-[color:var(--crema)]/60 md:block">
                Noci · Puglia
                <br />
                mer – sab · cena
                <br />
                dom / festivi · pranzo
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-[color:var(--crema)]/70">
              Cambia con la stagione, con la brace, con quello che è pronto. Quello
              che leggi stasera è quello che troverai in tavola.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-16 md:gap-20">
            {MENU.map((cat) => (
              <div key={cat.id}>
                <div className="mb-6 flex items-baseline gap-4">
                  <span className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--oro)]">
                    {cat.label}
                  </span>
                  <span className="h-px flex-1 bg-[color:var(--oro)]/25" />
                </div>
                <p className="font-display mb-8 max-w-xl text-lg italic text-[color:var(--crema)]/70">
                  {cat.intro}
                </p>
                <ul className="flex flex-col gap-5">
                  {cat.items.map((it) => (
                    <li
                      key={it.name}
                      className="grid grid-cols-[1fr_auto] items-baseline gap-3"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-display text-xl md:text-2xl">
                          {it.name}
                        </span>
                        <span
                          className="mx-2 hidden flex-1 self-end border-b border-dotted border-[color:var(--crema)]/25 md:block"
                          style={{ transform: "translateY(-6px)" }}
                        />
                        <span className="hidden max-w-md text-sm text-[color:var(--crema)]/60 md:inline">
                          {it.desc}
                        </span>
                      </div>
                      {it.price ? (
                        <span className="font-eyebrow text-[11px] text-[color:var(--oro)]">
                          {it.price}
                        </span>
                      ) : (
                        <span className="font-eyebrow text-[10px] text-[color:var(--crema)]/40">
                          s.q.
                        </span>
                      )}
                      <span className="col-span-2 -mt-3 max-w-md text-sm text-[color:var(--crema)]/60 md:hidden">
                        {it.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="font-eyebrow mt-16 border-t border-[color:var(--oro)]/25 pt-6 text-center text-[10px] text-[color:var(--crema)]/55">
            i piatti cambiano a seconda della brace e della stagione · alcune
            preparazioni richiedono attesa
          </div>
        </div>
      </section>

      {/* ────────────── CHIUSURA · TUTTO TORNA ────────────── */}
      <section
        ref={closeRef}
        className="relative h-[220svh] w-full bg-[color:var(--carbone)]"
        aria-label="Il cerchio si chiude"
      >
        <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
          {/* Aerial che risale */}
          <div
            ref={aerialRef}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${aerialAsset.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0,
              transform: "scale(2.4)",
              filter: "brightness(0.75) contrast(1.05) saturate(0.9)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, rgba(26,18,16,0.35) 40%, rgba(26,18,16,0.85) 100%)",
            }}
          />

          {/* filo d'oro che chiude il giro sui 4 mestieri */}
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="brc-glow">
                <feGaussianBlur stdDeviation="0.6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* percorso: braceria → macelleria → caseificio → allevamento → braceria */}
            <path
              ref={goldPathRef}
              d="M 58 20 C 68 32, 72 48, 62 58 S 42 72, 34 62 S 26 40, 40 30 S 55 14, 58 20 Z"
              fill="none"
              stroke="var(--oro)"
              strokeWidth={0.35}
              strokeLinecap="round"
              filter="url(#brc-glow)"
            />
            {/* 4 pin */}
            {[
              { x: 58, y: 20, l: "Braceria" },
              { x: 62, y: 58, l: "Macelleria" },
              { x: 34, y: 62, l: "Caseificio" },
              { x: 40, y: 30, l: "Allevamento" },
            ].map((p) => (
              <g key={p.l}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={0.9}
                  fill="var(--terracotta)"
                  filter="url(#brc-glow)"
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={1.8}
                  fill="none"
                  stroke="var(--oro)"
                  strokeWidth={0.15}
                  opacity={0.6}
                />
              </g>
            ))}
          </svg>

          {/* Frase finale + CTA */}
          <div
            ref={finalPhraseRef}
            className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 text-center"
            style={{ opacity: 0 }}
          >
            <div className="font-eyebrow text-[11px] text-[color:var(--oro)]">
              il cerchio si chiude
            </div>
            <h2 className="font-display text-3xl leading-tight md:text-6xl">
              dalla terra alla brace —{" "}
              <em className="italic text-[color:var(--terracotta)]">
                ogni sera, a Noci.
              </em>
            </h2>

            <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
              <a
                href="tel:+393339395750"
                className="bg-grad-brace font-eyebrow inline-flex items-center justify-center rounded-full px-8 py-4 text-xs text-[color:var(--crema)] shadow-[0_20px_50px_-20px_rgba(179,58,26,0.9)] ring-1 ring-[color:var(--oro)]/40 transition-transform hover:scale-[1.03]"
              >
                Prenota un tavolo
              </a>
              <a
                href="https://wa.me/393339395750"
                target="_blank"
                rel="noreferrer noopener"
                className="font-eyebrow inline-flex items-center justify-center rounded-full border border-[color:var(--oro)]/40 px-8 py-4 text-xs text-[color:var(--crema)] transition-colors hover:bg-[color:var(--oro)]/10"
              >
                WhatsApp · 333 939 5750
              </a>
            </div>

            <div className="font-eyebrow text-[10px] text-[color:var(--crema)]/60">
              mer – sab · cena · dom / festivi · pranzo
            </div>

            <Link
              to="/"
              className="mt-2 text-xs text-[color:var(--crema)]/50 underline underline-offset-4 hover:text-[color:var(--oro)]"
            >
              torna alla masseria
            </Link>
          </div>
        </div>
      </section>

      {/* keyframes locali (scintille) */}
      <style>{`
        @keyframes spark-rise {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          10%  { opacity: 0.9; }
          100% { transform: translateY(-70svh) scale(0.4); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="spark-rise"] { display: none !important; }
        }
      `}</style>
    </div>
  );
}
