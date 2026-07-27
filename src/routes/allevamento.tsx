import { createFileRoute } from "@tanstack/react-router";
import { AnimaShell } from "@/components/site/AnimaShell";

export const Route = createFileRoute("/allevamento")({
  head: () => ({
    meta: [
      { title: "Allevamento — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "La terra e gli animali della Masseria Don Gianvito a Noci: bovini, ovini, suini, equini, avicoli e le colture proprie.",
      },
      { property: "og:title", content: "Allevamento — La terra e gli animali" },
      {
        property: "og:description",
        content: "Bovini, ovini, suini, equini, avicoli e colture proprie nella campagna di Noci.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: AllevamentoPage,
});

function AllevamentoPage() {
  return (
    <AnimaShell
      numero="I"
      claim="La terra e gli animali"
      titolo="Prima della tavola, c'è la terra."
      intro="Gli animali della Masseria vivono qui: bovini da latte e da carne, ovini, suini, equini, avicoli. La terra dà foraggio, ortaggi, frutta e grano tenero."
    />
  );
}
