import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * useAnimaReveals
 * Hook per gestire le rivelazioni progressive basate su [data-reveal-group] e [data-reveal].
 * Mantiene la logica di visibilità predefinita (JS-independent) impostando lo stato iniziale in GSAP.
 */
export function useAnimaReveals(rootRef: React.RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const gruppi = gsap.utils.toArray<HTMLElement>("[data-reveal-group]", root);
      gruppi.forEach((gruppo) => {
        const elementi = gsap.utils.toArray<HTMLElement>("[data-reveal]", gruppo);
        if (!elementi.length) return;
        
        // Stato iniziale impostato da GSAP per evitare invisibilità senza JS
        gsap.set(elementi, { autoAlpha: 0, y: 12 });
        
        gsap.to(
          elementi,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: gruppo,
              start: "top 92%",
              once: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced, rootRef]);
}

/**
 * FotoSegnaposto
 * Componente funzionale per i placeholder fotografici con etichetta descrittiva.
 */
export function FotoSegnaposto({
  etichetta,
  ratio = "3 / 2",
  tone = "light",
  className = "",
}: {
  etichetta: string;
  ratio?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const scuro = tone === "dark";
  return (
    <figure
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        aspectRatio: ratio,
        background: scuro ? "var(--carbone)" : "var(--biscotto)",
      }}
    >
      <figcaption
        className="absolute inset-0 flex items-end p-4 md:p-6"
        style={{
          color: scuro ? "var(--bianco-calce)" : "var(--carbone)",
        }}
      >
        <span className="font-eyebrow text-[12px] leading-snug tracking-[0.18em] opacity-60 md:text-[13px]">
          FOTO — {etichetta}
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * AnimaPagina
 * Wrapper che fornisce il contesto per le animazioni GSAP.
 */
export function AnimaPagina({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useAnimaReveals(rootRef);
  return <div ref={rootRef} className="bg-[color:var(--bianco-calce)]">{children}</div>;
}
