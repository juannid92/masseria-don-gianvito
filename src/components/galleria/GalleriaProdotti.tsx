import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Categoria = "formaggi" | "carne" | "altro";

interface Prodotto {
  id: string;
  nome: string;
  descrizione: string;
  categoria: Categoria;
  colorePlaceholder: string;
}

const prodotti: Prodotto[] = [
  // Formaggi
  {
    id: "mozza-burr",
    nome: "Mozzarella",
    descrizione:
      "Mozzarella fresca, prodotta nel caseificio della masseria.",
    categoria: "formaggi",
    colorePlaceholder: "bg-pietra-200",
  },
  {
    id: "burrata",
    nome: "Burrata Pugliese",
    descrizione: "Burrata fresca con cuore di stracciatella, lavorata a mano.",
    categoria: "formaggi",
    colorePlaceholder: "bg-pietra-200",
  },
  {
    id: "pecorino",
    nome: "Pecorino di Fosso",
    descrizione:
      "Formaggio stagionato dal sapore deciso.",
    categoria: "formaggi",
    colorePlaceholder: "bg-pietra-200",
  },
  {
    id: "cacio",
    nome: "Caciovito Riserva",
    descrizione:
      "Formaggio a pasta semicotta, lasciato maturare con tempo.",
    categoria: "formaggi",
    colorePlaceholder: "bg-pietra-200",
  },
  {
    id: "ricotta",
    nome: "Ricotta Fresca",
    descrizione:
      "Ricotta ottenuta dalla lavorazione del siero.",
    categoria: "formaggi",
    colorePlaceholder: "bg-pietra-200",
  },
  {
    id: "scamorza",
    nome: "Scamorza Affumicata",
    descrizione: "Scamorza affumicata, a pasta morbida.",
    categoria: "formaggi",
    colorePlaceholder: "bg-pietra-200",
  },
  // Carne
  {
    id: "pugliese-fasani",
    nome: "Pugliese Fasani",
    descrizione: "Carne bovina di allevamento locale, da scegliere al banco.",
    categoria: "carne",
    colorePlaceholder: "bg-carminio/20",
  },
  {
    id: "vitello-podolico",
    nome: "Vitello Podolico",
    descrizione:
      "Carne di vitello, da scegliere al banco secondo disponibilità.",
    categoria: "carne",
    colorePlaceholder: "bg-carminio/20",
  },
  {
    id: "cavallo-murge",
    nome: "Cavallo delle Murge",
    descrizione: "Carne equina della tradizione pugliese.",
    categoria: "carne",
    colorePlaceholder: "bg-carminio/20",
  },
  {
    id: "capretto",
    nome: "Capretto da Latte",
    descrizione: "Capretto da latte, carne delicata, secondo disponibilità.",
    categoria: "carne",
    colorePlaceholder: "bg-carminio/20",
  },
  {
    id: "agneau",
    nome: "Agnello Pasquale",
    descrizione: "Agnello da latte, legato alla tradizione pasquale pugliese.",
    categoria: "carne",
    colorePlaceholder: "bg-carminio/20",
  },
  {
    id: "suino-nero",
    nome: "Suino Nero Siciliano",
    descrizione: "Salumi e carne di suino, lavorati artigianalmente.",
    categoria: "carne",
    colorePlaceholder: "bg-carminio/20",
  },
  // Altro
  {
    id: "olio-evo",
    nome: "Olio Extravergine",
    descrizione:
      "Olio extravergine d’oliva.",
    categoria: "altro",
    colorePlaceholder: "bg-oro-antico/30",
  },
  {
    id: "vino-nero",
    nome: "Negroamaro IGT",
    descrizione: "Vino rosso pugliese da uve Negroamaro.",
    categoria: "altro",
    colorePlaceholder: "bg-oro-antico/30",
  },
  {
    id: "pasta-senatore",
    nome: "Pasta Senatore Cappelli",
    descrizione:
      "Pasta di grano duro, trafilata al bronzo.",
    categoria: "altro",
    colorePlaceholder: "bg-oro-antico/30",
  },
  {
    id: "legumi-fave",
    nome: "Fave di Sant'Eramo",
    descrizione:
      "Fave secche della tradizione pugliese.",
    categoria: "altro",
    colorePlaceholder: "bg-oro-antico/30",
  },
  {
    id: "cotto-mocale",
    nome: "Cotto Mocale",
    descrizione:
      "Prosciutto cotto artigianale.",
    categoria: "altro",
    colorePlaceholder: "bg-oro-antico/30",
  },
  {
    id: "salamelle",
    nome: "Salamelle Peperoncino",
    descrizione:
      "Salamelle piccanti artigianali, ricetta tradizionale pugliese.",
    categoria: "altro",
    colorePlaceholder: "bg-oro-antico/30",
  },
];

