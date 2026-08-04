import { createFileRoute } from "@tanstack/react-router";
import { AnimaPagina } from "@/components/anime/AnimaPagina";
import { getAbsoluteUrl } from "@/config/site";
import { AgriturismoHero } from "@/components/agriturismo/AgriturismoHero";
import { AgriturismoStoria, AgriturismoTavola } from "@/components/agriturismo/AgriturismoContent";
import { AgriturismoGalleria, AgriturismoDettagli } from "@/components/agriturismo/AgriturismoGallery";
import { AgriturismoCTA, AgriturismoFooterLinks } from "@/components/agriturismo/AgriturismoFooter";

export const Route = createFileRoute("/agriturismo")({
  head: () => ({
    meta: [
      { title: "Agriturismo — Masseria Don Gianvito · Noci" },
      { name: "description", content: "La sera alla Masseria: un viaggio tra campagna, storia e sapori autentici nelle Murge di Noci." },
      { property: "og:title", content: "Agriturismo — Masseria Don Gianvito" },
      { property: "og:url", content: getAbsoluteUrl("/agriturismo") },
      { property: "og:type", content: "restaurant" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/agriturismo") }],
  }),
  component: AgriturismoPage,
});

function AgriturismoPage() {
  return (
    <AnimaPagina>
      <AgriturismoHero />
      <AgriturismoStoria />
      <AgriturismoTavola />
      <AgriturismoGalleria />
      <AgriturismoDettagli />
      <AgriturismoCTA />
      <AgriturismoFooterLinks />
    </AnimaPagina>
  );
}
