import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ATTO 04 — LA FILIERA.
 * Firma: FILO · MATERIA CHE CAMBIA · CONTINUITÀ.
 * Regia: un unico tracciato SVG che si disegna con lo scroll, attraversa
 * tutta la sezione, si sdoppia (crema per il latte, bordeaux per la carne)
 * e si riunisce in oro fino alla tavola. Nessun pin, nessuno sticky a
 * piena altezza, nessun traveling orizzontale.
 *
 * Il path parte dall'endpoint destro del solco chiuso dall'Atto 03
 * (viewBox 1200×300, x=1240, y≈230 → qui riscalato in viewBox 400×3800).
 * Il fondo di partenza è var(--marrone), identico al fondo finale del 03.
 *
 * Sostituire eventuali crop/texture provvisori con fotografie autentiche
 * dei campi, degli animali, del caseificio e della tavola prima della
 * pubblicazione.
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
      className="relative isolate w-full bg-[color:var(--marrone)] [@media(min-width:900px)]:min-h-[380dvh]"
    >
      {/* Fondo continuo: parte dal marrone finale dell'Atto 03, scivola verso
          la crema calda dell'Atto 05. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, var(--marrone) 0%, color-mix(in oklab, var(--marrone) 84%, var(--oliva)) 24%, color-mix(in oklab, var(--marrone) 62%, var(--carbone)) 44%, color-mix(in oklab, var(--marrone) 60%, var(--crema)) 74%, color-mix(in oklab, var(--crema) 72%, var(--marrone)) 100%)",
        }}
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 z-0 opacity-40" />

      {/* Materie ai lati del filo — pannelli laterali a piena larghezza per nodo.
          Nessuna card, nessuna cornice. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
        {/* Terra: solchi ampi, luce radente sinistra */}
        <div
          className="absolute inset-x-0 top-0 h-[24%]"
          style={{
            background:
              "radial-gradient(60% 80% at 20% 40%, color-mix(in oklab, var(--oliva) 22%, transparent) 0%, transparent 70%), repeating-linear-gradient(96deg, transparent 0 22px, color-mix(in oklab, var(--carbone) 22%, transparent) 22px 24px)",
            opacity: 0.55,
          }}
        />
        {/* Animali: ombre morbide, oliva su marrone */}
        <div
          className="absolute inset-x-0 top-[24%] h-[26%]"
          style={{
            background:
              "radial-gradient(70% 100% at 78% 50%, color-mix(in oklab, var(--oliva) 26%, transparent) 0%, transparent 72%), radial-gradient(50% 60% at 30% 40%, color-mix(in oklab, var(--marrone) 40%, var(--carbone)) 0%, transparent 70%)",
            opacity: 0.6,
          }}
        />
        {/* Trasformazione: DOPPIA SUPERFICIE — avorio a sinistra, pietra + bordeaux a destra */}
        <div
          className="absolute inset-x-0 top-[50%] h-[26%]"
          style={{
            background:
              "linear-gradient(90deg, color-mix(in oklab, var(--crema) 82%, var(--marrone)) 0%, color-mix(in oklab, var(--crema) 62%, var(--marrone)) 46%, color-mix(in oklab, var(--carbone) 62%, var(--bordeaux)) 54%, color-mix(in oklab, var(--bordeaux) 62%, var(--carbone)) 100%)",
            opacity: 0.68,
          }}
        />
        {/* Tavola: crema calda, legno chiaro */}
        <div
          className="absolute inset-x-0 top-[76%] h-[24%]"
          style={{
            background:
              "radial-gradient(70% 90% at 50% 60%, color-mix(in oklab, var(--crema) 78%, var(--oro)) 0%, transparent 70%), linear-gradient(180deg, color-mix(in oklab, var(--marrone) 30%, var(--crema)) 0%, color-mix(in oklab, var(--crema) 85%, var(--oro)) 100%)",
            opacity: 0.72,
          }}
        />
      </div>

      {/* Il filo — un unico SVG che copre tutta la sezione */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        viewBox="0 0 400 3800"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="filo-main" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b7340" />
            <stop offset="35%" stopColor="#6b7340" />
            <stop offset="60%" stopColor="#5a4a2e" />
            <stop offset="100%" stopColor="#3d2a1e" />
          </linearGradient>
        </defs>
        <path
          data-filo="main"
          d={D_MAIN}
          fill="none"
          stroke="url(#filo-main)"
          strokeWidth="2.6"
          strokeLinecap="round"
          style={staticStroke}
        />
        <path
          data-filo="latte"
          d={D_LATTE}
          fill="none"
          stroke="#f2e8d5"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={staticStroke}
        />
        <path
          data-filo="carne"
          d={D_CARNE}
          fill="none"
          stroke="#6e1a14"
          strokeWidth="2.2"
          strokeLinecap="round"
          style={staticStroke}
        />
        <path
          data-filo="oro"
          d={D_ORO}
          fill="none"
          stroke="#c49a4a"
          strokeWidth="3"
          strokeLinecap="round"
          style={staticStroke}
        />
        {/* Nodi lungo il filo */}
        <circle data-dot cx="100" cy="520" r="6" fill="#6b7340" style={statico ? { opacity: 1 } : undefined} />
        <circle data-dot cx="300" cy="1560" r="6" fill="#3d2a1e" style={statico ? { opacity: 1 } : undefined} />
        <circle data-dot cx="200" cy="2200" r="6" fill="#c49a4a" style={statico ? { opacity: 1 } : undefined} />
        <circle data-dot cx="200" cy="3400" r="7" fill="#c49a4a" style={statico ? { opacity: 1 } : undefined} />
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
            className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--crema)]/75 md:text-[11px]"
          >
            04 — LA FILIERA
          </motion.p>
          <h2 className="mt-6 max-w-[16ch] font-display text-[clamp(2.4rem,6.6vw,5.6rem)] leading-[0.96] text-[color:var(--crema)] md:mt-10">
            <span className="block">Dalla terra</span>
            <span className="ml-[3%] block md:ml-[7%]">alla tavola,</span>
            <span className="ml-[1%] block italic text-[color:var(--oro)] md:ml-[3%]">
              senza uscire.
            </span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-[color:var(--crema)]/85 md:mt-8 md:text-[17px]">
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
            className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--oro)]/85 md:text-[11px]"
          >
            {NODI[2].occhiello}
          </motion.p>
          <h3 className="mt-4 max-w-[22ch] font-display text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.02] text-[color:var(--crema)]">
            <span className="block">{NODI[2].titolo[0]}</span>
            <span className="ml-[2%] block italic text-[color:var(--oro)]">
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
              <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--crema)]/80">
                IL LATTE
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-[color:var(--crema)]/90 [@media(min-width:900px)]:text-[color:var(--carbone)]/85 md:text-[17px]">
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
              <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--crema)]/80">
                LA CARNE
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-[color:var(--crema)]/90 md:text-[17px]">
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
            className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--oro)]/90 md:text-[11px]"
          >
            {NODI[3].occhiello}
          </motion.p>
          <h3 className="mt-4 max-w-[18ch] font-display text-[clamp(2rem,4.8vw,3.8rem)] leading-[1] text-[color:var(--crema)] [@media(min-width:900px)]:text-[color:var(--carbone)]">
            <span className="block">{NODI[3].titolo[0]}</span>
            <span className="mt-1 block italic text-[color:var(--oro)] [@media(min-width:900px)]:text-[color:var(--bordeaux)]">
              {NODI[3].titolo[1]}
            </span>
          </h3>
          <p className="mt-8 max-w-[46ch] text-[16px] leading-relaxed text-[color:var(--crema)]/90 [@media(min-width:900px)]:text-[color:var(--carbone)]/85 md:text-[17px]">
            {NODI[3].testo}
          </p>

          {/* Chiusura dell'atto */}
          <p className="mt-16 max-w-[30ch] font-display text-[clamp(1.2rem,2.4vw,1.8rem)] italic leading-[1.12] text-[color:var(--oro)] [@media(min-width:900px)]:text-[color:var(--bordeaux)] md:mt-24">
            Quattro mestieri, un solo percorso.
          </p>
        </article>
      </div>

      {/* Handoff verso l'Atto 05 — fondo finale = fondo di partenza del 05 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[36dvh]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--crema) 82%, var(--oro)) 60%, color-mix(in oklab, var(--crema) 88%, var(--marrone)) 100%)",
        }}
      />
      <div className="relative z-10 border-t border-[color:var(--marrone)]/25 bg-[color:color-mix(in_oklab,var(--crema)_88%,var(--marrone))]">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 py-6 md:px-10 md:py-8">
          <span aria-hidden className="h-px w-10 bg-[color:var(--bordeaux)]/60" />
          <p className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--carbone)]/70 md:text-[10px]">
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
          className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--oro)]/85 md:text-[11px]"
        >
          {nodo.occhiello}
        </motion.p>
        <motion.h3
          initial={statico ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-4 font-display text-[clamp(2rem,5.2vw,4rem)] leading-[1] text-[color:var(--crema)]"
        >
          {nodo.titolo[0]}
        </motion.h3>
        <motion.p
          initial={statico ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          className="mt-6 text-[16px] leading-relaxed text-[color:var(--crema)]/85 md:text-[17px]"
        >
          {nodo.testo}
        </motion.p>
      </div>
    </article>
  );
}