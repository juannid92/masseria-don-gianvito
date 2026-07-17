import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AgriturismoStory } from "@/components/sections/AgriturismoStory";

export const Route = createFileRoute("/agriturismo")({
  head: () => ({
    meta: [
      { title: "Agriturismo Masseria Don Gianvito | Noci" },
      {
        name: "description",
        content:
          "L’Agriturismo di Masseria Don Gianvito a Noci: cucina, prodotti della Masseria, scelta della carne al banco, braceria e ospitalità.",
      },
      { property: "og:title", content: "Agriturismo Masseria Don Gianvito" },
      {
        property: "og:description",
        content:
          "Dalla scelta al banco alla tavola: cucina, braceria e ospitalità nelle campagne di Noci.",
      },
      { property: "og:type", content: "restaurant" },
    ],
  }),
  component: AgriturismoPage,
});

function AgriturismoPage() {
  return (
    <SmoothScroll>
      <ContinuousBackground />
      <Navbar />
      <main className="relative">
        <AgriturismoStory />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
