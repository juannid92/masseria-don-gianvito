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
        label: "La terra",
        title: "Fermarsi. Guardare intorno.",
        body: "Sessanta ettari di pascolo aperto, esposti a mezzogiorno, dove le razze podoliche brucano a passo lento. Niente capannoni chiusi: gli animali scelgono dove fermarsi, e il ritmo lo dettano loro.",
      },
      {
        label: "Gli animali",
        title: "Bovini, ovini, suini. Ciascuno al suo passo.",
        body: "Le vacche podoliche e i vitelli marchigiani convivono con pecore, capre e il suino nero. Ogni gruppo ha il proprio spazio, la propria mangiatoia, il proprio silenzio. Li guardi, e capisci come si sta bene qui.",
      },
      {
        label: "Il ritmo delle stagioni",
        title: "Pascolo d’estate, fieno d’inverno.",
        body: "Da aprile a ottobre gli animali vivono all’aperto, giorno e notte. D’inverno si rifugiano nelle stalle, alimentati con il fieno raccolto in estate. È un ciclo chiuso, antico, che non lascia scarti.",
      },
      {
        label: "Le mani",
        title: "Chi lavora, ogni mattina.",
        body: "Due famiglie, da tre generazioni, si dividono le cure degli animali. La mungitura è ancora manuale, due volte al giorno. Non è un dettaglio da cartolina: è la base di tutto quello che segue.",
      },
      {
        label: "Il legame",
        title: "Da qui, il latte prende la sua strada.",
        body: "Il caseificio è a cinquanta metri dalle stalle. Il latte arriva tiepido, appena munto, e la lavorazione comincia prima che si raffreddi. È un filo corto, e si vede.",
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
        title: "Il latte, prima di diventare formaggio.",
        body: "Dalla stalla al caseificio in cinque minuti a piedi. Il latte crudo, non standardizzato, è la materia con cui si lavora. Ogni giorno una partita diversa, ogni giorno un formaggio diverso.",
      },
      {
        label: "La cagliata",
        title: "Il punto in cui il liquido diventa solido.",
        body: "Caglio, siero, temperatura, attesa. La cagliata si rompe a mano, con la lira, mai con la centrifuga. È un gesto che si vede: lento, regolare, ripetuto per quarant’anni.",
      },
      {
        label: "Le forme",
        title: "Ogni forma ha una sua vita.",
        body: "Trecce, nodini, scamorze, burrate. Ciascuna richiede una lavorazione propria, una formatura, una salatura. I formaggi a pasta filata si lavorano a caldo, con le mani immerse nell’acqua.",
      },
      {
        label: "La stagionatura",
        title: "Il tempo fa il resto.",
        body: "La cantina è fresca, umida, silenziosa. Qui i pecorini e i caprini riposano su assi di legno, anche per mesi. Si girano a mano, si controllano, si aspettano.",
      },
      {
        label: "Il legame",
        title: "Il formaggio è una storia a due sensi.",
        body: "Dal caseificio al banco della macelleria, dalla cucina dell’agriturismo al piatto a tavola. Il filo è lo stesso: la materia è la stessa, le mani che la lavorano anche.",
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
        title: "Vetri, ganci, luci basse.",
        body: "La macelleria si apre sul lato corto del fabbricato. Banco in acciaio, vetri che proteggono la carne, luci che esaltano il colore. È un luogo di passaggio, non di mostra.",
      },
      {
        label: "La fiamma",
        title: "La brace, prima del fuoco.",
        body: "La legna di ulivo, stagionata un anno, è il combustibile della brace. Si accende due ore prima del servizio, perché la brace vera vuole tempo, e chi conosce la brace non ha fretta.",
      },
      {
        label: "Il taglio",
        title: "Ogni taglio ha il suo ritmo.",
        body: "Le carni si frollano in cella per ventuno giorni, trenta per la vaccina matura. Si tagliano a mano, a coltello, davanti al cliente. Niente preconfezionato, niente sottovuoto da banco.",
      },
      {
        label: "Le persone",
        title: "Scelte, consigli, ascolto.",
        body: "Dietro il banco c’è chi conosce la carne di questa masseria, e sa come cucinarla. È una consulenza, non una vendita: si consiglia sulla cottura, sul taglio, sull’abbinamento.",
      },
      {
        label: "Il legame",
        title: "La tavola è dall’altra parte del cortile.",
        body: "Cinquanta metri separano il banco dalla sala dell’agriturismo. Chi vuole può comprare la carne e portarla a casa. Chi vuole può sedersi e assaggiarla cotta, con il contorno, con il bicchiere giusto.",
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
