import { useState, useId } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

export type Pin = {
  id: string;
  label: string;
  caption: string;
  to: string;
  /** Percent coordinates relative to the aerial image container (0-100). */
  top: number;
  left: number;
};

type Props = {
  pin: Pin;
  /** Stagger order index for entrance animation. */
  index: number;
  /** Notify parent when hover/focus changes, to dim hero text. */
  onActiveChange?: (active: boolean) => void;
};

export function PinMarker({ pin, index, onActiveChange }: Props) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  const setActive = (v: boolean) => {
    setOpen(v);
    onActiveChange?.(v);
  };

  // Tooltip flips to the right when the pin sits on the left half.
  const flipRight = pin.left < 35;

  return (
    <motion.div
      className="pointer-events-none absolute z-20"
      style={{ top: `${pin.top}%`, left: `${pin.left}%` }}
      initial={{ opacity: 0, y: -28, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.8 + index * 0.18,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="pointer-events-auto relative -translate-x-1/2 -translate-y-1/2">
        <Link
          to={pin.to}
          aria-label={`Vai alla pagina ${pin.label}`}
          aria-describedby={tooltipId}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          className="group relative block outline-none"
        >
          {/* Pulse halo */}
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "var(--grad-ember)" }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.55, 0, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
          />
          {/* Outer ring */}
          <motion.span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1"
            style={{
              boxShadow:
                "0 0 0 1px rgba(196,154,74,0.55), 0 8px 24px -4px rgba(179,58,26,0.6)",
            }}
            initial={false}
          />
          {/* Drop marker */}
          <motion.span
            aria-hidden
            className="relative block h-5 w-5 rounded-full border border-[color:var(--oro)]/90"
            style={{ background: "var(--grad-brace)" }}
            whileHover={{ scale: 1.35 }}
            whileFocus={{ scale: 1.35 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 350, damping: 18 }}
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--crema)]/95"
            />
          </motion.span>
        </Link>

        {/* Tooltip */}
        <AnimatePresence>
          {open && (
            <motion.div
              id={tooltipId}
              role="tooltip"
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={[
                "pointer-events-none absolute top-1/2 z-30 w-[min(70vw,260px)] -translate-y-1/2",
                flipRight ? "left-8" : "right-8",
              ].join(" ")}
            >
              {/* Connecting line */}
              <motion.span
                aria-hidden
                className={[
                  "absolute top-1/2 h-px",
                  flipRight ? "right-full" : "left-full",
                ].join(" ")}
                style={{
                  background:
                    "linear-gradient(90deg, transparent, var(--oro), var(--terracotta))",
                }}
                initial={{ width: 0 }}
                animate={{ width: 28 }}
                transition={{ duration: 0.28 }}
              />
              <div className="rounded-xl border border-[color:var(--oro)]/30 bg-[color:var(--carbone)]/92 px-4 py-3 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md">
                <p className="font-eyebrow text-[10px] text-[color:var(--oro)]">
                  {pin.label}
                </p>
                <p className="mt-1.5 text-xs leading-snug text-[color:var(--crema)]/85">
                  {pin.caption}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
