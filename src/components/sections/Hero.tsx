import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import heroAerialAsset from "@/assets/masseria-aerial.asset.json";

/* ──────────────────────────────────────────────────────────────
 * HERO — La Masseria a vista.
 * Fotografia protagonista, blocco editoriale in basso a sinistra,
 * quattro marker numerati (crema+bordeaux) sulla foto.
 * Zero linee catastali, zero coordinate, zero ornamenti.
 * ───────────────────────────────────────────────────────────── */

type PinId = "caseificio" | "macelleria" | "allevamento" | "braceria";

type Pin = {
  id: PinId;
  number: string;
  label: string;
  caption: string;
  to: "/caseificio" | "/macelleria" | "/allevamento" | "/braceria";
  /** Coord % sul contenitore foto — desktop (cover, centrato) */
  x: number;
  y: number;
  /** Coord % sul contenitore foto — mobile (contain, aspect 720/579) */
  mx?: number;
  my?: number;
};

const PINS: Pin[] = [
  {
    id: "caseificio",
    number: "01",
    label: "Caseificio",
    caption: "Il latte, ogni mattina.",
    to: "/caseificio",
    x: 52,
    y: 43,
    mx: 34,
    my: 34,
  },
  {
    id: "macelleria",
    number: "02",
    label: "Macelleria",
    caption: "La scelta, a vista.",
    to: "/macelleria",
    x: 43,
    y: 61,
    mx: 12,
    my: 48,
  },
  {
    id: "allevamento",
    number: "03",
    label: "Stalla",
    caption: "Da qui nasce la filiera.",
    to: "/allevamento",
    x: 80,
    y: 40,
    mx: 88,
    my: 32,
  },
  {
    id: "braceria",
    number: "04",
    label: "Agriturismo",
    caption: "L’ospitalità della Masseria.",
    to: "/braceria",
    x: 51,
    y: 74,
    mx: 30,
    my: 56,
  },
];



const heroAerial = heroAerialAsset.url;

/* ─────────────────────────── PIN MARKER ─────────────────────────── */

type MarkerProps = {
  pin: Pin;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onActivate: () => void;
  cartoucheSide: "left" | "right";
  cartoucheDir: "up" | "down";
};

