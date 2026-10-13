import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aerial from "@/assets/masseria-aerial.asset.json";
import { PIN_ANIME } from "@/data/pin-anime";

/** Full-bleed photograph, overlaid title and direct links: no separate map/card. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const [source, setSource] = useState(aerial.url);
  const [missing, setMissing] = useState(false);

  const failImage = () => {
    if (source === aerial.url) setSource("/images/masseria-aerial.jpg");
    else setMissing(true);
  };

  useEffect(() => {
    // The original request may fail before React hydrates the page.
    if (image.current?.complete && !image.current.naturalWidth) {
      if (source === aerial.url) setSource("/images/masseria-aerial.jpg");
      else setMissing(true);
    }
  }, [source]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.from(".fullscreen-hero-title > *", {
          autoAlpha: 0,
          y: 24,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
        });
        // Move the image and its pins together, preserving their registration.
        gsap.to(".fullscreen-hero-plane", {
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }, root);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section
      id="mappa"
      ref={root}
      className="fullscreen-hero"
      data-tone="dark"
      aria-label="Esplora la Masseria Don Gianvito"
    >
      <div className="fullscreen-hero-plane">
        {!missing && (
          <img
            key={source}
            ref={image}
            className="fullscreen-hero-photo"
            src={source}
            alt="Vista dall’alto della Masseria Don Gianvito"
            fetchPriority="high"
            decoding="async"
            onError={failImage}
          />
        )}
        <div className="fullscreen-hero-shade" aria-hidden="true" />
        <nav className="fullscreen-hero-pins" aria-label="Esplora le quattro anime della masseria">
          {PIN_ANIME.map((pin) => (
            <Link
              key={pin.id}
              to={pin.to}
              className="fullscreen-hero-pin"
              aria-label={`Entra nel capitolo ${pin.nome}`}
              style={
                {
                  "--pin-x": `${pin.d.x}%`,
                  "--pin-y": `${pin.d.y}%`,
                  "--pin-x-mobile": `${pin.m.x}%`,
                  "--pin-y-mobile": `${pin.m.y}%`,
                } as CSSProperties
              }
            >
              <span className="fullscreen-hero-pin-dot">{pin.numero}</span>
              <span className="fullscreen-hero-pin-label">
                {pin.nome}
                <span aria-hidden="true"> ↗</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="fullscreen-hero-title">
        <p className="fullscreen-hero-kicker">Masseria Don Gianvito · Noci, Puglia</p>
        <h1>
          Un luogo.
          <br />
          <em>Quattro anime.</em>
        </h1>
        <p className="fullscreen-hero-intro">
          Dalla terra alla tavola.
          <br />
          Entra nei luoghi della masseria.
        </p>
      </div>

      <div className="fullscreen-hero-bottom">
        <p>Un’unica masseria. Quattro storie da attraversare.</p>
        <Link to="/" hash="manifesto" className="fullscreen-hero-scroll">
          Scopri la masseria <span aria-hidden="true">↓</span>
        </Link>
      </div>
      {missing && (
        <p className="fullscreen-hero-asset-note" role="status">
          Fotografia aerea originale da ricollegare in Lovable.
        </p>
      )}
    </section>
  );
}
