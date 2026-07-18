import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * LA TAVOLA — "La Sera" a Masseria Don Gianvito.
 * 5 atti verticali: Arrivo · Antipasto · Primi · Arrosto · Dolci.
 * Tema TERRA & PIETRA. --terracotta solo nel crossfade griglia atto 3.
 * ───────────────────────────────────────────────────────────── */

const ANTIPASTO = [
  "Prosciutto crudo di propria produzione",
  "Sopressata",
  "Salsiccia secca",
  "Pancetta tesa",
  "Nodini",
  "Primo sale",
  "Frittelle del nostro grano · ricotta piccante e pomodorini",
  "Zucchine marinate a sfoglie",
];

const PRIMI = [
  "Polpettine al sugo · in pignatiello",
  "Spezzatino di vitello e maiale",
];

const ARROSTO = [
  "Pecora in Pignata · 5 ore nel forno a legna",
  "Filetto di vitello · Pezzata Rossa × Frisona · frollatura 15 giorni · al sangue",
  "Bombette",
  "Salsiccia",
];

const DOLCI = ["Dolcini artigianali fatti in casa"];

const WHATSAPP = "https://wa.me/393339395750";

export function LaTavola() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* Ghost roman parallax */
      root.querySelectorAll<HTMLElement>("[data-ghost]").forEach((el) => {
        gsap.to(el, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("[data-atto]") as Element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      /* ATTO 0 — focus pull */
      const atto0 = root.querySelector<HTMLElement>("[data-atto='0']");
      if (atto0) {
        const img = atto0.querySelector<HTMLElement>("[data-img]");
        gsap.fromTo(
          img,
          { filter: "blur(6px)", scale: 1.06 },
          {
            filter: "blur(0px)",
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: atto0,
              start: "top bottom",
              end: "center center",
              scrub: 0.6,
            },
          }
        );
      }

      /* ATTO 1 — clip circle + stagger voci */
      const atto1 = root.querySelector<HTMLElement>("[data-atto='1']");
      if (atto1) {
        const img = atto1.querySelector<HTMLElement>("[data-img]");
        const rows = atto1.querySelectorAll<HTMLElement>("[data-row]");
        gsap.set(img, { clipPath: "circle(0% at 50% 50%)" });
        gsap.set(rows, { autoAlpha: 0, x: 40 });
        ScrollTrigger.create({
          trigger: atto1,
          start: "top 60%",
          once: true,
          onEnter: () => {
            gsap.to(img, {
              clipPath: "circle(75% at 50% 50%)",
              duration: 1.6,
              ease: "cubic-bezier(.16,1,.3,1)",
            });
            gsap.to(rows, {
              autoAlpha: 1,
              x: 0,
              duration: 0.55,
              stagger: 0.09,
              ease: "power2.out",
              delay: 0.4,
            });
          },
        });
      }

      /* ATTO 2 — slide sx + mask-wipe testo */
      const atto2 = root.querySelector<HTMLElement>("[data-atto='2']");
      if (atto2) {
        const img = atto2.querySelector<HTMLElement>("[data-img]");
        const title = atto2.querySelector<HTMLElement>("[data-title]");
        const rows = atto2.querySelectorAll<HTMLElement>("[data-row]");
        gsap.set(img, { autoAlpha: 0, x: -80 });
        gsap.set(title, { clipPath: "inset(0 0 100% 0)" });
        gsap.set(rows, { autoAlpha: 0, y: 12 });
        ScrollTrigger.create({
          trigger: atto2,
          start: "top 60%",
          once: true,
          onEnter: () => {
            gsap.to(img, { autoAlpha: 1, x: 0, duration: 1.1, ease: "power3.out" });
            gsap.to(title, {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.1,
              ease: "cubic-bezier(.16,1,.3,1)",
              delay: 0.2,
            });
            gsap.to(rows, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.5,
            });
          },
        });
      }

      /* ATTO 3 — warm-wash → crossfade griglia terracotta → piatto */
      const atto3 = root.querySelector<HTMLElement>("[data-atto='3']");
      if (atto3) {
        const wash = atto3.querySelector<HTMLElement>("[data-wash]");
        const grill = atto3.querySelector<HTMLElement>("[data-grill]");
        const plate = atto3.querySelector<HTMLElement>("[data-plate]");
        const rows = atto3.querySelectorAll<HTMLElement>("[data-row]");
        gsap.set(wash, { autoAlpha: 0 });
        gsap.set(grill, { autoAlpha: 0 });
        gsap.set(plate, { autoAlpha: 0 });
        gsap.set(rows, { autoAlpha: 0, y: 14 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: atto3,
            start: "top 65%",
            once: true,
          },
        });
        tl.to(wash, { autoAlpha: 1, duration: 1.2, ease: "power2.inOut" })
          .to(
            rows,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.08,
              ease: "power2.out",
            },
            "-=0.6"
          )
          .to(grill, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, "+=0.2")
          .to(grill, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" }, "+=1.0")
          .to(plate, { autoAlpha: 1, duration: 0.9, ease: "power2.out" }, "-=0.3");
      }

      /* ATTO 4 — fade + scale dolce */
      const atto4 = root.querySelector<HTMLElement>("[data-atto='4']");
      if (atto4) {
        const wrap = atto4.querySelector<HTMLElement>("[data-fade]");
        gsap.fromTo(
          wrap,
          { autoAlpha: 0, scale: 0.95 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: atto4, start: "top 65%", once: true },
          }
        );
      }

      /* mobile: skip pesanti */
      mm.add("(max-width: 767px)", () => {
        gsap.set(
          root.querySelectorAll<HTMLElement>(
            "[data-row], [data-img], [data-title], [data-fade]"
          ),
          { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: "none" }
        );
      });

      /* safety fallback */
      const safety = window.setTimeout(() => {
        gsap.set(
          root.querySelectorAll<HTMLElement>(
            "[data-row], [data-img], [data-title], [data-fade], [data-wash], [data-plate]"
          ),
          { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: "none" }
        );
      }, 3500);

      return () => {
        window.clearTimeout(safety);
        mm.revert();
      };
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="tavola"
      ref={rootRef}
      aria-label="La sera alla masseria — la tavola"
      className="relative isolate"
    >
      {/* Grana film */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-40 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* ═══ ATTO 0 · L'ARRIVO ═══ */}
      <Atto id="0" bg="var(--marrone)" heightVh={100}>
        <RomanGhost n="0" />
        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-24 md:grid-cols-12 md:px-10">
          <div className="md:col-span-6">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--crema)]/40">
              05 — La Tavola
            </p>
            <h2
              className="mt-6 font-display leading-[0.95] text-[color:var(--crema)]"
              style={{ fontSize: "clamp(2.6rem,7vw,6rem)" }}
            >
              La <em className="italic text-[color:var(--oro)]">sera</em> alla masseria.
            </h2>
            <p className="mt-8 max-w-md font-body text-base text-[color:var(--crema)]/70 md:text-lg">
              Si sceglie la carne al banco. Ti siedi. Si comincia.
            </p>
          </div>
          <div className="md:col-span-6">
            <div
              data-img
              className="relative aspect-[4/5] w-full overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #2a1c14 0%, #4a3626 55%, #8a6a4a 100%)",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 80%, color-mix(in oklab, var(--oro) 22%, transparent) 0%, transparent 55%), radial-gradient(ellipse at 75% 40%, color-mix(in oklab, var(--crema) 15%, transparent) 0%, transparent 60%)",
                }}
              />
              <p className="absolute bottom-4 left-4 font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--crema)]/50">
                Tavoli sotto gli ulivi · l'ora dell'ombra lunga
              </p>
            </div>
          </div>
        </div>
      </Atto>

      {/* ═══ ATTO 1 · L'ANTIPASTO ═══ */}
      <Atto id="1" bg="var(--marrone)" heightVh={110}>
        <RomanGhost n="I" />
        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 py-24 md:grid-cols-12 md:px-10">
          <div className="md:order-2 md:col-span-6">
            <div
              data-img
              className="relative aspect-square w-full overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, #d9c7a4 0%, #b89772 50%, #6b4a2a 100%)",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)",
              }}
            >
              <div className="absolute inset-6 border border-[color:var(--marrone)]/20" />
              <p className="absolute bottom-4 right-4 font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/60">
                Tavola apparecchiata · l'antipasto arriva
              </p>
            </div>
          </div>
          <div className="md:order-1 md:col-span-6">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--crema)]/40">
              I — L'Antipasto
            </p>
            <h3
              className="mt-6 font-display leading-[0.95] text-[color:var(--crema)]"
              style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}
            >
              Quello che <em className="italic text-[color:var(--oro)]">non finisce mai</em>.
            </h3>
            <ul className="mt-10 space-y-3">
              {ANTIPASTO.map((p) => (
                <li
                  key={p}
                  data-row
                  className="font-body text-[15px] leading-relaxed text-[color:var(--crema)]/70 md:text-base"
                  style={{ opacity: reduced ? 1 : 0 }}
                >
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-md font-body text-sm text-[color:var(--crema)]/45">
              Tutto di nostra produzione. Salumi, formaggi, ortaggi e grano — tutto nasce qui.
            </p>
            <FloatingQuote
              text="L'antipasto non finisce mai."
              source="Tripadvisor"
              align="right"
            />
          </div>
        </div>
      </Atto>

      {/* ═══ ATTO 2 · I PRIMI ═══ */}
      <Atto id="2" bg="var(--marrone)" heightVh={100}>
        <RomanGhost n="II" />
        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 py-24 md:grid-cols-12 md:px-10">
          <div className="md:col-span-5">
            <div
              data-img
              className="relative aspect-[4/5] w-full overflow-hidden"
              style={{
                background:
                  "radial-gradient(ellipse at 45% 55%, #6b4a2a 0%, #3d2a1e 60%, #1a1210 100%)",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-2/3"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 100%, color-mix(in oklab, var(--crema) 22%, transparent) 0%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
              <p className="absolute bottom-4 left-4 font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--crema)]/60">
                Pignatiello · sugo lento
              </p>
            </div>
          </div>
          <div className="md:col-span-7">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--crema)]/40">
              II — I Primi
            </p>
            <h3
              data-title
              className="mt-6 font-display leading-[0.95] text-[color:var(--crema)]"
              style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}
            >
              Il <em className="italic text-[color:var(--oro)]">sugo</em> lento.
            </h3>
            <ul className="mt-10 space-y-3">
              {PRIMI.map((p) => (
                <li
                  key={p}
                  data-row
                  className="font-body text-[15px] leading-relaxed text-[color:var(--crema)]/70 md:text-base"
                  style={{ opacity: reduced ? 1 : 0 }}
                >
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-md font-body text-sm text-[color:var(--crema)]/45">
              Il sugo che cuoce lento, dietro la brace, come si è sempre fatto.
            </p>
          </div>
        </div>
      </Atto>

      {/* ═══ ATTO 3 · L'ARROSTO ═══ */}
      <Atto id="3" bg="var(--carbone)" heightVh={150}>
        <RomanGhost n="III" />
        <div
          data-wash
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            opacity: reduced ? 1 : 0,
            background:
              "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--marrone) 70%, transparent) 40%, color-mix(in oklab, var(--crema) 20%, transparent) 100%)",
          }}
        />
        <div className="relative z-10 mx-auto flex min-h-[150vh] w-full max-w-7xl flex-col justify-center gap-14 px-6 py-24 md:px-10">
          <div className="grid grid-cols-1 items-center gap-14 md:grid-cols-12">
            <div className="md:col-span-6">
              <p className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--crema)]/40">
                III — L'Arrosto
              </p>
              <h3
                className="mt-6 font-display leading-[0.95] text-[color:var(--crema)]"
                style={{ fontSize: "clamp(2.4rem,6.5vw,5.5rem)" }}
              >
                La carne che hai <em className="italic text-[color:var(--oro)]">scelto</em>.
              </h3>
              <ul className="mt-10 space-y-3">
                {ARROSTO.map((p) => (
                  <li
                    key={p}
                    data-row
                    className="font-body text-[15px] leading-relaxed text-[color:var(--crema)]/75 md:text-base"
                    style={{ opacity: reduced ? 1 : 0 }}
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <p className="mt-10 max-w-lg font-display text-lg italic text-[color:var(--crema)]/85 md:text-2xl">
                La scegli al banco. Ti siedi. Te la portano cotta alla brace a carboni.
              </p>
              <FloatingQuote
                text="La carne è tenerissima e molto saporita, soprattutto la salsiccia e le bombette."
                source="Tripadvisor"
                align="left"
              />
            </div>

            <div className="relative md:col-span-6">
              <div
                className="relative aspect-[4/5] w-full overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, #2a1c14 0%, #6b4a2a 55%, #a67c52 100%)",
                  boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)",
                }}
              >
                <p className="absolute bottom-4 left-4 z-10 font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--crema)]/70">
                  Banco macelleria · marmo e lame
                </p>

                <div
                  data-grill
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    opacity: 0,
                    background:
                      "linear-gradient(180deg, color-mix(in oklab, var(--terracotta) 55%, #1a1210) 0%, #1a1210 100%)",
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(0,0,0,0.35) 0 2px, transparent 2px 40px)",
                  }}
                />

                <div
                  data-plate
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    opacity: reduced ? 1 : 0,
                    background:
                      "radial-gradient(ellipse at 50% 55%, #d9c7a4 0%, #8a6a4a 55%, #2a1c14 100%)",
                  }}
                >
                  <p className="absolute bottom-4 right-4 font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--marrone)]">
                    Il piatto · servito
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Atto>

      {/* ═══ ATTO 4 · I DOLCI ═══ */}
      <Atto id="4" bg="var(--marrone)" heightVh={100}>
        <RomanGhost n="IV" />
        <div
          data-fade
          className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 py-24 md:grid-cols-12 md:px-10"
          style={{ opacity: reduced ? 1 : 0 }}
        >
          <div className="md:col-span-6">
            <p className="font-eyebrow text-[11px] uppercase tracking-[0.3em] text-[color:var(--crema)]/40">
              IV — I Dolci
            </p>
            <h3
              className="mt-6 font-display leading-[0.95] text-[color:var(--crema)]"
              style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}
            >
              Fatti in <em className="italic text-[color:var(--oro)]">casa</em>.
            </h3>
            <ul className="mt-10 space-y-3">
              {DOLCI.map((p) => (
                <li
                  key={p}
                  className="font-body text-[15px] leading-relaxed text-[color:var(--crema)]/75 md:text-base"
                >
                  {p}
                </li>
              ))}
            </ul>
            <FloatingQuote
              text="Dolcetti fatti in casa e antipasti abbondanti."
              source="Restaurant Guru"
              align="left"
            />
          </div>
          <div className="md:col-span-6">
            <div
              className="relative aspect-square w-full overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, #f2e8d5 0%, #d9c7a4 50%, #8a6a4a 100%)",
                boxShadow: "0 20px 60px -20px rgba(0,0,0,0.4)",
              }}
            >
              <p className="absolute bottom-4 right-4 font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--marrone)]/70">
                Dolcini della casa
              </p>
            </div>
          </div>
        </div>
      </Atto>

      {/* ═══ CHIUSURA ═══ */}
      <div
        className="relative border-t border-[color:var(--crema)]/10"
        style={{ backgroundColor: "var(--marrone)" }}
      >
        <div className="mx-auto w-full max-w-4xl px-6 py-24 text-center md:px-10">
          <p className="font-display text-xl italic text-[color:var(--crema)]/70 md:text-2xl">
            La carta cambia con le stagioni e con la materia disponibile.
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer noopener"
            className="tavola-cta mt-10 inline-block font-eyebrow text-[13px] uppercase tracking-[0.3em] text-[color:var(--crema)] md:text-[15px]"
          >
            Prenota un tavolo <span aria-hidden>→</span>
            <span className="tavola-cta-line" aria-hidden />
          </a>
          <p className="mt-6 font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--crema)]/40">
            Mer–Sab cena · Domenica e festivi pranzo
          </p>
        </div>
      </div>

      <style>{`
        .tavola-cta { position: relative; padding-bottom: 6px; }
        .tavola-cta-line {
          position: absolute; left: 0; bottom: 0; height: 1px; width: 0;
          background: var(--oro); transition: width .5s cubic-bezier(.16,1,.3,1);
        }
        .tavola-cta:hover .tavola-cta-line,
        .tavola-cta:focus-visible .tavola-cta-line { width: 100%; }
        @media (prefers-reduced-motion: reduce) { .tavola-cta-line { width: 100%; } }
      `}</style>
    </section>
  );
}

