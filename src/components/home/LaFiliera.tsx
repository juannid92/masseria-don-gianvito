import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ATTO 04 — LA FILIERA. Nuova veste: bianco calce dominante, filo dorato,
 * sdoppiamento latte/carminio, riunione oro. Nessuna finta materia:
 * solo bianco pieno, grana finissima, luce direzionale tenue lungo il filo,
 * e una campitura pietra-800 riservata al solo momento della riunione.
 * Regia, path, timeline, trigger, copy, pin: invariati.
 */

type NodoId = "terra" | "animali" | "trasformazione" | "tavola";

type Nodo = {
  id: NodoId;
  n: string;
  occhiello: string;
  titolo: string[];
  testo?: string;
  testoLatte?: string;
  testoCarne?: string;
};

const NODI: Nodo[] = [
  {
    id: "terra",
    n: "01",
    occhiello: "01 · LA TERRA",
    titolo: ["Prima si coltiva."],
    testo:
      "Foraggio, grano tenero, ortaggi e frutta crescono nei terreni della masseria. La farina del grano diventa focaccia e frittelle.",
  },
  {
    id: "animali",
    n: "02",
    occhiello: "02 · GLI ANIMALI",
    titolo: ["Poi si alleva."],
    testo:
      "Bovini, ovini, suini, equini e avicoli crescono qui. I bovini sono un incrocio tra Pezzata Rossa e Frisona, per il latte e per la carne.",
  },
  {
    id: "trasformazione",
    n: "03",
    occhiello: "03 · LA TRASFORMAZIONE",
    titolo: ["Il latte prende una strada.", "La carne ne prende un'altra."],
    testoLatte:
      "Il latte munto ogni mattina passa al caseificio e diventa mozzarella, nodini, primo sale e ricotta.",
    testoCarne:
      "La carne passa in macelleria, dove viene esposta e scelta a vista, insieme ai salumi della masseria.",
  },
  {
    id: "tavola",
    n: "04",
    occhiello: "04 · LA TAVOLA",
    titolo: ["E tutto finisce", "allo stesso tavolo."],
    testo:
      "Formaggi, salumi, piatti di cucina e carne alla brace arrivano in sala. È lo stesso luogo, arrivato alla fine del suo percorso.",
  },
];

// Path del filo, coordinate in viewBox 400×3800 (preserveAspectRatio="none").
// Ingresso dal solco dell'Atto 03: y=0, x≈396 (riscalato dall'endpoint 1240/1200).
const D_MAIN =
  "M 396 0 C 340 220, 180 320, 100 520 C 40 700, 40 900, 120 1080 C 220 1280, 320 1360, 300 1560 C 280 1780, 230 1980, 200 2200";
const D_LATTE = "M 200 2200 C 180 2380, 140 2560, 132 2760 C 130 2820, 150 2870, 200 2920";
const D_CARNE = "M 200 2200 C 220 2380, 260 2560, 268 2760 C 270 2820, 250 2870, 200 2920";
const D_ORO =
  "M 200 2920 C 200 3040, 200 3160, 200 3300 C 200 3480, 200 3640, 200 3800";

