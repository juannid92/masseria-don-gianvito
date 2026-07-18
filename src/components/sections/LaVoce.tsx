import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * 06 — LA VOCE · "Un volo nelle parole"
 * Spazio notturno editoriale. 5 onde Z, 2 frammenti per onda (sx/dx).
 * Nessuna sovrapposizione. Una sola onda leggibile alla volta.
 * Handoff dalla Tavola con 4 parole sospese. Chiusura verso Prenota.
 *
 * Verificare fonte e autorizzazione prima della pubblicazione definitiva.
 * ───────────────────────────────────────────────────────────── */

type Wave = {
  id: number;
  theme: string;
  left: { quote: string; source: string | null; sourceUrl: string | null; verified: boolean };
  right: { quote: string; source: string | null; sourceUrl: string | null; verified: boolean };
};

const WAVES: Wave[] = [
  {
    id: 1,
    theme: "Pietra",
    left: { quote: "Posto rustico, immerso nella campagna.", source: null, sourceUrl: null, verified: false },
    right: { quote: "Gli interni in pietra bianca sono davvero belli.", source: null, sourceUrl: null, verified: false },
  },
  {
    id: 2,
    theme: "Origine",
    left: { quote: "Le mozzarelle a km zero sono sublimi.", source: null, sourceUrl: null, verified: false },
    right: { quote: "Si sceglie la carne nella macelleria e poi viene cucinata.", source: null, sourceUrl: null, verified: false },
  },
  {
    id: 3,
    theme: "Abbondanza",
    left: { quote: "L’antipasto non finisce mai.", source: null, sourceUrl: null, verified: false },
    right: { quote: "Tutto spettacolare.", source: null, sourceUrl: null, verified: false },
  },
  {
    id: 4,
    theme: "Scelta",
    left: { quote: "La carne è tenerissima e molto saporita.", source: null, sourceUrl: null, verified: false },
    right: { quote: "Soprattutto la salsiccia e le bombette.", source: null, sourceUrl: null, verified: false },
  },
  {
    id: 5,
    theme: "Ospitalità",
    left: { quote: "Servizio veloce e cordiale.", source: null, sourceUrl: null, verified: false },
    right: { quote: "Prezzi onestissimi.", source: null, sourceUrl: null, verified: false },
  },
];

const TRANSITION_WORDS = ["TENERISSIMA", "KM ZERO", "CORDIALE", "SPETTACOLARE"];

/* Posizioni deterministiche (left-edge in vw, y-center in vh) per ogni card.
 * Card larga ~ min(430px, 30vw). Distanza tra centri sempre > 18vw.
 * Nessuna card entra nella zona del titolo (top ~10-20%) o del contatore (bottom ~85-95%). */
const POSITIONS: Array<{ lx: number; ly: number; rx: number; ry: number }> = [
  { lx: 10, ly: 48, rx: 62, ry: 68 }, // W1 · sx (rispetto a dx) alta, dx bassa
  { lx: 9,  ly: 68, rx: 64, ry: 32 }, // W2 · sx bassa, dx alta
  { lx: 11, ly: 52, rx: 63, ry: 46 }, // W3 · quasi centrali, distanziate
  { lx: 10, ly: 46, rx: 64, ry: 56 }, // W4 · sx alta, dx centrale
  { lx: 8,  ly: 58, rx: 66, ry: 40 }, // W5 · apertura finale
];

/* Z iniziali (spec §8) — valori controllati, no clipping. */
const WAVE_Z = [0, -700, -1400, -2100, -2800] as const;

/* Timeline map (spec §10). */
const SLOTS = [
  { start: 0.00, end: 0.08 },  // intro / handoff parole
  { start: 0.08, end: 0.25 },  // W1
  { start: 0.25, end: 0.42 },  // W2
  { start: 0.42, end: 0.59 },  // W3
  { start: 0.59, end: 0.76 },  // W4
  { start: 0.76, end: 0.93 },  // W5
  { start: 0.93, end: 1.00 },  // outro
];

/* Sotto-fasi dentro ogni slot onda (normalizzato 0..1):
 *  0.00–0.30  approach
 *  0.30–0.70  reading (hold: quasi fermo)
 *  0.70–1.00  exit
 */
