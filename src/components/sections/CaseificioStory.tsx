import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import milkMacro from "@/assets/case-milk-macro.jpg";
import maniImg from "@/assets/case-b-mani.jpg";
import filaturaImg from "@/assets/case-filatura.jpg";
import formeImg from "@/assets/case-c-forme.jpg";

import mozzarellaImg from "@/assets/case-prod-mozzarella.jpg";
import nodiniImg from "@/assets/case-prod-burrata.jpg";
import primoSaleImg from "@/assets/case-prod-caciocavallo.jpg";
import ricottaImg from "@/assets/case-prod-ricotta.jpg";

/* ─────────────────────────── DATA ─────────────────────────── */

type Product = {
  id: string;
  name: string;
  line: string;
  img: string;
};

const PRODUCTS: Product[] = [
  { id: "mozz", name: "Mozzarella km0",  line: "Fatta la mattina, in tavola la sera.", img: mozzarellaImg },
  { id: "nod",  name: "Nodini",          line: "Il gesto della mano, ripetuto.",       img: nodiniImg },
  { id: "ps",   name: "Primo sale",      line: "Fresco, di giornata.",                 img: primoSaleImg },
  { id: "ric",  name: "Ricotta",         line: "Dal siero del mattino.",               img: ricottaImg },
];

const QUOTES = [
  { text: "Le mozzarelle km0 sono sublimi.", from: "Tripadvisor" },
  { text: "Tutto di loro produzione.",       from: "Tripadvisor" },
];

/* ─────────────────────────── COMPONENT ─────────────────────────── */

