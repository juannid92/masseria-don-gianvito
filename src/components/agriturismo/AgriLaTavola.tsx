import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* La tavola: un tavolo visto dall'alto che si apparecchia mentre si scorre.
   Ogni tempo della cena porta in tavola qualcosa di nuovo. */
const TEMPI = [
  { n: "01", t: "Si apparecchia", d: "Tovaglia di lino, pane caldo, olio della casa. Il tavolo è pronto prima che arriviate." },
  { n: "02", t: "Gli antipasti", d: "Latticini appena fatti, salumi, verdure dell'orto: arrivano tutti insieme, al centro, da dividere." },
  { n: "03", t: "I primi", d: "Pasta fatta a mano, sughi lenti. Un piatto per ognuno, fumante." },
  { n: "04", t: "La brace", d: "La carne della nostra macelleria, cotta sul fuoco e portata sul tagliere." },
  { n: "05", t: "Il dolce", d: "Si chiude con il dolce della casa e un bicchiere. Nessuno ha fretta di alzarsi." },
];

const POSTI = [
  { x: 50, y: 12 }, { x: 50, y: 88 }, { x: 16, y: 32 }, { x: 16, y: 68 }, { x: 84, y: 32 }, { x: 84, y: 68 },
];

export function AgriLaTavola() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const steps = gsap.utils.toArray<HTMLElement>(".agri-tav-step", el);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || window.innerWidth < 900) {
        gsap.set(el.querySelectorAll("[data-tempo]"), { autoAlpha: 1, scale: 1 });
        steps.forEach((s) => s.classList.add("is-on"));
        return;
      }
      gsap.set(el.querySelectorAll("[data-tempo]"), { autoAlpha: 0, scale: 0.6 });
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
      TEMPI.forEach((_, i) => {
        tl.to(el.querySelectorAll(`[data-tempo="${i}"]`), {
          autoAlpha: 1, scale: 1, duration: 1, stagger: 0.12, ease: "back.out(1.6)",
        }, i * 1.4);
        if (i === 3) tl.to(".agri-tav-fumo", { autoAlpha: 0, duration: 0.6 }, i * 1.4);
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

        <div className="agri-tav-table" aria-hidden="true">
          <div className="agri-tav-cloth" />
          {/* 0 · coperti, pane, olio */}
          {POSTI.map((p, k) => (
            <div key={"c" + k} data-tempo="0" className="agri-tav-coperto" style={{ left: p.x + "%", top: p.y + "%" }}>
              <i className="pl" /><i className="gl" />
            </div>
          ))}
          <div data-tempo="0" className="agri-tav-pane" style={{ left: "36%", top: "50%" }} />
          <div data-tempo="0" className="agri-tav-olio" style={{ left: "64%", top: "50%" }} />
          {/* 1 · antipasti al centro */}
          <div data-tempo="1" className="agri-tav-vassoio" style={{ left: "50%", top: "36%" }}>
            <i className="b" style={{ left: "30%", top: "45%" }} /><i className="b" style={{ left: "55%", top: "35%" }} /><i className="b" style={{ left: "62%", top: "62%" }} />
          </div>
          <div data-tempo="1" className="agri-tav-vassoio s" style={{ left: "50%", top: "64%" }}>
            <i className="s1" /><i className="s2" />
          </div>
          {/* 2 · primi nei piatti */}
          {POSTI.map((p, k) => (
            <div key={"p" + k} data-tempo="2" className="agri-tav-primo" style={{ left: p.x + "%", top: p.y + "%" }}>
              <i className="agri-tav-fumo" />
            </div>
          ))}
          {/* 3 · tagliere della brace */}
          <div data-tempo="3" className="agri-tav-tagliere" style={{ left: "50%", top: "50%" }}>
            <i /><i /><i />
          </div>
          {/* 4 · dolce e calici */}
          {POSTI.map((p, k) => (
            <div key={"d" + k} data-tempo="4" className="agri-tav-dolce" style={{ left: p.x + (p.x === 50 ? 7 : 0) + "%", top: p.y + (p.x === 50 ? 0 : 9) + "%" }} />
          ))}
        </div>
      </div>
    </section>
  );
}
