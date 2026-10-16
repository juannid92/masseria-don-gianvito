import { createFileRoute } from "@tanstack/react-router";
import { AnimaPagina } from "@/components/anime/AnimaPagina";
import { getAbsoluteUrl } from "@/config/site";
import { AgriturismoCinema } from "@/components/agriturismo/AgriturismoCinema";
import {
  AgriLaCasa,
  AgriLaSera,
  AgriLaCarta,
  AgriPrenota,
  AgriFineViaggio,
} from "@/components/agriturismo/AgriturismoRacconto";

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
      <div className="agri-page">
        <AgriturismoCinema />
        <div id="next-section">
          <AgriLaCasa />
          <AgriLaSera />
          <AgriLaCarta />
          <AgriPrenota />
          <AgriFineViaggio />
        </div>
      </div>
    </AnimaPagina>
  );
}
