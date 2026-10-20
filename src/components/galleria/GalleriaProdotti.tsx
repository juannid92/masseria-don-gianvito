import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Categoria = "caseificio" | "macelleria" | "campi";

interface Prodotto {
  id: string;
  nome: string;
  descrizione: string;
  provenienza: string;
  lavorazione: string;
  categoria: Categoria;
}

const prodotti: Prodotto[] = [
  // Caseificio
  {
    id: "mozzarella",
    nome: "Mozzarella e Nodini",
    descrizione:
      "Pasta filata a mano ogni mattina dal latte appena munto nella stalla della masseria, servita in acqua di governo tiepida.",
    provenienza: "Latte aziendale · 0 km",
    lavorazione: "Filatura mattutina a mano",
    categoria: "caseificio",
  },
  {
    id: "burrata-treccia",
    nome: "Burrata e Treccia",
    descrizione:
      "Sfoglia sottile di pasta filata con cuore cremoso di stracciatella e panna fresca, chiusa a mano e trecciata.",
    provenienza: "Latte aziendale · 0 km",
    lavorazione: "Lavorazione giornaliera",
    categoria: "caseificio",
  },
  {
    id: "primo-sale",
    nome: "Primo Sale",
    descrizione:
      "Formaggio fresco a pasta tenera dal gusto delicato di latte crudo, messo in fuscella appena cagliato.",
    provenienza: "Latte aziendale · 0 km",
    lavorazione: "Cagliata fresca in fuscella",
    categoria: "caseificio",
  },
  {
    id: "ricotta-fresca",
    nome: "Ricotta del Mattino",
    descrizione:
      "Ottenuta dall'affioramento del siero caldo di lavorazione, soffice e dolce, servita tiepida o impiegata nei dolci della casa.",
    provenienza: "Siero del caseificio · 0 km",
    lavorazione: "Affioramento a caldo",
    categoria: "caseificio",
  },
  {
    id: "scamorza",
    nome: "Scamorza Bianca e Affumicata",
    descrizione:
      "Pasta filata lasciata riposare a coppie su pertica per alcuni giorni, disponibile naturale o con leggera affumicatura.",
    provenienza: "Latte aziendale · 0 km",
    lavorazione: "Breve maturazione su pertica",
    categoria: "caseificio",
  },
  {
    id: "stagionati",
    nome: "Caciocavallo e Stagionati",
    descrizione:
      "Formaggi a pasta filata e semicotta affinati lentamente sui ceppi del locale di stagionatura della masseria.",
    provenienza: "Latte aziendale · 0 km",
    lavorazione: "Affinamento in masseria",
    categoria: "caseificio",
  },

  // Macelleria
  {
    id: "bovino-aziendale",
    nome: "Tagli Bovini (Pezzata Rossa × Frisona)",
    descrizione:
      "Costate, entrecôte e tagli nobili dai circa 60 capi nati e cresciuti nei nostri recinti e alimentati con i foraggi dei campi.",
    provenienza: "Allevamento proprio · Noci",
    lavorazione: "Taglio al banco e frollatura",
    categoria: "macelleria",
  },
  {
    id: "bombette",
    nome: "Bombette della Tradizione",
    descrizione:
      "Involtini preparati a mano al banco della macelleria con ripieno di formaggio del caseificio, pronti per il fornello a brace.",
    provenienza: "Macelleria e caseificio interni",
    lavorazione: "Preparazione giornaliera a mano",
    categoria: "macelleria",
  },
  {
    id: "salsiccia-fresca",
    nome: "Salsiccia a Punta di Coltello",
    descrizione:
      "Salsiccia fresca lavorata secondo l'uso di Noci, condita con sale, pepe in grani e aromi semplici per la cottura sulla brace viva.",
    provenienza: "Macelleria della masseria",
    lavorazione: "Impasto artigianale",
    categoria: "macelleria",
  },
  {
    id: "tagli-brace",
    nome: "Selezione per il Fornello",
    descrizione:
      "Tagli scelti direttamente al banco della macelleria per l'asporto o per la cottura immediata al fornello nelle sere d'agriturismo.",
    provenienza: "Allevamento proprio e locale",
    lavorazione: "Scelta diretta al banco",
    categoria: "macelleria",
  },
  {
    id: "suini-ovini",
    nome: "Carni Suine e Ovine",
    descrizione:
      "Tagli freschi di suino e agnello della tradizione murgiana, selezionati e preparati secondo la disponibilità della settimana.",
    provenienza: "Filiera controllata murgiana",
    lavorazione: "Taglio tradizionale",
    categoria: "macelleria",
  },
  {
    id: "salumi-masseria",
    nome: "Salumi Stagionati della Masseria",
    descrizione:
      "Capocollo, soppressata e salumi affinati lentamente all'aria fresca dell'altopiano dei trulli, serviti negli antipasti della casa.",
    provenienza: "Lavorazione in masseria",
    lavorazione: "Stagionatura naturale",
    categoria: "macelleria",
  },

  // Campi e Forno
  {
    id: "focaccia-grano",
    nome: "Focaccia di Grano Tenero Aziendale",
    descrizione:
      "Impastata con la farina del grano tenero coltivato nei nostri 120 ettari, a lunga lievitazione e cotta nel forno della masseria.",
    provenienza: "Grano tenero dei nostri campi",
    lavorazione: "Forno della masseria",
    categoria: "campi",
  },
  {
    id: "frittelle-calde",
    nome: "Frittelle e Panini di Casa",
    descrizione:
      "Frittelle gonfie servite calde a inizio pasto e pane casereccio preparato con le farine aziendali.",
    provenienza: "Grano tenero dei nostri campi",
    lavorazione: "Impasto del giorno",
    categoria: "campi",
  },
  {
    id: "ortaggi-campo",
    nome: "Ortaggi e Verdure di Stagione",
    descrizione:
      "Verdure di campo, cicorie, zucchine, peperoni e ortaggi raccolti negli appezzamenti intorno alla masseria secondo il calendario agricolo.",
    provenienza: "Orto e campi della masseria",
    lavorazione: "Raccolta di stagione",
    categoria: "campi",
  },
  {
    id: "sottoli-antipasti",
    nome: "Conserve e Contorni dell'Orto",
    descrizione:
      "Ortaggi grigliati, melanzane, peperoni e preparazioni contadine che accompagnano i latticini e i salumi a centro tavola.",
    provenienza: "Cucina della masseria",
    lavorazione: "Ricetta di famiglia",
    categoria: "campi",
  },
  {
    id: "frutta-stagione",
    nome: "Frutta dei Campi",
    descrizione:
      "Frutta fresca raccolta dagli alberi della tenuta che chiude con semplicità il pasto in agriturismo.",
    provenienza: "Frutteto aziendale · Noci",
    lavorazione: "Raccolta a maturazione",
    categoria: "campi",
  },
  {
    id: "foraggi-cereali",
    nome: "Foraggi e Cereali (120 Ettari)",
    descrizione:
      "Il cuore invisibile della filiera: erbai, fieno e cereali coltivati in proprio per nutrire ogni giorno la mandria della masseria.",
    provenienza: "120 ettari attorno a Noci",
    lavorazione: "Coltivazione aziendale",
    categoria: "campi",
  },
];

