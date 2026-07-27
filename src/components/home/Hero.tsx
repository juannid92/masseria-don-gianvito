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
import { PIN_ANIME, type PinAnima } from "@/data/pin-anime";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * HERO HOME — "La Masseria vista dall'alto".
 * Mappa viva: un solo luogo, quattro mestieri, quattro porte.
 * Nessun ScrollTrigger, nessuna istanza Lenis, nessun rAF proprio:
 * il parallasse usa i motion value di Framer con un singolo listener.
 */
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

export function Hero() {
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const touch = useIsTouch() || isMobile;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const mapRef = useRef<HTMLDivElement | null>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.4 });

  const active = PIN_ANIME.find((p) => p.id === activeId) ?? null;

  const dismissHint = useCallback(() => setHintVisible(false), []);

  const select = useCallback(
    (id: string | null) => {
      setActiveId(id);
      if (id) dismissHint();
    },
    [dismissHint],
  );

  // Parallasse: un solo listener, disattivato su touch e reduced motion.
  useEffect(() => {
    if (reduced || touch) {
      px.set(0);
      py.set(0);
      return;
    }
    const el = mapRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
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

  const photoX = useTransform(sx, (v) => v * -8);
  const photoY = useTransform(sy, (v) => v * -6);

  const enter = (delay: number) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
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
        className="relative isolate min-h-[60dvh] flex-1 overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget) setActiveId(null);
        }}
      >
        {/* Fotografia aerea autentica: nitida, calda, senza filtri freddi. */}
        <motion.div
          aria-hidden={false}
          className="absolute inset-[-14px]"
          style={{ x: photoX, y: photoY }}
        >
          <img
            src={aerial.url}
            alt="Veduta aerea della Masseria Don Gianvito a Noci: i corpi di fabbrica in pietra, i campi coltivati e la strada che li attraversa"
            className="h-full w-full object-cover object-[62%_center] md:object-center"
            style={{ filter: "saturate(1.06) contrast(1.04) brightness(1.03)" }}
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>

        {/* Scrim locale sotto il testo, leggero, mai vignettatura pesante. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--carbone) 62%, transparent) 0%, transparent 30%), linear-gradient(100deg, color-mix(in oklab, var(--carbone) 66%, transparent) 0%, transparent 46%), linear-gradient(0deg, color-mix(in oklab, var(--carbone) 72%, transparent) 0%, transparent 26%)",
          }}
        />
        <div aria-hidden className="grain absolute inset-0" />

        {/* Scrim di messa a fuoco quando un pin è espanso (buco attorno al pin). */}
        <AnimatePresence>
          {active && (
            <motion.div
              key="focus-scrim"
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
              className="absolute inset-0"
              style={{
                background: `radial-gradient(26% 34% at ${
                  isMobile ? active.m.x : active.d.x
                }% ${
                  isMobile ? active.m.y : active.d.y
                }%, transparent 0%, color-mix(in oklab, var(--carbone) 46%, transparent) 100%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* ===== Titolo ===== */}
        <div
          className="pointer-events-none relative z-20 mx-auto flex h-full max-w-[1600px] flex-col px-5 pb-8 md:px-10 md:pb-10"
          style={{ paddingTop: "var(--page-header-safe-offset)" }}
        >
          <motion.div
            animate={{ opacity: active ? 0.6 : 1 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="max-w-xl"
          >
            <motion.p
              {...enter(0.05)}
              className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--crema)]/75 md:text-[10px]"
            >
              {MASSERIA.nome} · Noci
            </motion.p>
            <motion.h1
              {...enter(0.18)}
              data-hero-title
              className="mt-4 font-display text-[clamp(2.4rem,7vw,5.4rem)] leading-[0.94] text-[color:var(--crema)]"
            >
              <span className="block">Un solo luogo.</span>
              <span className="block text-[color:var(--oro)]">Quattro mestieri.</span>
            </motion.h1>
            <motion.p
              {...enter(0.3)}
              className="mt-5 max-w-sm text-[15px] leading-relaxed text-[color:var(--crema)]/80 md:text-[16px]"
            >
              Dalla terra alla tavola, ogni passaggio avviene qui.
            </motion.p>
          </motion.div>
        </div>

        {/* ===== I quattro pin ===== */}
        <ul className="absolute inset-0 z-30 m-0 list-none p-0">
          {PIN_ANIME.map((pin, i) => (
            <PinMarker
              key={pin.id}
              pin={pin}
              index={i}
              isMobile={isMobile}
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
              initial={reduced ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-3 bottom-3 z-40"
            >
              <Link
                to={active.to}
                aria-label={`${active.nome} — scopri la pagina dedicata`}
                className="block rounded-md border border-[color:var(--oro)]/45 bg-[color:var(--carbone)]/92 p-4 backdrop-blur-sm"
              >
                <span className="font-eyebrow block text-[9px] tracking-[0.3em] text-[color:var(--oro)]">
                  {active.numero} · {active.nome}
                </span>
                <span className="mt-2 block text-[14px] leading-snug text-[color:var(--crema)]/85">
                  {active.descrizione}
                </span>
                <span className="mt-3 block text-[12px] font-medium text-[color:var(--crema)]">
                  {active.invito} →
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Indicatore di esplorazione ===== */}
        <AnimatePresence>
          {hintVisible && (
            <motion.p
              key="hint"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: reduced ? 0 : 1.4 }}
              className="font-eyebrow pointer-events-none absolute inset-x-0 bottom-4 z-20 text-center text-[9px] tracking-[0.3em] text-[color:var(--crema)]/70"
            >
              {touch ? "Tocca un luogo per entrare" : "Passa sui luoghi per esplorare"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ===== Fila delle quattro anime (mobile): accesso senza toccare la foto ===== */}
      <nav
        aria-label="Le quattro anime della Masseria"
        className="relative z-20 border-t border-[color:var(--crema)]/15 bg-[color:var(--carbone)] md:hidden"
      >
        <ul className="grid grid-cols-2">
          {PIN_ANIME.map((pin) => (
            <li key={pin.id} className="border-b border-r border-[color:var(--crema)]/12">
              <Link
                to={pin.to}
                aria-label={`${pin.nome} — scopri la pagina dedicata`}
                onFocus={() => setActiveId(pin.id)}
                onClick={dismissHint}
                onPointerDown={() => select(pin.id)}
                className={`flex h-full flex-col justify-center px-4 py-3 transition-colors ${
                  activeId === pin.id ? "bg-[color:var(--crema)]/10" : ""
                }`}
              >
                <span className="font-display text-[10px] text-[color:var(--oro)]">
                  {pin.numero}
                </span>
                <span className="font-display text-[17px] leading-tight text-[color:var(--crema)]">
                  {pin.nome}
                </span>
                <span className="mt-0.5 text-[11px] text-[color:var(--crema)]/60">
                  {pin.invito}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ===== Handoff verso l'atto 01 (nessun bordo secco, gap 0px) ===== */}
      <div
        data-hero-handoff
        className="relative z-20"
        style={{
          background:
            "linear-gradient(180deg, var(--carbone) 0%, color-mix(in oklab, var(--marrone) 88%, var(--carbone)) 100%)",
        }}
      >
        <div aria-hidden className="hairline-oro" />
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-5 py-5 md:px-10 md:py-6">
          <span aria-hidden className="h-px w-10 bg-[color:var(--oro)]/70" />
          <p className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--crema)]/65 md:text-[10px]">
            01 · Il Manifesto
          </p>
        </div>
      </div>
    </section>
  );
}

/** Un pin: disco crema, bordo bordeaux, anello che pulsa, anteprima su hover/focus. */
function PinMarker({
  pin,
  index,
  isMobile,
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
  isMobile: boolean;
  touch: boolean;
  reduced: boolean;
  active: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const x = useTransform(sx, (v) => v * -10 * pin.profondita);
  const y = useTransform(sy, (v) => v * -7 * pin.profondita);
  const coord = isMobile ? pin.m : pin.d;
  const apreASinistra = pin.lato === "left";
  // Stato del pin PRIMA del tocco: il focus da touch non deve valere come "già aperto".
  const eraAttivo = useRef(false);

  return (
    <li
      className="absolute"
      style={{ left: `${coord.x}%`, top: `${coord.y}%`, transform: "translate(-50%,-50%)" }}
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
        animate={{ opacity: dimmed ? 0.45 : 1 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
        className="relative"
      >
        <Link
          to={pin.to}
          aria-label={`${pin.nome} — scopri la pagina dedicata`}
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
          className="relative flex size-11 items-center justify-center rounded-full"
        >
          <span className="sr-only">
            {pin.nome}. {pin.descrizione} {pin.invito}.
          </span>

          {/* anello che pulsa, uno solo, sottile */}
          {!reduced && (
            <motion.span
              aria-hidden
              className="absolute rounded-full border"
              style={{ borderColor: "color-mix(in oklab, var(--crema) 70%, transparent)" }}
              initial={{ width: 18, height: 18, opacity: 0.5 }}
              animate={{ width: [18, 40], height: [18, 40], opacity: [0.5, 0] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                repeatDelay: 0.8,
                delay: 0.9 + index * 0.1,
                ease: "easeOut",
              }}
            />
          )}

          {/* disco */}
          <motion.span
            aria-hidden
            initial={reduced ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: active ? 1.25 : 1, opacity: 1 }}
            transition={{
              duration: 0.3,
              delay: reduced ? 0 : 0.6 + index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="block size-4 rounded-full border-2"
            style={{
              background: active ? "var(--bordeaux)" : "var(--crema)",
              borderColor: active ? "var(--oro)" : "var(--bordeaux)",
              boxShadow: "0 2px 10px color-mix(in oklab, var(--carbone) 55%, transparent)",
            }}
          />
        </Link>

        {/* Anteprima desktop, ancorata al lato scelto in base alla posizione */}
        <AnimatePresence>
          {active && !touch && (
            <motion.div
              initial={reduced ? false : { opacity: 0, x: apreASinistra ? 8 : -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className={`pointer-events-none absolute top-1/2 w-[248px] -translate-y-1/2 ${
                apreASinistra ? "right-[calc(100%+10px)]" : "left-[calc(100%+10px)]"
              }`}
            >
              <div
                className={`rounded-md border bg-[color:var(--carbone)]/92 p-3.5 backdrop-blur-sm ${
                  apreASinistra ? "text-right" : "text-left"
                }`}
                style={{ borderColor: "color-mix(in oklab, var(--oro) 55%, transparent)" }}
              >
                <p className="font-eyebrow text-[9px] tracking-[0.3em] text-[color:var(--oro)]">
                  {pin.numero} · {pin.nome}
                </p>
                <p className="mt-2 text-[13px] leading-snug text-[color:var(--crema)]/85">
                  {pin.descrizione}
                </p>
                <p
                  className="mt-2.5 text-[12px] font-medium"
                  style={{ color: "var(--crema)" }}
                >
                  {apreASinistra ? "← " : ""}
                  {pin.invito}
                  {apreASinistra ? "" : " →"}
                </p>
                <span
                  aria-hidden
                  className="mt-3 block h-px w-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${pin.tinta}, transparent)`,
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </li>
  );
}
