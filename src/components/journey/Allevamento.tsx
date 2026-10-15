import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AllevamentoHero } from "./heroes/AllevamentoHero";
import { HeroOverlay } from "./heroes/shared/HeroOverlay";
import { chapterPath, JOURNEY, type JourneyChapter } from "@/data/journey";
import { useJourneyMotion } from "./useJourneyMotion";
import { ChapterNavigation } from "./ChapterNavigation";

const ALLEVAMENTO = JOURNEY.find((c) => c.id === "allevamento")!;
const NEXT = "caseificio" as const;

/** Capitolo Allevamento: layout editoriale alternato con contatore scroll-driven. */
export function Allevamento() {
  const root = useRef<HTMLElement>(null);
  useJourneyMotion(root);

  useGSAP(
    () => {
      // Contatore "60 ettari · 120 capi · dal 2002" che appare scroll-driven.
      const counters = gsap.utils.toArray<HTMLElement>(".allevamento-counter");
      counters.forEach((c) => {
        const target = Number(c.dataset.count || "0");
        const obj = { n: 0 };
        gsap.to(obj, {
          n: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: c, start: "top 80%", once: true },
          onUpdate: () => {
            c.textContent = String(Math.round(obj.n));
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <article ref={root} className="journey-story journey-story--allevamento">
      <header className="journey-chapter-hero">
        <AllevamentoHero />
        <HeroOverlay chapter={ALLEVAMENTO} next={NEXT} />
      </header>

      {/* Contatore scroll-driven in un band largo, full-bleed. */}
      <section className="allevamento-counter-band" data-journey-parallax>
        <div className="journey-shell allevamento-counter-grid">
          <div className="allevamento-counter-cell">
            <span className="allevamento-counter-num" data-count="60">
              0
            </span>
            <span className="allevamento-counter-label">ettari di pascolo aperto</span>
          </div>
          <div className="allevamento-counter-cell">
            <span className="allevamento-counter-num" data-count="120">
              0
            </span>
            <span className="allevamento-counter-label">capi tra bovini, ovini, suini</span>
          </div>
          <div className="allevamento-counter-cell">
            <span className="allevamento-counter-num" data-count="2002">
              0
            </span>
            <span className="allevamento-counter-label">in cammino dal</span>
          </div>
        </div>
      </section>

      {/* Momenti editoriali: alternanza left/right. */}
      <section className="journey-shell journey-story-body">
        {ALLEVAMENTO.moments.map((m, i) => (
          <article
            key={m.label}
            className={`journey-moment allevamento-moment ${i % 2 === 1 ? "is-right" : "is-left"}`}
            data-journey-reveal
          >
            <div className="allevamento-moment-photo" data-journey-parallax>
              <span className="allevamento-moment-photo-initials">
                {m.label
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <div className="journey-moment-text">
              <span className="journey-moment-index">0{i + 1}</span>
              <p className="journey-moment-label">{m.label}</p>
              <h2>{m.title}</h2>
              <p>{m.body}</p>
            </div>
          </article>
        ))}
      </section>

      {/* CTA verso il prossimo capitolo. */}
      <section className="journey-shell journey-next" data-journey-reveal>
        <p className="journey-kicker">Prossima tappa</p>
        <Link to={chapterPath(NEXT)} className="journey-next-link">
          Dalla stalla al <em>caseificio</em>
          <span aria-hidden="true">→</span>
        </Link>
        <p className="journey-next-body">
          Il latte, appena munto, attraversa il cortile. Qui la storia prende un’altra forma.
        </p>
      </section>

      <ChapterNavigation exclude="allevamento" />
    </article>
  );
}

export type { JourneyChapter };
