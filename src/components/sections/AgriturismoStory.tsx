import { forwardRef, useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import salaImg from "@/assets/brace-sala.jpg";
import cotturaImg from "@/assets/brace-cottura.jpg";
import aerialAsset from "@/assets/masseria-aerial.asset.json";

/* ─────────────────────────────────────────────────────────────
 * /agriturismo — LA SERA
 * Una sala vuota che si accende.
 * ───────────────────────────────────────────────────────────── */

const WA_URL =
  "https://wa.me/393339395750?text=Buonasera%2C%20vorrei%20prenotare%20un%20tavolo%20a%20Masseria%20Don%20Gianvito.";
const TEL_URL = "tel:+393339395750";
const MAPS_URL = "https://www.google.com/maps?q=40.642739,17.042600";

const NOTE_MENU =
  "Piatti e disponibilità possono cambiare. Contatta la Masseria per confermare il menu del giorno.";

const ORARI = [
  { g: "Lunedì", v: "Chiuso", off: true },
  { g: "Martedì", v: "Chiuso", off: true },
  { g: "Mercoledì", v: "Cena", off: false },
  { g: "Giovedì", v: "Cena", off: false },
  { g: "Venerdì", v: "Cena", off: false },
  { g: "Sabato", v: "Cena", off: false },
  { g: "Domenica e festivi", v: "Pranzo", off: false },
];

const SERVIZIO = [
  {
    from: "DAL CASEIFICIO",
    items: ["Mozzarella", "Nodini", "Primo sale", "Ricotta"],
  },
  {
    from: "DALLA MACELLERIA",
    items: ["Prosciutto crudo", "Soppressata", "Salsiccia secca", "Pancetta tesa"],
  },
  {
    from: "DALLA CUCINA",
    items: [
      "Polpettine al sugo nel pignatiello",
      "Spezzatino di vitello e maiale",
      "Pecora in Pignata",
    ],
  },
  {
    from: "DALLA TERRA",
    items: ["Frittelle di grano", "Ricotta piccante", "Pomodorini", "Zucchine marinate"],
  },
];

const ARROSTO = ["FILETTO", "BOMBETTE", "SALSICCIA", "SCELTA DEL BANCO"];

/* ─────────────────────────────────────────────────────────── */

export function AgriturismoStory() {
  const reduced = useReducedMotion();

  return (
    <div className="relative" style={{ background: "var(--carbone)", color: "var(--crema)" }}>
      <Apertura />
      <SalaAccende reduced={reduced} />
      <Rito reduced={reduced} />
      <Servizio reduced={reduced} />
      <Pignata reduced={reduced} />
      <Arrosto reduced={reduced} />
      <Domenica reduced={reduced} />
      <UltimoGesto />
      <Prenota />
      <ZoomOut reduced={reduced} />
      <NavAnime current="agriturismo" />
    </div>
  );
}

/* ─────────────────── 00. APERTURA — LA CASA VUOTA ───────────────────
 * NOTE INTERNA — Asset `brace-sala.jpg` è probabile stock/AI.
 * Sostituire con fotografia autentica della sala dell'Agriturismo.
 * Fino ad allora: crop architettonico stretto, brightness bassa, nessuna
 * enfasi su elementi che sembrano generati.
 * ─────────────────────────────────────────────────────────────────────── */
function Apertura() {
  return (
    <section
      aria-label="Apertura — la Masseria aspetta"
      className="relative min-h-[100dvh] flex items-end overflow-hidden"
      style={{ background: "var(--carbone)" }}
    >
      {/* Crop architettonico: focus su pietra/tavoli/profondità, no dettagli artificiali */}
      <img
        src={salaImg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.48) saturate(0.7) contrast(1.08)",
          objectPosition: "center 62%",
        }}
        loading="eager"
        decoding="async"
      />
      {/* Una sola linea di luce, dal fondo verso l'ingresso */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(55% 45% at 72% 42%, color-mix(in oklab, var(--oro) 20%, transparent) 0%, transparent 62%), linear-gradient(to bottom, color-mix(in oklab, var(--carbone) 92%, transparent) 0%, transparent 35%, color-mix(in oklab, var(--carbone) 94%, transparent) 95%)",
        }}
      />
      <div className="relative z-10 w-full px-6 md:px-14 pb-14 md:pb-20 max-w-6xl mx-auto">
        <div className="font-eyebrow text-[11px] md:text-[12px] tracking-[0.35em] opacity-75 mb-6">
          AGRITURISMO — MASSERIA DON GIANVITO
        </div>
        <h1
          className="font-display leading-[1.02] text-[clamp(2.6rem,7vw,6rem)]"
          style={{ fontWeight: 300, color: "var(--crema)" }}
          aria-label="Prima degli ospiti, la Masseria aspetta."
        >
          <span>Prima degli ospiti,</span>
          <br />
          <em className="italic" style={{ color: "color-mix(in oklab, var(--oro) 90%, var(--crema))" }}>
            la Masseria aspetta.
          </em>
        </h1>
        <p className="mt-6 md:mt-8 max-w-xl text-[15px] md:text-lg leading-relaxed opacity-85">
          L'Agriturismo è il luogo in cui la filiera diventa ospitalità: cucina, tavola e braceria
          si incontrano nella stessa esperienza.
        </p>
        <div className="mt-10 md:mt-14 flex items-center gap-4">
          <span className="h-px w-10 bg-[color:var(--oro)]/60" />
          <span className="font-eyebrow text-[11px] tracking-[0.35em] opacity-70">
            ENTRA NELLA SALA
          </span>
        </div>
      </div>
    </section>
  );
}


