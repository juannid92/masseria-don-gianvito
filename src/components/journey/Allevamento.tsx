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
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counters = gsap.utils.toArray<HTMLElement>(".allevamento-counter-num");
        counters.forEach((c) => {
          const target = Number(c.dataset.count || "0");
          const obj = { n: 0 };
          c.textContent = "0";
          gsap.to(obj, {
            n: target,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: { trigger: c, start: "top 85%", once: true },
            onUpdate: () => {
              c.textContent = String(Math.round(obj.n));
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <article ref={root} className="journey-story journey-story--allevamento">
      <header className="journey-chapter-hero" data-tone="dark">
        <AllevamentoHero />
        <HeroOverlay chapter={ALLEVAMENTO} next={NEXT} />
      </header>

      {/* Contatore scroll-driven in un band largo, full-bleed. */}
      <section className="allevamento-counter-band" data-tone="dark" data-journey-parallax>
        <div className="journey-shell allevamento-counter-grid">
          <div className="allevamento-counter-cell">
            <span className="allevamento-counter-num" data-count="60">
              60
            </span>
            <span className="allevamento-counter-label">ettari di pascolo aperto</span>
          </div>
          <div className="allevamento-counter-cell">
            <span className="allevamento-counter-num" data-count="120">
              120
            </span>
            <span className="allevamento-counter-label">capi tra bovini, ovini, suini</span>
          </div>
          <div className="allevamento-counter-cell">
            <span className="allevamento-counter-num" data-count="2002">
              2002
            </span>
            <span className="allevamento-counter-label">in cammino dal</span>
          </div>
        </div>
      </section>

      {/* 5 momenti: card impilate in scroll pinned. */}
      <PinnedCardStack
        moments={ALLEVAMENTO.moments.map((m, i) => {
          const photos: Record<number, { image: string; imageAlt: string }> = {
            0: {
              image: "/images/masseria/allevamento-terreni-masseria-01.jpeg",
              imageAlt: "I terreni della masseria tra Noci e Mottola, foraggio e grano tenero",
            },
            1: {
              image: "/images/masseria/allevamento-bovini-recinti-01.jpeg",
              imageAlt: "Bovini Pezzata Rossa e Frisona nei recinti dell’allevamento",
            },
            2: {
              image: "/images/masseria/allevamento-campi-stagioni-01.jpeg",
              imageAlt: "I campi della masseria che seguono il ritmo delle stagioni",
            },
            3: {
              image: "/images/masseria/allevamento-cura-animali-01.jpeg",
              imageAlt: "Il lavoro quotidiano di chi cura gli animali ogni mattina",
            },
            4: {
              image: "/images/masseria/allevamento-filiera-integrata-01.jpeg",
              imageAlt:
                "Dal latte al caseificio, dalla carne alla macelleria: tutto nello stesso luogo",
            },
          };
          return photos[i] ? { ...m, ...photos[i] } : m;
        })}
        kicker="Cinque passaggi dall’allevamento"
      />

      {/* Galleria fotografica Allevamento */}
      <section className="allevamento-gallery" data-tone="dark" data-journey-reveal>
        <div className="journey-shell">
          <header className="allevamento-gallery-header">
            <p className="journey-kicker">Dai campi</p>
            <h2>La vita in masseria.</h2>
          </header>
          <div className="allevamento-gallery-grid">
            {[
              {
                src: "/images/masseria/allevamento-campi-coltivati-01.jpeg",
                alt: "I terreni coltivati intorno alla masseria",
                wide: true,
              },
              {
                src: "/images/masseria/allevamento-animali-recinti-01.jpeg",
                alt: "Gli animali nei recinti all'aperto",
              },
              {
                src: "/images/masseria/allevamento-lavoro-campi-01.jpeg",
                alt: "Il lavoro quotidiano nei campi",
              },
              {
                src: "/images/masseria/allevamento-vita-allevamento-01.jpeg",
                alt: "Scorci di vita in allevamento",
              },
              {
                src: "/images/masseria/allevamento-paesaggio-murge-02.jpeg",
                alt: "Il paesaggio delle Murge",
              },
              {
                src: "/images/masseria/allevamento-dettagli-campagna-03.jpeg",
                alt: "Dettagli della campagna",
                wide: true,
              },
              {
                src: "/images/masseria/allevamento-luce-mattino-02.jpeg",
                alt: "L'allevamento nella luce del mattino",
              },
            ].map((foto, i) => (
              <figure
                key={i}
                className={`allevamento-gallery-item${foto.wide ? " allevamento-gallery-item--wide" : ""}`}
              >
                <img src={foto.src} alt={foto.alt} loading="lazy" decoding="async" />
                <small className="journey-photo-credit">{foto.alt}</small>
              </figure>
            ))}
          </div>
        </div>
      </section>

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
