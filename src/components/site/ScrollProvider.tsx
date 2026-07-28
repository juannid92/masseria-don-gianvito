import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * PROVIDER GLOBALE DELLO SCROLL — unica istanza Lenis del sito.
 * - Montato una sola volta in __root: nessuna route può crearne una seconda.
 * - Un solo callback nel ticker GSAP, lagSmoothing(0), nessun rAF parallelo.
 * - In reduced motion Lenis non viene nemmeno istanziato: scroll nativo.
 * - Cleanup completo: kill dei trigger, rimozione del ticker, destroy di Lenis.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const root = document.documentElement;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;
    let onLenisScroll: (() => void) | null = null;

    // Modalità ?verify=1 — utile a Playwright: disattiva lo smooth-scroll
    // così le posizioni finali sono deterministiche. Lenis non viene
    // istanziato affatto: fallback allo scroll nativo del browser.
    const verifyMode =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("verify") === "1";

    const teardownLenis = () => {
      if (onLenisScroll && lenis) lenis.off("scroll", onLenisScroll);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis = null;
      tick = null;
      onLenisScroll = null;
    };

    const setupLenis = () => {
      if (lenis) return;
      if (verifyMode) return;
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

      onLenisScroll = () => ScrollTrigger.update();
      lenis.on("scroll", onLenisScroll);

      tick = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };

    const applyMotionPreference = () => {
      const reduced = motionQuery.matches;
      root.classList.add("js-ready");
      root.classList.toggle("reduce-motion", reduced);
      if (reduced) teardownLenis();
      else setupLenis();
      ScrollTrigger.refresh();
    };

    applyMotionPreference();
    motionQuery.addEventListener("change", applyMotionPreference);

    // Refresh quando l'altezza reale della pagina si stabilizza.
    const refresh = () => ScrollTrigger.refresh();
    let fontsPromise: Promise<unknown> | null = null;
    if (document.fonts?.ready) {
      fontsPromise = document.fonts.ready.then(refresh).catch(() => undefined);
    }
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });

    return () => {
      motionQuery.removeEventListener("change", applyMotionPreference);
      window.removeEventListener("load", refresh);
      teardownLenis();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      void fontsPromise;
    };
  }, []);

  return <>{children}</>;
}
