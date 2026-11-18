import { createFileRoute } from "@tanstack/react-router";
import { Allevamento } from "@/components/journey/Allevamento";
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["LocalBusiness", "FarmAction"],
            name: "Allevamento Masseria Don Gianvito",
            description:
              "L'allevamento della Masseria Don Gianvito a Noci: animali cresciuti negli stessi campi che li nutrono.",
            url: getAbsoluteUrl("/allevamento"),
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
      <Allevamento />
    </>
  );
}
