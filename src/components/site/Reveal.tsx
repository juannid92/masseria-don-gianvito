import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Reveal accessibile: visibile di default, animato una sola volta quando JS è pronto. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const items = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
    const targets = items.length ? Array.from(items) : [el];

    const tween = gsap.to(targets, {
      opacity: 1,
      autoAlpha: 1,
      y: 0,
      filter: "none",
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.12,
      delay,
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay, reduced]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
