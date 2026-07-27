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
  id: AnimaId;
  numero: string;
  nome: string;
  descrizione: string;
  invito: string;
  to: "/allevamento" | "/caseificio" | "/macelleria" | "/agriturismo";
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
    d: { x: 64, y: 20, off: { dx: 44, dy: 28 } },
    t: { x: 62, y: 20, off: { dx: 34, dy: 26 } },
    m: { x: 58, y: 38, off: { dx: -30, dy: 22 } },
    s: { x: 60, y: 18, off: { dx: 28, dy: 0 } },
    lato: "right",
    tinta: "var(--oliva)",
    profondita: 0.5,
  },
  {
    id: "caseificio",
    numero: "02",
    nome: "Caseificio",
    descrizione: "Il latte munto ogni mattina diventa mozzarella e ricotta.",
    invito: "Entra nel bianco",
    to: "/caseificio",
    d: { x: 44, y: 46, off: { dx: 44, dy: -30 } },
    t: { x: 40, y: 46, off: { dx: 34, dy: -28 } },
    m: { x: 34, y: 52, off: { dx: 28, dy: 22 } },
    s: { x: 30, y: 42, off: { dx: 28, dy: 0 } },
    lato: "right",
    tinta: "var(--crema)",
    profondita: 0.8,
  },
  {
    id: "macelleria",
    numero: "03",
    nome: "Macelleria",
    descrizione: "La carne viene esposta e scelta a vista, al banco.",
    invito: "Passa dal banco",
    to: "/macelleria",
    d: { x: 78, y: 60, off: { dx: -44, dy: 26 } },
    t: { x: 74, y: 60, off: { dx: -34, dy: 24 } },
    m: { x: 70, y: 66, off: { dx: -30, dy: 22 } },
    s: { x: 74, y: 66, off: { dx: -28, dy: 0 } },
    lato: "left",
    tinta: "var(--bordeaux)",
    profondita: 1,
  },
  {
    id: "agriturismo",
    numero: "04",
    nome: "Agriturismo",
    descrizione: "Cucina, tavola e ospitalità: il pasto completo della Masseria.",
    invito: "Prendi posto",
    to: "/agriturismo",
    d: { x: 46, y: 86, off: { dx: 44, dy: -28 } },
    t: { x: 42, y: 86, off: { dx: 34, dy: -26 } },
    m: { x: 36, y: 82, off: { dx: 28, dy: 20 } },
    s: { x: 46, y: 88, off: { dx: 28, dy: 0 } },
    lato: "right",
    tinta: "var(--terracotta)",
    profondita: 1.3,
  },
];
