import { createFileRoute } from "@tanstack/react-router";
import { Macelleria } from "@/components/journey/Macelleria";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";

export const Route = createFileRoute("/macelleria")({
  head: () => ({
    meta: [
      { title: "Macelleria — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content: "Macelleria con banco a vista: i tagli della masseria scelti guardando.",
      },
      { property: "og:title", content: "Macelleria — Masseria Don Gianvito" },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { property: "og:url", content: getAbsoluteUrl("/macelleria") },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/macelleria") }],
  }),
  component: MacelleriaPage,
});

function MacelleriaPage() {
  return <Macelleria />;
}
