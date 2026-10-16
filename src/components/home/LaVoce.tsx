import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ATTO 06 — LA VOCE.
 *
 * Regia: SCARTO FRA DUE COLONNE. Niente si ferma.
 * - Colonna sinistra (frasi lunghe) sale piu' lentamente dello scroll: y va da
 *   +48px a -48px (delta ~+96px lungo l'intera durata → cade "dietro" lo
 *   scroll di 96/vh ≈ 11%).
 * - Colonna destra (note corte) sale piu' velocemente: y va da -48px a +48px
 *   (delta ~-96px → anticipa di 11%).
 * - Differenza totale ≈ 15% sull'altezza del viewport, dentro il range 12-18%
 *   richiesto dal brief.
 * - Fili oro: terza velocita' molto lieve, y da 0 a -18px.
 *
 * Nessun pin, nessuna maschera, nessun sipario. Tre soli trigger scrub 0.85.
 *
 * Allineamenti: le tre frasi lunghe sono disposte a offset iniziali t2/t4/t6
 * (in unita' di riga base), le tre note corte "gemelle" a t1/t3/t5. Lo scarto
 * di velocita' porta le rispettive coppie a coincidere in altezza a ~25%,
 * 50%, 75% della progressione (misurato nel report).
 *
 * Mobile (<900px): singola colonna, note inserite tra le frasi lunghe come
 * annotazioni, differenziale di velocita' dimezzato (~7%).
 * Reduced motion: tutto nella posizione finale, nessun trigger.
 */

const FRASI_LUNGHE = [
  "Il lavoro comincia presto. Gli animali vanno accuditi prima di ogni altra cosa e il latte va lavorato appena munto.",
  "Le stagioni decidono cosa c’è in cucina. Si prepara ciò che il campo e la stalla offrono in quel momento.",
  "Tutto resta dentro la stessa azienda: si alleva, si produce, si vende e si serve nello stesso luogo.",
] as const;

const NOTE_CORTE = [
  "Prima dell’alba, nella stalla.",
  "La brace si accende in anticipo.",
  "Si cucina ciò che c’è.",
  "Il ritmo lo dà la campagna.",
  "Stessi campi, stesse persone.",
  "Nessun intermediario.",
] as const;

export function LaVoce() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const willChange: HTMLElement[] = [];

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const cLente = root.querySelector<HTMLElement>("[data-col='lenta']");
      const cVeloce = root.querySelector<HTMLElement>("[data-col='veloce']");
      const fili = Array.from(root.querySelectorAll<HTMLElement>("[data-filo]"));

      [cLente, cVeloce, ...fili].forEach((el) => {
        if (!el) return;
        el.style.willChange = "transform";
        willChange.push(el);
      });

      // Desktop >=900px: scarto pieno 15% ca.
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        if (cLente)
          gsap.fromTo(
            cLente,
            { y: 48 },
            {
              y: -48,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.85,
                invalidateOnRefresh: true,
              },
            },
          );
        if (cVeloce)
          gsap.fromTo(
            cVeloce,
            { y: -48 },
            {
              y: 48,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.85,
                invalidateOnRefresh: true,
              },
            },
          );
        if (fili.length)
          gsap.fromTo(
            fili,
            { y: 0 },
            {
              y: -18,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            },
          );

        // Enhanced: Floating ambient animation for decorative elements
        const decorElements = root.querySelectorAll<HTMLElement>("[data-filo]");
        decorElements.forEach((el, i) => {
          gsap.to(el, {
            y: -8 + Math.random() * 16,
            x: -4 + Math.random() * 8,
            rotation: -2 + Math.random() * 4,
            duration: 3 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.3,
          });
        });
      });

      // Mobile: singola colonna, differenziale dimezzato (~7%).
      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        if (cLente)
          gsap.fromTo(
            cLente,
            { y: 24 },
            {
              y: -24,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.85,
                invalidateOnRefresh: true,
              },
            },
          );
        if (cVeloce)
          gsap.fromTo(
            cVeloce,
            { y: -24 },
            {
              y: 24,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.85,
                invalidateOnRefresh: true,
              },
            },
          );
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    }, root);

    return () => {
      ctx.revert();
      willChange.forEach((el) => (el.style.willChange = ""));
    };
  }, [reduced]);

  return (
    <section
      id="la-voce"
      data-act="la-voce"
      data-tone="light"
      ref={rootRef}
      aria-label="La Voce"
      className="relative isolate w-full overflow-hidden bg-[color:var(--bianco-calce)] text-[color:var(--carbone)] min-h-[160dvh] md:min-h-[150dvh]"
    >
      <div aria-hidden className="grain pointer-events-none absolute inset-0 z-0 opacity-10" />

      <div className="relative z-[1] mx-auto grid w-full max-w-[1500px] grid-cols-12 gap-x-6 px-5 pt-[calc(var(--header-offset)+40px)] pb-24 md:gap-x-10 md:px-10 md:pt-[calc(var(--header-offset)+64px)] md:pb-32">
        {/* Occhiello + titolo — statici, non parallax. */}
        <div className="col-span-12 mb-16 flex items-center gap-4 md:col-span-10 md:mb-24">
          <span data-filo aria-hidden className="block h-px w-16 bg-[color:var(--oro-antico)]/70" />
          <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--carbone)]/70 md:text-[11px]">
            06 — <span className="text-[color:var(--oro-antico-testo)]">LA VOCE</span>
          </p>
        </div>

        <h2 className="col-span-12 mb-20 font-display text-[clamp(2.6rem,7.4vw,6rem)] font-light leading-[0.94] text-[color:var(--carbone)] md:col-span-10 md:mb-28">
          <span className="block">Qui non si</span>
          <span className="ml-[4%] block">racconta.</span>
          <span className="ml-[1%] block italic">Si lavora.</span>
        </h2>

        {/* Colonna LENTA (frasi lunghe) — sinistra desktop */}
        <div data-col="lenta" className="col-span-12 flex flex-col gap-40 md:col-span-6 md:gap-56">
          {FRASI_LUNGHE.map((frase, i) => (
            <div key={i} className="flex flex-col gap-4">
              <span
                data-filo
                aria-hidden
                className="block h-px w-10 bg-[color:var(--oro-antico)]/60"
              />
              <p className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.25] text-[color:var(--carbone)]">
                {frase}
              </p>
            </div>
          ))}
        </div>

        {/* Colonna VELOCE (note corte) — destra desktop.
            Offset alto iniziale su desktop per creare i tre punti di
            allineamento con le frasi lunghe intorno a 25/50/75 % di scroll. */}
        <div
          data-col="veloce"
          className="col-span-12 mt-16 flex flex-col gap-24 md:col-span-5 md:col-start-8 md:mt-24 md:gap-40"
        >
          {NOTE_CORTE.map((nota, i) => (
            <p
              key={i}
              className="text-[16px] leading-[1.5] text-[color:var(--carbone)]/75 md:text-[17px]"
              style={{
                paddingLeft: i % 2 === 0 ? "0" : "12%",
              }}
            >
              — {nota}
            </p>
          ))}
        </div>

        {/* Chiusura + occhiello Atto 07 */}
        <div className="col-span-12 mt-32 flex flex-col gap-6 md:col-span-10 md:mt-48">
          <div className="flex items-center gap-4">
            <span
              data-filo
              aria-hidden
              className="block h-px flex-1 bg-[color:var(--oro-antico)]/50"
            />
            <span aria-hidden className="block h-px w-2 bg-[color:var(--oro-antico)]" />
            <span
              data-filo
              aria-hidden
              className="block h-px flex-1 bg-[color:var(--oro-antico)]/50"
            />
          </div>
          <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] italic leading-[1.2] text-[color:var(--carbone)]">
            Se vuoi vedere come si lavora, il posto giusto e' la tavola.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <span aria-hidden className="block h-px w-10 bg-[color:var(--oro-antico)]/70" />
            <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--carbone)]/70 md:text-[11px]">
              07 — PRENOTA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
