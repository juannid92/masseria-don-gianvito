import { useEffect, useRef, useState, useCallback, useId } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import heroAerialAsset from "@/assets/masseria-aerial.asset.json";
import pinAllevamentoImg from "@/assets/pin-allevamento.jpg";
import pinCaseificioImg from "@/assets/pin-caseificio.jpg";
import pinMacelleriaImg from "@/assets/pin-macelleria.jpg";
import pinBraceriaImg from "@/assets/pin-braceria.jpg";

/* ─────────────────────────────────────────────────────────────
 * HERO — "IL SORVOLO"
 * Mappa catastale vivente · drone cinematografico sulla masseria
 * ──────────────────────────────────────────────────────────── */

type PinId = "allevamento" | "caseificio" | "macelleria" | "braceria";

type Pin = {
  id: PinId;
  label: string;
  caption: string;
  description: string;
  thumb: string;
  coords: string;
  to: "/allevamento" | "/caseificio" | "/macelleria" | "/braceria";
  top: number;
  left: number;
};

const PINS: Pin[] = [
  {
    id: "allevamento",
    label: "Allevamento",
    caption: "Dove tutto comincia.",
    description: "Dove tutto comincia: i nostri capi, nella nostra terra.",
    thumb: pinAllevamentoImg,
    coords: "40°47'21\"N · 17°07'48\"E",
    to: "/allevamento",
    top: 58,
    left: 16,
  },
  {
    id: "caseificio",
    label: "Caseificio",
    caption: "Il latte di ogni mattina.",
    description: "Il latte di ogni mattina, trasformato in formaggio.",
    thumb: pinCaseificioImg,
    coords: "40°47'19\"N · 17°07'52\"E",
    to: "/caseificio",
    top: 22,
    left: 40,
  },
  {
    id: "macelleria",
    label: "Macelleria",
    caption: "La carne, a vista.",
    description: "La carne, a vista: scegli il tuo taglio.",
    thumb: pinMacelleriaImg,
    coords: "40°47'17\"N · 17°07'55\"E",
    to: "/macelleria",
    top: 30,
    left: 82,
  },
  {
    id: "braceria",
    label: "Ristorante / Braceria",
    caption: "La brace, ogni sera.",
    description: "La brace accesa ogni sera, servita al tavolo.",
    thumb: pinBraceriaImg,
    coords: "40°47'15\"N · 17°07'50\"E",
    to: "/braceria",
    top: 12,
    left: 64,
  },
];

const heroAerial = heroAerialAsset.url;

/* Catastal SVG — linee di confine sottili in oro */
function CatastalOverlay() {
  return (
    <svg
      data-catastal
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
      style={{ mixBlendMode: "overlay", opacity: 0.55 }}
    >
      <g
        fill="none"
        stroke="#c49a4a"
        strokeWidth="0.15"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      >
        <path data-catastal-path d="M2,18 Q22,14 38,22 T70,28 T98,22" />
        <path data-catastal-path d="M4,42 Q28,38 50,46 T82,52 L98,50" />
        <path data-catastal-path d="M0,66 Q24,60 46,68 T78,74 L100,70" />
        <path data-catastal-path d="M14,2 Q18,30 22,58 T28,98" />
        <path data-catastal-path d="M52,0 Q56,28 50,54 T58,100" />
        <path data-catastal-path d="M82,4 Q86,32 80,60 T86,100" />
        <path data-catastal-path strokeDasharray="0.6 0.9" d="M6,30 L94,34" />
        <path data-catastal-path strokeDasharray="0.6 0.9" d="M10,78 L90,82" />
        <path data-catastal-path strokeDasharray="0.3 0.6" d="M30,6 L34,94" />
        <path data-catastal-path strokeDasharray="0.3 0.6" d="M68,4 L72,96" />
      </g>
      {/* micro-annotazioni angolari */}
      <g
        fill="#c49a4a"
        fontSize="1.1"
        fontFamily="ui-monospace, monospace"
        opacity="0.55"
      >
        <text x="2.5" y="3.5">N 40°47'</text>
        <text x="86" y="3.5">SETT. IV</text>
        <text x="2.5" y="98.5">FOGLIO 12</text>
        <text x="80" y="98.5">PART. 437</text>
      </g>
    </svg>
  );
}

