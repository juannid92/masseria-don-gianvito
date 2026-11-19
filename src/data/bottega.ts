/**
 * DATI BOTTEGA — Prodotti tipici della Masseria Don Gianvito.
 * Prezzi indicativi al kg / pezzo. Il cliente conferma prezzo e disponibilità
 * via WhatsApp o chiamata prima della consegna a domicilio.
 */

export type CategoriaBottega = "carne" | "formaggi" | "salumi" | "farina" | "legumi";

export interface ProdottoBottega {
  id: string;
  nome: string;
  categoria: CategoriaBottega;
  descrizione: string;
  /** Prezzo indicativo. null = "su richiesta". */
  prezzo: number | null;
  /** Unità di misura visualizzata accanto al prezzo. */
  unita: string;
  /** Disponibile per la consegna a domicilio. */
  consegna: boolean;
  /** Percorso immagine prodotto (placeholder se non disponibile). */
  immagine: string;
}

export const CATEGORIE_BOTTEGA: { id: CategoriaBottega; nome: string }[] = [
  { id: "carne", nome: "Carne" },
  { id: "formaggi", nome: "Formaggi e Latticini" },
  { id: "salumi", nome: "Salumi" },
  { id: "farina", nome: "Farine" },
  { id: "legumi", nome: "Legumi" },
];

