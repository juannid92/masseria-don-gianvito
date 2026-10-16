import type { AnimaId } from "./masseria";

/** Testi dei capitoli. Nessun dato numerico o storico non verificato:
 * aggiungere cifre, date e nomi solo se confermati dalla masseria.
 * Le posizioni sulla mappa restano in pin-anime.ts.
 */
export interface JourneyChapter {
  id: AnimaId;
  number: string;
  name: string;
  title: [string, string];
  introduction: string;
  keyword: string;
  image: string | null;
  imageBrief: string;
  moments: { label: string; title: string; body: string }[];
}
export const JOURNEY: JourneyChapter[] = [
  {
    id: "allevamento",
    number: "01",
    name: "Allevamento",
    title: ["Prima di tutto,", "la terra."],
    keyword: "Origine",
    introduction:
      "Tutto comincia dalla terra e dagli animali. Il resto della masseria dipende da questo lavoro.",
    image: null,
    imageBrief: "Il paesaggio e gli animali dell’allevamento, nella luce del mattino.",
    moments: [
      {
        label: "La terra",
        title: "Una campagna che lavora.",
        body: "La masseria sorge nelle campagne di Noci, lungo la provinciale per Mottola. Foraggio, grano tenero, ortaggi e frutta crescono sui terreni intorno alla casa e sostengono l’intera attività.",
      },
      {
        label: "Gli animali",
        title: "Bovini, ovini, suini, equini, avicoli.",
        body: "Gli animali vivono in azienda. I bovini, un incrocio tra Pezzata Rossa e Frisona, danno latte e carne; gli altri allevamenti completano l’offerta della masseria.",
      },
      {
        label: "Le stagioni",
        title: "Le stagioni guidano il lavoro.",
        body: "Cosa si semina, quando si munge, cosa arriva in cucina: lo decidono la campagna e gli animali. La masseria si adegua al loro calendario, non il contrario.",
      },
      {
        label: "Le mani",
        title: "Una cura quotidiana.",
        body: "L’allevamento richiede presenza ogni giorno, anche prima dell’alba. È un lavoro continuo, svolto da chi vive e opera sul posto, ed è la base di tutto quello che segue.",
      },
      {
        label: "Il legame",
        title: "Da qui parte la filiera.",
        body: "Il latte munto ogni mattina passa al caseificio; la carne va in macelleria. Tutto resta nello stesso luogo, senza passaggi intermedi.",
      },
    ],
  },
  {
    id: "caseificio",
    number: "02",
    name: "Caseificio",
    title: ["Il bianco", "prende forma."],
    keyword: "Gesto",
    introduction:
      "Il latte della masseria diventa formaggio nello stesso luogo in cui viene prodotto.",
    image: null,
    imageBrief: "Le mani al lavoro nel caseificio, tra latte, vapore e lavorazione.",
    moments: [
      {
        label: "La materia",
        title: "Il latte, ogni mattina.",
        body: "Il latte munto al mattino arriva direttamente al caseificio. È la materia prima di tutta la produzione e determina la qualità di ciò che segue.",
      },
      {
        label: "La lavorazione",
        title: "Un passaggio che richiede attenzione.",
        body: "Dal latte si ottiene la cagliata, da lavorare con tempi e temperature precisi. È la fase in cui l’esperienza di chi lavora conta più di qualsiasi macchina.",
      },
      {
        label: "I prodotti",
        title: "Mozzarella, nodini, primo sale, ricotta.",
        body: "Il caseificio produce mozzarella, nodini, primo sale e ricotta. Sono prodotti freschi, preparati in quantità legate al latte disponibile.",
      },
      {
        label: "Il tempo",
        title: "Ogni formaggio ha il suo tempo.",
        body: "I formaggi freschi si consumano in pochi giorni, altri richiedono attesa. Il caseificio rispetta questi tempi, senza accelerarli.",
      },
      {
        label: "Il legame",
        title: "Dal caseificio alla tavola.",
        body: "I latticini arrivano sul banco e in sala senza passaggi intermedi. Chi li assaggia a tavola mangia un prodotto della stessa masseria.",
      },
    ],
  },
  {
    id: "macelleria",
    number: "03",
    name: "Macelleria",
    title: ["Il momento", "della scelta."],
    keyword: "Incontro",
    introduction:
      "La carne dell’azienda si sceglie al banco, a vista, con il consiglio di chi la conosce.",
    image: null,
    imageBrief: "Il banco e le persone della macelleria, fotografati sul posto.",
    moments: [
      {
        label: "Il banco",
        title: "Un banco a vista.",
        body: "La carne è esposta e si sceglie guardandola. Insieme ai tagli, il banco propone i salumi della masseria.",
      },
      {
        label: "La fiamma",
        title: "La brace.",
        body: "Una parte dei tagli viene cotta alla brace in agriturismo. Il fuoco si accende con anticipo, perché la cottura richiede tempo.",
      },
      {
        label: "Il taglio",
        title: "Il taglio giusto.",
        body: "La scelta del taglio dipende dall’uso: brace, forno o padella. Chi lavora al banco consiglia sulla cottura e sulle quantità.",
      },
      {
        label: "Le persone",
        title: "Competenza e ascolto.",
        body: "Dietro il banco c’è chi conosce la carne della masseria e sa come trattarla. Il consiglio fa parte del servizio.",
      },
      {
        label: "Il legame",
        title: "Dal banco alla sala.",
        body: "Si può acquistare la carne e portarla a casa, oppure sedersi in agriturismo e assaggiarla cotta alla brace. La provenienza è la stessa.",
      },
    ],
  },
  {
    id: "agriturismo",
    number: "04",
    name: "Agriturismo",
    title: ["Ogni percorso", "arriva a tavola."],
    keyword: "Condivisione",
    introduction:
      "L’ultima tappa: la tavola. Qui la produzione della masseria incontra l’ospitalità.",
    image: null,
    imageBrief: "La tavola e l’ospitalità dell’agriturismo, fotografate sul posto.",
    moments: [],
  },
];
export const chapterPath = (id: AnimaId) =>
  `/${id}` as "/allevamento" | "/caseificio" | "/macelleria" | "/agriturismo";
