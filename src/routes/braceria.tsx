import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BraceriaStory } from "@/components/sections/BraceriaStory";

export const Route = createFileRoute("/braceria")({
  head: () => ({
    meta: [
      { title: "Braceria — Capitolo 04 · Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "La brace, ogni sera: buio, fuoco, cottura a vista e menù della sera a Noci. Il capitolo finale del racconto dalla terra alla brace — Masseria Don Gianvito.",
      },
      { property: "og:title", content: "Braceria · La brace, ogni sera" },
      {
        property: "og:description",
        content:
          "Capitolo 04 della filiera Masseria Don Gianvito: brace di quercia, cottura a vista, menù della sera, prenotazione tavolo.",
      },
      { property: "og:type", content: "restaurant" },
    ],
  }),
  component: BraceriaPage,
});

function BraceriaPage() {
  return (
    <SmoothScroll>
      <ContinuousBackground />
      <Navbar />
      <main className="relative">
        <BraceriaStory />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
