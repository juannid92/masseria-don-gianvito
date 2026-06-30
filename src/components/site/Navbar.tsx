import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";

const NAV_LINKS = [
  { label: "Allevamento", to: "/allevamento" as const },
  { label: "Caseificio", to: "/caseificio" as const },
  { label: "Macelleria", to: "/macelleria" as const },
  { label: "Braceria", to: "/braceria" as const },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500",
        scrolled
          ? "border-b border-white/10 bg-[color:var(--carbone)]/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:py-5">
        <Link
          to="/"
          className="group flex items-baseline gap-2 text-[color:var(--crema)]"
          aria-label="Masseria Don Gianvito — home"
        >
          <span className="font-display text-xl font-semibold leading-none tracking-tight md:text-2xl">
            Masseria
          </span>
          <span className="font-eyebrow text-[10px] text-[color:var(--oro)] md:text-xs">
            Don Gianvito
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="font-eyebrow text-[11px] text-[color:var(--crema)]/85 transition-colors hover:text-[color:var(--oro)]"
                activeProps={{ className: "text-[color:var(--oro)]" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <motion.a
            href="tel:+393339395750"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-grad-brace inline-flex items-center justify-center rounded-full px-6 py-2.5 font-eyebrow text-[11px] text-[color:var(--crema)] shadow-[0_10px_30px_-10px_rgba(179,58,26,0.7)] ring-1 ring-white/10"
          >
            Prenota
          </motion.a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-white/15 lg:hidden"
          aria-expanded={open}
          aria-label="Apri menu"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-5 bg-[color:var(--crema)] transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-5 bg-[color:var(--crema)] transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      {/* Filo brace/oro animato: cresce con lo scroll */}
      <motion.div
        aria-hidden
        style={{ width: lineWidth }}
        className="h-px bg-gradient-to-r from-transparent via-[color:var(--terracotta)] to-[color:var(--oro)]"
      />

      {/* Mobile drawer */}
      <motion.div
        initial={false}
        animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden border-t border-white/10 bg-[color:var(--carbone)]/95 backdrop-blur-xl lg:hidden"
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-eyebrow block py-3 text-xs text-[color:var(--crema)]/90"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="tel:+393339395750"
              onClick={() => setOpen(false)}
              className="bg-grad-brace font-eyebrow inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-xs text-[color:var(--crema)]"
            >
              Prenota
            </a>
          </li>
        </ul>
      </motion.div>
    </motion.header>
  );
}
