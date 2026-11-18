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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Caseificio Masseria Don Gianvito",
            description:
              "Caseificio artigianale a Noci: il latte lavorato ogni mattina a pochi metri dalle stalle.",
            url: getAbsoluteUrl("/caseificio"),
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
            additionalType: "DairyStore",
          }),
        }}
      />
      <Caseificio />
    </>
  );
}
