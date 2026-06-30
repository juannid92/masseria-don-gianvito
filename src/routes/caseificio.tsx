import { createFileRoute } from "@tanstack/react-router";
import { FilieraPlaceholder } from "@/components/sections/FilieraPlaceholder";

export const Route = createFileRoute("/caseificio")({
  head: () => ({
    meta: [
      { title: "Caseificio — Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "Latte appena munto, formaggi freschi e stagionati lavorati nel caseificio della masseria.",
      },
      { property: "og:title", content: "Caseificio · Masseria Don Gianvito" },
      {
        property: "og:description",
        content: "Dal latte della masseria al banco, ogni giorno.",
      },
    ],
  }),
  component: () => (
    <FilieraPlaceholder
      eyebrow="Tappa 02 · Il latte"
      title="Caseificio"
      lede="Formaggi freschi e stagionati, lavorati a mano con il latte della nostra masseria."
    />
  ),
});
