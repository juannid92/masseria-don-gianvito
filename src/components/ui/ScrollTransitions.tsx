import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Section transition effects for award-winning scroll experiences.
 * Creates seamless connections between sections with dramatic reveals.
 */

interface SectionCurtainOptions {
  direction?: "up" | "down";
  color?: string;
  duration?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Section Curtain Reveal
// A colored curtain that wipes across when entering the section
// ─────────────────────────────────────────────────────────────────────────────

export function useSectionCurtain(options: SectionCurtainOptions = {}) {
  const { direction = "up", color = "var(--pietra-800)", duration = 0.8 } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    // Create curtain element
    const curtain = document.createElement("div");
    curtain.className = "section-curtain";
    Object.assign(curtain.style, {
      position: "absolute",
      left: "0",
      right: "0",
      height: "100%",
      backgroundColor: color,
      transformOrigin: direction === "up" ? "bottom center" : "top center",
      transform: direction === "up" ? "scaleY(1)" : "scaleY(1)",
      zIndex: "10",
      pointerEvents: "none",
    });

    root.style.position = "relative";
    root.style.overflow = "hidden";
    root.insertBefore(curtain, root.firstChild);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 80%",
        end: "top 20%",
        scrub: 0.5,
      },
    });

    tl.to(curtain, {
      scaleY: 0,
      ease: "power3.inOut",
      duration,
    });

    return () => {
      tl.kill();
      if (curtain.parentNode) curtain.parentNode.removeChild(curtain);
    };
  }, [reduced, direction, color, duration]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Section Split Reveal
// Content splits from center and reveals
// ─────────────────────────────────────────────────────────────────────────────

interface SplitRevealOptions {
  direction?: "horizontal" | "vertical";
  duration?: number;
  stagger?: number;
}

export function useSplitReveal(options: SplitRevealOptions = {}) {
  const { direction = "vertical", duration = 0.8, stagger = 0.1 } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    // Create split panels
    const leftPanel = document.createElement("div");
    const rightPanel = document.createElement("div");

    Object.assign(leftPanel.style, {
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "0",
      width: "50%",
      backgroundColor: "inherit",
      zIndex: "10",
      transformOrigin: direction === "vertical" ? "left center" : "top center",
    });

    Object.assign(rightPanel.style, {
      position: "absolute",
      top: "0",
      bottom: "0",
      right: "0",
      width: "50%",
      backgroundColor: "inherit",
      zIndex: "10",
      transformOrigin: direction === "vertical" ? "right center" : "bottom center",
    });

    root.style.position = "relative";
    root.style.overflow = "hidden";
    root.insertBefore(leftPanel, root.firstChild);
    root.insertBefore(rightPanel, root.firstChild);

    gsap.set([leftPanel, rightPanel], { scale: 1 });

    ScrollTrigger.create({
      trigger: root,
      start: "top 75%",
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to(leftPanel, {
          scaleX: 0,
          duration,
          ease: "power3.inOut",
          transformOrigin: direction === "vertical" ? "left center" : "top center",
        });
        tl.to(
          rightPanel,
          {
            scaleX: 0,
            duration,
            ease: "power3.inOut",
            transformOrigin: direction === "vertical" ? "right center" : "bottom center",
          },
          `-=${duration - stagger}`,
        );
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === root) st.kill();
      });
      [leftPanel, rightPanel].forEach((p) => {
        if (p.parentNode) p.parentNode.removeChild(p);
      });
    };
  }, [reduced, direction, duration, stagger]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Marquee Text
// Continuous scrolling text effect
// ─────────────────────────────────────────────────────────────────────────────

interface MarqueeOptions {
  speed?: number; // pixels per second
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}

