import { Reveal } from "@/components/site/Reveal";

export function DoveSiamo() {
  return (
    <section
      id="dove-siamo"
      className="relative mx-auto w-full max-w-7xl px-6 py-28 md:py-36 lg:py-44"
    >
      <Reveal>
        <p data-reveal-item className="font-eyebrow text-[11px] text-[color:var(--oro)]">
          La rotta
        </p>
        <h2
          data-reveal-item
          className="font-display mt-4 max-w-4xl text-balance text-4xl leading-[1.05] text-[color:var(--crema)] md:text-6xl lg:text-7xl"
        >
          Dove <span className="text-[color:var(--terracotta)]">siamo</span>
        </h2>
      </Reveal>

      <Reveal className="mt-12">
        <div
          data-reveal-item
          className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--marrone)]/30"
          aria-label="Mappa segnaposto"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(var(--oro) 1px, transparent 1px), linear-gradient(90deg, var(--oro) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage:
                "radial-gradient(ellipse at center, black 0%, transparent 70%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-eyebrow text-[10px] text-[color:var(--oro)]">
              Mappa · placeholder
            </span>
            <p className="font-display mt-3 text-2xl text-[color:var(--crema)] md:text-3xl">
              Noci (BA) · SP237 km 6,5
            </p>
            <p className="mt-2 text-xs text-[color:var(--crema)]/50">
              · integrazione mappa nel prompt dedicato ·
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
