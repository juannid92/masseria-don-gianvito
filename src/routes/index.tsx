import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { SectionDivider } from "@/components/site/SectionDivider";
import { SectionShell } from "@/components/site/SectionShell";
import { HeroPlaceholder } from "@/components/sections/HeroPlaceholder";
import { FornelloPronto } from "@/components/sections/FornelloPronto";
import { DoveSiamo } from "@/components/sections/DoveSiamo";
import { Contatti } from "@/components/sections/Contatti";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Masseria Don Gianvito — Braceria, macelleria e azienda agricola a Noci",
      },
      {
        name: "description",
        content:
          "Dalla terra alla brace. Braceria, macelleria e filiera propria nella Murgia, a Noci (BA). Il rito del Fornello Pronto: scegli, cuoci, gusta.",
      },
      {
        property: "og:title",
        content: "Masseria Don Gianvito — Dalla terra alla brace",
      },
      {
        property: "og:description",
        content:
          "Braceria, macelleria e azienda agricola a filiera propria a Noci (BA), Puglia.",
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
        <HeroPlaceholder />

        <SectionDivider />
        <FornelloPronto />

        <SectionDivider />
        <SectionShell
          id="la-masseria"
          eyebrow="Chi siamo"
          title={
            <>
              La <span className="text-[color:var(--terracotta)]">Masseria</span>
            </>
          }
        />

        <SectionDivider />
        <SectionShell
          id="macelleria"
          eyebrow="Banco e taglio"
          title={
            <>
              <span className="text-[color:var(--terracotta)]">Macelleria</span>
            </>
          }
        />

        <SectionDivider />
        <SectionShell
          id="salumi-formaggi"
          eyebrow="Stagionatura"
          title={
            <>
              Salumi <span className="text-[color:var(--oro)]">&</span> Formaggi
            </>
          }
        />

        <SectionDivider />
        <SectionShell
          id="antipasteria-brace"
          eyebrow="A tavola"
          title={
            <>
              Antipasteria <span className="text-[color:var(--oro)]">&</span>{" "}
              <span className="text-[color:var(--terracotta)]">Brace</span>
            </>
          }
        />

        <SectionDivider />
        <SectionShell
          id="eventi"
          eyebrow="Su misura"
          title={
            <>
              Eventi <span className="text-[color:var(--oro)]">&</span> Cerimonie
            </>
          }
        />

        <SectionDivider />
        <SectionShell
          id="galleria"
          eyebrow="Sguardi"
          title={<>Galleria</>}
        />

        <SectionDivider />
        <DoveSiamo />

        <SectionDivider />
        <Contatti />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
