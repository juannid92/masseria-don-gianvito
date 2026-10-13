import { ChapterNavigation } from "@/components/journey/ChapterNavigation";
import { MenuExperience } from "@/components/journey/MenuExperience";
import { createFileRoute } from "@tanstack/react-router";
import { AnimaPagina } from "@/components/anime/AnimaPagina";
import { getAbsoluteUrl } from "@/config/site";
import { AgriturismoCinema } from "@/components/agriturismo/AgriturismoCinema";
import {
  AgriturismoStoriaNuova,
  AgriturismoGalleriaNuova,
  AgriturismoDettagliNuovi,
  AgriturismoCTANuovo,
  AgriturismoFooterNuovo,
} from "@/components/agriturismo/AgriturismoNuovaVeste";

export const Route = createFileRoute("/agriturismo")({
  head: () => ({
    meta: [
      { title: "Agriturismo — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "La sera alla Masseria: un viaggio tra campagna, storia e sapori autentici nelle Murge di Noci.",
      },
      { property: "og:title", content: "Agriturismo — Masseria Don Gianvito" },
      { property: "og:url", content: getAbsoluteUrl("/agriturismo") },
      { property: "og:type", content: "restaurant" },
      {
        property: "og:image",
        content: getAbsoluteUrl("/images/agriturismo-cinema-02-facciata.webp"),
      },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/agriturismo") }],
  }),
  component: AgriturismoPage,
});

function AgriturismoPage() {
  return (
    <AnimaPagina>
      <AgriturismoCinema />
      <div id="next-section">
        <AgriturismoStoriaNuova />
        <AgriturismoGalleriaNuova />
        <AgriturismoDettagliNuovi />
        <MenuExperience />
        <AgriturismoCTANuovo />
        <AgriturismoFooterNuovo />
        <ChapterNavigation current="agriturismo" />
      </div>
    </AnimaPagina>
  );
}
