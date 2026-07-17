import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CaseificioStory } from "@/components/sections/CaseificioStory";

export const Route = createFileRoute("/caseificio")({
  head: () => ({
    meta: [
      { title: "Caseificio — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Il Bianco: dal latte di ogni mattina alle forme del Caseificio di Masseria Don Gianvito. Mozzarella, nodini, primo sale e ricotta.",
      },
      { property: "og:title", content: "Caseificio · Dentro il bianco" },
      {
        property: "og:description",
        content:
          "Quattro stati della stessa materia: liquido, cagliata, filatura, forma. Le forme del Caseificio di Masseria Don Gianvito.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaseificioPage,
});

function CaseificioPage() {
  return (
    <SmoothScroll>
      <ContinuousBackground />
      <Navbar />
      <main className="relative">
        <CaseificioStory />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
