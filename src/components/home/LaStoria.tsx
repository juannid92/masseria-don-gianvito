import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ATTO 02 — LA STORIA.
 * Firma: PIETRA · TEMPO · LUCE CHE RUOTA.
 * Desktop (>=900px): stage pinnato, track traslato orizzontalmente (una sola scena).
 * Mobile/landscape: tre scene verticali, nessun pin, nessun traveling.
 * Nessuna fotografia: pietra costruita con gradienti, spigolo di luce, grana.
 * Sostituire con fotografia autentica della muratura della Masseria prima della pubblicazione.
 */

type Momento = {
  id: "pietra" | "lavoro" | "famiglia";
  n: string;
  occhiello: string;
  titolo: [string, string];
  testo: string;
};

const MOMENTI: Momento[] = [
  {
    id: "pietra",
    n: "01",
    occhiello: "IL CINQUECENTO",
    titolo: ["Prima di tutto,", "c'era la pietra."],
    testo:
      "La masseria risale al Cinquecento. Muri spessi, volte basse, cortile chiuso: costruita per resistere e per lavorare.",
  },
  {
    id: "lavoro",
    n: "02",
    occhiello: "LA TERRA",
    titolo: ["Poi è arrivato", "il lavoro."],
    testo:
      "Campi, foraggio, grano tenero, ortaggi e frutta. La terra intorno alla masseria non è un paesaggio: è ciò che tiene in piedi tutto il resto.",
  },
  {
    id: "famiglia",
    n: "03",
    occhiello: "LE STESSE MANI",
    titolo: ["E il lavoro", "è rimasto in famiglia."],
    testo:
      "Dal 2002 la masseria è iscritta alla Camera di Commercio come società agricola. Allevamento, caseificio, macelleria e agriturismo sono nati uno dopo l'altro, nello stesso luogo.",
  },
];

/** Luce propria di ogni momento: fredda e radente → calda con oliva → interna crema. */
const LUCE: Record<Momento["id"], string> = {
  pietra:
    "radial-gradient(52% 40% at 22% 30%, color-mix(in oklab, var(--bianco-calce) 16%, transparent) 0%, transparent 70%)",
  lavoro:
    "radial-gradient(56% 46% at 50% 22%, color-mix(in oklab, var(--oliva-500) 30%, transparent) 0%, transparent 68%), radial-gradient(44% 36% at 62% 60%, color-mix(in oklab, var(--oro-antico) 16%, transparent) 0%, transparent 70%)",
  famiglia:
    "radial-gradient(60% 50% at 68% 58%, color-mix(in oklab, var(--bianco-calce) 22%, transparent) 0%, transparent 72%)",
};

