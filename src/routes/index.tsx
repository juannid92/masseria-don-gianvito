import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { IlManifesto } from "@/components/home/IlManifesto";
import { LaStoria } from "@/components/home/LaStoria";
import { IlLuogo } from "@/components/home/IlLuogo";
import { LaFiliera } from "@/components/home/LaFiliera";
import { useHomeHashScroll } from "@/lib/nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Masseria Don Gianvito — Allevamento, caseificio, macelleria e agriturismo a Noci",
      },
      {
        name: "description",
        content:
          "Masseria del Cinquecento a Noci (BA): si allevano gli animali, si fa il formaggio, si sceglie la carne al banco e si mangia in agriturismo.",
      },
      {
        property: "og:title",
        content: "Masseria Don Gianvito — Dalla terra alla tavola",
      },
      {
        property: "og:description",
        content:
          "Filiera interna a Noci (BA): allevamento, caseificio, macelleria e agriturismo. Ogni sera, a Noci.",
      },
      { property: "og:type", content: "website" },
    ],
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
    </>
  );
}
