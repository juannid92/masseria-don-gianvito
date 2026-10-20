import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MASSERIA, ORARI } from "@/data/masseria";

/* ──────────────────────────────────────────────────────────────────────────
   AGRITURISMO — La Carta, Prenota e Fine del Viaggio.
   - La carta: menù come carta stampata, ogni piatto indica da quale anima
     della masseria arriva.
   - Prenota: orari reali, contatti reali, bottone magnetico.
   - Fine del viaggio: le altre tre anime, con ritorno alla mappa.
   ────────────────────────────────────────────────────────────────────────── */

function useMotion(
  root: React.RefObject<HTMLElement | null>,
  build: (el: HTMLElement) => void | (() => void),
) {
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => build(root.current!));
      return () => mm.revert();
    },
    { scope: root },
  );
}

/* 1 ─ LA CARTA ──────────────────────────────────────────────────────────── */
type Origine = "allevamento" | "caseificio" | "macelleria" | "campi";
const CARTA: { id: string; title: string; items: { nome: string; nota: string; da: Origine }[] }[] =
  [
    {
      id: "antipasti",
      title: "Per cominciare",
      items: [
        {
          nome: "Latticini del mattino",
          nota: "Mozzarella, nodini, primo sale e ricotta fresca del caseificio",
          da: "caseificio",
        },
        {
          nome: "Salumi della casa",
          nota: "Selezione di salumi lavorati nella macelleria della masseria",
          da: "macelleria",
        },
        {
          nome: "Focaccia, frittelle e orto",
          nota: "Farina del grano tenero aziendale e verdure secondo stagione",
          da: "campi",
        },
      ],
    },
    {
      id: "brace",
      title: "Cucina e brace",
      items: [
        {
          nome: "Primi della cucina di casa",
          nota: "Piatti caldi della tradizione murgiana secondo stagione",
          da: "campi",
        },
        {
          nome: "Tagli scelti al banco",
          nota: "Carni dell’azienda cotte alla brace, secondo disponibilità del giorno",
          da: "macelleria",
        },
        {
          nome: "Bombette e salsiccia alla brace",
          nota: "Preparazioni del banco cotte lentamente sulla brace",
          da: "allevamento",
        },
      ],
    },
    {
      id: "fine",
      title: "Per finire",
      items: [
        {
          nome: "Formaggi stagionati",
          nota: "Affinati con attesa nel caseificio aziendale",
          da: "caseificio",
        },
        {
          nome: "Dolce della casa",
          nota: "Preparato nella cucina dell’agriturismo",
          da: "campi",
        },
        {
          nome: "Frutta di stagione",
          nota: "Raccolta nei terreni intorno alla masseria",
          da: "campi",
        },
      ],
    },
  ];
const ORIGINE_LABEL: Record<Origine, string> = {
  allevamento: "Allevamento",
  caseificio: "Caseificio",
  macelleria: "Macelleria",
  campi: "I campi",
};

export function AgriLaCarta() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useMotion(root, (el) => {
    gsap.from(el.querySelectorAll(".agri-carta-head .agri-reveal"), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });
    gsap.fromTo(
      ".agri-carta-sheet",
      { rotate: -1.5, y: 60 },
      {
        rotate: 0,
        y: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: 0.8 },
      },
    );
  });

  useEffect(() => {
    const rows = root.current?.querySelectorAll(".agri-carta-row");
    if (!rows?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      rows,
      { y: 18, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.6, ease: "power3.out" },
    );
  }, [active]);

  const section = CARTA[active];
  return (
    <section ref={root} id="menu" className="agri-carta" data-tone="light">
      <div className="agri-shell">
        <header className="agri-carta-head">
          <p className="agri-eyebrow agri-reveal">La carta</p>
          <h2 className="agri-reveal">
            Ogni piatto
            <br />
            <em>ha una provenienza.</em>
          </h2>
        </header>
        <div className="agri-carta-sheet">
          <div className="agri-carta-tabs" role="tablist" aria-label="Sezioni del menù">
            {CARTA.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={`carta-${c.id}`}
                onClick={() => setActive(i)}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {c.title}
              </button>
            ))}
          </div>
          <ul id={`carta-${section.id}`} role="tabpanel" className="agri-carta-list">
            {section.items.map((it) => (
              <li key={it.nome} className="agri-carta-row">
                <div>
                  <p className="agri-carta-name">{it.nome}</p>
                  <p className="agri-carta-note">{it.nota}</p>
                </div>
                <span className="agri-carta-dots" aria-hidden="true" />
                <span className={`agri-origine agri-origine--${it.da}`}>
                  {ORIGINE_LABEL[it.da]}
                </span>
              </li>
            ))}
          </ul>
          <p className="agri-carta-foot">
            Le proposte della cucina e i tagli al banco seguono il ritmo delle stagioni e la
            disponibilità quotidiana della masseria.
          </p>
        </div>
      </div>
    </section>
  );
}

