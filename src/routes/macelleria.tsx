import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { MacelleriaStory } from "@/components/sections/MacelleriaStory";

export const Route = createFileRoute("/macelleria")({
  head: () => ({
    meta: [
      { title: "Macelleria — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "A vista: la scelta avviene al banco della Macelleria di Masseria Don Gianvito. Filetto, bombette, salsiccia, altri tagli. Frollatura indicativa di circa quindici giorni.",
      },
      { property: "og:title", content: "Macelleria · La scelta avviene a vista" },
      {
        property: "og:description",
        content:
          "Il banco, l'atlante a vista, il filo della tracciabilità e i salumi propri della Masseria.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
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