/* ─────────────────── 01. LA SALA SI ACCENDE ─────────────────── */
function SalaAccende({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (reduced || !rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(imgRef.current, { filter: "brightness(0.42) saturate(0.75)" });
      gsap.set(glowRef.current, { opacity: 0 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          end: "bottom 30%",
          scrub: 0.6,
        },
      });
      tl.to(imgRef.current, { filter: "brightness(0.78) saturate(0.9)", ease: "none" }, 0);
      tl.to(glowRef.current, { opacity: 1, ease: "none" }, 0);
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="La sera prende posto"
      className="relative min-h-[100dvh] overflow-hidden"
      style={{ background: "var(--carbone)" }}
    >
      <img
        ref={imgRef}
        src={salaImg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: reduced ? "brightness(0.78) saturate(0.9)" : undefined }}
      />
      <div
        ref={glowRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: reduced ? 1 : undefined,
          background:
            "radial-gradient(40% 40% at 25% 35%, color-mix(in oklab, var(--oro) 18%, transparent), transparent 70%), radial-gradient(45% 45% at 70% 55%, color-mix(in oklab, var(--crema) 14%, transparent), transparent 70%), radial-gradient(30% 30% at 50% 85%, color-mix(in oklab, var(--marrone) 40%, transparent), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-[color:var(--carbone)]/40" aria-hidden />
      <div className="relative z-10 h-full min-h-[100dvh] px-6 md:px-14 py-24 md:py-28 max-w-6xl mx-auto flex flex-col justify-between">
        <div className="font-eyebrow text-[11px] tracking-[0.35em] opacity-70">01 — L'ATTESA</div>
        <div>
          <h2
            className="font-display leading-[1.02] text-[clamp(2.2rem,6vw,5rem)]"
            style={{ fontWeight: 300 }}
            aria-label="La sera prende posto."
          >
            <span>La sera</span>
            <br />
            <em className="italic" style={{ color: "color-mix(in oklab, var(--oro) 85%, var(--crema))" }}>
              prende posto.
            </em>
          </h2>
          <p className="mt-6 max-w-lg text-base md:text-lg opacity-85">
            Pietra, tavoli e cucina cambiano ritmo quando comincia il servizio.
          </p>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────── 02. IL RITO — SCEGLI / SIEDI / COTTURA ─────────────────── */
function Rito({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cotturaRef = useRef<HTMLDivElement | null>(null);
  const b1 = useRef<HTMLDivElement | null>(null);
  const b2 = useRef<HTMLDivElement | null>(null);
  const b3 = useRef<HTMLDivElement | null>(null);
  const [beat, setBeat] = useState(0);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set([b1.current, b2.current, b3.current], { opacity: 0, y: 30 });
        gsap.set(cotturaRef.current, { opacity: 0 });
        gsap.set(cardRef.current, { xPercent: 0, yPercent: 0, rotate: -3 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "+=280%",
            scrub: 0.6,
            pin: stageRef.current,
            anticipatePin: 1,
            pinSpacing: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              if (p < 0.36) setBeat(0);
              else if (p < 0.72) setBeat(1);
              else setBeat(2);
            },
          },
        });

        // 01 SCEGLI
        tl.to(b1.current, { opacity: 1, y: 0, duration: 0.6 }, 0.05);
        tl.to(b1.current, { opacity: 0, y: -20, duration: 0.4 }, 0.9);

        // 02 SIEDI
        tl.to(cardRef.current, { xPercent: 40, yPercent: 30, rotate: 6, duration: 1 }, 0.9);
        tl.to(b2.current, { opacity: 1, y: 0, duration: 0.6 }, 1.05);
        tl.to(bgRef.current, {
          filter: "brightness(0.85) saturate(0.9)",
          duration: 0.6,
        }, 1);
        tl.to(b2.current, { opacity: 0, y: -20, duration: 0.4 }, 1.9);

        // 03 COTTURA
        tl.to(cotturaRef.current, { opacity: 0.55, duration: 0.6 }, 1.9);
        tl.to(cardRef.current, { xPercent: 70, yPercent: 55, rotate: 10, duration: 0.8 }, 2);
        tl.to(b3.current, { opacity: 1, y: 0, duration: 0.6 }, 2.05);
        // il terracotta si riduce prima di uscire
        tl.to(cotturaRef.current, { opacity: 0.2, duration: 0.4 }, 2.7);
      });

      // Mobile / reduced motion → statico verticale (nessun pin)
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="Il rito — Scegli, Siedi, Cottura"
      className="relative"
      style={{ background: "var(--carbone)" }}
    >
      {/* DESKTOP STAGE — nasconde in reduced motion per evitare overlap dei 3 beat */}
      <div
        ref={stageRef}
        className={`${reduced ? "hidden" : "hidden md:flex"} relative h-[100dvh] w-full overflow-hidden items-stretch`}
      >
        <div
          ref={bgRef}
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${salaImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.55) saturate(0.8)",
          }}
        />
        <div className="absolute inset-0 bg-[color:var(--carbone)]/50" aria-hidden />
        {/* Cottura glow (terracotta locale) */}
        <div
          ref={cotturaRef}
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(35% 40% at 70% 65%, color-mix(in oklab, var(--terracotta) 55%, transparent) 0%, transparent 70%)",
          }}
        />

        {/* Cartellino "SCELTO AL BANCO" */}
        <div
          ref={cardRef}
          className="absolute z-20 left-[16%] top-[42%] pointer-events-none"
          style={{ transform: "translate(-50%,-50%)" }}
          aria-hidden
        >
          <div
            className="px-5 py-4 shadow-2xl"
            style={{
              background: "var(--crema)",
              color: "var(--marrone)",
              border: "1px solid color-mix(in oklab, var(--oro) 60%, var(--marrone))",
              minWidth: 180,
            }}
          >
            <div className="font-eyebrow text-[10px] tracking-[0.3em] opacity-70">
              MASSERIA · MACELLERIA
            </div>
            <div className="font-display text-xl mt-1" style={{ fontWeight: 400 }}>
              Scelto al banco
            </div>
            <div className="mt-3 h-px" style={{ background: "var(--oro)" }} />
          </div>
        </div>

        {/* Copy stack */}
        <div className="relative z-30 grid grid-cols-12 gap-8 w-full px-14 py-20 max-w-7xl mx-auto self-stretch">
          <div className="col-span-5 flex flex-col justify-between">
            <div className="font-eyebrow text-[11px] tracking-[0.35em] opacity-70">
              02 — IL RITO
            </div>
            <div>
              <h2
                className="font-display leading-[1.02] text-[clamp(2.4rem,4.5vw,4.5rem)]"
                style={{ fontWeight: 300 }}
                aria-label="Tre gesti. Una sola esperienza."
              >
                <span>Tre gesti.</span>
                <br />
                <em className="italic">Una sola esperienza.</em>
              </h2>

              <p className="mt-6 max-w-md opacity-85">
                Il pasto comincia davanti al banco e continua nella sala.
              </p>
              {/* Progress */}
              <div className="mt-10 flex items-center gap-3">
                {["01 SCEGLI", "02 SIEDI", "03 COTTURA"].map((l, i) => (
                  <div key={l} className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-8 transition-colors"
                      style={{
                        background:
                          i === beat
                            ? "var(--oro)"
                            : "color-mix(in oklab, var(--crema) 25%, transparent)",
                      }}
                    />
                    <span
                      className="font-eyebrow text-[10px] tracking-[0.25em] transition-opacity"
                      style={{ opacity: i === beat ? 0.95 : 0.4 }}
                    >
                      {l}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-7 relative">
            <BeatBox ref={b1} kicker="01 — SCEGLI" title="La sera comincia" titleAlt="davanti al banco." body="La carne viene osservata e scelta nella Macelleria prima di sedersi." tag="SCELTO AL BANCO" />
            <BeatBox ref={b2} kicker="02 — SIEDI" title="La scelta" titleAlt="arriva al tavolo." body="Mentre la carne attende la cottura, il servizio comincia con antipasti e piatti della cucina." tag="IL TUO POSTO" />
            <BeatBox ref={b3} kicker="03 — COTTURA" title="Il calore" titleAlt="completa la scelta." body="La carne scelta al banco viene cotta arrosto sui carboni e servita durante il pasto." tag="DAL BANCO ALLA TAVOLA" tagAccent />
          </div>
        </div>
      </div>

      {/* MOBILE / reduced: verticale (mostrato anche su desktop se reduced-motion) */}
      <div className={`${reduced ? "block" : "md:hidden"} px-6 py-16 space-y-14 max-w-2xl mx-auto`}>

        <div className="font-eyebrow text-[11px] tracking-[0.35em] opacity-70">02 — IL RITO</div>
        <h2 className="font-display text-4xl leading-[1.05]" style={{ fontWeight: 300 }}>
          Tre gesti. <em className="italic">Una sola esperienza.</em>
        </h2>

        <p className="opacity-85 text-base">
          Il pasto comincia davanti al banco e continua nella sala.
        </p>
        {[
          {
            k: "01 — SCEGLI",
            t: "La sera comincia davanti al banco.",
            b: "La carne viene osservata e scelta nella Macelleria prima di sedersi.",
            tag: "SCELTO AL BANCO",
          },
          {
            k: "02 — SIEDI",
            t: "La scelta arriva al tavolo.",
            b: "Mentre la carne attende la cottura, il servizio comincia con antipasti e piatti della cucina.",
            tag: "IL TUO POSTO",
          },
          {
            k: "03 — COTTURA",
            t: "Il calore completa la scelta.",
            b: "La carne scelta al banco viene cotta arrosto sui carboni e servita durante il pasto.",
            tag: "DAL BANCO ALLA TAVOLA",
            accent: true,
          },
        ].map((b) => (
          <div key={b.k} className="border-t border-[color:var(--crema)]/15 pt-8">
            <div className="font-eyebrow text-[10px] tracking-[0.3em] opacity-70">{b.k}</div>
            <h3 className="font-display text-2xl mt-2" style={{ fontWeight: 400 }}>
              {b.t}
            </h3>
            <p className="mt-3 opacity-85">{b.b}</p>
            <div
              className="mt-4 inline-block px-3 py-1 font-eyebrow text-[10px] tracking-[0.25em]"
              style={{
                background: b.accent ? "color-mix(in oklab, var(--terracotta) 40%, var(--carbone))" : "color-mix(in oklab, var(--crema) 10%, transparent)",
                border: "1px solid color-mix(in oklab, var(--oro) 50%, transparent)",
              }}
            >
              {b.tag}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type BeatBoxProps = {
  kicker: string;
  title: string;
  titleAlt: string;
  body: string;
  tag: string;
  tagAccent?: boolean;
};

const BeatBox = forwardRef<HTMLDivElement, BeatBoxProps>(function BeatBox(props, ref) {
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex flex-col justify-center pl-6"
      aria-hidden
    >
      <div className="font-eyebrow text-[11px] tracking-[0.35em] opacity-75 mb-3">
        {props.kicker}
      </div>
      <h3
        className="font-display leading-[1.02] text-[clamp(2rem,4vw,3.8rem)] max-w-xl"
        style={{ fontWeight: 300 }}
      >
        {props.title}
        <br />
        <em className="italic" style={{ color: "color-mix(in oklab, var(--oro) 85%, var(--crema))" }}>
          {props.titleAlt}
        </em>
      </h3>
      <p className="mt-5 max-w-md opacity-85">{props.body}</p>
      <div
        className="mt-8 inline-flex items-center gap-3 px-3 py-1.5 self-start font-eyebrow text-[10px] tracking-[0.3em]"
        style={{
          background: props.tagAccent
            ? "color-mix(in oklab, var(--terracotta) 40%, var(--carbone))"
            : "color-mix(in oklab, var(--crema) 8%, transparent)",
          border: "1px solid color-mix(in oklab, var(--oro) 55%, transparent)",
        }}
      >
        <span className="h-1 w-4" style={{ background: "var(--oro)" }} />
        {props.tag}
      </div>
    </div>
  );
});


/* ─────────────────── 03. IL SERVIZIO ─────────────────── */
function Servizio({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const groupsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (reduced || !groupsRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const groups = gsap.utils.toArray<HTMLElement>(".serv-group");
      groups.forEach((g) => {
        gsap.from(g, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: g,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="Il servizio — La tavola si compone"
      className="relative py-24 md:py-36 px-6 md:px-14 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--carbone) 0%, color-mix(in oklab, var(--marrone) 60%, var(--carbone)) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="font-eyebrow text-[11px] tracking-[0.35em] opacity-75 mb-6">
          03 — IL SERVIZIO
        </div>
        <h2
          className="font-display leading-[1.02] text-[clamp(2.4rem,5.5vw,5rem)] max-w-3xl"
          style={{ fontWeight: 300 }}
        >
          La tavola
          <br />
          <em className="italic" style={{ color: "color-mix(in oklab, var(--oro) 85%, var(--crema))" }}>
            si compone poco a poco.
          </em>
        </h2>
        <p className="mt-8 max-w-xl opacity-85 text-base md:text-lg">
          Salumi, formaggi, frittelle e piatti della cucina arrivano prima dell'arrosto e
          costruiscono un pasto completo.
        </p>

        <div ref={groupsRef} className="mt-16 md:mt-24 relative">
          {/* Linea di servizio */}
          <div
            aria-hidden
            className="absolute left-4 md:left-8 top-0 bottom-0 w-px"
            style={{ background: "color-mix(in oklab, var(--oro) 45%, transparent)" }}
          />
          <ol className="space-y-14 md:space-y-20">
            {SERVIZIO.map((s) => (
              <li key={s.from} className="serv-group relative pl-12 md:pl-20">
                <span
                  aria-hidden
                  className="absolute left-3 md:left-7 top-3 h-3 w-3"
                  style={{
                    background: "var(--oro)",
                    transform: "rotate(45deg)",
                  }}
                />
                <div className="font-eyebrow text-[11px] tracking-[0.35em] opacity-75 mb-4">
                  {s.from}
                </div>
                <ul className="flex flex-wrap gap-x-8 gap-y-3">
                  {s.items.map((it) => (
                    <li
                      key={it}
                      className="font-display text-xl md:text-3xl leading-tight"
                      style={{ fontWeight: 300 }}
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        <p
          className="mt-16 md:mt-20 max-w-2xl text-sm md:text-base italic opacity-75 border-t border-[color:var(--crema)]/15 pt-6"
          role="note"
        >
          {NOTE_MENU}
        </p>
      </div>
    </section>
  );
}

/* ─────────────────── 04. DALLA CUCINA — LA PIGNATA ─────────────────── */
function Pignata({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const arcRef = useRef<SVGCircleElement | null>(null);
  const circaRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    if (reduced || !rootRef.current || !arcRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const c = arcRef.current!;
      const len = c.getTotalLength ? c.getTotalLength() : 2 * Math.PI * 120;
      gsap.set(c, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(circaRef.current, { opacity: 0, y: 20 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          end: "bottom 40%",
          scrub: 0.7,
        },
      });
      tl.to(c, { strokeDashoffset: 0, ease: "none" }, 0);
      tl.to(circaRef.current, { opacity: 1, y: 0, ease: "none" }, 0.6);
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="Dalla cucina — La Pecora in Pignata"
      className="relative py-24 md:py-36 px-6 md:px-14"
      style={{ background: "color-mix(in oklab, var(--marrone) 75%, var(--carbone))" }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 md:gap-20 items-center">
        <div>
          <div className="font-eyebrow text-[11px] tracking-[0.35em] opacity-75 mb-6">
            04 — DALLA CUCINA
          </div>
          <h2
            className="font-display leading-[1.02] text-[clamp(2.2rem,5vw,4.5rem)]"
            style={{ fontWeight: 300 }}
          >
            Ci sono piatti
            <br />
            <em className="italic">che chiedono tempo.</em>
          </h2>
          <p className="mt-6 max-w-lg opacity-85 text-base md:text-lg">
            La Pecora in Pignata cuoce per{" "}
            <strong style={{ color: "color-mix(in oklab, var(--oro) 85%, var(--crema))" }}>
              circa cinque ore
            </strong>{" "}
            nel forno a legna, con ortaggi e spezie, in una pignata chiusa con pasta di pane.
          </p>
          <ul className="mt-10 space-y-3">
            {["POLPETTINE AL SUGO", "SPEZZATINO DI VITELLO E MAIALE", "PECORA IN PIGNATA"].map(
              (p, i) => (
                <li key={p} className="flex items-baseline gap-4">
                  <span className="font-eyebrow text-[10px] opacity-60 w-6">
                    0{i + 1}
                  </span>
                  <span
                    className="font-display text-lg md:text-2xl"
                    style={{ fontWeight: 300 }}
                  >
                    {p}
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>

        {/* Cerchio del tempo */}
        <div className="relative flex items-center justify-center aspect-square max-w-md mx-auto w-full">
          <svg viewBox="0 0 300 300" className="w-full h-full" aria-hidden>
            {/* Pignata: forma di terracotta opaca */}
            <defs>
              <radialGradient id="pignata" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#b5613a" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#7a3a20" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#3d2010" stopOpacity="0.9" />
              </radialGradient>
            </defs>
            {/* Pasta di pane suggerita: bordo crema tratteggiato */}
            <circle
              cx="150"
              cy="150"
              r="90"
              fill="url(#pignata)"
              stroke="color-mix(in oklab, var(--crema) 60%, transparent)"
              strokeWidth="6"
              strokeDasharray="4 6"
              opacity="0.9"
            />
            {/* Linea temporale */}
            <circle
              ref={arcRef}
              cx="150"
              cy="150"
              r="120"
              fill="none"
              stroke="var(--oro)"
              strokeWidth="1.5"
              transform="rotate(-90 150 150)"
              style={{ strokeDashoffset: reduced ? 0 : undefined }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              ref={circaRef}
              className="font-eyebrow text-[11px] tracking-[0.4em] opacity-80"
              style={{ opacity: reduced ? 1 : undefined }}
            >
              CIRCA
            </span>
            <span
              className="font-display text-6xl md:text-7xl leading-none mt-1"
              style={{ fontWeight: 300, color: "var(--crema)" }}
            >
              5<span className="text-3xl md:text-4xl ml-2 opacity-70">ore</span>
            </span>
            <span className="font-eyebrow text-[10px] tracking-[0.3em] mt-3 opacity-70">
              FORNO A LEGNA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── 05. L'ARROSTO — LA SCELTA RITORNA ─────────────────── */
function Arrosto({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (reduced || !rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(cardRef.current, { opacity: 0, x: -60, rotate: -6 });
      gsap.set(glowRef.current, { opacity: 0 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 0.7,
        },
      });
      tl.to(cardRef.current, { opacity: 1, x: 0, rotate: 3, duration: 1, ease: "none" }, 0);
      tl.to(glowRef.current, { opacity: 0.6, duration: 0.6, ease: "none" }, 0.4);
      tl.to(glowRef.current, { opacity: 0.15, duration: 0.6, ease: "none" }, 1.2);
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="L'arrosto — quello che hai scelto ritorna al tavolo"
      className="relative py-28 md:py-40 px-6 md:px-14 overflow-hidden"
      style={{ background: "var(--carbone)" }}
    >
      {/*
        NOTE INTERNA — Asset `brace-cottura.jpg` è probabile stock/AI.
        Sostituire con fotografia autentica della cottura reale.
        Fino ad allora: uso come texture scura al 22%, mai a piena leggibilità.
      */}
      <img
        src={cotturaImg}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-[0.22]"
        style={{ filter: "brightness(0.45) saturate(0.7) contrast(1.05)" }}
      />

      <div
        ref={glowRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: reduced ? 0.3 : undefined,
          background:
            "radial-gradient(45% 45% at 65% 55%, color-mix(in oklab, var(--terracotta) 50%, transparent), transparent 70%)",
        }}
      />
      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7">
          <div className="font-eyebrow text-[11px] tracking-[0.35em] opacity-75 mb-6">
            05 — L'ARROSTO
          </div>
          <h2
            className="font-display leading-[1.02] text-[clamp(2.2rem,5.5vw,5rem)]"
            style={{ fontWeight: 300 }}
          >
            Quello che hai scelto
            <br />
            <em className="italic" style={{ color: "color-mix(in oklab, var(--oro) 85%, var(--crema))" }}>
              ritorna al tavolo.
            </em>
          </h2>
          <p className="mt-6 max-w-lg opacity-85">
            Filetto di vitello, bombette, salsiccia e altri tagli seguono la disponibilità del banco
            e arrivano alla cottura.
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4">
            {ARROSTO.map((v) => (
              <li
                key={v}
                className="font-eyebrow text-sm md:text-base tracking-[0.2em] border-b border-[color:var(--crema)]/15 pb-3"
              >
                {v}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm italic opacity-75 max-w-md">
            La frollatura indicativa è di circa quindici giorni e può variare in base al taglio.
          </p>
        </div>

        <div className="md:col-span-5 flex justify-center">
          <div
            ref={cardRef}
            className="px-6 py-5 shadow-2xl"
            style={{
              background: "var(--crema)",
              color: "var(--marrone)",
              border: "1px solid color-mix(in oklab, var(--oro) 60%, var(--marrone))",
              opacity: reduced ? 1 : undefined,
              maxWidth: 260,
            }}
            aria-hidden
          >
            <div className="font-eyebrow text-[10px] tracking-[0.3em] opacity-70">
              MASSERIA · MACELLERIA
            </div>
            <div className="font-display text-2xl mt-1" style={{ fontWeight: 400 }}>
              Scelto al banco
            </div>
            <div className="mt-3 h-px" style={{ background: "var(--oro)" }} />
            <div className="mt-3 font-eyebrow text-[10px] tracking-[0.3em] opacity-70">
              → ALLA TAVOLA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── 06. LA DOMENICA ─────────────────── */
function Domenica({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    if (reduced || !imgRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { filter: "brightness(0.55) saturate(0.75) hue-rotate(-8deg)" },
        {
          filter: "brightness(1.05) saturate(0.95) hue-rotate(6deg)",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
            end: "bottom 30%",
            scrub: 0.7,
          },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="La domenica — La Masseria di giorno"
      className="relative py-24 md:py-36 px-6 md:px-14"
      style={{
        background:
          "linear-gradient(180deg, var(--carbone) 0%, color-mix(in oklab, var(--crema) 20%, var(--marrone)) 60%, color-mix(in oklab, var(--crema) 55%, var(--oliva)) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6 relative aspect-[4/5] overflow-hidden">
          <img
            ref={imgRef}
            src={salaImg}
            alt="La stessa sala della Masseria durante il pranzo domenicale"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: reduced ? "brightness(1.05) saturate(0.95)" : undefined,
            }}
          />
        </div>
        <div className="md:col-span-6">
          <div className="font-eyebrow text-[11px] tracking-[0.35em] opacity-75 mb-6">
            06 — LA DOMENICA
          </div>
          <h2
            className="font-display leading-[1.02] text-[clamp(2.2rem,5vw,4.5rem)]"
            style={{ fontWeight: 300 }}
          >
            La stessa tavola,
            <br />
            <em className="italic">un'altra luce.</em>
          </h2>
          <p className="mt-6 max-w-lg opacity-85">
            Dal mercoledì al sabato la Masseria accoglie a cena. La domenica e nei giorni festivi
            apre per il pranzo.
          </p>
          <dl className="mt-10 divide-y divide-[color:var(--crema)]/20 border-y border-[color:var(--crema)]/20">
            {ORARI.map((o) => (
              <div key={o.g} className="flex items-center justify-between py-3">
                <dt
                  className="font-eyebrow text-[11px] md:text-xs tracking-[0.2em]"
                  style={{ opacity: o.off ? 0.5 : 0.95 }}
                >
                  {o.g.toUpperCase()}
                </dt>
                <dd
                  className="font-display text-base md:text-lg italic"
                  style={{
                    opacity: o.off ? 0.5 : 1,
                    color: o.off ? undefined : "color-mix(in oklab, var(--oro) 80%, var(--crema))",
                  }}
                >
                  {o.v}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm italic opacity-75">
            Gli orari possono variare. Contatta la Masseria per confermare il servizio.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── 07. L'ULTIMO GESTO — DOLCI ─────────────────── */
function UltimoGesto() {
  return (
    <section
      aria-label="L'ultimo gesto — Dolci e chiusura"
      className="relative py-28 md:py-40 px-6 md:px-14 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--crema) 55%, var(--oliva)) 0%, color-mix(in oklab, var(--crema) 30%, var(--marrone)) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto text-center relative">
        <div className="font-eyebrow text-[11px] tracking-[0.35em] opacity-70 mb-6">
          07 — L'ULTIMO GESTO
        </div>
        <h2
          className="font-display leading-[1.02] text-[clamp(2.4rem,6vw,5rem)]"
          style={{ fontWeight: 300 }}
        >
          La tavola
          <br />
          <em className="italic">finisce piano.</em>
        </h2>
        <p className="mt-8 max-w-xl mx-auto opacity-85 text-base md:text-lg">
          I dolcini artigianali chiudono il pasto e riportano la sala a un ritmo più lento.
        </p>
        {/* Piccole forme dei dolci suggerite */}
        <div className="mt-16 flex items-center justify-center gap-6 md:gap-10 opacity-80">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              aria-hidden
              className="block"
              style={{
                width: 18 + (i % 2) * 6,
                height: 18 + (i % 2) * 6,
                background: "color-mix(in oklab, var(--oro) 70%, var(--crema))",
                borderRadius: i % 2 === 0 ? "50%" : "30%",
                transform: `translateY(${(i % 2) * 4}px)`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── 08. PRENOTAZIONE ─────────────────── */
function Prenota() {
  return (
    <section
      aria-label="Prenotazione"
      className="relative py-24 md:py-32 px-6 md:px-14"
      style={{ background: "var(--carbone)", color: "var(--crema)" }}
    >
      <div className="max-w-4xl mx-auto grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-7">
          <div className="font-eyebrow text-[11px] tracking-[0.35em] opacity-75 mb-6">
            08 — PRENOTA
          </div>
          <h2
            className="font-display leading-[1.02] text-[clamp(2.2rem,5vw,4.5rem)]"
            style={{ fontWeight: 300 }}
          >
            La sala è pronta.
            <br />
            <em className="italic" style={{ color: "color-mix(in oklab, var(--oro) 85%, var(--crema))" }}>
              Manca il tuo tavolo.
            </em>
          </h2>
          <p className="mt-6 max-w-md opacity-85">
            Scrivici su WhatsApp o chiamaci direttamente per confermare disponibilità e servizio.
          </p>
        </div>
        <div className="md:col-span-5 flex flex-col gap-3 w-full">
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center font-eyebrow tracking-[0.25em] text-sm px-6 py-4 transition-colors"
            style={{
              background: "var(--bordeaux)",
              color: "var(--crema)",
              minHeight: 54,
            }}
          >
            PRENOTA SU WHATSAPP
          </a>
          <a
            href={TEL_URL}
            className="w-full text-center font-eyebrow tracking-[0.25em] text-sm px-6 py-4"
            style={{
              border: "1px solid color-mix(in oklab, var(--crema) 60%, transparent)",
              color: "var(--crema)",
              minHeight: 54,
            }}
          >
            CHIAMA ORA
          </a>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center font-eyebrow tracking-[0.25em] text-xs px-6 py-3 opacity-80 hover:opacity-100 transition-opacity"
          >
            APRI SU GOOGLE MAPS →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── 09. ZOOM-OUT FINALE ─────────────────── */
function ZoomOut({ reduced }: { reduced: boolean }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const aerialRef = useRef<HTMLImageElement | null>(null);
  const labelsRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (reduced || !rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(aerialRef.current, { scale: 1.15, opacity: 0 });
      gsap.set(windowRef.current, { scale: 1, opacity: 1 });
      gsap.set(labelsRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 0.8,
        },
      });
      tl.to(windowRef.current, { scale: 0.55, opacity: 0.3, ease: "none" }, 0);
      tl.to(aerialRef.current, { opacity: 1, scale: 1, ease: "none" }, 0);
      tl.to(labelsRef.current, { opacity: 1, ease: "none" }, 0.7);
    }, rootRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="Zoom-out — La Masseria vista dall'alto"
      className="relative min-h-[110dvh] overflow-hidden"
      style={{ background: "var(--carbone)" }}
    >
      {/* Fotografia aerea */}
      <img
        ref={aerialRef}
        src={aerialAsset.url}
        alt="Veduta aerea della Masseria Don Gianvito"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: reduced ? 1 : undefined,
          transform: reduced ? "scale(1)" : undefined,
          filter: "brightness(0.85) saturate(0.85)",
        }}
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-[color:var(--carbone)]/30" aria-hidden />

      {/* Finestra della sala che si rimpicciolisce */}
      <div
        ref={windowRef}
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[55vh] md:w-[55vw] md:h-[60vh] shadow-2xl overflow-hidden"
        style={{
          border: "1px solid color-mix(in oklab, var(--oro) 60%, transparent)",
          opacity: reduced ? 0.15 : undefined,
          transform: reduced
            ? "translate(-50%,-50%) scale(0.55)"
            : undefined,
        }}
      >
        <img
          src={salaImg}
          alt=""
          aria-hidden
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.6) saturate(0.85)" }}
        />
      </div>

      {/* Etichette + closing */}
      <div
        ref={labelsRef}
        className="absolute inset-0 z-20 flex flex-col justify-between px-6 md:px-14 py-16 md:py-24"
        style={{ opacity: reduced ? 1 : undefined }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto w-full">
          {[
            { n: "01", nome: "ALLEVAMENTO" },
            { n: "02", nome: "CASEIFICIO" },
            { n: "03", nome: "MACELLERIA" },
            { n: "04", nome: "AGRITURISMO" },
          ].map((l) => (
            <div
              key={l.nome}
              className="border-t border-[color:var(--crema)]/40 pt-3"
              style={{ color: "var(--crema)" }}
            >
              <div className="font-eyebrow text-[10px] tracking-[0.3em] opacity-70">{l.n}</div>
              <div className="font-eyebrow text-xs md:text-sm tracking-[0.25em]">{l.nome}</div>
            </div>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <h2
            className="font-display leading-[1.02] text-[clamp(2.2rem,5vw,4.5rem)]"
            style={{ fontWeight: 300, color: "var(--crema)" }}
          >
            Quattro mestieri.
            <br />
            <em className="italic" style={{ color: "color-mix(in oklab, var(--oro) 85%, var(--crema))" }}>
              Un solo luogo.
            </em>
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="font-eyebrow tracking-[0.25em] text-sm px-8 py-4"
              style={{
                background: "var(--crema)",
                color: "var(--carbone)",
                minHeight: 54,
              }}
            >
              TORNA ALLA HOME
            </Link>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-eyebrow tracking-[0.25em] text-sm px-8 py-4"
              style={{
                border: "1px solid color-mix(in oklab, var(--crema) 70%, transparent)",
                color: "var(--crema)",
                minHeight: 54,
              }}
            >
              PRENOTA UN TAVOLO
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── NAV ANIME ─────────────────── */
function NavAnime({ current }: { current: "allevamento" | "caseificio" | "macelleria" | "agriturismo" }) {
  const items = [
    { key: "allevamento", n: "01", nome: "ALLEVAMENTO", sub: "La terra e gli animali", to: "/allevamento" as const },
    { key: "caseificio", n: "02", nome: "CASEIFICIO", sub: "Il bianco prende forma", to: "/caseificio" as const },
    { key: "macelleria", n: "03", nome: "MACELLERIA", sub: "La scelta avviene a vista", to: "/macelleria" as const },
    { key: "agriturismo", n: "04", nome: "AGRITURISMO", sub: "Pagina corrente", to: "/agriturismo" as const },
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

/* ─────────────────── Cleanup ScrollTrigger su unmount ─────────────────── */
// (gsap.context in ogni scena gestisce già il cleanup locale)
export default AgriturismoStory;
