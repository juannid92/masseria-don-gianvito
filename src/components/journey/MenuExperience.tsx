import { useRef, useState } from "react";
import { MASSERIA } from "@/data/masseria";
import { useJourneyMotion } from "./useJourneyMotion";

const categories = [
  {
    id: "cucina",
    title: "La cucina",
    text: "Antipasti, primi e piatti della cucina di casa, preparati con i prodotti della masseria.",
  },
  {
    id: "brace",
    title: "La brace",
    text: "I tagli della macelleria cotti alla brace. Disponibilità e prezzi vanno richiesti alla masseria.",
  },
  {
    id: "stagione",
    title: "La stagione",
    text: "Proposte che cambiano con ciò che offrono i campi e la stalla.",
  },
];
export function MenuExperience() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  useJourneyMotion(root);
  return (
    <section id="menu" ref={root} className="journey-menu" data-tone="light">
      <div className="journey-shell">
        <div className="journey-menu-heading" data-journey-reveal>
          <p className="journey-kicker">Agriturismo · La tavola</p>
          <h2>
            Il viaggio continua.
            <br />
            <em>Nel piatto.</em>
          </h2>
          <p>Il menù della masseria. Le proposte variano con la stagione e la disponibilità.</p>
        </div>
        <div className="journey-menu-grid" data-journey-reveal>
          <figure className="journey-menu-photo">
            <div className="journey-menu-photo-word" aria-hidden="true">
              La
              <br />
              <em>tavola.</em>
            </div>
            <figcaption>Fotografia della tavola da inserire</figcaption>
          </figure>
          <div className="journey-menu-content">
            <div className="journey-tabs" role="tablist" aria-label="Esplora il menù">
              {categories.map((category, i) => (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  id={`tab-${category.id}`}
                  aria-selected={i === active}
                  aria-controls={`panel-${category.id}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(event) => {
                    let next = i;
                    if (event.key === "ArrowRight") next = (i + 1) % categories.length;
                    else if (event.key === "ArrowLeft")
                      next = (i + categories.length - 1) % categories.length;
                    else if (event.key === "Home") next = 0;
                    else if (event.key === "End") next = categories.length - 1;
                    else return;
                    event.preventDefault();
                    setActive(next);
                    document.getElementById(`tab-${categories[next].id}`)?.focus();
                  }}
                >
                  {category.title}
                </button>
              ))}
            </div>
            {categories.map((category, i) => (
              <div
                role="tabpanel"
                tabIndex={0}
                key={category.id}
                id={`panel-${category.id}`}
                aria-labelledby={`tab-${category.id}`}
                hidden={active !== i}
                className="journey-menu-panel"
              >
                <p className="journey-kicker">Menù in preparazione</p>
                <h3>{category.title}</h3>
                <p>{category.text}</p>
                <p className="journey-menu-status">
                  Non sono ancora presenti piatti o prezzi. Questo è il contenitore del futuro menù.
                </p>
                <a
                  href={MASSERIA.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="journey-button"
                >
                  Chiedi il menù su WhatsApp <span aria-hidden="true">↗</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