export function LaStoria() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const stage = root.querySelector<HTMLElement>("[data-stage]");
      const track = root.querySelector<HTMLElement>("[data-track]");
      if (!stage || !track) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const fondo = root.querySelector<HTMLElement>("[data-layer='pietra-fondo']");
        const luce = root.querySelector<HTMLElement>("[data-layer='luce']");
        const grana = root.querySelector<HTMLElement>("[data-layer='grana']");
        const titolo = root.querySelector<HTMLElement>("[data-title]");
        const chiusura = root.querySelector<HTMLElement>("[data-chiusura]");
        const handoff = root.querySelector<HTMLElement>("[data-handoff]");
        const occhiello03 = root.querySelector<HTMLElement>("[data-occhiello-03]");
        const dots = Array.from(root.querySelectorAll<HTMLElement>("[data-dot]"));

        // Distanza e fermate derivate dal DOM reale — mai valori hardcoded.
        const distanza = () => Math.max(0, track.scrollWidth - stage.clientWidth);
        let dist = distanza();
        const stop = (id: Momento["id"]) => {
          const el = root.querySelector<HTMLElement>(`[data-moment='${id}']`);
          if (!el) return 0;
          return -Math.min(dist, Math.max(0, el.offsetLeft));
        };

        // L'altezza del wrapper deriva dalla distanza reale: nessuna coda vuota.
        const misuraAltezza = () => {
          dist = distanza();
          root.style.height = `${stage.clientHeight + dist}px`;
        };
        misuraAltezza();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            pin: stage,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: misuraAltezza,
            onRefresh: () => {
              dist = distanza();
            },
          },
          defaults: { ease: "none" },
        });

        // Label narrative (progress 0 → 1).
        tl.addLabel("titolo", 0)
          .addLabel("attenua", 0.1)
          .addLabel("in-pietra", 0.14)
          .addLabel("oss-pietra", 0.22)
          .addLabel("out-pietra", 0.34)
          .addLabel("in-lavoro", 0.4)
          .addLabel("oss-lavoro", 0.5)
          .addLabel("out-lavoro", 0.62)
          .addLabel("in-famiglia", 0.68)
          .addLabel("oss-famiglia", 0.78)
          .addLabel("chiusura", 0.88)
          .addLabel("handoff", 0.94)
          .addLabel("atto03", 1);

        // Traveling a ritmo variabile: ingresso (accelera) → osservazione (fermo) → uscita.
        const seg = (to: () => number, at: number, dur: number, ease: string) =>
          tl.to(track, { x: to, duration: dur, ease }, at);

        tl.set(track, { x: 0 }, 0);
        seg(() => stop("pietra"), 0.1, 0.12, "power2.inOut"); // ingresso pietra → osservazione 0.22
        seg(() => stop("lavoro"), 0.34, 0.16, "power2.inOut"); // uscita → osservazione lavoro 0.50
        seg(() => stop("famiglia"), 0.62, 0.16, "power2.inOut"); // → osservazione famiglia 0.78
        seg(() => -dist, 0.88, 0.12, "power1.inOut"); // chiusura dell'atto

        // Livelli agganciati alla x reale del track (rapporti costanti anche col ritmo variabile).
        tl.eventCallback("onUpdate", () => {
          const x = Number(gsap.getProperty(track, "x"));
          if (fondo) gsap.set(fondo, { x: x * 0.84, scale: 1.05 + (x / (dist || 1)) * 0.05 });
          if (grana) gsap.set(grana, { x: x * 0.96 });
          if (luce) gsap.set(luce, { x: -x * 0.12 });
          if (titolo) gsap.set(titolo, { x: x * 0.4 });
          const w = stage.clientWidth || 1;
          MOMENTI.forEach((m) => {
            const el = root.querySelector<HTMLElement>(`[data-moment='${m.id}']`);
            const inner = el?.querySelector<HTMLElement>("[data-inner]");
            if (!el || !inner) return;
            const local = x + el.offsetLeft; // 0 in osservazione
            // Fuoco: solo il momento osservato è pienamente leggibile.
            const fuoco = Math.max(0, 1 - Math.abs(local) / (w * 0.62));
            gsap.set(inner, { x: local * -0.08, opacity: 0.06 + fuoco * 0.94 });
          });

        });

        // Luce che ruota (opacità) e attenuazione del titolo dell'atto.
        if (luce)
          tl.fromTo(luce, { opacity: 0.3 }, { opacity: 0.6, duration: 0.4 }, 0.14).to(
            luce,
            { opacity: 0.35, duration: 0.3 },
            0.66,
          );
        if (titolo) tl.to(titolo, { opacity: 0.25, y: -28, duration: 0.06 }, "attenua");



        // Indicatore di progresso.
        dots.forEach((dot, i) => {
          const inAt = [0.14, 0.4, 0.68][i];
          const outAt = [0.36, 0.64, 1][i];
          tl.to(dot, { opacity: 1, duration: 0.04 }, inAt);
          if (i < 2) tl.to(dot, { opacity: 0.35, duration: 0.04 }, outAt);
        });

        if (chiusura)
          tl.fromTo(chiusura, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.05 }, "chiusura");
        if (handoff) tl.fromTo(handoff, { opacity: 0 }, { opacity: 1, duration: 0.05 }, "handoff");
        if (occhiello03)
          tl.fromTo(occhiello03, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.04 }, 0.96);
      });

      // Mobile / landscape: nessun pin, nessun traveling. Solo parallasse di fondo (max 6%).
      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        const fondo = root.querySelector<HTMLElement>("[data-layer='pietra-fondo']");
        if (fondo)
          gsap.fromTo(
            fondo,
            { yPercent: 0 },
            {
              yPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            },
          );

        MOMENTI.forEach((m, i) => {
          const el = root.querySelector<HTMLElement>(`[data-moment='${m.id}']`);
          const dot = root.querySelectorAll<HTMLElement>("[data-dot]")[i];
          if (!el || !dot) return;
          ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => gsap.to(dot, { opacity: self.isActive ? 1 : 0.35, duration: 0.2 }),
          });
        });
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const statico = reduced;
  const vis = statico ? 1 : undefined;

  return (
    <section
      id="storia"
      data-act="storia"
      data-tone="dark"
      ref={rootRef}
      aria-label="La Storia"
      className="relative isolate w-full bg-[color:var(--pietra-800)] [@media(min-width:900px)]:h-[320dvh]"
    >
      <div
        data-stage
        className="relative isolate w-full overflow-hidden [@media(min-width:900px)]:h-[100dvh]"
      >
        {/* Fondo di pietra — continua la terra scurita dell'atto 01 */}
        <div aria-hidden data-layer="pietra-fondo" className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-[-6%]"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--carbone) 88%, var(--pietra-800)) 0%, color-mix(in oklab, var(--pietra-800) 62%, var(--carbone)) 46%, color-mix(in oklab, var(--carbone) 92%, var(--pietra-800)) 100%)",
            }}
          />
          {/* Blocchi di muratura: profondità, spigolo e ombra portata. */}
          <div
            className="absolute inset-[-6%] opacity-[0.5]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0 148px, color-mix(in oklab, var(--carbone) 70%, transparent) 148px 152px), repeating-linear-gradient(0deg, transparent 0 96px, color-mix(in oklab, var(--carbone) 60%, transparent) 96px 99px)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, color-mix(in oklab, var(--carbone) 82%, transparent) 0%, transparent 34%, transparent 66%, color-mix(in oklab, var(--carbone) 88%, transparent) 100%)",
            }}
          />
        </div>

        {/* Luce che ruota */}
        <div aria-hidden data-layer="luce" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-[-20%]"
            style={{
              opacity: statico ? 0.5 : 0.3,
              background:
                "radial-gradient(46% 38% at 24% 26%, color-mix(in oklab, var(--bianco-calce) 14%, transparent) 0%, transparent 70%), radial-gradient(40% 34% at 76% 66%, color-mix(in oklab, var(--oro-antico) 12%, transparent) 0%, transparent 72%)",
            }}
          />
        </div>

        {/* Grana */}
        <div aria-hidden data-layer="grana" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="grain absolute inset-[-4%] opacity-45" />
        </div>

        {/* Spigolo illuminato: prosegue la linea di continuità dell'atto 01 */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-5 top-0 z-10 h-[46%] w-px bg-gradient-to-b from-[color:var(--oro-antico)]/70 via-[color:var(--oro-antico)]/30 to-transparent md:left-10"
        />

        {/* Titolo dell'atto */}
        <div
          data-title
          className="relative z-20 mx-auto w-full max-w-[1600px] pl-10 pr-5 md:pl-20 md:pr-10 [@media(min-width:900px)]:absolute [@media(min-width:900px)]:inset-x-0 [@media(min-width:900px)]:top-0"
          style={{ paddingTop: "calc(var(--page-header-safe-offset) + 2vh)" }}
        >
          <motion.p
            initial={statico ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70 md:text-[11px]"
          >
            02 — LA STORIA
          </motion.p>
          <h2 className="mt-6 font-display text-[clamp(2.4rem,6.6vw,5.6rem)] leading-[0.95] text-[color:var(--bianco-calce)] md:mt-10 [@media(max-height:520px)]:mt-3 [@media(max-height:520px)]:text-[clamp(1.8rem,4.4vw,2.6rem)]">
            <span className="block">Il tempo qui</span>
            <span className="ml-[4%] block md:ml-[9%]">non è passato.</span>
            <span className="ml-[1%] block italic text-[color:var(--oro-antico)] md:ml-[3%]">È rimasto.</span>
          </h2>
        </div>

        {/* Track dei tre momenti */}
        <div
          data-track
          className="relative z-10 flex w-full flex-col [@media(min-width:900px)]:h-full [@media(min-width:900px)]:w-max [@media(min-width:900px)]:flex-row [@media(min-width:900px)]:items-center [@media(min-width:900px)]:will-change-transform"
        >
          {/* Spazio d'apertura: il titolo dell'atto occupa la prima schermata */}
          <div aria-hidden className="hidden [@media(min-width:900px)]:block [@media(min-width:900px)]:w-screen" />

          {MOMENTI.map((m) => (
            <article
              key={m.id}
              data-moment={m.id}
              className="relative flex min-h-[100dvh] w-full shrink-0 items-center [@media(min-width:900px)]:min-h-0 [@media(min-width:900px)]:h-full [@media(min-width:900px)]:w-screen"
            >
              {/* Luce propria del momento */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: LUCE[m.id], opacity: 0.85 }}
              />
              {/* Spigolo di pietra illuminato */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-[12%] left-0 w-px bg-gradient-to-b from-transparent via-[color:var(--oro-antico)]/45 to-transparent"
              />

              {/* Volume di pietra: spigolo in luce e ombra portata.
                  Sostituire con fotografia autentica della muratura prima della pubblicazione. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] [@media(min-width:900px)]:block"
              >
                <div
                  className="absolute inset-y-[8%] left-[16%] right-[-10%]"
                  style={{
                    background:
                      "linear-gradient(96deg, color-mix(in oklab, var(--bianco-calce) 13%, transparent) 0%, color-mix(in oklab, var(--pietra-800) 60%, var(--carbone)) 12%, color-mix(in oklab, var(--carbone) 92%, var(--pietra-800)) 78%)",
                    boxShadow: "-70px 0 140px -40px color-mix(in oklab, var(--carbone) 90%, transparent)",
                  }}
                />
                <span
                  className="absolute inset-y-[8%] left-[16%] w-px"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--oro-antico) 70%, transparent) 32%, color-mix(in oklab, var(--bianco-calce) 40%, transparent) 60%, transparent 100%)",
                  }}
                />
              </div>


              <div
                data-inner
                className="relative z-10 mx-auto w-full max-w-[1600px] px-10 py-24 md:px-20 [@media(min-width:900px)]:py-0 [@media(max-height:520px)]:py-12"
                style={{ paddingTop: "calc(var(--page-header-safe-offset) + 1vh)" }}
              >
                <div className="max-w-[46ch]">
                  <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--oro-antico)]/85">
                    {m.occhiello}
                  </p>
                  <h3 className="mt-5 font-display text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1] text-[color:var(--bianco-calce)] [@media(max-height:520px)]:text-[clamp(1.5rem,3.4vw,2.1rem)]">
                    <span className="block">{m.titolo[0]}</span>
                    <span className="ml-[3%] block">{m.titolo[1]}</span>
                  </h3>
                  <p className="mt-6 max-w-[42ch] text-[16px] leading-relaxed text-[color:var(--bianco-calce)]/80 md:text-[17px]">
                    {m.testo}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {/* Chiusura dell'atto */}
          <div className="relative flex min-h-[70dvh] w-full shrink-0 items-center [@media(min-width:900px)]:min-h-0 [@media(min-width:900px)]:h-full [@media(min-width:900px)]:w-[80vw]">
            <div className="relative z-10 mx-auto w-full max-w-[1600px] px-10 md:px-20">
              <p
                data-chiusura
                className="max-w-[26ch] font-display text-[clamp(1.6rem,3.2vw,2.6rem)] italic leading-[1.12] text-[color:var(--bianco-calce)]/90"
                style={{ opacity: vis }}
              >
                Cinque secoli dopo, si lavora ancora qui.
              </p>
            </div>
          </div>
        </div>

        {/* Indicatore di progresso */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex items-center justify-center gap-3 md:bottom-6"
        >
          {MOMENTI.map((m, i) => (
            <span
              key={m.id}
              data-dot
              className="font-eyebrow text-[9px] tracking-[0.3em] text-[color:var(--bianco-calce)]"
              style={{ opacity: statico ? (i === 0 ? 1 : 0.35) : 0.35 }}
            >
              {m.n}
            </span>
          ))}
        </div>

        {/* Handoff verso l'atto 03 */}
        <div
          aria-hidden
          data-handoff
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[46dvh]"
          style={{
            opacity: statico ? 1 : 0,
            background:
              "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--pietra-800) 60%, var(--bianco-calce)) 46%, var(--bianco-calce) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 z-30 [@media(max-width:899px)]:relative">
          <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 pb-6 md:px-10 md:pb-8">
            <span aria-hidden className="h-px w-10 bg-[color:var(--oro-antico)]/70" />
            <p
              data-occhiello-03
              className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--pietra-800)]/75 md:text-[10px]"
              style={{ opacity: vis }}
            >
              03 — IL LUOGO
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
