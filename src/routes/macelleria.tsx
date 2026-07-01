import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MacelleriaStory } from "@/components/sections/MacelleriaStory";

export const Route = createFileRoute("/macelleria")({
  head: () => ({
    meta: [
      { title: "Macelleria — Capitolo 03 · Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "La carne, a vista: diagramma anatomico dei tagli, tracciabilità all'animale del pascolo, armadio di frollatura. Terzo capitolo del racconto dalla terra alla brace.",
      },
      { property: "og:title", content: "Macelleria · La carne, a vista" },
      {
        property: "og:description",
        content:
          "Capitolo 03 della filiera Masseria Don Gianvito: tagli tracciati fino agli animali del pascolo, frollatura a vista.",
      },
    ],
  }),
  component: MacelleriaPage,
});

function MacelleriaPage() {
  return (
    <SmoothScroll>
      <ContinuousBackground />
      <Navbar />
      <main className="relative">
        <MacelleriaStory />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