const PlaceholderImmagine = ({ prodotto }: { prodotto: Prodotto }) => {
  const iniziali = prodotto.nome
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${prodotto.colorePlaceholder} relative aspect-[4/3] flex items-center justify-center overflow-hidden`}
    >
      <span
        className="font-display text-4xl font-light tracking-tight opacity-40"
        style={{ color: "var(--pietra-400)" }}
      >
        {iniziali}
      </span>
      <span
        className="absolute bottom-3 right-3 text-xs tracking-wider uppercase opacity-60"
        style={{ color: "var(--pietra-800)", fontFamily: "var(--font-eyebrow)" }}
      >
        {prodotto.categoria}
      </span>
    </div>
  );
};

const CardProdotto = ({ prodotto }: { prodotto: Prodotto }) => {
  return (
    <article className="group border border-pietra-200 bg-bianco-calce overflow-hidden transition-shadow hover:shadow-lg">
      <PlaceholderImmagine prodotto={prodotto} />
      <div className="p-5">
        <h3 className="font-display text-xl font-light tracking-tight text-carbone mb-2">
          {prodotto.nome}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {prodotto.descrizione}
        </p>
      </div>
    </article>
  );
};

const GrigliaProdotti = ({ prodotti }: { prodotti: Prodotto[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {prodotti.map((p) => (
        <CardProdotto key={p.id} prodotto={p} />
      ))}
    </div>
  );
};

const EtichettaCategoria = ({ categoria }: { categoria: "formaggi" | "carne" | "altro" }) => {
  const config: Record<Categoria, { label: string; descrizione: string }> = {
    formaggi: {
      label: "Formaggi e Latticini",
      descrizione: "Latticini freschi prodotti nel caseificio della masseria.",
    },
    carne: {
      label: "Carne e Salumi",
      descrizione:
        "Carni dell’allevamento e salumi, da scegliere al banco.",
    },
    altro: {
      label: "Olio, Vino e Prodotti della Terra",
      descrizione: "Olio, vino, pasta e legumi della tradizione pugliese.",
    },
  };

  return (
    <div className="mb-10">
      <p
        className="font-eyebrow text-xs tracking-widest uppercase mb-3"
        style={{ color: "var(--oro-antico)" }}
      >
        La Nostra Selezione
      </p>
      <h2
        className="font-display text-3xl md:text-4xl font-light tracking-tight mb-4"
        style={{ color: "var(--carbone)" }}
      >
        {config[categoria].label}
      </h2>
      <p className="text-base max-w-2xl" style={{ color: "var(--muted-foreground)" }}>
        {config[categoria].descrizione}
      </p>
    </div>
  );
};

export function GalleriaProdotti() {
  const formaggi = prodotti.filter((p) => p.categoria === "formaggi");
  const carne = prodotti.filter((p) => p.categoria === "carne");
  const altro = prodotti.filter((p) => p.categoria === "altro");

  return (
    <section
      className="py-16 md:py-24 px-4 md:px-8"
      style={{ backgroundColor: "var(--pietra-100)" }}
    >
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="formaggi" className="w-full">
          <TabsList
            className="w-full sm:w-auto flex gap-1 bg-transparent p-0 mb-10 h-auto border-b border-pietra-200 rounded-none"
            style={{ backgroundColor: "transparent" }}
          >
            <TabsTrigger
              value="formaggi"
              className="pb-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-oro-antico data-[state=active]:text-oro-antico rounded-none bg-transparent text-pietra-800 hover:text-oro-antico transition-colors"
              style={
                {
                  "--tw-text-opacity": "1",
                  color: "var(--pietra-800)",
                } as React.CSSProperties
              }
            >
              <span className="font-eyebrow text-sm tracking-wider">Formaggi</span>
            </TabsTrigger>
            <TabsTrigger
              value="carne"
              className="pb-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-oro-antico data-[state=active]:text-oro-antico rounded-none bg-transparent text-pietra-800 hover:text-oro-antico transition-colors"
              style={
                {
                  "--tw-text-opacity": "1",
                  color: "var(--pietra-800)",
                } as React.CSSProperties
              }
            >
              <span className="font-eyebrow text-sm tracking-wider">Carne</span>
            </TabsTrigger>
            <TabsTrigger
              value="altro"
              className="pb-4 px-6 data-[state=active]:border-b-2 data-[state=active]:border-oro-antico data-[state=active]:text-oro-antico rounded-none bg-transparent text-pietra-800 hover:text-oro-antico transition-colors"
              style={
                {
                  "--tw-text-opacity": "1",
                  color: "var(--pietra-800)",
                } as React.CSSProperties
              }
            >
              <span className="font-eyebrow text-sm tracking-wider">Olio, Vino e Altro</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formaggi" className="mt-0">
            <EtichettaCategoria categoria="formaggi" />
            <GrigliaProdotti prodotti={formaggi} />
          </TabsContent>

          <TabsContent value="carne" className="mt-0">
            <EtichettaCategoria categoria="carne" />
            <GrigliaProdotti prodotti={carne} />
          </TabsContent>

          <TabsContent value="altro" className="mt-0">
            <EtichettaCategoria categoria="altro" />
            <GrigliaProdotti prodotti={altro} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default GalleriaProdotti;
