import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * LA FILIERA — "Morph di materia"
 * Palcoscenico pinnato al centro: 8 stadi che si trasformano
 * l'uno nell'altro (Terra → Pascolo → Bestie → Latte → Formaggio
 * → Carne → Brace → Tavola). Testo laterale che cambia, barra
 * verticale di progresso, scintille solo sullo stadio brace,
 * filo d'oro che chiude il cerchio.
 * ───────────────────────────────────────────────────────────── */

type Stage = {
  n: string;
  key: string;
  label: string;
  headline: string; // parola in italic accento
  headPre: string;
  headPost: string;
  sub?: string;
  bg: string; // gradient del palcoscenico
  overlay?: string; // texture aggiuntiva (radial/svg)
  tint: string; // colore accento per la barra
};

const STAGES: Stage[] = [
  {
    n: "01",
    key: "terra",
    label: "TERRA",
    headPre: "Dalla ",
    headline: "terra",
    headPost: ".",
    sub: "Foraggio, ortaggi, grano tenero. Tutto coltivato in masseria.",
    bg: "radial-gradient(120% 90% at 50% 60%, #5a3a25 0%, #3D2A1E 45%, #1A1210 100%)",
    overlay:
      "radial-gradient(2px 2px at 20% 30%, rgba(255,220,180,.08) 0, transparent 60%), radial-gradient(3px 3px at 70% 60%, rgba(255,220,180,.06) 0, transparent 60%)",
    tint: "#B78B5A",
  },
  {
    n: "02",
    key: "pascolo",
    label: "PASCOLO",
    headPre: "Che nutre il ",
    headline: "pascolo",
    headPost: ".",
    bg: "radial-gradient(120% 90% at 50% 55%, #8a9a4c 0%, #6B7340 45%, #2a2a1a 100%)",
    overlay:
      "repeating-linear-gradient(92deg, rgba(0,0,0,.08) 0 2px, transparent 2px 6px)",
    tint: "#9DA85A",
  },
  {
    n: "03",
    key: "bestie",
    label: "BESTIE",
    headPre: "Che nutre le ",
    headline: "bestie",
    headPost: ".",
    sub: "Bovini Pezzata Rossa × Frisona. Ovini, suini, equini, avicoli. Centinaia di capi.",
    bg: "radial-gradient(120% 90% at 50% 60%, #6a6a3a 0%, #3D2A1E 60%, #1A1210 100%)",
    overlay:
      "radial-gradient(60% 22% at 30% 78%, rgba(20,10,5,.7) 0, transparent 70%), radial-gradient(50% 20% at 70% 82%, rgba(20,10,5,.7) 0, transparent 70%)",
    tint: "#C49A4A",
  },
  {
    n: "04",
    key: "latte",
    label: "LATTE",
    headPre: "Che dà il ",
    headline: "latte",
    headPost: ".",
    bg: "radial-gradient(120% 90% at 50% 50%, #f5efe0 0%, #e8dcc4 55%, #b7a888 100%)",
    overlay:
      "radial-gradient(60% 40% at 50% 40%, rgba(255,255,255,.35) 0, transparent 70%)",
    tint: "#F2E8D5",
  },
  {
    n: "05",
    key: "formaggio",
    label: "FORMAGGIO",
    headPre: "Che diventa ",
    headline: "formaggio",
    headPost: ".",
    sub: "Mozzarelle km0. Nodini. Primo sale. Ricotta.",
    bg: "radial-gradient(120% 90% at 50% 55%, #fbf6e8 0%, #efe4c8 50%, #8a7a54 100%)",
    overlay:
      "radial-gradient(circle at 35% 45%, rgba(255,255,255,.5) 0 8%, transparent 12%), radial-gradient(circle at 65% 60%, rgba(255,255,255,.4) 0 6%, transparent 10%), radial-gradient(circle at 50% 70%, rgba(255,255,255,.35) 0 5%, transparent 9%)",
    tint: "#E8D9A8",
  },
  {
    n: "06",
    key: "carne",
    label: "CARNE",
    headPre: "Che si sceglie ",
    headline: "al banco",
    headPost: ".",
    sub: "Frollatura 15 giorni. Ogni taglio si traccia al pascolo.",
    bg: "radial-gradient(120% 90% at 50% 55%, #8a2a20 0%, #6E1A14 50%, #2a0f0c 100%)",
    overlay:
      "repeating-linear-gradient(115deg, rgba(255,240,220,.08) 0 3px, transparent 3px 12px), radial-gradient(40% 30% at 50% 50%, rgba(255,220,200,.12) 0, transparent 70%)",
    tint: "#C05040",
  },
  {
    n: "07",
    key: "brace",
    label: "BRACE",
    headPre: "Che cuoce ",
    headline: "sulla brace",
    headPost: ".",
    sub: "A carboni. Ogni sera.",
    bg: "radial-gradient(120% 90% at 50% 60%, #E24B10 0%, #B33A1A 35%, #6E1A14 70%, #1A1210 100%)",
    overlay:
      "radial-gradient(30% 22% at 40% 65%, rgba(255,200,80,.55) 0, transparent 70%), radial-gradient(25% 18% at 65% 55%, rgba(255,180,60,.5) 0, transparent 70%)",
    tint: "#F5A02A",
  },
  {
    n: "08",
    key: "tavola",
    label: "TAVOLA",
    headPre: "Che arriva ",
    headline: "in tavola",
    headPost: ".",
    sub: "Dalla terra alla brace. Qui non arriva niente da fuori.",
    bg: "radial-gradient(120% 90% at 50% 55%, #6a3a1e 0%, #3D2A1E 50%, #1A1210 100%)",
    overlay:
      "radial-gradient(18% 12% at 50% 40%, rgba(255,210,120,.55) 0, transparent 70%), radial-gradient(60% 20% at 50% 78%, rgba(0,0,0,.5) 0, transparent 70%)",
    tint: "#C49A4A",
  },
];

