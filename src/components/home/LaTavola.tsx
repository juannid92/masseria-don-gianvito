import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ATTO 05 — LA TAVOLA.
 * Firma: I QUADRI A SIPARIO · LUCE CALDA · CHIUSURA CORALE.
 *
 * Regia (quarta tecnica del sito):
 *  - Nessun pin, nessuno sticky a piena altezza, nessun traveling.
 *  - Ogni quadro è un pannello che si rivela con clip-path inset()
 *    (sipario), direzione alternata quadro per quadro.
 *  - Materia di fondo con ken burns leggero (scale + pan) su timeline
 *    indipendente da quella del sipario.
 *  - Forme portate astratte, entrano dopo il 60% del sipario.
 *  - Prima dominante CHIARA del sito: crema calda, legno chiaro,
 *    oro sottile, oliva; terracotta SOLO nel Quadro 3.
 *
 * Sostituire le materie CSS e le forme astratte con fotografie
 * autentiche dei piatti prima della pubblicazione.
 */

type Quadro = {
  id: "antipasto" | "cucina" | "arrosto" | "dolce";
  n: string;
  occhiello: string;
  titolo: string;
  testo: string;
  siparioDa: "left" | "right";
  materia: string; // background CSS
  kenPan: { x: string; y: string };
  terracotta?: boolean;
};

const QUADRI: Quadro[] = [
  {
    id: "antipasto",
    n: "01",
    occhiello: "01 · L'ANTIPASTO",
    titolo: "Prima, tutto quello che è già pronto.",
    testo:
      "Formaggi appena fatti, salumi della masseria, focaccia calda, verdure di stagione. Arriva al tavolo quello che il caseificio e la macelleria hanno preparato in mattinata.",
    siparioDa: "right",
    materia:
      "radial-gradient(120% 90% at 30% 30%, color-mix(in oklab, var(--crema) 96%, white) 0%, var(--crema) 55%, color-mix(in oklab, var(--crema) 82%, var(--marrone)) 100%)",
    kenPan: { x: "-2%", y: "-1.5%" },
  },
  {
    id: "cucina",
    n: "02",
    occhiello: "02 · LA CUCINA",
    titolo: "Poi, quello che si cucina la mattina.",
    testo:
      "Orecchiette al ragù, cavatelli, timballi al forno, verdure ripiene, pignata di carne che sobbolle da circa cinque ore. La cucina di casa, fatta ogni giorno.",
    siparioDa: "left",
    materia:
      "radial-gradient(110% 100% at 70% 40%, color-mix(in oklab, var(--crema) 88%, var(--oliva)) 0%, color-mix(in oklab, var(--crema) 90%, var(--marrone)) 60%, color-mix(in oklab, var(--crema) 78%, var(--marrone)) 100%)",
    kenPan: { x: "2%", y: "-1%" },
  },
  {
    id: "arrosto",
    n: "03",
    occhiello: "03 · L'ARROSTO",
    titolo: "Poi, quello che si cuoce sul fuoco.",
    testo:
      "Bombette, salsicce, costate, tagliate. Carne dei nostri animali, frollata circa quaranta giorni, cotta al momento sulla brace. Nessuna parola di troppo.",
    siparioDa: "right",
    materia:
      "radial-gradient(120% 95% at 40% 60%, color-mix(in oklab, var(--crema) 78%, var(--terracotta)) 0%, color-mix(in oklab, var(--crema) 86%, var(--marrone)) 55%, color-mix(in oklab, var(--crema) 74%, var(--marrone)) 100%)",
    kenPan: { x: "-3%", y: "1%" },
    terracotta: true,
  },
  {
    id: "dolce",
    n: "04",
    occhiello: "04 · IL DOLCE",
    titolo: "Alla fine, un dolce fatto in casa.",
    testo:
      "Ricotta e pere, torte di stagione, pasticciotto. Il caffè arriva subito dopo, senza fretta di alzarsi.",
    siparioDa: "left",
    materia:
      "radial-gradient(110% 100% at 60% 45%, color-mix(in oklab, var(--crema) 98%, white) 0%, color-mix(in oklab, var(--crema) 92%, var(--oro)) 65%, color-mix(in oklab, var(--crema) 84%, var(--marrone)) 100%)",
    kenPan: { x: "2%", y: "1.5%" },
  },
];