const CardProdotto = ({ prodotto, index }: { prodotto: Prodotto; index: number }) => {
  const accentColor =
    prodotto.categoria === "caseificio"
      ? "var(--oro-antico)"
      : prodotto.categoria === "macelleria"
        ? "var(--carminio)"
        : "var(--verde-oliva)";

  return (
    <article className="group relative flex flex-col justify-between border border-[color:var(--pietra-200)] bg-[color:var(--bianco-calce)] p-6 md:p-8 transition-all duration-300 hover:border-[color:var(--oro-antico)]">
      <div>
        <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-[color:var(--pietra-200)]">
          <span
            className="font-eyebrow text-[10px] tracking-[0.28em] uppercase"
            style={{ color: accentColor }}
          >
            {prodotto.provenienza}
          </span>
          <span
            className="font-display text-sm italic tabular-nums"
            style={{ color: "var(--pietra-400)" }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3
          className="font-display text-2xl font-light tracking-tight mb-3"
          style={{ color: "var(--carbone)" }}
        >
          {prodotto.nome}
        </h3>

        <p
          className="text-[15px] leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
        >
          {prodotto.descrizione}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-[color:var(--pietra-200)]/60 flex items-center justify-between">
        <span
          className="font-eyebrow text-[10px] tracking-[0.22em] uppercase"
          style={{ color: "var(--pietra-800)" }}
        >
          {prodotto.lavorazione}
        </span>
      </div>
    </article>
  );
};

const GrigliaProdotti = ({ prodotti }: { prodotti: Prodotto[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {prodotti.map((p, idx) => (
        <CardProdotto key={p.id} prodotto={p} index={idx} />
      ))}
    </div>
  );
};

const EtichettaCategoria = ({ categoria }: { categoria: Categoria }) => {
  const config: Record<Categoria, { label: string; descrizione: string }> = {
    caseificio: {
      label: "Il Caseificio in Masseria",
      descrizione:
        "Lavoriamo esclusivamente il latte munto nella nostra stalla: pasta filata a mano, ricotta calda e formaggi affinati in masseria.",
    },
    macelleria: {
      label: "La Macelleria e il Fornello",
      descrizione:
        "Carni dal nostro allevamento di bovini incrocio Pezzata Rossa e Frisona, preparazioni al banco e salumi della tradizione di Noci.",
    },
    campi: {
      label: "I Campi e il Forno (120 Ettari)",
      descrizione:
        "Dal grano tenero per la nostra focaccia agli ortaggi, alla frutta e ai foraggi coltivati nei terreni che circondano la masseria.",
    },
  };

  return (
    <div className="mb-10">
      <p
        className="font-eyebrow text-xs tracking-widest uppercase mb-3"
        style={{ color: "var(--oro-antico)" }}
      >
        Filiera Corta · Noci
      </p>
      <h2
        className="font-display text-3xl md:text-4xl font-light tracking-tight mb-4"
        style={{ color: "var(--carbone)" }}
      >
        {config[categoria].label}
      </h2>
      <p className="text-base max-w-2xl leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        {config[categoria].descrizione}
      </p>
    </div>
  );
};

export function GalleriaProdotti() {
  const caseificio = prodotti.filter((p) => p.categoria === "caseificio");
  const macelleria = prodotti.filter((p) => p.categoria === "macelleria");
  const campi = prodotti.filter((p) => p.categoria === "campi");

  return (
    <section
      data-tone="light"
      className="py-16 md:py-24 px-5 md:px-10"
      style={{ backgroundColor: "var(--pietra-100)" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <Tabs defaultValue="caseificio" className="w-full">
          <TabsList
            className="w-full sm:w-auto flex flex-wrap gap-1 bg-transparent p-0 mb-12 h-auto border-b border-[color:var(--pietra-200)] rounded-none"
            style={{ backgroundColor: "transparent" }}
          >
            <TabsTrigger
              value="caseificio"
              className="pb-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[color:var(--oro-antico)] data-[state=active]:text-[color:var(--oro-antico)] rounded-none bg-transparent text-[color:var(--pietra-800)] hover:text-[color:var(--oro-antico)] transition-colors"
            >
              <span className="font-eyebrow text-xs tracking-[0.22em] uppercase">
                01 · Caseificio
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="macelleria"
              className="pb-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[color:var(--oro-antico)] data-[state=active]:text-[color:var(--oro-antico)] rounded-none bg-transparent text-[color:var(--pietra-800)] hover:text-[color:var(--oro-antico)] transition-colors"
            >
              <span className="font-eyebrow text-xs tracking-[0.22em] uppercase">
                02 · Macelleria
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="campi"
              className="pb-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-[color:var(--oro-antico)] data-[state=active]:text-[color:var(--oro-antico)] rounded-none bg-transparent text-[color:var(--pietra-800)] hover:text-[color:var(--oro-antico)] transition-colors"
            >
              <span className="font-eyebrow text-xs tracking-[0.22em] uppercase">
                03 · Campi e Forno
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="caseificio" className="mt-0">
            <EtichettaCategoria categoria="caseificio" />
            <GrigliaProdotti prodotti={caseificio} />
          </TabsContent>

          <TabsContent value="macelleria" className="mt-0">
            <EtichettaCategoria categoria="macelleria" />
            <GrigliaProdotti prodotti={macelleria} />
          </TabsContent>

          <TabsContent value="campi" className="mt-0">
            <EtichettaCategoria categoria="campi" />
            <GrigliaProdotti prodotti={campi} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default GalleriaProdotti;
