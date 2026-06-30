import { createFileRoute } from "@tanstack/react-router";
import { FilieraPlaceholder } from "@/components/sections/FilieraPlaceholder";

export const Route = createFileRoute("/macelleria")({
  head: () => ({
    meta: [
      { title: "Macelleria — Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "Banco di macelleria a vista: tagli del giorno, frollature, selezione del macellaio.",
      },
      { property: "og:title", content: "Macelleria · Masseria Don Gianvito" },
      {
        property: "og:description",
        content: "Dal pascolo al banco, senza passaggi intermedi.",
      },
    ],
  }),
  component: () => (
    <FilieraPlaceholder
      eyebrow="Tappa 03 · La materia"
      title="Macelleria"
      lede="Banco a vista, tagli del giorno e frollature curate dal macellaio."
    />
  ),
});