export function LaTavola() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        { desktop: "(min-width: 768px)", mobile: "(max-width: 767.98px)" },
        (ctxObj) => {
          const isMobile = !!ctxObj.conditions?.mobile;

          // 1 APERTURA — filo che si posa e diventa piano
          const apertura = root.querySelector<HTMLElement>("[data-tavola-apertura]");
          if (apertura) {
            gsap.fromTo(
              apertura.querySelector("[data-filo-piano]"),
              { scaleX: 0.05, opacity: 0.6 },
              {
                scaleX: 1,
                opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: apertura,
                  start: "top 85%",
                  end: "bottom 55%",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              }
            );
          }

          // 4 QUADRI — sipario + ken burns + forme
          root.querySelectorAll<HTMLElement>("[data-quadro]").forEach((quadro) => {
            const da = quadro.dataset.siparioDa as "left" | "right";
            const materia = quadro.querySelector<HTMLElement>("[data-materia]");
            const forme = quadro.querySelectorAll<HTMLElement>("[data-forma]");
            const luce = quadro.querySelector<HTMLElement>("[data-luce-terracotta]");
            const panX = quadro.dataset.panX ?? "0%";
            const panY = quadro.dataset.panY ?? "0%";

            const insetStart = isMobile
              ? "inset(100% 0% 0% 0%)" // wipe dal basso su mobile
              : da === "right"
              ? "inset(0% 0% 0% 100%)"
              : "inset(0% 100% 0% 0%)";

            // Sipario + forme (stessa timeline)
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: quadro,
                start: "top 88%",
                end: "top 45%",
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            });
            tl.fromTo(
              quadro.querySelector("[data-sipario]"),
              { clipPath: insetStart, webkitClipPath: insetStart } as gsap.TweenVars,
              { clipPath: "inset(0% 0% 0% 0%)", webkitClipPath: "inset(0% 0% 0% 0%)", ease: "none" } as gsap.TweenVars,
              0
            );
            if (forme.length) {
              tl.fromTo(
                forme,
                { opacity: 0, y: 24 },
                { opacity: 1, y: 0, stagger: isMobile ? 0.05 : 0.09, ease: "power2.out" },
                0.6
              );
            }

            // Ken burns indipendente
            if (materia) {
              gsap.fromTo(
                materia,
                { scale: 1.0, xPercent: 0, yPercent: 0 },
                {
                  scale: isMobile ? 1.03 : 1.08,
                  xPercent: isMobile ? 0 : parseFloat(panX),
                  yPercent: isMobile ? 0 : parseFloat(panY),
                  ease: "none",
                  scrollTrigger: {
                    trigger: quadro,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                  },
                }
              );
            }

            // Luce terracotta solo Quadro 3
            if (luce) {
              gsap.fromTo(
                luce,
                { opacity: 0 },
                {
                  opacity: 0.35,
                  ease: "power1.inOut",
                  scrollTrigger: {
                    trigger: quadro,
                    start: "top 60%",
                    end: "bottom 10%",
                    scrub: 0.5,
                    invalidateOnRefresh: true,
                  },
                }
              );
            }
          });

          // CHIUSURA — piano vira a marrone caldo scuro (handoff 06)
          const chiusura = root.querySelector<HTMLElement>("[data-tavola-chiusura]");
          if (chiusura) {
            gsap.fromTo(
              chiusura,
              { backgroundColor: "color-mix(in oklab, var(--crema) 88%, var(--marrone))" },
              {
                backgroundColor: "color-mix(in oklab, var(--marrone) 82%, var(--carbone))",
                ease: "none",
                scrollTrigger: {
                  trigger: chiusura,
                  start: "top 80%",
                  end: "bottom bottom",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              }
            );
          }
        }
      );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      data-act="tavola"
      aria-label="Atto 05 — La Tavola"
      className="relative isolate w-full overflow-hidden"
      style={{
        background: "color-mix(in oklab, var(--crema) 88%, var(--marrone))",
      }}
    >
      {/* APERTURA — filo che si posa e diventa piano */}
      <div
        data-tavola-apertura
        className="relative mx-auto flex min-h-[92dvh] max-w-[1600px] flex-col items-center justify-center px-5 py-24 text-center md:px-10 md:py-28"
      >
        <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bordeaux)]/75 md:text-[11px]">
          05 — LA TAVOLA
        </p>
        <h2 className="mt-6 max-w-[22ch] font-display text-[clamp(2.4rem,6vw,4.6rem)] leading-[1.02] text-[color:var(--carbone)]">
          Il filo si posa. Diventa un piano.
        </h2>
        <p className="mt-8 max-w-[46ch] text-[16px] leading-relaxed text-[color:var(--carbone)]/80 md:text-[17px]">
          Da qui in avanti non si spiega più niente: si mangia. Quattro quadri, uno di seguito
          all'altro, come vengono al tavolo.
        </p>
        <div
          data-filo-piano
          aria-hidden
          className="mt-14 h-[2px] w-[min(720px,80vw)] origin-left rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--oro) 30%, var(--oro) 70%, transparent 100%)",
          }}
        />
      </div>

      {/* QUADRI */}
      {QUADRI.map((q) => (
        <QuadroBlocco key={q.id} q={q} reduced={reduced} />
      ))}

      {/* DISCLAIMER */}
      <div className="relative mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-20">
        <p className="mx-auto max-w-[52ch] text-center text-[13px] italic leading-relaxed text-[color:var(--carbone)]/65 md:text-[14px]">
          Il menu cambia ogni giorno secondo quello che il caseificio, l'orto e la macelleria hanno
          pronto. Quello che leggi qui è un racconto: al tavolo troverai quello del giorno.
        </p>
      </div>

      {/* CHIUSURA — la tavola si svuota + CTA */}
      <div
        data-tavola-chiusura
        className="relative mx-auto flex min-h-[80dvh] max-w-[1600px] flex-col items-center justify-center gap-10 px-5 py-24 text-center md:px-10 md:py-32"
      >
        <h3 className="max-w-[24ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] text-[color:var(--crema)]">
          A fine sera, la tavola si svuota. Poi ricomincia.
        </h3>
        <div className="flex w-full max-w-[520px] flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/agriturismo"
            className="inline-flex min-h-[54px] items-center justify-center rounded-full bg-[color:var(--oro)] px-8 font-eyebrow text-[12px] tracking-[0.28em] text-[color:var(--carbone)] transition-transform hover:scale-[1.02]"
          >
            SCOPRI L'AGRITURISMO
          </Link>
          <a
            href="#prenota"
            className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-[color:var(--crema)]/60 px-8 font-eyebrow text-[12px] tracking-[0.28em] text-[color:var(--crema)] transition-colors hover:bg-[color:var(--crema)]/10"
          >
            PRENOTA UN TAVOLO
          </a>
        </div>
      </div>

      {/* HANDOFF verso Atto 06 */}
      <div
        className="relative z-10 border-t border-[color:var(--crema)]/10"
        style={{ background: "color-mix(in oklab, var(--marrone) 82%, var(--carbone))" }}
      >
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 py-6 md:px-10 md:py-8">
          <span aria-hidden className="h-px w-10 bg-[color:var(--oro)]/60" />
          <p className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--crema)]/70 md:text-[10px]">
            06 — LA VOCE
          </p>
        </div>
      </div>
    </section>
  );
}

