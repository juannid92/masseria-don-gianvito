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

        // Galleria pinned: card impilate con pin, ogni scroll porta dentro la foto successiva.
        const galleryDeck = el.querySelector<HTMLElement>(".macelleria-gallery-pinned-deck");
        if (galleryDeck) {
          const cards = gsap.utils.toArray<HTMLElement>(".macelleria-gallery-card", galleryDeck);
          gsap.set(cards, {
            yPercent: (i) => (i === 0 ? 0 : 110),
            rotate: (i) => (i === 0 ? 0 : 2),
          });
          const galleryTl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: ".macelleria-gallery-pinned",
              start: "top top",
              end: () => `+=${window.innerHeight * (cards.length - 1) * 1.05}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              snap: {
                snapTo: 1 / (cards.length - 1),
                duration: 0.5,
                ease: "power2.inOut",
                delay: 0.05,
              },
            },
          });
          cards.forEach((card, i) => {
            if (i === 0) return;
            const prev = cards[i - 1];
            galleryTl
              .to(card, { yPercent: 0, rotate: 0, duration: 1 }, i - 1)
              .to(
                prev,
                { scale: 0.92, yPercent: -5, filter: "brightness(0.6)", duration: 1 },
                i - 1,
              );
            const inner = card.querySelector(".macelleria-gallery-card-inner");
            if (inner) galleryTl.fromTo(inner, { scale: 1.2 }, { scale: 1, duration: 1 }, i - 1);
          });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <article ref={root} className="journey-story journey-story--macelleria">
      <header className="journey-chapter-hero" data-tone="dark">
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

      <section className="macelleria-stations" data-tone="dark">
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
              <h2>Cinque passaggi, un’unica filiera.</h2>
              <p>
                Dalla brace al taglio, dal consiglio all’abbinamento in tavola. Cinque gesti che
                rendono diversa la carne di questa masseria.
              </p>
            </header>
            {MACELLERIA.moments.map((m, i) => {
              const photos: Record<number, { src: string; alt: string }> = {
                0: {
                  src: "/images/macelleria/WhatsApp Image 2026-11-03 at 09.34.09.jpeg",
                  alt: "Il banco della macelleria con la carne e i salumi esposti a vista",
                },
                1: {
                  src: "/images/macelleria/WhatsApp Image 2026-11-03 at 09.39.55 (2).jpeg",
                  alt: "Bistecche e bombette sulla griglia sopra la brace accesa",
                },
                2: {
                  src: "/images/macelleria/WhatsApp Image 2026-11-03 at 09.39.55 (1).jpeg",
                  alt: "Tagli di carne fresca selezionati al banco per brace, forno o padella",
                },
                3: {
                  src: "/images/macelleria/WhatsApp Image 2026-11-04 at 11.11.44.jpeg",
                  alt: "Chi lavora al banco della macelleria, competenza e ascolto",
                },
                4: {
                  src: "/images/macelleria/WhatsApp Image 2026-11-03 at 09.39.55.jpeg",
                  alt: "La carne dal banco all'agriturismo, cotta alla brace e servita in sala",
                },
              };
              const photo = photos[i];
              return (
                <article key={m.label} className="macelleria-station">
                  <div
                    className={
                      "macelleria-station-cut" +
                      (photo ? " macelleria-station-cut--photo journey-photo" : "")
                    }
                    aria-hidden={photo ? undefined : true}
                  >
                    {photo ? (
                      <>
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          width={1264}
                          height={848}
                          loading="lazy"
                          decoding="async"
                        />
                        <small className="journey-photo-credit">
                          {m.label} · Masseria Don Gianvito
                        </small>
                      </>
                    ) : (
                      <>
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        <small>{m.label} · Macelleria della masseria</small>
                      </>
                    )}
                  </div>
                  <div className="macelleria-station-text">
                    <p className="macelleria-eyebrow">{m.label}</p>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="macelleria-gallery-pinned" data-tone="dark">
        <div className="journey-shell macelleria-gallery-pinned-head">
          <p className="macelleria-eyebrow">Dal banco</p>
          <h2>La carne, a vista.</h2>
        </div>
        <div className="macelleria-gallery-pinned-deck journey-shell">
          {[
            {
              src: "/images/macelleria/WhatsApp Image 2026-11-03 at 09.39.55 (3).jpeg",
              alt: "Preparazione dei tagli al banco",
            },
            {
              src: "/images/macelleria/WhatsApp Image 2026-11-03 at 09.39.55 (4).jpeg",
              alt: "Selezione della carne fresca",
            },
            {
              src: "/images/macelleria/WhatsApp Image 2026-11-03 at 09.39.55 (5).jpeg",
              alt: "Dettagli della lavorazione della carne",
            },
            {
              src: "/images/macelleria/WhatsApp Image 2026-11-03 at 09.39.55 (1).jpeg",
              alt: "Tagli freschi esposti sul banco",
            },
            {
              src: "/images/macelleria/WhatsApp Image 2026-11-03 at 09.39.55.jpeg",
              alt: "Il banco della macelleria della masseria",
            },
          ].map((foto, i) => (
            <figure key={i} className="macelleria-gallery-card" style={{ zIndex: i + 1 }}>
              <div className="macelleria-gallery-card-inner journey-photo">
                <img
                  src={foto.src}
                  alt={foto.alt}
                  width={1264}
                  height={848}
                  loading="lazy"
                  decoding="async"
                />
                <small className="journey-photo-credit">{foto.alt}</small>
              </div>
            </figure>
          ))}
        </div>
      </section>

      <section
        className="journey-next journey-next--macelleria"
        data-tone="dark"
        data-journey-reveal
      >
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
