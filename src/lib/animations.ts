import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Advanced scroll animations for Masseria Don Gianvito.
 * Award-winning scroll interactions using GSAP + ScrollTrigger.
 */

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Magnetic Button Effect
// Elements follow the cursor with a magnetic pull when hovering nearby
// ─────────────────────────────────────────────────────────────────────────────

interface MagneticOptions {
  strength?: number; // 0-1, how strong the pull is
  radius?: number; // pixels, how far the effect extends
  ease?: number; // 0.1-1, smoothing factor
}

export function useMagnetic(options: MagneticOptions = {}) {
  const { strength = 0.3, radius = 100, ease = 0.15 } = options;
  const ref = useRef<HTMLElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius) {
        const factor = 1 - distance / radius;
        target.current = {
          x: distX * strength * factor,
          y: distY * strength * factor,
        };
      } else {
        target.current = { x: 0, y: 0 };
      }
    };

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * ease;
      pos.current.y += (target.current.y - pos.current.y) * ease;
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      raf.current = requestAnimationFrame(animate);
    };

    const onLeave = () => {
      target.current = { x: 0, y: 0 };
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
      el.style.transform = "";
    };
  }, [reduced, strength, radius, ease]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Text Reveal on Scroll
// Characters or words reveal with a staggered animation
// ─────────────────────────────────────────────────────────────────────────────

interface TextRevealOptions {
  type?: "chars" | "words" | "lines";
  stagger?: number; // seconds between each element
  duration?: number; // seconds per element
  y?: number; // pixels to travel
  delay?: number; // initial delay in seconds
  threshold?: number; // 0-1, when to trigger
}

export function useTextReveal(options: TextRevealOptions = {}) {
  const {
    type = "words",
    stagger = 0.03,
    duration = 0.6,
    y = 40,
    delay = 0,
    threshold = 0.8,
  } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);

    let elements: HTMLElement[] = [];

    if (type === "chars") {
      // Split text into characters
      const text = el.textContent || "";
      el.innerHTML = text
        .split("")
        .map((c) =>
          c === " "
            ? " "
            : `<span class="char-reveal" style="display:inline-block;overflow:hidden"><span class="char-inner" style="display:inline-block">${c}</span></span>`,
        )
        .join("");
      elements = Array.from(el.querySelectorAll(".char-inner"));
    } else if (type === "words") {
      const text = el.textContent || "";
      el.innerHTML = text
        .split(" ")
        .map(
          (w) =>
            `<span class="word-reveal" style="display:inline-block;overflow:hidden"><span class="word-inner" style="display:inline-block">${w}</span></span>`,
        )
        .join(" ");
      elements = Array.from(el.querySelectorAll(".word-inner"));
    } else {
      elements = Array.from(el.querySelectorAll("[data-reveal-line]"));
    }

    if (!elements.length) return;

    gsap.set(elements, { y, opacity: 0 });

    ScrollTrigger.create({
      trigger: el,
      start: `top ${100 - threshold * 100}%`,
      onEnter: () => {
        gsap.to(elements, {
          y: 0,
          opacity: 1,
          duration,
          stagger,
          delay,
          ease: "power3.out",
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === el) st.kill();
      });
    };
  }, [reduced, type, stagger, duration, y, delay, threshold]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Parallax Container
// Multiple elements with different parallax speeds
// ─────────────────────────────────────────────────────────────────────────────

interface ParallaxElement {
  selector: string;
  speed?: number; // 0-1, slower = more parallax
  direction?: "x" | "y" | "both";
}

interface ParallaxContainerOptions {
  elements: ParallaxElement[];
  scrub?: number;
  start?: string;
  end?: string;
}

export function useParallaxContainer(options: ParallaxContainerOptions) {
  const { elements, scrub = 0.8, start = "top bottom", end = "bottom top" } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      elements.forEach(({ selector, speed = 0.5, direction = "y" }) => {
        const el = root.querySelector<HTMLElement>(selector);
        if (!el) return;

        const fromVars: gsap.TweenVars = { ease: "none" };
        const toVars: gsap.TweenVars = {
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start,
            end,
            scrub,
          },
        };

        const move = (speed - 0.5) * 40; // -20 to +20 pixels

        if (direction === "x" || direction === "both") {
          fromVars.x = -move;
          toVars.x = move;
        }
        if (direction === "y" || direction === "both") {
          fromVars.y = -move;
          toVars.y = move;
        }

        gsap.fromTo(el, fromVars, toVars);
      });
    }, root);

    return () => ctx.revert();
  }, [reduced, elements, scrub, start, end]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Floating Ambient Animation
// Subtle continuous floating motion for decorative elements
// ─────────────────────────────────────────────────────────────────────────────

interface FloatOptions {
  y?: number; // vertical range in pixels
  x?: number; // horizontal range in pixels
  duration?: number; // seconds for one cycle
  delay?: number; // initial delay
  rotation?: number; // rotation range in degrees
  ease?: string; // GSAP ease
}

