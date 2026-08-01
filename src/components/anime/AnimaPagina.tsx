import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ANIME, type AnimaId } from "@/data/masseria";
import { useHomeSectionNav } from "@/lib/nav";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * SCHELETRO COMUNE DELLE PAGINE INTERNE (anime).
 *
 * Regia unica, riusata identica da allevamento, caseificio, macelleria,
 * agriturismo: comparse brevi a soglia (opacita' + 16px), sfasamento leggero
 * fra i blocchi, filo d'oro sotto i titoli.
 * NESSUN pin, nessuna maschera, nessun filo continuo, nessuno scrub,
 * nessuna colonna a velocita' diversa. Massimo 3 ScrollTrigger per pagina:
 * un trigger per ogni `[data-reveal-group]` (hero+sez.1, sez.2+3, sez.4+chiusura).
 *
 * Colore: bianco calce e biscotto scuro come fondi, carbone per il testo,
 * oro per i fili e per UN SOLO testo per pagina (l'occhiello della hero),
 * biscotto come tocco caldo. Carminio e oliva assenti.
 */

export function useAnimaReveals(rootRef: React.RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const gruppi = gsap.utils.toArray<HTMLElement>("[data-reveal-group]", root);
      gruppi.forEach((gruppo, i) => {
        const elementi = gsap.utils.toArray<HTMLElement>("[data-reveal]", gruppo);
        if (!elementi.length) return;
        gsap.fromTo(
          elementi,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: gruppo,
              start: i === 0 ? "top 95%" : "top 82%",
              once: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reduced, rootRef]);
}

/** Segnaposto fotografico: fondo pieno, nessuna imitazione di materia. */
export function FotoSegnaposto({
  etichetta,
  ratio = "3 / 2",
  tone = "light",
  className = "",
}: {
  etichetta: string;
  ratio?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  // Sostituire con fotografia autentica della Masseria prima della pubblicazione.
  const scuro = tone === "dark";
  return (
    <figure
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        aspectRatio: ratio,
        background: scuro ? "var(--carbone)" : "var(--biscotto)",
      }}
    >
      <figcaption
        className="absolute inset-0 flex items-end p-4 md:p-6"
        style={{
          color: scuro ? "var(--bianco-calce)" : "var(--carbone)",
        }}
      >
        <span className="font-eyebrow text-[15px] leading-snug tracking-[0.18em] opacity-80 md:text-[15px]">
          Fotografia da produrre — {etichetta}
        </span>
      </figcaption>
    </figure>
  );
}

export function AnimaHero({
  occhiello,
  righe,
  frase,
  fotoEtichetta,
}: {
  occhiello: string;
  righe: [string, string, string];
  frase: string;
  fotoEtichetta: string;
}) {
  return (
    <section
      data-tone="dark"
      data-reveal-group
      className="relative flex min-h-[520px] flex-col justify-end bg-[color:var(--biscotto-scuro)] md:h-[70dvh]"
      style={{ paddingTop: "var(--page-header-safe-offset)" }}
    >
      {/* Sostituire con fotografia autentica della Masseria prima della pubblicazione. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "var(--carbone)", opacity: 0.35 }}
      />
      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 pb-12 md:px-10 md:pb-16">
        <p
          data-reveal
          className="font-eyebrow text-[15px] italic tracking-[0.3em]"
          style={{ color: "var(--oro-su-scuro)" }}
        >
          {occhiello}
        </p>
        <h1
          data-reveal
          className="mt-5 font-display text-[clamp(2.2rem,6vw,4rem)] leading-[1.02] text-[color:var(--bianco-calce)]"
        >
          {righe[0]}
          <br />
          {righe[1]}
          <br />
          {righe[2]}
        </h1>
        <div data-reveal aria-hidden className="hairline-oro mt-7 max-w-[220px]" />
        <p
          data-reveal
          className="mt-6 max-w-[62ch] text-[16px] leading-relaxed text-[color:var(--bianco-calce)]/80 md:text-[17px]"
        >
          {frase}
        </p>
        <p
          data-reveal
          className="mt-4 text-[15px] text-[color:var(--bianco-calce)]/45"
        >
          Fotografia da produrre — {fotoEtichetta}
        </p>
      </div>
    </section>
  );
}

/** Sezione di contenuto: occhiello, titolo breve, paragrafo, foto. */
export function AnimaSezione({
  id,
  occhiello,
  titolo,
  paragrafi,
  fotoEtichetta,
  tone,
  layout = "text-left",
  ratio,
  children,
}: {
  id?: string;
  occhiello: string;
  titolo: string;
  paragrafi: string[];
  fotoEtichetta?: string;
  tone: "light" | "dark";
  layout?: SezioneLayout;
  ratio?: string;
  children?: ReactNode;
}) {
  const scuro = tone === "dark";
  const isFull = layout === "full-width";
  const isOnlyText = layout === "text-only";
  const isInverted = layout === "text-right";

  // Rapporti immagine differenziati
  const finalRatio = ratio || (isFull ? "21 / 9" : "4 / 5");

  return (
    <section
      id={id}
      data-tone={tone}
      className="relative"
      style={{
        background: scuro ? "var(--biscotto-scuro)" : "var(--bianco-calce)",
        color: scuro ? "var(--bianco-calce)" : "var(--carbone)",
      }}
    >
      <div
        className={`mx-auto w-full max-w-[1100px] px-5 py-16 md:px-10 md:py-24 ${
          isOnlyText ? "max-w-[780px]" : ""
        }`}
      >
        <div
          className={`grid gap-10 md:gap-16 ${
            isOnlyText ? "grid-cols-1" : "md:grid-cols-12"
          }`}
        >
          {/* Layout: Immagine a Piena Larghezza sopra il testo */}
          {isFull && fotoEtichetta && (
            <div data-reveal className="md:col-span-12">
              <FotoSegnaposto
                etichetta={fotoEtichetta}
                tone={scuro ? "dark" : "light"}
                ratio={finalRatio}
              />
            </div>
          )}

          {/* Layout: Immagine a Sinistra (invertito) */}
          {isInverted && fotoEtichetta && (
            <div data-reveal className="order-2 md:order-1 md:col-span-5">
              <FotoSegnaposto
                etichetta={fotoEtichetta}
                tone={scuro ? "dark" : "light"}
                ratio={finalRatio}
              />
            </div>
          )}

          {/* Blocco Testo */}
          <div
            className={`
              flex flex-col justify-center
              ${isOnlyText ? "text-center items-center" : isFull ? "md:col-span-12" : "md:col-span-7"}
              ${isInverted ? "order-1 md:order-2" : ""}
            `}
          >
            <p
              data-reveal
              className="font-eyebrow text-[15px] tracking-[0.3em]"
              style={{ opacity: 0.62 }}
            >
              {occhiello}
            </p>
            <h2
              data-reveal
              className={`mt-4 font-display text-[clamp(1.7rem,3.4vw,2.5rem)] leading-[1.08] ${isOnlyText ? "max-w-[18ch]" : ""}`}
            >
              {titolo}
            </h2>
            <div
              data-reveal
              aria-hidden
              className={`hairline-oro mt-5 max-w-[160px] ${isOnlyText ? "mx-auto" : ""}`}
            />
            {paragrafi.map((p) => (
              <p
                key={p.slice(0, 24)}
                data-reveal
                className={`mt-6 text-[16px] leading-relaxed md:text-[17px] ${isOnlyText ? "max-w-[50ch]" : "max-w-[62ch]"}`}
                style={{ opacity: scuro ? 0.85 : 0.92 }}
              >
                {p}
              </p>
            ))}
            {children}
          </div>

          {/* Layout: Immagine a Destra (default) */}
          {layout === "text-left" && fotoEtichetta && (
            <div data-reveal className="md:col-span-5">
              <FotoSegnaposto
                etichetta={fotoEtichetta}
                tone={scuro ? "dark" : "light"}
                ratio={finalRatio}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

          {/* Layout: Immagine a Destra (default) */}
          {layout === "text-left" && fotoEtichetta && (
            <div data-reveal className="md:col-span-5">
              <FotoSegnaposto
                etichetta={fotoEtichetta}
                tone={scuro ? "dark" : "light"}
                ratio={ratio}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Chiusura: rimando alle altre tre anime + CTA prenotazione. */
export function AnimaChiusura({ corrente }: { corrente: AnimaId }) {
  const altre = ANIME.filter((a) => a.id !== corrente);
  const goToSection = useHomeSectionNav();

  return (
    <section data-tone="light" className="bg-[color:var(--bianco-calce)] text-[color:var(--carbone)]">
      <div className="mx-auto w-full max-w-[1100px] px-5 py-16 md:px-10 md:py-24">
        <p data-reveal className="font-eyebrow text-[15px] tracking-[0.3em] opacity-62">
          Le altre anime
        </p>
        <div data-reveal aria-hidden className="hairline-oro mt-5 max-w-[160px]" />
        <ul className="mt-8 grid gap-px border border-[color:var(--carbone)]/12 md:grid-cols-3">
          {altre.map((a) => (
            <li key={a.id} data-reveal className="border-[color:var(--carbone)]/12 md:border-l md:first:border-l-0">
              <Link
                to={a.to}
                className="flex h-full flex-col gap-2 px-5 py-7 transition-colors hover:bg-[color:var(--biscotto)]/35 md:px-7"
              >
                <span className="font-eyebrow text-[15px] tracking-[0.26em] opacity-55">
                  {a.numero}
                </span>
                <span className="font-display text-[22px]">{a.nome}</span>
                <span className="text-[15px] opacity-70">{a.claim}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div data-reveal className="mt-14 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <p className="max-w-[46ch] text-[16px] leading-relaxed md:text-[17px]">
            Per sedersi a tavola serve una telefonata o un messaggio: si prenota prima.
          </p>
          <button
            type="button"
            onClick={() => goToSection("prenota")}
            className="font-eyebrow inline-flex items-center justify-center bg-[color:var(--carbone)] px-7 py-4 text-[15px] tracking-[0.22em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--biscotto-scuro)]"
          >
            Prenota un tavolo
          </button>
        </div>
      </div>
    </section>
  );
}

/** Guscio: monta la regia condivisa (max 3 trigger). */
export function AnimaPagina({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useAnimaReveals(rootRef);
  return <div ref={rootRef}>{children}</div>;
}