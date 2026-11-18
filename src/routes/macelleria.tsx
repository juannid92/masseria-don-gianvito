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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["LocalBusiness", "ButcherShop"],
            name: "Macelleria Masseria Don Gianvito",
            description: "Macelleria con banco a vista: i tagli della masseria scelti guardando.",
            url: getAbsoluteUrl("/macelleria"),
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
      <Macelleria />
    </>
  );
}
