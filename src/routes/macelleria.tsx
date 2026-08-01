import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AnimaChiusura,
  AnimaHero,
  AnimaPagina,
  AnimaSezione,
} from "@/components/anime/AnimaPagina";

export const Route = createFileRoute("/macelleria")({
  head: () => ({
    meta: [
      { title: "Macelleria — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Al banco della Masseria Don Gianvito a Noci la carne è esposta e si sceglie a vista: filetto, bombette, salsiccia, prosciutto crudo, soppressata, salsiccia secca, pancetta tesa.",
      },
      { property: "og:title", content: "Macelleria — Si sceglie guardando" },
      {
        property: "og:description",
        content:
          "La carne degli animali della masseria, esposta al banco: filetto, bombette, salsiccia e i salumi della casa.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: MacelleriaPage,
});

function MacelleriaPage() {
  return (
    <AnimaPagina>
      <AnimaHero
        occhiello="III · Macelleria"
        righe={["Si sceglie", "guardando.", "Non leggendo."]}
        frase="La carne viene dagli animali della masseria. Sta al banco, in vista, e si indica con un dito."
        fotoEtichetta="il banco con il vetro e la carne esposta, a piena larghezza"
      />

      <div data-reveal-group>
        <AnimaSezione
          tone="light"
          layout="text-right"
          occhiello="01 · Il banco"
          titolo="Tutto è in vista"
          paragrafi={[
            "Dietro il vetro la carne è disposta e basta guardarla. Nessuna descrizione, nessuna lista da consultare.",
            "Si indica il pezzo. Chi taglia risponde, gira il coltello, mostra la parte che non si vedeva.",
            "È il modo più corto di scegliere: l'occhio prima della parola.",
          ]}
          fotoEtichetta="il vetro del banco, carne esposta e mano che indica"
        >
          <div className="mt-8">
            <Link
              to="/allevamento"
              className="font-eyebrow border border-[color:var(--carbone)]/30 px-6 py-3 text-[15px] tracking-[0.22em] transition-colors hover:bg-[color:var(--biscotto)]/40"
            >
              Da dove arriva la carne
            </Link>
          </div>
        </AnimaSezione>
        <AnimaSezione
          tone="dark"
          layout="text-left"
          occhiello="02 · I tagli"
          titolo="Materia e coltello"
          paragrafi={[
            "Il filetto sta da una parte, stretto e scuro. Le bombette dall'altra, chiuse una a una.",
            "La salsiccia si fa qui, con la carne dello stesso animale. Accanto ci sono i tagli del giorno, quelli che il banco offre in quella giornata e non in un'altra.",
            "Quello che c'è cambia. Si guarda e si sceglie fra quello che c'è.",
          ]}
          fotoEtichetta="un taglio in primo piano, sul tagliere"
          ratio="1 / 1"
        />
      </div>

      <div data-reveal-group>
        <AnimaSezione
          tone="light"
          layout="text-right"
          occhiello="03 · Il riposo"
          titolo="Prima si aspetta"
          paragrafi={[
            "Al banco la carne arriva dopo. Prima resta ferma in cella, al buio, per circa quindici giorni.",
            "In quel tempo perde acqua, si asciuga in superficie e si ammorbidisce dentro. Non c'è niente da fare, se non lasciarla stare.",
            "Chi lavora passa, guarda, tocca. Quando è pronta si porta al banco: la data la decide la carne.",
          ]}
          fotoEtichetta="le bombette pronte, ordinate in vassoio"
        />
        <AnimaSezione
          tone="dark"
          layout="text-left"
          occhiello="04 · I salumi"
          titolo="Quello che resta appeso"
          paragrafi={[
            "Il prosciutto crudo sta appeso e aspetta il suo tempo. La soppressata gli sta accanto, più corta e più scura.",
            "La salsiccia secca si stringe piano, la pancetta tesa resta distesa e bianca sul bordo.",
            "Quello che si sceglie al banco può finire sul tavolo dell'agriturismo la sera stessa: dal vetro alla brace ci sono pochi passi.",
          ]}
          fotoEtichetta="i salumi appesi nella stanza di stagionatura"
        >
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/agriturismo"
              className="font-eyebrow border border-[color:var(--bianco-calce)]/35 px-6 py-3 text-[15px] tracking-[0.22em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--bianco-calce)]/10"
            >
              Vai all'agriturismo
            </Link>
            <Link
              to="/caseificio"
              className="font-eyebrow border border-[color:var(--bianco-calce)]/35 px-6 py-3 text-[15px] tracking-[0.22em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--bianco-calce)]/10"
            >
              Vai al caseificio
            </Link>
          </div>
        </AnimaSezione>
        <AnimaChiusura corrente="macelleria" />
      </div>
    </AnimaPagina>
  );
}
