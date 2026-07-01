import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import masseriaImg from "@/assets/allev-a-terra.jpg";
import bovinoImg from "@/assets/allev-p-bovino.jpg";
import ovinoImg from "@/assets/allev-p-ovino.jpg";
import suinoImg from "@/assets/allev-p-suino.jpg";
import equinoImg from "@/assets/allev-p-equino.jpg";
import avicoloImg from "@/assets/allev-p-avicolo.jpg";
import latteImg from "@/assets/case-a-latte.jpg";
import braceHands from "@/assets/brace-hands.jpg";
import braceSala from "@/assets/brace-sala.jpg";
import braceCottura from "@/assets/brace-cottura.jpg";
import braceEmbers from "@/assets/brace-embers.jpg";
import macelBanco from "@/assets/macel-banco.jpg";
import prodMozz from "@/assets/case-prod-mozzarella.jpg";
import prodRicotta from "@/assets/case-prod-ricotta.jpg";
import prodBurrata from "@/assets/case-prod-burrata.jpg";
import prodCacio from "@/assets/case-prod-caciocavallo.jpg";

/**
 * TERRA → TAVOLA
 * Un unico flusso post-hero. 6 movimenti, ciascuno con tecnica diversa,
 * cuciti dal filo d'oro che entra dall'hero ed esce verso il footer.
 */
