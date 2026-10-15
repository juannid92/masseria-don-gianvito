import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CaseificioHero } from "./heroes/CaseificioHero";
import { HeroOverlay } from "./heroes/shared/HeroOverlay";
import { chapterPath, JOURNEY } from "@/data/journey";
import { useJourneyMotion } from "./useJourneyMotion";
import { ChapterNavigation } from "./ChapterNavigation";

const CASEIFICIO = JOURNEY.find((c) => c.id === "caseificio")!;
const NEXT = "macelleria" as const;

/** Capitolo Caseificio: timeline verticale centrale con momenti che si "accendono". */
export function Caseificio() {
  const root = useRef<HTMLElement>(null);
  useJourneyMotion(root);

  useGSAP(
    () => {
      // Disegna la linea verticale della timeline man mano che l'utente scrolla.
      const line = root.current?.querySelector<SVGPathElement>(".caseificio-timeline-line");
      if (line) {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 1,
          },
        });
      }
      // Ogni nodo si "accende" quando entra in viewport.
      const nodes = gsap.utils.toArray<HTMLElement>(".caseificio-node");
      nodes.forEach((n) => {
        gsap.fromTo(
          n,
          { autoAlpha: 0.3, scale: 0.95 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: n, start: "top 75%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <article ref={root} className="journey-story journey-story--caseificio">
      <header className="journey-chapter-hero">
        <CaseificioHero />
        <HeroOverlay chapter={CASEIFICIO} next={NEXT} chars />
      </header>

      <section className="journey-shell journey-story-body caseificio-timeline-section">
        <header className="caseificio-timeline-intro" data-journey-reveal>
          <p className="journey-kicker">Il processo</p>
          <h2 className="font-display">Cinque gesti. Cinque attese.</h2>
          <p>
            Dal latte crudo al formaggio stagionato, ogni passaggio ha un tempo che non può essere
            compresso. Segui la linea centrale, dall’alto verso il basso.
          </p>
        </header>

        <div className="caseificio-timeline">
          {/* Linea SVG centrale */}
          <svg
            className="caseificio-timeline-svg"
            viewBox="0 0 2 2000"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="caseificio-timeline-line"
              d="M1 0 L1 2000"
              stroke="#dab873"
              strokeWidth="0.04"
              fill="none"
            />
          </svg>

          {CASEIFICIO.moments.map((m, i) => (
            <article key={m.label} className="caseificio-node" data-journey-reveal>
              <div className="caseificio-node-dot" />
              <div className="caseificio-node-content">
                <span className="journey-moment-index">0{i + 1}</span>
                <p className="journey-moment-label">{m.label}</p>
                <h2>{m.title}</h2>
                <p>{m.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="journey-shell journey-next" data-journey-reveal>
        <p className="journey-kicker">Prossima tappa</p>
        <Link to={chapterPath(NEXT)} className="journey-next-link">
          Dal formaggio al <em>banco della macelleria</em>
          <span aria-hidden="true">→</span>
        </Link>
        <p className="journey-next-body">
          La carne, la brace, il taglio. Un altro ritmo, altre mani, la stessa cura.
        </p>
      </section>

      <ChapterNavigation exclude="caseificio" />
    </article>
  );
}
