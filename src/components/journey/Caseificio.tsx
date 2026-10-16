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
const ROMAN = ["I", "II", "III", "IV", "V"];

/** Capitolo Caseificio: hero 3D del latte, manifesto centrato, 5 gesti in scroll orizzontale. */
export function Caseificio() {
  const root = useRef<HTMLElement>(null);
  useJourneyMotion(root);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current!;

        // Manifesto: le parole si "accendono" dal grigio crema all'inchiostro.
        const words = gsap.utils.toArray<HTMLElement>(".caseificio-manifesto-word", el);
        gsap.fromTo(
          words,
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: ".caseificio-manifesto",
              start: "top 75%",
              end: "bottom 45%",
              scrub: 0.6,
            },
          },
        );

        // Filo d'oro che si disegna sotto il manifesto.
        const thread = el.querySelector<SVGPathElement>(".caseificio-thread path");
        if (thread) {
          const len = thread.getTotalLength();
          gsap.set(thread, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(thread, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: ".caseificio-thread",
              start: "top 85%",
              end: "bottom 50%",
              scrub: 0.8,
            },
          });
        }

        // 5 gesti in scroll orizzontale pinned.
        const section = el.querySelector<HTMLElement>(".caseificio-gesti");
        const track = el.querySelector<HTMLElement>(".caseificio-track");
        const fill = el.querySelector<HTMLElement>(".caseificio-progress-fill");
        const current = el.querySelector<HTMLElement>(".caseificio-current");
        if (section && track) {
          section.classList.add("is-horizontal");
          const panels = gsap.utils.toArray<HTMLElement>(".caseificio-panel", track);
          const distance = () => track.scrollWidth - window.innerWidth;
          const tween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              snap: {
                snapTo: (value: number) => {
                  // Allinea ogni gesto al bordo sinistro del contenuto.
                  const first = panels[0].offsetLeft;
                  const points = panels.map((p) =>
                    Math.min(1, (p.offsetLeft - first) / Math.max(1, distance())),
                  );
                  return points.reduce((a, b) =>
                    Math.abs(b - value) < Math.abs(a - value) ? b : a,
                  );
                },
                duration: 0.5,
                ease: "power2.inOut",
                delay: 0.05,
              },
              onUpdate: (self) => {
                if (fill) fill.style.transform = `scaleX(${self.progress})`;
                const idx = Math.min(
                  panels.length - 1,
                  Math.round(self.progress * (panels.length - 1)),
                );
                if (current) current.textContent = ROMAN[idx];
              },
            },
          });
          panels.forEach((panel) => {
            const form = panel.querySelector(".caseificio-form");
            const text = panel.querySelectorAll(".caseificio-panel-text > *");
            gsap.fromTo(
              form,
              { scale: 0.7, rotate: -12 },
              {
                scale: 1,
                rotate: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: tween,
                  start: "left right",
                  end: "center center",
                  scrub: true,
                },
              },
            );
            gsap.from(text, {
              y: 30,
              autoAlpha: 0,
              stagger: 0.08,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left 70%",
                toggleActions: "play none none reverse",
              },
            });
          });
          return () => section.classList.remove("is-horizontal");
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const manifesto =
    "Dal latte al formaggio, ogni passaggio ha un tempo che non può essere compresso.";

  return (
    <article ref={root} className="journey-story journey-story--caseificio">
      <header className="journey-chapter-hero" data-tone="light">
        <CaseificioHero />
        <HeroOverlay chapter={CASEIFICIO} next={NEXT} align="center" />
      </header>

      <section className="caseificio-manifesto" data-tone="light">
        <div className="journey-shell">
          <p className="caseificio-eyebrow">Il processo · Cinque gesti, cinque attese</p>
          <p className="caseificio-manifesto-text">
            {manifesto.split(" ").map((w, i) => (
              <span key={i} className="caseificio-manifesto-word">
                {w}{" "}
              </span>
            ))}
          </p>
          <svg
            className="caseificio-thread"
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 40 C 200 0, 300 80, 500 40 S 800 0, 1000 40 S 1150 70, 1200 40"
              fill="none"
              stroke="#b2833a"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </section>

      <section
        className="caseificio-gesti"
        data-tone="light"
        aria-label="I cinque gesti del caseificio"
      >
        <div className="caseificio-gesti-head journey-shell">
          <p className="caseificio-eyebrow">I gesti</p>
          <p className="caseificio-counter" aria-hidden="true">
            <span className="caseificio-current">I</span> — V
          </p>
        </div>
        <div className="caseificio-track">
          {CASEIFICIO.moments.map((m, i) => (
            <article key={m.label} className="caseificio-panel">
              <div className={"caseificio-form" + (i === 2 ? " caseificio-form--photo journey-photo" : "")} aria-hidden={i === 2 ? undefined : true}>
                {i === 2 ? <>
                  <img src="/images/caseificio-mozzarelle-ai.svg" alt="Mozzarelle fresche, burrate e treccia su un piatto di ceramica" width={1264} height={848} loading="lazy" decoding="async" />
                  <small className="journey-photo-credit">Immagine illustrativa · AI</small>
                </> : <>
                  <span>{ROMAN[i]}</span>
                  <small>Foto da produrre · {m.label}</small>
                </>}
              </div>
              <div className="caseificio-panel-text">
                <p className="caseificio-panel-label">
                  {String(i + 1).padStart(2, "0")} · {m.label}
                </p>
                <h2>{m.title}</h2>
                <p>{m.body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="caseificio-progress journey-shell" aria-hidden="true">
          <span className="caseificio-progress-fill" />
        </div>
      </section>

      <section
        className="journey-next journey-next--caseificio"
        data-tone="light"
        data-journey-reveal
      >
        <div className="journey-shell">
          <p className="caseificio-eyebrow">Prossima tappa</p>
          <Link to={chapterPath(NEXT)} className="journey-next-link">
            <span className="journey-next-title">
              Dal formaggio alla <em>macelleria</em>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
          <p className="journey-next-body">
            La carne, la brace, il taglio. Un altro ritmo, altre mani, la stessa cura.
          </p>
        </div>
      </section>

      <ChapterNavigation current="caseificio" compact tone="light" />
    </article>
  );
}
