import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AllevamentoStory } from "@/components/sections/AllevamentoStory";

export const Route = createFileRoute("/allevamento")({
  head: () => ({
    meta: [
      { title: "Allevamento — Capitolo 01 · Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "Dove tutto comincia: la terra di Noci, gli animali della Masseria Don Gianvito, il foraggio coltivato in casa. Il primo capitolo del racconto dalla terra alla brace.",
      },
      {
        property: "og:title",
        content: "Allevamento · Dove tutto comincia",
      },
      {
        property: "og:description",
        content:
          "Capitolo 01 della filiera Masseria Don Gianvito: terra, animali, foraggio, tempo.",
      },
    ],
  }),
  component: AllevamentoPage,
});

function AllevamentoPage() {
  return (
    <SmoothScroll>
      <ContinuousBackground />
      <Navbar />
      <main className="relative">
        <AllevamentoStory />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
