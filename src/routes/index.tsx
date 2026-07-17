import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Hero } from "@/components/sections/Hero";
import { IlManifesto } from "@/components/sections/IlManifesto";
import { LaStoria } from "@/components/sections/LaStoria";
import { IlLuogo } from "@/components/sections/IlLuogo";
import { LaFiliera } from "@/components/sections/LaFiliera";
import { LaTavola } from "@/components/sections/LaTavola";
import { LaVoce } from "@/components/sections/LaVoce";
import { Prenota } from "@/components/sections/Prenota";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Masseria Don Gianvito — Allevamento, caseificio, macelleria e agriturismo a Noci",
      },
      {
        name: "description",
        content:
          "Qui non arriva niente da fuori. Sorvola Masseria Don Gianvito: allevamento, caseificio, macelleria e agriturismo nella Murgia, a Noci (BA).",
      },
      {
        property: "og:title",
        content: "Masseria Don Gianvito — Dalla terra alla tavola",
      },
      {
        property: "og:description",
        content:
          "Azienda agricola a filiera propria a Noci (BA): allevamento, caseificio, macelleria e agriturismo.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SmoothScroll>
      <ContinuousBackground />
      <Navbar />
      <main className="relative">
        <Hero />
        <IlManifesto />
        <LaStoria />
        <IlLuogo />
        <LaFiliera />
        <LaTavola />
        <LaVoce />
        <Prenota />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
