import { createFileRoute } from "@tanstack/react-router";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AllevamentoStory } from "@/components/sections/AllevamentoStory";

export const Route = createFileRoute("/allevamento")({
  head: () => ({
    meta: [
      { title: "Allevamento — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "La Discesa: dal cielo alla terra di Noci. Bovini, ovini, suini, equini e avicoli della Masseria Don Gianvito, con foraggio, ortaggi, frutta e grano tenero coltivati nei terreni.",
      },
      { property: "og:title", content: "Allevamento · Dove il cielo tocca la terra" },
      {
        property: "og:description",
        content:
          "Dall'aereo alla terra: cinque presenze animali, quattro colture, un unico paesaggio agricolo a Noci.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
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
