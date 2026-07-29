import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AnimaChiusura,
  AnimaHero,
  AnimaPagina,
  AnimaSezione,
} from "@/components/anime/AnimaPagina";

export const Route = createFileRoute("/caseificio")({
  head: () => ({
    meta: [
      { title: "Caseificio — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Il latte munto nelle stalle della Masseria Don Gianvito a Noci viene lavorato nella stessa mattina: mozzarelle a chilometro zero, nodini, primo sale, ricotta.",
      },
      { property: "og:title", content: "Caseificio — Il latte non fa strada" },
      {
        property: "og:description",
        content:
          "Dalla stalla al laboratorio in pochi metri: mozzarelle a chilometro zero, nodini, primo sale e ricotta lavorati nella stessa mattina.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: CaseificioPage,
});

function CaseificioPage() {
  return (
    <AnimaPagina>
      <AnimaHero
        occhiello="II · Caseificio"
        righe={["Il latte non", "fa strada.", "Fa pochi metri."]}
        frase="Dalla stalla al laboratorio ci sono pochi metri."
        fotoEtichetta="la mozzarella appena filata nelle mani, a piena larghezza"
      />

      <div data-reveal-group>
        <AnimaSezione
          tone="light"
          occhiello="01 · La mattina"
          titolo="Il latte entra subito"
          paragrafi={[
            "Il latte arriva dalle stalle della masseria e non aspetta. Finita la mungitura, passa in laboratorio.",
            "Nessun trasporto, nessuna sosta: il posto in cui viene munto e il posto in cui viene lavorato sono lo stesso posto.",
            "Quello che entra la mattina si lavora nella stessa mattina.",
          ]}
          fotoEtichetta="il latte in lavorazione, prima mattina"
        >
          <div className="mt-8">
            <Link
              to="/allevamento"
              className="font-eyebrow border border-[color:var(--carbone)]/30 px-6 py-3 text-[15px] tracking-[0.22em] transition-colors hover:bg-[color:var(--biscotto)]/40"
            >
              Da dove arriva il latte
            </Link>
          </div>
        </AnimaSezione>
        <AnimaSezione
          tone="dark"
          occhiello="02 · Le mani"
          titolo="Si lavora a mano"
          paragrafi={[
            "La pasta si tira, si gira, si chiude. La mozzarella prende forma nelle mani, una alla volta.",
            "I nodini si formano con lo stesso gesto, più corto e ripetuto.",
            "Chi lavora guarda e sente: la pasta dice quando è pronta, e da lì in poi è questione di pochi minuti.",
          ]}
          fotoEtichetta="i nodini appena formati, mani al lavoro"
        />
      </div>

      <div data-reveal-group>
        <AnimaSezione
          tone="light"
          occhiello="03 · Quello che esce"
          titolo="Quattro forme dello stesso bianco"
          paragrafi={[
            "Le mozzarelle a chilometro zero sono il prodotto della mattina: nascono e finiscono nello stesso giorno.",
            "Accanto arrivano i nodini, più piccoli e più sodi, e il primo sale, che resta bianco e asciutto.",
            "La ricotta chiude la lavorazione. Quello che c'è dipende dal latte del giorno: la disponibilità cambia di giorno in giorno.",
          ]}
          fotoEtichetta="il banco con i formaggi del giorno"
        />
        <AnimaSezione
          tone="dark"
          occhiello="04 · Dove va"
          titolo="Pochi metri ancora"
          paragrafi={[
            "Dal laboratorio i formaggi passano al banco della macelleria, dove si scelgono a vista.",
            "Il resto va in cucina e arriva sui tavoli dell'agriturismo, la sera stessa.",
          ]}
          fotoEtichetta="il passaggio dal laboratorio al banco"
        >
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/macelleria"
              className="font-eyebrow border border-[color:var(--bianco-calce)]/35 px-6 py-3 text-[15px] tracking-[0.22em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--bianco-calce)]/10"
            >
              Vai alla macelleria
            </Link>
            <Link
              to="/agriturismo"
              className="font-eyebrow border border-[color:var(--bianco-calce)]/35 px-6 py-3 text-[15px] tracking-[0.22em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--bianco-calce)]/10"
            >
              Vai all'agriturismo
            </Link>
          </div>
        </AnimaSezione>
        <AnimaChiusura corrente="caseificio" />
      </div>
    </AnimaPagina>
  );
}
