import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ATTO 01 — IL MANIFESTO.
 * Firma: TERRA · PAROLA · PROFONDITÀ.
 * Stage pinnato (>=900px), livelli interni traslati in parallasse.
 * Nessuna fotografia: materia, luce, tipografia.
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
      const stage = root.querySelector<HTMLElement>("[data-stage]");
      const terra = root.querySelector<HTMLElement>("[data-layer='terra'] [data-move]");
      const luce = root.querySelector<HTMLElement>("[data-layer='luce'] [data-move]");
      const grana = root.querySelector<HTMLElement>("[data-layer='grana'] [data-move]");
      const editoriale = root.querySelector<HTMLElement>("[data-editorial]");
      const chiusura = root.querySelector<HTMLElement>("[data-chiusura]");
      const linea = root.querySelector<HTMLElement>("[data-linea]");
      const righe = Array.from(root.querySelectorAll<HTMLElement>("[data-riga]"));
      const sostegno = root.querySelector<HTMLElement>("[data-sostegno]");
      const handoff = root.querySelector<HTMLElement>("[data-handoff]");
      const occhiello02 = root.querySelector<HTMLElement>("[data-occhiello-02]");
      if (!stage) return;

      const mm = gsap.matchMedia();

      const buildTimeline = (pin: boolean) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: pin ? "top top" : "top bottom",
            end: pin ? "+=120%" : "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            ...(pin ? { pin: stage, pinSpacing: true, anticipatePin: 1 } : {}),
          },
          defaults: { ease: "none" },
        });

        // Parallasse multilivello — solo transform/opacity.
        if (terra)
          tl.fromTo(
            terra,
            { yPercent: 0, scale: 1.06 },
            { yPercent: -6, scale: 1, duration: 1 },
            0,
          );
        if (luce)
          tl.fromTo(
            luce,
            { yPercent: 0, xPercent: -4, opacity: 0.35 },
            { yPercent: -14, xPercent: 6, opacity: 0.6, duration: 1 },
            0,
          );
        if (grana) tl.fromTo(grana, { yPercent: 0 }, { yPercent: -3, duration: 1 }, 0);
        // Su mobile/landscape (senza pin) i livelli di testo non traslano: nessun taglio sotto l'header.
        if (pin && editoriale) tl.fromTo(editoriale, { yPercent: 0 }, { yPercent: -20, duration: 1 }, 0);
        if (pin && chiusura) tl.fromTo(chiusura, { yPercent: 0 }, { yPercent: -28, duration: 1 }, 0);

        // Label narrativa (progress 0 → 1).
        tl.addLabel("terra", 0)
          .addLabel("linea", 0.1)
          .addLabel("riga1", 0.18)
          .addLabel("riga2", 0.3)
          .addLabel("riga3", 0.42)
          .addLabel("sostegno", 0.55)
          .addLabel("luce", 0.6)
          .addLabel("chiusura", 0.75)
          .addLabel("attenua", 0.85)
          .addLabel("handoff", 0.92)
          .addLabel("atto02", 1);

        if (linea) tl.fromTo(linea, { scaleY: 0 }, { scaleY: 1, duration: 0.12 }, "linea");
        righe.forEach((riga, i) => {
          tl.fromTo(
            riga,
            { opacity: 0, y: 24, x: i === 1 ? 28 : 0 },
            { opacity: 1, y: 0, x: 0, duration: 0.1 },
            [0.18, 0.3, 0.42][i] ?? 0.42,
          );
        });
        if (sostegno)
          tl.fromTo(sostegno, { opacity: 0, x: 32 }, { opacity: 1, x: 0, duration: 0.1 }, "sostegno");
        if (chiusura)
          tl.fromTo(chiusura, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.08 }, "chiusura");
        if (editoriale) tl.to(editoriale, { opacity: 0.4, duration: 0.15 }, "attenua");
        if (handoff) tl.fromTo(handoff, { opacity: 0 }, { opacity: 1, duration: 0.08 }, "handoff");
        if (occhiello02)
          tl.fromTo(occhiello02, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.06 }, 0.94);

        return tl;
      };

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        buildTimeline(true);
      });

      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        buildTimeline(false);
      });

      ScrollTrigger.refresh();

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // Parallasse mouse (max 8px) su wrapper separati rispetto allo scrub.
  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-mouse]"));
    if (!targets.length) return;

    let frame = 0;
    const onMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        targets.forEach((el, i) => {
          const amp = i === 0 ? 5 : 8;
          el.style.transform = `translate3d(${(-nx * amp).toFixed(2)}px, ${(-ny * amp).toFixed(2)}px, 0)`;
        });
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
      targets.forEach((el) => (el.style.transform = ""));
    };
  }, [reduced]);

  const statico = reduced;
  const vis = statico ? 1 : undefined;

  return (
    <section
      id="manifesto"
      data-act="manifesto"
      data-tone="light"
      ref={rootRef}
      aria-label="Il Manifesto"
      className="relative isolate w-full"
    >
      <div
        data-stage
        className="relative isolate flex w-full flex-col overflow-hidden min-h-[124dvh] bg-[color:var(--bianco-calce)] [@media(min-width:900px)]:h-[100dvh] [@media(min-width:900px)]:min-h-0"
      >
        {/* 1 — FONDO BIANCO CALCE (nessuna finta terra: pieno, grana finissima) */}
        <div aria-hidden data-layer="terra" className="pointer-events-none absolute inset-0">
          <div data-mouse className="absolute inset-0 will-change-transform">
            <div
              data-move
              className="absolute inset-[-8%]"
              style={{
                background:
                  "var(--bianco-calce)",
              }}
            />
          </div>
        </div>

        {/* 2 — LUCE DIREZIONALE (radiali tenui d'oro, nessun oliva) */}
        <div aria-hidden data-layer="luce" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div data-mouse className="absolute inset-0 will-change-transform">
            <div
              data-move
              className="absolute inset-[-25%]"
              style={{
                opacity: statico ? 0.7 : 0.55,
                background:
                  "radial-gradient(58% 44% at 30% 22%, color-mix(in oklab, var(--oro-antico) 10%, transparent) 0%, transparent 68%), radial-gradient(50% 38% at 74% 70%, color-mix(in oklab, var(--pietra-800) 8%, transparent) 0%, transparent 70%)",
              }}
            />
          </div>
        </div>

        {/* 3 — GRANA */}
        <div aria-hidden data-layer="grana" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div data-move className="grain absolute inset-[-4%] opacity-30" />
        </div>

        {/* Linea di continuità dalla Hero — oro su bianco, discreta */}
        <span
          aria-hidden
          data-linea
          className="pointer-events-none absolute left-5 top-0 z-10 w-px origin-top bg-gradient-to-b from-[color:var(--oro-antico)]/70 via-[color:var(--oro-antico)]/30 to-transparent md:left-10"
          style={{ height: "66%", transform: statico ? "scaleY(1)" : undefined }}
        />

        {/* 4 — EDITORIALE */}
        <div data-editorial className="relative z-10 flex flex-1 items-center">
          <div
            className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-10 pb-16 pl-10 pr-5 md:grid-cols-12 md:gap-8 md:pb-24 md:pl-20 md:pr-10 [@media(max-height:520px)]:gap-5 [@media(max-height:520px)]:pb-8"
            style={{ paddingTop: "calc(var(--page-header-safe-offset) + 2vh)" }}
          >
            <div className="md:col-span-8 md:col-start-1">
              <motion.p
                initial={statico ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--pietra-800)]/85 md:text-[11px]"
              >
                01 — IL MANIFESTO
              </motion.p>

              <h2 className="mt-8 font-display text-[clamp(2.6rem,7.4vw,6.4rem)] leading-[0.94] text-[color:var(--carbone)] md:mt-12 [@media(max-height:520px)]:mt-4 [@media(max-height:520px)]:text-[clamp(1.9rem,4.6vw,2.9rem)]">
                <span data-riga className="block" style={{ opacity: vis }}>
                  Tutto nasce
                </span>
                <span data-riga className="ml-[5%] block md:ml-[11%]" style={{ opacity: vis }}>
                  nella stessa
                </span>
                <span
                  data-riga
                  className="ml-[2%] block italic text-[color:var(--oro-antico-testo)] md:ml-[4%]"
                  style={{ opacity: vis }}
                >
                  terra.
                </span>
              </h2>
            </div>

            <div className="md:col-span-4 md:col-start-9 md:self-end md:pb-4">
              <p
                data-sostegno
                className="max-w-[42ch] text-[16px] leading-relaxed text-[color:var(--carbone)]/85 md:text-[17px]"
                style={{ opacity: vis }}
              >
                Gli animali crescono nei nostri terreni. Il latte diventa formaggio ogni mattina. La
                carne si sceglie al banco. Il pasto finisce nella nostra sala.
              </p>
              <p
                data-chiusura
                className="mt-12 text-[16px] leading-relaxed tracking-[0.04em] text-[color:var(--pietra-800)]/80 md:mt-20 md:text-[16px]"
                style={{ opacity: vis }}
              >
                Una masseria del Cinquecento, nelle campagne di Noci.
              </p>
            </div>
          </div>
        </div>

        {/* Handoff verso l'atto 02 (scuro): bianco calce → pietra-800 */}
        <div
          aria-hidden
          data-handoff
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58dvh]"
          style={{
            opacity: statico ? 1 : 0,
            background:
              "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--bianco-calce) 55%, var(--pietra-800)) 55%, var(--pietra-800) 100%)",
          }}
        />

        <div className="relative z-20">
          <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 pb-6 md:px-10 md:pb-8">
            <span aria-hidden className="h-px w-10 bg-[color:var(--oro-antico)]/70" />
            <p
              data-occhiello-02
              className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--bianco-calce)]/80 md:text-[10px]"
              style={{ opacity: vis }}
            >
              02 — LA STORIA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
