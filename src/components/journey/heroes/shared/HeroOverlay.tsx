import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapterPath, type JourneyChapter } from "@/data/journey";
import type { AnimaId } from "@/data/masseria";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  chapter: JourneyChapter;
  next?: AnimaId;
  /** Se true usa "chars" (caratteri) invece di "words" (parole). */
  chars?: boolean;
  /** "center": titolo e intro centrati nell'hero. */
  align?: "left" | "center" | "right";
}

interface TextRevealOpts {
  ref: RefObject<HTMLElement | null>;
  type: "chars" | "words";
  stagger: number;
  duration: number;
  y: number;
  reduced: boolean;
}

/** Wrapper di useTextReveal: accetta un ref esterno. Niente splitting su "lines". */
function useHeadingReveal({ ref, type, stagger, duration, y, reduced }: TextRevealOpts) {
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    // Split per PAROLA dentro i nodi di testo: preserva <br>, <em> e
    // impedisce al browser di spezzare una parola a metà riga.
    if (!el.dataset.split) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      nodes.forEach((node) => {
        const frag = document.createDocumentFragment();
        (node.textContent || "").split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(" "));
            return;
          }
          const outer = document.createElement("span");
          outer.className = "hd-reveal";
          const inner = document.createElement("span");
          inner.className = "hd-inner";
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        node.replaceWith(frag);
      });
      el.dataset.split = "1";
    }
    const inners = Array.from(el.querySelectorAll<HTMLElement>(".hd-inner"));
    gsap.set(inners, { y, autoAlpha: 0 });
    const tween = gsap.to(inners, {
      y: 0,
      autoAlpha: 1,
      duration,
      stagger,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((s) => {
        if (s.trigger === el) s.kill();
      });
    };
  }, [ref, type, stagger, duration, y, reduced]);
}

/** Overlay testuale sopra il Canvas R3F: kicker, titolo, intro, scroll hint. */
export function HeroOverlay({ chapter, next, chars = false, align = "left" }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useHeadingReveal({
    ref: headingRef,
    type: chars ? "chars" : "words",
    // Le parole sono più larghe, meno stagger.
    stagger: chars ? 0.02 : 0.07,
    duration: 0.9,
    y: 32,
    reduced,
  });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x, y });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced]);

  const tx = mouse.x * 8;
  const ty = mouse.y * 6;

  return (
    <div
      className={`journey-shell hero-overlay${align !== "left" ? ` hero-overlay--${align}` : ""}`}
      style={{
        transform: reduced ? undefined : `translate3d(${tx}px, ${ty}px, 0)`,
        transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <Link to="/" hash="mappa" className="journey-text-link">
        ← La masseria dall'alto
      </Link>
      <div data-journey-reveal className="journey-chapter-heading">
        <p className="journey-kicker">
          Capitolo {chapter.number} / 04 · {chapter.name}
        </p>
        <h1 ref={headingRef}>
          {chapter.title[0]}
          <br />
          <em>{chapter.title[1]}</em>
        </h1>
        <p className="journey-intro">{chapter.introduction}</p>
      </div>
      <div className="journey-hero-bottom">
        <span>Scorri per entrare nel racconto ↓</span>
        {next ? (
          <Link to={chapterPath(next)} className="journey-text-link">
            {chapter.keyword} · prossimo {next} →
          </Link>
        ) : (
          <span>{chapter.keyword}</span>
        )}
      </div>
    </div>
  );
}
