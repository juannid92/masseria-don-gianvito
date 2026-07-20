import { useEffect, useRef, useState, useCallback, useId } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useHomeSectionNav, type HomeSectionId } from "@/lib/nav";

/* ─── Definizioni ─── */
const HOME_SECTIONS: { id: HomeSectionId; label: string }[] = [
  { id: "storia", label: "Storia" },
  { id: "luogo", label: "Il Luogo" },
  { id: "filiera", label: "La Filiera" },
  { id: "tavola", label: "La Tavola" },
];

const ANIME = [
  { to: "/allevamento", num: "01", label: "Allevamento", tag: "La terra e gli animali" },
  { to: "/caseificio", num: "02", label: "Caseificio", tag: "Il bianco prende forma" },
  { to: "/macelleria", num: "03", label: "Macelleria", tag: "La scelta avviene a vista" },
  { to: "/agriturismo", num: "04", label: "Agriturismo", tag: "Cucina, tavola e braceria" },
] as const;

const ANIMA_PATHS = new Set(ANIME.map((a) => a.to));

/* ─── Menu editoriale "La Masseria" ─── */
function MasseriaMenu({
  scrolled,
  activePath,
  onNavigate,
}: {
  scrolled: boolean;
  activePath: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const openNow = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  };

  const activeAnima = ANIME.find((a) => a.to === activePath);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        onFocus={openNow}
        className={[
          "font-eyebrow inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.24em] transition-colors",
          activeAnima
            ? "text-[color:var(--oro)]"
            : "text-[color:var(--crema)]/85 hover:text-[color:var(--oro)]",
        ].join(" ")}
      >
        <span>La Masseria</span>
        <span
          aria-hidden
          className="inline-block h-1 w-1 rounded-full bg-current opacity-60"
        />
      </button>

      <motion.div
        id={menuId}
        role="menu"
        initial={false}
        animate={
          open
            ? { opacity: 1, y: 0, pointerEvents: "auto" }
            : { opacity: 0, y: -6, pointerEvents: "none" }
        }
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "absolute right-0 top-full z-50 mt-3 w-[380px] overflow-hidden rounded-[2px] border shadow-2xl",
          scrolled
            ? "border-white/10 bg-[color:var(--carbone)]/97"
            : "border-white/10 bg-[color:var(--carbone)]/95",
          "backdrop-blur-sm",
        ].join(" ")}
      >
        <div className="px-6 pb-2 pt-5">
          <p className="font-eyebrow text-[9px] uppercase tracking-[0.34em] text-[color:var(--oro)]/70">
            Le quattro anime
          </p>
        </div>
        <ul className="divide-y divide-white/5">
          {ANIME.map((a) => {
            const active = a.to === activePath;
            return (
              <li key={a.to} role="none">
                <Link
                  to={a.to}
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    onNavigate();
                  }}
                  className={[
                    "group flex items-baseline gap-4 px-6 py-4 transition-colors",
                    active
                      ? "bg-white/[0.03] text-[color:var(--oro)]"
                      : "text-[color:var(--crema)] hover:bg-white/[0.04] hover:text-[color:var(--oro)]",
                  ].join(" ")}
                >
                  <span className="font-eyebrow w-6 shrink-0 text-[10px] tracking-[0.24em] text-[color:var(--oro)]/70">
                    {a.num}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-display text-lg leading-tight">{a.label}</span>
                    <span className="font-eyebrow mt-0.5 text-[10px] uppercase tracking-[0.22em] text-[color:var(--crema)]/50">
                      {a.tag}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="ml-auto self-center text-[color:var(--oro)] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                  >
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}

/* ─── Navbar principale ─── */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const goHomeSection = useHomeSectionNav(() => setOpen(false));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Blocca lo scroll del body quando il drawer è aperto, senza persistenza.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : prev || "";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Chiudi drawer al cambio route
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === "/";
  const activeHash = isHome ? (location.hash || "").replace(/^#/, "") : "";

  const homeLinkCls = useCallback(
    (id: string) =>
      [
        "font-eyebrow text-[11px] uppercase tracking-[0.24em] transition-colors",
        activeHash === id
          ? "text-[color:var(--oro)]"
          : "text-[color:var(--crema)]/85 hover:text-[color:var(--oro)]",
      ].join(" "),
    [activeHash],
  );

  const handleSection = (e: React.MouseEvent, id: HomeSectionId) => {
    // Se già sulla Home lasciamo che il helper gestisca lo smooth scroll,
    // e preveniamo il jump nativo dell'hash.
    if (isHome) {
      e.preventDefault();
    }
    void goHomeSection(id);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background,border-color] duration-500",
        scrolled
          ? "border-b border-white/10 bg-[color:var(--carbone)]/90 backdrop-blur-sm"
          // Scrim CSS statico: garantisce contrasto su aperture chiare (Allevamento) senza barra piena.
          : "border-b border-transparent bg-gradient-to-b from-black/28 via-black/10 to-transparent",
      ].join(" ")}
    >
      <nav
        aria-label="Navigazione principale"
        className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-6 lg:gap-6 lg:py-5"
      >
        <Link
          to="/"
          onClick={() => {
            if (isHome) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
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

        {/* Desktop wide ≥1280 */}
        <ul className="hidden items-center gap-7 xl:flex">
          {HOME_SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`/#${s.id}`}
                onClick={(e) => handleSection(e, s.id)}
                className={homeLinkCls(s.id)}
              >
                {s.label}
              </a>
            </li>
          ))}
          <li>
            <MasseriaMenu
              scrolled={scrolled}
              activePath={location.pathname}
              onNavigate={() => setOpen(false)}
            />
          </li>
          <li>
            <a
              href="/#la-voce"
              onClick={(e) => handleSection(e, "la-voce")}
              className={homeLinkCls("la-voce")}
            >
              La Voce
            </a>
          </li>
        </ul>

        {/* Desktop compatto 1024–1279: sezioni + Masseria compattati nel drawer, ma teniamo Masseria + Prenota */}
        <div className="hidden items-center gap-6 lg:flex xl:hidden">
          <MasseriaMenu
            scrolled={scrolled}
            activePath={location.pathname}
            onNavigate={() => setOpen(false)}
          />
          <a
            href="/#prenota"
            onClick={(e) => handleSection(e, "prenota")}
            className="font-eyebrow text-[11px] uppercase tracking-[0.24em] text-[color:var(--crema)]/85 hover:text-[color:var(--oro)]"
          >
            Esplora
          </a>
        </div>

        {/* CTA Prenota desktop */}
        <div className="hidden lg:block">
          <motion.a
            href="/#prenota"
            onClick={(e) => handleSection(e, "prenota")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--oro)] px-6 py-2.5 font-eyebrow text-[11px] uppercase tracking-[0.24em] text-[color:var(--carbone)] shadow-[0_10px_30px_-10px_rgba(196,154,74,0.55)]"
          >
            Prenota
          </motion.a>
        </div>

        {/* Mobile: CTA compatta + burger */}
        <div className="flex items-center gap-3 lg:hidden">
          <a
            href="/#prenota"
            onClick={(e) => handleSection(e, "prenota")}
            className="font-eyebrow inline-flex items-center justify-center rounded-full bg-[color:var(--oro)] px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[color:var(--carbone)]"
          >
            Prenota
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/15"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
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
        </div>
      </nav>

      {/* Filo oro animato */}
      <motion.div
        aria-hidden
        style={{ width: lineWidth }}
        className="h-px bg-gradient-to-r from-transparent via-[color:var(--oliva)] to-[color:var(--oro)]"
      />

      {/* Mobile drawer */}
      <motion.div
        id="mobile-drawer"
        initial={false}
        animate={open ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden border-t border-white/10 bg-[color:var(--carbone)]/97 backdrop-blur-sm lg:hidden"
      >
        <div
          className="max-h-[calc(100dvh-var(--header-offset))] overflow-y-auto px-6 py-6"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          <p className="font-eyebrow text-[9px] uppercase tracking-[0.34em] text-[color:var(--oro)]/70">
            Esplora la Home
          </p>
          <ul className="mt-3 flex flex-col divide-y divide-white/5">
            {[
              { id: "", label: "Inizio", to: "/" as const },
              { id: "manifesto", label: "Manifesto" },
              { id: "storia", label: "Storia" },
              { id: "luogo", label: "Il Luogo" },
              { id: "filiera", label: "La Filiera" },
              { id: "tavola", label: "La Tavola" },
              { id: "la-voce", label: "La Voce" },
              { id: "prenota", label: "Prenota" },
            ].map((item) => (
              <li key={item.label}>
                {item.to ? (
                  <Link
                    to={item.to}
                    onClick={() => {
                      setOpen(false);
                      if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="font-display block py-3 text-lg text-[color:var(--crema)]"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={`/#${item.id}`}
                    onClick={(e) => {
                      if (isHome) e.preventDefault();
                      void goHomeSection(item.id as HomeSectionId);
                    }}
                    className="font-display block py-3 text-lg text-[color:var(--crema)]"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <p className="font-eyebrow mt-8 text-[9px] uppercase tracking-[0.34em] text-[color:var(--oro)]/70">
            Le quattro anime
          </p>
          <ul className="mt-3 flex flex-col divide-y divide-white/5">
            {ANIME.map((a) => (
              <li key={a.to}>
                <Link
                  to={a.to}
                  onClick={() => setOpen(false)}
                  className={[
                    "flex items-baseline justify-between py-3",
                    ANIMA_PATHS.has(a.to) && location.pathname === a.to
                      ? "text-[color:var(--oro)]"
                      : "text-[color:var(--crema)]",
                  ].join(" ")}
                >
                  <span className="font-display text-lg">{a.label}</span>
                  <span className="font-eyebrow text-[10px] uppercase tracking-[0.22em] text-[color:var(--crema)]/50">
                    {a.num}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.header>
  );
}
