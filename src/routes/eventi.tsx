import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { getAbsoluteUrl } from "@/config/site";
import { MASSERIA } from "@/data/masseria";
import "@/styles/eventi.css";

export const Route = createFileRoute("/eventi")({
  head: () => ({
    meta: [
      { title: "Appuntamenti e Menù — Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "Menù di Natale, Santo Stefano, Capodanno e pranzo della domenica alla Masseria Don Gianvito di Noci. Prenota su WhatsApp o chiamando il 333 387 0292.",
      },
      { property: "og:title", content: "Appuntamenti e Menù — Masseria Don Gianvito" },
      {
        property: "og:description",
        content:
          "Le locandine dei menù delle feste e del pranzo domenicale della Masseria Don Gianvito, a Noci.",
      },
      { property: "og:url", content: getAbsoluteUrl("/eventi") },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/eventi") }],
  }),
  component: EventiPage,
});

type Portata = { titolo: string; testo: string };
type Appuntamento = {
  id: string;
  nome: string;
  data: string;
  tipo: string;
  prezzo: number;
  portate: Portata[];
  nota?: string;
};

const ARROSTO = "Salsiccia di vitello, salsiccia di maiale, bombette e agnello";
const BEVANDE_FESTE = "Acqua, vino, birra, coca-cola e aranciata · caffè o amaro";

const festa = (id: string, nome: string, data: string, prezzo: number): Appuntamento => ({
  id,
  nome,
  data,
  tipo: "Menù pranzo",
  prezzo,
  portate: [
    { titolo: "Antipasti", testo: "Assaggi della casa, caldi e freddi: undici piccole portate" },
    { titolo: "Primi", testo: "Due primi impiattati, accompagnati da crudité" },
    { titolo: "Secondo", testo: `Arrosto misto: ${ARROSTO.toLowerCase()}` },
    { titolo: "Contorni", testo: "Insalata verde e patate arrosto" },
    { titolo: "Frutta", testo: "Frutta di stagione" },
    { titolo: "Dolci", testo: "Dolci natalizi" },
    { titolo: "Bevande", testo: BEVANDE_FESTE },
  ],
});

const APPUNTAMENTI: Appuntamento[] = [
  festa("natale", "Natale", "25 dicembre", 60),
  festa("santo-stefano", "Santo Stefano", "26 dicembre", 50),
  festa("capodanno", "Capodanno", "1 gennaio", 60),
  {
    id: "domenica",
    nome: "Domenica",
    data: "Ogni domenica a pranzo",
    tipo: "Menù pranzo",
    prezzo: 40,
    portate: [
      { titolo: "Antipasti", testo: "Assaggi della casa, caldi e freddi: undici piccole portate" },
      { titolo: "Primi", testo: "Due assaggi di primo, accompagnati da crudité" },
      { titolo: "Secondo", testo: `Arrosto misto: ${ARROSTO.toLowerCase()}` },
      { titolo: "Contorni", testo: "Insalata verde e patate arrosto" },
      { titolo: "Frutta", testo: "Frutta di stagione impiattata" },
      { titolo: "Dolci", testo: "Dolcetti della casa" },
      { titolo: "Bevande", testo: "Acqua, vino, coca-cola, aranciata e birra" },
    ],
  },
];

const ROMANI = ["I", "II", "III", "IV", "V", "VI", "VII"];

function whatsappFor(a: Appuntamento) {
  const msg = `Buongiorno, vorrei prenotare per il "${a.nome}" (${a.data}) alla Masseria Don Gianvito. Siamo in ___ persone. Grazie.`;
  return `${MASSERIA.whatsapp.split("?")[0]}?text=${encodeURIComponent(msg)}`;
}

function EventiPage() {
  const [activeId, setActiveId] = useState(APPUNTAMENTI[0].id);
  const active = APPUNTAMENTI.find((a) => a.id === activeId) ?? APPUNTAMENTI[0];

  return (
    <main className="ev-page">
      <header className="ev-intro">
        <p className="ev-kicker">Masseria Don Gianvito · Noci</p>
        <h1 className="ev-title">
          Appuntamenti
          <br />
          <em>&amp; menù</em>
        </h1>
        <p className="ev-lead">
          Le tavole delle feste e il pranzo della domenica. Scegli l'appuntamento, leggi il menù e
          prenota con un messaggio o una telefonata.
        </p>
      </header>

      <section className="ev-stage" aria-label="Menù degli appuntamenti">
        <div className="ev-tabs" role="tablist" aria-label="Scegli l'appuntamento">
          {APPUNTAMENTI.map((a, i) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              id={`tab-${a.id}`}
              aria-selected={a.id === activeId}
              aria-controls="ev-poster"
              className="ev-tab"
              onClick={() => setActiveId(a.id)}
            >
              <span className="ev-tab-num">0{i + 1}</span>
              <span className="ev-tab-name">{a.nome}</span>
              <span className="ev-tab-date">{a.id === "domenica" ? "Ogni settimana" : a.data}</span>
            </button>
          ))}
        </div>

        <div className="ev-poster-wrap">
          <article
            key={active.id}
            id="ev-poster"
            role="tabpanel"
            aria-labelledby={`tab-${active.id}`}
            className="ev-poster"
          >
            <div className="ev-poster-frame">
              <span className="ev-corner ev-corner--tl" />
              <span className="ev-corner ev-corner--tr" />
              <span className="ev-corner ev-corner--bl" />
              <span className="ev-corner ev-corner--br" />

              <p className="ev-poster-brand">Masseria Don Gianvito</p>
              <div className="ev-poster-rule" />
              <p className="ev-poster-type">{active.tipo}</p>
              <h2 className="ev-poster-name">{active.nome}</h2>
              <p className="ev-poster-date">{active.data}</p>

              <ol className="ev-courses">
                {active.portate.map((p, i) => (
                  <li key={p.titolo} className="ev-course" style={{ ["--i" as string]: i }}>
                    <span className="ev-course-num">{ROMANI[i]}</span>
                    <span className="ev-course-title">{p.titolo}</span>
                    <span className="ev-course-text">{p.testo}</span>
                  </li>
                ))}
              </ol>

              <div className="ev-price">
                <span className="ev-price-value">€ {active.prezzo}</span>
                <span className="ev-price-unit">a persona · adulti</span>
              </div>
              <p className="ev-poster-note">Prenotazione obbligatoria</p>
            </div>
          </article>
        </div>
      </section>

      <section className="ev-book" aria-labelledby="ev-book-title">
        <div className="ev-book-inner">
          <div>
            <h2 id="ev-book-title" className="ev-book-title">
              Riserva il tuo <em>posto a tavola</em>
            </h2>
            <p className="ev-book-text">
              Scrivici su WhatsApp o chiama il {MASSERIA.telefono}. Indicaci l'appuntamento e il
              numero di persone: ti confermiamo la disponibilità.
            </p>
          </div>
          <div className="ev-book-actions">
            <a
              href={whatsappFor(active)}
              target="_blank"
              rel="noopener noreferrer"
              className="ev-btn ev-btn--solid"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Prenota {active.nome}
            </a>
            <a href={MASSERIA.telefonoHref} className="ev-btn ev-btn--ghost">
              <Phone size={16} aria-hidden="true" />
              Chiama
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
