import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * MANIFESTO — "LA FORGIA"
 * Il giuramento del posto è FORGIATO nel fuoco.
 * Braci vive (Canvas), scintille (particelle), heat-haze (SVG),
 * oro fuso (gradient text animato), cursore-torcia, parole che
 * si "scaldano" e reagiscono alla velocità di scroll.
 * ───────────────────────────────────────────────────────────── */

type Ember = { x: number; y: number; r: number; phase: number; speed: number; hueMix: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; ttl: number; size: number };

export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const torchRef = useRef<HTMLDivElement>(null);
  const linesWrapRef = useRef<HTMLDivElement>(null);
  const oathRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx2d = canvas.getContext("2d", { alpha: true });
    if (!ctx2d) return;

    const words = Array.from(root.querySelectorAll<HTMLElement>("[data-forge-word]"));
    const oathChars = oathRef.current
      ? Array.from(oathRef.current.querySelectorAll<HTMLElement>("[data-oath-char]"))
      : [];

    // ── REDUCED MOTION: statico, tutto già visibile e "caldo"
    if (reduced) {
      words.forEach((w) => {
        w.style.opacity = "1";
        w.style.filter = "none";
        w.classList.add("is-hot");
      });
      oathChars.forEach((c) => (c.style.opacity = "1"));
      // brace statica
      const draw = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight;
        canvas.width = w * window.devicePixelRatio;
        canvas.height = h * window.devicePixelRatio;
        ctx2d.scale(window.devicePixelRatio, window.devicePixelRatio);
        const grad = ctx2d.createRadialGradient(w / 2, h, 40, w / 2, h, w * 0.7);
        grad.addColorStop(0, "rgba(179,58,26,0.55)");
        grad.addColorStop(0.5, "rgba(110,26,20,0.35)");
        grad.addColorStop(1, "rgba(26,18,16,0)");
        ctx2d.fillStyle = grad;
        ctx2d.fillRect(0, 0, w, h);
      };
      draw();
      window.addEventListener("resize", draw);
      return () => window.removeEventListener("resize", draw);
    }

    // ── DIMENSIONING
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // ── EMBERS (letto braci in basso)
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const EMBER_COUNT = isMobile ? 60 : 140;
    const SPARK_MAX = isMobile ? 30 : 70;

    const embers: Ember[] = [];
    const seedEmbers = () => {
      embers.length = 0;
      for (let i = 0; i < EMBER_COUNT; i++) {
        embers.push({
          x: Math.random() * W,
          y: H - Math.random() * H * 0.28 - 4,
          r: 8 + Math.random() * 22,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.2,
          hueMix: Math.random(),
        });
      }
    };
    seedEmbers();

    const sparks: Spark[] = [];
    const spawnSpark = (x: number, y: number, boost = 1) => {
      if (sparks.length >= SPARK_MAX) return;
      sparks.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.4 + Math.random() * 1.2) * boost,
        life: 0,
        ttl: 1.4 + Math.random() * 2.2,
        size: 0.6 + Math.random() * 1.8,
      });
    };

    // ── TORCH (cursor)
    const torch = { x: -9999, y: -9999, active: false };
    const torchQ = torchRef.current
      ? {
          x: gsap.quickTo(torchRef.current, "x", { duration: 0.5, ease: "power3.out" }),
          y: gsap.quickTo(torchRef.current, "y", { duration: 0.5, ease: "power3.out" }),
        }
      : null;

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      torch.x = e.clientX - r.left;
      torch.y = e.clientY - r.top;
      torch.active = true;
      torchQ?.x(e.clientX - r.left);
      torchQ?.y(e.clientY - r.top);
      // scaldare parole vicine
      words.forEach((w) => {
        const wr = w.getBoundingClientRect();
        const cx = wr.left - r.left + wr.width / 2;
        const cy = wr.top - r.top + wr.height / 2;
        const d = Math.hypot(cx - torch.x, cy - torch.y);
        const heat = Math.max(0, 1 - d / 380);
        w.style.setProperty("--heat", heat.toFixed(3));
      });
    };
    const onLeave = () => {
      torch.active = false;
      torch.x = -9999;
      torch.y = -9999;
      words.forEach((w) => w.style.setProperty("--heat", "0"));
    };
    if (!isMobile) {
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
    }

    // ── SCROLL VELOCITY → skew/scale su parole
    let lastY = window.scrollY;
    let velocity = 0;
    let velSmoothed = 0;
    const lenisEvt = () => {
      const y = window.scrollY;
      velocity = y - lastY;
      lastY = y;
    };
    window.addEventListener("scroll", lenisEvt, { passive: true });

    // ── VISIBILITÀ (pause rAF quando fuori viewport)
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => (visible = entry.isIntersecting),
      { threshold: 0.01 },
    );
    io.observe(root);

    // ── LOOP (singolo, via gsap.ticker)
    let t = 0;
    const tick = () => {
      if (!visible) return;
      t += 0.016;
      velSmoothed += (velocity - velSmoothed) * 0.15;
      velocity *= 0.85;

      // clear
      ctx2d.clearRect(0, 0, W, H);

      // haze di fondo caldo
      const bg = ctx2d.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "rgba(26,18,16,0)");
      bg.addColorStop(1, "rgba(110,26,20,0.18)");
      ctx2d.fillStyle = bg;
      ctx2d.fillRect(0, 0, W, H);

      // BRACE VIVA
      ctx2d.globalCompositeOperation = "screen";
      for (const e of embers) {
        const pulse = 0.55 + Math.sin(t * e.speed + e.phase) * 0.35;
        // torcia flare
        let flare = 0;
        if (torch.active) {
          const d = Math.hypot(e.x - torch.x, e.y - torch.y);
          flare = Math.max(0, 1 - d / 260);
        }
        const alpha = Math.min(1, pulse * 0.55 + flare * 0.6);
        const r = e.r * (1 + flare * 0.35);
        const g = ctx2d.createRadialGradient(e.x, e.y, 0, e.x, e.y, r);
        const mix = e.hueMix;
        g.addColorStop(0, `rgba(255,${180 - mix * 60},${80 - mix * 40},${alpha})`);
        g.addColorStop(0.4, `rgba(179,58,26,${alpha * 0.55})`);
        g.addColorStop(1, "rgba(110,26,20,0)");
        ctx2d.fillStyle = g;
        ctx2d.beginPath();
        ctx2d.arc(e.x, e.y, r, 0, Math.PI * 2);
        ctx2d.fill();

        // spawn scintille dalle braci calde
        if (Math.random() < 0.008 + flare * 0.06) spawnSpark(e.x, e.y - 4, 1 + flare);
      }

      // SCINTILLE
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 0.016;
        s.x += s.vx + (Math.random() - 0.5) * 0.4;
        s.y += s.vy;
        s.vy -= 0.01; // salgono
        const a = Math.max(0, 1 - s.life / s.ttl);
        ctx2d.fillStyle = `rgba(255,${200 - a * 40},120,${a})`;
        ctx2d.beginPath();
        ctx2d.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx2d.fill();
        if (s.life >= s.ttl || s.y < -20) sparks.splice(i, 1);
      }

      ctx2d.globalCompositeOperation = "source-over";

      // applica velocità di scroll ai wrap-parole (skew)
      const sk = gsap.utils.clamp(-6, 6, velSmoothed * 0.25);
      const sx = 1 + gsap.utils.clamp(-0.04, 0.04, Math.abs(velSmoothed) * 0.004);
      if (linesWrapRef.current) {
        linesWrapRef.current.style.transform = `skewY(${sk}deg) scaleX(${sx.toFixed(3)})`;
      }
    };
    gsap.ticker.add(tick);

    // ── RESIZE
    const onResize = () => {
      resize();
      seedEmbers();
    };
    window.addEventListener("resize", onResize);

    // ── SCROLL COREOGRAFIA (scrub): parole "si scaldano"
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top 80%",
      end: "bottom top",
      scrub: 0.8,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        words.forEach((w, i) => {
          const localP = gsap.utils.clamp(0, 1, (p - i * 0.05) * 1.6);
          w.style.setProperty("--forge", localP.toFixed(3));
        });
      },
    });

    // reveal iniziale (once) — parole visibili di default, qui "solo" scaldata
    const revealTl = gsap.fromTo(
      words,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "back.out(1.4)",
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: "top 82%", once: true },
      },
    );

    if (oathChars.length) {
      gsap.fromTo(
        oathChars,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.03,
          stagger: 0.02,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 40%", once: true },
        },
      );
    }

    // fallback 3s
    const fb = window.setTimeout(() => {
      words.forEach((w) => {
        if (parseFloat(getComputedStyle(w).opacity) < 0.05) w.style.opacity = "1";
      });
      oathChars.forEach((c) => {
        if (parseFloat(getComputedStyle(c).opacity) < 0.05) c.style.opacity = "1";
      });
    }, 3000);

    return () => {
      window.clearTimeout(fb);
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", lenisEvt);
      if (!isMobile) {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      }
      io.disconnect();
      st.kill();
      revealTl.scrollTrigger?.kill();
      revealTl.kill();
    };
  }, [reduced]);

  // riga 1: DALLA TERRA · riga 2: ALLA BRACE (rompo la griglia con offset)
  const line1 = ["DALLA", "TERRA"];
  const line2 = ["ALLA", "BRACE"];
  const oathText = "QUI · NON · ARRIVA · NIENTE · DA · FUORI";

  return (
    <section
      ref={rootRef}
      aria-label="La Forgia — il giuramento della masseria"
      className="forge relative isolate w-full overflow-hidden bg-[color:var(--carbone)] text-[color:var(--crema)]"
      style={{ minHeight: "110svh" }}
    >
      {/* SVG turbulence — heat haze */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35] mix-blend-screen" aria-hidden>
        <defs>
          <filter id="forge-haze">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="4">
              <animate attributeName="baseFrequency" dur="9s" values="0.012 0.02;0.02 0.03;0.012 0.02" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="6" />
          </filter>
          <radialGradient id="forge-vign" cx="50%" cy="60%" r="70%">
            <stop offset="60%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.85)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#forge-vign)" filter="url(#forge-haze)" />
      </svg>

      {/* Canvas braci + scintille */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Grana */}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-60" />

      {/* Torcia cursore */}
      <div
        ref={torchRef}
        aria-hidden
        className="torch pointer-events-none absolute left-0 top-0 hidden md:block"
      />

      {/* Rail marginalia */}
      <div className="pointer-events-none absolute left-3 top-6 z-10 hidden md:block">
        <p className="font-eyebrow text-[10px] text-[color:var(--oro)]/70 [writing-mode:vertical-rl] rotate-180">
          La Forgia · Il Giuramento
        </p>
      </div>

      {/* Contenuto */}
      <div className="relative z-10 flex min-h-[110svh] flex-col justify-center px-6 py-24 md:px-16">
        <div ref={linesWrapRef} className="mx-auto w-full max-w-[1600px] will-change-transform">
          {/* Riga 1 — offset sinistra */}
          <div className="flex flex-wrap items-end gap-x-[0.15em] gap-y-2 md:-ml-2">
            {line1.map((w, i) => (
              <span
                key={`l1-${i}`}
                data-forge-word
                className="forge-word font-display italic"
                style={{
                  fontSize: "clamp(3.5rem, 15vw, 14rem)",
                  lineHeight: 0.9,
                  transform: i === 1 ? "translateY(0.15em)" : "none",
                }}
              >
                {w}
              </span>
            ))}
          </div>
          {/* Riga 2 — offset destra, in profondità */}
          <div className="mt-2 flex flex-wrap items-end justify-end gap-x-[0.15em] gap-y-2 md:mt-6 md:pr-6">
            {line2.map((w, i) => (
              <span
                key={`l2-${i}`}
                data-forge-word
                className="forge-word font-display italic"
                style={{
                  fontSize: i === 1 ? "clamp(4rem, 18vw, 17rem)" : "clamp(3rem, 12vw, 11rem)",
                  lineHeight: 0.9,
                  transform: i === 0 ? "translateY(-0.1em)" : "none",
                }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* Giuramento inciso */}
        <p
          ref={oathRef}
          className="mt-12 text-center font-eyebrow text-[10px] md:text-[13px] tracking-[0.42em] text-[color:var(--crema)]/80"
        >
          {oathText.split("").map((c, i) => (
            <span key={i} data-oath-char className="inline-block">
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </p>
      </div>

      <style>{`
        .forge { --heat: 0; }

        .torch {
          width: 520px; height: 520px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255,180,90,0.28) 0%, rgba(179,58,26,0.16) 30%, rgba(0,0,0,0) 65%);
          mix-blend-mode: screen;
          filter: blur(6px);
          will-change: transform;
        }

        .forge-word {
          --forge: 0;
          display: inline-block;
          background-image: linear-gradient(
            100deg,
            #6e1a14 0%,
            #b33a1a 22%,
            #f2c27a 42%,
            #ffe7b0 50%,
            #c49a4a 58%,
            #b33a1a 78%,
            #6e1a14 100%
          );
          background-size: 220% 100%;
          background-position: calc(100% - var(--forge) * 100%) 50%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 300;
          font-variation-settings: "wght" calc(300 + var(--forge) * 500 + var(--heat) * 200), "opsz" 144, "SOFT" 30;
          filter: drop-shadow(0 0 calc(6px + var(--heat) * 22px) rgba(196,154,74, calc(0.15 + var(--heat) * 0.55)))
                  drop-shadow(0 0 calc(2px + var(--forge) * 20px) rgba(179,58,26, calc(0.15 + var(--forge) * 0.5)));
          letter-spacing: -0.02em;
          animation: forgeShimmer 6s linear infinite;
          transition: font-variation-settings 0.4s ease;
        }
        .forge-word.is-hot {
          --forge: 1;
        }

        @keyframes forgeShimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: 220% 50%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .forge-word { animation: none; background-position: 60% 50%; }
        }
      `}</style>
    </section>
  );
}
