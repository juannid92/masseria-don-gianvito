import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Scoped animations, progressive enhancement, live reduced-motion support. */
export function useJourneyMotion(ref: RefObject<HTMLElement | null>, key?: string) {
  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        ref.current!.querySelectorAll<HTMLElement>("[data-journey-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 36,
            autoAlpha: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          });
        });
        ref.current!.querySelectorAll<HTMLElement>("[data-journey-parallax]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });
      }, ref);
      return () => context.revert();
    });
    const refresh = () => ScrollTrigger.refresh();
    const images = ref.current.querySelectorAll("img");
    images.forEach((image) => image.addEventListener("load", refresh));
    document.fonts.ready.then(refresh);
    const frame = requestAnimationFrame(refresh);
    return () => {
      cancelAnimationFrame(frame);
      images.forEach((image) => image.removeEventListener("load", refresh));
      media.revert();
    };
  }, [ref, key]);
}
