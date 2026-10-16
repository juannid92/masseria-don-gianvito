/**
 * DATI REALI — Masseria Don Gianvito.
 * Unica fonte di verità: nessun dato può essere inventato altrove nel sito.
 * Ogni modifica a ragione sociale, indirizzo o P.IVA deve avvenire qui.
 */


export const MASSERIA = {
  nome: "Masseria Don Gianvito",
  sopratitolo: "Macelleria · Caseificio · Agriturismo · Allevamento",
  tagline: "Allevamento, caseificio, macelleria e agriturismo, in un’unica masseria a Noci.",
  indirizzo: "SP237 ex SS377 per Mottola km 6,5, Zona C 76, 70015 Noci (BA)",
  coordinate: { lat: 40.642739, lng: 17.0426 },
  coordinateLabel: "40.642739, 17.042600",
  piva: "05839280723",
  cciaaDal: 2002,
  telefono: "333 939 5750",
  telefonoHref: "tel:+393339395750",
  telefono2: "333 387 0292",
  telefono2Href: "tel:+393333870292",
  whatsapp: "https://wa.me/393339395750",
  /** WhatsApp con messaggio precompilato per la prenotazione di un tavolo. */
  whatsappPrenota:
    "https://wa.me/393339395750?text=" +
    encodeURIComponent(
      "Buongiorno, vorrei prenotare un tavolo alla Masseria Don Gianvito. Siamo in ___ persone, per il giorno ___. Grazie.",
    ),
  instagram: "https://instagram.com/masseria_don_gianvito",
  facebook: "https://facebook.com/masseriadongianvito",
  maps: "https://www.google.com/maps?q=40.642739,17.042600",
  mapsEmbed: "https://www.google.com/maps?q=40.642739,17.042600&z=15&output=embed",
} as const;

/** Orari — nessun orario numerico, nessuno stato "aperto ora". */
export const ORARI = [
  { giorno: "Lunedì", servizio: "Chiuso" },
  { giorno: "Martedì", servizio: "Chiuso" },
  { giorno: "Mercoledì", servizio: "Cena" },
  { giorno: "Giovedì", servizio: "Cena" },
  { giorno: "Venerdì", servizio: "Cena" },
  { giorno: "Sabato", servizio: "Cena" },
  { giorno: "Domenica e festivi", servizio: "Pranzo" },
] as const;

export type AnimaId = "allevamento" | "caseificio" | "macelleria" | "agriturismo";

export interface Anima {
  id: AnimaId;
  numero: string;
  nome: string;
  claim: string;
  to: "/allevamento" | "/caseificio" | "/macelleria" | "/agriturismo";
}

export const ANIME: Anima[] = [
  {
    id: "allevamento",
    numero: "I",
    nome: "Allevamento",
    claim: "La terra e gli animali",
    to: "/allevamento",
  },
  {
    id: "caseificio",
    numero: "II",
    nome: "Caseificio",
    claim: "Il latte diventa formaggio",
    to: "/caseificio",
  },
  {
    id: "macelleria",
    numero: "III",
    nome: "Macelleria",
    claim: "La carne, scelta al banco",
    to: "/macelleria",
  },
  {
    id: "agriturismo",
    numero: "IV",
    nome: "Agriturismo",
    claim: "Cucina, tavola e brace",
    to: "/agriturismo",
  },
];

/** I sette atti della Home. L'Hero non entra nella numerazione. */
export const ATTI = [
  { id: "manifesto", numero: "01", nome: "Manifesto" },
  { id: "storia", numero: "02", nome: "Storia" },
  { id: "luogo", numero: "03", nome: "Il Luogo" },
  { id: "filiera", numero: "04", nome: "La Filiera" },
  { id: "tavola", numero: "05", nome: "La Tavola" },
  { id: "la-voce", numero: "06", nome: "La Voce" },
  { id: "prenota", numero: "07", nome: "Prenota" },
] as const;

/** Sezioni Home linkate direttamente dall'header. */
export const HEADER_SEZIONI = [
  { id: "mappa", nome: "Esplora" },
  { id: "storia", nome: "Storia" },
  { id: "luogo", nome: "Il Luogo" },
  { id: "filiera", nome: "La Filiera" },
  { id: "tavola", nome: "La Tavola" },
] as const;
