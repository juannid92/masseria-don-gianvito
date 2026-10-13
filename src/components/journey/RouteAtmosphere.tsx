import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

/** Route entrance only; never intercept links, history, or focus. */
export function RouteAtmosphere() {
  const location = useLocation();
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current)
        progress.current.style.transform = `scaleX(${height > 0 ? Math.max(0, Math.min(1, window.scrollY / height)) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo("main", { opacity: 0.45 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
      });
      return () => ctx.revert();
    });
    const refreshFrame = requestAnimationFrame(() => {
      (window as unknown as { __lenis?: Lenis }).__lenis?.resize();
      ScrollTrigger.refresh();
      update();
    });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(refreshFrame);
      media.revert();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [location.pathname]);
  return <div ref={progress} className="journey-route-progress" aria-hidden="true" />;
}
