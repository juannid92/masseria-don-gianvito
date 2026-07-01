import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * UNICO MOTORE DI SCROLL.
 * - Lenis guida lo scroll; il suo raf è pilotato dal ticker di GSAP.
 * - ScrollTrigger.update() è invocato ad ogni tick di scroll di Lenis.
 * - scrollerProxy(window) allinea le misure di ScrollTrigger allo scroll reale del document.
 * - Refresh globale dopo fonts.ready, window.load e ogni <img>/<video> caricata,
 *   così start/end vengono calcolati con l'altezza definitiva → niente offset.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const root = document.documentElement;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionClass = () => {
      root.classList.add("js-ready");
      root.classList.toggle("reduce-motion", motionQuery.matches);
    };
    syncMotionClass();
    motionQuery.addEventListener("change", syncMotionClass);

    const revealSelector = [
      ".reveal",
      "[data-reveal]",
      "[data-reveal-item]",
      "[data-product]",
      "[data-prod]",
      "[data-cell]",
      "[data-portrait]",
      "[data-portrait-mobile]",
      "[data-bridge-cue]",
      ".brace-light-reveal",
    ].join(",");

    const forceVisibleReveals = () => {
      gsap.utils.toArray<HTMLElement>(revealSelector).forEach((el) => {
        const style = window.getComputedStyle(el);
        if (Number.parseFloat(style.opacity) < 1) {
          gsap.set(el, { opacity: 1, autoAlpha: 1, y: 0, yPercent: 0, filter: "none" });
        }
      });
    };

    const fallback = window.setTimeout(forceVisibleReveals, 3000);

    if (motionQuery.matches) {
      forceVisibleReveals();
      return () => {
        window.clearTimeout(fallback);
        motionQuery.removeEventListener("change", syncMotionClass);
      };
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Sync Lenis → ScrollTrigger (unico listener globale, no doppi handler)
    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    // scrollerProxy: allinea le misure di ScrollTrigger allo scroll reale (window/document)
    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return window.scrollY;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Reveal globale: i contenuti sono visibili di default; se JS è pronto entrano una volta sola.
    const revealTweens = gsap.utils.toArray<HTMLElement>(revealSelector).map((el) =>
      gsap.to(el, {
        opacity: 1,
        autoAlpha: 1,
        y: 0,
        yPercent: 0,
        filter: "none",
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
          invalidateOnRefresh: true,
        },
      }),
    );

    // ─── Refresh globale quando cambia l'altezza reale della pagina ───
    const refresh = () => ScrollTrigger.refresh();

    const refreshAfterStableAssets = async () => {
      try {
        await document.fonts?.ready;
        await Promise.all(
          Array.from(document.images).map((img) =>
            img.decode ? img.decode().catch(() => undefined) : Promise.resolve(undefined),
          ),
        );
      } finally {
        ScrollTrigger.refresh();
      }
    };

    // 1) fonts pronti (evita salti dopo il rendering tipografico)
    let fontsPromise: Promise<unknown> | null = null;
    if (document.fonts?.ready) {
      fontsPromise = document.fonts.ready.then(refresh).catch(() => undefined);
    }
    void refreshAfterStableAssets();

    // 2) window.load (immagini/video del primo paint)
    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    // 3) ogni immagine/video che finisce di caricare in seguito (lazy, route change)
    const attachMediaListeners = () => {
      const media = document.querySelectorAll<HTMLImageElement | HTMLVideoElement>(
        "img, video",
      );
      media.forEach((el) => {
        if (el instanceof HTMLImageElement) {
          if (!el.complete) el.addEventListener("load", refreshAfterStableAssets, { once: true });
        } else {
          el.addEventListener("loadedmetadata", refreshAfterStableAssets, { once: true });
        }
      });
    };
    attachMediaListeners();

    const mo = new MutationObserver(() => {
      // debounce naturale via rAF
      requestAnimationFrame(attachMediaListeners);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // 4) resize → ScrollTrigger già ascolta, ma forziamo un refresh finale
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(fallback);
      motionQuery.removeEventListener("change", syncMotionClass);
      mo.disconnect();
      revealTweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
      lenis.off("scroll", onLenisScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      void fontsPromise;
    };
  }, []);

  return <>{children}</>;
}
