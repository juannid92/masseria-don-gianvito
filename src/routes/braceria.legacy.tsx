import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BraceriaStory } from "@/components/sections/BraceriaStory";

export const Route = createFileRoute("/braceria")({
  head: () => ({
    meta: [
      { title: "Braceria — La sera · Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "La sala si accende. Scegli al banco, siedi, la carne cuoce sui carboni. Menu della sera, pranzo domenicale e Pecora in Pignata alla Masseria Don Gianvito a Noci.",
      },
      { property: "og:title", content: "Braceria · La sera prende posto" },
      {
        property: "og:description",
        content:
          "La quarta anima della Masseria: scegli, siedi, cottura. Antipasti, formaggi, cucina e arrosto sui carboni.",
      },
      { property: "og:type", content: "restaurant" },
      { property: "og:url", content: "https://masseriadongianvito.lovable.app/braceria" },
    ],
    links: [{ rel: "canonical", href: "https://masseriadongianvito.lovable.app/braceria" }],
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
