import type { AnimaId } from "@/data/masseria";

/**
 * I quattro luoghi reali della Masseria, ancorati alla fotografia aerea.
 * Coordinate in PERCENTUALE rispetto al contenitore della fotografia.
 * `d` = crop desktop (orizzontale), `m` = crop verticale mobile.
 * `lato` = lato di apertura preferito dell'anteprima.
 */
export interface PinAnima {
  id: AnimaId;
  numero: string;
  nome: string;
  descrizione: string;
  invito: string;
  to: "/allevamento" | "/caseificio" | "/macelleria" | "/agriturismo";
  d: { x: number; y: number };
  m: { x: number; y: number };
  lato: "left" | "right";
  /** Colore dominante della pagina di arrivo, anticipato nello stato attivo. */
  tinta: string;
  profondita: number;
}

export const PIN_ANIME: PinAnima[] = [
  {
    id: "allevamento",
    numero: "I",
    nome: "Allevamento",
    descrizione: "Bovini, ovini, suini, equini e avicoli nei terreni della Masseria.",
    invito: "Scendi nei campi",
    to: "/allevamento",
    d: { x: 68, y: 30 },
    m: { x: 64, y: 31 },
    lato: "left",
    tinta: "var(--oliva)",
    profondita: 0.5,
  },
  {
    id: "caseificio",
    numero: "II",
    nome: "Caseificio",
    descrizione:
      "Il latte munto ogni mattina diventa mozzarella, nodini, primo sale e ricotta.",
    invito: "Entra nel bianco",
    to: "/caseificio",
    d: { x: 47, y: 46 },
    m: { x: 38, y: 41 },
    lato: "right",
    tinta: "var(--crema)",
    profondita: 0.8,
  },
  {
    id: "macelleria",
    numero: "III",
    nome: "Macelleria",
    descrizione: "La carne viene esposta e scelta a vista, al banco.",
    invito: "Passa dal banco",
    to: "/macelleria",
    d: { x: 72, y: 55 },
    m: { x: 70, y: 53 },
    lato: "left",
    tinta: "var(--bordeaux)",
    profondita: 1,
  },
  {
    id: "agriturismo",
    numero: "IV",
    nome: "Agriturismo",
    descrizione: "Cucina, tavola e braceria: il pasto completo della Masseria.",
    invito: "Prendi posto",
    to: "/agriturismo",
    d: { x: 56, y: 68 },
    m: { x: 48, y: 66 },
    lato: "right",
    tinta: "var(--terracotta)",
    profondita: 1.3,
  },
];
