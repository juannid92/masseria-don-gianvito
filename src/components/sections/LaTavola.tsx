import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import sigilloImg from "@/assets/tavola-sigillo.jpg";
import fuocoImg from "@/assets/tavola-fuoco.jpg";
import attesaImg from "@/assets/tavola-attesa.jpg";
import rotturaImg from "@/assets/tavola-rottura.jpg";

/* ──────────────────────────────────────────────────────────────
 * LA TAVOLA — "Il film della Pignata"
 * 4 atti full-viewport (Sigillo → Fuoco → Attesa → Rottura),
 * ognuno con reveal diverso. Counter 00:00→05:00 su scrub.
 * Non è un menu: è il rito che ferma gli orologi.
 * ───────────────────────────────────────────────────────────── */

const MENU_LINE =
  "Salumi e formaggi propri · Frittelle del nostro grano · Zucchine marinate · Polpettine al sugo · Spezzatino di vitello e maiale · Bombette · Salsiccia · Filetto frollato 15 giorni · Dolcini artigianali";

export function LaTavola() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ── INTRO ───────────────────────────────────────────────
      const intro = root.querySelector<HTMLElement>("[data-intro]");
      if (intro) {
        gsap.set(intro.querySelectorAll("[data-in]"), { autoAlpha: 0, y: 24 });
        ScrollTrigger.create({
          trigger: intro,
          start: "top 80%",
          once: true,
          onEnter: () =>
            gsap.to(intro.querySelectorAll("[data-in]"), {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "cubic-bezier(.16,1,.3,1)",
              stagger: 0.08,
            }),
        });
      }

      // ── ATTO 1 · SIGILLO (center clip + typewriter) ─────────
      const a1 = root.querySelector<HTMLElement>("[data-atto='1']");
      if (a1) {
        const photo = a1.querySelector<HTMLElement>("[data-photo]");
        const typer = a1.querySelector<HTMLElement>("[data-typer]");
        const marg = a1.querySelectorAll<HTMLElement>("[data-marg]");
        const fullText = typer?.dataset.text ?? "";
        if (photo) gsap.set(photo, { clipPath: "circle(0% at 50% 50%)" });
        if (typer) typer.textContent = "";
        gsap.set(marg, { autoAlpha: 0, y: 16 });

        ScrollTrigger.create({
          trigger: a1,
          start: "top 65%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "cubic-bezier(.16,1,.3,1)" } });
            if (photo) tl.to(photo, { clipPath: "circle(75% at 50% 50%)", duration: 1.6 }, 0);
            tl.to(marg, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.5);
            if (typer && fullText) {
              tl.to({ i: 0 }, {
                i: fullText.length,
                duration: fullText.length * 0.03,
                ease: "none",
                onUpdate: function () {
                  const v = Math.floor(this.targets()[0].i);
                  typer.textContent = fullText.slice(0, v);
                },
              }, 0.8);
            }
          },
        });

        if (photo) {
          gsap.to(photo, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: a1, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      }

      // ── ATTO 2 · FUOCO (warm-wash + counter 00:00→05:00) ────
      const a2 = root.querySelector<HTMLElement>("[data-atto='2']");
      if (a2) {
        const photo = a2.querySelector<HTMLElement>("[data-photo]");
        const wash = a2.querySelector<HTMLElement>("[data-wash]");
        const counter = a2.querySelector<HTMLElement>("[data-counter]");
        const copy = a2.querySelectorAll<HTMLElement>("[data-copy]");

        if (photo) gsap.set(photo, { autoAlpha: 0, yPercent: 20 });
        gsap.set(copy, { autoAlpha: 0, y: 24 });
        if (wash) gsap.set(wash, { autoAlpha: 0, yPercent: 100 });

        ScrollTrigger.create({
          trigger: a2,
          start: "top 70%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "cubic-bezier(.16,1,.3,1)" } });
            if (photo) tl.to(photo, { autoAlpha: 1, yPercent: 0, duration: 1.4 }, 0);
            if (wash) {
              tl.to(wash, { autoAlpha: 0.45, yPercent: 0, duration: 0.9, ease: "sine.out" }, 0);
              tl.to(wash, { autoAlpha: 0, duration: 1.4, ease: "sine.in" }, 0.9);
            }
            tl.to(copy, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.4);
          },
        });

        // Counter su scrub
        if (counter) {
          const state = { t: 0 };
          gsap.to(state, {
            t: 300, // 5 ore in minuti
            ease: "none",
            scrollTrigger: { trigger: a2, start: "top 70%", end: "bottom 30%", scrub: true },
            onUpdate: () => {
              const mins = Math.floor(state.t);
              const h = Math.floor(mins / 60);
              const m = mins % 60;
              counter.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
            },
          });
        }

        if (photo) {
          gsap.to(photo, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: a2, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      }

      // ── ATTO 3 · ATTESA (letter-spacing collapse) ───────────
      const a3 = root.querySelector<HTMLElement>("[data-atto='3']");
      if (a3) {
        const photo = a3.querySelector<HTMLElement>("[data-photo]");
        const title = a3.querySelector<HTMLElement>("[data-lstitle]");
        const marg = a3.querySelectorAll<HTMLElement>("[data-marg]");

        if (photo) gsap.set(photo, { autoAlpha: 0, scale: 1.05 });
        if (title) gsap.set(title, { autoAlpha: 0, letterSpacing: "0.5em" });
        gsap.set(marg, { autoAlpha: 0, y: 16 });

        ScrollTrigger.create({
          trigger: a3,
          start: "top 70%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "cubic-bezier(.16,1,.3,1)" } });
            if (photo) tl.to(photo, { autoAlpha: 1, scale: 1, duration: 1.8 }, 0);
            if (title) tl.to(title, { autoAlpha: 1, letterSpacing: "0em", duration: 1.8 }, 0.2);
            tl.to(marg, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.6);
          },
        });

        if (photo) {
          gsap.to(photo, {
            yPercent: -3,
            ease: "none",
            scrollTrigger: { trigger: a3, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      }

      // ── ATTO 4 · ROTTURA (split + lampo vapore) ─────────────
      const a4 = root.querySelector<HTMLElement>("[data-atto='4']");
      if (a4) {
        const leftHalf = a4.querySelector<HTMLElement>("[data-half='l']");
        const rightHalf = a4.querySelector<HTMLElement>("[data-half='r']");
        const flash = a4.querySelector<HTMLElement>("[data-flash]");
        const copy = a4.querySelectorAll<HTMLElement>("[data-copy]");

        if (leftHalf) gsap.set(leftHalf, { xPercent: 0, clipPath: "inset(0 50% 0 0)" });
        if (rightHalf) gsap.set(rightHalf, { xPercent: 0, clipPath: "inset(0 0 0 50%)" });
        gsap.set(copy, { autoAlpha: 0, y: 24 });
        if (flash) gsap.set(flash, { autoAlpha: 0, scale: 0.6 });

        ScrollTrigger.create({
          trigger: a4,
          start: "top 65%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "cubic-bezier(.16,1,.3,1)" } });
            if (leftHalf) tl.to(leftHalf, { xPercent: -6, duration: 1.4 }, 0);
            if (rightHalf) tl.to(rightHalf, { xPercent: 6, duration: 1.4 }, 0);
            if (flash) {
              tl.to(flash, { autoAlpha: 0.8, scale: 1.1, duration: 0.35, ease: "sine.out" }, 0.25);
              tl.to(flash, { autoAlpha: 0, duration: 1.2, ease: "sine.in" }, 0.6);
            }
            tl.to(copy, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.7);
          },
        });
      }

      // Fallback: forza visibilità dopo 3s
      const safety = window.setTimeout(() => {
        root.querySelectorAll<HTMLElement>("[data-photo], [data-copy], [data-marg], [data-lstitle]").forEach((el) => {
          if (parseFloat(getComputedStyle(el).opacity) < 0.05) {
            gsap.set(el, { autoAlpha: 1, y: 0, scale: 1, clipPath: "none", letterSpacing: "normal" });
          }
        });
      }, 3000);

      return () => window.clearTimeout(safety);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="La Tavola — il film della Pignata"
      className="relative isolate overflow-hidden bg-[color:var(--carbone)]"
    >
      {/* Marcatore fisso in alto */}
      <div className="relative mx-auto max-w-6xl px-6 pt-24 md:px-10 md:pt-32">
        <p className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--crema)]/40">
          05 — La Tavola
        </p>
      </div>

      {/* INTRO */}
      <div data-intro className="mx-auto max-w-6xl px-6 pt-8 md:px-10 md:pt-12">
        <h2
          data-in
          className="font-display text-4xl leading-[1.05] text-[color:var(--crema)] md:text-6xl lg:text-7xl"
        >
          Cinque ore di{" "}
          <em className="italic text-[color:var(--terracotta)]">fuoco</em>.
        </h2>
        <p data-in className="mt-6 max-w-2xl text-base text-[color:var(--crema)]/60 md:text-lg">
          Il rito della Pignata. E tutto il resto, dalla terra alla tavola.
        </p>
        <div data-in className="mt-10 h-px w-24 bg-[color:var(--oro)]/40" />
      </div>

      {/* ATTO 1 · IL SIGILLO */}
      <Atto n="01" label="Il Sigillo" data-atto="1">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-6">
            <div
              data-photo
              className="relative overflow-hidden rounded-sm shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
              style={{ aspectRatio: "4/5" }}
            >
              <img
                src={sigilloImg}
                alt="Le mani chiudono la pignata con la pasta del pane"
                width={1024}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="md:col-span-6">
            <p data-marg className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--oro)]/80">
              01 · Il Sigillo
            </p>
            <p
              data-typer
              data-text="Si chiude con la pasta del pane."
              className="mt-4 font-display text-3xl leading-[1.15] text-[color:var(--crema)] md:text-5xl min-h-[2em]"
            >
              Si chiude con la pasta del pane.
            </p>
            <p data-marg className="mt-6 max-w-md text-sm text-[color:var(--crema)]/60 md:text-base">
              La pignata si sigilla. Dentro: pecora, ortaggi, spezie di stagione. Fuori: il tempo.
            </p>
          </div>
        </div>
      </Atto>

      {/* ATTO 2 · IL FUOCO */}
      <Atto n="02" label="Il Fuoco" data-atto="2">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5">
            <p data-copy className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--oro)]/80">
              02 · Il Fuoco
            </p>
            <h3
              data-copy
              className="mt-4 font-display text-3xl leading-[1.1] text-[color:var(--crema)] md:text-5xl"
            >
              Nel forno a legna. Per{" "}
              <em className="italic text-[color:var(--terracotta)]">cinque ore</em>.
            </h3>
            <div data-copy className="mt-10 flex items-baseline gap-4">
              <span
                data-counter
                className="font-eyebrow text-4xl tabular-nums text-[color:var(--terracotta)] md:text-6xl"
              >
                00:00
              </span>
              <span className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--crema)]/40">
                → 05:00
              </span>
            </div>
          </div>
          <div className="relative md:col-span-7">
            <div
              data-photo
              className="relative overflow-hidden rounded-sm shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
              style={{ aspectRatio: "5/4" }}
            >
              <img
                src={fuocoImg}
                alt="Forno a legna acceso"
                width={1024}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div
                data-wash
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(179,58,26,0.85), rgba(110,26,20,0.4) 60%, transparent)",
                }}
              />
            </div>
          </div>
        </div>
      </Atto>

      {/* ATTO 3 · L'ATTESA */}
      <Atto n="03" label="L'Attesa" data-atto="3">
        <div className="relative">
          <div
            data-photo
            className="relative overflow-hidden rounded-sm shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
            style={{ aspectRatio: "16/7" }}
          >
            <img
              src={attesaImg}
              alt="Le braci quiete nel forno"
              width={1024}
              height={1024}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 60%, transparent 30%, rgba(26,18,16,0.6) 90%)",
              }}
            />
          </div>
          <div className="mt-12 text-center">
            <p data-marg className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--oro)]/80">
              03 · L'Attesa
            </p>
            <h3
              data-lstitle
              className="mt-4 font-display text-4xl leading-[1.05] text-[color:var(--crema)] md:text-6xl"
            >
              Gli orologi si <em className="italic text-[color:var(--oro)]">fermano</em>.
            </h3>
            <p data-marg className="mt-8">
              <FloatingReview
                text="Gli orologi si fermano quando la trasportano dal forno alla cucina."
                src="Luciano Pignataro Wine Blog"
              />
            </p>
          </div>
        </div>
      </Atto>

      {/* ATTO 4 · LA ROTTURA */}
      <Atto n="04" label="La Tavola" data-atto="4">
        <div className="grid gap-10 md:grid-cols-12 md:items-center">
          <div className="relative md:col-span-6">
            <div
              className="relative overflow-hidden rounded-sm shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
              style={{ aspectRatio: "4/5" }}
            >
              <div
                data-half="l"
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${rotturaImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                data-half="r"
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${rotturaImg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                data-flash
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(242,232,213,0.85), rgba(242,232,213,0.2) 50%, transparent 75%)",
                  mixBlendMode: "screen",
                  filter: "blur(6px)",
                }}
              />
            </div>
          </div>
          <div className="md:col-span-6">
            <p data-copy className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--oro)]/80">
              04 · La Tavola
            </p>
            <h3
              data-copy
              className="mt-4 font-display text-3xl leading-[1.1] text-[color:var(--crema)] md:text-5xl"
            >
              E il tempo <em className="italic text-[color:var(--oro)]">ritorna</em>.
            </h3>
            <p data-copy className="mt-6 max-w-md text-sm text-[color:var(--crema)]/70 md:text-base">
              Filetto alla brace al sangue. Bombette. Salsiccia. Salumi e formaggi propri. Frittelle del nostro grano. Dolcini fatti in casa.
            </p>
            <p data-copy className="mt-4 text-xs italic text-[color:var(--crema)]/45">
              La carta cambia con le stagioni.
            </p>
          </div>
        </div>
      </Atto>

      {/* Menu line + chiusura */}
      <div className="relative mx-auto max-w-6xl px-6 pt-8 pb-24 md:px-10 md:pb-32">
        <div className="border-y border-[color:var(--crema)]/10 py-6 text-center">
          <p className="text-xs leading-relaxed text-[color:var(--crema)]/50 md:text-sm">
            {MENU_LINE}
          </p>
        </div>

        <div className="mt-16 text-center">
          <FloatingReview
            text="Le mozzarelle km0 sono sublimi."
            src="Tripadvisor"
          />
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/braceria"
              className="group inline-flex items-center gap-3 rounded-sm bg-grad-brace px-8 py-4 font-eyebrow text-xs tracking-[0.2em] text-[color:var(--crema)] shadow-[0_10px_40px_-10px_rgba(179,58,26,0.6)] transition-transform hover:-translate-y-0.5"
            >
              Prenota un tavolo
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <p className="mt-6 font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--crema)]/45">
            Mer–Sab cena · Domenica e festivi pranzo
          </p>
        </div>
      </div>
    </section>
  );
}

function Atto({
  children,
  n,
  label,
  ...rest
}: {
  children: React.ReactNode;
  n: string;
  label: string;
  [k: string]: unknown;
}) {
  return (
    <section
      {...rest}
      aria-label={`Atto ${n} · ${label}`}
      className="relative mx-auto flex min-h-[85vh] max-w-6xl items-center px-6 py-24 md:min-h-screen md:px-10 md:py-32"
    >
      <div className="w-full">{children}</div>
    </section>
  );
}

function FloatingReview({ text, src }: { text: string; src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [24, -24]), {
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  });

  return (
    <motion.figure ref={ref} style={{ y }} className="mx-auto max-w-2xl px-2 text-center">
      <blockquote className="font-display text-xl italic leading-snug text-[color:var(--crema)]/75 md:text-2xl">
        <span className="text-[color:var(--oro)]">“</span>
        {text}
        <span className="text-[color:var(--oro)]">”</span>
      </blockquote>
      <figcaption className="mt-3 font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--crema)]/40">
        — {src}
      </figcaption>
    </motion.figure>
  );
}
