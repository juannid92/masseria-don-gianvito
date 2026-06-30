import { createFileRoute } from "@tanstack/react-router";
import { FilieraPlaceholder } from "@/components/sections/FilieraPlaceholder";

export const Route = createFileRoute("/braceria")({
  head: () => ({
    meta: [
      { title: "Braceria — Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "Brace viva, cottura lenta e servizio al tavolo. L'ultima tappa del viaggio dalla terra alla brace.",
      },
      { property: "og:title", content: "Braceria · Masseria Don Gianvito" },
      {
        property: "og:description",
        content: "Dove si chiude il rito: brace, taglio, tavolo.",
      },
    ],
  }),
  component: () => (
    <FilieraPlaceholder
      eyebrow="Tappa 04 · Il fuoco"
      title="Braceria"
      lede="La brace viva chiude il viaggio. Cottura, taglio e servizio in sala."
    />
  ),
});
