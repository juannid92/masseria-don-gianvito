import { Reveal } from "@/components/site/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Scegli in macelleria",
    desc: "Banco a vista: tagli del giorno, frollature, selezione del macellaio.",
  },
  {
    n: "02",
    title: "Cottura sulla brace",
    desc: "Brace viva di legni locali, gestita a temperatura dal nostro brace-maestro.",
  },
  {
    n: "03",
    title: "Servito al tavolo",
    desc: "Arriva caldo, tagliato e impiattato. Il rito si chiude in sala.",
  },
];

export function FornelloPronto() {
  return (
    <section
      id="fornello-pronto"
      className="relative mx-auto w-full max-w-7xl px-6 py-28 md:py-36 lg:py-44"
    >
      <Reveal>
        <p data-reveal-item className="font-eyebrow text-[11px] text-[color:var(--oro)]">
          Il rito
        </p>
        <h2
          data-reveal-item
          className="font-display mt-4 max-w-4xl text-balance text-4xl leading-[1.05] text-[color:var(--crema)] md:text-6xl lg:text-7xl"
        >
          Il <span className="text-[color:var(--terracotta)]">Fornello Pronto</span>
        </h2>
        <p
          data-reveal-item
          className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--crema)]/70"
        >
          Tre passi. Una sola materia: la carne. Dal banco alla brace, fino al tavolo.
        </p>
      </Reveal>

      <Reveal className="mt-16">
        <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.n}
              data-reveal-item
              className="group relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-[color:var(--carbone)]/40 p-8 backdrop-blur-sm transition-colors hover:border-[color:var(--terracotta)]/50"
            >
              <span className="font-eyebrow text-xs text-[color:var(--oro)]">
                Step {s.n}
              </span>
              <h3 className="font-display text-2xl text-[color:var(--crema)]">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--crema)]/65">
                {s.desc}
              </p>
              <div
                aria-hidden
                className="hairline-ember mt-auto opacity-30 transition-opacity group-hover:opacity-100"
              />
            </li>
          ))}
        </ol>
        <p
          data-reveal-item
          className="mt-10 text-xs text-[color:var(--crema)]/40"
        >
          · sezione placeholder — dettaglio narrativo nel prompt dedicato ·
        </p>
      </Reveal>
    </section>
  );
}
