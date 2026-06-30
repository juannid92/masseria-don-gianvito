import { createFileRoute } from "@tanstack/react-router";
import { FilieraPlaceholder } from "@/components/sections/FilieraPlaceholder";

export const Route = createFileRoute("/allevamento")({
  head: () => ({
    meta: [
      { title: "Allevamento — Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "I capi della Masseria Don Gianvito, nutriti con i nostri cereali. La prima tappa della filiera.",
      },
      { property: "og:title", content: "Allevamento · Masseria Don Gianvito" },
      {
        property: "og:description",
        content: "La prima tappa del viaggio dalla terra alla brace.",
      },
    ],
  }),
  component: () => (
    <FilieraPlaceholder
      eyebrow="Tappa 01 · La terra"
      title="Allevamento"
      lede="I nostri capi, allevati in masseria e nutriti con il grano che coltiviamo."
    />
  ),
});
