import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="relative mt-12 border-t border-white/10 bg-[color:var(--carbone)]/80 backdrop-blur-sm">
      <div className="hairline-ember" />
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-3 lg:py-20">
        <Reveal className="space-y-4">
          <div data-reveal-item>
            <p className="font-eyebrow text-[11px] text-[color:var(--oro)]">
              Dalla terra alla brace
            </p>
            <h3 className="font-display mt-2 text-3xl text-[color:var(--crema)]">
              Masseria
              <br />
              <span className="text-[color:var(--terracotta)]">Don Gianvito</span>
            </h3>
          </div>
          <p data-reveal-item className="max-w-sm text-sm leading-relaxed text-[color:var(--crema)]/70">
            Braceria, macelleria e azienda agricola a filiera propria nel cuore della Murgia.
          </p>
        </Reveal>

        <Reveal className="space-y-4">
          <p data-reveal-item className="font-eyebrow text-[11px] text-[color:var(--oro)]">
            Dove siamo
          </p>
          <address data-reveal-item className="text-sm not-italic leading-relaxed text-[color:var(--crema)]/85">
            SP237 ex SS377 per Mottola Km 6,5
            <br />
            Zona C 76, 70015 Noci (BA)
          </address>
          <p data-reveal-item className="font-eyebrow text-[11px] text-[color:var(--oro)] pt-2">
            Orari
          </p>
          <p data-reveal-item className="text-sm text-[color:var(--crema)]/75">
            Mer–Sab a cena · Domenica e festivi a pranzo
            <br />
            <span className="text-[color:var(--crema)]/50">(orari da confermare)</span>
          </p>
        </Reveal>

        <Reveal className="space-y-4">
          <p data-reveal-item className="font-eyebrow text-[11px] text-[color:var(--oro)]">
            Contatti
          </p>
          <ul data-reveal-item className="space-y-2 text-sm text-[color:var(--crema)]/85">
            <li>
              <a
                href="tel:+393339395750"
                className="transition-colors hover:text-[color:var(--terracotta)]"
              >
                333 939 5750
              </a>
            </li>
            <li>
              <a
                href="tel:+393333870292"
                className="transition-colors hover:text-[color:var(--terracotta)]"
              >
                333 387 0292
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/393339395750"
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors hover:text-[color:var(--terracotta)]"
              >
                WhatsApp
              </a>
            </li>
          </ul>
          <p data-reveal-item className="font-eyebrow text-[11px] text-[color:var(--oro)] pt-2">
            Social
          </p>
          <ul data-reveal-item className="flex gap-4 text-sm">
            <li>
              <a
                href="https://facebook.com/masseriadongianvito"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[color:var(--crema)]/85 transition-colors hover:text-[color:var(--terracotta)]"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/masseria_don_gianvito"
                target="_blank"
                rel="noreferrer noopener"
                className="text-[color:var(--crema)]/85 transition-colors hover:text-[color:var(--terracotta)]"
              >
                Instagram
              </a>
            </li>
          </ul>
        </Reveal>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-[color:var(--crema)]/40 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Masseria Don Gianvito. Tutti i diritti riservati.</span>
          <span className="font-eyebrow text-[10px] text-[color:var(--oro)]/70">
            Noci · Puglia · Italia
          </span>
        </div>
      </div>
    </footer>
  );
}
