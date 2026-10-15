import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ANIME, HEADER_SEZIONI, MASSERIA } from "@/data/masseria";
import { useHomeSectionNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * HEADER globale.
 * - Logo sempre leggibile.
 * - Navigazione più leggera.
 * - Stato chiaro/scuro adattivo.
 */
export function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tone, setTone] = useState<"dark" | "light">("dark");
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const goToSection = useHomeSectionNav(() => {
    setOpen(false);
    setDrawer(false);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const headerH = 76;
    const probeY = Math.round(headerH / 2) + 4;
    let raf = 0;
    const detect = () => {
      raf = 0;
      const nodes = document.querySelectorAll<HTMLElement>("[data-tone]");
      let match: "dark" | "light" | null = null;
      for (const n of Array.from(nodes)) {
        const r = n.getBoundingClientRect();
        if (r.top <= probeY && r.bottom > probeY) {
          const t = n.dataset.tone;
          if (t === "light" || t === "dark") match = t;
        }
      }
      const next = match ?? "dark";
      setTone((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(detect);
    };
    detect();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => {
    setDrawer(false);
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawer) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } })
      .__lenis;
    lenis?.stop();
    const controls = () =>
      Array.from(drawerRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? []);
    controls()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(false);
      if (event.key !== "Tab") return;
      const elements = controls();
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      document.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
  }, [drawer]);

  const animaAttiva = ANIME.find((a) => a.to === location.pathname);

  const isLight = tone === "light";
  const oroText = isLight ? "var(--oro-antico-testo)" : "var(--oro-su-scuro)";
  const textStrong = isLight ? "text-[color:var(--carbone)]" : "text-[color:var(--bianco-calce)]";
  const textSoft = isLight
    ? "text-[color:var(--carbone)]/60 hover:text-[color:var(--carbone)]"
    : "text-[color:var(--bianco-calce)]/60 hover:text-[color:var(--bianco-calce)]";
  const bgScrolled = isLight
    ? "bg-[color:var(--bianco-calce)]/90 backdrop-blur-md"
    : "bg-[color:var(--biscotto-scuro)]/90 backdrop-blur-md";

  return (
    <header
      data-header-tone={tone}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? bgScrolled : "bg-transparent",
      )}
      style={{ height: "var(--header-offset)" }}
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-5 md:px-10">
        <Link to="/" className="group flex flex-col leading-none" aria-label={MASSERIA.nome}>
          <span
            className="font-eyebrow text-[9px] tracking-[0.34em] transition-colors"
            style={{ color: oroText }}
          >
            Noci · Puglia
          </span>
          <span
            className={cn(
              "font-display text-[15px] md:text-[17px] leading-tight transition-colors",
              textStrong,
            )}
          >
            Masseria{" "}
            <em className="not-italic" style={{ color: oroText }}>
              Don Gianvito
            </em>
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-6 lg:flex">
          {HEADER_SEZIONI.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goToSection(s.id)}
              className={cn(
                "font-eyebrow text-[9px] tracking-[0.22em] transition-colors",
                textSoft,
              )}
            >
              {s.nome}
            </button>
          ))}

          <Link
            to="/agriturismo"
            hash="menu"
            className={cn(
              "font-eyebrow text-[11px] tracking-[0.16em] min-h-11 flex items-center",
              textSoft,
            )}
          >
            Menù
          </Link>
          <Link
            to="/prodotti"
            className={cn(
              "font-eyebrow text-[11px] tracking-[0.16em] min-h-11 flex items-center",
              textSoft,
            )}
          >
            Prodotti
          </Link>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "font-eyebrow text-[9px] tracking-[0.22em] transition-colors",
                open || animaAttiva ? "" : textSoft,
              )}
              style={open || animaAttiva ? { color: oroText } : undefined}
            >
              La Masseria
            </button>
            {open && (
              <div
                className="absolute right-0 top-[calc(100%+16px)] w-[300px] border border-[color:var(--oro-antico)]/20 bg-[color:var(--carbone)] p-2 shadow-2xl"
                role="menu"
              >
                {ANIME.map((a) => (
                  <Link
                    key={a.id}
                    to={a.to}
                    className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-white/5"
                  >
                    <span className="font-eyebrow text-[9px] text-[color:var(--oro-su-scuro)]">
                      {a.numero}
                    </span>
                    <span className="font-display text-[17px] text-[color:var(--bianco-calce)]">
                      {a.nome}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => goToSection("prenota")}
            className="h-[36px] px-6 font-eyebrow text-[9px] tracking-[0.22em] transition-colors border hover:bg-[color:var(--oro-antico)] hover:text-[color:var(--carbone)]"
            style={{
              color: oroText,
              borderColor: `color-mix(in oklab, ${oroText} 50%, transparent)`,
            }}
          >
            Prenota
          </button>
        </nav>

        {/* Mobile */}
        <button
          type="button"
          className="lg:hidden min-h-11 min-w-11 flex items-center justify-center"
          aria-expanded={drawer}
          aria-haspopup="dialog"
          onClick={() => setDrawer(true)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5 w-6">
            <div className="h-px w-full" style={{ background: oroText }} />
            <div className="h-px w-full" style={{ background: oroText }} />
          </div>
        </button>
      </div>

      {drawer && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigazione della masseria"
          className="fixed inset-0 z-50 bg-[color:var(--carbone)] p-5 flex flex-col lg:hidden"
        >
          <div className="flex justify-between items-center mb-12">
            <span className="font-display text-[18px] text-[color:var(--bianco-calce)]">
              Masseria Don Gianvito
            </span>
            <button
              onClick={() => setDrawer(false)}
              className="font-eyebrow text-[10px] text-white/50"
            >
              Chiudi
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            {HEADER_SEZIONI.map((s) => (
              <button
                key={s.id}
                onClick={() => goToSection(s.id)}
                className="text-left font-display text-[26px] text-white"
              >
                {s.nome}
              </button>
            ))}
            <Link
              to="/agriturismo"
              hash="menu"
              onClick={() => setDrawer(false)}
              className="font-display text-[26px] text-white"
            >
              Menù
            </Link>
            <Link
              to="/prodotti"
              onClick={() => setDrawer(false)}
              className="font-display text-[26px] text-white"
            >
              Prodotti
            </Link>
            <div className="h-px bg-white/10 my-4" />
            {ANIME.map((a) => (
              <Link
                key={a.id}
                to={a.to}
                className="font-display text-[26px] text-[color:var(--oro-su-scuro)]"
              >
                {a.nome}
              </Link>
            ))}
            <button
              onClick={() => goToSection("prenota")}
              className="mt-8 h-14 border border-[color:var(--oro-antico)] font-eyebrow text-[11px] text-[color:var(--oro-su-scuro)]"
            >
              PRENOTA
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
