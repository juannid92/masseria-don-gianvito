import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MASSERIA } from "@/data/masseria";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * ATTO 07 — PRENOTA. Chiusura della Home.
 *
 * Regia: LA QUIETE. Nessuna tecnica dei sei atti precedenti.
 * - 2 soli trigger locali a soglia (nessun pin, nessuno scrub):
 *   1) comparsa dei blocchi dall'alto verso il basso con stagger;
 *   2) filo d'oro sotto il titolo che si distende (scaleX 0 → 1).
 * - Solo opacita' e traslazioni brevi (18px).
 * - Reduced motion: nessun trigger, tutto visibile e statico.
 *
 * Colore: fondo biscotto-scuro (stesso del footer → gap 0px e nessuno
 * stacco cromatico), testi bianco calce, un solo testo oro (il display),
 * occhielli bianco calce 70%, fili e bordi oro. Zero carminio, zero oliva.
 */

const APERTURA = [
  "Lunedì e martedì chiuso",
  "Da mercoledì a sabato, a cena",
  "Domenica e giorni festivi, a pranzo",
] as const;

export function Prenota() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const [mappaAttiva, setMappaAttiva] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const blocchi = gsap.utils.toArray<HTMLElement>("[data-prenota-block]", root);
      if (blocchi.length) {
        gsap.fromTo(
          blocchi,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.09,
            scrollTrigger: { trigger: root, start: "top 82%", once: true },
          },
        );
      }

      const filo = root.querySelector<HTMLElement>("[data-filo-oro]");
      if (filo) {
        gsap.fromTo(
          filo,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power2.inOut",
            scrollTrigger: { trigger: filo, start: "top 88%", once: true },
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const visibile = reduced ? undefined : { opacity: 0 };

  return (
    <section
      id="prenota"
      ref={rootRef}
      data-tone="dark"
      aria-labelledby="prenota-titolo"
      className="relative bg-[color:var(--biscotto-scuro)] text-[color:var(--bianco-calce)]"
    >
      <div aria-hidden className="hairline-oro" />

      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        {/* 1 — Titolo e occhiello */}
        <div data-prenota-block style={visibile} className="max-w-3xl">
          <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70 md:text-[11px]">
            07 — PRENOTA
          </p>
          <h2
            id="prenota-titolo"
            className="mt-6 font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.95] text-[color:var(--oro-su-scuro)]"
          >
            Vieni a
            <br />
            vedere
            <br />
            com&apos;è.
          </h2>
        </div>

        <div
          data-filo-oro
          aria-hidden
          className="mt-8 h-px w-full origin-left bg-[color:var(--oro-antico)]/70"
        />

        <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-2 md:gap-x-16 md:gap-y-20">
          {/* 2 — Quando siamo aperti */}
          <div data-prenota-block style={visibile}>
            <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70">
              Quando siamo aperti
            </p>
            <ul className="mt-6 space-y-3 border-t border-[color:var(--oro-antico)]/35 pt-6">
              {APERTURA.map((riga) => (
                <li
                  key={riga}
                  className="border-b border-[color:var(--bianco-calce)]/10 pb-3 text-[17px] leading-relaxed text-[color:var(--bianco-calce)] md:text-[19px]"
                >
                  {riga}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[15px] leading-relaxed text-[color:var(--bianco-calce)]/75">
              Consigliata la prenotazione. I giorni possono variare: contattare la masseria per
              conferma.
            </p>
          </div>

          {/* 3 — Come si prenota */}
          <div data-prenota-block style={visibile}>
            <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70">
              Come si prenota
            </p>
            <div className="mt-6 border-t border-[color:var(--oro-antico)]/35 pt-6">
              <ul className="space-y-2">
                <li>
                  <a
                    href={MASSERIA.telefonoHref}
                    className="inline-flex min-h-[44px] items-center font-display text-[clamp(1.5rem,3.4vw,2rem)] leading-tight text-[color:var(--bianco-calce)] tabular-nums transition-colors hover:text-[color:var(--bianco-calce)]"
                  >
                    +39 333 939 5750
                  </a>
                </li>
                <li>
                  <a
                    href={MASSERIA.telefono2Href}
                    className="inline-flex min-h-[44px] items-center font-display text-[clamp(1.5rem,3.4vw,2rem)] leading-tight text-[color:var(--bianco-calce)] tabular-nums transition-colors hover:text-[color:var(--bianco-calce)]"
                  >
                    +39 333 387 0292
                  </a>
                </li>
                <li>
                  <a
                    href={MASSERIA.whatsappPrenota}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] items-center text-[16px] text-[color:var(--bianco-calce)]/80 underline decoration-[color:var(--oro-antico)] underline-offset-4 transition-colors hover:text-[color:var(--bianco-calce)]"
                  >
                    WhatsApp, con il messaggio già pronto
                  </a>
                </li>
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={MASSERIA.whatsappPrenota}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[52px] w-full items-center justify-center bg-[color:var(--oro-antico)] px-7 font-eyebrow text-[11px] tracking-[0.26em] text-[color:var(--carbone)] transition-opacity hover:opacity-90 sm:w-auto"
                >
                  Prenota un tavolo
                </a>
                <a
                  href={MASSERIA.telefonoHref}
                  className="inline-flex min-h-[52px] w-full items-center justify-center border border-[color:var(--oro-antico)] px-7 font-eyebrow text-[11px] tracking-[0.26em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--oro-antico)]/12 sm:w-auto"
                >
                  Chiama la masseria
                </a>
              </div>
            </div>
          </div>

          {/* 4 — Dove siamo */}
          <div data-prenota-block style={visibile} className="md:col-span-2">
            <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70">
              Dove siamo
            </p>
            <div className="mt-6 grid gap-10 border-t border-[color:var(--oro-antico)]/35 pt-6 md:grid-cols-2 md:gap-16">
              <div>
                <address className="not-italic text-[17px] leading-relaxed text-[color:var(--bianco-calce)]">
                  {MASSERIA.indirizzo}
                </address>
                <p className="mt-3 text-[15px] tabular-nums text-[color:var(--bianco-calce)]/70">
                  {MASSERIA.coordinateLabel}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
                  <a
                    href={MASSERIA.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] items-center border-b border-[color:var(--oro-antico)] font-eyebrow text-[10px] tracking-[0.24em] text-[color:var(--bianco-calce)]"
                  >
                    Apri in Maps
                  </a>
                  <a
                    href={MASSERIA.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] items-center text-[16px] text-[color:var(--bianco-calce)]/80 transition-colors hover:text-[color:var(--bianco-calce)]"
                  >
                    Instagram
                  </a>
                  <a
                    href={MASSERIA.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] items-center text-[16px] text-[color:var(--bianco-calce)]/80 transition-colors hover:text-[color:var(--bianco-calce)]"
                  >
                    Facebook
                  </a>
                </div>
                <p className="mt-6 text-[15px] tabular-nums text-[color:var(--bianco-calce)]/70">
                  P.IVA / CF {MASSERIA.piva}
                </p>
              </div>

              {/* Mappa: caricata solo dopo clic esplicito (privacy + peso) */}
              <div className="relative min-h-[240px] border border-[color:var(--oro-antico)]/35 md:min-h-[300px]">
                {mappaAttiva ? (
                  <iframe
                    src={MASSERIA.mapsEmbed}
                    title={`Mappa di ${MASSERIA.nome}, ${MASSERIA.indirizzo}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <button
                    type="button"
                    data-mappa-trigger
                    onClick={() => setMappaAttiva(true)}
                    aria-label="Carica la mappa interattiva di Google Maps con la posizione della masseria"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[color:var(--bianco-calce)]/[0.04] px-6 text-center transition-colors hover:bg-[color:var(--bianco-calce)]/[0.08]"
                  >
                    <span className="font-eyebrow text-[10px] tracking-[0.28em] text-[color:var(--bianco-calce)]">
                      Mostra la mappa
                    </span>
                    <span className="max-w-xs text-[15px] leading-relaxed text-[color:var(--bianco-calce)]/75">
                      La mappa viene caricata da Google solo dopo il tuo clic.
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}