/* Grana cinematografica via SVG turbulence */
function FilmGrain() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
      style={{ mixBlendMode: "overlay", opacity: 0.08 }}
    >
      <filter id={`grain-${id}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${id})`} />
    </svg>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

export function Hero() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const catastalRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const pinLayerRef = useRef<HTMLDivElement>(null);
  const letterTopRef = useRef<HTMLDivElement>(null);
  const letterBotRef = useRef<HTMLDivElement>(null);
  const viewfinderRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const [activePin, setActivePin] = useState<PinId | null>(null);
  const [hoverPin, setHoverPin] = useState<PinId | null>(null);
  const [diving, setDiving] = useState<PinId | null>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  /* ─── INTRO TIMELINE + AMBIENT LOOP + SCROLL OUTRO ─── */
  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger, Flip);

    const ctx = gsap.context(() => {
      // Stato iniziale
      gsap.set([letterTopRef.current, letterBotRef.current], { height: "12vh" });
      gsap.set(photoRef.current, {
        scale: 1.18,
        rotate: -1.5,
        filter: "blur(6px) brightness(0.7)",
        transformOrigin: "50% 55%",
      });
      gsap.set("[data-catastal-path]", {
        strokeDasharray: 200,
        strokeDashoffset: 200,
      });
      gsap.set("[data-copy-line]", {
        clipPath: "inset(100% 0 0 0)",
        y: 24,
        opacity: 0,
      });
      gsap.set("[data-eyebrow]", { opacity: 0, letterSpacing: "0.12em" });
      gsap.set("[data-copy-accent]", {
        opacity: 0,
        y: 24,
        textShadow: "0 0 0px rgba(179,58,26,0)",
      });
      gsap.set("[data-cta]", { opacity: 0, y: 16 });
      gsap.set("[data-pin]", { scale: 0, opacity: 0 });
      gsap.set("[data-cue]", { opacity: 0 });
      gsap.set(viewfinderRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to([letterTopRef.current, letterBotRef.current], {
        height: 0,
        duration: 1.0,
        ease: "power3.inOut",
      })
        .to(
          photoRef.current,
          {
            scale: 1.12,
            rotate: 0,
            filter: "blur(0px) brightness(1)",
            duration: 1.6,
            ease: "expo.out",
          },
          0.2,
        )
        .to(
          "[data-catastal-path]",
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.out",
            stagger: 0.06,
          },
          0.6,
        )
        .to(
          "[data-copy-line]",
          {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.12,
          },
          1.0,
        )
        .to(
          "[data-eyebrow]",
          {
            opacity: 1,
            letterSpacing: "0.22em",
            duration: 0.8,
            ease: "power3.out",
          },
          0.9,
        )
        .to(
          "[data-copy-accent]",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power4.out",
            stagger: 0.08,
          },
          1.08,
        )
        .to(
          "[data-copy-accent]",
          {
            textShadow:
              "0 0 22px rgba(179,58,26,0.65), 0 0 44px rgba(196,154,74,0.35)",
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.08,
          },
          1.15,
        )
        .to(
          "[data-copy-accent]",
          {
            textShadow: "0 0 0px rgba(179,58,26,0)",
            duration: 1.1,
            ease: "power2.inOut",
            stagger: 0.08,
          },
          1.7,
        )
        .to(
          "[data-cta]",
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          1.6,
        )
        .to(
          "[data-pin]",
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(2)",
            stagger: 0.14,
          },
          1.4,
        )
        .to([viewfinderRef.current, "[data-cue]"], {
          opacity: 1,
          duration: 0.6,
        }, 2.2);

      // Skip / accelera se l'utente scrolla
      const onScroll = () => {
        if (tl.progress() < 1) tl.timeScale(2.4);
      };
      window.addEventListener("scroll", onScroll, { passive: true, once: true });

      // Ambient drone-hover (loop continuo)
      gsap.to(stageRef.current, {
        y: 4,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to(photoRef.current, {
        scale: 1.16,
        duration: 20,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Pin respiro (sfasati)
      gsap.utils.toArray<HTMLElement>("[data-pin-core]").forEach((el, i) => {
        gsap.to(el, {
          scale: 1.06,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.4,
        });
      });

      // Outro su scroll: continuità con sezioni sotto
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap.timeline().to(stageRef.current, {
          scale: 1.05,
          yPercent: -6,
          ease: "none",
        }),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced]);

  /* ─── MOUSE PARALLAX MULTILIVELLO + VIEWFINDER ─── */
  useEffect(() => {
    if (reduced || touch || typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    const xPhoto = gsap.quickTo(photoRef.current, "x", { duration: 0.8, ease: "power3.out" });
    const yPhoto = gsap.quickTo(photoRef.current, "y", { duration: 0.8, ease: "power3.out" });
    const xCat = gsap.quickTo(catastalRef.current, "x", { duration: 0.7, ease: "power3.out" });
    const yCat = gsap.quickTo(catastalRef.current, "y", { duration: 0.7, ease: "power3.out" });
    const xCopy = gsap.quickTo(copyRef.current, "x", { duration: 0.6, ease: "power3.out" });
    const yCopy = gsap.quickTo(copyRef.current, "y", { duration: 0.6, ease: "power3.out" });
    const xPins = gsap.quickTo(pinLayerRef.current, "x", { duration: 0.7, ease: "power3.out" });
    const yPins = gsap.quickTo(pinLayerRef.current, "y", { duration: 0.7, ease: "power3.out" });

    const xVF = gsap.quickTo(viewfinderRef.current, "x", { duration: 0.35, ease: "power3.out" });
    const yVF = gsap.quickTo(viewfinderRef.current, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      xPhoto(cx * -8);
      yPhoto(cy * -8);
      xCat(cx * -14);
      yCat(cy * -14);
      xPins(cx * -18);
      yPins(cy * -18);
      xCopy(cx * -22);
      yCopy(cy * -22);

      xVF(e.clientX - r.left);
      yVF(e.clientY - r.top);
    };

    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, [reduced, touch]);

  /* ─── HOVER: SPOTLIGHT + DESATURAZIONE ─── */
  useEffect(() => {
    if (reduced) return;
    const target = hoverPin ?? activePin;
    const stage = stageRef.current;
    const spot = spotlightRef.current;
    if (!stage || !spot) return;

    if (target) {
      const pin = PINS.find((p) => p.id === target)!;
      gsap.to(stage, {
        filter: "brightness(0.6) saturate(0.7)",
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(spot, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        "--sx": `${pin.left}%`,
        "--sy": `${pin.top}%`,
      } as gsap.TweenVars);
    } else {
      gsap.to(stage, {
        filter: "brightness(1) saturate(1)",
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(spot, { opacity: 0, duration: 0.5, ease: "power2.out" });
    }
  }, [hoverPin, activePin, reduced]);

  /* ─── CLICK: TUFFO NEL LUOGO ─── */
  const dive = useCallback(
    (pin: Pin) => {
      if (reduced) {
        navigate({ to: pin.to });
        return;
      }
      if (diving) return;
      setDiving(pin.id);
      const spot = spotlightRef.current;
      const stage = stageRef.current;
      const tl = gsap.timeline({
        onComplete: () => navigate({ to: pin.to }),
      });
      if (spot) {
        gsap.set(spot, { "--sx": `${pin.left}%`, "--sy": `${pin.top}%` } as gsap.TweenVars);
        tl.to(
          spot,
          {
            opacity: 1,
            "--sr": "160%",
            duration: 0.8,
            ease: "power3.inOut",
          } as gsap.TweenVars,
          0,
        );
      }
      if (stage) {
        tl.to(
          stage,
          {
            scale: 1.5,
            transformOrigin: `${pin.left}% ${pin.top}%`,
            duration: 0.8,
            ease: "power3.inOut",
            filter: "brightness(1) saturate(1)",
          },
          0,
        );
      }
      tl.to(
        [copyRef.current, pinLayerRef.current, viewfinderRef.current],
        { opacity: 0, duration: 0.5, ease: "power2.out" },
        0,
      );
    },
    [diving, navigate, reduced],
  );

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[color:var(--carbone)]"
      style={{
        perspective: "1200px",
        cursor: !reduced && !touch ? "none" : "default",
      }}
      aria-label="Sorvolo cinematografico della Masseria Don Gianvito"
    >
      {/* STAGE: tutto ciò che riceve il desat/zoom su hover/click */}
      <div ref={stageRef} className="absolute inset-0">
        {/* L0 — Foto aerea */}
        <div ref={photoRef} className="absolute inset-0 -m-[6%]">
          <img
            src={heroAerial}
            alt="Vista aerea all'alba della Masseria Don Gianvito a Noci, con masseria, oliveti, pascoli e stalle"
            width={1920}
            height={1280}
            className="h-full w-full object-cover"
            draggable={false}
            fetchPriority="high"
          />
        </div>

        {/* L1 — Color grade caldo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 70% at 50% 62%, rgba(179,58,26,0.18) 0%, transparent 60%)",
            mixBlendMode: "soft-light",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 35%, rgba(26,18,16,0.55) 80%, rgba(26,18,16,0.85) 100%)",
          }}
        />

        {/* L2 — Grana */}
        <FilmGrain />

        {/* L3 — Mappa catastale */}
        <div ref={catastalRef} className="absolute inset-0">
          <CatastalOverlay />
        </div>

        {/* L4 — Spotlight (mascherato da CSS vars) */}
        <div
          ref={spotlightRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0"
          style={
            {
              ["--sx" as string]: "50%",
              ["--sy" as string]: "50%",
              ["--sr" as string]: "22vw",
              background:
                "radial-gradient(circle var(--sr) at var(--sx) var(--sy), rgba(255,205,140,0.18) 0%, rgba(255,180,90,0.06) 30%, transparent 60%)",
              mixBlendMode: "screen",
            } as React.CSSProperties
          }
        />
      </div>

      {/* Bordo notte basso per legibilità */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-80"
        style={{
          background:
            "linear-gradient(0deg, var(--carbone) 0%, rgba(26,18,16,0.55) 45%, transparent 100%)",
        }}
      />

      {/* L5 — PIN LAYER (desktop) */}
      <div
        ref={pinLayerRef}
        className="absolute inset-0 z-20 hidden md:block"
      >
        {PINS.map((p) => {
          const isActive = (hoverPin ?? activePin) === p.id;
          const isOtherActive = (hoverPin ?? activePin) && !isActive;
          const flipRight = p.left < 38;
          return (
            <div
              key={p.id}
              data-pin
              className="absolute"
              style={{ top: `${p.top}%`, left: `${p.left}%` }}
            >
              <div
                className="pointer-events-auto relative -translate-x-1/2 -translate-y-1/2"
                style={{ opacity: isOtherActive ? 0.35 : 1, transition: "opacity .35s" }}
              >
                <motion.button
                  type="button"
                  onMouseEnter={() => setHoverPin(p.id)}
                  onMouseLeave={() => setHoverPin(null)}
                  onFocus={() => setActivePin(p.id)}
                  onBlur={() => setActivePin(null)}
                  onClick={() => dive(p)}
                  aria-label={`Apri la pagina ${p.label} — ${p.caption}`}
                  whileHover={{ scale: 1.25 }}
                  whileFocus={{ scale: 1.25 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  className="group relative block h-7 w-7 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--oro)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--carbone)]"
                >
                  {/* glow brace */}
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(196,154,74,0.55) 0%, rgba(179,58,26,0.35) 35%, transparent 70%)",
                      filter: "blur(2px)",
                    }}
                  />
                  {/* sigillo */}
                  <span
                    data-pin-core
                    aria-hidden
                    className="relative block h-7 w-7 rounded-full border-[1.5px] border-[color:var(--oro)] shadow-[0_8px_24px_-4px_rgba(179,58,26,0.7),inset_0_0_8px_rgba(0,0,0,0.4)]"
                    style={{ background: "var(--grad-ember)" }}
                  >
                    <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--crema)]/95 shadow-[0_0_6px_rgba(242,232,213,0.9)]" />
                  </span>
                </motion.button>

                {/* Leader line + Label */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={[
                        "pointer-events-none absolute top-1/2 z-30 w-[280px] -translate-y-1/2",
                        flipRight ? "left-6" : "right-6",
                      ].join(" ")}
                    >
                      <motion.span
                        aria-hidden
                        className={[
                          "absolute top-1/2 h-px",
                          flipRight ? "right-full" : "left-full",
                        ].join(" ")}
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, var(--oro))",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: 56 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <motion.div
                        initial={{ clipPath: "inset(0 100% 0 0)", x: flipRight ? -8 : 8 }}
                        animate={{ clipPath: "inset(0 0% 0 0)", x: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className={flipRight ? "text-left" : "text-right"}
                      >
                        <p className="font-eyebrow text-[10px] tracking-[0.18em] text-[color:var(--oro)]">
                          {p.label}
                        </p>
                        <p className="font-display mt-1 text-lg italic leading-snug text-[color:var(--crema)]">
                          {p.caption}
                        </p>
                        <p className="mt-1.5 font-mono text-[10px] text-[color:var(--crema)]/55">
                          {p.coords}
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* L6 — COPY */}
      <div
        ref={copyRef}
        className="relative z-30 flex h-full flex-col justify-between px-6 pt-28 pb-28 md:pt-32 lg:px-14"
        style={{
          opacity: (hoverPin ?? activePin) ? 0.25 : 1,
          transition: "opacity .35s",
        }}
      >
        <div data-copy-line className="max-w-fit">
          <p
            data-eyebrow
            className="font-eyebrow text-[10px] text-[color:var(--oro)] md:text-xs"
            style={{ letterSpacing: "0.22em" }}
          >
            IL RITO DELLA BRACE
          </p>
        </div>

        <div className="relative max-w-3xl">
          {/* velo locale --grad-night per leggibilità AA, solo sotto al blocco testo */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 90% 85% at 18% 55%, rgba(26,18,16,0.82) 0%, rgba(61,42,30,0.45) 55%, transparent 88%)",
            }}
          />
          <h1
            className="font-display text-balance leading-[0.95] text-[color:var(--crema)]"
            style={{ fontSize: "clamp(2.6rem, 7vw, 6.2rem)" }}
          >
            <span data-copy-line className="block overflow-hidden">
              Senti la{" "}
              <span
                data-copy-accent
                className="relative italic text-[color:var(--terracotta)]"
              >
                brace
              </span>
            </span>
            <span data-copy-line className="block overflow-hidden">
              prima ancora di{" "}
              <span
                data-copy-accent
                className="relative italic text-[color:var(--terracotta)]"
              >
                arrivare
              </span>
              .
            </span>
          </h1>
          <div data-copy-line className="overflow-hidden">
            <p className="mt-6 max-w-[48ch] text-sm leading-relaxed text-[color:var(--crema)]/85 md:text-base">
              Una masseria dove la carne nasce, cresce e finisce sul fuoco.
              Siediti dove tutto ha inizio.
            </p>
          </div>

          <div data-cta className="mt-7">
            <p className="font-sans text-[13px] text-[color:var(--oro)]/70">
              Noci, Puglia — dalla stalla alla brace
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <MagneticCTA data-cta as="a" href="tel:+393339395750" primary>
              Prenota un tavolo
            </MagneticCTA>
            <MagneticCTA
              data-cta
              as="button"
              onClick={() => {
                const next = sectionRef.current?.nextElementSibling as HTMLElement | null;
                next?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Entra nella masseria
            </MagneticCTA>
          </div>
        </div>
      </div>

      {/* L7 — LETTERBOX */}
      <div
        ref={letterTopRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-40 bg-[color:var(--carbone)]"
      />
      <div
        ref={letterBotRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 bg-[color:var(--carbone)]"
      />

      {/* VIEWFINDER cursor */}
      {!reduced && !touch && (
        <div
          ref={viewfinderRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-50 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative h-10 w-10">
            {/* angoli ad L */}
            <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-[color:var(--oro)]" />
            <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-[color:var(--oro)]" />
            <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-[color:var(--oro)]" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-[color:var(--oro)]" />
            {/* crosshair */}
            <span className="absolute left-1/2 top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-[color:var(--oro)]/70" />
            <span className="absolute left-1/2 top-1/2 h-px w-2 -translate-x-1/2 -translate-y-1/2 bg-[color:var(--oro)]/70" />
          </div>
          <AnimatePresence>
            {hoverPin && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-eyebrow absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[0.25em] text-[color:var(--oro)]"
              >
                APRI →
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Scroll cue */}
      <div
        data-cue
        aria-hidden
        className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-[color:var(--crema)]/70"
      >
        <span className="font-eyebrow text-[9px] tracking-[0.3em]">SORVOLA</span>
        <motion.span
          aria-hidden
          className="block h-8 w-px"
          style={{
            transformOrigin: "top",
            background: "linear-gradient(180deg, var(--oro), transparent)",
          }}
          animate={reduced ? undefined : { scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* MOBILE FILMSTRIP */}
      <div className="absolute inset-x-0 bottom-0 z-30 px-4 pb-6 md:hidden">
        <ul
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
          aria-label="Mestieri della masseria"
        >
          {PINS.map((p) => (
            <li key={p.id} className="snap-start shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActivePin(p.id);
                  setTimeout(() => dive(p), 180);
                }}
                className="flex w-[68vw] max-w-[280px] flex-col gap-1 rounded-2xl border border-[color:var(--oro)]/30 bg-[color:var(--carbone)]/75 px-4 py-3 text-left backdrop-blur-md"
              >
                <span className="font-eyebrow text-[10px] tracking-[0.22em] text-[color:var(--oro)]">
                  {p.label}
                </span>
                <span className="font-display text-base italic text-[color:var(--crema)]">
                  {p.caption}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* DIVE OVERLAY — durante la transizione, blocca interazioni */}
      {diving && (
        <div className="pointer-events-auto absolute inset-0 z-[60]" aria-hidden />
      )}
    </section>
  );
}

/* ─────────────────────── MAGNETIC CTA ─────────────────────── */

type CTABase = {
  primary?: boolean;
  children: React.ReactNode;
};
type CTAProps =
  | (CTABase & React.ButtonHTMLAttributes<HTMLButtonElement> & { as: "button" })
  | (CTABase & React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" });

function MagneticCTA(props: CTAProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const xT = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yT = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xT((e.clientX - (r.left + r.width / 2)) * 0.25);
      yT((e.clientY - (r.top + r.height / 2)) * 0.25);
    };
    const onLeave = () => {
      xT(0);
      yT(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  const cls = props.primary
    ? "bg-grad-brace inline-flex items-center justify-center rounded-full px-7 py-3.5 font-eyebrow text-[11px] tracking-[0.22em] text-[color:var(--crema)] shadow-[0_14px_36px_-10px_rgba(179,58,26,0.65)] ring-1 ring-white/10 will-change-transform"
    : "inline-flex items-center justify-center rounded-full border border-[color:var(--oro)]/55 px-7 py-3.5 font-eyebrow text-[11px] tracking-[0.22em] text-[color:var(--crema)] transition-colors hover:bg-[color:var(--oro)]/10 will-change-transform";

  if (props.as === "a") {
    const { as: _as, primary: _p, children, ...rest } = props;
    return (
      <a
        ref={(el) => {
          ref.current = el;
        }}
        className={cls}
        {...rest}
      >
        {children}
      </a>
    );
  }
  const { as: _as, primary: _p, children, ...rest } = props;
  return (
    <button
      ref={(el) => {
        ref.current = el;
      }}
      className={cls}
      {...rest}
    >
      {children}
    </button>
  );
}
