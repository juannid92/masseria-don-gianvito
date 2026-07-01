import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Masseria Don Gianvito — Allevamento, caseificio, macelleria e braceria a Noci",
      },
      {
        name: "description",
        content:
          "Qui non arriva niente da fuori. Sorvola Masseria Don Gianvito: allevamento, caseificio, macelleria e braceria nella Murgia, a Noci (BA).",
      },
      {
        property: "og:title",
        content: "Masseria Don Gianvito — Dalla stalla alla brace",
      },
      {
        property: "og:description",
        content:
          "Azienda agricola a filiera propria a Noci (BA): allevamento, caseificio, macelleria e braceria.",
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
        <Manifesto />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
