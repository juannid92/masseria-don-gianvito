import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Real photographs can be assigned here; existing WebPs are flat placeholders.
const scenes: { img: string | null; title: string; desc: string; label: string }[] = [
  {
    img: null,
    title: "La sera comincia\ndalla campagna.",
    desc: "Il percorso incontra l’agriturismo.",
    label: "L’arrivo",
  },
  {
    img: null,
    title: "La luce cambia.\nIl tempo rallenta.",
    desc: "Un altro punto di vista sulla masseria.",
    label: "La soglia",
  },
  {
    img: null,
    title: "Entrare.\nSentirsi parte.",
    desc: "Il racconto continua, dentro il cortile.",
    label: "Il luogo",
  },
  {
    img: null,
    title: "Poi ci si siede.\nIl viaggio continua.",
    desc: "Dalla storia dei luoghi alla tavola.",
    label: "La tavola",
  },
];
export function AgriturismoCinema() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".journey-cinema-scene", root.current);
        gsap.set(panels.slice(1), { autoAlpha: 0 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
        });
        panels.forEach((panel, i) => {
          if (i > 0)
            tl.to(panels[i - 1], { autoAlpha: 0, duration: 0.35 }, i).to(
              panel,
              { autoAlpha: 1, duration: 0.35 },
              i,
            );
          tl.fromTo(
            panel.querySelector("img, .journey-cinema-depth"),
            { scale: 1.03 },
            { scale: 1.1, duration: 1.25, ease: "none" },
            i,
          );
        });
      }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);
  return (
    <section
      ref={root}
      className="journey-cinema"
      data-tone="dark"
      aria-label="Capitolo 04, Agriturismo"
    >
      <div className="journey-cinema-stage">
        {scenes.map((scene, i) => (
          <article key={scene.label} className="journey-cinema-scene">
            {scene.img ? (
              <img
                src={scene.img}
                alt={scene.label}
                width="1024"
                height="1024"
                loading={i === 0 ? "eager" : "lazy"}
              />
            ) : (
              <div className="journey-cinema-depth" aria-hidden="true">
                {scene.label}
              </div>
            )}
            <div className="journey-cinema-scrim" />
            <div className="journey-cinema-copy journey-shell">
              <p className="journey-kicker">04 · Agriturismo / {scene.label}</p>
              {i === 0 ? <h1>{scene.title}</h1> : <h2>{scene.title}</h2>}
              <p>{scene.desc}</p>
              <span className="journey-cinema-note">
                Prototipo · fotografia da inserire e testi da validare
              </span>
            </div>
            <div className="journey-cinema-number" aria-hidden="true">
              0{i + 1} / 04
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
