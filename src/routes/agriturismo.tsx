import { createFileRoute } from "@tanstack/react-router";
import { AnimaPagina } from "@/components/anime/AnimaPagina";
import { getAbsoluteUrl } from "@/config/site";
import { AgriturismoCinema } from "@/components/agriturismo/AgriturismoCinema";
import { AgriturismoStoriaNuova } from "@/components/agriturismo/AgriturismoNuovaVeste";
import { AgriLaTavola } from "@/components/agriturismo/AgriLaTavola";
import {
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
        content: getAbsoluteUrl("/images/agriturismo-tavola-ai.jpg"),
      },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/agriturismo") }],
  }),
  component: AgriturismoPage,
});

function AgriturismoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Agriturismo Masseria Don Gianvito",
            description:
              "La sera alla Masseria: un viaggio tra campagna, storia e sapori autentici nelle Murge di Noci.",
            url: getAbsoluteUrl("/agriturismo"),
            servesCuisine: "Pugliese",
            priceRange: "$$",
            acceptsReservations: true,
            address: {
              "@type": "PostalAddress",
              streetAddress: "SP237 ex SS377 per Mottola km 6,5, Zona C 76",
              addressLocality: "Noci",
              addressRegion: "BA",
              postalCode: "70015",
              addressCountry: "IT",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 40.642739,
              longitude: 17.0426,
            },
            telephone: "+393339395750",
          }),
        }}
      />
    <AnimaPagina>
      <AgriturismoCinema />
      <div id="next-section" className="agri-page">
        <AgriturismoStoriaNuova />
        <AgriLaTavola />
        <AgriLaCarta />
        <AgriPrenota />
        <AgriFineViaggio />
      </div>
    </AnimaPagina>
    </>
  );
}
