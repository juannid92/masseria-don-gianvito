import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aerial from "@/assets/masseria-aerial.asset.json";
import { PIN_ANIME } from "@/data/pin-anime";
import { JOURNEY } from "@/data/journey";

/** One image coordinate system on every viewport: no misleading mobile crop. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (image.current?.complete && !image.current.naturalWidth) setMissingImage(true);
  }, []);
  const [selected, setSelected] = useState(0);
  const [missingImage, setMissingImage] = useState(false);
  const pin = PIN_ANIME[selected];
  const chapter = JOURNEY[selected];
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from(".journey-map-intro > *", {
          opacity: 0,
          y: 28,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
        });
        gsap.fromTo(
          ".journey-map-visual",
          { y: 0 },
          {
            y: -28,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
          },
        );
      }, root);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, []);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
      );
    });
    return () => ctx.revert();
  }, [selected]);
  return (
    <section id="mappa" ref={root} className="journey-map-hero" data-tone="dark">
      <div className="journey-shell">
        <div className="journey-map-intro">
          <p className="journey-kicker">Masseria Don Gianvito · Noci, Puglia</p>
          <h1>
            Un luogo.
            <br />
            <em>Quattro anime.</em>
          </h1>
          <p>
            Non una visita. Un percorso.
            <br />
            Scegli da dove cominciare.
          </p>
        </div>
        {missingImage && (
          <p className="journey-map-notice">
            Percorso schematico · la fotografia aerea originale è da inserire. Le posizioni dei
            luoghi saranno verificate sulla foto.
          </p>
        )}
        <div className="journey-map-layout">
          <div
            className={`journey-map-visual ${missingImage ? "journey-map-visual--missing" : ""}`}
          >
            {!missingImage && (
              <img
                ref={image}
                className="journey-aerial"
                src={aerial.url}
                alt="Veduta aerea della masseria, con quattro luoghi da esplorare"
                onError={() => setMissingImage(true)}
                fetchPriority="high"
              />
            )}
            {missingImage && (
              <div className="journey-map-fallback">
                <span>La masseria dall’alto</span>
                <p>
                  La foto aerea originale non è disponibile in locale.
                  <br />
                  Percorso schematico: posizioni da verificare sulla fotografia.
                </p>
              </div>
            )}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="journey-map-thread"
              aria-hidden="true"
            >
              <path d="M64 20 C64 32 44 32 44 46 S78 45 78 60 S46 68 46 86" />
            </svg>
            {PIN_ANIME.map((p, i) => (
              <button
                type="button"
                key={p.id}
                className={`journey-map-pin ${selected === i ? "is-active" : ""}`}
                style={{ left: `${p.d.x}%`, top: `${p.d.y}%` }}
                onClick={() => setSelected(i)}
                aria-label={`Esplora ${p.nome}, capitolo ${p.numero}`}
                aria-pressed={selected === i}
                aria-controls="journey-map-detail"
              >
                <span className="journey-pin-number">{p.numero}</span>
                <span className="journey-pin-name">{p.nome}</span>
              </button>
            ))}
            <div className="journey-map-coordinate" aria-hidden="true">
              01 — 04 / Dalla terra alla tavola
            </div>
          </div>
          <aside
            className="journey-map-detail"
            id="journey-map-detail"
            aria-label="Capitolo selezionato"
          >
            <div ref={panel} aria-live="polite" aria-atomic="true">
              <p className="journey-kicker">Il percorso · {pin.numero} / 04</p>
              <h2>{pin.nome}</h2>
              <p className="journey-map-claim">{chapter.title.join(" ")}</p>
              <p className="journey-map-summary">{chapter.introduction}</p>
              <Link to={pin.to} className="journey-button">
                Entra nel capitolo <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="journey-map-selector" role="group" aria-label="Scegli un capitolo">
              {PIN_ANIME.map((p, i) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelected(i)}
                  aria-label={p.nome}
                  aria-pressed={selected === i}
                >
                  {p.numero}
                </button>
              ))}
            </div>
          </aside>
        </div>
        <div className="journey-map-footer">
          <span>Segui il filo. Ogni luogo racconta una parte.</span>
          <Link to="/" hash="storia" className="journey-text-link">
            La storia della masseria ↓
          </Link>
        </div>
      </div>
    </section>
  );
}
