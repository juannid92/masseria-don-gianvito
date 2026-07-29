import { Link } from "@tanstack/react-router";
import { ANIME, ATTI, MASSERIA } from "@/data/masseria";
import { useHomeSectionNav } from "@/lib/nav";

/**
 * FOOTER — fondo crema, composizione asimmetrica (non quattro colonne uguali).
 * Contiene tutti i dati reali: indirizzo, coordinate, Maps, telefoni, social, P.IVA.
 */
export function Footer() {
  const goToSection = useHomeSectionNav();
  const anno = new Date().getFullYear();

  return (
    <footer
      data-tone="dark"
      className="relative bg-[color:var(--pietra-800)] text-[color:var(--bianco-calce)]"
    >
      {/* Continuità: filo oro al confine con la sezione precedente */}
      <div aria-hidden className="hairline-oro" />

      <div className="mx-auto max-w-[1600px] px-5 pb-14 pt-16 md:px-10 md:pb-16 md:pt-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Claim — colonna larga */}
          <div className="lg:col-span-5">
            <p className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--oro-su-scuro)]/90">
              {MASSERIA.sopratitolo}
            </p>
            <p className="mt-6 font-display text-[clamp(2.4rem,6vw,4.2rem)] leading-[0.95]">
              Dalla terra
              <br />
              <em className="not-italic text-[color:var(--oro-su-scuro)]">alla tavola.</em>
            </p>
            <p className="mt-6 max-w-sm text-[16px] leading-relaxed text-[color:var(--bianco-calce)]/80">
              {MASSERIA.nome} — masseria del Cinquecento a Noci, sulla strada verso Mottola.
              Allevamento, caseificio, macelleria e agriturismo in un'unica filiera.
            </p>
          </div>

          {/* Esplora */}
          <nav className="lg:col-span-2" aria-label="Esplora">
            <p className="font-eyebrow mb-5 text-[9px] tracking-[0.34em] text-[color:var(--bianco-calce)]/55">
              Esplora
            </p>
            <ul className="space-y-2">
              {ATTI.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => goToSection(a.id)}
                    className="group flex items-baseline gap-2 text-left text-[15px] text-[color:var(--bianco-calce)]/80 transition-colors hover:text-[color:var(--oro-su-scuro)]"
                  >
                    <span className="font-eyebrow text-[9px] tracking-[0.2em] text-[color:var(--oro-su-scuro)]/85">
                      {a.numero}
                    </span>
                    {a.nome}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Le quattro anime */}
          <nav className="lg:col-span-2" aria-label="Le quattro anime">
            <p className="font-eyebrow mb-5 text-[9px] tracking-[0.34em] text-[color:var(--bianco-calce)]/55">
              Le quattro anime
            </p>
            <ul className="space-y-3">
              {ANIME.map((a) => (
                <li key={a.id}>
                  <Link
                    to={a.to}
                    className="block font-display text-[19px] leading-tight text-[color:var(--bianco-calce)] transition-colors hover:text-[color:var(--oro-su-scuro)]"
                  >
                    {a.nome}
                  </Link>
                  <span className="text-[13px] text-[color:var(--bianco-calce)]/55">{a.claim}</span>
                </li>
              ))}
            </ul>
          </nav>

          {/* Visita + Contatti */}
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-1">
            <div>
              <p className="font-eyebrow mb-5 text-[9px] tracking-[0.34em] text-[color:var(--bianco-calce)]/55">
                Visita
              </p>
              <address className="not-italic text-[15px] leading-relaxed text-[color:var(--bianco-calce)]/85">
                {MASSERIA.indirizzo}
              </address>
              <p className="mt-2 text-[13px] tabular-nums text-[color:var(--bianco-calce)]/55">
                {MASSERIA.coordinateLabel}
              </p>
              <a
                href={MASSERIA.maps}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block border-b border-[color:var(--oro-antico)] pb-px font-eyebrow text-[10px] tracking-[0.24em] text-[color:var(--oro-su-scuro)]"
              >
                Apri in Maps
              </a>
            </div>

            <div>
              <p className="font-eyebrow mb-5 text-[9px] tracking-[0.34em] text-[color:var(--bianco-calce)]/55">
                Contatti
              </p>
              <ul className="space-y-2 text-[15px] text-[color:var(--bianco-calce)]/85">
                <li>
                  <a href={MASSERIA.telefonoHref} className="hover:text-[color:var(--oro-su-scuro)]">
                    {MASSERIA.telefono}
                  </a>
                </li>
                <li>
                  <a href={MASSERIA.telefono2Href} className="hover:text-[color:var(--oro-su-scuro)]">
                    {MASSERIA.telefono2}
                  </a>
                </li>
                <li>
                  <a
                    href={MASSERIA.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[color:var(--oro-su-scuro)]"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={MASSERIA.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[color:var(--oro-su-scuro)]"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={MASSERIA.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[color:var(--oro-su-scuro)]"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-[color:var(--bianco-calce)]/15 pt-6 text-[12px] text-[color:var(--bianco-calce)]/50 md:flex-row md:items-center md:justify-between">
          <span>
            © {anno} {MASSERIA.nome} — Società agricola semplice
          </span>
          <span className="tabular-nums">P.IVA / CF {MASSERIA.piva}</span>
        </div>
      </div>
    </footer>
  );
}
