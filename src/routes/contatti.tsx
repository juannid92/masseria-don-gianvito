import { createFileRoute } from "@tanstack/react-router";
import { getAbsoluteUrl } from "@/config/site";
import { MASSERIA, ORARI } from "@/data/masseria";
import { Breadcrumb } from "@/components/site/Breadcrumb";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Contatta la Masseria Don Gianvito a Noci (BA): prenota un tavolo, chiedi informazioni su orari, menù e servizi.",
      },
      { property: "og:title", content: "Contatti — Masseria Don Gianvito" },
      { property: "og:url", content: getAbsoluteUrl("/contatti") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/contatti") }],
  }),
  component: ContattiPage,
});

function ContattiPage() {
  return (
    <div className="bg-[color:var(--bianco-calce)] pt-[var(--page-header-safe-offset)]">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contatti" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            mainEntity: {
              "@type": "LocalBusiness",
              name: MASSERIA.nome,
              telephone: MASSERIA.telefono,
              url: getAbsoluteUrl("/"),
              address: {
                "@type": "PostalAddress",
                streetAddress: MASSERIA.indirizzo,
                addressLocality: "Noci",
                addressRegion: "BA",
                postalCode: "70015",
                addressCountry: "IT",
              },
              openingHoursSpecification: ORARI.map((o) => ({
                "@type": "OpeningHoursSpecification",
                dayOfWeek: o.giorno === "Domenica e festivi" ? "Sunday" : o.giorno,
                opens: o.servizio === "Chiuso" ? undefined : "12:00",
                closes: o.servizio === "Chiuso" ? undefined : "23:00",
              })).filter((o) => o.opens),
            },
          }),
        }}
      />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-eyebrow text-xs tracking-[0.28em] text-[color:var(--oro-antico)]">
          Scrivici o chiamaci
        </p>
        <h1 className="mt-6 font-display text-4xl md:text-5xl text-[color:var(--carbone)]">
          Contatti
        </h1>
        <div className="hairline-oro mx-auto mt-8 max-w-[120px]" />

        <div className="mt-12 grid gap-8 text-left md:grid-cols-2">
          <div className="rounded-lg bg-[color:var(--pietra-100)] p-8">
            <h2 className="font-display text-2xl text-[color:var(--carbone)]">Telefono</h2>
            <p className="mt-3 text-lg text-[color:var(--carbone)]/80">{MASSERIA.telefono}</p>
            <p className="text-lg text-[color:var(--carbone)]/80">{MASSERIA.telefono2}</p>
            <a
              href={MASSERIA.telefonoHref}
              className="mt-4 inline-block font-eyebrow text-[11px] tracking-[0.26em] text-[color:var(--terra-cotta)] underline decoration-[color:var(--oro-antico)] underline-offset-4 hover:text-[color:var(--carbone)]"
            >
              Chiama ora
            </a>
          </div>

          <div className="rounded-lg bg-[color:var(--pietra-100)] p-8">
            <h2 className="font-display text-2xl text-[color:var(--carbone)]">WhatsApp</h2>
            <p className="mt-3 text-lg text-[color:var(--carbone)]/80">
              Prenota un tavolo o chiedi informazioni direttamente su WhatsApp.
            </p>
            <a
              href={MASSERIA.whatsappPrenota}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[48px] items-center justify-center bg-[color:var(--oro-antico)] px-7 font-eyebrow text-[11px] tracking-[0.26em] text-[color:var(--carbone)] transition-opacity hover:opacity-90"
            >
              Prenota su WhatsApp
            </a>
          </div>

          <div className="rounded-lg bg-[color:var(--pietra-100)] p-8">
            <h2 className="font-display text-2xl text-[color:var(--carbone)]">Social</h2>
            <div className="mt-3 flex flex-col gap-3">
              <a
                href={MASSERIA.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[color:var(--carbone)]/80 underline decoration-[color:var(--oro-antico)] underline-offset-4 hover:text-[color:var(--carbone)]"
              >
                Instagram
              </a>
              <a
                href={MASSERIA.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-[color:var(--carbone)]/80 underline decoration-[color:var(--oro-antico)] underline-offset-4 hover:text-[color:var(--carbone)]"
              >
                Facebook
              </a>
            </div>
          </div>

          <div className="rounded-lg bg-[color:var(--pietra-100)] p-8">
            <h2 className="font-display text-2xl text-[color:var(--carbone)]">Orari</h2>
            <ul className="mt-3 space-y-2">
              {ORARI.map((o) => (
                <li key={o.giorno} className="flex justify-between text-[color:var(--carbone)]/80">
                  <span>{o.giorno}</span>
                  <span className="font-medium">{o.servizio}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
