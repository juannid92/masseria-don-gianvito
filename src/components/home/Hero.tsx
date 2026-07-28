import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import aerial from "@/assets/masseria-aerial.asset.json";
import { MASSERIA } from "@/data/masseria";
import { PIN_ANIME, type PinAnima, type PinCoord } from "@/data/pin-anime";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * HERO HOME — "La Masseria vista dall'alto".
 * Quattro TARGHE editoriali permanenti, sempre leggibili, ancorate ai luoghi
 * reali della fotografia aerea. Nessun puntino, nessuna etichetta da hover.
 */

type Tier = "desktop" | "tablet" | "mobile" | "short";

/** Fascia di viewport: SSR-safe, un solo listener di resize. */
function useTier(): Tier {
  const [tier, setTier] = useState<Tier>("desktop");
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (h < 520 && w >= 640) setTier("short");
      else setTier(w < 768 ? "mobile" : w < 1100 ? "tablet" : "desktop");
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return tier;
}

/** true quando il puntatore non supporta l'hover (touch). SSR-safe. */
function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isTouch;
}

const coordOf = (pin: PinAnima, tier: Tier): PinCoord =>
  tier === "mobile" ? pin.m : tier === "short" ? pin.s : tier === "tablet" ? pin.t : pin.d;

export function Hero() {
  const reduced = useReducedMotion();
  const tier = useTier();
  const isMobile = tier === "mobile";
  const touch = useIsTouch() || isMobile;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 22, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 120, damping: 22, mass: 0.4 });

  const active = PIN_ANIME.find((p) => p.id === activeId) ?? null;

  const dismissHint = useCallback(() => setHintVisible(false), []);

  const select = useCallback(
    (id: string | null) => {
      setActiveId(id);
      if (id) dismissHint();
    },
    [dismissHint],
  );

  // Parallasse: massimo 6 px, un solo listener, spento su touch e reduced motion.
  useEffect(() => {
    if (reduced || touch) {
      px.set(0);
      py.set(0);
      return;
    }
    const el = mapRef.current;
    if (!el) return;
    let ticking = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
        ticking = false;
      });
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, touch, px, py]);

  // Escape chiude l'anteprima aperta.
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId]);

  const photoX = useTransform(sx, (v) => v * -6);
  const photoY = useTransform(sy, (v) => v * -5);

  const enter = (delay: number) =>
    reduced
      ? {
          initial: { opacity: 1, y: 0 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="hero"
      aria-label="La Masseria vista dall'alto"
      className="relative isolate flex min-h-[100dvh] w-full flex-col bg-[color:var(--carbone)]"
    >
      {/* ===== Mappa ===== */}
      <div
        ref={mapRef}
        className="relative isolate min-h-[62dvh] flex-1 overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) setActiveId(null);
        }}
      >
        {/* Fotografia aerea autentica: nitida, contrasto leggermente abbassato. */}
        <motion.div
          aria-hidden={false}
          className="absolute inset-[-10px]"
          style={{ x: photoX, y: photoY }}
        >
          <img
            src={aerial.url}
            alt="Veduta aerea della Masseria Don Gianvito a Noci: i corpi di fabbrica in pietra, i campi coltivati e la strada che li attraversa"
            className="h-full w-full object-cover object-[58%_center] md:object-center"
            style={{ filter: "saturate(1.02) contrast(0.94) brightness(0.97)" }}
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>

        {/* Scrim del titolo: zona esclusiva in alto a sinistra. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--carbone) 60%, transparent) 0%, transparent 34%), linear-gradient(100deg, color-mix(in oklab, var(--carbone) 62%, transparent) 0%, transparent 44%), linear-gradient(0deg, color-mix(in oklab, var(--carbone) 58%, transparent) 0%, transparent 22%)",
          }}
        />
        <div aria-hidden className="grain absolute inset-0" />

        {/* ===== Titolo ===== */}
        <div
          className="pointer-events-none relative z-20 mx-auto flex h-full max-w-[1600px] flex-col px-5 pb-8 md:px-10 md:pb-10"
          style={{ paddingTop: "var(--page-header-safe-offset)" }}
        >
          <motion.div
            animate={{ opacity: active ? 0.75 : 1 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="max-w-md lg:max-w-lg"
          >
            <motion.p
              {...enter(0.04)}
              className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--bianco-calce)]/80 md:text-[10px]"
            >
              {MASSERIA.nome} · Noci
            </motion.p>
            <motion.h1
              {...enter(0.14)}
              data-hero-title
              className="mt-3 font-display text-[clamp(2rem,5vw,4.2rem)] leading-[0.96] text-[color:var(--bianco-calce)]"
            >
              <span className="block">Un solo luogo.</span>
              <span className="block text-[color:var(--oro-antico)]">Quattro mestieri.</span>
            </motion.h1>
            <motion.p
              {...enter(0.24)}
              className="mt-4 max-w-xs text-[13px] leading-relaxed text-[color:var(--bianco-calce)]/80 md:text-[15px]"
            >
              Dalla terra alla tavola, ogni passaggio avviene qui.
            </motion.p>
          </motion.div>
        </div>

        {/* ===== Le quattro targhe ===== */}
        <ul className="absolute inset-0 z-30 m-0 list-none p-0">
          {PIN_ANIME.map((pin, i) => (
            <PinTarga
              key={pin.id}
              pin={pin}
              index={i}
              tier={tier}
              touch={touch}
              reduced={reduced}
              active={activeId === pin.id}
              dimmed={activeId !== null && activeId !== pin.id}
              onHover={select}
              sx={sx}
              sy={sy}
            />
          ))}
        </ul>

        {/* ===== Scheda mobile ===== */}
        <AnimatePresence>
          {touch && active && (
            <motion.div
              key={`sheet-${active.id}`}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 bottom-3 z-40"
            >
              <Link
                to={active.to}
                aria-label={`${active.nome} — scopri la pagina dedicata`}
                className="block rounded-md border-2 border-[color:var(--oro-antico)] bg-[color:var(--carbone)] p-4 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]"
              >
                <span className="font-eyebrow block text-[10px] tracking-[0.3em] text-[color:var(--oro-antico)]">
                  {active.numero} · {active.nome.toUpperCase()}
                </span>
                <span className="mt-2 block text-[14px] leading-snug text-[color:var(--bianco-calce)]">
                  {active.descrizione}
                </span>
                <span className="mt-3 block text-[13px] font-medium text-[color:var(--bianco-calce)]">
                  {active.invito} →
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Indicatore di esplorazione ===== */}
        <AnimatePresence>
          {hintVisible && !active && (
            <motion.p
              key="hint"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: reduced ? 0 : 1.2 }}
              className="font-eyebrow pointer-events-none absolute inset-x-0 bottom-4 z-20 text-center text-[9px] tracking-[0.3em] text-[color:var(--bianco-calce)]/75"
            >
              QUATTRO LUOGHI. {touch ? "TOCCA" : "CLICCA"} PER ENTRARE
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ===== Fila delle quattro anime (mobile): obbligatoria ===== */}
      <nav
        aria-label="Le quattro anime della Masseria"
        className="relative z-20 border-t border-[color:var(--bianco-calce)]/15 bg-[color:var(--carbone)] md:hidden"
      >
        <ul className="grid grid-cols-2">
          {PIN_ANIME.map((pin) => (
            <li key={pin.id} className="border-b border-r border-[color:var(--bianco-calce)]/12">
              <Link
                to={pin.to}
                aria-label={`${pin.nome} — scopri la pagina dedicata`}
                onFocus={() => setActiveId(pin.id)}
                onClick={dismissHint}
                onPointerDown={() => select(pin.id)}
                className={`flex h-full min-h-[56px] flex-col justify-center px-4 py-3 transition-colors ${
                  activeId === pin.id ? "bg-[color:var(--bianco-calce)]/10" : ""
                }`}
              >
                <span className="font-eyebrow text-[10px] tracking-[0.24em] text-[color:var(--oro-antico)]">
                  {pin.numero}
                </span>
                <span className="font-eyebrow text-[15px] uppercase leading-tight tracking-[0.08em] text-[color:var(--bianco-calce)]">
                  {pin.nome} <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ===== Handoff verso l'atto 01 (gap 0px) ===== */}
      <div
        data-hero-handoff
        className="relative z-20"
        style={{
          background:
            "linear-gradient(180deg, var(--carbone) 0%, color-mix(in oklab, var(--pietra-800) 88%, var(--carbone)) 100%)",
        }}
      >
        <div aria-hidden className="hairline-oro" />
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 py-5 md:px-10 md:py-6">
          <span aria-hidden className="h-px w-10 bg-[color:var(--oro-antico)]/70" />
          <p className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--bianco-calce)]/65 md:text-[10px]">
            01 · Il Manifesto
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Una TARGA: nodo ancorato + linea guida + cartellino editoriale sempre visibile.
 */
function PinTarga({
  pin,
  index,
  tier,
  touch,
  reduced,
  active,
  dimmed,
  onHover,
  sx,
  sy,
}: {
  pin: PinAnima;
  index: number;
  tier: Tier;
  touch: boolean;
  reduced: boolean;
  active: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const x = useTransform(sx, (v) => v * -6 * pin.profondita);
  const y = useTransform(sy, (v) => v * -5 * pin.profondita);
  const coord = coordOf(pin, tier);
  const { dx, dy } = coord.off;
  const compatta = tier === "mobile" || tier === "short";
  const larghezza = tier === "desktop" ? 244 : tier === "tablet" ? 208 : 156;
  const verso: "right" | "left" = dx >= 0 ? "right" : "left";
  // Stato del pin PRIMA del tocco: il focus da touch non vale come "già aperto".
  const eraAttivo = useRef(false);

  const bordo = active ? "var(--oro-antico)" : "color-mix(in oklab, var(--bianco-calce) 62%, transparent)";

  return (
    <li
      className="absolute"
      style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
      onPointerDownCapture={(e) => {
        if (e.pointerType !== "mouse") eraAttivo.current = active;
      }}
      onClickCapture={(e) => {
        // Touch: il primo tocco apre la scheda, non naviga.
        if (touch && !eraAttivo.current) {
          e.preventDefault();
          e.stopPropagation();
          onHover(pin.id);
        }
      }}
    >
      <motion.div
        style={reduced || touch ? undefined : { x, y }}
        animate={{ opacity: dimmed ? 0.55 : 1 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
        className="relative"
      >
        {/* chiarore locale attorno al nodo, minimo */}
        {active && (
          <span
            aria-hidden
            className="pointer-events-none absolute size-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--oro-antico) 26%, transparent) 0%, transparent 70%)",
            }}
          />
        )}

        {/* linea guida nodo → targa */}
        <svg
          aria-hidden
          className="pointer-events-none absolute overflow-visible"
          width="1"
          height="1"
        >
          <motion.line
            x1="0"
            y1="0"
            x2={dx}
            y2={dy}
            stroke={active ? "var(--oro-antico)" : "color-mix(in oklab, var(--bianco-calce) 78%, transparent)"}
            strokeWidth="1"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: reduced ? 0 : 0.32, delay: reduced ? 0 : 0.5 + index * 0.1 }}
          />
        </svg>

        {/* nodo pieno ancorato al punto reale */}
        <motion.span
          aria-hidden
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          initial={reduced ? false : { opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            width: active ? 16 : 11,
            height: active ? 16 : 11,
          }}
          transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.45 + index * 0.1 }}
          style={{
            background: "var(--bianco-calce)",
            borderColor: "var(--oro-antico)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.55)",
          }}
        />

        {/* la targa */}
        <motion.div
          className="absolute"
          style={{
            left: verso === "right" ? dx : undefined,
            right: verso === "left" ? -dx : undefined,
            top: dy,
            width: larghezza,
            transform: "translateY(-50%)",
          }}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.4 + index * 0.1 }}
        >
          <Link
            to={pin.to}
            aria-label={`${pin.numero} ${pin.nome} — ${pin.descrizione} ${pin.invito}`}
            aria-current={active ? "true" : undefined}
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") onHover(pin.id);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") onHover(null);
            }}
            onClick={() => onHover(pin.id)}
            onFocus={() => onHover(pin.id)}
            onBlur={() => onHover(null)}
            className="group block rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--oro-antico)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--carbone)]"
          >
            <motion.div
              animate={{ y: active && !touch ? -3 : 0 }}
              transition={{ duration: reduced ? 0 : 0.2 }}
              className="rounded-[3px] border px-3 py-2.5 md:px-4 md:py-3"
              style={{
                background: "color-mix(in oklab, var(--carbone) 94%, var(--oro-antico))",
                borderColor: bordo,
                boxShadow: "0 14px 34px -10px rgba(0,0,0,0.72), 0 2px 6px rgba(0,0,0,0.45)",
              }}
            >
              <span className="font-eyebrow block text-[12px] leading-none tracking-[0.28em] text-[color:var(--oro-antico)] md:text-[13px]">
                {pin.numero}
              </span>
              <span className="font-eyebrow mt-1.5 flex items-baseline justify-between gap-2 text-[15px] uppercase leading-tight tracking-[0.1em] text-[color:var(--bianco-calce)] md:text-[20px]">
                {pin.nome}
                <motion.span
                  aria-hidden
                  animate={{ x: active && !touch ? 3 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.2 }}
                  className="text-[color:var(--oro-antico)]"
                >
                  →
                </motion.span>
              </span>
              {!compatta && (
                <span className="mt-1.5 block text-[13px] leading-snug text-[color:var(--bianco-calce)]/85 md:text-[13.5px]">
                  {pin.descrizione}
                </span>
              )}
              <AnimatePresence>
                {active && !touch && (
                  <motion.span
                    initial={reduced ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: reduced ? 0 : 0.2 }}
                    className="mt-2 block overflow-hidden text-[12.5px] font-medium tracking-wide text-[color:var(--oro-antico)]"
                  >
                    {pin.invito}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </li>
  );
}
