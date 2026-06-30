import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ParallaxProps = {
  children: ReactNode;
  /** Velocità: <1 più lento dello scroll, >1 più veloce. Negativo = inverso. */
  speed?: number;
  className?: string;
  as?: "div" | "section" | "span";
};

/**
 * Componente parallax riutilizzabile. Usa GSAP+ScrollTrigger con scrub.
 * Fallback statico se prefers-reduced-motion.
 */
export function Parallax({
  children,
  speed = 0.4,
  className,
  as: As = "div",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const distance = 120 * speed;
    const tween = gsap.fromTo(
      el,
      { yPercent: -distance / 10 },
      {
        yPercent: distance / 10,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [speed, reduced]);

  return (
    <As ref={ref as never} className={className} data-speed={speed}>
      {children}
    </As>
  );
}
