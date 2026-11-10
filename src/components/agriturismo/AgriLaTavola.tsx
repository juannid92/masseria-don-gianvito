import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* Fotografia della tavola e racconto della cena sincronizzato allo scroll. */
const TEMPI = [
  { n: "01", t: "Si apparecchia", d: "Il tavolo è pronto all’arrivo degli ospiti." },
  {
    n: "02",
    t: "Gli antipasti",
    d: "Latticini, salumi e verdure: si portano al centro, da dividere.",
  },
  { n: "03", t: "I primi", d: "Primi piatti della cucina di casa, serviti caldi." },
  { n: "04", t: "La brace", d: "La carne della macelleria della masseria, cotta alla brace." },
  { n: "05", t: "Il dolce", d: "Si chiude con il dolce della casa." },
];

export function AgriLaTavola() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const steps = gsap.utils.toArray<HTMLElement>(".agri-tav-step", el);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || window.innerWidth < 900) {
        steps.forEach((s) => s.classList.add("is-on"));
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=" + window.innerHeight * 4,
          pin: ".agri-tav-pin",
          scrub: 0.6,
          onUpdate: (st) => {
            const t = st.progress * tl.duration();
            const i = Math.max(0, Math.min(TEMPI.length - 1, Math.floor((t + 0.3) / 1.4)));
            steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
          },
        },
      });
      tl.fromTo(
        ".agri-tav-photo img",
        { scale: 1.02 },
        {
          scale: 1.12,
          duration: TEMPI.length * 1.4,
          ease: "none",
        },
      );
      tl.to({}, { duration: 0.8 });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="agri-tav" data-tone="dark" id="la-tavola">
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
              <li key={s.n} className={"agri-tav-step" + (i === 0 ? " is-on" : "")}>
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
              src="/images/agriturismo/agriturismo-antipasti-cortile-01.jpeg"
              alt="Tagliere di antipasti serviti nel cortile della masseria: bruschette, frittelle e olive"
              width={1264}
              height={848}
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption>
            La tavola della masseria <span>Antipasti nel cortile</span>
          </figcaption>
        </figure>
      </div>
      {/* Galleria Piatti Agriturismo */}
      <section className="agri-gallery" data-tone="light">
        <div className="journey-shell">
          <header className="agri-gallery-header">
            <p className="agri-eyebrow">I nostri piatti</p>
            <h2>Dalla terra alla tavola.</h2>
          </header>
          <div className="agri-gallery-grid">
            {[
              {
                src: "/images/agriturismo/agriturismo-primi-piatti-01.jpeg",
                alt: "Primi piatti della tradizione",
              },
              {
                src: "/images/agriturismo/agriturismo-carne-brace-01.jpeg",
                alt: "Carne alla brace",
              },
              {
                src: "/images/agriturismo/agriturismo-cucina-particolare-01.jpeg",
                alt: "Dettagli della cucina",
              },
              {
                src: "/images/agriturismo/agriturismo-sala-atmosfera-01.jpeg",
                alt: "Atmosfera in sala",
              },
              {
                src: "/images/agriturismo/agriturismo-convivialita-01.jpeg",
                alt: "Momenti conviviali",
              },
              {
                src: "/images/agriturismo/agriturismo-presentazione-piatti-01.jpeg",
                alt: "Presentazione dei piatti",
              },
            ].map((foto, i) => (
              <figure key={i} className="agri-gallery-item">
                <img src={foto.src} alt={foto.alt} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
