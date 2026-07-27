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
      className="relative isolate flex w-full flex-col"
      style={{
        // Altezza derivata dal contenuto reale della timeline: nessuna coda vuota.
        minHeight: "108dvh",
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--marrone) 88%, var(--carbone)) 0%, var(--marrone) 24%, color-mix(in oklab, var(--marrone) 84%, var(--carbone)) 72%, color-mix(in oklab, var(--carbone) 92%, var(--marrone)) 100%)",
      }}
    >
      {/* Luce mobile sul fondo terra: variazione, mai piatto. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          data-luce
          className="absolute inset-[-20%]"
          style={{
            background:
              "radial-gradient(58% 46% at 32% 30%, color-mix(in oklab, var(--oliva) 20%, transparent) 0%, transparent 68%), radial-gradient(52% 40% at 76% 72%, color-mix(in oklab, var(--oro) 10%, transparent) 0%, transparent 70%)",
          }}
        />
      </div>
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-50" />

      {/* Scurimento finale: prepara l'atto 02 (carbone caldo). */}
      <div
        aria-hidden
        data-buio
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55dvh]"
        style={{
          opacity: statico ? 1 : 0,
          background:
            "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--carbone) 72%, var(--marrone)) 60%, var(--carbone) 100%)",
        }}
      />

      {/* Unico segno grafico: la linea di continuità che arriva dalla Hero e prosegue. */}
      <span
        aria-hidden
        data-linea
        className="pointer-events-none absolute left-5 top-0 z-10 w-px origin-top bg-gradient-to-b from-[color:var(--oro)]/80 via-[color:var(--oro)]/45 to-transparent md:left-10"
        style={{ height: "62%", transform: statico ? "scaleY(1)" : undefined }}
      />

      {/* Contenuto in flusso, nessun pin. */}
      <div className="relative z-10 flex flex-1 items-center">
        <div
          className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-10 pb-16 pl-10 pr-5 md:grid-cols-12 md:gap-8 md:pb-24 md:pl-20 md:pr-10 [@media(max-height:520px)]:gap-6 [@media(max-height:520px)]:pb-10 md:[@media(max-height:520px)]:pb-10"
          style={{ paddingTop: "calc(var(--page-header-safe-offset) + 2vh)" }}
          data-manifesto-grid
        >
          {/* Colonna della parola */}
          <div className="md:col-span-8 md:col-start-1">
            <p
              data-occhiello
              className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--crema)]/70 md:text-[11px]"
              style={{ opacity: statico ? 1 : undefined }}
            >
              01 — IL MANIFESTO
            </p>
            <h2 className="mt-8 font-display text-[clamp(2.5rem,7.2vw,6.2rem)] leading-[0.95] text-[color:var(--crema)] md:mt-12 [@media(max-height:520px)]:mt-4 [@media(max-height:520px)]:text-[clamp(1.9rem,4.4vw,2.8rem)]">
              <span data-riga className="block" style={{ opacity: statico ? 1 : undefined }}>
                Non compriamo
              </span>
              <span
                data-riga
                className="ml-[5%] block md:ml-[11%]"
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

          {/* Colonna stretta di sostegno, spostata rispetto al titolo */}
          <div className="md:col-span-4 md:col-start-9 md:self-end md:pb-4">
            <p
              data-sostegno
              className="max-w-[40ch] text-[16px] leading-relaxed text-[color:var(--crema)]/85 md:text-[17px]"
              style={{ opacity: statico ? 1 : undefined }}
            >
              Gli animali crescono nei nostri terreni. Il latte diventa formaggio ogni mattina. La
              carne si sceglie al banco. Il pasto si conclude nella nostra sala.
            </p>
            <p
              data-chiusura
              className="mt-12 text-[12.5px] leading-relaxed tracking-[0.06em] text-[color:var(--crema)]/55 md:mt-20 md:text-[13px]"
              style={{ opacity: statico ? 1 : undefined }}
            >
              Una masseria del Cinquecento, nelle campagne di Noci.
            </p>
          </div>
        </div>
      </div>

      {/* Handoff verso l'atto 02: nessun bordo secco, il fondo è già quello successivo. */}
      <div data-manifesto-handoff className="relative z-20">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 pb-6 md:px-10 md:pb-8">
          <span aria-hidden className="h-px w-10 bg-[color:var(--oro)]/70" />
          <p className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--crema)]/60 md:text-[10px]">
            02 — LA STORIA
          </p>
        </div>
      </div>
    </section>
  );
}
