import { useRef, useEffect, type CSSProperties } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Advanced hover effects for interactive elements.
 * Creates award-winning micro-interactions that feel premium.
 */

interface HoverScaleOptions {
  scale?: number;
  duration?: number;
  ease?: string;
}

interface HoverRevealOptions {
  direction?: "top" | "bottom" | "left" | "right";
  duration?: number;
  ease?: string;
}

interface HoverShimmerOptions {
  duration?: number;
  color?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Hover Scale Effect
// Scale up smoothly on hover
// ─────────────────────────────────────────────────────────────────────────────

export function useHoverScale(options: HoverScaleOptions = {}) {
  const { scale = 1.05, duration = 0.3, ease = "power2.out" } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const isHovered = useRef(false);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const onEnter = () => {
      isHovered.current = true;
      gsap.to(el, { scale, duration, ease });
    };

    const onLeave = () => {
      isHovered.current = false;
      gsap.to(el, { scale: 1, duration, ease });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, scale, duration, ease]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Hover Reveal (Background/Overlay)
// Reveals a background layer from a direction on hover
// ─────────────────────────────────────────────────────────────────────────────

export function useHoverReveal(options: HoverRevealOptions = {}) {
  const { direction = "bottom", duration = 0.4, ease = "power3.out" } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const overlay = document.createElement("span");
    overlay.className = "hover-reveal-overlay";
    overlay.setAttribute("aria-hidden", "true");
    Object.assign(overlay.style, {
      position: "absolute",
      inset: "0",
      zIndex: "0",
      pointerEvents: "none",
      overflow: "hidden",
    });

    const inner = document.createElement("span");
    inner.className = "hover-reveal-inner";
    Object.assign(inner.style, {
      position: "absolute",
      inset: "0",
      transformOrigin: getOrigin(direction),
    });

    overlay.appendChild(inner);
    el.style.position = "relative";
    el.style.overflow = "hidden";
    el.insertBefore(overlay, el.firstChild);

    // Set initial state
    gsap.set(overlay, { overflow: "hidden" });
    gsap.set(inner, { scale: getScale(direction) });

    const onEnter = () => {
      gsap.to(inner, { scale: 1, duration, ease });
    };

    const onLeave = () => {
      gsap.to(inner, { scale: getScale(direction), duration, ease });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };
  }, [reduced, direction, duration, ease]);

  return ref;
}

function getOrigin(dir: string) {
  switch (dir) {
    case "top":
      return "50% 100%";
    case "bottom":
      return "50% 0%";
    case "left":
      return "100% 50%";
    case "right":
      return "0% 50%";
    default:
      return "50% 50%";
  }
}

function getScale(dir: string) {
  switch (dir) {
    case "top":
      return "1, 0";
    case "bottom":
      return "1, 0";
    case "left":
      return "0, 1";
    case "right":
      return "0, 1";
    default:
      return "0, 0";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Magnetic Pull Effect
// Element follows cursor with elastic pull
// ─────────────────────────────────────────────────────────────────────────────

interface MagneticEffectOptions {
  strength?: number;
  ease?: number;
}

export function useMagneticEffect(options: MagneticEffectOptions = {}) {
  const { strength = 0.4, ease = 0.15 } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      target.current = {
        x: (e.clientX - centerX) * strength,
        y: (e.clientY - centerY) * strength,
      };
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

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reduced, strength, ease]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Text Strikethrough on Hover
// Animated line strikes through text
// ─────────────────────────────────────────────────────────────────────────────

interface StrikethroughOptions {
  color?: string;
  height?: number;
  duration?: number;
  ease?: string;
}

export function useStrikethrough(options: StrikethroughOptions = {}) {
  const { color = "currentColor", height = 2, duration = 0.3, ease = "power2.inOut" } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const line = document.createElement("span");
    line.className = "strikethrough-line";
    Object.assign(line.style, {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: "100%",
      height: `${height}px`,
      backgroundColor: color,
      transformOrigin: "left center",
      transform: "scaleX(0)",
      transition: "none",
      zIndex: "1",
    });

    el.style.position = "relative";
    el.style.display = "inline-block";
    el.appendChild(line);

    const onEnter = () => {
      gsap.to(line, { scaleX: 1, duration, ease });
    };

    const onLeave = () => {
      gsap.to(line, { scaleX: 0, duration, ease, transformOrigin: "right center" });
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      if (line.parentNode) line.parentNode.removeChild(line);
    };
  }, [reduced, color, height, duration, ease]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Image Ken Burns Effect
// Subtle zoom and pan on images
// ─────────────────────────────────────────────────────────────────────────────

interface KenBurnsOptions {
  scale?: number;
  duration?: number;
  delay?: number;
}

export function useKenBurns(options: KenBurnsOptions = {}) {
  const { scale = 1.1, duration = 8, delay = 0 } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el, {
      scale,
      duration,
      ease: "sine.inOut",
      delay,
    });

    return () => {
      tl.kill();
    };
  }, [reduced, scale, duration, delay]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: Shimmer Effect
// Light sweep across element
// ─────────────────────────────────────────────────────────────────────────────

export function useShimmer(options: HoverShimmerOptions = {}) {
  const { duration = 0.6, color = "rgba(255,255,255,0.3)" } = options;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    const shimmer = document.createElement("span");
    shimmer.className = "shimmer-effect";
    Object.assign(shimmer.style, {
      position: "absolute",
      top: "0",
      left: "-100%",
      width: "50%",
      height: "100%",
      background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      pointerEvents: "none",
      zIndex: "1",
    });

    el.style.position = "relative";
    el.style.overflow = "hidden";
    el.insertBefore(shimmer, el.firstChild);

    const onEnter = () => {
      gsap.to(shimmer, {
        left: "200%",
        duration,
        ease: "power2.inOut",
      });
    };

    el.addEventListener("mouseenter", onEnter);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      if (shimmer.parentNode) shimmer.parentNode.removeChild(shimmer);
    };
  }, [reduced, duration, color]);

  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Magnetic Button
