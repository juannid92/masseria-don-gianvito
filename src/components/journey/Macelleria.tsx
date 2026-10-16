import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MacelleriaHero } from "./heroes/MacelleriaHero";
import { HeroOverlay } from "./heroes/shared/HeroOverlay";
import { chapterPath, JOURNEY } from "@/data/journey";
import { useJourneyMotion } from "./useJourneyMotion";
import { ChapterNavigation } from "./ChapterNavigation";

const MACELLERIA = JOURNEY.find((c) => c.id === "macelleria")!;
const NEXT = "agriturismo" as const;
const WORDS = ["Brace", "Taglio", "Frollatura", "Coltello", "Ulivo", "Fuoco", "Banco", "Fiducia"];

/** Capitolo Macelleria: hero 3D della brace, nastro di parole, stazioni con numero sticky e tagli. */
export function Macelleria() {
  const root = useRef<HTMLElement>(null);
  useJourneyMotion(root);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current!;

        // Nastro di parole: due righe che scorrono in direzioni opposte con lo scroll.
        el.querySelectorAll<HTMLElement>(".macelleria-ribbon-row").forEach((row, i) => {
          gsap.fromTo(
            row,
            { xPercent: i % 2 ? -30 : 0 },
            {
              xPercent: i % 2 ? 0 : -30,
              ease: "none",
              scrollTrigger: {
                trigger: ".macelleria-ribbon",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );
        });

        // Stazioni: ogni blocco viene "tagliato" in diagonale e aggiorna il numero sticky.
        const big = el.querySelector<HTMLElement>(".macelleria-bignum-value");
        const label = el.querySelector<HTMLElement>(".macelleria-bignum-label");
        el.querySelectorAll<HTMLElement>(".macelleria-station").forEach((st, i) => {
          gsap.fromTo(
            st.querySelector(".macelleria-station-cut"),
            { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
            {
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              ease: "power3.inOut",
              duration: 1.1,
              scrollTrigger: {
                trigger: st,
                start: "top 78%",
                toggleActions: "play none none reverse",
              },
            },
          );
          gsap.from(st.querySelectorAll(".macelleria-station-text > *"), {
            y: 40,
            autoAlpha: 0,
            stagger: 0.08,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: st,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          });
          ScrollTrigger.create({
            trigger: st,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
              if (!self.isActive || !big) return;
              const n = String(i + 1).padStart(2, "0");
              gsap.fromTo(
                big,
                { yPercent: self.direction > 0 ? 60 : -60, autoAlpha: 0 },
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  duration: 0.5,
                  ease: "power3.out",
                  onStart: () => void (big.textContent = n),
                },
              );
              if (label) label.textContent = MACELLERIA.moments[i].label;
            },
          });
        });

        // Linea di sangue verticale che cresce lungo le stazioni.
        gsap.fromTo(
          ".macelleria-vein-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".macelleria-stations",
              start: "top center",
              end: "bottom center",
              scrub: 0.6,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <article ref={root} className="journey-story journey-story--macelleria">
      <header className="journey-chapter-hero">
        <MacelleriaHero />
        <HeroOverlay chapter={MACELLERIA} next={NEXT} align="right" />
      </header>

      <section className="macelleria-ribbon" data-tone="light" aria-hidden="true">
        {[0, 1].map((r) => (
          <div key={r} className="macelleria-ribbon-row">
            {[...WORDS, ...WORDS].map((w, i) => (
              <span key={i}>
                {w}
                <i>✕</i>
              </span>
            ))}
          </div>
        ))}
      </section>

      <section className="macelleria-stations">
        <div className="journey-shell macelleria-stations-grid">
          <aside className="macelleria-bignum" aria-hidden="true">
            <p className="macelleria-eyebrow">Il banco · cinque stazioni</p>
            <div className="macelleria-bignum-window">
              <span className="macelleria-bignum-value">01</span>
            </div>
            <p className="macelleria-bignum-label">{MACELLERIA.moments[0].label}</p>
            <div className="macelleria-vein">
              <span className="macelleria-vein-fill" />
            </div>
          </aside>
          <div className="macelleria-station-list">
            <header className="macelleria-stations-intro">
              <h2>Cinque stazioni, una stessa scelta.</h2>
              <p>
                Dalla brace al taglio, dal consiglio all’abbinamento in tavola. Cinque gesti che
                rendono diversa la carne di questa masseria.
              </p>
            </header>
            {MACELLERIA.moments.map((m, i) => (
              <article key={m.label} className="macelleria-station">
                <div className={"macelleria-station-cut" + (i === 1 ? " macelleria-station-cut--photo journey-photo" : "")} aria-hidden={i === 1 ? undefined : true}>
                  {i === 1 ? <>
                    <img src="/images/macelleria-brace-ai.svg" alt="Bistecche e bombette sulla griglia sopra la brace accesa" width={1264} height={848} loading="lazy" decoding="async" />
                    <small className="journey-photo-credit">Immagine illustrativa · AI</small>
                  </> : <>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <small>Foto da produrre · {m.label}</small>
                  </>}
                </div>
                <div className="macelleria-station-text">
                  <p className="macelleria-eyebrow">{m.label}</p>
                  <h3>{m.title}</h3>
                  <p>{m.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="journey-next journey-next--macelleria" data-journey-reveal>
        <div className="journey-shell">
          <p className="macelleria-eyebrow">Prossima tappa</p>
          <Link to={chapterPath(NEXT)} className="journey-next-link">
            <span className="journey-next-title">
              Dal banco alla <em>tavola</em>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
          <p className="journey-next-body">
            La carne è cotta, il formaggio è pronto, il pane è di Altamura. Mancano le persone.
          </p>
        </div>
      </section>

      <ChapterNavigation current="macelleria" compact />
    </article>
  );
}
