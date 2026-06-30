import { useEffect } from "react";

/**
 * Sfondo continuo full-page: imposta --scroll-progress (0..1) sul <html>
 * legato allo scroll globale. La transizione cromatica vera è in CSS
 * (.bg-continuous in styles.css). Aggiunge anche grana viva.
 */
export function ContinuousBackground() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      doc.style.setProperty("--scroll-progress", p.toFixed(4));
      raf = 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="bg-continuous grain pointer-events-none fixed inset-0 -z-10"
    />
  );
}