function QuadroBlocco({ q, reduced }: { q: Quadro; reduced: boolean }) {
  return (
    <article
      data-quadro={q.id}
      data-sipario-da={q.siparioDa}
      data-pan-x={q.kenPan.x}
      data-pan-y={q.kenPan.y}
      className="relative min-h-[110dvh] w-full md:min-h-[130dvh]"
    >
      {/* Sipario: wrapper con clip-path, contiene materia + luce + forme */}
      <div
        data-sipario
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: reduced ? "inset(0% 0% 0% 0%)" : undefined,
          WebkitClipPath: reduced ? "inset(0% 0% 0% 0%)" : undefined,
        }}
      >
        {/* Materia (ken burns) */}
        <div
          data-materia
          className="absolute inset-[-6%] will-change-transform"
          style={{ background: q.materia }}
          aria-hidden
        />
        {/* Grana leggera */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(rgba(61,42,30,0.5) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
        {/* Luce terracotta solo Quadro 3 */}
        {q.terracotta && (
          <div
            data-luce-terracotta
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 40% at 45% 55%, color-mix(in oklab, var(--terracotta) 65%, transparent) 0%, transparent 70%)",
              opacity: reduced ? 0.35 : 0,
            }}
          />
        )}

        {/* Forme portate — astratte, non figurative */}
        {/* Sostituire con fotografie autentiche dei piatti prima della pubblicazione. */}
        <div className="pointer-events-none absolute inset-0">
          <FormePerQuadro id={q.id} reduced={reduced} />
        </div>
      </div>

      {/* Contenuto testuale */}
      <div
        className={`relative z-10 mx-auto flex min-h-[110dvh] max-w-[1600px] flex-col justify-center px-5 py-24 md:min-h-[130dvh] md:px-10 md:py-32 ${
          q.siparioDa === "right" ? "md:items-start md:text-left" : "md:items-end md:text-right"
        }`}
      >
        <div className="max-w-[44ch]">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bordeaux)]/80 md:text-[11px]"
          >
            {q.occhiello}
          </motion.p>
          <motion.h3
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-4 font-display text-[clamp(2rem,5vw,3.8rem)] leading-[1.04] text-[color:var(--carbone)]"
          >
            {q.titolo}
          </motion.h3>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="mt-6 text-[16px] leading-relaxed text-[color:var(--carbone)]/80 md:text-[17px]"
          >
            {q.testo}
          </motion.p>
        </div>
      </div>
    </article>
  );
}

