import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Fotografie reali da assegnare qui (img). Finché sono null si vede la scena "a luce".
const scenes: { img: string | null; title: [string, string]; desc: string; label: string }[] = [
  {
    img: null,
    title: ["La sera comincia", "dalla campagna."],
    desc: "Il percorso incontra l’agriturismo.",
    label: "L’arrivo",
  },
  {
    img: null,
    title: ["La luce cambia.", "Il tempo rallenta."],
    desc: "Un altro punto di vista sulla masseria.",
    label: "La soglia",
  },
  {
    img: null,
    title: ["Entrare.", "Sentirsi parte."],
    desc: "Il racconto continua, dentro il cortile.",
    label: "Il luogo",
  },
  {
    img: null,
    title: ["Poi ci si siede.", "Il viaggio continua."],
    desc: "Dalla storia dei luoghi alla tavola.",
    label: "La tavola",
  },
];

/**
 * Hero Agriturismo: quattro scene a tutto schermo, testo centrato in colonna.
 * Le righe del titolo entrano ed escono "da sotto una maschera"; un binario
 * in basso mostra a che punto della sera si è.
 */
export function AgriturismoCinema() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const panels = gsap.utils.toArray<HTMLElement>(".agri-scene", root.current);
        const steps = gsap.utils.toArray<HTMLElement>(".agri-rail-step", root.current);
        const fill = root.current!.querySelector<HTMLElement>(".agri-rail-fill");
        gsap.set(panels.slice(1), { autoAlpha: 0 });
        panels
          .slice(1)
          .forEach((p) =>
            gsap.set(p.querySelectorAll(".agri-line > span, .agri-scene-meta > *"), {
              yPercent: 110,
            }),
          );
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            onUpdate: (self) => {
              const idx = Math.min(
                steps.length - 1,
                Math.floor(self.progress * steps.length * 0.999),
              );
              steps.forEach((s, i) => s.classList.toggle("is-active", i === idx));
              if (fill) fill.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        panels.forEach((panel, i) => {
          tl.fromTo(
            panel.querySelector(".agri-scene-light"),
            { scale: 1, xPercent: -4 },
            { scale: 1.15, xPercent: 4, duration: 1.25 },
            i,
          );
          if (i === 0) return;
          const prev = panels[i - 1];
          tl.to(
            prev.querySelectorAll(".agri-line > span, .agri-scene-meta > *"),
            { yPercent: -110, duration: 0.3, stagger: 0.04, ease: "power2.in" },
            i - 0.15,
          )
            .to(prev, { autoAlpha: 0, duration: 0.3 }, i)
            .to(panel, { autoAlpha: 1, duration: 0.3 }, i - 0.05)
            .to(
              panel.querySelectorAll(".agri-line > span, .agri-scene-meta > *"),
              { yPercent: 0, duration: 0.35, stagger: 0.05, ease: "power3.out" },
              i + 0.05,
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
      className="agri-cinema"
      data-tone="dark"
      aria-label="Capitolo 04, Agriturismo"
    >
      <div className="agri-cinema-stage">
        {scenes.map((scene, i) => (
          <article key={scene.label} className="agri-scene" data-scene={i}>
            {scene.img ? (
              <img src={scene.img} alt={scene.label} loading={i === 0 ? "eager" : "lazy"} />
            ) : (
              <div className="agri-scene-light" aria-hidden="true" />
            )}
            <div className="agri-scene-grain" aria-hidden="true" />
            <div className="agri-scene-copy">
              <p className="agri-scene-meta">
                <span>Capitolo 04 · Agriturismo</span>
              </p>
              {i === 0 ? (
                <h1 className="agri-title">
                  <span className="agri-line">
                    <span>{scene.title[0]}</span>
                  </span>
                  <span className="agri-line">
                    <span>
                      <em>{scene.title[1]}</em>
                    </span>
                  </span>
                </h1>
              ) : (
                <h2 className="agri-title">
                  <span className="agri-line">
                    <span>{scene.title[0]}</span>
                  </span>
                  <span className="agri-line">
                    <span>
                      <em>{scene.title[1]}</em>
                    </span>
                  </span>
                </h2>
              )}
              <p className="agri-scene-meta agri-scene-desc">
                <span>{scene.desc}</span>
              </p>
            </div>
          </article>
        ))}
        <div className="agri-rail" aria-hidden="true">
          <div className="agri-rail-track">
            <span className="agri-rail-fill" />
          </div>
          <ol>
            {scenes.map((s, i) => (
              <li key={s.label} className={`agri-rail-step${i === 0 ? " is-active" : ""}`}>
                <span>0{i + 1}</span> {s.label}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
