import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import type { AnimaId } from "@/data/masseria";
import { JOURNEY, chapterPath } from "@/data/journey";
import { ChapterNavigation } from "./ChapterNavigation";
import { useJourneyMotion } from "./useJourneyMotion";

export function StoryChapter({ id }: { id: AnimaId }) {
  const root = useRef<HTMLDivElement>(null);
  const chapter = JOURNEY.find((c) => c.id === id)!;
  useJourneyMotion(root, id);
  return (
    <div ref={root} className={`journey-story journey-story--${id}`}>
      <section className="journey-chapter-hero" data-tone="dark">
        <div className="journey-chapter-orbit" data-journey-parallax aria-hidden="true" />
        <div className="journey-shell">
          <Link to="/" hash="mappa" className="journey-text-link">
            ← La masseria dall’alto
          </Link>
          <div data-journey-reveal className="journey-chapter-heading">
            <p className="journey-kicker">
              Capitolo {chapter.number} / 04 · {chapter.name}
            </p>
            <h1>
              {chapter.title[0]}
              <br />
              <em>{chapter.title[1]}</em>
            </h1>
            <p className="journey-intro">{chapter.introduction}</p>
          </div>
          <div className="journey-hero-bottom">
            <span>Scorri per entrare nel racconto ↓</span>
            <span>{chapter.keyword}</span>
          </div>
        </div>
      </section>
      <div className="journey-draft-note" data-tone="light">
        <span>Prototipo editoriale</span> Testi provvisori · fotografie e racconto reale da
        inserire.
      </div>
      <section className="journey-story-body journey-shell" data-tone="light">
        <div className="journey-story-index" aria-hidden="true">
          <span>{chapter.number}</span>
          <p>{chapter.name}</p>
        </div>
        <div className="journey-story-moments">
          {chapter.moments.map((moment, i) => (
            <article className="journey-moment" key={moment.label} data-journey-reveal>
              <p className="journey-kicker">
                0{i + 1} · {moment.label}
              </p>
              <h2>{moment.title}</h2>
              <p>{moment.body}</p>
              {i === 0 && (
                <figure className="journey-photo-slot">
                  <div aria-hidden="true">{chapter.keyword}</div>
                  <figcaption>
                    <span>Fotografia da inserire</span>
                    {chapter.imageBrief}
                  </figcaption>
                </figure>
              )}
            </article>
          ))}
          {id === "allevamento" && (
            <Link className="journey-text-link journey-branch" to={chapterPath("macelleria")}>
              Segui il ramo della macelleria ↗
            </Link>
          )}
        </div>
      </section>
      <ChapterNavigation current={id} />
    </div>
  );
}