/* ── helpers ─────────────────────────────────────────────── */

function Atto({
  id,
  bg,
  heightVh,
  children,
}: {
  id: string;
  bg: string;
  heightVh: number;
  children: React.ReactNode;
}) {
  return (
    <div
      data-atto={id}
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: bg, minHeight: `${heightVh}vh` }}
    >
      {children}
    </div>
  );
}

function RomanGhost({ n }: { n: string }) {
  return (
    <span
      aria-hidden
      data-ghost
      className="pointer-events-none absolute -right-4 top-1/2 z-0 -translate-y-1/2 select-none font-display leading-none"
      style={{
        fontSize: "clamp(10rem, 32vw, 28rem)",
        color: "color-mix(in oklab, var(--crema) 8%, transparent)",
        letterSpacing: "-0.05em",
      }}
    >
      {n}
    </span>
  );
}

function FloatingQuote({
  text,
  source,
  align,
}: {
  text: string;
  source: string;
  align: "left" | "right";
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 60, damping: 18 }}
      className={`mt-10 max-w-sm ${align === "right" ? "md:ml-auto md:text-right" : ""}`}
    >
      <blockquote className="font-display text-base italic leading-relaxed text-[color:var(--crema)]/85 md:text-lg">
        «{text}»
      </blockquote>
      <figcaption className="mt-2 font-eyebrow text-[10px] uppercase tracking-[0.3em] text-[color:var(--oro)]/70">
        — {source}
      </figcaption>
    </motion.figure>
  );
}