export function CaseificioStory() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [temp, setTemp] = useState(18);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (reduced) return;
      const mm = gsap.matchMedia();

      /* ══════ STATO 1 · DENTRO LA TINA ══════ */
      const s1 = root.querySelector<HTMLElement>("[data-stato='1']");
      const macro = root.querySelector<HTMLElement>("[data-macro]");
      const tina = root.querySelector<HTMLElement>("[data-tina]");
      const milkTitle = root.querySelector<HTMLElement>("[data-milk-title]");

      if (s1 && macro && tina) {
        gsap.set(tina, { autoAlpha: 0, scale: 1.15 });
        ScrollTrigger.create({
          trigger: s1,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(macro, {
              scale: 1 + p * 0.2,
              rotationX: p * 12,
              autoAlpha: 1 - Math.min(1, p * 1.4),
              transformPerspective: 800,
              transformOrigin: "50% 100%",
            });
            gsap.set(tina, {
              autoAlpha: Math.max(0, (p - 0.35) * 2),
              scale: 1.15 - p * 0.15,
            });
            setTemp(Math.round(18 + p * 19));
          },
        });
        if (milkTitle) {
          gsap.fromTo(
            milkTitle,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              ease: "power2.out",
              scrollTrigger: {
                trigger: s1,
                start: "60% top",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }
      }

      /* ══════ COLONNA DI LATTE (persistente, morfa fra stati) ══════ */
      // Su desktop è pinnata al centro sui tre stati centrali; su mobile è inline.
      mm.add("(min-width: 900px)", () => {
        const colWrap = root.querySelector<HTMLElement>("[data-col-wrap]");
        const col = root.querySelector<HTMLElement>("[data-col]");
        const s2 = root.querySelector<HTMLElement>("[data-stato='2']");
        const s3 = root.querySelector<HTMLElement>("[data-stato='3']");
        const s4 = root.querySelector<HTMLElement>("[data-stato='4']");
        if (!colWrap || !col || !s2 || !s3 || !s4) return;

        // Pin la colonna dai s2 fino a fine s4
        ScrollTrigger.create({
          trigger: s2,
          start: "top top",
          endTrigger: s4,
          end: "top center",
          pin: colWrap,
          pinSpacing: false,
        });

        // Stato 2 · liquido → cagliata (colonna si "rapprende": scala + colore)
        gsap.fromTo(
          col,
          { scaleY: 1, scaleX: 1, borderRadius: "40%", filter: "blur(6px) brightness(1.05)" },
          {
            scaleY: 0.95,
            scaleX: 0.9,
            borderRadius: "18%",
            filter: "blur(2px) brightness(0.98)",
            ease: "none",
            scrollTrigger: { trigger: s2, start: "top center", end: "bottom center", scrub: 1 },
          },
        );

        // Stato 3 · filatura → stretch verticale elastico
        gsap.fromTo(
          col,
          { scaleY: 0.95, scaleX: 0.9 },
          {
            scaleY: 1.8,
            scaleX: 0.35,
            borderRadius: "50%",
            ease: "power2.inOut",
            scrollTrigger: { trigger: s3, start: "top center", end: "bottom center", scrub: 1 },
          },
        );

        // Stato 4 · si compatta in forma + vira all'oro
        gsap.fromTo(
          col,
          { scaleY: 1.8, scaleX: 0.35 },
          {
            scaleY: 0.6,
            scaleX: 0.7,
            borderRadius: "20%",
            background:
              "linear-gradient(180deg, var(--crema) 0%, color-mix(in oklab, var(--crema) 60%, var(--oro)) 60%, var(--oro) 100%)",
            ease: "power2.out",
            scrollTrigger: { trigger: s4, start: "top center", end: "center center", scrub: 1 },
          },
        );
      });

      /* ══════ STATO 2 · etichette scala tempo/temp ══════ */
      root.querySelectorAll<HTMLElement>("[data-etichetta]").forEach((el) => {
        gsap.fromTo(
          el,
          { x: 40, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });

      /* ══════ STATO 3 · didascalia bassa che si stira ══════ */
      const dida = root.querySelector<HTMLElement>("[data-dida]");
      const s3el = root.querySelector<HTMLElement>("[data-stato='3']");
      if (dida && s3el) {
        gsap.fromTo(
          dida,
          { letterSpacing: "0em", autoAlpha: 0.4 },
          {
            letterSpacing: "0.25em",
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: s3el, start: "top center", end: "bottom center", scrub: 1 },
          },
        );
      }

      /* ══════ STATO 4 · prodotti broken grid ══════ */
      root.querySelectorAll<HTMLElement>("[data-prod]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            delay: (i % 3) * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      /* ══════ Vapore (solo stato 1) ══════ */
      const vaporWrap = root.querySelector<HTMLElement>("[data-vapor]");
      if (vaporWrap) {
        const puffs = vaporWrap.querySelectorAll<HTMLElement>("[data-puff]");
        puffs.forEach((p, i) => {
          gsap.set(p, { autoAlpha: 0, y: 0, x: gsap.utils.random(-15, 15) });
          gsap.to(p, {
            autoAlpha: 0.35,
            duration: 1.2,
            delay: i * 0.15,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          gsap.to(p, {
            y: -180,
            duration: gsap.utils.random(6, 10),
            delay: i * 0.15,
            repeat: -1,
            ease: "none",
          });
        });
      }

      /* ══════ Filo che chiude (bianco → oro esce in basso) ══════ */
      const bridge = root.querySelector<HTMLElement>("[data-bridge-thread]");
      if (bridge) {
        gsap.fromTo(
          bridge,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: bridge,
              start: "top 90%",
              end: "bottom bottom",
              scrub: 1,
            },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="relative w-full text-[color:var(--crema)]"
      style={{ background: "var(--crema)" }}
    >
      {/* ══════════ STATO 1 · DENTRO LA TINA ══════════ */}
      <section
        data-stato="1"
        className="relative h-[220vh]"
        aria-label="Dentro la tina"
        style={{ background: "var(--crema)" }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Macro latte pieno schermo */}
          <div
            data-macro
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${milkMacro})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(1.05) saturate(0.9)",
            }}
          />
          {/* Tina d'acciaio (reveal) */}
          <div
            data-tina
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${maniImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center 45%",
            }}
          />
          {/* Warm-cool alba wash */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(242,232,213,0.15) 0%, rgba(242,232,213,0) 40%, rgba(61,42,30,0.35) 100%)",
            }}
          />
          {/* Vapore */}
          <div
            data-vapor
            aria-hidden
            className="absolute inset-x-0 bottom-1/3 top-1/4 pointer-events-none z-10"
          >
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                data-puff
                className="absolute rounded-full"
                style={{
                  left: `${10 + ((i * 6.5) % 80)}%`,
                  bottom: `${(i * 7) % 40}%`,
                  width: `${40 + (i % 4) * 20}px`,
                  height: `${40 + (i % 4) * 20}px`,
                  background:
                    "radial-gradient(circle, rgba(242,232,213,0.55) 0%, rgba(242,232,213,0) 70%)",
                  filter: "blur(6px)",
                }}
              />
            ))}
          </div>
          {/* Rail sinistro */}
          <div
            aria-hidden
            className="absolute left-4 md:left-8 top-0 h-full flex items-center pointer-events-none z-20"
          >
            <div
              className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/70"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                letterSpacing: "0.3em",
              }}
            >
              CASEIFICIO · II · NOCI · {String(temp).padStart(2, "0")}°C
            </div>
          </div>
          {/* Titolo che affiora sulla superficie */}
          <div className="absolute inset-x-0 top-[52%] flex justify-center pointer-events-none px-6 z-20">
            <h1
              data-milk-title
              className="font-display text-center leading-[0.9]"
              style={{
                fontSize: "clamp(2.2rem, 7vw, 5.5rem)",
                color: "var(--marrone)",
                textShadow: "0 1px 30px rgba(242,232,213,0.9)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
              }}
            >
              Il latte di ogni mattina
            </h1>
          </div>
          {/* Cue scroll */}
          <div className="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none z-20">
            <div className="font-eyebrow text-[10px] text-[color:var(--marrone)]/50 tracking-[0.3em]">
              ↓ SCENDI NELLA TINA
            </div>
          </div>
          <div className="grain absolute inset-0 pointer-events-none" />
        </div>
      </section>

      {/* ══════════ WRAPPER COLONNA (pinned su desktop, inline mobile) ══════════ */}
      <div className="relative">
        {/* Colonna latte pinnata (solo desktop, gestita in JS) */}
        <div
          data-col-wrap
          aria-hidden
          className="hidden md:flex fixed md:absolute inset-0 pointer-events-none items-center justify-center z-[5]"
          style={{ position: "absolute" }}
        >
          <div
            data-col
            className="will-change-transform"
            style={{
              width: "min(28vw, 340px)",
              height: "70vh",
              borderRadius: "40%",
              background:
                "radial-gradient(ellipse at 50% 30%, #ffffff 0%, var(--crema) 40%, color-mix(in oklab, var(--crema) 70%, var(--marrone)) 100%)",
              filter: "blur(6px) brightness(1.05)",
              boxShadow: "0 0 80px rgba(242,232,213,0.4)",
            }}
          />
        </div>

        {/* ══════════ STATO 2 · LA CAGLIATA ══════════ */}
        <section
          data-stato="2"
          className="relative"
          aria-label="La cagliata"
          style={{
            background:
              "linear-gradient(180deg, var(--crema) 0%, color-mix(in oklab, var(--crema) 30%, var(--marrone)) 100%)",
            minHeight: "150vh",
          }}
        >
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 pt-32 pb-24 grid md:grid-cols-2 gap-10">
            {/* Sinistra · ritratto mani */}
            <div className="relative">
              <div
                className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-sm shadow-2xl"
                style={{ background: "var(--marrone)" }}
              >
                <img
                  src={maniImg}
                  alt="Mani nella tina, caseificio Don Gianvito"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={{ filter: "saturate(0.85)" }}
                />
              </div>
              <div className="mt-4 font-eyebrow text-[10px] text-[color:var(--marrone)]/70 tracking-[0.3em]">
                LA CAGLIATA · STATO II
              </div>
            </div>

            {/* Destra · scala tempo/temperatura come etichette */}
            <div className="relative pt-8 md:pt-24">
              <ol className="space-y-10">
                {[
                  { t: "18°C", when: "05:30 · l'arrivo", note: "Il latte munto poco fa. Ancora caldo." },
                  { t: "37°C", when: "l'attesa · 30 min", note: "Caglio naturale, senza fretta." },
                  { t: "45°C", when: "la separazione", note: "Il siero si stacca. La cagliata affiora." },
                ].map((step) => (
                  <li
                    key={step.t}
                    data-etichetta
                    className="border-l border-[color:var(--oro)]/40 pl-5 text-[color:var(--crema)]"
                  >
                    <div className="font-eyebrow text-[11px] tracking-[0.3em] text-[color:var(--oro)]">
                      {step.t}
                    </div>
                    <div
                      className="font-display leading-tight mt-1"
                      style={{ fontSize: "clamp(1.4rem, 2.4vw, 2.1rem)", fontWeight: 300 }}
                    >
                      {step.when}
                    </div>
                    <p className="mt-1 text-sm md:text-base text-[color:var(--crema)]/75 max-w-md">
                      {step.note}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-14 max-w-md font-display italic text-[color:var(--crema)]/85 text-lg leading-snug">
                Il latte delle nostre mucche, caglio naturale, attesa.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════ STATO 3 · LA FILATURA ══════════ */}
        <section
          data-stato="3"
          className="relative overflow-hidden"
          aria-label="La filatura"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--marrone) 90%, var(--crema)) 0%, var(--carbone) 100%)",
            minHeight: "160vh",
          }}
        >
          {/* Gesto in primo piano */}
          <div className="relative z-10 h-screen sticky top-0 flex flex-col items-center justify-end pb-16 px-6">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: `url(${filaturaImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.55) contrast(1.1)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(26,18,16,0.85) 80%)",
              }}
            />
            <div className="relative text-center max-w-3xl">
              <div className="font-eyebrow text-[10px] text-[color:var(--crema)]/50 tracking-[0.3em] mb-3">
                STATO III · LA PASTA FILATA
              </div>
              <p
                data-dida
                className="font-display italic text-[color:var(--crema)]"
                style={{
                  fontSize: "clamp(1.4rem, 3vw, 2.5rem)",
                  fontWeight: 300,
                  lineHeight: 1.2,
                }}
              >
                il filo che non si spezza
              </p>
              <p className="mt-5 text-[color:var(--crema)]/70 max-w-lg mx-auto text-sm md:text-base">
                Acqua a 90°C, la pasta si stira nelle mani. Un solo gesto,
                mille volte al giorno.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════ STATO 4 · LE FORME & IL TEMPO ══════════ */}
        <section
          data-stato="4"
          className="relative"
          aria-label="Le forme e il tempo"
          style={{
            background:
              "linear-gradient(180deg, var(--carbone) 0%, var(--marrone) 30%, var(--marrone) 100%)",
            minHeight: "120vh",
          }}
        >
          <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 pt-32 pb-24">
            <div className="mb-16 text-center">
              <div className="font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.35em] mb-4">
                STATO IV · LE FORME
              </div>
              <h2
                className="font-display text-[color:var(--crema)] mx-auto max-w-3xl leading-[1.05]"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 300 }}
              >
                Le forme escono dal siero.
              </h2>
            </div>

            {/* Broken grid prodotti */}
            <div className="grid grid-cols-12 gap-6 md:gap-8">
              {PRODUCTS.map((p, i) => {
                const layouts = [
                  "col-span-12 md:col-span-6 md:col-start-1",
                  "col-span-12 md:col-span-5 md:col-start-8 md:mt-24",
                  "col-span-12 md:col-span-5 md:col-start-2 md:mt-8",
                  "col-span-12 md:col-span-6 md:col-start-7 md:mt-16",
                ];
                return (
                  <article
                    key={p.id}
                    data-prod
                    className={`${layouts[i]} relative`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-2xl">
                      <img
                        src={p.img}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        style={{ filter: "saturate(0.9)" }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 55%, rgba(26,18,16,0.75) 100%)",
                        }}
                      />
                      {/* Targhetta */}
                      <div
                        className="absolute bottom-4 left-4 right-4 border border-[color:var(--oro)]/30 bg-[color:var(--marrone)]/85 backdrop-blur-sm px-4 py-3"
                        style={{ borderRadius: "2px" }}
                      >
                        <div className="font-eyebrow text-[10px] text-[color:var(--oro)] tracking-[0.3em] mb-1">
                          {String(i + 1).padStart(2, "0")} · CASEIFICIO
                        </div>
                        <div
                          className="font-display text-[color:var(--crema)] leading-tight"
                          style={{ fontSize: "clamp(1.15rem, 1.6vw, 1.5rem)", fontWeight: 400 }}
                        >
                          {p.name}
                        </div>
                        <div className="mt-1 text-[color:var(--crema)]/70 text-xs md:text-sm italic">
                          {p.line}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Riga salumi */}
            <div className="mt-16 md:mt-24 max-w-4xl mx-auto text-center">
              <div className="font-eyebrow text-[10px] text-[color:var(--oro)]/70 tracking-[0.3em] mb-3">
                E DALL'ALLEVAMENTO
              </div>
              <p
                className="font-display text-[color:var(--crema)] leading-snug"
                style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)", fontWeight: 300 }}
              >
                Arrivano anche i salumi:{" "}
                <em className="not-italic text-[color:var(--crema)]/85">
                  prosciutto crudo · sopressata · salsiccia secca · pancetta tesa
                </em>
                .
                <br />
                <span className="text-[color:var(--crema)]/70">Tutto di nostra produzione.</span>
              </p>
            </div>

            {/* Recensioni fluttuanti */}
            <div className="relative mt-20 md:mt-28 flex flex-col md:flex-row gap-8 md:gap-16 justify-center items-center">
              {QUOTES.map((q, i) => (
                <blockquote
                  key={i}
                  data-prod
                  className={`max-w-sm ${i === 1 ? "md:mt-16" : ""}`}
                >
                  <p
                    className="font-display italic text-[color:var(--crema)] leading-snug"
                    style={{ fontSize: "clamp(1.25rem, 2vw, 1.7rem)", fontWeight: 300 }}
                  >
                    “{q.text}”
                  </p>
                  <footer className="mt-3 font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.3em]">
                    — {q.from}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ══════════ PONTE · IL FILO BIANCO → ORO ══════════ */}
      <section
        aria-label="Ponte alla Macelleria"
        className="relative py-24 md:py-32 flex flex-col items-center px-6 text-center"
        style={{
          background:
            "linear-gradient(180deg, var(--marrone) 0%, color-mix(in oklab, var(--marrone) 70%, var(--carbone)) 100%)",
        }}
      >
        {/* forma di sfondo sottile */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `url(${formeImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "sepia(0.2)",
          }}
        />
        <div className="relative">
          {/* Filo bianco→oro */}
          <svg
            data-bridge-thread
            aria-hidden
            className="mb-10 mx-auto h-32 w-px block will-change-transform"
            viewBox="0 0 1 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="thread-wtg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--crema)" />
                <stop offset="100%" stopColor="var(--oro)" />
              </linearGradient>
            </defs>
            <line x1="0.5" y1="0" x2="0.5" y2="100" stroke="url(#thread-wtg)" strokeWidth="1.5" />
          </svg>
          <div className="font-eyebrow text-[10px] text-[color:var(--crema)]/50 tracking-[0.35em] mb-4">
            CONTINUA · CAPITOLO III
          </div>
          <Link
            to="/macelleria"
            className="group inline-block font-display text-[color:var(--crema)] hover:text-[color:var(--oro)] transition-colors"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", fontWeight: 300 }}
          >
            La Macelleria
            <span
              aria-hidden
              className="block mx-auto mt-3 h-px bg-[color:var(--oro)]"
              style={{ width: "40%" }}
            />
          </Link>
          <p className="mt-6 max-w-xl text-[color:var(--crema)]/60 text-sm md:text-base italic">
            Dal latte alla carne, sempre le stesse mani.
          </p>
        </div>
      </section>
    </div>
  );
}
