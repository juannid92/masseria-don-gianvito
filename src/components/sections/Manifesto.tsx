import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * MANIFESTO — "LA FORGIA" (curata)
 * Frase in --crema, unica parola incandescente: "brace".
 * Glow localizzato + poche scintille sopra "brace". Reveal a maschera.
 * ───────────────────────────────────────────────────────────── */

type Spark = { x: number; y: number; vx: number; vy: number; life: number; ttl: number; size: number };

export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const braceRef = useRef<HTMLSpanElement>(null);
  const phraseRef = useRef<HTMLDivElement>(null);
  const torchRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // micro-respiro sullo scroll (framer-motion)
  const scrollY = useMotionValue(0);
  const velocity = useVelocity(scrollY);
  const smoothVel = useSpring(velocity, { damping: 40, stiffness: 200, mass: 0.4 });
  const skew = useTransform(smoothVel, [-2000, 0, 2000], [2.5, 0, -2.5]);
  const scaleX = useTransform(smoothVel, [-2000, 0, 2000], [1.01, 1, 1.01]);

  useEffect(() => {
    const onScroll = () => scrollY.set(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollY]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const brace = braceRef.current;
    const phrase = phraseRef.current;
    if (!root || !canvas || !brace || !phrase) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx2d = canvas.getContext("2d", { alpha: true });
    if (!ctx2d) return;

    const lines = Array.from(phrase.querySelectorAll<HTMLElement>("[data-line]"));
    const oath = root.querySelector<HTMLElement>("[data-oath]");

    // ── REDUCED MOTION: statico ma completo
    if (reduced) {
      lines.forEach((l) => {
        l.style.clipPath = "inset(0 0 0 0)";
        l.style.opacity = "1";
      });
      if (oath) oath.style.opacity = "1";
      brace.classList.add("is-lit");
      return;
    }

    // ── Canvas sizing
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

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const MAX_SPARKS = isMobile ? 8 : 15;
    const sparks: Spark[] = [];

    // punto sorgente scintille: centro-alto della parola "brace" (in coords canvas)
    const getBraceAnchor = () => {
      const cr = canvas.getBoundingClientRect();
      const br = brace.getBoundingClientRect();
      return {
        x: br.left - cr.left + br.width * 0.5,
        y: br.top - cr.top + br.height * 0.35,
        w: br.width,
        h: br.height,
      };
    };

    // ── Torch (desktop, soft)
    const torchQ = torchRef.current
      ? {
          x: gsap.quickTo(torchRef.current, "x", { duration: 0.6, ease: "power3.out" }),
          y: gsap.quickTo(torchRef.current, "y", { duration: 0.6, ease: "power3.out" }),
        }
      : null;
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      torchQ?.x(e.clientX - r.left);
      torchQ?.y(e.clientY - r.top);
    };
    if (!isMobile) root.addEventListener("pointermove", onMove);

    // ── Visibility gate
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
    io.observe(root);

    // ── Single rAF via gsap.ticker
    let t = 0;
    let lit = false;
    const tick = () => {
      if (!visible) return;
      t += 0.016;
      ctx2d.clearRect(0, 0, W, H);

      const a = getBraceAnchor();

      // GLOW pulsante localizzato SOLO sotto/dietro "brace"
      const pulse = 0.55 + Math.sin(t * 1.1) * 0.18;
      const glowR = Math.max(a.w * 0.9, 220);
      const g = ctx2d.createRadialGradient(a.x, a.y + a.h * 0.15, 0, a.x, a.y + a.h * 0.15, glowR);
      g.addColorStop(0, `rgba(196,154,74,${0.28 * pulse})`);
      g.addColorStop(0.35, `rgba(179,58,26,${0.22 * pulse})`);
      g.addColorStop(0.75, `rgba(110,26,20,${0.08 * pulse})`);
      g.addColorStop(1, "rgba(26,18,16,0)");
      ctx2d.globalCompositeOperation = "screen";
      ctx2d.fillStyle = g;
      ctx2d.beginPath();
      ctx2d.arc(a.x, a.y + a.h * 0.15, glowR, 0, Math.PI * 2);
      ctx2d.fill();

      // SCINTILLE — solo se accesa, poche, sottili, salgono dalla brace
      if (lit && sparks.length < MAX_SPARKS && Math.random() < 0.12) {
        sparks.push({
          x: a.x + (Math.random() - 0.5) * a.w * 0.7,
          y: a.y + a.h * 0.3,
          vx: (Math.random() - 0.5) * 0.25,
          vy: -(0.35 + Math.random() * 0.7),
          life: 0,
          ttl: 2.2 + Math.random() * 2.0,
          size: 0.6 + Math.random() * 1.4,
        });
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += 0.016;
        s.x += s.vx;
        s.y += s.vy;
        s.vy -= 0.004;
        const al = Math.max(0, 1 - s.life / s.ttl);
        // scia
        ctx2d.strokeStyle = `rgba(255,190,110,${al * 0.35})`;
        ctx2d.lineWidth = s.size * 0.6;
        ctx2d.beginPath();
        ctx2d.moveTo(s.x, s.y);
        ctx2d.lineTo(s.x - s.vx * 8, s.y - s.vy * 8);
        ctx2d.stroke();
        // punto
        ctx2d.fillStyle = `rgba(255,210,140,${al})`;
        ctx2d.beginPath();
        ctx2d.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx2d.fill();
        if (s.life >= s.ttl || s.y < -20) sparks.splice(i, 1);
      }
      ctx2d.globalCompositeOperation = "source-over";
    };
    gsap.ticker.add(tick);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    // ── Reveal a maschera (clip-path wipe dal basso), riga per riga
    const ease = "cubic-bezier(.16,1,.3,1)";
    lines.forEach((l) => {
      l.style.clipPath = "inset(0 0 100% 0)";
      l.style.opacity = "1";
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: "top 75%", once: true },
    });
    tl.to(lines, {
      clipPath: "inset(0 0 0% 0)",
      duration: 1.2,
      ease,
      stagger: 0.22,
    });
    tl.add(() => {
      brace.classList.add("is-lit");
      lit = true;
    }, "-=0.3");
    if (oath) {
      tl.fromTo(oath, { opacity: 0, y: 8 }, { opacity: 0.6, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.4");
    }

    // Fallback anti-invisibilità
    const fb = window.setTimeout(() => {
      lines.forEach((l) => {
        if (parseFloat(getComputedStyle(l).opacity) < 0.05) {
          l.style.opacity = "1";
          l.style.clipPath = "inset(0 0 0 0)";
        }
      });
      if (oath && parseFloat(getComputedStyle(oath).opacity) < 0.05) oath.style.opacity = "0.6";
      brace.classList.add("is-lit");
      lit = true;
    }, 3000);

    return () => {
      window.clearTimeout(fb);
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      if (!isMobile) root.removeEventListener("pointermove", onMove);
      io.disconnect();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="La Forgia — il giuramento della masseria"
      className="forge relative isolate w-full overflow-hidden bg-[color:var(--carbone)] text-[color:var(--crema)]"
      style={{ minHeight: "100svh" }}
    >
      {/* Vignettatura calda */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 60%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Placeholder foto reale (sobrio, texture materica) */}
      <div
        aria-hidden
        data-placeholder="masseria-photo"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] opacity-[0.09]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, #3D2A1E 60%, #1A1210 100%)",
          maskImage:
            "radial-gradient(120% 100% at 50% 100%, black 40%, transparent 90%)",
        }}
      />

      {/* Canvas glow + scintille (localizzate su "brace") */}
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Grana */}
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.04]" />

      {/* Torcia soft (desktop) */}
      <div ref={torchRef} aria-hidden className="torch pointer-events-none absolute left-0 top-0 hidden md:block" />

      {/* Rail marginalia */}
      <div className="pointer-events-none absolute left-4 top-8 z-10 hidden md:block">
        <p className="font-eyebrow text-[10px] text-[color:var(--oro)]/60 [writing-mode:vertical-rl] rotate-180 tracking-[0.35em]">
          Il Giuramento · Cap. 00
        </p>
      </div>

      {/* Contenuto */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-center px-8 py-28 md:px-24">
        <motion.div
          ref={phraseRef}
          className="mx-auto w-full max-w-[1400px] will-change-transform"
          style={{ skewY: skew, scaleX }}
        >
          {/* Riga 1 */}
          <div
            data-line
            className="phrase-line font-display italic text-[color:var(--crema)]"
            style={{
              fontSize: "clamp(3rem, 11vw, 10.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.015em",
              fontWeight: 300,
            }}
          >
            Dalla terra
          </div>
          {/* Riga 2 — sfalsata a destra con aria */}
          <div
            data-line
            className="phrase-line mt-3 pl-[8%] font-display italic md:mt-6 md:pl-[18%]"
            style={{
              fontSize: "clamp(3rem, 11vw, 10.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.015em",
              fontWeight: 300,
            }}
          >
            <span className="text-[color:var(--crema)]">alla </span>
            <span ref={braceRef} className="brace-word">brace</span>
            <span className="text-[color:var(--crema)]">.</span>
          </div>
        </motion.div>

        {/* Sottotitolo distante, discreto */}
        <p
          data-oath
          className="mt-24 text-center font-eyebrow text-[10px] md:text-[11px] tracking-[0.5em] text-[color:var(--crema)]/60 md:mt-32"
        >
          QUI · NON · ARRIVA · NIENTE · DA · FUORI
        </p>
      </div>

      <style>{`
        .phrase-line {
          will-change: clip-path, opacity;
        }

        .torch {
          width: 420px; height: 420px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(255,180,90,0.08) 0%, rgba(179,58,26,0.05) 35%, rgba(0,0,0,0) 70%);
          mix-blend-mode: screen;
          filter: blur(20px);
          will-change: transform;
        }

        .brace-word {
          display: inline-block;
          background-image: linear-gradient(
            100deg,
            #b33a1a 0%,
            #c49a4a 45%,
            #f2c27a 55%,
            #c49a4a 65%,
            #b33a1a 100%
          );
          background-size: 220% 100%;
          background-position: 100% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 0 rgba(196,154,74,0));
          transition: filter 1.2s ease, background-position 1.4s cubic-bezier(.16,1,.3,1);
        }
        .brace-word.is-lit {
          background-position: 0% 50%;
          animation: braceShimmer 8s linear infinite 1.4s;
          filter:
            drop-shadow(0 0 18px rgba(196,154,74,0.35))
            drop-shadow(0 0 42px rgba(179,58,26,0.25));
        }

        @keyframes braceShimmer {
          0%   { background-position: 0% 50%; }
          100% { background-position: -220% 50%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .brace-word { animation: none; background-position: 45% 50%; }
        }
      `}</style>
    </section>
  );
}
