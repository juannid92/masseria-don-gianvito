import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import antipastoImg from "@/assets/tavola-antipasto.jpg";
import primiImg from "@/assets/tavola-primi.jpg";
import braceImg from "@/assets/tavola-brace.jpg";
import dolciImg from "@/assets/tavola-dolci.jpg";

/* ──────────────────────────────────────────────────────────────
 * LA TAVOLA — Sequenza cena (antipasto → primi → brace → dolci).
 * Portate rivelate una alla volta con reveal diverso; la brace
 * è il momento clou (alone + scintille + più grande). Recensioni
 * reali fluttuano tra le portate. Nessuna griglia di prezzi.
 * ───────────────────────────────────────────────────────────── */

type Reveal = "slide-right" | "slide-left" | "brace-emerge" | "fade-soft";

type Course = {
  roman: string;
  cat: string;
  title: string;
  titleAccent?: string; // parola in italic --oro
  sense: string;
  items: string[];
  img: string;
  side: "left" | "right"; // lato della foto
  reveal: Reveal;
  vapor?: boolean;
};

const COURSES: Course[] = [
  {
    roman: "I",
    cat: "I · Antipasto",
    title: "Quello che ",
    titleAccent: "non finisce",
    sense: "Il primo assaggio della masseria: salumi, formaggi, frittelle da aprire con la ricotta piccante.",
    items: [
      "Prosciutto crudo, sopressata, salsiccia secca",
      "Pancetta tesa, nodini, primo sale",
      "Frittelle di grano tenero con ricotta piccante e pomodorini",
      "Zucchine marinate a sfoglie lunghe",
    ],
    img: antipastoImg,
    side: "right",
    reveal: "slide-right",
    vapor: true,
  },
  {
    roman: "II",
    cat: "II · Primi",
    title: "Il ",
    titleAccent: "pignatiello",
    sense: "Terracotta calda al centro del tavolo. Il sugo lento della domenica in famiglia.",
    items: [
      "Polpettine al sugo, cotte nel pignatiello",
      "Spezzatino di vitello e maiale",
    ],
    img: primiImg,
    side: "left",
    reveal: "slide-left",
  },
  {
    roman: "III",
    cat: "III · La brace",
    title: "Il cuore, ",
    titleAccent: "sulla brace",
    sense: "Cinque ore nel forno a legna per la pecora. Pochi minuti sulla brace per il filetto. Il tempo giusto per ogni fuoco.",
    items: [
      "Pecora in pignata · 5 ore, sigillata con pasta di pane",
      "Filetto di vitello (Pezzata Rossa × Frisona) · frollatura ~15 gg",
      "Bombette e salsiccia di nostra produzione",
      "Tagli scelti al banco, cotti a carboni",
    ],
    img: braceImg,
    side: "right",
    reveal: "brace-emerge",
    vapor: true,
  },
  {
    roman: "IV",
    cat: "IV · Dolci",
    title: "I ",
    titleAccent: "dolcini",
    sense: "Chiusura leggera, fatti in casa. Un ultimo gesto prima del caffè.",
    items: ["Dolcini artigianali della masseria"],
    img: dolciImg,
    side: "left",
    reveal: "fade-soft",
  },
];