export function TerraTavola() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger, Flip);

    const mm = gsap.matchMedia();

    // ─── Filo d'oro continuo (path SVG che si disegna lungo tutta la sequenza)
    const thread = el.querySelector<SVGPathElement>("[data-thread]");
    if (thread) {
      const len = thread.getTotalLength();
      gsap.set(thread, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(thread, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    }

    mm.add("(min-width: 768px)", () => {
      // MOV 1 · parallasse a 3 layer
      const m1 = el.querySelector<HTMLElement>("[data-mov='1']");
      if (m1) {
        gsap.to(m1.querySelector("[data-p-sky]"), {
          yPercent: -6, ease: "none",
          scrollTrigger: { trigger: m1, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.to(m1.querySelector("[data-p-mass]"), {
          yPercent: -18, ease: "none",
          scrollTrigger: { trigger: m1, start: "top bottom", end: "bottom top", scrub: true },
        });
        gsap.to(m1.querySelector("[data-p-olivi]"), {
          yPercent: -10, ease: "none",
          scrollTrigger: { trigger: m1, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      // MOV 1 · mask reveal parole
      el.querySelectorAll<HTMLElement>("[data-mov='1'] [data-word]").forEach((w, i) => {
        gsap.fromTo(w,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 0.9, delay: i * 0.05,
            ease: "cubic-bezier(.16,1,.3,1)",
            scrollTrigger: { trigger: w, start: "top 85%", once: true, invalidateOnRefresh: true },
          },
        );
      });

      // MOV 2 · numeri che si accendono
      el.querySelectorAll<HTMLElement>("[data-mov='2'] [data-stat]").forEach((s, i) => {
        gsap.fromTo(s,
          { opacity: 0.15, scale: 0.96, filter: "brightness(0.6)" },
          {
            opacity: 1, scale: 1, filter: "brightness(1)",
            duration: 0.7, delay: i * 0.08, ease: "power2.out",
            scrollTrigger: { trigger: s, start: "top 78%", once: true, invalidateOnRefresh: true },
          },
        );
      });

      // MOV 2 · card orizzontali pinnate
      const horiz = el.querySelector<HTMLElement>("[data-horiz]");
      const track = el.querySelector<HTMLElement>("[data-horiz-track]");
      if (horiz && track) {
        const distance = () => track.scrollWidth - window.innerWidth + 48;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: horiz,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.5,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // MOV 4 · tagli anatomici si accendono
      el.querySelectorAll<HTMLElement>("[data-cut]").forEach((c, i) => {
        gsap.fromTo(c,
          { opacity: 0, scale: 0.9 },
          {
            opacity: 1, scale: 1, duration: 0.5, delay: i * 0.08, ease: "power2.out",
            scrollTrigger: { trigger: c, start: "top 80%", once: true },
          },
        );
      });

      // MOV 5 · sequenza a 3 beat con Flip cross-fade
      const beats = el.querySelectorAll<HTMLElement>("[data-beat]");
      if (beats.length) {
        gsap.set(beats, { opacity: 0 });
        gsap.set(beats[0], { opacity: 1 });
        const rito = el.querySelector<HTMLElement>("[data-rito]");
        if (rito) {
          ScrollTrigger.create({
            trigger: rito,
            start: "top top",
            end: "+=200%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              const idx = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
              beats.forEach((b, i) => {
                gsap.to(b, { opacity: i === idx ? 1 : 0, duration: 0.4, overwrite: true });
              });
            },
          });
        }
      }

      return () => {};
    });

    mm.add("(max-width: 767px)", () => {
      // Mobile · reveals semplici
      el.querySelectorAll<HTMLElement>("[data-mov] [data-reveal-m]").forEach((w) => {
        gsap.fromTo(w,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: w, start: "top 88%", once: true },
          },
        );
      });
      return () => {};
    });

    const refresh = () => ScrollTrigger.refresh();
    const t = window.setTimeout(refresh, 300);

    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
  }, [reduced]);

  return (
    <section ref={root} className="relative" aria-label="Dalla terra alla tavola">
      {/* Filo d'oro continuo, tutta la sezione */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 600"
      >
        <path
          data-thread
          d="M 50 0 C 30 60, 70 120, 50 180 S 20 300, 50 360 S 80 480, 50 600"
          fill="none"
          stroke="var(--oro)"
          strokeWidth="0.15"
          opacity="0.55"
        />
      </svg>

      <Mov1 img={masseriaImg} />
      <Mov2 />
      <Mov3 img={latteImg} />
      <Mov4 />
      <Mov5 hands={braceHands} sala={braceSala} cottura={braceCottura} embers={braceEmbers} />
      <Mov6 macel={macelBanco} mozz={prodMozz} ricotta={prodRicotta} burrata={prodBurrata} cacio={prodCacio} />
    </section>
  );
}

/* ═══════════════════ MOV 1 · LA MASSERIA ═══════════════════ */
function Mov1({ img }: { img: string }) {
  return (
    <div data-mov="1" className="relative min-h-[100svh] w-full overflow-hidden">
      <div data-p-sky className="absolute inset-0" style={{ background: "linear-gradient(180deg,#0d0908,#1a1210)" }} />
      <div
        data-p-mass
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div data-p-olivi className="absolute inset-0" style={{
        background: "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(26,18,16,0.9), transparent 70%)",
      }} />
      {/* Parola-fantasma */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-display italic select-none"
        style={{ fontSize: "clamp(14rem, 36vw, 34rem)", color: "rgba(242,232,213,0.06)", lineHeight: 0.8 }}
      >
        500
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-24 md:pb-32">
        <p className="font-eyebrow mb-6 text-xs" style={{ color: "var(--oro)" }} data-reveal-m>
          LA MASSERIA · DAL 1500 · DAL 2002
        </p>
        <h2 className="font-display leading-[1.02]" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", color: "var(--crema)" }}>
          <span className="inline-flex overflow-hidden pb-[0.15em]"><span data-word>Una&nbsp;</span></span>
          <span className="inline-flex overflow-hidden pb-[0.15em]"><span data-word>masseria&nbsp;</span></span>
          <span className="inline-flex overflow-hidden pb-[0.15em]"><span data-word>del&nbsp;</span></span>
          <span className="inline-flex overflow-hidden pb-[0.15em]"><span data-word italic style={{ color: "var(--oro)" }}>Cinquecento,&nbsp;</span></span>
          <br className="hidden md:block" />
          <span className="inline-flex overflow-hidden pb-[0.15em]"><span data-word>tra&nbsp;</span></span>
          <span className="inline-flex overflow-hidden pb-[0.15em]"><span data-word>gli&nbsp;</span></span>
          <span className="inline-flex overflow-hidden pb-[0.15em]"><span data-word>ulivi&nbsp;</span></span>
          <span className="inline-flex overflow-hidden pb-[0.15em]"><span data-word>di&nbsp;</span></span>
          <span className="inline-flex overflow-hidden pb-[0.15em]"><span data-word>Noci.</span></span>
        </h2>
        <p className="mt-6 max-w-xl text-base md:text-lg" style={{ color: "rgba(242,232,213,0.7)" }} data-reveal-m>
          Oltre vent'anni di mestiere. Alleviamo, coltiviamo, trasformiamo e cuciniamo tutto qui.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════ MOV 2 · TERRA & BESTIE ═══════════════════ */
function Mov2() {
  const STATS = [
    ["CENTINAIA", "DI CAPI"],
    ["5", "SPECIE"],
    ["TUTTO", "COLTIVATO QUI"],
    ["DAL", "2002"],
  ];
  const SPECIES = [
    { img: bovinoImg, name: "BOVINI", line: "Pezzata Rossa × Frisona. Per il latte e la carne." },
    { img: ovinoImg, name: "OVINI", line: "Per la Pecora in Pignata: 5 ore nel forno a legna." },
    { img: suinoImg, name: "SUINI", line: "Per salsicce, bombette e salumi di casa." },
    { img: equinoImg, name: "EQUINI", line: "Sulla masseria, parte della vita di sempre." },
    { img: avicoloImg, name: "AVICOLI", line: "Cortile, uova, carni bianche del pascolo." },
  ];

  return (
    <div data-mov="2" className="relative" style={{ background: "var(--carbone)" }}>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <p className="font-eyebrow text-xs" style={{ color: "var(--oro)" }} data-reveal-m>
          LA TERRA · LE BESTIE
        </p>
        <h3 className="mt-4 font-display" style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "var(--crema)" }} data-reveal-m>
          I numeri veri di una masseria a filiera chiusa.
        </h3>

        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
          {STATS.map(([n, l]) => (
            <div key={n} data-stat data-reveal-m className="border-l pl-4" style={{ borderColor: "rgba(196,154,74,0.35)" }}>
              <div className="font-display leading-none" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "var(--oro)" }}>
                {n}
              </div>
              <div className="mt-2 font-eyebrow text-[0.7rem]" style={{ color: "rgba(242,232,213,0.7)" }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card-slide orizzontali (desktop pin, mobile grid vert) */}
      <div data-horiz className="relative hidden md:block h-[100svh] overflow-hidden">
        <div className="flex h-full items-center px-12">
          <div data-horiz-track className="flex gap-8">
            {SPECIES.map((s) => (
              <article key={s.name} className="w-[70vw] max-w-[520px] shrink-0 overflow-hidden rounded-lg border" style={{ borderColor: "rgba(196,154,74,0.25)" }}>
                <div className="aspect-[4/3] w-full bg-cover bg-center" style={{ backgroundImage: `url(${s.img})` }} />
                <div className="p-6" style={{ background: "rgba(26,18,16,0.75)" }}>
                  <div className="font-eyebrow text-xs" style={{ color: "var(--oro)" }}>{s.name}</div>
                  <p className="mt-2 font-display text-xl" style={{ color: "var(--crema)" }}>{s.line}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 px-6 pb-24 md:hidden">
        {SPECIES.map((s) => (
          <article key={s.name} data-reveal-m className="overflow-hidden rounded-lg border" style={{ borderColor: "rgba(196,154,74,0.25)" }}>
            <div className="aspect-[4/3] w-full bg-cover bg-center" style={{ backgroundImage: `url(${s.img})` }} />
            <div className="p-5" style={{ background: "rgba(26,18,16,0.75)" }}>
              <div className="font-eyebrow text-xs" style={{ color: "var(--oro)" }}>{s.name}</div>
              <p className="mt-2 font-display text-lg" style={{ color: "var(--crema)" }}>{s.line}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════ MOV 3 · IL LATTE ═══════════════════ */
function Mov3({ img }: { img: string }) {
  return (
    <div data-mov="3" className="relative min-h-[90svh] overflow-hidden" style={{ background: "linear-gradient(180deg,#1a1210,#2a1f1a)" }}>
      <div className="absolute inset-0 opacity-25 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />

      {/* Colonna di latte a sx */}
      <div className="pointer-events-none absolute left-8 top-0 hidden h-full w-24 md:block">
        <div className="mx-auto h-full w-2 rounded-full" style={{
          background: "linear-gradient(180deg, rgba(242,232,213,0.05), var(--crema) 30%, var(--crema) 70%, rgba(242,232,213,0.1))",
          boxShadow: "0 0 40px rgba(242,232,213,0.25)",
        }} />
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full"
            style={{
              top: `${20 + i * 25}%`,
              background: "var(--crema)",
              animation: `mdgDrip 3s ${i * 0.7}s ease-in infinite`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[90svh] max-w-6xl items-center justify-end px-6 py-24">
        <div className="max-w-xl">
          <p className="font-eyebrow text-xs" style={{ color: "var(--oro)" }} data-reveal-m>IL CASEIFICIO · KM 0</p>
          <h3 className="mt-4 font-display italic" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", color: "var(--crema)" }} data-reveal-m>
            Il latte di ogni mattina.
          </h3>
          <ul className="mt-8 space-y-3" data-reveal-m>
            {["Mozzarelle km0", "Nodini", "Primo sale", "Ricotta"].map((p) => (
              <li key={p} className="flex items-baseline gap-3">
                <span className="font-display text-lg" style={{ color: "var(--crema)" }}>{p}</span>
                <span className="flex-1 border-b border-dotted opacity-40" style={{ borderColor: "var(--oro)" }} />
                <span className="font-eyebrow text-[0.7rem]" style={{ color: "var(--oro)" }}>DI CASA</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`@keyframes mdgDrip { 0%{transform:translate(-50%,0);opacity:0} 20%{opacity:1} 100%{transform:translate(-50%,60vh);opacity:0} }`}</style>
    </div>
  );
}

/* ═══════════════════ MOV 4 · LA CARNE A VISTA ═══════════════════ */
function Mov4() {
  const CUTS = [
    { x: 42, y: 38, label: "FILETTO · frollatura ~15 giorni" },
    { x: 60, y: 45, label: "BOMBETTE" },
    { x: 30, y: 55, label: "SALSICCIA" },
    { x: 70, y: 62, label: "SOPRESSATA" },
    { x: 48, y: 70, label: "PANCETTA TESA" },
  ];
  return (
    <div data-mov="4" className="relative min-h-[100svh] overflow-hidden" style={{ background: "var(--carbone)" }}>
      <div className="mx-auto grid min-h-[100svh] max-w-6xl grid-cols-1 items-center gap-12 px-6 py-24 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-eyebrow text-xs" style={{ color: "var(--oro)" }} data-reveal-m>LA MACELLERIA · A VISTA</p>
          <h3 className="mt-4 font-display" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--crema)" }} data-reveal-m>
            Ogni taglio si traccia al pascolo.
          </h3>
          <p className="mt-4 max-w-md text-base" style={{ color: "rgba(242,232,213,0.7)" }} data-reveal-m>
            Frollatura di circa 15 giorni, salumi di casa: prosciutto crudo, sopressata, salsiccia secca, pancetta tesa. Niente arriva da fuori.
          </p>
        </div>

        {/* Diagramma bovino */}
        <div className="relative aspect-[4/3] w-full">
          <svg viewBox="0 0 100 75" className="h-full w-full">
            {/* Sagoma stilizzata */}
            <path
              d="M15 45 Q10 30 20 25 Q25 15 40 18 Q55 12 70 20 Q88 22 90 40 Q92 55 82 58 L78 62 L74 58 L60 60 L46 62 L32 60 L28 62 L24 58 Q16 55 15 45 Z"
              fill="none" stroke="var(--oro)" strokeWidth="0.4" opacity="0.6"
            />
            <circle cx="82" cy="30" r="4" fill="none" stroke="var(--oro)" strokeWidth="0.3" opacity="0.6" />
            {CUTS.map((c, i) => (
              <g key={i} data-cut>
                <circle cx={c.x} cy={c.y} r="2.4" fill="var(--terracotta)" opacity="0.9">
                  <animate attributeName="r" values="2.4;2.9;2.4" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx={c.x} cy={c.y} r="4" fill="var(--terracotta)" opacity="0.25" />
              </g>
            ))}
          </svg>
          <ul className="mt-6 grid grid-cols-1 gap-2 md:grid-cols-2">
            {CUTS.map((c) => (
              <li key={c.label} data-cut className="flex items-center gap-2 font-eyebrow text-[0.7rem]" style={{ color: "var(--crema)" }}>
                <span className="inline-block h-[6px] w-[6px] rounded-full" style={{ background: "var(--terracotta)" }} />
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ MOV 5 · IL RITO DELLA BRACE ═══════════════════ */
function Mov5({ hands, sala, cottura, embers }: { hands: string; sala: string; cottura: string; embers: string }) {
  return (
    <div data-rito className="relative h-[100svh] overflow-hidden" style={{ background: "#0a0605" }}>
      {[
        { img: hands, label: "01 · SCEGLI AL BANCO" },
        { img: sala, label: "02 · TI SIEDI" },
        { img: cottura, label: "03 · ARRIVA ALLA BRACE" },
      ].map((b, i) => (
        <div key={i} data-beat className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${b.img})` }} />
          <div className="absolute inset-0" style={{
            background: i === 2
              ? "radial-gradient(ellipse 60% 40% at 50% 70%, rgba(179,58,26,0.55), rgba(10,6,5,0.9) 70%)"
              : "linear-gradient(180deg, rgba(10,6,5,0.3), rgba(10,6,5,0.85))",
          }} />
          <p className="absolute left-8 top-8 font-eyebrow text-xs md:left-12 md:top-12" style={{ color: "var(--oro)" }}>
            {b.label}
          </p>
        </div>
      ))}

      {/* Frase finale sul fumo (visibile durante beat 3) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-16 z-10 flex justify-center px-6">
        <p className="max-w-2xl text-center font-display italic" style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)", color: "var(--crema)", textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}>
          Non cucini tu. Non aspetti un numero. <br className="hidden md:block" />
          Scegli la carne. Ti siedi. Te la portano cotta sulla brace a carboni.
        </p>
      </div>

      {/* Brace pulsante decorativa */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{
        background: `url(${embers}) center/cover`,
        opacity: 0.35,
        mixBlendMode: "screen",
        animation: "mdgEmber 3s ease-in-out infinite",
      }} />
      <style>{`@keyframes mdgEmber { 0%,100%{opacity:.3} 50%{opacity:.55} }`}</style>
    </div>
  );
}

/* ═══════════════════ MOV 6 · LA TAVOLA & INVITO ═══════════════════ */
function Mov6({ macel, mozz, ricotta, burrata, cacio }: {
  macel: string; mozz: string; ricotta: string; burrata: string; cacio: string;
}) {
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const smoothVel = useSpring(vel, { damping: 40, stiffness: 200 });
  const tilt = useTransform(smoothVel, [-2000, 0, 2000], [-3, 0, 3]);

  const PLATES = [
    { img: mozz, title: "Antipasto", desc: "Salumi e formaggi propri, frittelle del nostro grano, ricotta piccante, zucchine marinate." },
    { img: cacio, title: "Polpettine al sugo", desc: "Spezzatino di vitello e maiale." },
    { img: macel, title: "Pecora in Pignata", desc: "5 ore nel forno a legna, pignata chiusa con pasta di pane." },
    { img: burrata, title: "Alla brace", desc: "Bombette, salsiccia, filetto al sangue." },
    { img: ricotta, title: "Dolcini artigianali", desc: "Fine pasto, di casa." },
  ];

  const REVIEWS = [
    "L'antipasto non finisce mai.",
    "Le mozzarelle km0 sono sublimi.",
    "Tutto di loro produzione.",
    "Pietra bianca, molto bella davvero.",
  ];

  return (
    <div data-mov="6" className="relative" style={{ background: "linear-gradient(180deg,#1a1210,#0d0908)" }}>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <p className="font-eyebrow text-xs" style={{ color: "var(--oro)" }} data-reveal-m>LA TAVOLA · IL RITO</p>
        <h3 className="mt-4 max-w-3xl font-display" style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", color: "var(--crema)" }} data-reveal-m>
          La cena arriva a tavola come esce dalla nostra terra.
        </h3>

        {/* Mosaico piatti */}
        <div className="mt-16 grid grid-cols-6 gap-4 md:gap-6">
          {PLATES.map((p, i) => {
            const spans = [
              "col-span-6 md:col-span-4 md:row-span-2 aspect-[4/3]",
              "col-span-3 md:col-span-2 aspect-square",
              "col-span-3 md:col-span-2 aspect-square",
              "col-span-6 md:col-span-3 aspect-[16/10]",
              "col-span-6 md:col-span-3 aspect-[16/10]",
            ];
            return (
              <motion.article
                key={p.title}
                data-reveal-m
                style={{ rotate: i % 2 === 0 ? tilt : useTransform(tilt, (v) => -v) }}
                className={`relative overflow-hidden rounded-lg border ${spans[i]}`}
              >
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" style={{ backgroundImage: `url(${p.img})` }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,transparent 40%, rgba(10,6,5,0.85))" }} />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="font-display text-xl" style={{ color: "var(--crema)" }}>{p.title}</div>
                  <p className="mt-1 text-sm" style={{ color: "rgba(242,232,213,0.75)" }}>{p.desc}</p>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Recensioni fluttuanti */}
        <div className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2">
          {REVIEWS.map((r, i) => (
            <motion.blockquote
              key={r}
              data-reveal-m
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="border-l-2 pl-6"
              style={{ borderColor: "var(--oro)" }}
            >
              <p className="font-display italic" style={{ fontSize: "clamp(1.15rem, 1.6vw, 1.5rem)", color: "var(--crema)" }}>
                &ldquo;{r}&rdquo;
              </p>
              <footer className="mt-2 font-eyebrow text-[0.7rem]" style={{ color: "rgba(196,154,74,0.85)" }}>
                — Tripadvisor · 4.3 · 350 recensioni
              </footer>
            </motion.blockquote>
          ))}
        </div>

        {/* CTA finale */}
        <div className="mt-24 flex flex-col items-center gap-6 border-t pt-16 text-center" style={{ borderColor: "rgba(196,154,74,0.25)" }}>
          <motion.a
            href="tel:+393339395750"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 rounded-full px-10 py-5 font-eyebrow text-sm shadow-2xl"
            style={{ background: "var(--grad-brace)", color: "var(--crema)", boxShadow: "0 0 40px rgba(179,58,26,0.4)" }}
          >
            Prenota un tavolo →
          </motion.a>
          <div className="grid grid-cols-1 gap-2 text-center text-sm md:grid-cols-3 md:gap-8" style={{ color: "rgba(242,232,213,0.75)" }}>
            <div>Mer–Sab cena · Domenica e festivi pranzo</div>
            <div>333 939 5750 · 333 387 0292</div>
            <div>SP237 ex SS377 per Mottola km 6,5 · Noci (BA)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
