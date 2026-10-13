import { useCallback, useEffect } from "react";
import { useLocation, useNavigate, useRouter } from "@tanstack/react-router";
import type Lenis from "lenis";

/**
 * Navigazione condivisa verso le sezioni Home.
 * - Riutilizza l'unica istanza Lenis esposta come window.__lenis (SmoothScroll).
 * - Considera --header-offset per non fermarsi sotto la Navbar.
 * - Aggiorna l'hash mantenendo back/forward utilizzabili.
 * - Se non siamo sulla Home, naviga a "/" con hash e lo scroll parte dopo il mount.
 */

const HOME_SECTION_IDS = [
  "mappa",
  "manifesto",
  "storia",
  "luogo",
  "filiera",
  "tavola",
  "la-voce",
  "prenota",
] as const;
export type HomeSectionId = (typeof HOME_SECTION_IDS)[number];

function headerOffset(): number {
  if (typeof window === "undefined") return 88;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-offset");
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : 88;
}

function reducedMotionActive(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToHomeSection(id: string, opts: { updateHash?: boolean } = {}) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;
  const offset = headerOffset();
  const y = el.getBoundingClientRect().top + window.scrollY - offset;

  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  if (lenis && !reducedMotionActive()) {
    lenis.scrollTo(y, { duration: 1.1 });
  } else {
    window.scrollTo({ top: y, behavior: reducedMotionActive() ? "auto" : "smooth" });
  }

  if (opts.updateHash !== false) {
    const url = `${window.location.pathname}${window.location.search}#${id}`;
    window.history.replaceState(null, "", url);
  }
}

/** Attende che l'elemento con id esista nel DOM (max ~2s), poi risolve. */
function waitForElement(id: string, timeout = 2000): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const found = document.getElementById(id);
    if (found) return resolve(found);
    const start = performance.now();
    const check = () => {
      const el = document.getElementById(id);
      if (el) return resolve(el);
      if (performance.now() - start > timeout) return resolve(null);
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  });
}

/**
 * Hook usato da Header/Footer.
 * `onNavigated` viene invocata sempre (utile per chiudere menu/drawer).
 */
export function useHomeSectionNav(onNavigated?: () => void) {
  const location = useLocation();
  const navigate = useNavigate();

  return useCallback(
    async (id: HomeSectionId | string) => {
      if (location.pathname === "/") {
        scrollToHomeSection(id);
        onNavigated?.();
        return;
      }
      onNavigated?.();
      await navigate({ to: "/", hash: id });
    },
    [location.pathname, navigate, onNavigated],
  );
}

/**
 * Da montare UNA SOLA VOLTA nella Home: reagisce all'hash iniziale
 * e a ogni cambio di hash sulla Home, aspetta che la sezione esista
 * e la porta in vista rispettando l'offset.
 * Non crea nuove istanze Lenis né ScrollTrigger.
 */
export function useHomeHashScroll() {
  const router = useRouter();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname !== "/") return;
    const hash = location.hash || window.location.hash.replace(/^#/, "");
    if (!hash) return;
    let cancelled = false;
    // Attendi che il layout della Home sia montato prima di calcolare la Y.
    const run = async () => {
      const el = await waitForElement(hash);
      if (cancelled || !el) return;
      // Un secondo rAF per lasciare che le sezioni pinned finiscano il primo layout.
      requestAnimationFrame(() => {
        if (cancelled) return;
        scrollToHomeSection(hash, { updateHash: false });
      });
    };
    void run();
    return () => {
      cancelled = true;
    };
    // location.hash cambia quando l'utente clicca un link con hash o usa back/forward
  }, [location.pathname, location.hash, router]);
}
