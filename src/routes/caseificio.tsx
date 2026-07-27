import { createFileRoute } from "@tanstack/react-router";
import { AnimaShell } from "@/components/site/AnimaShell";

export const Route = createFileRoute("/caseificio")({
  head: () => ({
    meta: [
      { title: "Caseificio — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Il latte munto ogni mattina diventa mozzarelle km 0, nodini, primo sale e ricotta nel caseificio della Masseria Don Gianvito.",
      },
      { property: "og:title", content: "Caseificio — Il bianco prende forma" },
      {
        property: "og:description",
        content: "Mozzarelle km 0, nodini, primo sale e ricotta dal latte della Masseria.",
      },
      { property: "og:type", content: "article" },
    ],
  }),
  component: CaseificioPage,
});

function CaseificioPage() {
  return (
    <AnimaShell
      numero="II"
      claim="Il bianco prende forma"
      titolo="Il latte del mattino non fa strada."
      intro="Munto qui, lavorato qui. Mozzarelle km 0, nodini, primo sale, ricotta: quattro forme dello stesso bianco."
    />
  );
}
