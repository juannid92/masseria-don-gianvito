import { useState } from "react";

/* Fotografia della tavola: la foto cambia al passaggio del mouse o al click sul titolo corrispondente. */
const TEMPI = [
  {
    n: "01",
    t: "Si apparecchia",
    d: "Il tavolo è pronto all'arrivo degli ospiti.",
    img: "/images/agriturismo/tavola-si-apparecchia-01.jpeg",
    alt: "Tavola apparecchiata nella sala della masseria",
    caption: "La sala pronta ad accogliere",
  },
  {
    n: "02",
    t: "Gli antipasti",
    d: "Latticini, salumi e verdure: si portano al centro, da dividere.",
    img: "/images/agriturismo/tavola-antipasti-01.jpeg",
    alt: "Antipasti della masseria serviti in tavola",
    caption: "Antipasti della casa",
  },
  {
    n: "03",
    t: "I primi",
    d: "Primi piatti della cucina di casa, serviti caldi.",
    img: "/images/agriturismo/tavola-primi-01.jpeg",
    alt: "Primi piatti della tradizione pugliese serviti in tavola",
    caption: "I primi della casa",
  },
  {
    n: "04",
    t: "I secondi",
    d: "La carne della macelleria della masseria, cotta alla brace.",
    img: "/images/agriturismo/tavola-secondi-01.jpeg",
    alt: "Secondi di carne della macelleria della masseria",
    caption: "I secondi della masseria",
  },
  {
    n: "05",
    t: "Il dolce",
    d: "Si chiude con il dolce della casa.",
    img: "/images/agriturismo/tavola-dolci-01.jpeg",
    alt: "Dolce della casa a fine pasto",
    caption: "Il dolce della casa",
  },
];

export function AgriLaTavola() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = TEMPI[activeIndex];

  return (
    <section className="agri-tav" data-tone="dark" id="la-tavola">
      <div className="agri-tav-pin">
        <div className="agri-tav-text">
          <p className="agri-tav-eyebrow">La sala · Una cena in cinque tempi</p>
          <h2>
            Qui si mangia
            <br />
            <em>quello che nasce qui.</em>
          </h2>
          <ol>
            {TEMPI.map((s, i) => (
              <li
                key={s.n}
                className={"agri-tav-step" + (i === activeIndex ? " is-on" : "")}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIndex(i);
                  }
                }}
              >
                <span>{s.n}</span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <figure className="agri-tav-photo">
          <div className="agri-tav-photo-frame">
            <img
              key={active.n}
              src={active.img}
              alt={active.alt}
              width={1264}
              height={848}
              loading="eager"
              decoding="async"
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <figcaption>
            La tavola della masseria <span>{active.caption}</span>
          </figcaption>
        </figure>
      </div>
      {/* Galleria Piatti Agriturismo */}
      <section className="agri-tav-gallery" data-tone="light">
        <div className="journey-shell">
          <header className="agri-tav-gallery-header">
            <p className="agri-tav-eyebrow">I nostri piatti</p>
            <h2>Dalla terra alla tavola.</h2>
          </header>
          <div className="agri-tav-gallery-grid">
            {[
              {
                src: "/images/agriturismo/agriturismo-antipasti-cortile-01.jpeg",
                alt: "Carpaccio con scaglie e salsa gialla nel cortile",
              },
              {
                src: "/images/agriturismo/agriturismo-primi-piatti-03.jpeg",
                alt: "Orecchiette fresche con cime di rapa",
              },
              {
                src: "/images/agriturismo/agriturismo-primi-piatti-04.jpeg",
                alt: "Pasta fatta in casa con sugo della masseria",
              },
              {
                src: "/images/agriturismo/agriturismo-carne-brace-01.jpeg",
                alt: "Costata di manzo sulla brace ardente",
              },
              {
                src: "/images/agriturismo/agriturismo-dessert-03.jpeg",
                alt: "Dolce della casa con crema e frutta fresca",
              },
              {
                src: "/images/agriturismo/agriturismo-convivialita-01.jpeg",
                alt: "Momenti di convivialità intorno alla tavola",
              },
            ].map((foto, i) => (
              <figure key={i} className="agri-tav-gallery-item">
                <img src={foto.src} alt={foto.alt} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}