import { createFileRoute } from "@tanstack/react-router";
import { Caseificio } from "@/components/journey/Caseificio";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";

export const Route = createFileRoute("/caseificio")({
  head: () => ({
    meta: [
      { title: "Caseificio — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Caseificio artigianale a Noci: il latte lavorato ogni mattina a pochi metri dalle stalle.",
      },
      { property: "og:title", content: "Caseificio — Masseria Don Gianvito" },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { property: "og:url", content: getAbsoluteUrl("/caseificio") },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/caseificio") }],
  }),
  component: CaseificioPage,
});

function CaseificioPage() {
  return <Caseificio />;
}