/**
 * Forme astratte per ogni quadro — cerchi/ovali/volumi in tinte materia.
 * Solo transform/opacity. Sostituire con fotografie autentiche dei piatti
 * prima della pubblicazione.
 */
function FormePerQuadro({ id, reduced }: { id: Quadro["id"]; reduced: boolean }) {
  const base =
    "absolute rounded-full will-change-transform" +
    (reduced ? "" : " opacity-0");
  const style = (bg: string): React.CSSProperties => ({
    background: bg,
    boxShadow: "0 20px 60px -30px rgba(61,42,30,0.45)",
  });
  switch (id) {
    case "antipasto":
      return (
        <>
          <div
            data-forma
            className={`${base} left-[8%] top-[22%] h-[26vmin] w-[26vmin]`}
            style={style(
              "radial-gradient(circle at 35% 30%, #fff 0%, color-mix(in oklab, var(--crema) 90%, white) 60%, color-mix(in oklab, var(--crema) 80%, var(--oro)) 100%)"
            )}
          />
          <div
            data-forma
            className={`${base} right-[12%] top-[38%] h-[18vmin] w-[30vmin]`}
            style={style(
              "radial-gradient(ellipse at 40% 40%, color-mix(in oklab, var(--terracotta) 55%, var(--crema)) 0%, color-mix(in oklab, var(--bordeaux) 55%, var(--crema)) 100%)"
            )}
          />
          <div
            data-forma
            className={`${base} left-[36%] bottom-[14%] h-[22vmin] w-[22vmin]`}
            style={style(
              "radial-gradient(circle, color-mix(in oklab, var(--oliva) 55%, var(--crema)) 0%, color-mix(in oklab, var(--oliva) 75%, var(--marrone)) 100%)"
            )}
          />
        </>
      );
    case "cucina":
      return (
        <>
          <div
            data-forma
            className={`${base} right-[10%] top-[24%] h-[30vmin] w-[30vmin]`}
            style={style(
              "radial-gradient(circle at 40% 35%, color-mix(in oklab, var(--terracotta) 60%, var(--crema)) 0%, color-mix(in oklab, var(--bordeaux) 60%, var(--marrone)) 100%)"
            )}
          />
          <div
            data-forma
            className={`${base} left-[14%] bottom-[18%] h-[20vmin] w-[26vmin]`}
            style={style(
              "radial-gradient(ellipse, color-mix(in oklab, var(--crema) 92%, var(--oro)) 0%, color-mix(in oklab, var(--crema) 78%, var(--marrone)) 100%)"
            )}
          />
        </>
      );
    case "arrosto":
      return (
        <>
          <div
            data-forma
            className={`${base} left-[12%] top-[30%] h-[24vmin] w-[36vmin]`}
            style={style(
              "radial-gradient(ellipse at 40% 45%, color-mix(in oklab, var(--terracotta) 70%, var(--marrone)) 0%, color-mix(in oklab, var(--bordeaux) 80%, var(--carbone)) 100%)"
            )}
          />
          <div
            data-forma
            className={`${base} right-[16%] bottom-[20%] h-[18vmin] w-[24vmin]`}
            style={style(
              "radial-gradient(ellipse, color-mix(in oklab, var(--terracotta) 55%, var(--marrone)) 0%, color-mix(in oklab, var(--carbone) 70%, var(--bordeaux)) 100%)"
            )}
          />
        </>
      );
    case "dolce":
      return (
        <>
          <div
            data-forma
            className={`${base} left-[18%] top-[26%] h-[26vmin] w-[26vmin]`}
            style={style(
              "radial-gradient(circle at 35% 30%, #fff 0%, color-mix(in oklab, var(--crema) 96%, white) 55%, color-mix(in oklab, var(--crema) 82%, var(--oro)) 100%)"
            )}
          />
          <div
            data-forma
            className={`${base} right-[14%] bottom-[16%] h-[20vmin] w-[20vmin]`}
            style={style(
              "radial-gradient(circle, color-mix(in oklab, var(--oro) 55%, var(--crema)) 0%, color-mix(in oklab, var(--marrone) 60%, var(--oro)) 100%)"
            )}
          />
        </>
      );
  }
}