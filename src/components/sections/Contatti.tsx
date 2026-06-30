import { Reveal } from "@/components/site/Reveal";

export function Contatti() {
  return (
    <section
      id="contatti"
      className="relative mx-auto w-full max-w-7xl px-6 py-28 md:py-36 lg:py-44"
    >
      <Reveal>
        <p data-reveal-item className="font-eyebrow text-[11px] text-[color:var(--oro)]">
          Prenotazioni
        </p>
        <h2
          data-reveal-item
          className="font-display mt-4 max-w-4xl text-balance text-4xl leading-[1.05] text-[color:var(--crema)] md:text-6xl lg:text-7xl"
        >
          Contatti & <span className="text-[color:var(--terracotta)]">Prenotazioni</span>
        </h2>
      </Reveal>

      <Reveal className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <form
          data-reveal-item
          className="space-y-5 rounded-2xl border border-white/10 bg-[color:var(--carbone)]/40 p-8 backdrop-blur-sm"
          aria-label="Form prenotazione (placeholder)"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="block">
              <span className="font-eyebrow text-[10px] text-[color:var(--oro)]">
                Nome
              </span>
              <input
                disabled
                placeholder="Mario Rossi"
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-[color:var(--crema)] placeholder:text-[color:var(--crema)]/30 disabled:opacity-60"
              />
            </label>
            <label className="block">
              <span className="font-eyebrow text-[10px] text-[color:var(--oro)]">
                Telefono
              </span>
              <input
                disabled
                placeholder="333 ..."
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-[color:var(--crema)] placeholder:text-[color:var(--crema)]/30 disabled:opacity-60"
              />
            </label>
          </div>
          <label className="block">
            <span className="font-eyebrow text-[10px] text-[color:var(--oro)]">
              Messaggio
            </span>
            <textarea
              disabled
              rows={4}
              placeholder="Data, orario, numero di persone..."
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-[color:var(--crema)] placeholder:text-[color:var(--crema)]/30 disabled:opacity-60"
            />
          </label>
          <button
            type="submit"
            disabled
            className="bg-grad-brace font-eyebrow inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-xs text-[color:var(--crema)] opacity-70"
          >
            Invia richiesta (placeholder)
          </button>
          <p className="text-[11px] text-[color:var(--crema)]/40">
            · form segnaposto — logica da implementare in un prompt dedicato ·
          </p>
        </form>

        <div data-reveal-item className="space-y-6 self-start">
          <div>
            <p className="font-eyebrow text-[10px] text-[color:var(--oro)]">Chiama ora</p>
            <p className="font-display mt-2 text-3xl text-[color:var(--crema)]">
              <a href="tel:+393339395750" className="hover:text-[color:var(--terracotta)]">
                333 939 5750
              </a>
              <span className="mx-3 text-[color:var(--crema)]/30">·</span>
              <a href="tel:+393333870292" className="hover:text-[color:var(--terracotta)]">
                333 387 0292
              </a>
            </p>
          </div>
          <div>
            <p className="font-eyebrow text-[10px] text-[color:var(--oro)]">WhatsApp</p>
            <a
              href="https://wa.me/393339395750"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-block text-base text-[color:var(--crema)]/85 hover:text-[color:var(--terracotta)]"
            >
              wa.me/393339395750
            </a>
          </div>
          <div>
            <p className="font-eyebrow text-[10px] text-[color:var(--oro)]">Indirizzo</p>
            <address className="mt-2 not-italic text-base leading-relaxed text-[color:var(--crema)]/85">
              SP237 ex SS377 per Mottola Km 6,5
              <br />
              Zona C 76, 70015 Noci (BA)
            </address>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
