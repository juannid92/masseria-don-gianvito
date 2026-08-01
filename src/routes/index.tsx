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
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";


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
        content: SITE_CONFIG.title,
      },
      {
        property: "og:description",
        content: SITE_CONFIG.description,
      },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { property: "og:url", content: SITE_CONFIG.url },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: SITE_CONFIG.twitterCard },
      { name: "twitter:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
    ],
    links: [{ rel: "canonical", href: SITE_CONFIG.url }],
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