export function LaFiliera() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGPathElement>(null);
  const sparksCanvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || reduced) return;
    const root = rootRef.current;
    const stage = stageRef.current;
    const bg = bgRef.current;
    const overlay = overlayRef.current;
    if (!root || !stage || !bg || !overlay) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();
    const triggers: ScrollTrigger[] = [];

    // Set iniziale
    gsap.set(bg, { backgroundImage: STAGES[0].bg });
    gsap.set(overlay, { backgroundImage: STAGES[0].overlay || "none", opacity: 1 });

    mm.add("(min-width: 900px)", () => {
      const total = STAGES.length; // 8
      // Ogni stadio = 100vh di scroll → totale 8 * 100vh (compreso stadio finale)
      const scrollLen = total * 100; // vh
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: `+=${scrollLen}%`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const idx = Math.min(total - 1, Math.floor(p * total));
          setActive((prev) => (prev !== idx ? idx : prev));
        },
      });
      triggers.push(st);

      // Timeline scrub per background & overlay
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: `+=${scrollLen}%`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      STAGES.forEach((s, i) => {
        if (i === 0) return;
        tl.to(
          bg,
          { backgroundImage: s.bg, duration: 1, ease: "power1.inOut" },
          i - 1,
        );
        tl.to(
          overlay,
          {
            backgroundImage: s.overlay || "none",
            opacity: s.overlay ? 1 : 0,
            duration: 1,
            ease: "power1.inOut",
          },
          i - 1,
        );
      });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);

      // Filo d'oro (cerchio) — draw sull'intero range
      const circle = circleRef.current;
      if (circle) {
        const len = circle.getTotalLength();
        circle.style.strokeDasharray = String(len);
        circle.style.strokeDashoffset = String(len);
        const ct = gsap.to(circle, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: `+=${scrollLen}%`,
            scrub: 1,
          },
        });
        if (ct.scrollTrigger) triggers.push(ct.scrollTrigger);
      }

      return () => {
        // matchMedia cleanup gestito da mm.revert()
      };
    });

    mm.add("(max-width: 899px)", () => {
      // Mobile: no pin. Attivo lo stadio in base allo scroll del root
      const st = ScrollTrigger.create({
        trigger: root,
        start: "top 60%",
        end: "bottom 40%",
        scrub: 0.5,
        onUpdate: (self) => {
          const idx = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
          setActive((prev) => (prev !== idx ? idx : prev));
          gsap.to(bg, { backgroundImage: STAGES[idx].bg, duration: 0.4, overwrite: "auto" });
          gsap.to(overlay, {
            backgroundImage: STAGES[idx].overlay || "none",
            opacity: STAGES[idx].overlay ? 1 : 0,
            duration: 0.4,
            overwrite: "auto",
          });
        },
      });
      triggers.push(st);
    });

    // refresh dopo fonts
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    // fallback anti-invisibilità
    const fb = window.setTimeout(() => {
      const nodes = root.querySelectorAll<HTMLElement>("[data-safe]");
      nodes.forEach((n) => {
        if (parseFloat(getComputedStyle(n).opacity) < 0.05) n.style.opacity = "1";
      });
    }, 3000);

    return () => {
      window.clearTimeout(fb);
      triggers.forEach((t) => t.kill());
      mm.revert();
    };
  }, [reduced]);

  // Scintille solo stadio brace (07 → index 6)
  useEffect(() => {
    if (reduced) return;
    if (active !== 6) return;
    const canvas = sparksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; vy: number; vx: number; life: number; max: number; s: number };
    const parts: P[] = [];
    const MAX = 10;
    let raf = 0;
    let running = true;

    const spawn = () => {
      if (parts.length >= MAX) return;
      parts.push({
        x: canvas.width * (0.3 + Math.random() * 0.4),
        y: canvas.height * 0.85,
        vy: -(0.4 + Math.random() * 0.8) * dpr,
        vx: (Math.random() - 0.5) * 0.3 * dpr,
        life: 0,
        max: 60 + Math.random() * 40,
        s: (1 + Math.random()) * dpr,
      });
    };

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Math.random() < 0.35) spawn();
      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.005 * dpr;
        p.life++;
        const a = 1 - p.life / p.max;
        if (a <= 0) {
          parts.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(255, ${180 + Math.floor(60 * a)}, 80, ${a * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active, reduced]);

  // Reduced motion: mostra galleria verticale statica
  if (reduced) {
    return (
      <section
        aria-label="La Filiera — morph di materia"
        className="relative w-full bg-[color:var(--carbone)] px-6 py-24 text-[color:var(--crema)] md:px-10"
      >
        <div className="mx-auto max-w-5xl">
          <p className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--crema)]/40">
            04 — LA FILIERA
          </p>
          <h2
            className="font-display italic mt-6"
            style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 300 }}
          >
            Qui non arriva niente da <span className="text-[color:var(--oro)]">fuori</span>.
          </h2>
          <ul className="mt-12 grid gap-10">
            {STAGES.map((s) => (
              <li key={s.key} className="grid gap-4 md:grid-cols-[1fr_1.2fr] md:items-center">
                <div
                  className="aspect-[16/10] w-full rounded-sm"
                  style={{ backgroundImage: s.bg, backgroundSize: "cover" }}
                />
                <div>
                  <p className="font-eyebrow text-[10px] tracking-[0.35em] text-[color:var(--oro)]/80">
                    {s.n} · {s.label}
                  </p>
                  <p className="font-display italic mt-3 text-2xl" style={{ fontWeight: 300 }}>
                    {s.headPre}
                    <span className="text-[color:var(--oro)]">{s.headline}</span>
                    {s.headPost}
                  </p>
                  {s.sub && <p className="mt-3 text-[color:var(--crema)]/70">{s.sub}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  const s = STAGES[active];

  return (
    <section
      ref={rootRef}
      aria-label="La Filiera — morph di materia"
      className="relative isolate w-full overflow-hidden bg-[color:var(--carbone)] text-[color:var(--crema)]"
      style={{ minHeight: "100svh" }}
    >
      {/* HEADER FISSO SOPRA IL PALCOSCENICO */}
      <div className="relative z-20 mx-auto flex h-svh w-full max-w-[1400px] flex-col px-6 pt-8 md:px-10 md:pt-10">
        <div className="flex items-center justify-between">
          <p className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--crema)]/40">
            04 — LA FILIERA
          </p>
          <p className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--crema)]/40">
            NOCI · MURGIA
          </p>
        </div>
        <h2
          data-safe
          className="font-display italic mx-auto mt-6 max-w-3xl text-center"
          style={{
            fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)",
            lineHeight: 1.1,
            fontWeight: 300,
          }}
        >
          Qui non arriva niente da{" "}
          <span
            className="text-[color:var(--oro)]"
            style={{ filter: "drop-shadow(0 0 12px rgba(196,154,74,0.25))" }}
          >
            fuori
          </span>
          .
        </h2>

        {/* CORPO: testo sx · palco centrale · barra dx */}
        <div className="relative mt-6 flex flex-1 items-center gap-8 md:gap-12">
          {/* TESTO LATERALE */}
          <aside className="hidden w-[24%] shrink-0 md:block">
            <div className="min-h-[180px]">
              <p
                key={"lbl-" + s.key}
                className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro)]/85"
                style={{ animation: "fdIn .6s ease both" }}
              >
                {s.n} · {s.label}
              </p>
              <p
                key={"hd-" + s.key}
                data-safe
                className="font-display italic mt-4 text-[color:var(--crema)]"
                style={{
                  fontSize: "clamp(1.5rem, 2.6vw, 2.25rem)",
                  lineHeight: 1.15,
                  fontWeight: 300,
                  animation: "fdInUp .7s ease both",
                }}
              >
                {s.headPre}
                <span className="text-[color:var(--oro)]">{s.headline}</span>
                {s.headPost}
              </p>
              {s.sub && (
                <p
                  key={"sub-" + s.key}
                  data-safe
                  className="mt-5 text-[color:var(--crema)]/70"
                  style={{ lineHeight: 1.55, animation: "fdInUp .8s .05s ease both" }}
                >
                  {s.sub}
                </p>
              )}
            </div>
          </aside>

          {/* PALCOSCENICO */}
          <div
            ref={stageRef}
            className="relative mx-auto aspect-[16/10] w-full max-w-[720px] flex-1 overflow-hidden rounded-sm border border-[color:var(--oro)]/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)] md:aspect-[4/3]"
          >
            <div
              ref={bgRef}
              className="absolute inset-0 will-change-[background-image]"
              style={{ backgroundSize: "cover", transition: "background-image 200ms linear" }}
            />
            <div
              ref={overlayRef}
              className="absolute inset-0 mix-blend-screen"
              style={{ backgroundSize: "cover" }}
            />
            {/* grana */}
            <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.08]" />
            {/* vignetta */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(100% 80% at 50% 55%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
              }}
            />
            {/* scintille brace */}
            {active === 6 && (
              <canvas
                ref={sparksCanvasRef}
                className="pointer-events-none absolute inset-0"
                style={{ mixBlendMode: "screen" }}
              />
            )}
            {/* filo d'oro che chiude il cerchio */}
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                ref={circleRef}
                d="M 50 8 A 42 42 0 1 1 49.99 8"
                fill="none"
                stroke="url(#filoOroFil)"
                strokeWidth="0.35"
                vectorEffect="non-scaling-stroke"
                style={{ mixBlendMode: "screen", opacity: 0.75 }}
              />
              <defs>
                <linearGradient id="filoOroFil" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#C49A4A" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="#F5D07A" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#B33A1A" stopOpacity="0.85" />
                </linearGradient>
              </defs>
            </svg>
            {/* etichetta stadio in overlay */}
            <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-sm border border-[color:var(--oro)]/30 bg-black/40 px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.tint }} />
              <span className="font-eyebrow text-[9px] tracking-[0.35em] text-[color:var(--crema)]/85">
                {s.n} · {s.label}
              </span>
            </div>
          </div>

          {/* BARRA VERTICALE DI PROGRESSO */}
          <aside className="hidden w-[14%] shrink-0 md:block">
            <ol className="relative flex h-full flex-col justify-between border-l border-[color:var(--oro)]/20 pl-4">
              {STAGES.map((st, i) => {
                const on = i === active;
                return (
                  <li key={st.key} className="relative">
                    <span
                      className="absolute -left-[7px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full transition-all duration-500"
                      style={{
                        background: on ? "var(--oro)" : "rgba(242,232,213,0.2)",
                        boxShadow: on ? "0 0 10px rgba(196,154,74,0.7)" : "none",
                      }}
                    />
                    <span
                      className="font-eyebrow block text-[9px] tracking-[0.28em] transition-colors duration-500"
                      style={{
                        color: on ? "var(--oro)" : "rgba(242,232,213,0.35)",
                      }}
                    >
                      {st.n} {st.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>

        {/* MOBILE: barra orizzontale + testo sotto */}
        <div className="mt-6 md:hidden">
          <div className="flex gap-1">
            {STAGES.map((st, i) => (
              <span
                key={st.key}
                className="h-[3px] flex-1 rounded-full transition-colors duration-500"
                style={{
                  background: i <= active ? "var(--oro)" : "rgba(242,232,213,0.15)",
                }}
              />
            ))}
          </div>
          <p className="font-eyebrow mt-3 text-[10px] tracking-[0.4em] text-[color:var(--oro)]/85">
            {s.n} · {s.label}
          </p>
          <p
            data-safe
            className="font-display italic mt-2 text-xl text-[color:var(--crema)]"
            style={{ fontWeight: 300, lineHeight: 1.2 }}
          >
            {s.headPre}
            <span className="text-[color:var(--oro)]">{s.headline}</span>
            {s.headPost}
          </p>
          {s.sub && (
            <p data-safe className="mt-2 text-sm text-[color:var(--crema)]/70">
              {s.sub}
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fdIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fdInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
