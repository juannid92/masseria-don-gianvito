import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/* ──────────────────────────────────────────────────────────────
 * PRENOTA — La brace ti chiama.
 * Glow ascendente su scroll + titolo clip-path + CTA magnetic +
 * scintille additive. Chiusura del racconto prima del footer.
 * ───────────────────────────────────────────────────────────── */

const WHATSAPP = "https://wa.me/393339395750";
const TEL = "tel:+393339395750";
const MAPS = "https://www.google.com/maps?q=40.642739,17.042600";

function MagneticButton({
  children,
  href,
  primary = false,
}: {
  children: React.ReactNode;
  href: string;
  primary?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    const clamp = (v: number) => Math.max(-15, Math.min(15, v * 0.35));
    x.set(clamp(relX));
    y.set(clamp(relY));
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={primary ? "_blank" : undefined}
      rel={primary ? "noreferrer noopener" : undefined}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={
        primary
          ? "prenota-cta-primary relative inline-flex items-center justify-center rounded-full px-10 py-5 font-eyebrow text-[13px] uppercase tracking-[0.3em] text-[color:var(--crema)] shadow-[0_10px_40px_-10px_rgba(179,58,26,0.6)]"
          : "prenota-cta-ghost inline-flex items-center justify-center rounded-full border border-[color:var(--oro)] px-8 py-5 font-eyebrow text-[12px] uppercase tracking-[0.3em] text-[color:var(--oro)] transition-colors hover:bg-[color:var(--oro)]/10"
      }
    >
      {children}
    </motion.a>
  );
}

export function Prenota() {
  const rootRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftLineRef = useRef<SVGPathElement>(null);
  const rightLineRef = useRef<SVGPathElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // GLOW ASCENDENTE + filetti oro + clip-path titolo
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "center center",
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (glowRef.current) glowRef.current.style.opacity = String(p * 0.35);
          if (titleRef.current) {
            const inset = Math.max(0, 100 - p * 130);
            titleRef.current.style.clipPath = `inset(${inset}% 0 0 0)`;
          }
          if (leftLineRef.current && rightLineRef.current) {
            const len = 1;
            leftLineRef.current.style.strokeDashoffset = String((1 - p) * len);
            rightLineRef.current.style.strokeDashoffset = String((1 - p) * len);
          }
        },
      });

      // Pulsante lento del glow dopo che è cresciuto
      mm.add("(min-width: 768px)", () => {
        if (!glowRef.current) return;
        gsap.to(glowRef.current, {
          "--pulse": 1,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, root);

    // IntersectionObserver per scintille
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(root);

    return () => {
      ctx.revert();
      io.disconnect();
    };
  }, [reduced]);

  // Particle system scintille
  useEffect(() => {
    if (reduced || !inView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const MAX = isMobile ? 6 : 12;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; vy: number; r: number; life: number; max: number };
    const parts: P[] = [];
    const spawn = (): P => ({
      x: Math.random() * canvas.clientWidth,
      y: canvas.clientHeight + 10,
      vy: -0.3 - Math.random() * 0.7,
      r: 0.8 + Math.random() * 1.4,
      life: 0,
      max: 180 + Math.random() * 120,
    });

    const tick = () => {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      ctx.globalCompositeOperation = "lighter";
      while (parts.length < MAX) parts.push(spawn());
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.y += p.vy;
        p.life++;
        const alpha = Math.max(0, 1 - p.life / p.max) * 0.7;
        ctx.beginPath();
        ctx.fillStyle = `rgba(196,154,74,${alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.life >= p.max || p.y < -20) parts.splice(i, 1);
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
    };
  }, [inView, reduced]);

  return (
    <section
      ref={rootRef}
      aria-label="Prenota — la brace ti chiama"
      className="relative isolate overflow-hidden bg-[color:var(--carbone)]"
      style={{ minHeight: "100vh" }}
    >
      {/* Glow ascendente dal basso */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[80%]"
        style={{
          opacity: reduced ? 0.22 : 0,
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(179,58,26,0.9) 0%, rgba(110,26,20,0.55) 40%, transparent 75%)",
        }}
      />

      {/* Scintille */}
      {!reduced && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        />
      )}

      {/* Filetti oro laterali */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-1/2 z-10 h-[2px] w-full -translate-y-1/2"
        viewBox="0 0 1000 2"
        preserveAspectRatio="none"
      >
        <path
          ref={leftLineRef}
          d="M0 1 L440 1"
          stroke="var(--oro)"
          strokeWidth="1"
          opacity="0.55"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={reduced ? 0 : 1}
        />
        <path
          ref={rightLineRef}
          d="M1000 1 L560 1"
          stroke="var(--oro)"
          strokeWidth="1"
          opacity="0.55"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={reduced ? 0 : 1}
        />
      </svg>

      {/* Marcatore */}
      <div className="pointer-events-none absolute left-6 top-8 z-30 md:left-10 md:top-10">
        <p className="font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--crema)]/40">
          07 — Vieni
        </p>
      </div>

      {/* Contenuto */}
      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-32 text-center">
        <h2
          ref={titleRef}
          className="font-display leading-[0.95] text-[color:var(--crema)]"
          style={{
            fontSize: "clamp(2.6rem, 8vw, 7rem)",
            clipPath: reduced ? "inset(0 0 0 0)" : "inset(100% 0 0 0)",
          }}
        >
          Scegli la carne.{" "}
          <em className="italic text-[color:var(--oro)]">Ti siedi.</em>
          <br />
          Alla brace.
        </h2>

        <p className="mt-8 max-w-xl font-body text-base text-[color:var(--crema)]/70 md:text-lg">
          Mercoledì–Sabato a cena. Domenica e festivi a pranzo.
        </p>

        <div className="mt-12 flex flex-col items-center gap-5 md:flex-row md:gap-6">
          <MagneticButton href={WHATSAPP} primary>
            Prenota un tavolo
          </MagneticButton>
          <MagneticButton href={TEL}>Chiama ora</MagneticButton>
        </div>

        <p className="mt-6 font-eyebrow text-[11px] tracking-[0.3em] text-[color:var(--crema)]/50">
          333 939 5750 · 333 387 0292
        </p>

        <div className="mt-24 flex flex-col items-center gap-3">
          <p className="max-w-md text-sm text-[color:var(--crema)]/60">
            SP237 ex SS377 per Mottola km 6,5 · Zona C 76, 70015 Noci (BA)
          </p>
          <a
            href={MAPS}
            target="_blank"
            rel="noreferrer noopener"
            className="font-eyebrow text-[11px] tracking-[0.3em] text-[color:var(--oro)] transition-opacity hover:opacity-80"
          >
            Apri in mappa →
          </a>
          <p className="font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--crema)]/35">
            40.642° N — 17.042° E
          </p>
        </div>
      </div>

      <style>{`
        .prenota-cta-primary {
          background: linear-gradient(135deg, var(--terracotta) 0%, var(--bordeaux) 100%);
          animation: prenotaPulse 3s ease-in-out infinite;
        }
        @keyframes prenotaPulse {
          0%, 100% { box-shadow: 0 10px 40px -10px rgba(179,58,26,0.55), 0 0 0 0 rgba(179,58,26,0.35); }
          50% { box-shadow: 0 10px 50px -8px rgba(179,58,26,0.85), 0 0 30px 6px rgba(179,58,26,0.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          .prenota-cta-primary { animation: none; }
        }
      `}</style>
    </section>
  );
}