export function useMarquee(options: MarqueeOptions = {}) {
  const { speed = 50, direction = "left", pauseOnHover = true } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const content = el.querySelector<HTMLElement>("[data-marquee-content]");
    if (!content) return;

    const text = content.textContent || "";
    const width = content.offsetWidth;

    // Duplicate content for seamless loop
    content.innerHTML = `${text} <span aria-hidden="true">${text}</span>`;

    const distance = direction === "left" ? -width : width;
    const tl = gsap.timeline({ repeat: -1 });

    tl.fromTo(
      content,
      { x: 0 },
      {
        x: distance,
        duration: width / speed,
        ease: "none",
      },
    );

    if (pauseOnHover) {
      const onEnter = () => tl.pause();
      const onLeave = () => tl.resume();
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);

      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
        tl.kill();
      };
    }

    return () => tl.kill();
  }, [reduced, speed, direction, pauseOnHover]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Pin & Reveal
// Pins section and reveals content progressively
// ─────────────────────────────────────────────────────────────────────────────

interface PinRevealOptions {
  pin?: boolean;
  pinSpacing?: boolean;
  duration?: number; // pin duration as percentage of scroll
  stagger?: number;
}

export function usePinReveal(options: PinRevealOptions = {}) {
  const { pin = true, pinSpacing = true, duration = 1, stagger = 0.05 } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const elements = root.querySelectorAll<HTMLElement>("[data-pin-reveal]");
    if (!elements.length) return;

    gsap.set(elements, { y: 50, opacity: 0 });

    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: `+=${duration * 100}%`,
      pin,
      pinSpacing,
      onEnter: () => {
        gsap.to(elements, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger,
          ease: "power3.out",
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === root) st.kill();
      });
    };
  }, [reduced, pin, pinSpacing, duration, stagger]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Scroll Progress
// Shows scroll progress through a section
// ─────────────────────────────────────────────────────────────────────────────

interface ScrollProgressOptions {
  height?: number; // height of progress bar
  color?: string;
  position?: "top" | "bottom";
}

export function useScrollProgress(options: ScrollProgressOptions = {}) {
  const { height = 3, color = "var(--oro-antico)", position = "top" } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    Object.assign(progressBar.style, {
      position: "absolute",
      left: "0",
      [position]: "0",
      width: "0%",
      height: `${height}px`,
      backgroundColor: color,
      zIndex: "20",
      transformOrigin: "left center",
    });

    root.style.position = "relative";
    root.insertBefore(progressBar, root.firstChild);

    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progressBar.style.width = `${self.progress * 100}%`;
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === root) st.kill();
      });
      if (progressBar.parentNode) progressBar.parentNode.removeChild(progressBar);
    };
  }, [reduced, height, color, position]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Character Animation
// Each character animates in sequence
// ─────────────────────────────────────────────────────────────────────────────

interface CharAnimationOptions {
  type?: "fade" | "slide" | "scale" | "rotate";
  stagger?: number;
  duration?: number;
  threshold?: number;
}