const REVIEWS = [
  { after: 0, text: "L'antipasto non finisce mai.", src: "Tripadvisor" },
  { after: 2, text: "Le mozzarelle km0 sono sublimi.", src: "Tripadvisor" },
];

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

      // Intro
      const intro = root.querySelector<HTMLElement>("[data-tavola-intro]");
      if (intro) {
        gsap.set(intro.querySelectorAll("[data-in]"), { autoAlpha: 0, y: 24 });
        ScrollTrigger.create({
          trigger: intro,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(intro.querySelectorAll("[data-in]"), {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "cubic-bezier(.16,1,.3,1)",
              stagger: 0.08,
            });
          },
        });
      }

      // Reveal portate
      root.querySelectorAll<HTMLElement>("[data-course]").forEach((el) => {
        const reveal = (el.dataset.reveal as Reveal) ?? "fade-soft";
        const photo = el.querySelector<HTMLElement>("[data-photo]");
        const copy = el.querySelectorAll<HTMLElement>("[data-copy]");
        const roman = el.querySelector<HTMLElement>("[data-roman]");
        const vapor = el.querySelector<HTMLElement>("[data-vapor]");
        const glow = el.querySelector<HTMLElement>("[data-glow]");

        // stato iniziale
        if (photo) {
          if (reveal === "slide-right") gsap.set(photo, { autoAlpha: 0, x: 80 });
          else if (reveal === "slide-left") gsap.set(photo, { autoAlpha: 0, x: -80 });
          else if (reveal === "brace-emerge") gsap.set(photo, { autoAlpha: 0, scale: 0.94, filter: "brightness(0.4)" });
          else gsap.set(photo, { autoAlpha: 0, scale: 0.95 });
        }
        gsap.set(copy, { autoAlpha: 0, y: 24 });
        if (vapor) gsap.set(vapor, { autoAlpha: 0.7 });
        if (glow) gsap.set(glow, { autoAlpha: 0, scale: 0.6 });

        ScrollTrigger.create({
          trigger: el,
          start: "top 75%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "cubic-bezier(.16,1,.3,1)" } });
            if (photo) {
              if (reveal === "brace-emerge") {
                tl.to(photo, { autoAlpha: 1, scale: 1, filter: "brightness(1)", duration: 1.4 }, 0);
                if (glow) tl.to(glow, { autoAlpha: 1, scale: 1, duration: 1.2 }, 0.1);
              } else if (reveal === "fade-soft") {
                tl.to(photo, { autoAlpha: 1, scale: 1, duration: 1.2 }, 0);
              } else {
                tl.to(photo, { autoAlpha: 1, x: 0, duration: 1.1 }, 0);
              }
            }
            tl.to(copy, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.15);
            if (vapor) tl.to(vapor, { autoAlpha: 0, duration: 2, ease: "power2.out" }, 0.2);
          },
        });

        // Parallasse foto & numero romano
        if (photo) {
          gsap.to(photo, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
        if (roman) {
          gsap.to(roman, {
            yPercent: -14,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
        }
      });

      // Brace: glow pulsante + scintille canvas
      const braceEl = root.querySelector<HTMLElement>("[data-course='2']");
      const braceGlow = braceEl?.querySelector<HTMLElement>("[data-glow]");
      if (braceGlow) {
        gsap.to(braceGlow, {
          opacity: 0.65,
          scale: 1.05,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Fallback safety: rendi visibili portate rimaste nascoste dopo 3s
      const safety = window.setTimeout(() => {
        root.querySelectorAll<HTMLElement>("[data-course]").forEach((el) => {
          const photo = el.querySelector<HTMLElement>("[data-photo]");
          const copy = el.querySelectorAll<HTMLElement>("[data-copy]");
          if (photo && parseFloat(getComputedStyle(photo).opacity) < 0.05) {
            gsap.set(photo, { autoAlpha: 1, x: 0, scale: 1, filter: "none" });
          }
          copy.forEach((c) => {
            if (parseFloat(getComputedStyle(c).opacity) < 0.05) gsap.set(c, { autoAlpha: 1, y: 0 });
          });
        });
      }, 3000);

      mm.add("(min-width: 768px)", () => {});
      mm.add("(max-width: 767px)", () => {});

      return () => window.clearTimeout(safety);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  // Scintille canvas sulla brace
  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    const canvas = root.querySelector<HTMLCanvasElement>("[data-sparks]");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type P = { x: number; y: number; vy: number; vx: number; life: number; max: number; r: number };
    const parts: P[] = [];
    const spawn = () => {
      if (parts.length > 8) return;
      const w = canvas.width;
      const h = canvas.height;
      parts.push({
        x: w * (0.3 + Math.random() * 0.4),
        y: h * 0.85,
        vy: -0.4 - Math.random() * 0.6,
        vx: (Math.random() - 0.5) * 0.2,
        life: 0,
        max: 90 + Math.random() * 60,
        r: (1 + Math.random() * 1.5) * dpr,
      });
    };

    let visible = false;
    const io = new IntersectionObserver(
      (entries) => (visible = entries[0]?.isIntersecting ?? false),
      { threshold: 0.15 },
    );
    io.observe(canvas);

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (visible && Math.random() < 0.25) spawn();
      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life++;
        p.x += p.vx * dpr;
        p.y += p.vy * dpr;
        const a = 1 - p.life / p.max;
        if (a <= 0) {
          parts.splice(i, 1);
          continue;
        }
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grd.addColorStop(0, `rgba(255,180,90,${0.9 * a})`);
        grd.addColorStop(1, "rgba(179,58,26,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="La Tavola — la cena a Masseria Don Gianvito"
      className="relative isolate overflow-hidden bg-[color:var(--carbone)] py-24 md:py-32"
    >
      {/* Intro */}
      <div data-tavola-intro className="mx-auto max-w-6xl px-6 md:px-10">
        <p data-in className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--crema)]/40">
          05 — La Tavola
        </p>
        <h2
          data-in
          className="mt-4 font-display text-4xl leading-[1.05] text-[color:var(--crema)] md:text-6xl lg:text-7xl"
        >
          La <em className="not-italic italic text-[color:var(--oro)]">terra</em> in tavola.
        </h2>
        <p data-in className="mt-6 max-w-2xl text-base text-[color:var(--crema)]/60 md:text-lg">
          Tutto di nostra produzione. Dall'antipasto alla brace, ogni portata nasce qui.
        </p>
        <div data-in className="mt-10 h-px w-24 bg-[color:var(--oro)]/40" />
      </div>

      {/* Portate */}
      <div className="relative mx-auto mt-16 max-w-6xl px-6 md:mt-24 md:px-10">
        {COURSES.map((c, i) => {
          const isBrace = c.reveal === "brace-emerge";
          const rightPhoto = c.side === "right";
          return (
            <div key={c.roman}>
              <article
                data-course={i}
                data-reveal={c.reveal}
                className={`relative grid gap-8 py-16 md:py-28 md:gap-10 ${
                  isBrace ? "md:py-36" : ""
                } md:grid-cols-12 md:items-center`}
              >
                {/* Numero romano ghost */}
                <div
                  data-roman
                  aria-hidden
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 select-none font-display leading-none text-[color:var(--crema)]/[0.06] ${
                    rightPhoto ? "left-0 md:left-[-2%]" : "right-0 md:right-[-2%]"
                  } text-[22vw] md:text-[16vw]`}
                >
                  {c.roman}
                </div>

                {/* Foto */}
                <div
                  className={`relative z-10 ${
                    rightPhoto
                      ? "md:col-span-7 md:col-start-6"
                      : "md:col-span-7 md:col-start-1 md:row-start-1"
                  }`}
                >
                  <div
                    data-photo
                    className={`relative overflow-hidden rounded-sm shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] ${
                      isBrace ? "aspect-[4/3] md:aspect-[5/4]" : "aspect-[4/3]"
                    }`}
                  >
                    <img
                      src={c.img}
                      alt={c.title + (c.titleAccent ?? "")}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    {/* Vapore leggero (solo I e III) */}
                    {c.vapor && (
                      <div
                        data-vapor
                        aria-hidden
                        className="pointer-events-none absolute inset-0 mix-blend-screen"
                        style={{
                          background:
                            "radial-gradient(60% 40% at 50% 30%, rgba(242,232,213,0.35), transparent 70%)",
                        }}
                      />
                    )}
                    {/* Alone brace */}
                    {isBrace && (
                      <>
                        <div
                          data-glow
                          aria-hidden
                          className="pointer-events-none absolute -inset-[10%] rounded-full"
                          style={{
                            background:
                              "radial-gradient(closest-side, rgba(179,58,26,0.55), rgba(110,26,20,0.2) 55%, transparent 75%)",
                            filter: "blur(24px)",
                          }}
                        />
                        <canvas
                          data-sparks
                          aria-hidden
                          className="pointer-events-none absolute inset-0 h-full w-full"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Copy */}
                <div
                  className={`relative z-10 ${
                    rightPhoto
                      ? "md:col-span-5 md:col-start-1 md:row-start-1"
                      : "md:col-span-5 md:col-start-8"
                  }`}
                >
                  <p
                    data-copy
                    className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--oro)]/80"
                  >
                    {c.cat}
                  </p>
                  <h3
                    data-copy
                    className={`mt-3 font-display leading-[1.05] text-[color:var(--crema)] ${
                      isBrace ? "text-4xl md:text-6xl" : "text-3xl md:text-5xl"
                    }`}
                  >
                    {c.title}
                    {c.titleAccent && (
                      <em className="italic text-[color:var(--oro)]">{c.titleAccent}</em>
                    )}
                    .
                  </h3>
                  <p
                    data-copy
                    className="mt-4 text-sm italic text-[color:var(--crema)]/55 md:text-base"
                  >
                    {c.sense}
                  </p>
                  <ul data-copy className="mt-6 space-y-2 text-sm text-[color:var(--crema)]/75 md:text-[15px]">
                    {c.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span className="mt-2 h-px w-4 flex-none bg-[color:var(--oro)]/50" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              {/* Recensione fluttuante */}
              {REVIEWS.filter((r) => r.after === i).map((r) => (
                <FloatingReview key={r.text} text={r.text} src={r.src} />
              ))}
            </div>
          );
        })}
      </div>

      {/* Chiusura */}
      <div className="relative mx-auto mt-16 max-w-6xl px-6 text-center md:mt-24 md:px-10">
        <div className="mx-auto mb-10 h-px w-24 bg-[color:var(--oro)]/40" />
        <p className="font-display text-xl italic text-[color:var(--crema)]/60 md:text-2xl">
          La carta cambia con le stagioni.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/braceria"
            className="group inline-flex items-center gap-3 rounded-sm bg-grad-brace px-8 py-4 font-eyebrow text-xs tracking-[0.2em] text-[color:var(--crema)] shadow-[0_10px_40px_-10px_rgba(179,58,26,0.6)] transition-transform hover:-translate-y-0.5"
          >
            Prenota un tavolo
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/braceria"
            className="font-eyebrow text-xs tracking-[0.2em] text-[color:var(--crema)]/60 underline-offset-8 hover:text-[color:var(--crema)] hover:underline"
          >
            Vedi la carta della braceria
          </Link>
        </div>
      </div>
    </section>
  );
}

function FloatingReview({ text, src }: { text: string; src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [30, -30]), {
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  });

  return (
    <div ref={ref} className="relative py-6 md:py-10">
      <motion.figure
        style={{ y }}
        className="mx-auto max-w-2xl px-6 text-center"
      >
        <blockquote className="font-display text-xl italic leading-snug text-[color:var(--crema)]/75 md:text-3xl">
          <span className="text-[color:var(--oro)]">“</span>
          {text}
          <span className="text-[color:var(--oro)]">”</span>
        </blockquote>
        <figcaption className="mt-3 font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--crema)]/40">
          — {src}
        </figcaption>
      </motion.figure>
    </div>
  );
}
