import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, MessageCircle, Phone, UtensilsCrossed } from "lucide-react";
import { getAbsoluteUrl } from "@/config/site";
import { MASSERIA } from "@/data/masseria";

const EVENTI_WHATSAPP_URL =
  `${MASSERIA.whatsapp}?text=` +
  encodeURIComponent(
    "Buongiorno, vorrei ricevere informazioni sui prossimi eventi e menù dedicati alla Masseria Don Gianvito e verificare la disponibilità per ___ persone. Grazie.",
  );

export const Route = createFileRoute("/eventi")({
  head: () => ({
    meta: [
      { title: "Eventi e Menù — Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "Eventi in masseria, pranzi delle feste, serate a tema dalla nostra filiera e menù dedicati a Noci. Prenota su WhatsApp o telefonicamente al 333 387 0292.",
      },
      { property: "og:title", content: "Eventi e Menù — Masseria Don Gianvito" },
      {
        property: "og:description",
        content:
          "Scopri gli eventi e i menù stagionali di Masseria Don Gianvito a Noci e prenota tramite WhatsApp o chiamata diretta.",
      },
      { property: "og:url", content: getAbsoluteUrl("/eventi") },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/eventi") }],
  }),
  component: EventiPage,
});

const OCCASIONI = [
  {
    kicker: "01 · Ricorrenze",
    titolo: "Pranzi delle Feste",
    descrizione:
      "Pasqua, Pasquetta, Natale, Santo Stefano, Capodanno e feste di stagione: giornate pensate attorno alla grande tavola della Masseria con menù dedicati.",
    nota: "Menù stagionale pubblicato prima di ogni ricorrenza",
  },
  {
    kicker: "02 · Filiera",
    titolo: "Serate a Tema",
    descrizione:
      "Appuntamenti speciali dedicati ai tagli della nostra macelleria, ai formaggi freschi del caseificio e alle preparazioni della cucina contadina.",
    nota: "Su prenotazione fino ad esaurimento posti",
  },
  {
    kicker: "03 · Su misura",
    titolo: "Cerimonie e Tavolate",
    descrizione:
      "Comunioni, battesimi, compleanni e incontri conviviali immersi nella campagna di Noci, con proposte costruite sui prodotti dell'azienda agricola.",
    nota: "Menù concordato direttamente con la Masseria",
  },
];

function EventiPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:px-10 md:pt-36">
      <header className="border-b border-[color:var(--carbone)]/12 pb-10">
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--oro-scuro)]">
          Masseria Don Gianvito · Noci
        </p>
        <h1 className="mt-3 font-display text-4xl font-light tracking-tight text-[color:var(--carbone)] md:text-6xl">
          Eventi e <em>Menù</em>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[color:var(--carbone)]/78">
          Qui raccogliamo gli appuntamenti speciali della Masseria, i menù dedicati alle
          ricorrenze e le informazioni rapide per riservare il tuo tavolo con la cucina
          della nostra filiera.
        </p>
      </header>

      <section aria-labelledby="eventi-occasioni" className="mt-12">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-[color:var(--oro-scuro)]" aria-hidden="true" />
          <h2
            id="eventi-occasioni"
            className="font-sans text-xs uppercase tracking-[0.2em] text-[color:var(--oro-scuro)]"
          >
            Gli appuntamenti in Masseria
          </h2>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {OCCASIONI.map((item) => (
            <article
              key={item.titolo}
              className="flex flex-col justify-between border border-[color:var(--carbone)]/12 bg-[color:var(--bianco-calce)]/70 p-7"
            >
              <div>
                <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[color:var(--oro-scuro)]">
                  {item.kicker}
                </p>
                <h3 className="mt-2 font-display text-2xl font-normal text-[color:var(--carbone)]">
                  {item.titolo}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--carbone)]/78">
                  {item.descrizione}
                </p>
              </div>
              <p className="mt-6 border-t border-[color:var(--carbone)]/10 pt-4 font-sans text-xs text-[color:var(--carbone)]/65">
                {item.nota}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="eventi-menu"
        className="mt-14 border border-[color:var(--carbone)]/12 bg-[color:var(--bianco-calce)] p-8 md:p-10"
      >
        <div className="flex items-center gap-3">
          <UtensilsCrossed className="h-4 w-4 text-[color:var(--oro-scuro)]" aria-hidden="true" />
          <h2
            id="eventi-menu"
            className="font-sans text-xs uppercase tracking-[0.2em] text-[color:var(--oro-scuro)]"
          >
            Menù degli eventi
          </h2>
        </div>
        <p className="mt-4 font-display text-2xl font-light text-[color:var(--carbone)] md:text-3xl">
          I menù dei prossimi appuntamenti vengono aggiornati prima di ogni data.
        </p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[color:var(--carbone)]/76">
          Ogni evento nasce con portate legate alla stagione, alle carni del nostro allevamento
          e ai latticini del caseificio. Contattaci su WhatsApp o telefonicamente per ricevere
          il menù del giorno o della ricorrenza che ti interessa e segnalare eventuali intolleranze.
        </p>
        <div className="mt-6">
          <Link
            to="/agriturismo"
            className="inline-flex min-h-[44px] items-center font-sans text-xs uppercase tracking-[0.18em] text-[color:var(--carbone)] underline decoration-[color:var(--oro-antico)] underline-offset-4 transition-colors hover:text-[color:var(--oro-scuro)]"
          >
            Scopri l&apos;agriturismo e gli orari ordinari &rarr;
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="eventi-prenota"
        className="mt-14 border border-[color:var(--carbone)]/15 bg-[color:var(--nero-oliva)] p-8 text-[color:var(--bianco-calce)] md:p-12"
      >
        <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-[color:var(--oro-antico)]">
          Modalità di prenotazione
        </p>
        <h2
          id="eventi-prenota"
          className="mt-3 font-display text-3xl font-light tracking-tight md:text-4xl"
        >
          Prenota il tuo tavolo per un evento
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-[color:var(--bianco-calce)]/80">
          La prenotazione è sempre obbligatoria. Puoi scriverci direttamente su WhatsApp
          oppure chiamare il numero unico della Masseria:{" "}
          <strong className="font-medium text-[color:var(--bianco-calce)]">
            {MASSERIA.telefono}
          </strong>
          .
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href={EVENTI_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center gap-2.5 bg-[color:var(--oro-antico)] px-6 py-3 font-sans text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--nero-oliva)] transition-colors hover:bg-[#e5d2a7]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Prenota su WhatsApp
          </a>
          <a
            href={MASSERIA.telefonoHref}
            className="inline-flex min-h-[48px] items-center gap-2.5 border border-[color:var(--bianco-calce)]/40 px-6 py-3 font-sans text-xs font-medium uppercase tracking-[0.16em] text-[color:var(--bianco-calce)] transition-colors hover:border-[color:var(--oro-antico)] hover:text-[color:var(--oro-antico)]"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Chiama {MASSERIA.telefono}
          </a>
        </div>
      </section>
    </main>
  );
}
