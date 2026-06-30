import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PinMarker, type Pin } from "@/components/site/PinMarker";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import heroAerialAsset from "@/assets/masseria-aerial.asset.json";

const heroAerial = heroAerialAsset.url;

/**
 * Pin posizionati in percentuale sull'immagine aerea reale della masseria.
 * Coordinate facili da ricalibrare (top/left in %).
 */
const PINS: Pin[] = [
  {
    id: "braceria",
    label: "Braceria",
    caption: "La brace, ogni sera.",
    to: "/braceria",
    top: 8,
    left: 58,
  },
  {
    id: "caseificio",
    label: "Caseificio",
    caption: "Il latte di ogni mattina.",
    to: "/caseificio",
    top: 20,
    left: 46,
  },
  {
    id: "macelleria",
    label: "Macelleria",
    caption: "La carne, a vista.",
    to: "/macelleria",
    top: 26,
    left: 80,
  },
  {
    id: "allevamento",
    label: "Allevamento",
    caption: "Dove tutto comincia.",
    to: "/allevamento",
    top: 62,
    left: 32,
  },
];

export function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [pinActive, setPinActive] = useState(false);

  // Mouse parallax (drone drift) — Framer Motion springs
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const springY = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });
  const imgX = useTransform(springX, (v) => `${v * -2}%`);
  const imgY = useTransform(springY, (v) => `${v * -2}%`);

  // Mousemove (desktop only)
  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = sectionRef.current;
    if (!el) return;

    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      mx.set(cx * 2);
      my.set(cy * 2);
    };
    el.addEventListener("mousemove", handler);
    return () => el.removeEventListener("mousemove", handler);
  }, [mx, my, reduced]);

  // Scroll-driven ken-burns + parallax fade-out
  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    const img = imgRef.current;
    const section = sectionRef.current;
    if (!img || !section) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { scale: 1.05, yPercent: 0 },
        {
          scale: 1.18,
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen min-h-[640px] w-full overflow-hidden"
      aria-label="Mappa aerea della Masseria Don Gianvito"
    >
      {/* Aerial image */}
      <motion.div
        className="absolute inset-0 -m-[4%]"
        style={reduced ? undefined : { x: imgX, y: imgY }}
      >
        <img
          ref={imgRef}
          src={heroAerial}
          alt="Vista aerea della Masseria Don Gianvito: masseria, oliveti, pascoli e campi nella Murgia"
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
          draggable={false}
          fetchPriority="high"
        />
      </motion.div>

      {/* Warm vignette + edge night gradient (does NOT cover image center) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 75% at 50% 55%, transparent 0%, rgba(26,18,16,0.55) 75%, rgba(26,18,16,0.85) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(26,18,16,0.85) 0%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72"
        style={{
          background:
            "linear-gradient(0deg, var(--carbone) 0%, rgba(26,18,16,0.6) 40%, transparent 100%)",
        }}
      />

      {/* PINS */}
      <div className="absolute inset-0 hidden md:block">
        {PINS.map((p, i) => (
          <PinMarker
            key={p.id}
            pin={p}
            index={i}
            onActiveChange={setPinActive}
          />
        ))}
      </div>

      {/* TEXT / UI */}
      <motion.div
        className="relative z-10 flex h-full flex-col justify-between px-6 pt-28 pb-10 md:pt-32 lg:px-12"
        animate={{ opacity: pinActive ? 0.45 : 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Top eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-eyebrow text-[10px] text-[color:var(--oro)] md:text-xs"
        >
          Qui non arriva niente da fuori
        </motion.p>

        {/* Headline block — bottom left */}
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-balance text-[clamp(2.25rem,6.2vw,5.5rem)] leading-[0.98] text-[color:var(--crema)]"
          >
            La carne che mangi stasera,
            <br />
            l’abbiamo{" "}
            <span className="italic text-[color:var(--terracotta)]">cresciuta</span>{" "}
            noi.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.9 }}
            className="mt-6 max-w-xl text-sm leading-relaxed text-[color:var(--crema)]/80 md:text-base"
          >
            Sorvola Masseria Don Gianvito: ogni punto che vedi è un mestiere
            che facciamo con le nostre mani. Dalla stalla alla brace, non
            passiamo mai la mano a nessuno.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="tel:+393339395750"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-grad-brace font-eyebrow inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[11px] text-[color:var(--crema)] shadow-[0_14px_36px_-10px_rgba(179,58,26,0.65)] ring-1 ring-white/10"
            >
              Prenota un tavolo
            </motion.a>
            <motion.a
              href="/braceria"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="font-eyebrow inline-flex items-center justify-center rounded-full border border-[color:var(--oro)]/55 px-7 py-3.5 text-[11px] text-[color:var(--crema)] transition-colors hover:bg-[color:var(--oro)]/10"
            >
              Entra nella masseria
            </motion.a>
          </motion.div>

          {/* Mobile chips (only when pins are too dense) */}
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.8 }}
            className="mt-8 flex flex-wrap gap-2 md:hidden"
            aria-label="Tappe della filiera"
          >
            {PINS.map((p) => (
              <li key={p.id}>
                <Link
                  to={p.to}
                  className="font-eyebrow inline-flex items-center gap-1.5 rounded-full border border-[color:var(--oro)]/40 bg-[color:var(--carbone)]/60 px-3.5 py-2 text-[10px] text-[color:var(--crema)] backdrop-blur-sm"
                >
                  <span
                    aria-hidden
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: "var(--grad-brace)" }}
                  />
                  {p.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-[color:var(--crema)]/70"
      >
        <span className="font-eyebrow text-[9px]">Sorvola</span>
        <motion.span
          aria-hidden
          className="block h-8 w-px"
          style={{
            transformOrigin: "top",
            background: "linear-gradient(180deg, var(--oro), transparent)",
          }}
          animate={reduced ? undefined : { scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
