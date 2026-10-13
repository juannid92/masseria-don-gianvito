import { createFileRoute } from "@tanstack/react-router";
import { StoryChapter } from "@/components/journey/StoryChapter";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";

export const Route = createFileRoute("/allevamento")({
  head: () => ({
    meta: [
      { title: "Allevamento — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "L'allevamento della Masseria Don Gianvito a Noci: animali cresciuti negli stessi campi che li nutrono.",
      },
      { property: "og:title", content: "Allevamento — Masseria Don Gianvito" },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { property: "og:url", content: getAbsoluteUrl("/allevamento") },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/allevamento") }],
  }),
  component: AllevamentoPage,
});

function AllevamentoPage() {
  return <StoryChapter id="allevamento" />;
}
