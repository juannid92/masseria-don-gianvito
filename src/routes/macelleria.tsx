import { createFileRoute } from "@tanstack/react-router";
import { AnimaShell } from "@/components/site/AnimaShell";

export const Route = createFileRoute("/macelleria")({
  head: () => ({
    meta: [
      { title: "Macelleria — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Carne esposta e scelta a vista al banco della Masseria Don Gianvito: filetto di vitello, bombette, salsiccia e salumi propri.",
      },
      { property: "og:title", content: "Macelleria — La scelta avviene a vista" },
      {
        property: "og:description",
        content: "Il banco non nasconde: filetto, bombette, salsiccia e salumi della Masseria.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: MacelleriaPage,
});

function MacelleriaPage() {
  return (
    <AnimaShell
      numero="III"
      claim="La scelta avviene a vista"
      titolo="Guardi la carne. Poi decidi."
      intro="Al banco la carne è esposta e si sceglie a vista. Filetto di vitello, bombette, salsiccia, e i salumi della Masseria: prosciutto crudo, soppressata, salsiccia secca, pancetta tesa."
    />
  );
}
