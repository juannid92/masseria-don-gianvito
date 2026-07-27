import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ATTO 01 — IL MANIFESTO.
 * Terra · Parola · Peso. Nessuna fotografia, nessuna card, nessuna icona.
 * Una sola timeline locale con ScrollTrigger (scrub 0.6), sticky CSS, nessun pin.
 */
export function IlManifesto() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const q = (sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel));
      const righe = q("[data-riga]");
      const linea = root.querySelector<HTMLElement>("[data-linea]");
      const sostegno = q("[data-sostegno]");
      const chiusura = root.querySelector<HTMLElement>("[data-chiusura]");
      const luce = root.querySelector<HTMLElement>("[data-luce]");
      const buio = root.querySelector<HTMLElement>("[data-buio]");
      const occhiello = root.querySelector<HTMLElement>("[data-occhiello]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      if (linea) tl.fromTo(linea, { scaleY: 0 }, { scaleY: 1, duration: 0.6 }, 0);
      if (occhiello) tl.fromTo(occhiello, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, 0.1);

      righe.forEach((riga, i) => {
        tl.fromTo(
          riga,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.5 },
          0.5 + i * 0.45,
        );
      });

      sostegno.forEach((el, i) => {
        tl.fromTo(el, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5 }, 1.9 + i * 0.2);
      });

      if (luce) tl.fromTo(luce, { xPercent: -6, yPercent: -4 }, { xPercent: 8, yPercent: 6, duration: 3 }, 0.3);
      if (chiusura) tl.fromTo(chiusura, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, 2.5);
      if (buio) tl.fromTo(buio, { opacity: 0 }, { opacity: 1, duration: 1 }, 2.6);

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const statico = reduced;

  return (
    <section
      id="manifesto"
      ref={rootRef}
      aria-label="Il Manifesto"
      className="relative isolate w-full"
      style={{
        // Altezza derivata dalla timeline: 3 battute di testo + chiusura + scurimento.
        minHeight: "220dvh",
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--marrone) 88%, var(--carbone)) 0%, var(--marrone) 22%, color-mix(in oklab, var(--marrone) 82%, var(--carbone)) 74%, color-mix(in oklab, var(--carbone) 92%, var(--marrone)) 100%)",
      }}
    >
      {/* Luce mobile sul fondo terra: variazione, mai piatto. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          data-luce
          className="absolute inset-[-20%]"
          style={{
            background:
              "radial-gradient(60% 48% at 34% 32%, color-mix(in oklab, var(--oliva) 22%, transparent) 0%, transparent 68%), radial-gradient(52% 40% at 74% 70%, color-mix(in oklab, var(--oro) 12%, transparent) 0%, transparent 70%)",
          }}
        />
      </div>
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-60" />

      {/* Scurimento finale: prepara l'atto 02 (carbone caldo). */}
      <div
        aria-hidden
        data-buio
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70dvh]"
        style={{
          opacity: statico ? 1 : 0,
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--carbone) 70%, var(--marrone)) 62%, var(--carbone) 100%)",
        }}
      />

      {/* Contenuto: sticky CSS, nessun pin. */}
      <div className="sticky top-0 z-10 flex min-h-[100dvh] items-center">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-10 px-5 py-16 md:grid-cols-12 md:px-10 md:py-20">
          {/* Colonna della parola */}
          <div className="md:col-span-8 md:col-start-1">
            <div className="flex items-start gap-4 md:gap-6">
              {/* unico segno grafico: la linea di continuità dalla Hero */}
              <span
                aria-hidden
                data-linea
                className="mt-1 block w-px shrink-0 origin-top bg-[color:var(--oro)]/70"
                style={{
                  height: "clamp(72px, 16vw, 190px)",
                  transform: statico ? "scaleY(1)" : undefined,
                }}
              />
              <div>
                <p
                  data-occhiello
                  className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--crema)]/70 md:text-[11px]"
                  style={{ opacity: statico ? 1 : undefined }}
                >
                  01 — IL MANIFESTO
                </p>
                <h2 className="mt-6 font-display text-[clamp(2.4rem,7.4vw,6.4rem)] leading-[0.94] text-[color:var(--crema)] md:mt-9">
                  <span
                    data-riga
                    className="block"
                    style={{ opacity: statico ? 1 : undefined }}
                  >
                    Non compriamo
                  </span>
                  <span
                    data-riga
                    className="ml-[6%] block md:ml-[12%]"
                    style={{ opacity: statico ? 1 : undefined }}
                  >
                    quello che serve.
                  </span>
                  <span
                    data-riga
                    className="ml-[2%] block italic text-[color:var(--oro)] md:ml-[4%]"
                    style={{ opacity: statico ? 1 : undefined }}
                  >
                    Lo facciamo qui.
                  </span>
                </h2>
              </div>
            </div>
          </div>

          {/* Colonna stretta di sostegno, spostata rispetto al titolo */}
          <div className="md:col-span-4 md:col-start-9 md:self-end">
            <p
              data-sostegno
              className="max-w-[38ch] text-[16px] leading-relaxed text-[color:var(--crema)]/82 md:text-[17px]"
              style={{ opacity: statico ? 1 : undefined }}
            >
              Gli animali crescono nei nostri terreni. Il latte diventa formaggio ogni mattina. La
              carne si sceglie al banco. Il pasto si conclude nella nostra sala.
            </p>
            <p
              data-chiusura
              className="mt-10 text-[12.5px] leading-relaxed tracking-[0.06em] text-[color:var(--crema)]/55 md:mt-16 md:text-[13px]"
              style={{ opacity: statico ? 1 : undefined }}
            >
              Una masseria del Cinquecento, nelle campagne di Noci.
            </p>
          </div>
        </div>
      </div>

      {/* Handoff verso l'atto 02: la linea prosegue, l'occhiello entra, nessun bordo secco. */}
      <div
        data-manifesto-handoff
        className="absolute inset-x-0 bottom-0 z-20"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--carbone) 88%, var(--marrone)) 55%, var(--carbone) 100%)",
        }}
      >
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 pb-6 pt-16 md:px-10 md:pb-8 md:pt-24">
          <span aria-hidden className="h-px w-10 bg-[color:var(--oro)]/70" />
          <p className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--crema)]/60 md:text-[10px]">
            02 — LA STORIA
          </p>
        </div>
      </div>
    </section>
  );
}
