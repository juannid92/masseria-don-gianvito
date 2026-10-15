import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { MacelleriaHero } from "./heroes/MacelleriaHero";
import { HeroOverlay } from "./heroes/shared/HeroOverlay";
import { chapterPath, JOURNEY } from "@/data/journey";
import { useJourneyMotion } from "./useJourneyMotion";
import { ChapterNavigation } from "./ChapterNavigation";

const MACELLERIA = JOURNEY.find((c) => c.id === "macelleria")!;
const NEXT = "agriturismo" as const;

/** Capitolo Macelleria: griglia 2-up di card con hover lift. */
export function Macelleria() {
  const root = useRef<HTMLElement>(null);
  useJourneyMotion(root);

  return (
    <article ref={root} className="journey-story journey-story--macelleria">
      <header className="journey-chapter-hero">
        <MacelleriaHero />
        <HeroOverlay chapter={MACELLERIA} next={NEXT} chars />
      </header>

      <section className="journey-shell journey-story-body">
        <header className="macelleria-intro" data-journey-reveal>
          <p className="journey-kicker">Il banco</p>
          <h2 className="font-display">Cinque stazioni, una stessa scelta.</h2>
          <p>
            Dalla brace al taglio, dal consiglio all’abbinamento in tavola. Cinque gesti che rendono
            diversa la carne di questa masseria.
          </p>
        </header>

        <div className="macelleria-card-grid">
          {MACELLERIA.moments.map((m, i) => (
            <article key={m.label} className="macelleria-card card-hover" data-journey-reveal>
              <div className="macelleria-card-header">
                <span className="journey-moment-index">0{i + 1}</span>
                <p className="journey-moment-label">{m.label}</p>
              </div>
              <h3>{m.title}</h3>
              <p>{m.body}</p>
              <div className="macelleria-card-ember" aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="journey-shell journey-next" data-journey-reveal>
        <p className="journey-kicker">Prossima tappa</p>
        <Link to={chapterPath(NEXT)} className="journey-next-link">
          Dal banco alla <em>tavola dell’agriturismo</em>
          <span aria-hidden="true">→</span>
        </Link>
        <p className="journey-next-body">
          La carne è cotta, il formaggio è pronto, il pane è di Altamura. Mancano le persone.
        </p>
      </section>

      <ChapterNavigation exclude="macelleria" />
    </article>
  );
}