export function LaFiliera() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const main = root.querySelector<SVGPathElement>("[data-filo='main']");
      const latte = root.querySelector<SVGPathElement>("[data-filo='latte']");
      const carne = root.querySelector<SVGPathElement>("[data-filo='carne']");
      const oro = root.querySelector<SVGPathElement>("[data-filo='oro']");
      const dots = Array.from(root.querySelectorAll<SVGCircleElement>("[data-dot]"));
      if (!main || !latte || !carne || !oro) return;

      const setup = (p: SVGPathElement) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        return len;
      };
      setup(main);
      setup(latte);
      setup(carne);
      setup(oro);
      dots.forEach((d) => gsap.set(d, { opacity: 0, scale: 0.6, transformOrigin: "center" }));

      // UN SOLO trigger locale per il filo. Nodi e testi hanno ScrollTriggers
      // separati sul proprio article per il reveal — max 5 in totale.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      // Fase A · disegno del filo principale (terra + animali), oliva → marrone
      tl.to(main, { strokeDashoffset: 0, duration: 0.55 }, 0);
      // Il dot terra si accende quando il filo lo raggiunge (~progress 0.15)
      tl.to(dots[0], { opacity: 1, scale: 1, duration: 0.04 }, 0.15);
      // Il dot animali (~progress 0.4)
      tl.to(dots[1], { opacity: 1, scale: 1, duration: 0.04 }, 0.4);

      // Fase B · SDOPPIAMENTO — latte a sinistra (crema), carne a destra (bordeaux)
      tl.to(latte, { strokeDashoffset: 0, duration: 0.2 }, 0.55);
      tl.to(carne, { strokeDashoffset: 0, duration: 0.2 }, 0.55);
      // Segno visivo della biforcazione
      tl.to(dots[2], { opacity: 1, scale: 1, duration: 0.04 }, 0.58);

      // Fase C · CONVERGENZA in oro fino alla tavola
      tl.to(oro, { strokeDashoffset: 0, duration: 0.22 }, 0.76);
      tl.to(dots[3], { opacity: 1, scale: 1, duration: 0.04 }, 0.92);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const statico = reduced;
  // Reduced motion: paths interamente disegnati (nessun dashoffset).
  const staticStroke = statico
    ? { strokeDasharray: undefined as string | undefined, strokeDashoffset: undefined as number | undefined }
    : {};

  return (
    <section
      id="filiera"
      data-act="filiera"
      ref={rootRef}
      aria-label="La Filiera"
      className="relative isolate w-full bg-[color:var(--bianco-calce)] [@media(min-width:900px)]:min-h-[380dvh]"
    >
      {/* Fondo bianco calce pieno — nessuna finta materia. Sola concessione:
          una luce direzionale tenue che segue la colonna del filo, per dare
          rilievo senza colorare la superficie. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 40% at 26% 12%, color-mix(in oklab, var(--oro-antico) 8%, transparent) 0%, transparent 70%), radial-gradient(50% 35% at 74% 58%, color-mix(in oklab, var(--oro-antico) 6%, transparent) 0%, transparent 70%), radial-gradient(50% 30% at 50% 92%, color-mix(in oklab, var(--pietra-800) 10%, transparent) 0%, transparent 72%)",
        }}
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 z-0 opacity-30" />

      {/* Il filo — un unico SVG che copre tutta la sezione */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        viewBox="0 0 400 3800"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Filo principale — oro antico costante, la luce direzionale dello
              sfondo dà la variazione senza sporcare la tinta. */}
          <linearGradient id="filo-main" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b2833a" />
            <stop offset="100%" stopColor="#b2833a" />
          </linearGradient>
          {/* Filtro discreto per rendere leggibile il tratto bianco-latte
              sul fondo bianco-calce: sola ombra minima, nessun glow. */}
          <filter id="filo-latte-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.2"
              floodColor="#1f1a15" floodOpacity="0.18" />
          </filter>
        </defs>
        <path
          data-filo="main"
          d={D_MAIN}
          fill="none"
          stroke="url(#filo-main)"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={staticStroke}
        />
        <path
          data-filo="latte"
          d={D_LATTE}
          fill="none"
          stroke="#fffdf7"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#filo-latte-shadow)"
          style={staticStroke}
        />
        <path
          data-filo="carne"
          d={D_CARNE}
          fill="none"
          stroke="#9b2233"
          strokeWidth="2.4"
          strokeLinecap="round"
          style={staticStroke}
        />
        <path
          data-filo="oro"
          d={D_ORO}
          fill="none"
          stroke="#b2833a"
          strokeWidth="4"
          strokeLinecap="round"
          style={staticStroke}
        />
        {/* Nodi lungo il filo */}
        <circle data-dot cx="100" cy="520" r="7" fill="#b2833a" style={statico ? { opacity: 1 } : undefined} />
        <circle data-dot cx="300" cy="1560" r="7" fill="#b2833a" style={statico ? { opacity: 1 } : undefined} />
        <circle data-dot cx="200" cy="2200" r="8" fill="#b2833a" style={statico ? { opacity: 1 } : undefined} />
        <circle data-dot cx="200" cy="3400" r="9" fill="#b2833a" style={statico ? { opacity: 1 } : undefined} />
      </svg>

      {/* Contenuti — 4 nodi in flusso normale, lato alternato rispetto al filo */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col px-5 md:px-10">
        {/* Occhiello + titolo dell'atto */}
        <header
          className="flex flex-col pb-16 pt-16 md:pt-24"
          style={{ paddingTop: "calc(var(--page-header-safe-offset) + 3vh)" }}
        >
          <motion.p
            initial={statico ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--oro-antico-testo)] md:text-[11px]"
          >
            04 — LA FILIERA
          </motion.p>
          <h2 className="mt-6 max-w-[16ch] font-display text-[clamp(2.4rem,6.6vw,5.6rem)] leading-[0.96] text-[color:var(--carbone)] md:mt-10">
            <span className="block">Dalla terra</span>
            <span className="ml-[3%] block md:ml-[7%]">alla tavola,</span>
            <span className="ml-[1%] block italic text-[color:var(--carbone)] md:ml-[3%]">
              senza uscire.
            </span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-[color:var(--carbone)]/85 md:mt-8 md:text-[17px]">
            Ogni passaggio avviene dentro la masseria. Quello che cresce nei campi nutre gli
            animali. Quello che gli animali danno passa dal caseificio e dalla macelleria. Quello
            che ne esce arriva in sala.
          </p>
        </header>

        {/* Nodo TERRA — testo a sinistra (il filo curva a sinistra) */}
        <NodoBlocco lato="left" nodo={NODI[0]} statico={statico} />
        {/* Nodo ANIMALI — testo a destra (il filo curva a destra) */}
        <NodoBlocco lato="right" nodo={NODI[1]} statico={statico} />

        {/* Nodo TRASFORMAZIONE — sdoppiamento */}
        <article
          data-node="trasformazione"
          className="relative flex min-h-[110dvh] flex-col justify-center py-24 [@media(min-width:900px)]:min-h-[140dvh]"
        >
          <motion.p
            initial={statico ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--pietra-800)]/80 md:text-[11px]"
          >
            {NODI[2].occhiello}
          </motion.p>
          <h3 className="mt-4 max-w-[22ch] font-display text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.02] text-[color:var(--carbone)]">
            <span className="block">{NODI[2].titolo[0]}</span>
            <span className="ml-[2%] block italic text-[color:var(--carbone)]">
              {NODI[2].titolo[1]}
            </span>
          </h3>
          <div className="mt-10 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-16">
            <motion.div
              initial={statico ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-[36ch] md:pl-4"
            >
              <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--pietra-800)]/80">
                IL LATTE
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-[color:var(--carbone)]/85 md:text-[17px]">
                {NODI[2].testoLatte}
              </p>
            </motion.div>
            <motion.div
              initial={statico ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-[36ch] justify-self-end md:pr-4"
            >
              <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--carminio-scuro)]">
                LA CARNE
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-[color:var(--carbone)]/85 md:text-[17px]">
                {NODI[2].testoCarne}
              </p>
            </motion.div>
          </div>
        </article>

        {/* Nodo TAVOLA — testo centrato (il filo oro passa al centro) */}
        <article
          data-node="tavola"
          className="relative flex min-h-[90dvh] flex-col items-center justify-center py-24 text-center"
        >
          <motion.p
            initial={statico ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--pietra-800)]/80 md:text-[11px]"
          >
            {NODI[3].occhiello}
          </motion.p>
          <h3 className="mt-4 max-w-[18ch] font-display text-[clamp(2rem,4.8vw,3.8rem)] leading-[1] text-[color:var(--carbone)]">
            <span className="block">{NODI[3].titolo[0]}</span>
            <span className="mt-1 block italic text-[color:var(--carbone)]">
              {NODI[3].titolo[1]}
            </span>
          </h3>
          <p className="mt-8 max-w-[46ch] text-[16px] leading-relaxed text-[color:var(--carbone)]/85 md:text-[17px]">
            {NODI[3].testo}
          </p>

          {/* Chiusura dell'atto */}
          <p className="mt-16 max-w-[30ch] font-display text-[clamp(1.2rem,2.4vw,1.8rem)] italic leading-[1.12] text-[color:var(--carbone)] md:mt-24">
            Quattro mestieri, un solo percorso.
          </p>
        </article>
      </div>

      {/* Handoff verso l'Atto 05 — unica campitura profonda ammessa nell'atto,
          riservata al momento della riunione. Non è finta materia: è pietra
          scura pulita, senza gradienti che imitano legno o cibo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[36dvh]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--bianco-calce) 60%, var(--pietra-800)) 55%, var(--pietra-800) 100%)",
        }}
      />
      <div className="relative z-10 border-t border-[color:var(--bianco-calce)]/15 bg-[color:var(--pietra-800)]">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 py-6 md:px-10 md:py-8">
          <span aria-hidden className="h-px w-10 bg-[color:var(--oro-antico)]/70" />
          <p className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--bianco-calce)]/80 md:text-[10px]">
            05 — LA TAVOLA
          </p>
        </div>
      </div>
    </section>
  );
}

/** Nodo semplice (Terra / Animali) — testo alternato ai lati del filo. */
function NodoBlocco({
  nodo,
  lato,
  statico,
}: {
  nodo: Nodo;
  lato: "left" | "right";
  statico: boolean;
}) {
  const align = lato === "left" ? "items-start text-left" : "items-end text-right md:items-end";
  return (
    <article
      data-node={nodo.id}
      className={`relative flex min-h-[90dvh] flex-col justify-center py-24 ${align}`}
    >
      <div className={lato === "right" ? "max-w-[42ch]" : "max-w-[42ch]"}>
        <motion.p
          initial={statico ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--pietra-800)]/80 md:text-[11px]"
        >
          {nodo.occhiello}
        </motion.p>
        <motion.h3
          initial={statico ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-4 font-display text-[clamp(2rem,5.2vw,4rem)] leading-[1] text-[color:var(--carbone)]"
        >
          {nodo.titolo[0]}
        </motion.h3>
        <motion.p
          initial={statico ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          className="mt-6 text-[16px] leading-relaxed text-[color:var(--carbone)]/85 md:text-[17px]"
        >
          {nodo.testo}
        </motion.p>
      </div>
    </article>
  );
}