export const PRODOTTI_BOTTEGA: ProdottoBottega[] = [
  // ── CARNE ──────────────────────────────────────────────────────────────
  {
    id: "bistecca-costata",
    nome: "Bistecca di costata",
    categoria: "carne",
    descrizione:
      "Taglio pregiato di bovino adulto allevato in masseria, frollatura minima 15 giorni.",
    prezzo: 28,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/carne-placeholder.jpg",
  },
  {
    id: "filetto-bovino",
    nome: "Filetto di bovino",
    categoria: "carne",
    descrizione: "Il taglio più tenero, ideale per cotture rapide alla brace o in padella.",
    prezzo: 38,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/carne-placeholder.jpg",
  },
  {
    id: "tagliata-controfiletto",
    nome: "Tagliata di controfiletto",
    categoria: "carne",
    descrizione: "Controfiletto intero da affettare dopo la cottura, perfetto per la griglia.",
    prezzo: 26,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/carne-placeholder.jpg",
  },
  {
    id: "braciole-manzo",
    nome: "Braciole di manzo",
    categoria: "carne",
    descrizione: "Fettine sottili da involtino, tradizione pugliese con ripieno a scelta.",
    prezzo: 22,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/carne-placeholder.jpg",
  },
  {
    id: "salsiccia-punta-coltello",
    nome: "Salsiccia a punta di coltello",
    categoria: "carne",
    descrizione: "Macinata grossa di suino e bovino, condita con sale e pepe nero.",
    prezzo: 14,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/carne-placeholder.jpg",
  },
  {
    id: "hamburger-masseria",
    nome: "Hamburger della Masseria",
    categoria: "carne",
    descrizione: "Blend di bovino adulto, 180g cadauno, pronto per la brace.",
    prezzo: 18,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/carne-placeholder.jpg",
  },
  {
    id: "agnello-coscia",
    nome: "Coscia di agnello",
    categoria: "carne",
    descrizione: "Agnello locale, coscia intera da arrosto o spezzatino.",
    prezzo: 16,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/carne-placeholder.jpg",
  },
  {
    id: "capocollo-fresco",
    nome: "Capocollo fresco di suino",
    categoria: "carne",
    descrizione: "Taglio intero di suino allevato in masseria, ideale per arrosti lenti.",
    prezzo: 12,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/carne-placeholder.jpg",
  },

  // ── FORMAGGI E LATTICINI ───────────────────────────────────────────────
  {
    id: "mozzarella-fior-di-latte",
    nome: "Mozzarella fior di latte",
    categoria: "formaggi",
    descrizione: "Prodotta ogni mattina dal latte delle nostre vacche, filatura a mano.",
    prezzo: 12,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/formaggi-placeholder.jpg",
  },
  {
    id: "burrata",
    nome: "Burrata",
    categoria: "formaggi",
    descrizione: "Sacca di mozzarella ripiena di stracciatella e panna fresca.",
    prezzo: 16,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/formaggi-placeholder.jpg",
  },
  {
    id: "ricotta-fresca",
    nome: "Ricotta fresca",
    categoria: "formaggi",
    descrizione: "Ricotta di siero vaccino, cremosa e delicata, prodotta giornalmente.",
    prezzo: 8,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/formaggi-placeholder.jpg",
  },
  {
    id: "caciocavallo-stagionato",
    nome: "Caciocavallo stagionato",
    categoria: "formaggi",
    descrizione: "Stagionatura minima 3 mesi in grotta naturale della masseria.",
    prezzo: 18,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/formaggi-placeholder.jpg",
  },
  {
    id: "scamorza-affumicata",
    nome: "Scamorza affumicata",
    categoria: "formaggi",
    descrizione: "Pasta filata affumicata con legno di faggio, sapore deciso.",
    prezzo: 14,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/formaggi-placeholder.jpg",
  },
  {
    id: "primo-sale",
    nome: "Primo sale",
    categoria: "formaggi",
    descrizione: "Formaggio fresco a pasta molle, leggero e versatile.",
    prezzo: 10,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/formaggi-placeholder.jpg",
  },

  // ── SALUMI ─────────────────────────────────────────────────────────────
  {
    id: "capocollo-stagionato",
    nome: "Capocollo stagionato",
    categoria: "salumi",
    descrizione: "Stagionatura 4 mesi, speziato con vino cotto e pepe.",
    prezzo: 24,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/salumi-placeholder.jpg",
  },
  {
    id: "soppressata",
    nome: "Soppressata",
    categoria: "salumi",
    descrizione: "Insaccato tradizionale pugliese, macinata media, stagionatura 3 mesi.",
    prezzo: 20,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/salumi-placeholder.jpg",
  },
  {
    id: "pancetta-tesa",
    nome: "Pancetta tesa",
    categoria: "salumi",
    descrizione: "Pancetta di suino stagionata con sale, pepe e finocchietto selvatico.",
    prezzo: 18,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/salumi-placeholder.jpg",
  },
  {
    id: "guanciale",
    nome: "Guanciale",
    categoria: "salumi",
    descrizione: "Guancia di suino stagionata, base per carbonara e amatriciana.",
    prezzo: 22,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/salumi-placeholder.jpg",
  },

  // ── FARINE ─────────────────────────────────────────────────────────────
  {
    id: "farina-grano-tenero-tipo2",
    nome: "Farina di grano tenero tipo 2",
    categoria: "farina",
    descrizione: "Macinata a pietra dai nostri campi, semi-integrale, ideale per pane e focacce.",
    prezzo: 3,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/farina-placeholder.jpg",
  },
  {
    id: "farina-grano-duro-senatore",
    nome: "Farina di grano duro Senatore Cappelli",
    categoria: "farina",
    descrizione: "Varietà antica coltivata in masseria, perfetta per pasta fatta in casa.",
    prezzo: 4,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/farina-placeholder.jpg",
  },
  {
    id: "semola-rimacinata",
    nome: "Semola rimacinata di grano duro",
    categoria: "farina",
    descrizione: "Semola fine per pane, pizza e dolci tradizionali pugliesi.",
    prezzo: 3,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/farina-placeholder.jpg",
  },

  // ── LEGUMI ─────────────────────────────────────────────────────────────
  {
    id: "ceci-noci",
    nome: "Ceci di Noci",
    categoria: "legumi",
    descrizione: "Coltivati nei terreni della masseria, piccoli e saporiti, ammollo 12h.",
    prezzo: 5,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/legumi-placeholder.jpg",
  },
  {
    id: "fave-barese",
    nome: "Fave baresi",
    categoria: "legumi",
    descrizione: "Fave secche decorticate della Murgia, base della purea tradizionale.",
    prezzo: 5,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/legumi-placeholder.jpg",
  },
  {
    id: "lenticchie-murgia",
    nome: "Lenticchie della Murgia",
    categoria: "legumi",
    descrizione: "Lenticchie piccole a cottura rapida, sapore terroso e delicato.",
    prezzo: 6,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/legumi-placeholder.jpg",
  },
  {
    id: "cicerchie",
    nome: "Cicerchie",
    categoria: "legumi",
    descrizione: "Legume antico della tradizione murgiana, da zuppe e minestre.",
    prezzo: 7,
    unita: "kg",
    consegna: true,
    immagine: "/images/bottega/legumi-placeholder.jpg",
  },
];
