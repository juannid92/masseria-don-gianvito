import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AnimaChiusura,
  AnimaHero,
  AnimaPagina,
  AnimaSezione,
} from "@/components/anime/AnimaPagina";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";


export const Route = createFileRoute("/allevamento")({
  head: () => ({
    meta: [
      { title: "Allevamento — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "L'allevamento della Masseria Don Gianvito a Noci: Pezzata Rossa e Frisona crescono negli stessi campi che le nutrono.",
      },
      { property: "og:title", content: "Allevamento — Masseria Don Gianvito" },
      {
        property: "og:description",
        content:
          "Gli animali crescono dove mangiano: il foraggio e le colture della masseria a Noci.",
      },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { property: "og:url", content: getAbsoluteUrl("/allevamento") },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: SITE_CONFIG.twitterCard },
      { name: "twitter:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/allevamento") }],
  }),
  component: AllevamentoPage,
});

function AllevamentoPage() {
  return (
    <AnimaPagina>
      <AnimaHero
        occhiello="I · Allevamento"
        righe={["Gli animali", "crescono", "dove mangiano."]}
        frase="Alla Masseria gli animali nascono e crescono negli stessi campi che li nutrono. Il foraggio, gli ortaggi, la frutta e il grano tenero arrivano dalla terra intorno alle stalle."
        fotoEtichetta="animali al pascolo con la masseria sullo sfondo, a piena larghezza"
      />

      <div data-reveal-group>
        <AnimaSezione
          tone="light"
          layout="full-width"
          occhiello="01 · Gli animali"
          titolo="Chi vive in masseria"
          paragrafi={[
            "I bovini sono di Pezzata Rossa incrociata con Frisona: danno il latte del mattino e la carne del banco.",
            "Accanto ai bovini vivono ovini, suini, equini e avicoli. Ogni specie ha il suo spazio, la sua stalla e il suo ritmo di lavoro.",
            "Gli animali si vedono: chi arriva in masseria passa davanti alle stalle prima di sedersi a tavola.",
          ]}
          fotoEtichetta="bovini in stalla e paesaggio circostante, vista ampia"
        />
        <AnimaSezione
          tone="dark"
          occhiello="02 · La terra che li nutre"
          titolo="Quello che cresce qui"
          paragrafi={[
            "I campi della masseria producono foraggio, ortaggi, frutta e grano tenero.",
            "Il foraggio va agli animali, il resto va in cucina e al banco. L'alimentazione delle stalle esce dagli stessi campi che si attraversano arrivando.",
            "Quando il campo dà meno, si dà meno anche a tavola: la lista cambia con quello che c'è.",
          ]}
          fotoEtichetta="campo di foraggio e grano tenero, fine mattina"
        />
      </div>

      <div data-reveal-group>
        <AnimaSezione
          tone="light"
          layout="text-left"
          occhiello="03 · Le stagioni"
          titolo="Il ritmo del lavoro"
          paragrafi={[
            "Si comincia presto, con la mungitura e il governo delle stalle. Poi si passa ai campi.",
            "In primavera e in estate si taglia e si mette da parte il foraggio per i mesi in cui la terra riposa. In autunno e in inverno il lavoro si sposta dentro: stalle, caseificio, laboratorio.",
            "I tempi li decide la stagione, non il calendario.",
          ]}
          fotoEtichetta="lavoro nei campi, taglio del foraggio"
        />
        <AnimaSezione
          tone="dark"
          layout="text-right"
          occhiello="04 · Dove finisce l'allevamento"
          titolo="Il passaggio"
          paragrafi={[
            "L'allevamento non si chiude qui: consegna. Il latte va al caseificio, che lo lavora nella stessa mattina.",
            "La carne va alla macelleria, dove viene esposta al banco e scelta a vista da chi si fermerà a cena.",
          ]}
          fotoEtichetta="passaggio dalla stalla al laboratorio, mani al lavoro"
          ratio="16 / 9"
        >
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/caseificio"
              className="font-eyebrow border border-[color:var(--bianco-calce)]/35 px-6 py-3 text-[15px] tracking-[0.22em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--bianco-calce)]/10"
            >
              Vai al caseificio
            </Link>
            <Link
              to="/macelleria"
              className="font-eyebrow border border-[color:var(--bianco-calce)]/35 px-6 py-3 text-[15px] tracking-[0.22em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--bianco-calce)]/10"
            >
              Vai alla macelleria
            </Link>
          </div>
        </AnimaSezione>
        <AnimaChiusura corrente="allevamento" />
      </div>
    </AnimaPagina>
  );
}
