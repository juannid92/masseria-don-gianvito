import type { AnimaId } from "./masseria";

/** Editorial scaffolding, NOT verified historical or production claims.
 * Replace copy and null images here when the owner supplies real material.
 * Map anchors remain in pin-anime.ts; this file never guesses real locations.
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
      "Il percorso comincia qui. Prima del banco, prima della cucina, prima di sedersi a tavola.",
    image: null,
    imageBrief: "Il paesaggio e gli animali dell’allevamento, nella luce del mattino.",
    moments: [
      {
        label: "Il luogo",
        title: "Fermarsi. Guardare intorno.",
        body: "Qui troveranno spazio il paesaggio, i suoni e il ritmo dell’allevamento. Un’apertura da vivere prima ancora di leggere.",
      },
      {
        label: "Le persone",
        title: "Una storia fatta di presenza.",
        body: "Questo passaggio accoglierà le voci di chi lavora ogni giorno con gli animali: gesti, ricordi e dettagli raccontati in prima persona.",
      },
      {
        label: "Il legame",
        title: "Da qui, il viaggio si divide.",
        body: "Due percorsi da esplorare: il caseificio e la macelleria. Due capitoli della stessa masseria, prima dell’incontro a tavola.",
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
      "Dall’origine al gesto. Un capitolo da raccontare attraverso le mani, la materia e il tempo.",
    image: null,
    imageBrief: "Le mani al lavoro nel caseificio, tra latte, vapore e lavorazione.",
    moments: [
      {
        label: "La materia",
        title: "Avvicinarsi al dettaglio.",
        body: "Una fotografia ravvicinata aprirà il racconto. Le lavorazioni e i prodotti saranno descritti solo dopo la conferma della masseria.",
      },
      {
        label: "Le mani",
        title: "Il gesto, prima del risultato.",
        body: "Qui entreranno le persone del caseificio e il loro modo di lavorare. Nessuna storia inventata: il racconto aspetta le loro parole.",
      },
      {
        label: "Il legame",
        title: "Il percorso continua.",
        body: "Si torna al filo che unisce i luoghi. La tappa successiva è il banco della macelleria; la tavola resta il punto d’incontro.",
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
      "Un nuovo punto di vista sulla masseria. Il banco diventa il passaggio tra il lavoro e la tavola.",
    image: null,
    imageBrief: "Il banco e le persone della macelleria, fotografati sul posto.",
    moments: [
      {
        label: "Il banco",
        title: "Una pausa nel percorso.",
        body: "Questo spazio presenterà il banco reale, senza cataloghi fittizi o tagli inventati. Una scena essenziale, costruita intorno a una fotografia.",
      },
      {
        label: "Il dialogo",
        title: "La storia passa dalle persone.",
        body: "Il racconto accoglierà le parole di chi segue la macelleria: come si sceglie, cosa si propone, quali dettagli vale la pena conoscere.",
      },
      {
        label: "Il legame",
        title: "Adesso, prendere posto.",
        body: "L’agriturismo è la prossima tappa. Qui il viaggio incontra la cucina, il menù e il tempo condiviso a tavola.",
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
      "L’ultima tappa del viaggio, il primo momento da condividere. Storia, cucina e ospitalità si incontrano qui.",
    image: null,
    imageBrief: "La tavola e l’ospitalità dell’agriturismo, fotografate sul posto.",
    moments: [],
  },
];
export const chapterPath = (id: AnimaId) =>
  `/${id}` as "/allevamento" | "/caseificio" | "/macelleria" | "/agriturismo";