export function useCharAnimation(options: CharAnimationOptions = {}) {
  const { type = "slide", stagger = 0.02, duration = 0.5, threshold = 0.85 } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    const text = el.textContent || "";
    const chars = text.split("").map((char) => {
      const span = document.createElement("span");
      span.className = "char-animated";
      span.textContent = char === " " ? " " : char;
      span.style.display = "inline-block";
      span.style.overflow = "hidden";
      return span;
    });

    el.innerHTML = "";
    chars.forEach((char) => el.appendChild(char));

    // Set initial state based on type
    chars.forEach((char) => {
      switch (type) {
        case "slide":
          gsap.set(char, { y: "100%", opacity: 0 });
          break;
        case "scale":
          gsap.set(char, { scale: 0, opacity: 0 });
          break;
        case "rotate":
          gsap.set(char, { rotation: 90, opacity: 0 });
          break;
        default:
          gsap.set(char, { opacity: 0 });
      }
    });

    ScrollTrigger.create({
      trigger: el,
      start: `top ${100 - threshold * 100}%`,
      onEnter: () => {
        chars.forEach((char, i) => {
          const delay = i * stagger;
          switch (type) {
            case "slide":
              gsap.to(char, { y: "0%", opacity: 1, duration, delay, ease: "power3.out" });
              break;
            case "scale":
              gsap.to(char, { scale: 1, opacity: 1, duration, delay, ease: "back.out(1.7)" });
              break;
            case "rotate":
              gsap.to(char, { rotation: 0, opacity: 1, duration, delay, ease: "power3.out" });
              break;
            default:
              gsap.to(char, { opacity: 1, duration, delay });
          }
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === el) st.kill();
      });
    };
  }, [reduced, type, stagger, duration, threshold]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Sticky Image Reveal
// Image reveals as user scrolls past
// ─────────────────────────────────────────────────────────────────────────────

interface StickyImageRevealOptions {
  direction?: "up" | "down" | "left" | "right";
  maskSize?: number;
  duration?: number;
}

export function useStickyImageReveal(options: StickyImageRevealOptions = {}) {
  const { direction = "up", maskSize = 100, duration = 1.2 } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const image = root.querySelector("img");
    if (!image) return;

    const getMask = () => {
      switch (direction) {
        case "up":
          return `inset(${maskSize}% 0% 0% 0%)`;
        case "down":
          return `inset(0% 0% ${maskSize}% 0%)`;
        case "left":
          return `inset(0% ${maskSize}% 0% 0%)`;
        case "right":
          return `inset(0% 0% 0% ${maskSize}%)`;
        default:
          return `inset(${maskSize}% 0% 0% 0%)`;
      }
    };

    gsap.set(image, { clipPath: getMask() });

    ScrollTrigger.create({
      trigger: root,
      start: "top 70%",
      end: "top 20%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const currentMask = () => {
          switch (direction) {
            case "up":
              return `inset(${maskSize * (1 - progress)}% 0% 0% 0%)`;
            case "down":
              return `inset(0% 0% ${maskSize * (1 - progress)}% 0%)`;
            case "left":
              return `inset(0% ${maskSize * (1 - progress)}% 0% 0%)`;
            case "right":
              return `inset(0% 0% 0% ${maskSize * (1 - progress)}%)`;
            default:
              return `inset(${maskSize * (1 - progress)}% 0% 0% 0%)`;
          }
        };
        image.style.clipPath = currentMask();
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === root) st.kill();
      });
    };
  }, [reduced, direction, maskSize, duration]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Section Transition Wrapper
// Wraps sections with smooth transition effects
// ─────────────────────────────────────────────────────────────────────────────

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  type?: "curtain" | "slide" | "fade" | "scale";
  color?: string;
}

export function SectionTransition({
  children,
  className = "",
  type = "fade",
  color = "var(--carbone)",
}: SectionTransitionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "section-transition-overlay";
    Object.assign(overlay.style, {
      position: "absolute",
      inset: "0",
      backgroundColor: color,
      zIndex: "100",
      pointerEvents: "none",
    });

    root.style.position = "relative";
    root.style.overflow = "hidden";
    root.insertBefore(overlay, root.firstChild);

    let tl: gsap.core.Timeline;

    switch (type) {
      case "slide":
        gsap.set(overlay, { xPercent: type === "slide" ? -100 : 0 });
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.5,
          },
        });
        tl.to(overlay, { xPercent: 100, ease: "power2.inOut" });
        break;

      case "curtain":
        gsap.set(overlay, { scaleY: 1, transformOrigin: "bottom center" });
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.6,
          },
        });
        tl.to(overlay, { scaleY: 0, transformOrigin: "top center", ease: "power3.inOut" });
        break;

      case "scale":
        gsap.set(overlay, { scale: 1.5, opacity: 1 });
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.5,
          },
        });
        tl.to(overlay, { scale: 1, opacity: 0, ease: "power2.out" });
        break;

      default: // fade
        gsap.set(overlay, { opacity: 1 });
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "top 30%",
            scrub: 0.5,
          },
        });
        tl.to(overlay, { opacity: 0, ease: "power2.out" });
    }

    return () => {
      tl.kill();
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };
  }, [reduced, type, color]);

  return (
    <section ref={ref} className={`section-transition ${className}`}>
      {children}
    </section>
  );
}
