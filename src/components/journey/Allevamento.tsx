import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { AllevamentoHero } from "./heroes/AllevamentoHero";
import { HeroOverlay } from "./heroes/shared/HeroOverlay";
import { chapterPath, JOURNEY, type JourneyChapter } from "@/data/journey";
import { useJourneyMotion } from "./useJourneyMotion";
import { ChapterNavigation } from "./ChapterNavigation";
import { PinnedCardStack } from "./PinnedCardStack";

const ALLEVAMENTO = JOURNEY.find((c) => c.id === "allevamento")!;
const NEXT = "caseificio" as const;

/** Capitolo Allevamento: hero 3D, contatori, card pinned, prossima tappa. */
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

      {/* 5 momenti: card impilate in scroll pinned. */}
      <PinnedCardStack moments={ALLEVAMENTO.moments} kicker="Cinque momenti al pascolo" />

      {/* CTA verso il prossimo capitolo. */}
      <section className="journey-next journey-next--allevamento" data-journey-reveal>
        <div className="journey-shell">
          <p className="journey-kicker">Prossima tappa</p>
          <Link to={chapterPath(NEXT)} className="journey-next-link">
            <span className="journey-next-title">
              Dalla stalla al <em>caseificio</em>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
          <p className="journey-next-body">
            Il latte, appena munto, attraversa il cortile. Qui la storia prende un’altra forma.
          </p>
        </div>
      </section>

      <ChapterNavigation current="allevamento" compact />
    </article>
  );
}

export type { JourneyChapter };
