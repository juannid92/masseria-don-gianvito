import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aerial from "@/assets/masseria-aerial.asset.json";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ATTO 03 — IL LUOGO.
 * Firma: STICKY · MASCHERA CHE SI APRE · DEPTH CROP.
 * Nessun pin GSAP, nessun pin-spacer, nessun traveling orizzontale.
 * Regia: sticky CSS nativo + scrub locale su
 *   1) match cut (linea d'oro verticale → muretto orizzontale),
 *   2) clip-path che si apre dal centro,
 *   3) reveal tipografico per riga,
 *   4) depth crop (scale 1 → 1.35),
 *   5) rack focus a due livelli (blur 0/6 px),
 *   6) chiusura sul cortile con solco che si disegna e occhiello 04.
 * Reduced motion: tutto statico e visibile, un solo crop, gap 0.
 *
 * Sostituire eventuali crop provvisori con fotografie autentiche della campagna
 * e del cortile prima della pubblicazione.
 */

type Annotazione = {
  id: "altopiano" | "campagna" | "cortile";
  occhiello: string;
  testo: string;
};

const ANNOTAZIONI: Annotazione[] = [
  {
    id: "altopiano",
    occhiello: "L'ALTOPIANO",
    testo: "Murgia dei trulli, terra rossa e pietra affiorante.",
  },
  {
    id: "campagna",
    occhiello: "LA CAMPAGNA",
    testo: "Campi di foraggio, grano tenero, ortaggi e frutta.",
  },
  {
    id: "cortile",
    occhiello: "IL CORTILE",
    testo:
      "Il centro della masseria: da qui si passa per entrare in tutto il resto.",
  },
];

