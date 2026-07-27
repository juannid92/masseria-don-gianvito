import { createFileRoute } from "@tanstack/react-router";
import { AnimaShell } from "@/components/site/AnimaShell";

export const Route = createFileRoute("/agriturismo")({
  head: () => ({
    meta: [
      { title: "Agriturismo — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Cucina, tavola e braceria alla Masseria Don Gianvito di Noci: si sceglie la carne al banco, ci si siede, si mangia un pasto completo.",
      },
      { property: "og:title", content: "Agriturismo — Cucina, tavola e braceria" },
      {
        property: "og:description",
        content: "Antipasti, primi, arrosto e dolci nella masseria del Cinquecento a Noci.",
      },
      { property: "og:type", content: "restaurant" },
    ],
  }),
  component: AgriturismoPage,
});

function AgriturismoPage() {
  return (
    <AnimaShell
      numero="IV"
      claim="Cucina, tavola e braceria"
      titolo="Poi ci si siede, e si resta."
      intro="Scegli la carne al banco, ti siedi, arrivano antipasti e primi, poi la carne cotta alla brace e i dolci. Piatti e disponibilità possono cambiare: contatta la Masseria per confermare il menu del giorno."
    />
  );
}