/* 2 ─ PRENOTA ───────────────────────────────────────────────────────────── */
export function AgriPrenota() {
  const root = useRef<HTMLElement>(null);
  const btn = useRef<HTMLAnchorElement>(null);

  useMotion(root, (el) => {
    gsap.from(el.querySelectorAll(".agri-line > span"), {
      yPercent: 110,
      stagger: 0.1,
      duration: 1.1,
      ease: "power4.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });
    gsap.from(el.querySelectorAll(".agri-orari li"), {
      x: -20,
      autoAlpha: 0,
      stagger: 0.06,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: { trigger: ".agri-orari", start: "top 85%" },
    });
    // Bottone magnetico.
    const b = btn.current;
    if (!b || window.matchMedia("(hover: none)").matches) return;
    const move = (e: PointerEvent) => {
      const r = b.getBoundingClientRect();
      gsap.to(b, {
        x: (e.clientX - r.left - r.width / 2) * 0.3,
        y: (e.clientY - r.top - r.height / 2) * 0.4,
        duration: 0.4,
        ease: "power3.out",
      });
    };
    const leave = () => gsap.to(b, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    b.addEventListener("pointermove", move);
    b.addEventListener("pointerleave", leave);
    return () => {
      b.removeEventListener("pointermove", move);
      b.removeEventListener("pointerleave", leave);
    };
  });

  return (
    <section ref={root} id="prenota-agriturismo" className="agri-prenota" data-tone="dark">
      <div className="agri-shell agri-prenota-grid">
        <div>
          <p className="agri-eyebrow">Prenota un tavolo</p>
          <h2 className="agri-prenota-title">
            <span className="agri-line">
              <span>Un tavolo</span>
            </span>
            <span className="agri-line">
              <span>
                <em>alla masseria.</em>
              </span>
            </span>
          </h2>
          <div className="agri-prenota-actions">
            <a
              ref={btn}
              href={MASSERIA.whatsappPrenota}
              target="_blank"
              rel="noopener noreferrer"
              className="agri-magnet"
            >
              <span>Scrivi su WhatsApp</span>
            </a>
            <a href={MASSERIA.telefonoHref} className="agri-prenota-phone">
              oppure chiama il {MASSERIA.telefono}
            </a>
          </div>
        </div>
        <div className="agri-prenota-side">
          <p className="agri-eyebrow">Quando siamo aperti</p>
          <ul className="agri-orari">
            {ORARI.map((o) => (
              <li key={o.giorno} className={o.servizio === "Chiuso" ? "is-closed" : undefined}>
                <span>{o.giorno}</span>
                <span>{o.servizio}</span>
              </li>
            ))}
          </ul>
          <p className="agri-prenota-address">
            {MASSERIA.indirizzo}
            <br />
            <a href={MASSERIA.maps} target="_blank" rel="noopener noreferrer">
              Apri in Maps ↗
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

/* 3 ─ FINE DEL VIAGGIO ──────────────────────────────────────────────────── */
const ANIME_FINE = [
  {
    n: "01",
    nome: "Allevamento",
    claim: "La terra e gli animali.",
    to: "/allevamento" as const,
    tone: "allevamento",
  },
  {
    n: "02",
    nome: "Caseificio",
    claim: "Il latte diventa formaggio.",
    to: "/caseificio" as const,
    tone: "caseificio",
  },
  {
    n: "03",
    nome: "Macelleria",
    claim: "La carne, scelta al banco.",
    to: "/macelleria" as const,
    tone: "macelleria",
  },
];

export function AgriFineViaggio() {
  const root = useRef<HTMLElement>(null);
  useMotion(root, (el) => {
    gsap.from(el.querySelectorAll(".agri-fine-row"), {
      yPercent: 40,
      autoAlpha: 0,
      stagger: 0.12,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });
  });
  return (
    <section ref={root} className="agri-fine" data-tone="light">
      <div className="agri-shell">
        <p className="agri-eyebrow">Fine del percorso · 04 / 04</p>
        <h2 className="agri-fine-title">
          Prima della tavola <em>c’è il lavoro della masseria.</em>
        </h2>
        <nav className="agri-fine-list" aria-label="Le altre anime della masseria">
          {ANIME_FINE.map((a) => (
            <Link key={a.to} to={a.to} className={`agri-fine-row agri-fine-row--${a.tone}`}>
              <span className="agri-fine-n">{a.n}</span>
              <span className="agri-fine-name">{a.nome}</span>
              <span className="agri-fine-claim">{a.claim}</span>
              <span className="agri-fine-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </nav>
        <Link to="/" hash="mappa" className="agri-fine-restart">
          ← Ricomincia dalla mappa
        </Link>
      </div>
    </section>
  );
}