function PinMarker({
  pin,
  active,
  onEnter,
  onLeave,
  onFocus,
  onBlur,
  onActivate,
  cartoucheSide,
  cartoucheDir,
}: MarkerProps) {
  return (
    <div className="pointer-events-auto relative -translate-x-1/2 -translate-y-1/2">
      <motion.button
        type="button"
        data-pin
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onActivate}
        aria-label={`${pin.number} · ${pin.label} — ${pin.caption}. Apri la pagina.`}
        whileHover={{ scale: 1.08 }}
        whileFocus={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 340, damping: 22 }}
        className="relative grid h-12 w-12 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--crema)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--carbone)]"
      >
        <span
          aria-hidden
          className="relative grid h-[42px] w-[42px] place-items-center rounded-full font-eyebrow text-[12px] tracking-[0.12em] text-[color:var(--carbone)]"
          style={{
            background: "var(--crema)",
            border: "2px solid rgba(26,18,16,0.85)",
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.42), 0 0 0 5px rgba(242,232,213,0.14)",
          }}
        >
          {pin.number}
          <span
            aria-hidden
            className="absolute -bottom-[3px] left-1/2 h-[7px] w-[7px] -translate-x-1/2 rounded-full"
            style={{
              background: "var(--bordeaux)",
              boxShadow: "0 0 0 2px var(--crema)",
            }}
          />
        </span>
      </motion.button>

      <AnimatePresence>
        {active && (
          <motion.div
            key="cartouche"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={[
              "pointer-events-auto absolute z-50 w-[210px]",
              cartoucheDir === "up" ? "bottom-[54px]" : "top-[54px]",
              cartoucheSide === "right" ? "left-1/2" : "right-1/2",
            ].join(" ")}
            style={{
              transform:
                cartoucheSide === "right"
                  ? "translateX(-16px)"
                  : "translateX(16px)",
            }}
          >
            <a
              href={pin.to}
              onClick={(e) => {
                e.preventDefault();
                onActivate();
              }}
              className="block rounded-xl border border-[color:var(--crema)]/25 px-4 py-3.5 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.7)] transition-transform hover:-translate-y-[1px]"
              style={{
                background: "color-mix(in oklab, var(--carbone) 92%, transparent)",
              }}
            >
              <p
                className="font-eyebrow text-[10px] tracking-[0.28em] text-[color:var(--crema)]/70"
              >
                <span style={{ color: "var(--bordeaux)" }}>{pin.number}</span>
                <span className="mx-1.5 text-[color:var(--crema)]/40">·</span>
                {pin.label.toUpperCase()}
              </p>
              <p className="font-display mt-1.5 text-[16px] italic leading-snug text-[color:var(--crema)]">
                {pin.caption}
              </p>
              <p
                className="font-eyebrow mt-3 text-[10px] tracking-[0.28em]"
                style={{ color: "var(--bordeaux)" }}
              >
                ESPLORA →
              </p>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────── HERO ────────────────────────────── */

export function Hero() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const pinLayerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  const [hoverPin, setHoverPin] = useState<PinId | null>(null);
  const [focusPin, setFocusPin] = useState<PinId | null>(null);
  const [sheetPin, setSheetPin] = useState<PinId | null>(null);
  const [ready, setReady] = useState(false);
  const [touch, setTouch] = useState(false);

  const activePin = hoverPin ?? focusPin;

  useEffect(() => {
    if (typeof window === "undefined") return;
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    setReady(true);
  }, []);

  /* ─── INTRO GSAP: image scale + content stagger + pin stagger ─── */
  useEffect(() => {
    if (!ready || reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (photoRef.current) {
        gsap.set(photoRef.current, { scale: 1.045, transformOrigin: "50% 55%" });
        tl.to(photoRef.current, { scale: 1, duration: 2.0, ease: "power3.out" }, 0);
      }

      const contentBits = contentRef.current?.querySelectorAll<HTMLElement>(
        "[data-intro]",
      );
      if (contentBits && contentBits.length) {
        gsap.set(contentBits, { opacity: 0, y: 18 });
        tl.to(
          contentBits,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.11,
            ease: "power3.out",
          },
          0.35,
        );
      }

      const pins = pinLayerRef.current?.querySelectorAll<HTMLElement>("[data-pin]");
      if (pins && pins.length) {
        gsap.set(pins, { opacity: 0, scale: 0.7, y: 6 });
        tl.to(
          pins,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.1,
            ease: "back.out(1.6)",
          },
          1.05,
        );
      }

      if (cueRef.current) {
        gsap.set(cueRef.current, { opacity: 0 });
        tl.to(cueRef.current, { opacity: 1, duration: 0.5 }, 1.7);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [ready, reduced]);

  /* ─── SCROLL: nasconde l'indicatore SCORRI ─── */
  useEffect(() => {
    if (!ready) return;
    const cue = cueRef.current;
    if (!cue) return;
    const onScroll = () => {
      const y = window.scrollY;
      cue.style.opacity = String(Math.max(0, 1 - y / 220));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready]);

  /* ─── PARALLAX MOUSE (desktop, no-touch) ─── */
  useEffect(() => {
    if (!ready || reduced || touch) return;
    const section = sectionRef.current;
    if (!section) return;

    const xPhoto = gsap.quickTo(photoRef.current, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    const yPhoto = gsap.quickTo(photoRef.current, "y", {
      duration: 0.8,
      ease: "power3.out",
    });
    const xPins = gsap.quickTo(pinLayerRef.current, "x", {
      duration: 0.7,
      ease: "power3.out",
    });
    const yPins = gsap.quickTo(pinLayerRef.current, "y", {
      duration: 0.7,
      ease: "power3.out",
    });

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      xPhoto(cx * -10);
      yPhoto(cy * -10);
      xPins(cx * -4);
      yPins(cy * -4);
    };
    const onLeave = () => {
      xPhoto(0);
      yPhoto(0);
      xPins(0);
      yPins(0);
    };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, [ready, reduced, touch]);

  /* ─── MOBILE: 1° tap apre sheet, 2° tap naviga ─── */
  const onPinActivate = useCallback(
    (pin: Pin) => {
      if (touch) {
        if (sheetPin === pin.id) {
          navigate({ to: pin.to });
        } else {
          setSheetPin(pin.id);
        }
        return;
      }
      navigate({ to: pin.to });
    },
    [navigate, sheetPin, touch],
  );

  const activeSheet = sheetPin ? PINS.find((p) => p.id === sheetPin) ?? null : null;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden bg-[color:var(--carbone)]"
      aria-label="Masseria Don Gianvito — veduta aerea"
    >
      {/* L0 — Fotografia (protagonista) */}
      <div
        ref={photoRef}
        className="absolute inset-0 -m-[3%] will-change-transform"
      >
        <img
          src={heroAerial}
          alt="Veduta aerea di Masseria Don Gianvito nelle campagne di Noci"
          width={1920}
          height={1544}
          className="h-full w-full object-cover"
          style={{ objectPosition: "50% 55%" }}
          draggable={false}
          fetchPriority="high"
        />
      </div>

      {/* L1 — Overlay cinematografico (top + bottom-left) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg,
              rgba(16,11,9,0.52) 0%,
              rgba(16,11,9,0.08) 30%,
              rgba(16,11,9,0.04) 55%,
              rgba(16,11,9,0.68) 100%),
            linear-gradient(90deg,
              rgba(16,11,9,0.58) 0%,
              rgba(16,11,9,0.12) 48%,
              transparent 72%)
          `,
        }}
      />

      {/* L2 — Pin layer */}
      <div
        ref={pinLayerRef}
        className="pointer-events-none absolute inset-0 z-30"
      >
        {PINS.map((p) => {
          // Cartouche side: se il pin è a sinistra del centro, apri a destra.
          const cartoucheSide: "left" | "right" = p.x < 55 ? "right" : "left";
          // Cartouche direction: pin bassi → cartiglio verso l'alto,
          // pin alti → verso il basso.
          const cartoucheDir: "up" | "down" = p.y > 55 ? "up" : "down";
          const isActive = activePin === p.id;
          const isDimmed = !!activePin && !isActive;
          return (
            <div
              key={p.id}
              className="absolute"
              style={{
                top: `${p.y}%`,
                left: `${p.x}%`,
                opacity: isDimmed ? 0.55 : 1,
                transition: "opacity .28s",
              }}
            >
              <PinMarker
                pin={p}
                active={isActive}
                onEnter={() => setHoverPin(p.id)}
                onLeave={() => setHoverPin(null)}
                onFocus={() => setFocusPin(p.id)}
                onBlur={() => setFocusPin(null)}
                onActivate={() => onPinActivate(p)}
                cartoucheSide={cartoucheSide}
                cartoucheDir={cartoucheDir}
              />
            </div>
          );
        })}
      </div>

      {/* L3 — Blocco editoriale (desktop: bottom-left · mobile: bottom-center) */}
      <div
        ref={contentRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-6 pb-[calc(env(safe-area-inset-bottom,0px)+28px)] md:inset-x-auto md:bottom-[clamp(48px,9vh,112px)] md:left-[clamp(24px,6vw,96px)] md:px-0 md:pb-0"
      >
        <div className="mx-auto max-w-[600px] text-center md:mx-0 md:text-left">
          <p
            data-intro
            className="font-eyebrow text-[10px] text-[color:var(--crema)]/75 md:text-[11px]"
            style={{ letterSpacing: "0.32em" }}
          >
            MASSERIA DON GIANVITO · NOCI
          </p>

          <h1
            data-intro
            className="font-display mt-3 text-[color:var(--crema)] md:mt-5"
            style={{
              fontSize: "clamp(2.6rem, 7vw, 7.5rem)",
              lineHeight: 0.94,
              letterSpacing: "-0.02em",
              fontWeight: 300,
            }}
          >
            Dalla&nbsp;terra
            <br />
            <em className="italic">alla&nbsp;tavola.</em>
          </h1>

          <p
            data-intro
            className="mx-auto mt-5 max-w-[440px] font-sans text-[15px] leading-relaxed text-[color:var(--crema)]/82 md:mx-0 md:mt-6 md:max-w-[480px] md:text-[17px]"
          >
            <span className="hidden md:inline">
              Allevamento, caseificio, macelleria e cucina:
              <br />
              una filiera che comincia qui.
            </span>
            <span className="md:hidden">
              Una filiera che comincia qui, nelle campagne di Noci.
            </span>
          </p>

          <div
            data-intro
            className="pointer-events-auto mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:mt-8"
          >
            <a
              href="tel:+393339395750"
              className="font-eyebrow inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[11px] tracking-[0.24em] text-[color:var(--crema)] shadow-[0_14px_36px_-14px_rgba(0,0,0,0.7)] transition-transform hover:-translate-y-[1px]"
              style={{ background: "var(--bordeaux)" }}
            >
              <span className="hidden md:inline">PRENOTA UN TAVOLO</span>
              <span className="md:hidden">ENTRA NELLA MASSERIA</span>
            </a>
            <button
              type="button"
              onClick={() => {
                const next = sectionRef.current
                  ?.nextElementSibling as HTMLElement | null;
                next?.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-eyebrow hidden items-center justify-center rounded-full border border-[color:var(--crema)]/50 px-7 py-3.5 text-[11px] tracking-[0.24em] text-[color:var(--crema)] transition-colors hover:bg-[color:var(--crema)]/10 md:inline-flex"
            >
              SCOPRI LA MASSERIA
            </button>
          </div>
        </div>
      </div>

      {/* L4 — Indicatore SCORRI (desktop) */}
      <div
        ref={cueRef}
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-[color:var(--crema)]/70 md:flex"
      >
        <span className="font-eyebrow text-[9px] tracking-[0.32em]">SCORRI</span>
        <motion.span
          aria-hidden
          className="block h-8 w-px"
          style={{
            transformOrigin: "top",
            background:
              "linear-gradient(180deg, var(--crema), transparent)",
          }}
          animate={reduced ? undefined : { scaleY: [0.3, 1, 0.3], opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* L5 — MOBILE bottom-sheet compatta */}
      <AnimatePresence>
        {activeSheet && (
          <>
            <motion.div
              key="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSheetPin(null)}
              className="absolute inset-0 z-[45] bg-[color:var(--carbone)]/55 md:hidden"
            />
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-x-3 bottom-3 z-[46] rounded-2xl border border-[color:var(--crema)]/25 p-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] md:hidden"
              style={{
                background:
                  "color-mix(in oklab, var(--carbone) 94%, transparent)",
                boxShadow: "0 22px 60px -20px rgba(0,0,0,0.8)",
              }}
              role="dialog"
              aria-label={`${activeSheet.label} — dettagli`}
            >
              <p
                className="font-eyebrow text-[10px] tracking-[0.28em] text-[color:var(--crema)]/70"
              >
                <span style={{ color: "var(--bordeaux)" }}>
                  {activeSheet.number}
                </span>
                <span className="mx-1.5 text-[color:var(--crema)]/40">·</span>
                {activeSheet.label.toUpperCase()}
              </p>
              <p className="font-display mt-2 text-[20px] italic leading-snug text-[color:var(--crema)]">
                {activeSheet.caption}
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const to = activeSheet.to;
                    setSheetPin(null);
                    navigate({ to });
                  }}
                  className="font-eyebrow inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-[11px] tracking-[0.24em] text-[color:var(--crema)]"
                  style={{ background: "var(--bordeaux)" }}
                >
                  ESPLORA →
                </button>
                <button
                  type="button"
                  onClick={() => setSheetPin(null)}
                  className="font-eyebrow inline-flex items-center justify-center rounded-full border border-[color:var(--crema)]/40 px-4 py-3 text-[11px] tracking-[0.24em] text-[color:var(--crema)]"
                  aria-label="Chiudi scheda"
                >
                  CHIUDI
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Hero;
