/** HERO placeholder full-screen — verrà sostituito da prompt dedicato. */
export function HeroPlaceholder() {
  return (
    <section
      id="hero"
      className="bg-grad-ember relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--carbone)" }}
    >
      <div aria-hidden className="grain absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "var(--grad-ember)" }}
      />
      <div className="relative z-10 px-6 text-center">
        <p className="font-eyebrow text-xs text-[color:var(--oro)]">
          Hero · placeholder
        </p>
        <h1 className="font-display mt-6 text-[clamp(2.5rem,8vw,7rem)] leading-[0.95] text-[color:var(--crema)]">
          HERO — da definire
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-sm text-[color:var(--crema)]/60">
          Spazio riservato all’apertura cinematografica. Verrà costruito nel prossimo prompt.
        </p>
      </div>
    </section>
  );
}
