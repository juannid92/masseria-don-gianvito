import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import aerial from "@/assets/masseria-aerial.asset.json";
import { MASSERIA, ORARI } from "@/data/masseria";

/* ──────────────────────────────────────────────────────────────────────────
   AGRITURISMO — il racconto dopo l'hero.
   1. La casa: la foto aerea si apre da una finestra fino a tutto schermo
      (nessuna scritta sopra la foto).
   2. La sera: un quadrante sole→luna gira con lo scroll, il fondo passa
      dal tramonto alla notte, compaiono le stelle.
   3. La carta: menù come carta stampata, ogni piatto dice da quale anima
      della masseria arriva.
   4. Prenota: orari reali, contatti reali, bottone magnetico.
   5. Fine del viaggio: le tre anime, ognuna col suo colore e il suo font.
   I testi sono editoriali e provvisori; dati e orari arrivano da masseria.ts.
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

/* 1 ─ LA CASA ───────────────────────────────────────────────────────────── */
export function AgriLaCasa() {
  const root = useRef<HTMLElement>(null);
  const [src, setSrc] = useState<string>(aerial.url);
  const [missing, setMissing] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (img.current?.complete && !img.current.naturalWidth) setMissing(true);
  }, [src]);

  useMotion(root, (el) => {
    el.classList.add("is-animated");
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: el.querySelector(".agri-casa-pin"),
        start: "top top",
        end: "+=160%",
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      },
    });
    tl.fromTo(
      ".agri-casa-window",
      { clipPath: "inset(24% 30% 24% 30% round 220px)" },
      { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 },
      0,
    )
      .fromTo(
        ".agri-casa-window img, .agri-casa-fallback",
        { scale: 1.35 },
        { scale: 1, duration: 1 },
        0,
      )
      .fromTo(
        ".agri-casa-before",
        { autoAlpha: 1, y: 0 },
        { autoAlpha: 0, y: -60, duration: 0.35 },
        0,
      )
      .fromTo(".agri-casa-coord", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.75);

    gsap.from(el.querySelectorAll(".agri-casa-after .agri-reveal"), {
      y: 40,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".agri-casa-after", start: "top 80%" },
    });
    return () => el.classList.remove("is-animated");
  });

  return (
    <section ref={root} className="agri-casa" data-tone="dark">
      <div className="agri-casa-pin">
        <div className="agri-casa-before">
          <p className="agri-eyebrow">La casa · dal Cinquecento</p>
          <p className="agri-casa-statement">
            La stessa casa,
            <br />
            <em>nella stessa terra.</em>
          </p>
        </div>
        <div className="agri-casa-window">
          {missing ? (
            <div className="agri-casa-fallback" aria-hidden="true" />
          ) : (
            <img
              ref={img}
              src={src}
              alt="La Masseria Don Gianvito vista dall’alto, tra i campi di Noci"
              onError={() =>
                src === aerial.url ? setSrc("/images/masseria-aerial.jpg") : setMissing(true)
              }
            />
          )}
        </div>
        <p className="agri-casa-coord" aria-hidden="true">
          {MASSERIA.coordinateLabel} · Noci, Bari
        </p>
      </div>

      <div className="agri-shell agri-casa-after">
        <p className="agri-casa-lead agri-reveal">
          La masseria attraversa i secoli conservando il rapporto fra casa, campi, animali e lavoro.
          Oggi l’agriturismo è il punto in cui questa storia si apre agli ospiti.
        </p>
        <dl className="agri-facts">
          <div className="agri-reveal">
            <dt>Dove</dt>
            <dd>Campagne di Noci, provinciale per Mottola.</dd>
          </div>
          <div className="agri-reveal">
            <dt>Quando</dt>
            <dd>Mercoledì–sabato a cena. Domenica e festivi a pranzo.</dd>
          </div>
          <div className="agri-reveal">
            <dt>Come</dt>
            <dd>Su prenotazione, per telefono o WhatsApp.</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* 2 ─ LA SERA ───────────────────────────────────────────────────────────── */
const SERA = [
  {
    label: "Il tramonto",
    title: "Si arriva quando la luce scende sui campi.",
    body: "Il cortile si riempie piano. Nessuna fretta: la sera qui ha un ritmo suo, e lo impari appena scendi dall’auto.",
  },
  {
    label: "La brace",
    title: "Il fuoco è acceso da ore.",
    body: "La brace d’ulivo è pronta prima degli ospiti. È il primo profumo che incontri, prima ancora della sala.",
  },
  {
    label: "La tavola",
    title: "Tutto quello che hai visto arriva qui.",
    body: "Il latte del mattino, la carne scelta al banco, i campi intorno. La filiera si chiude nel piatto, a pochi metri da dove è cominciata.",
  },
  {
    label: "La notte",
    title: "Poi restano le stelle sopra la masseria.",
    body: "Si esce nel cortile, si guarda in alto. Il buio della campagna è parte dell’esperienza quanto la cena.",
  },
];

export function AgriLaSera() {
  const root = useRef<HTMLElement>(null);

  useMotion(root, (el) => {
    const dial = el.querySelector(".agri-dial-rotor");
    const label = el.querySelector<HTMLElement>(".agri-dial-label");
    // Quadrante e cielo: dal tramonto alla notte lungo tutta la sezione.
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
      })
      .fromTo(dial, { rotate: 0 }, { rotate: 180 }, 0)
      .fromTo(
        el,
        { "--sky-a": "#5b3524", "--sky-b": "#b06a3c" },
        { "--sky-a": "#07080d", "--sky-b": "#141826" },
        0,
      )
      .fromTo(".agri-stars", { autoAlpha: 0 }, { autoAlpha: 1 }, 0.55);

    el.querySelectorAll<HTMLElement>(".agri-sera-moment").forEach((m, i) => {
      gsap.from(m.querySelectorAll(".agri-reveal"), {
        y: 50,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: m, start: "top 75%", toggleActions: "play none none reverse" },
      });
      ScrollTrigger.create({
        trigger: m,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive && label) label.textContent = SERA[i].label;
        },
      });
    });
  });

  return (
    <section ref={root} className="agri-sera" data-tone="dark">
      <div className="agri-stars" aria-hidden="true" />
      <div className="agri-shell agri-sera-grid">
        <aside className="agri-dial" aria-hidden="true">
          <p className="agri-eyebrow">Una sera alla masseria</p>
          <div className="agri-dial-face">
            <svg viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke="currentColor"
                strokeOpacity=".25"
              />
              <circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeOpacity=".12"
                strokeDasharray="2 6"
              />
              <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeOpacity=".35" />
            </svg>
            <div className="agri-dial-rotor">
              <span className="agri-dial-sun" />
              <span className="agri-dial-moon" />
            </div>
            <div className="agri-dial-horizon" />
          </div>
          <p className="agri-dial-label">{SERA[0].label}</p>
        </aside>
        <div className="agri-sera-list">
          {SERA.map((m, i) => (
            <article key={m.label} className="agri-sera-moment">
              <p className="agri-eyebrow agri-reveal">
                {String(i + 1).padStart(2, "0")} — {m.label}
              </p>
              <h3 className="agri-reveal">{m.title}</h3>
              <p className="agri-reveal">{m.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 3 ─ LA CARTA ──────────────────────────────────────────────────────────── */
type Origine = "allevamento" | "caseificio" | "macelleria" | "campi";
const CARTA: { id: string; title: string; items: { nome: string; nota: string; da: Origine }[] }[] =
  [
    {
      id: "antipasti",
      title: "Per cominciare",
      items: [
        { nome: "Latticini del mattino", nota: "Piatto da definire", da: "caseificio" },
        { nome: "Salumi della casa", nota: "Piatto da definire", da: "macelleria" },
        { nome: "L’orto di stagione", nota: "Piatto da definire", da: "campi" },
      ],
    },
    {
      id: "brace",
      title: "Dalla brace",
      items: [
        { nome: "Tagli del banco", nota: "Disponibilità del giorno", da: "macelleria" },
        { nome: "Bombette e salsiccia", nota: "Piatto da definire", da: "macelleria" },
        { nome: "Carni dell’allevamento", nota: "Piatto da definire", da: "allevamento" },
      ],
    },
    {
      id: "fine",
      title: "Per finire",
      items: [
        { nome: "Formaggi stagionati", nota: "Piatto da definire", da: "caseificio" },
        { nome: "Dolce della casa", nota: "Piatto da definire", da: "campi" },
        { nome: "Frutta di stagione", nota: "Piatto da definire", da: "campi" },
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
      { rotate: -2.5, y: 80 },
      {
        rotate: 0,
        y: 0,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "center center", scrub: 0.8 },
      },
    );
  });

  // Ogni cambio di sezione: le righe entrano una dopo l'altra.
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
            Ogni piatto sa
            <br />
            <em>da dove arriva.</em>
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
                <span className="agri-carta-price">€ —</span>
              </li>
            ))}
          </ul>
          <p className="agri-carta-foot">
            Menù in preparazione: piatti e prezzi saranno inseriti quando confermati dalla masseria.
          </p>
        </div>
      </div>
    </section>
  );
}

/* 4 ─ PRENOTA ───────────────────────────────────────────────────────────── */
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
              <span>La sera comincia</span>
            </span>
            <span className="agri-line">
              <span>
                <em>prima di arrivare.</em>
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

/* 5 ─ FINE DEL VIAGGIO ──────────────────────────────────────────────────── */
const ANIME_FINE = [
  {
    n: "01",
    nome: "Allevamento",
    claim: "Prima di tutto, la terra.",
    to: "/allevamento" as const,
    tone: "allevamento",
  },
  {
    n: "02",
    nome: "Caseificio",
    claim: "Il bianco prende forma.",
    to: "/caseificio" as const,
    tone: "caseificio",
  },
  {
    n: "03",
    nome: "Macelleria",
    claim: "Il momento della scelta.",
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
          Prima della tavola <em>c’è tutto il resto.</em>
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
