import { Link } from "@tanstack/react-router";
import { JOURNEY, chapterPath } from "@/data/journey";
import type { AnimaId } from "@/data/masseria";

export function ChapterNavigation({ current }: { current: AnimaId }) {
  const index = JOURNEY.findIndex((c) => c.id === current);
  const next = JOURNEY[(index + 1) % JOURNEY.length];
  return (
    <section className="journey-next" data-tone="dark">
      <div className="journey-shell">
        <p className="journey-kicker">
          {index === 3 ? "Il viaggio ricomincia" : "Continua il percorso"} · {next.number} / 04
        </p>
        <Link className="journey-next-link" to={chapterPath(next.id)}>
          <span>{next.name}</span>
          <span aria-hidden="true">↗</span>
        </Link>
        <nav aria-label="I capitoli della masseria" className="journey-chapter-nav">
          {JOURNEY.map((c) => (
            <Link
              key={c.id}
              to={chapterPath(c.id)}
              aria-current={current === c.id ? "page" : undefined}
            >
              <span>{c.number}</span> {c.name}
            </Link>
          ))}
        </nav>
        <Link to="/" hash="mappa" className="journey-text-link">
          ← Torna alla mappa
        </Link>
      </div>
    </section>
  );
}