function waveState(t: number) {
  // t = local progress dentro lo slot dell'onda (0..1)
  if (t <= 0) return { z: -900, scale: 0.86, opacity: 0.08, focused: false };
  if (t >= 1) return { z: 260, scale: 1.1, opacity: 0, focused: false };
  if (t < 0.3) {
    const k = t / 0.3;                       // 0..1
    const z = -900 * (1 - k) + 0 * k;
    const scale = 0.86 + 0.14 * k;
    const opacity = 0.08 + 0.92 * k;
    return { z, scale, opacity, focused: k > 0.85 };
  }
  if (t <= 0.7) {
    // reading: quasi fermo, solo microdrift
    const k = (t - 0.3) / 0.4;               // 0..1
    const z = -6 + 12 * k;                   // -6 → +6
    const scale = 1.0 + 0.01 * k;
    return { z, scale, opacity: 1, focused: true };
  }
  const k = (t - 0.7) / 0.3;                 // 0..1
  const z = 6 + 254 * k;                     // avanza oltre camera, max +260
  const scale = 1.01 + 0.09 * k;             // max 1.10 (< 1.12)
  const opacity = 1 - k;
  return { z, scale, opacity, focused: k < 0.15 };
}

export function LaVoce() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    gsap.registerPlugin(ScrollTrigger);

    let lastActive = -1;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ── DESKTOP · un solo pin, una sola timeline scrubbed ── */
      mm.add("(min-width: 768px)", () => {
        const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-card]"));
        const themes = themeRef.current
          ? Array.from(themeRef.current.querySelectorAll<HTMLElement>("[data-theme]"))
          : [];
        const bridgeWords = bridgeRef.current
          ? Array.from(bridgeRef.current.querySelectorAll<HTMLElement>("[data-tw]"))
          : [];

        // Stato iniziale card
        cards.forEach((el) => {
          const baseZ = Number(el.dataset.z || 0);
          const lx = Number(el.dataset.lx || 0);
          const ly = Number(el.dataset.ly || 50);
          el.style.left = `${lx}vw`;
          el.style.top = `${ly}vh`;
          el.style.opacity = "0";
          el.style.transform = `translate3d(0, -50%, ${baseZ}px) scale(0.86)`;
        });

        gsap.set(themes, { autoAlpha: 0 });
        gsap.set(outroRef.current, { opacity: 0, y: 20 });

        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "+=440%",
          pin: stage,
          scrub: 0.6,
          anticipatePin: 1,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            /* Intro / handoff words (0-8%) */
            const introP = Math.min(1, p / SLOTS[0].end);
            if (bridgeRef.current) {
              bridgeRef.current.style.opacity = String(Math.max(0, 1 - introP));
            }
            bridgeWords.forEach((w, i) => {
              const stagger = i * 0.15;
              const local = Math.min(1, Math.max(0, introP * 1.5 - stagger));
              const z = -400 + 400 * local;
              w.style.transform = `translate3d(0,0,${z}px)`;
            });

            /* Titolo generale: ingresso, riduzione, retreat editoriale */
            if (headingRef.current) {
              const s = gsap.utils.clamp(0.55, 1, 1 - p * 0.8);
              const op = gsap.utils.clamp(0.65, 1, 1 - p * 0.4);
              headingRef.current.style.transform = `translate3d(0,0,0) scale(${s})`;
              headingRef.current.style.transformOrigin = "top left";
              headingRef.current.style.opacity = String(op);
            }

            /* Onde */
            let currentActive = -1;
            for (let i = 0; i < WAVES.length; i++) {
              const slot = SLOTS[i + 1];
              const t = (p - slot.start) / (slot.end - slot.start);
              const state = waveState(Math.max(0, Math.min(1.0001, t)));
              if (state.focused) currentActive = i;

              const baseZ = WAVE_Z[i];
              const cardL = cards[i * 2];
              const cardR = cards[i * 2 + 1];
              const themeEl = themes[i];

              // Z corrente = baseZ interpolato verso 0 dentro lo slot
              // Prima dello slot: baseZ. Durante: state.z. Dopo: state.z (avanza).
              const effectiveZ = t <= 0 ? baseZ : state.z;

              [cardL, cardR].forEach((el) => {
                if (!el) return;
                const lx = Number(el.dataset.lx || 0);
                const ly = Number(el.dataset.ly || 50);
                el.style.left = `${lx}vw`;
                el.style.top = `${ly}vh`;
                el.style.transform = `translate3d(0,-50%,${effectiveZ}px) scale(${state.scale})`;
                el.style.opacity = String(state.opacity);
                if (state.focused) el.setAttribute("data-focused", "true");
                else el.removeAttribute("data-focused");
              });

              if (themeEl) {
                // Parola tematica: visibile solo durante lo slot, si muove più lenta
                let themeOp = 0;
                if (t > 0 && t < 1) {
                  const k = t < 0.5 ? t / 0.5 : (1 - t) / 0.5;
                  themeOp = 0.08 * k;
                }
                const themeZ = t <= 0 ? -1600 : -900 + state.z * 0.4;
                themeEl.style.opacity = String(themeOp);
                themeEl.style.transform = `translate3d(-50%,-50%,${themeZ}px)`;
              }
            }

            /* Contatore + progresso — aggiorna solo su cambio onda */
            if (currentActive !== lastActive) {
              lastActive = currentActive;
              if (counterRef.current) {
                const n = currentActive >= 0 ? currentActive + 1 : 0;
                counterRef.current.textContent = n > 0
                  ? `${String(n).padStart(2, "0")} / 05`
                  : "— / 05";
              }
            }
            if (progressRef.current) {
              // Progresso corrisponde all'onda: 0 nell'intro, 5/5 all'outro
              const wp = Math.max(0, Math.min(1, (p - SLOTS[1].start) / (SLOTS[5].end - SLOTS[1].start)));
              progressRef.current.style.setProperty("--wp", String(wp));
            }

            /* Outro (93-100%) */
            const outroP = Math.max(0, Math.min(1, (p - SLOTS[6].start) / (SLOTS[6].end - SLOTS[6].start)));
            if (outroRef.current) {
              outroRef.current.style.opacity = String(outroP);
              outroRef.current.style.transform = `translate3d(0,${(1 - outroP) * 20}px,0)`;
            }
            // durante outro appiattisco leggermente togliendo la parola tematica
            if (outroP > 0 && themes.length) {
              themes.forEach((t) => (t.style.opacity = String(Math.max(0, parseFloat(t.style.opacity || "0") * (1 - outroP)))));
            }
          },
        });
      });

      /* ── MOBILE · lettura verticale, nessun pin lungo ── */
      mm.add("(max-width: 767px)", () => {
        // Nessun 3D, nessun pin. Le card sono già nel flusso via .voce-mobile.
        const items = Array.from(root.querySelectorAll<HTMLElement>("[data-mcard]"));
        items.forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 24, scale: 0.96 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
            }
          );
        });
      });

      /* Refresh sicuro dopo mount + fonts. */
      let cancelled = false;
      const doRefresh = () => {
        if (cancelled) return;
        ScrollTrigger.refresh();
      };
      if (typeof document !== "undefined" && (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts) {
        (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts!.ready.then(doRefresh);
      } else {
        window.setTimeout(doRefresh, 500);
      }

      return () => {
        cancelled = true;
      };
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="la-voce"
      ref={rootRef}
      aria-label="La Voce — frammenti dalle recensioni"
      className="relative isolate bg-[color:var(--carbone)] text-[color:var(--crema)]"
    >
      {/* ═════════ DESKTOP · palco pinnato ═════════ */}
      <div
        ref={stageRef}
        className="voce-stage relative hidden h-[100dvh] w-full overflow-hidden md:block"
      >
        {/* linee prospettiche sottili (statiche, non 3D) */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-1/2 h-px bg-[color:var(--crema)]/[0.04]" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-[color:var(--crema)]/[0.03]" />
        </div>

        {/* Titolo generale (fuori dalla prospettiva) */}
        <div
          ref={headingRef}
          className="voce-heading absolute left-8 top-8 z-40 max-w-[30ch] lg:left-14 lg:top-12"
          style={{ willChange: "transform, opacity" }}
        >
          <p className="font-eyebrow text-[11px] uppercase tracking-[0.32em] text-[color:var(--crema)]/50">
            06 — La Voce
          </p>
          <h2 className="mt-3 font-display text-3xl leading-[1.02] text-[color:var(--crema)] lg:text-5xl">
            Quello che resta<br />
            <span className="italic text-[color:var(--oro)]">dopo la tavola.</span>
          </h2>
          <p className="mt-4 max-w-[28ch] font-display text-xs italic leading-relaxed text-[color:var(--crema)]/60 lg:text-sm">
            Frammenti lasciati da chi ha scelto, assaggiato e condiviso la Masseria.
          </p>
        </div>

        {/* Handoff parole dalla Tavola (bridge visivo, fase intro) */}
        <div
          ref={bridgeRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{ perspective: "1200px", perspectiveOrigin: "50% 50%" }}
        >
          <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
            {TRANSITION_WORDS.map((w, i) => {
              const pos = [
                { left: "18vw", top: "38vh" },
                { left: "62vw", top: "30vh" },
                { left: "14vw", top: "62vh" },
                { left: "66vw", top: "68vh" },
              ][i];
              return (
                <span
                  key={w}
                  data-tw
                  className="font-eyebrow absolute uppercase tracking-[0.32em] text-[color:var(--crema)]/35"
                  style={{
                    left: pos.left,
                    top: pos.top,
                    fontSize: "clamp(14px, 1.4vw, 20px)",
                    willChange: "transform",
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        </div>

        {/* Viewport 3D · SOLO recensioni + parole tematiche */}
        <div
          className="voce-viewport absolute inset-0 z-10"
          style={{
            perspective: "1200px",
            perspectiveOrigin: "50% 50%",
            overflow: "hidden",
          }}
        >
          <div
            className="voce-world absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Parole tematiche fantasma */}
            <div ref={themeRef} aria-hidden className="absolute inset-0">
              {WAVES.map((w) => (
                <span
                  key={`t-${w.id}`}
                  data-theme
                  className="font-eyebrow absolute left-1/2 top-1/2 whitespace-nowrap uppercase text-[color:var(--crema)]"
                  style={{
                    fontSize: "clamp(140px, 22vw, 340px)",
                    letterSpacing: "0.04em",
                    lineHeight: 0.9,
                    transform: "translate3d(-50%,-50%,-900px)",
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden",
                  }}
                >
                  {w.theme.toUpperCase()}
                </span>
              ))}
            </div>

            {/* Recensioni */}
            {WAVES.map((wave, i) => {
              const pos = POSITIONS[i];
              const z = WAVE_Z[i];
              return (
                <div key={wave.id} className="contents">
                  <ReviewCard
                    wave={wave.id}
                    side="left"
                    text={wave.left.quote}
                    source={wave.left.source}
                    sourceUrl={wave.left.sourceUrl}
                    verified={wave.left.verified}
                    lx={pos.lx}
                    ly={pos.ly}
                    z={z}
                  />
                  <ReviewCard
                    wave={wave.id}
                    side="right"
                    text={wave.right.quote}
                    source={wave.right.source}
                    sourceUrl={wave.right.sourceUrl}
                    verified={wave.right.verified}
                    lx={pos.rx}
                    ly={pos.ry}
                    z={z}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Vignette per profondità (statica) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(26,18,16,0.85) 92%)",
          }}
        />

        {/* Contatore + progresso · fuori dalla scena 3D */}
        <div className="voce-progress pointer-events-none absolute inset-x-0 bottom-8 z-40 flex items-center gap-4 px-10 lg:px-14">
          <div
            ref={progressRef}
            className="voce-progress-bar relative h-px flex-1 bg-[color:var(--crema)]/12"
            style={{ ["--wp" as string]: 0 }}
          >
            <span
              className="absolute left-0 top-0 h-px bg-[color:var(--oliva)]"
              style={{ width: "calc(var(--wp) * 100%)" }}
            />
            <span
              className="absolute -top-[3px] block h-[7px] w-[7px] rounded-full bg-[color:var(--oro)] shadow-[0_0_0_2px_rgba(26,18,16,0.9)]"
              style={{ left: "calc(var(--wp) * 100%)", transform: "translateX(-50%)" }}
            />
          </div>
          <span
            ref={counterRef}
            className="font-eyebrow tabular-nums text-[11px] uppercase tracking-[0.32em] text-[color:var(--crema)]/60"
          >
            — / 05
          </span>
        </div>

        {/* Outro / CTA verso Prenota */}
        <div
          ref={outroRef}
          className="voce-outro pointer-events-none absolute inset-x-0 top-1/2 z-30 -translate-y-1/2 px-8 text-center"
        >
          <p className="font-display text-2xl italic leading-tight text-[color:var(--crema)]/85 lg:text-4xl">
            Ogni tavolo lascia<br />
            una voce diversa.
          </p>
          <p className="mt-6 font-display text-xl leading-tight text-[color:var(--crema)] lg:text-2xl">
            Quale sarà <span className="italic text-[color:var(--oro)]">la tua?</span>
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="#prenota"
              className="pointer-events-auto group relative inline-flex items-center gap-3 border border-[color:var(--crema)]/25 px-8 py-4 font-eyebrow text-[11px] uppercase tracking-[0.4em] text-[color:var(--crema)] transition-colors hover:border-[color:var(--oro)] hover:text-[color:var(--oro)]"
            >
              Prenota un tavolo
              <span aria-hidden className="inline-block h-px w-6 bg-current transition-all group-hover:w-10" />
            </a>
          </div>
        </div>
      </div>

      {/* ═════════ MOBILE · racconto verticale editoriale ═════════ */}
      <div className="voce-mobile relative block px-5 py-24 md:hidden">
        {/* Handoff parole */}
        <div aria-hidden className="mb-14 flex flex-wrap gap-x-5 gap-y-2 opacity-60">
          {TRANSITION_WORDS.map((w) => (
            <span
              key={w}
              className="font-eyebrow text-[11px] uppercase tracking-[0.28em] text-[color:var(--crema)]/45"
            >
              {w}
            </span>
          ))}
        </div>

        <p className="font-eyebrow text-[11px] uppercase tracking-[0.32em] text-[color:var(--crema)]/55">
          06 — La Voce
        </p>
        <h2 className="mt-3 font-display text-[38px] leading-[1.02]">
          Quello che resta<br />
          <span className="italic text-[color:var(--oro)]">dopo la tavola.</span>
        </h2>
        <p className="mt-4 max-w-[36ch] font-display text-[15px] italic leading-relaxed text-[color:var(--crema)]/65">
          Frammenti lasciati da chi ha scelto, assaggiato e condiviso la Masseria.
        </p>

        <ol className="mt-16 space-y-20">
          {WAVES.map((wave, i) => {
            const odd = i % 2 === 0;
            return (
              <li key={wave.id} className="relative">
                <div className="mb-6 flex items-baseline gap-4">
                  <span className="font-eyebrow text-[11px] uppercase tracking-[0.32em] text-[color:var(--oro)]">
                    {String(wave.id).padStart(2, "0")} / 05
                  </span>
                  <span
                    className="font-eyebrow flex-1 truncate uppercase tracking-[0.28em] text-[color:var(--crema)]/25"
                    style={{ fontSize: "clamp(22px, 8vw, 40px)" }}
                  >
                    {wave.theme.toUpperCase()}
                  </span>
                </div>

                <div
                  data-mcard
                  className={`voce-mcard relative ml-0 mr-auto max-w-[90%] border border-[color:var(--crema)]/12 bg-[color:var(--carbone)]/60 px-6 py-6 ${odd ? "" : "ml-auto mr-0 text-right"}`}
                  style={{ willChange: "transform, opacity" }}
                >
                  <blockquote
                    className="font-display italic leading-[1.14] text-[color:var(--crema)]"
                    style={{ fontSize: "clamp(22px, 6.8vw, 30px)" }}
                  >
                    <span className="text-[color:var(--oro)]">“</span>
                    {wave.left.quote}
                    <span className="text-[color:var(--oro)]">”</span>
                  </blockquote>
                  <SourceLine data={wave.left} />
                </div>

                <div
                  data-mcard
                  className={`voce-mcard relative mt-8 max-w-[86%] border border-[color:var(--crema)]/12 bg-[color:var(--carbone)]/60 px-6 py-6 ${odd ? "ml-auto mr-0 text-right" : ""}`}
                  style={{ willChange: "transform, opacity" }}
                >
                  <blockquote
                    className="font-display italic leading-[1.14] text-[color:var(--crema)]"
                    style={{ fontSize: "clamp(22px, 6.8vw, 30px)" }}
                  >
                    <span className="text-[color:var(--oro)]">“</span>
                    {wave.right.quote}
                    <span className="text-[color:var(--oro)]">”</span>
                  </blockquote>
                  <SourceLine data={wave.right} />
                </div>
              </li>
            );
          })}
        </ol>

        {/* Outro mobile */}
        <div className="mt-24 border-t border-[color:var(--crema)]/10 pt-14 text-center">
          <p className="font-display text-2xl italic leading-tight text-[color:var(--crema)]/85">
            Ogni tavolo lascia<br />
            una voce diversa.
          </p>
          <p className="mt-5 font-display text-xl">
            Quale sarà <span className="italic text-[color:var(--oro)]">la tua?</span>
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="#prenota"
              className="inline-flex items-center gap-3 border border-[color:var(--crema)]/25 px-6 py-4 font-eyebrow text-[11px] uppercase tracking-[0.4em] text-[color:var(--crema)]"
            >
              Prenota un tavolo
              <span aria-hidden className="inline-block h-px w-5 bg-current" />
            </a>
          </div>
        </div>

        <p className="mt-10 text-center font-eyebrow text-[10px] uppercase tracking-[0.32em] text-[color:var(--crema)]/35">
          Frammenti dalle recensioni
        </p>
      </div>

      {/* Reduced-motion fallback: mostra sempre la versione verticale */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .voce-stage { display: none !important; }
          .voce-mobile { display: block !important; }
        }
        .voce-card {
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
        .voce-card[data-focused="true"] .voce-quote {
          color: var(--crema);
        }
      `}</style>
    </section>
  );
}

/* ───────────── card recensione (desktop 3D) ───────────── */
function ReviewCard({
  wave,
  side,
  text,
  source,
  sourceUrl,
  verified,
  lx,
  ly,
  z,
}: {
  wave: number;
  side: "left" | "right";
  text: string;
  source: string | null;
  sourceUrl: string | null;
  verified: boolean;
  lx: number;
  ly: number;
  z: number;
}) {
  return (
    <figure
      data-card
      data-wave={wave}
      data-side={side}
      data-lx={lx}
      data-ly={ly}
      data-z={z}
      className="voce-card absolute z-10 w-[min(430px,30vw)] border border-[color:var(--crema)]/12 bg-[color:var(--carbone)]/72 px-8 py-8 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.9)]"
      style={{
        textAlign: side === "left" ? "left" : "right",
        willChange: "transform, opacity",
      }}
    >
      <div
        className="absolute h-px w-8 bg-[color:var(--oliva)]/70"
        style={{
          top: 24,
          left: side === "left" ? 32 : "auto",
          right: side === "right" ? 32 : "auto",
        }}
      />
      <blockquote
        className="voce-quote font-display italic leading-[1.14] text-[color:var(--crema)]"
        style={{
          fontSize: "clamp(26px, 2.15vw, 38px)",
          letterSpacing: "-0.005em",
        }}
      >
        <span className="text-[color:var(--oro)]">“</span>
        {text}
        <span className="text-[color:var(--oro)]">”</span>
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 font-eyebrow text-[10px] uppercase tracking-[0.32em] text-[color:var(--crema)]/45"
        style={{ justifyContent: side === "right" ? "flex-end" : "flex-start" }}
      >
        <span>{String(wave).padStart(2, "0")} / 05</span>
        {verified && source ? (
          sourceUrl ? (
            <>
              <span aria-hidden>·</span>
              <a href={sourceUrl} target="_blank" rel="noreferrer" className="hover:text-[color:var(--oro)]">
                {source}
              </a>
            </>
          ) : (
            <>
              <span aria-hidden>·</span>
              <span>{source}</span>
            </>
          )
        ) : null}
      </figcaption>
    </figure>
  );
}

/* ───────────── source line mobile ───────────── */
function SourceLine({
  data,
}: {
  data: { source: string | null; sourceUrl: string | null; verified: boolean };
}) {
  if (!data.verified || !data.source) return null;
  return (
    <figcaption className="mt-3 font-eyebrow text-[10px] uppercase tracking-[0.32em] text-[color:var(--crema)]/45">
      {data.sourceUrl ? (
        <a href={data.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-[color:var(--oro)]">
          {data.source}
        </a>
      ) : (
        data.source
      )}
    </figcaption>
  );
}
