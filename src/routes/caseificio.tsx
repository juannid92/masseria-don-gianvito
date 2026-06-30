import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CaseificioStory } from "@/components/sections/CaseificioStory";

export const Route = createFileRoute("/caseificio")({
  head: () => ({
    meta: [
      { title: "Caseificio — Capitolo 02 · Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "Il latte di ogni mattina, lavorato a mano: ricotta, primo sale, nodini, fiordilatte, caciocavallo. Capitolo 02 del racconto dalla terra alla brace.",
      },
      {
        property: "og:title",
        content: "Caseificio · Il latte di ogni mattina",
      },
      {
        property: "og:description",
        content:
          "Capitolo 02 della filiera Masseria Don Gianvito: dal latte appena munto alla stagionatura.",
      },
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
