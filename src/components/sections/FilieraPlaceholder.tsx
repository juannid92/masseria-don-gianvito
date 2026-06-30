import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ContinuousBackground } from "@/components/site/ContinuousBackground";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Reveal } from "@/components/site/Reveal";

type Props = {
  eyebrow: string;
  title: string;
  lede: string;
};

/**
 * Pagina placeholder per le tappe della filiera (Allevamento, Caseificio,
 * Macelleria, Braceria). Sfondo coerente con il sistema globale; verrà
 * riempita con prompt dedicati una alla volta.
 */
export function FilieraPlaceholder({ eyebrow, title, lede }: Props) {
  return (
    <SmoothScroll>
      <ContinuousBackground />
      <Navbar />
      <main className="relative">
        <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 pt-32 pb-24">
          <Reveal>
            <p
              data-reveal-item
              className="font-eyebrow text-[11px] text-[color:var(--oro)]"
            >
              {eyebrow}
            </p>
            <h1
              data-reveal-item
              className="font-display mt-6 text-balance text-5xl leading-[0.95] text-[color:var(--crema)] md:text-7xl lg:text-[clamp(4rem,9vw,9rem)]"
            >
              {title}
            </h1>
            <p
              data-reveal-item
              className="mt-8 max-w-xl text-base leading-relaxed text-[color:var(--crema)]/70 md:text-lg"
            >
              {lede}
            </p>
            <div data-reveal-item className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/"
                className="font-eyebrow inline-flex items-center gap-2 rounded-full border border-[color:var(--oro)]/40 px-6 py-3 text-[11px] text-[color:var(--crema)] transition-colors hover:bg-[color:var(--oro)]/10"
              >
                ← Torna alla mappa
              </Link>
              <span className="font-eyebrow text-[10px] text-[color:var(--crema)]/40">
                · pagina in costruzione — racconto in arrivo ·
              </span>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
