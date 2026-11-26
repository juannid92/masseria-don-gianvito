import type { AnimaId } from "@/data/masseria";

/**
 * I quattro luoghi reali della Masseria, ancorati alla fotografia aerea.
 * `d` = desktop, `t` = tablet, `m` = mobile: coordinate in PERCENTUALE del
 * contenitore della fotografia (mai pixel assoluti).
 * `off` = direzione di uscita della targa dal nodo, in px (dx, dy).
 * `lato` = lato di apertura della scheda / allineamento del testo.
 */
export interface PinCoord {
  x: number;
  y: number;
  off: { dx: number; dy: number };
}

export interface PinAnima {
  id: AnimaId | "market";
  numero: string;
  nome: string;
  descrizione: string;
  invito: string;
  to: "/allevamento" | "/caseificio" | "/macelleria" | "/agriturismo" | "/market";
  d: PinCoord;
  t: PinCoord;
  m: PinCoord;
  /** Landscape corto (altezza < 520 px): targhe compatte, righe ben separate. */
  s: PinCoord;
  lato: "left" | "right";
  /** Colore dominante della pagina di arrivo, anticipato nello stato attivo. */
  tinta: string;
  profondita: number;
}

export const PIN_ANIME: PinAnima[] = [
  {
    id: "allevamento",
    numero: "01",
    nome: "Allevamento",
    descrizione: "Bovini, ovini, suini ed equini nei terreni della Masseria.",
    invito: "Scendi nei campi",
    to: "/allevamento",
    d: { x: 80, y: 36, off: { dx: -44, dy: 28 } },
    t: { x: 78, y: 38, off: { dx: -34, dy: 26 } },
    m: { x: 80, y: 41, off: { dx: -30, dy: 22 } },
    s: { x: 80, y: 35, off: { dx: -28, dy: 0 } },
    lato: "right",
    tinta: "var(--oro-antico)",
    profondita: 0.5,
  },
  {
    id: "caseificio",
    numero: "02",
    nome: "Caseificio",
    descrizione: "Il latte munto ogni mattina diventa mozzarella e ricotta.",
    invito: "Entra nel bianco",
    to: "/caseificio",
    d: { x: 66, y: 53, off: { dx: 44, dy: -30 } },
    t: { x: 68, y: 52, off: { dx: 34, dy: -28 } },
    m: { x: 75, y: 54, off: { dx: -28, dy: 22 } },
    s: { x: 66, y: 52, off: { dx: 28, dy: 0 } },
    lato: "right",
    tinta: "var(--bianco-calce)",
    profondita: 0.8,
  },
  {
    id: "macelleria",
    numero: "03",
    nome: "Macelleria",
    descrizione: "La carne viene esposta e scelta a vista, al banco.",
    invito: "Passa dal banco",
    to: "/macelleria",
    d: { x: 46, y: 54, off: { dx: -44, dy: 26 } },
    t: { x: 47, y: 54, off: { dx: -34, dy: 24 } },
    m: { x: 36, y: 54, off: { dx: 30, dy: 22 } },
    s: { x: 47, y: 53, off: { dx: -28, dy: 0 } },
    lato: "left",
    tinta: "var(--oro-antico)",
    profondita: 1,
  },
  {
    id: "agriturismo",
    numero: "04",
    nome: "Agriturismo",
    descrizione: "Cucina, tavola e ospitalità: il pasto completo della Masseria.",
    invito: "Prendi posto",
    to: "/agriturismo",
    d: { x: 35, y: 74, off: { dx: 44, dy: -28 } },
    t: { x: 36, y: 73, off: { dx: 34, dy: -26 } },
    m: { x: 25, y: 68, off: { dx: 28, dy: 20 } },
    s: { x: 38, y: 74, off: { dx: 28, dy: 0 } },
    lato: "right",
    tinta: "var(--oro-antico)",
    profondita: 1.3,
  },
  {
    id: "market",
    numero: "05",
    nome: "Market",
    descrizione: "Prodotti tipici della Masseria con consegna a domicilio.",
    invito: "Ordina ora",
    to: "/market",
    d: { x: 58, y: 72, off: { dx: 44, dy: -26 } },
    t: { x: 60, y: 71, off: { dx: 34, dy: -24 } },
    m: { x: 68, y: 69, off: { dx: -30, dy: 20 } },
    s: { x: 60, y: 72, off: { dx: 28, dy: 0 } },
    lato: "right",
    tinta: "var(--market-accent)",
    profondita: 1.6,
  },
];
