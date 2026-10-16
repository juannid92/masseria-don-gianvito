import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* Fotografia della tavola e racconto della cena sincronizzato allo scroll. */
const TEMPI = [
  { n: "01", t: "Si apparecchia", d: "Tovaglia di lino, pane caldo, olio della casa. Il tavolo è pronto prima che arriviate." },
  { n: "02", t: "Gli antipasti", d: "Latticini appena fatti, salumi, verdure dell'orto: arrivano tutti insieme, al centro, da dividere." },
  { n: "03", t: "I primi", d: "Pasta fatta a mano, sughi lenti. Un piatto per ognuno, fumante." },
  { n: "04", t: "La brace", d: "La carne della nostra macelleria, cotta sul fuoco e portata sul tagliere." },
  { n: "05", t: "Il dolce", d: "Si chiude con il dolce della casa e un bicchiere. Nessuno ha fretta di alzarsi." },
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
      tl.fromTo(".agri-tav-photo img", { scale: 1.02 }, {
        scale: 1.12, duration: TEMPI.length * 1.4, ease: "none",
      });
      tl.to({}, { duration: 0.8 });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="agri-tav" data-tone="dark" id="la-tavola">
      <div className="agri-tav-pin">
        <div className="agri-tav-text">
          <p className="agri-tav-eyebrow">La sala · Una cena in cinque tempi</p>
          <h2>Qui si mangia<br /><em>quello che nasce qui.</em></h2>
          <ol>
            {TEMPI.map((s, i) => (
              <li key={s.n} className={"agri-tav-step" + (i === 0 ? " is-on" : "")}>
                <span>{s.n}</span>
                <div><h3>{s.t}</h3><p>{s.d}</p></div>
              </li>
            ))}
          </ol>
        </div>

        <figure className="agri-tav-photo">
          <div className="agri-tav-photo-frame">
            <img
              src="/images/agriturismo-tavola-ai.svg"
              alt="Tavola rustica apparecchiata con orecchiette, carne alla brace, verdure e latticini"
              width={1264} height={848} loading="lazy" decoding="async"
            />
          </div>
          <figcaption>La gioia di stare a tavola <span>Immagine illustrativa · AI</span></figcaption>
        </figure>
      </div>
    </section>
  );
}