// Button that follows cursor with elastic effect
// ─────────────────────────────────────────────────────────────────────────────

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({ children, className = "", strength = 0.3 }: MagneticButtonProps) {
  const magnetRef = useMagneticEffect({ strength });

  return (
    <button
      ref={magnetRef as React.RefObject<HTMLButtonElement>}
      className={`magnetic-button ${className}`}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Reveal Link
// Link with animated underline reveal
// ─────────────────────────────────────────────────────────────────────────────

interface RevealLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
  external?: boolean;
  onClick?: () => void;
}

export function RevealLink({
  href,
  children,
  className = "",
  underlineColor,
  external = false,
  onClick,
}: RevealLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const link = linkRef.current;
    if (!link) return;

    const line = document.createElement("span");
    line.className = "reveal-link-line";
    Object.assign(line.style, {
      position: "absolute",
      bottom: "-2px",
      left: "0",
      width: "100%",
      height: "1px",
      backgroundColor: underlineColor || "currentColor",
      transformOrigin: "left center",
      transform: "scaleX(0)",
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    });

    link.style.position = "relative";
    link.style.display = "inline-block";
    link.appendChild(line);

    const onEnter = () => {
      line.style.transform = "scaleX(1)";
      line.style.transformOrigin = "left center";
    };

    const onLeave = () => {
      line.style.transformOrigin = "right center";
      line.style.transform = "scaleX(0)";
    };

    link.addEventListener("mouseenter", onEnter);
    link.addEventListener("mouseleave", onLeave);

    return () => {
      link.removeEventListener("mouseenter", onEnter);
      link.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, underlineColor]);

  return (
    <a
      ref={linkRef}
      href={href}
      className={`reveal-link ${className}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Image with Parallax
// Image that moves slightly on mouse move
// ─────────────────────────────────────────────────────────────────────────────

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  strength?: number;
  style?: CSSProperties;
}

export function ParallaxImage({
  src,
  alt,
  className = "",
  strength = 10,
  style,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      gsap.to(image, {
        x: x * strength,
        y: y * strength,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(image, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, strength]);

  return (
    <div ref={containerRef} className={`parallax-image-container ${className}`} style={style}>
      <img ref={imageRef} src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT: Glow Button
// Button with glow effect on hover
// ─────────────────────────────────────────────────────────────────────────────

interface GlowButtonProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function GlowButton({
  children,
  className = "",
  glowColor = "var(--oro-antico)",
  onClick,
  type = "button",
}: GlowButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const btn = buttonRef.current;
    if (!btn) return;

    const glow = document.createElement("span");
    glow.className = "glow-effect";
    Object.assign(glow.style, {
      position: "absolute",
      inset: "-2px",
      borderRadius: "inherit",
      background: `radial-gradient(circle, ${glowColor}40 0%, transparent 70%)`,
      opacity: "0",
      pointerEvents: "none",
      zIndex: "-1",
      filter: "blur(20px)",
      transition: "opacity 0.3s ease",
    });

    btn.style.position = "relative";
    btn.style.zIndex = "1";
    btn.insertBefore(glow, btn.firstChild);

    const onEnter = () => {
      glow.style.opacity = "1";
    };

    const onLeave = () => {
      glow.style.opacity = "0";
    };

    btn.addEventListener("mouseenter", onEnter);
    btn.addEventListener("mouseleave", onLeave);

    return () => {
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, glowColor]);

  return (
    <button ref={buttonRef} type={type} className={`glow-button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