export function useFloat(options: FloatOptions = {}) {
  const { y = 10, x = 0, duration = 4, delay = 0, rotation = 0, ease = "sine.inOut" } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true, ease, delay });
    tl.to(el, {
      y: -y,
      x: x,
      rotation: rotation / 2,
      duration: duration / 2,
    });
    tl.to(
      el,
      {
        y: y,
        x: -x,
        rotation: -rotation / 2,
        duration: duration / 2,
      },
      "<",
    );

    return () => {
      tl.kill();
    };
  }, [reduced, y, x, duration, delay, rotation, ease]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Reveal on Scroll with ClipPath
// Smooth reveal using clip-path animation
// ─────────────────────────────────────────────────────────────────────────────

interface ClipRevealOptions {
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  ease?: string;
  stagger?: number;
  threshold?: number;
}

export function useClipReveal(options: ClipRevealOptions = {}) {
  const {
    direction = "up",
    duration = 0.8,
    ease = "power3.out",
    stagger = 0.1,
    threshold = 0.8,
  } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const getInitialClip = () => {
      switch (direction) {
        case "up":
          return "inset(100% 0% 0% 0%)";
        case "down":
          return "inset(0% 0% 100% 0%)";
        case "left":
          return "inset(0% 100% 0% 0%)";
        case "right":
          return "inset(0% 0% 0% 100%)";
      }
    };

    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!targets.length) return;

    targets.forEach((el) => {
      gsap.set(el, { clipPath: getInitialClip() });

      ScrollTrigger.create({
        trigger: el,
        start: `top ${100 - threshold * 100}%`,
        onEnter: () => {
          gsap.to(el, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration,
            ease,
          });
        },
        once: true,
      });
    });

    return () => {
      const targetsArray = Array.from(targets);
      ScrollTrigger.getAll().forEach((st) => {
        if (targetsArray.some((t) => st.vars.trigger === t)) st.kill();
      });
    };
  }, [reduced, direction, duration, ease, threshold]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Scale Reveal
// Elements scale up from a point while fading in
// ─────────────────────────────────────────────────────────────────────────────

interface ScaleRevealOptions {
  from?: "center" | "top" | "bottom" | "left" | "right";
  scale?: number;
  duration?: number;
  stagger?: number;
  threshold?: number;
}

export function useScaleReveal(options: ScaleRevealOptions = {}) {
  const {
    from = "center",
    scale = 0.85,
    duration = 0.7,
    stagger = 0.1,
    threshold = 0.85,
  } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = ref.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const getOrigin = () => {
      switch (from) {
        case "top":
          return "50% 0%";
        case "bottom":
          return "50% 100%";
        case "left":
          return "0% 50%";
        case "right":
          return "100% 50%";
        default:
          return "50% 50%";
      }
    };

    const targets = root.querySelectorAll<HTMLElement>("[data-scale-reveal]");
    targets.forEach((el) => {
      el.style.transformOrigin = getOrigin();
      gsap.set(el, { scale, opacity: 0 });

      ScrollTrigger.create({
        trigger: el,
        start: `top ${100 - threshold * 100}%`,
        onEnter: () => {
          gsap.to(el, {
            scale: 1,
            opacity: 1,
            duration,
            ease: "power3.out",
          });
        },
        once: true,
      });
    });

    return () => {
      const targetsArray = Array.from(targets);
      ScrollTrigger.getAll().forEach((st) => {
        if (targetsArray.some((t) => st.vars.trigger === t)) st.kill();
      });
    };
  }, [reduced, from, scale, duration, threshold]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Stagger Reveal Helper
// Apply staggered reveal to multiple elements
// ─────────────────────────────────────────────────────────────────────────────

export function staggerReveal(
  elements: Element[],
  options: {
    y?: number;
    stagger?: number;
    duration?: number;
    ease?: string;
    threshold?: number;
    start?: string;
  } = {},
) {
  const {
    y = 30,
    stagger = 0.08,
    duration = 0.6,
    ease = "power3.out",
    threshold = 0.85,
    start = "top 85%",
  } = options;

  gsap.registerPlugin(ScrollTrigger);

  gsap.set(elements, { y, opacity: 0 });

  ScrollTrigger.create({
    trigger: elements[0]?.parentElement || elements[0],
    start,
    onEnter: () => {
      gsap.to(elements, {
        y: 0,
        opacity: 1,
        duration,
        stagger,
        ease,
      });
    },
    once: true,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY: Custom Easing Curves
// ─────────────────────────────────────────────────────────────────────────────

export const EASING = {
  // Organic, nature-inspired curves
  organic: "power2.out",
  smooth: "power3.inOut",
  punch: "back.out(1.7)",
  elastic: "elastic.out(1, 0.5)",
  snap: "power4.out",

  // Smooth scroll-like
  butter: "power2.inOut",

  // Dramatic
  dramatic: "expo.out",
  gentle: "circ.out",
} as const;