export function IlLuogo() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const sticky = root.querySelector<HTMLElement>("[data-sticky]");
        const cut = root.querySelector<HTMLElement>("[data-match-cut]");
        const muretto = root.querySelector<HTMLElement>("[data-muretto]");
        const mask = root.querySelector<HTMLElement>("[data-mask]");
        const photo = root.querySelector<HTMLElement>("[data-photo]");
        const photoFar = root.querySelector<HTMLElement>("[data-photo-far]");
        const rack = root.querySelector<HTMLElement>("[data-rack]");
        const righe = Array.from(root.querySelectorAll<HTMLElement>("[data-riga]"));
        const testo = root.querySelector<HTMLElement>("[data-testo]");
        const annot = Array.from(root.querySelectorAll<HTMLElement>("[data-annot]"));
        const solco = root.querySelector<SVGPathElement>("[data-solco]");
        const chiusura = root.querySelector<HTMLElement>("[data-chiusura]");
        const handoff = root.querySelector<HTMLElement>("[data-handoff]");
        const occhiello04 = root.querySelector<HTMLElement>("[data-occhiello-04]");
        if (!sticky || !mask || !photo) return;

        // Solco: preparo dasharray in base alla lunghezza reale.
        let solcoLen = 0;
        if (solco) {
          solcoLen = solco.getTotalLength();
          gsap.set(solco, { strokeDasharray: solcoLen, strokeDashoffset: solcoLen });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
          defaults: { ease: "none" },
        });

        // ── Fase A · match cut ────────────────────────────────────────────
        // Linea d'oro verticale (continua lo spigolo della pietra di Storia)
        // si accorcia e ruota fino a coincidere con il muretto orizzontale.
        if (cut)
          tl.fromTo(
            cut,
            { scaleY: 1, opacity: 1 },
            { scaleY: 0.02, opacity: 0, duration: 0.1 },
            0.04,
          );
        if (muretto)
          tl.fromTo(
            muretto,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.12 },
            0.06,
          );

        // ── Fase B · maschera che si apre dal centro ──────────────────────
        tl.fromTo(
          mask,
          { clipPath: "inset(0% 50% 0% 50%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.22 },
          0.1,
        );

        // Reveal tipografico per riga
        righe.forEach((riga, i) => {
          tl.fromTo(
            riga,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.08 },
            0.16 + i * 0.05,
          );
        });
        if (testo)
          tl.fromTo(testo, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.08 }, 0.34);

        // ── Fase C · primo depth crop (scale 1 → 1.2) ─────────────────────
        tl.fromTo(
          photo,
          { scale: 1, transformOrigin: "50% 55%" },
          { scale: 1.2, duration: 0.24 },
          0.36,
        );
        // Rack focus: livello lontano perde nitidezza.
        if (photoFar)
          tl.fromTo(
            photoFar,
            { filter: "blur(0px)", opacity: 0.9 },
            { filter: "blur(6px)", opacity: 0.55, duration: 0.24 },
            0.36,
          );

        // ── Fase D · secondo depth crop (scale 1.2 → 1.35) sul cortile ────
        tl.to(
          photo,
          {
            scale: 1.28,
            transformOrigin: "38% 62%", // spostamento verso il cortile
            duration: 0.22,
            ease: "power1.inOut",
          },
          0.6,
        );

        // Annotazioni: una alla volta, cross dissolve (mai due leggibili insieme).
        annot.forEach((el, i) => {
          const inAt = [0.42, 0.6, 0.76][i];
          const outAt = [0.58, 0.74, 0.92][i];
          tl.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.05 }, inAt);
          if (i < 2) tl.to(el, { opacity: 0, y: -8, duration: 0.05 }, outAt);
        });

        // ── Fase E · chiusura sul cortile, solco e occhiello 04 ───────────
        if (rack)
          tl.fromTo(
            rack,
            { opacity: 0 },
            { opacity: 1, duration: 0.08 },
            0.82,
          );
        if (solco)
          tl.to(
            solco,
            { strokeDashoffset: 0, duration: 0.14, ease: "power2.out" },
            0.86,
          );
        if (chiusura)
          tl.fromTo(chiusura, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.06 }, 0.9);
        if (handoff) tl.fromTo(handoff, { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0.92);
        if (occhiello04)
          tl.fromTo(occhiello04, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.05 }, 0.96);
      });

      // Mobile / landscape corto: nessuno sticky lungo, sequenza verticale.
      mm.add(
        "(max-width: 899px) and (prefers-reduced-motion: no-preference), (max-height: 520px) and (prefers-reduced-motion: no-preference)",
        () => {
          const mask = root.querySelector<HTMLElement>("[data-mask]");
          const photo = root.querySelector<HTMLElement>("[data-photo]");
          const solco = root.querySelector<SVGPathElement>("[data-solco]");

          if (mask)
            gsap.fromTo(
              mask,
              { clipPath: "inset(0% 30% 0% 30%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                scrollTrigger: {
                  trigger: mask,
                  start: "top 85%",
                  end: "top 30%",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            );

          if (photo)
            gsap.fromTo(
              photo,
              { scale: 1.02 },
              {
                scale: 1.12,
                ease: "none",
                scrollTrigger: {
                  trigger: photo,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            );

          if (solco) {
            const len = solco.getTotalLength();
            gsap.set(solco, { strokeDasharray: len, strokeDashoffset: len });
            gsap.to(solco, {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: {
                trigger: solco.parentElement,
                start: "top 80%",
                end: "bottom 60%",
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            });
          }
        },
      );

      ScrollTrigger.refresh();
      return () => mm.revert();
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const statico = reduced;
  const vis = statico ? 1 : undefined;
  // In reduced motion: maschera aperta, solco disegnato, tutto leggibile.
  const clipStatico = statico ? "inset(0% 0% 0% 0%)" : "inset(0% 50% 0% 50%)";

  return (
    <section
      id="luogo"
      data-act="luogo"
      ref={rootRef}
      aria-label="Il Luogo"
      className="relative isolate w-full bg-[color:var(--carbone)] [@media(min-width:900px)]:min-h-[360dvh]"
    >
      {/* Stage sticky (CSS nativo, NON GSAP pin) */}
      <div
        data-sticky
        className="relative isolate w-full overflow-hidden [@media(min-width:900px)]:sticky [@media(min-width:900px)]:top-0 [@media(min-width:900px)]:h-[100dvh]"
      >
        {/* Fondo di partenza: continua il carbone-marrone di uscita di Storia. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--marrone) 58%, var(--carbone)) 0%, color-mix(in oklab, var(--marrone) 42%, var(--carbone)) 55%, color-mix(in oklab, var(--marrone) 72%, var(--carbone)) 100%)",
          }}
        />

        {/* Match cut: linea d'oro verticale continua lo spigolo di pietra di Storia */}
        <span
          aria-hidden
          data-match-cut
          className="pointer-events-none absolute left-5 top-0 z-20 h-[46%] w-px origin-top md:left-10"
          style={{
            opacity: statico ? 0 : 1,
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--oro) 80%, transparent) 0%, color-mix(in oklab, var(--oro) 30%, transparent) 100%)",
          }}
        />
        {/* Muretto: la stessa linea d'oro, distesa orizzontalmente. */}
        <span
          aria-hidden
          data-muretto
          className="pointer-events-none absolute left-0 right-0 top-[46%] z-20 h-px origin-left"
          style={{
            opacity: statico ? 1 : 0,
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--oro) 60%, transparent) 24%, var(--oro) 50%, color-mix(in oklab, var(--oro) 60%, transparent) 76%, transparent 100%)",
          }}
        />

        {/* Maschera che si apre — contiene la fotografia aerea autentica */}
        <div
          data-mask
          className="absolute inset-0 z-10 overflow-hidden"
          style={{ clipPath: clipStatico }}
        >
          {/* Livello lontano: sfocato per rack focus (solo desktop) */}
          <div
            aria-hidden
            data-photo-far
            className="absolute inset-0 hidden [@media(min-width:900px)]:block"
            style={{ opacity: 0.9 }}
          >
            <img
              src={aerial.url}
              alt=""
              className="h-full w-full object-cover object-[30%_35%]"
              style={{ filter: "saturate(0.9) contrast(0.9) brightness(0.85)" }}
              decoding="async"
            />
          </div>
          {/* Livello vicino: crop largo, decentrato sul campo (non sugli edifici) */}
          <div data-photo className="absolute inset-0 will-change-transform">
            <img
              src={aerial.url}
              alt="Vista aerea dei campi e del cortile della Masseria Don Gianvito, lungo la provinciale per Mottola"
              className="h-full w-full object-cover object-[28%_42%]"
              style={{ filter: "saturate(1) contrast(0.95) brightness(0.94)" }}
              decoding="async"
            />
          </div>
          {/* Scrim di leggibilità per titolo e annotazioni */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, color-mix(in oklab, var(--carbone) 68%, transparent) 0%, color-mix(in oklab, var(--carbone) 30%, transparent) 40%, transparent 60%), linear-gradient(0deg, color-mix(in oklab, var(--carbone) 68%, transparent) 0%, transparent 42%)",
            }}
          />
          <div aria-hidden className="grain absolute inset-0" />
        </div>

        {/* Rack focus / velo caldo che entra nella chiusura */}
        <div
          aria-hidden
          data-rack
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            opacity: statico ? 0.5 : 0,
            background:
              "radial-gradient(52% 44% at 38% 62%, transparent 0%, color-mix(in oklab, var(--marrone) 55%, transparent) 60%, color-mix(in oklab, var(--carbone) 78%, var(--marrone)) 100%)",
          }}
        />

        {/* Editoriale: titolo, testo, annotazioni */}
        <div
          className="relative z-30 mx-auto flex h-full max-w-[1600px] flex-col px-5 pb-16 md:px-10 md:pb-20"
          style={{ paddingTop: "calc(var(--page-header-safe-offset) + 2vh)" }}
        >
          <motion.p
            initial={statico ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--crema)]/75 md:text-[11px]"
          >
            03 — IL LUOGO
          </motion.p>

          {/* Titolo, tre righe, reveal per riga da dietro una maschera */}
          <h2 className="mt-6 font-display text-[clamp(2.4rem,6.6vw,5.6rem)] leading-[0.96] text-[color:var(--crema)] md:mt-10 [@media(max-height:520px)]:mt-3 [@media(max-height:520px)]:text-[clamp(1.8rem,4.4vw,2.6rem)]">
            <span className="block overflow-hidden">
              <span data-riga className="block" style={{ opacity: vis }}>
                Fuori Noci,
              </span>
            </span>
            <span className="ml-[3%] block overflow-hidden md:ml-[7%]">
              <span data-riga className="block" style={{ opacity: vis }}>
                dove la strada
              </span>
            </span>
            <span className="ml-[1%] block overflow-hidden md:ml-[3%]">
              <span
                data-riga
                className="block italic text-[color:var(--oro)]"
                style={{ opacity: vis }}
              >
                smette di correre.
              </span>
            </span>
          </h2>

          <p
            data-testo
            className="mt-8 max-w-[46ch] text-[16px] leading-relaxed text-[color:var(--crema)]/85 md:mt-10 md:text-[17px]"
            style={{ opacity: vis }}
          >
            La masseria si trova lungo la provinciale per Mottola, tra campi coltivati e muretti a
            secco. Intorno non c'è altro: solo terra, alberi e animali.
          </p>

          {/* Le tre annotazioni — una alla volta su desktop, tutte in verticale su mobile */}
          <div className="relative mt-auto flex flex-col gap-6 pt-10 [@media(min-width:900px)]:mt-0 [@media(min-width:900px)]:pt-0">
            <div className="relative min-h-[112px] max-w-[38ch] self-end [@media(min-width:900px)]:absolute [@media(min-width:900px)]:bottom-24 [@media(min-width:900px)]:right-10 [@media(min-width:900px)]:min-h-[140px]">
              {ANNOTAZIONI.map((a, i) => (
                <article
                  key={a.id}
                  data-annot={a.id}
                  className="[@media(min-width:900px)]:absolute [@media(min-width:900px)]:inset-0 relative"
                  style={{
                    opacity: statico ? 1 : undefined,
                    // In reduced motion le annotazioni scorrono in colonna: annullo posizionamento assoluto.
                    position: statico ? "relative" : undefined,
                    marginTop: statico && i > 0 ? "1.25rem" : undefined,
                  }}
                >
                  <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--oro)]/90">
                    {a.occhiello}
                  </p>
                  <p className="mt-3 text-[16px] leading-relaxed text-[color:var(--crema)]/90 md:text-[17px]">
                    {a.testo}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Chiusura */}
          <div className="mt-10 max-w-[46ch] [@media(min-width:900px)]:absolute [@media(min-width:900px)]:bottom-16 [@media(min-width:900px)]:left-10">
            <p
              data-chiusura
              className="text-[13px] leading-relaxed tracking-[0.08em] text-[color:var(--crema)]/70 md:text-[13px]"
              style={{ opacity: vis }}
            >
              Noci (BA), sulla provinciale per Mottola.
            </p>
          </div>
        </div>

        {/* Solco nella terra: primo segno del filo dell'atto 04.
            SVG absolute in fondo alla scena sticky. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[42%] w-full"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
        >
          <path
            data-solco
            d="M -20 240 C 240 210, 480 260, 700 220 S 1080 200, 1240 230"
            fill="none"
            stroke="color-mix(in oklab, var(--oliva) 62%, var(--marrone))"
            strokeWidth="2.2"
            strokeLinecap="round"
            style={{
              // Reduced motion: solco già visibile per intero.
              strokeDasharray: statico ? undefined : 1,
              strokeDashoffset: statico ? 0 : 1,
              filter:
                "drop-shadow(0 1px 0 color-mix(in oklab, var(--carbone) 60%, transparent))",
            }}
          />
        </svg>

        {/* Handoff verso l'atto 04 — fondo finale = fondo di partenza dell'atto 04 */}
        <div
          aria-hidden
          data-handoff
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[48dvh]"
          style={{
            opacity: statico ? 1 : 0,
            background:
              "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--marrone) 62%, var(--carbone)) 55%, var(--marrone) 100%)",
          }}
        />

        {/* Occhiello 04 — LA FILIERA */}
        <div className="absolute inset-x-0 bottom-0 z-30">
          <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 pb-6 md:px-10 md:pb-8">
            <span aria-hidden className="h-px w-10 bg-[color:var(--oro)]/70" />
            <p
              data-occhiello-04
              className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--crema)]/65 md:text-[10px]"
              style={{ opacity: vis }}
            >
              04 — LA FILIERA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}