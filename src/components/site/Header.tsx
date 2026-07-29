import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ANIME, HEADER_SEZIONI, MASSERIA } from "@/data/masseria";
import { useHomeSectionNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * HEADER globale.
 * - Logo → "/", sezioni Home via hash (nessuna seconda istanza Lenis),
 *   menu editoriale "La Masseria" con le quattro anime, La Voce, CTA Prenota.
 * - Safe area sotto l'header: unica variabile condivisa --header-offset.
 * - Tono adattivo: rileva `[data-tone]` della sezione sotto la barra e alterna
 *   testo/scrim chiaro (fondo scuro) o scuro (fondo bianco calce).
 */
export function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tone, setTone] = useState<"dark" | "light">("dark");
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

  // Tono adattivo: la sezione [data-tone] che interseca la banda header
  // determina il tono. Fallback dark (pagine interne senza data-tone).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const headerH =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-offset"),
      ) || 76;
    const probeY = Math.round(headerH / 2) + 4;
    let raf = 0;
    const detect = () => {
      raf = 0;
      // Iteriamo le sezioni [data-tone] e prendiamo quella che interseca
      // la banda dell'header. Evita l'inganno di elementFromPoint quando
      // l'header fisso cattura il punto in alto a sinistra.
      const nodes = document.querySelectorAll<HTMLElement>("[data-tone]");
      let match: "dark" | "light" | null = null;
      for (const n of Array.from(nodes)) {
        const r = n.getBoundingClientRect();
        if (r.top <= probeY && r.bottom > probeY) {
          const t = n.dataset.tone;
          if (t === "light" || t === "dark") match = t;
          // non "break": una sezione più annidata (più recente nel DOM)
          // vince sull'antenata, coerente con lo z-index visivo.
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

  // Dropdown: Escape + click esterno
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  // Drawer mobile: blocca e ripristina lo scroll
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  useEffect(() => {
    setDrawer(false);
    setOpen(false);
  }, [location.pathname]);

  const animaAttiva = ANIME.find((a) => a.to === location.pathname);

  const isLight = tone === "light";
  // Oro adattivo PER IL TESTO: su fondi chiari `--oro-antico-testo`,
  // su fondi scuri `--oro-su-scuro`. L'oro pieno (--oro-antico) resta
  // riservato a fili e bordi, dove il rapporto di contrasto non si applica.
  const oroText = isLight ? "var(--oro-antico-testo)" : "var(--oro-su-scuro)";
  const textStrong = isLight ? "text-[color:var(--pietra-800)]" : "text-[color:var(--bianco-calce)]";
  const textSoft = isLight
    ? "text-[color:var(--pietra-800)]/75 hover:text-[color:var(--pietra-800)]"
    : "text-[color:var(--bianco-calce)]/75 hover:text-[color:var(--bianco-calce)]";
  const scrimGradient = isLight
    ? "linear-gradient(180deg, color-mix(in oklab, var(--bianco-calce) 78%, transparent) 0%, transparent 100%)"
    : "linear-gradient(180deg, color-mix(in oklab, var(--carbone) 72%, transparent) 0%, transparent 100%)";
  const bgScrolled = isLight
    ? "bg-[color:var(--bianco-calce)]/92 backdrop-blur-md"
    : "bg-[color:var(--pietra-800)]/92 backdrop-blur-md";

  return (
    <header
      data-header-tone={tone}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled ? bgScrolled : "bg-transparent",
      )}
      style={{ height: "var(--header-offset)" }}
    >
      {/* Scrim leggero: garantisce contrasto sopra qualunque materia */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: scrimGradient }}
      />

      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-6 px-5 md:px-10">
        <Link to="/" className="group flex flex-col leading-none" aria-label={MASSERIA.nome}>
          <span
            className="font-eyebrow text-[9px] tracking-[0.34em] transition-colors duration-500"
            style={{ color: oroText }}
          >
            Noci · Puglia
          </span>
          <span
            className={cn(
              "font-display text-[15px] leading-tight transition-colors duration-500 md:text-[17px]",
              textStrong,
            )}
          >
            Masseria{" "}
            <em
              className="not-italic transition-colors duration-500"
              style={{ color: oroText }}
            >
              Don Gianvito
            </em>
          </span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigazione principale">
          {HEADER_SEZIONI.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goToSection(s.id)}
              className={cn(
                "font-eyebrow text-[10px] tracking-[0.24em] transition-colors",
                textSoft,
              )}
            >
              {s.nome}
            </button>
          ))}

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "font-eyebrow text-[10px] tracking-[0.24em] transition-colors",
                (open || animaAttiva) ? "" : textSoft,
              )}
              style={
                open || animaAttiva ? { color: oroText } : undefined
              }
            >
              La Masseria
            </button>
            {open && (
              <div
                className="absolute right-0 top-[calc(100%+14px)] w-[340px] border border-[color:var(--oro-antico)]/25 bg-[color:var(--carbone)]/97 p-2 shadow-2xl backdrop-blur-md"
                role="menu"
              >
                {ANIME.map((a) => (
                  <Link
                    key={a.id}
                    to={a.to}
                    role="menuitem"
                    aria-current={location.pathname === a.to ? "page" : undefined}
                    className="group flex items-baseline gap-4 px-4 py-3 transition-colors hover:bg-[color:var(--pietra-800)]/45"
                  >
                    <span className="font-display text-[11px] text-[color:var(--oro-su-scuro)]/80">
                      {a.numero}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-[17px] text-[color:var(--bianco-calce)]">
                        {a.nome}
                      </span>
                      <span className="block text-[12px] text-[color:var(--bianco-calce)]/55">
                        {a.claim}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => goToSection("la-voce")}
            className={cn(
              "font-eyebrow text-[10px] tracking-[0.24em] transition-colors",
              textSoft,
            )}
          >
            La Voce
          </button>

          <button
            type="button"
            onClick={() => goToSection("prenota")}
            className="px-5 py-2 font-eyebrow text-[10px] tracking-[0.24em] transition-colors border hover:bg-[color:var(--oro-antico)] hover:text-[color:var(--carbone)]"
            style={{
              color: oroText,
              borderColor: `color-mix(in oklab, ${oroText} 60%, transparent)`,
            }}
          >
            Prenota
          </button>
        </nav>

        {/* Mobile */}
        <button
          type="button"
          className="flex items-center gap-2 lg:hidden"
          aria-expanded={drawer}
          aria-label="Apri il menu"
          onClick={() => setDrawer(true)}
        >
          <span
            className={cn(
              "font-eyebrow text-[10px] tracking-[0.24em]",
              isLight ? "text-[color:var(--pietra-800)]/85" : "text-[color:var(--bianco-calce)]/80",
            )}
          >
            Menu
          </span>
          <span aria-hidden className="flex h-4 w-6 flex-col justify-between py-[3px]">
            <span className="block h-px w-full" style={{ background: oroText }} />
            <span className="block h-px w-full" style={{ background: oroText }} />
          </span>
        </button>
      </div>

      {/* Filo oro di base header */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, color-mix(in oklab, var(--oro-antico) 45%, transparent) 35%, color-mix(in oklab, var(--oro-antico) 45%, transparent) 65%, transparent)",
          opacity: scrolled ? 1 : 0.35,
        }}
      />

      {drawer && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[color:var(--carbone)] lg:hidden">
          <div
            className="flex items-center justify-between px-5"
            style={{ height: "var(--header-offset)" }}
          >
            <span className="font-display text-[15px] text-[color:var(--bianco-calce)]">
              Masseria{" "}
              <em className="not-italic text-[color:var(--oro-su-scuro)]">Don Gianvito</em>
            </span>
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="font-eyebrow text-[10px] tracking-[0.24em] text-[color:var(--bianco-calce)]/75"
            >
              Chiudi
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-10">
            <p className="font-eyebrow mb-4 text-[9px] tracking-[0.34em] text-[color:var(--oro-su-scuro)]/85">
              Le sezioni
            </p>
            <ul className="mb-10 space-y-1">
              {HEADER_SEZIONI.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => goToSection(s.id)}
                    className="w-full py-2 text-left font-display text-[24px] text-[color:var(--bianco-calce)]"
                  >
                    {s.nome}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => goToSection("la-voce")}
                  className="w-full py-2 text-left font-display text-[24px] text-[color:var(--bianco-calce)]"
                >
                  La Voce
                </button>
              </li>
            </ul>

            <p className="font-eyebrow mb-4 text-[9px] tracking-[0.34em] text-[color:var(--oro-su-scuro)]/85">
              Le quattro anime
            </p>
            <ul className="space-y-1">
              {ANIME.map((a) => (
                <li key={a.id}>
                  <Link
                    to={a.to}
                    aria-current={location.pathname === a.to ? "page" : undefined}
                    onClick={() => setDrawer(false)}
                    className="flex items-baseline gap-3 py-2"
                  >
                    <span className="font-display text-[11px] text-[color:var(--oro-su-scuro)]/80">
                      {a.numero}
                    </span>
                    <span>
                      <span className="block font-display text-[24px] text-[color:var(--bianco-calce)]">
                        {a.nome}
                      </span>
                      <span className="block text-[13px] text-[color:var(--bianco-calce)]/50">
                        {a.claim}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => goToSection("prenota")}
              className="mt-10 w-full border border-[color:var(--oro-antico)]/60 py-4 font-eyebrow text-[11px] tracking-[0.28em] text-[color:var(--oro-su-scuro)]"
            >
              Prenota
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
