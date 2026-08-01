import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { IlManifesto } from "@/components/home/IlManifesto";
import { LaStoria } from "@/components/home/LaStoria";
import { IlLuogo } from "@/components/home/IlLuogo";
import { LaFiliera } from "@/components/home/LaFiliera";
import { LaTavola } from "@/components/home/LaTavola";
import { LaVoce } from "@/components/home/LaVoce";
import { Prenota } from "@/components/home/Prenota";
import { useHomeHashScroll } from "@/lib/nav";

const SITE_URL = "https://masseriadongianvito.it";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Masseria Don Gianvito — Allevamento, caseificio, macelleria e agriturismo a Noci",
      },
      {
        name: "description",
        content:
          "Masseria del Cinquecento a Noci (BA): allevamento proprio, caseificio artigianale, macelleria a vista e agriturismo della Murgia.",
      },
      {
        property: "og:title",
        content: "Masseria Don Gianvito — Dalla terra alla tavola",
      },
      {
        property: "og:description",
        content:
          "Filiera interna a Noci (BA): allevamento, caseificio, macelleria e agriturismo. Dalla terra alla tavola, ogni sera.",
      },
      { property: "og:image", content: `${SITE_URL}/og-masseria.jpg` },
      { property: "og:url", content: SITE_URL },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${SITE_URL}/og-masseria.jpg` },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: HomePage,
});

function HomeHashHandler() {
  useHomeHashScroll();
  return null;
}

function HomePage() {
  return (
    <>
      <HomeHashHandler />
      <Hero />
      <IlManifesto />
      <LaStoria />
      <IlLuogo />
      <LaFiliera />
      <LaTavola />
      <LaVoce />
      <Prenota />
    </>
  );
}
