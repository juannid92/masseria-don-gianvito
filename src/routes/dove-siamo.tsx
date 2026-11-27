import { createFileRoute } from "@tanstack/react-router";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";
import { MASSERIA } from "@/data/masseria";
import { Breadcrumb } from "@/components/site/Breadcrumb";

export const Route = createFileRoute("/dove-siamo")({
  head: () => ({
    meta: [
      { title: "Dove Siamo — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Come raggiungere la Masseria Don Gianvito a Noci (BA): indicazioni stradali, mappa e coordinate GPS nella Murgia barese.",
      },
      { property: "og:title", content: "Dove Siamo — Masseria Don Gianvito" },
      {
        property: "og:description",
        content:
          "Come raggiungere la Masseria Don Gianvito a Noci (BA): indicazioni stradali, mappa e coordinate GPS nella Murgia barese.",
      },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { property: "og:url", content: getAbsoluteUrl("/dove-siamo") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/dove-siamo") }],
  }),
  component: DoveSiamoPage,
});

function DoveSiamoPage() {
  return (
    <div data-tone="light" className="bg-[color:var(--bianco-calce)] pt-[var(--page-header-safe-offset)]">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Dove Siamo" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            mainEntity: {
              "@type": "LocalBusiness",
              name: MASSERIA.nome,
              address: {
                "@type": "PostalAddress",
                streetAddress: MASSERIA.indirizzo,
                addressLocality: "Noci",
                addressRegion: "BA",
                postalCode: "70015",
                addressCountry: "IT",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: MASSERIA.coordinate.lat,
                longitude: MASSERIA.coordinate.lng,
              },
              hasMap: MASSERIA.maps,
              telephone: MASSERIA.telefonoHref,
            },
          }),
        }}
      />
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="font-eyebrow text-xs tracking-[0.28em] text-[color:var(--oro-antico)]">
          Raggiungici
        </p>
        <h1 className="mt-6 font-display text-4xl md:text-5xl text-[color:var(--carbone)]">
          Dove siamo
        </h1>
        <div className="hairline-oro mx-auto mt-8 max-w-[120px]" />
        <p className="mt-10 text-lg leading-relaxed text-[color:var(--carbone)]/80">
          La Masseria Don Gianvito si trova sulla SP237 ex SS377 per Mottola, al km 6,5, in Zona C
          76, a Noci (BA). Siamo nel cuore della Murgia barese, tra Alberobello e Martina Franca.
        </p>
        <div className="mt-12 rounded-lg bg-[color:var(--pietra-100)] p-8 text-left">
          <h2 className="font-display text-2xl text-[color:var(--carbone)]">Indirizzo</h2>
          <p className="mt-3 text-lg text-[color:var(--carbone)]/80">{MASSERIA.indirizzo}</p>
          <p className="mt-2 text-sm text-[color:var(--carbone)]/60">
            Coordinate: {MASSERIA.coordinateLabel}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={MASSERIA.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="font-eyebrow inline-flex min-h-[48px] items-center justify-center bg-[color:var(--oro-antico)] px-7 text-[11px] tracking-[0.26em] text-[color:var(--carbone)] transition-opacity hover:opacity-90"
            >
              Apri in Google Maps
            </a>
            <a
              href={MASSERIA.telefonoHref}
              className="font-eyebrow inline-flex min-h-[48px] items-center justify-center border border-[color:var(--oro-antico)] px-7 text-[11px] tracking-[0.26em] text-[color:var(--carbone)] transition-colors hover:bg-[color:var(--oro-antico)]/10"
            >
              Chiama per indicazioni
            </a>
          </div>
        </div>
        <div className="mt-12 aspect-video w-full overflow-hidden rounded-lg bg-[color:var(--pietra-200)]">
          <iframe
            src={MASSERIA.mapsEmbed}
            title="Mappa Masseria Don Gianvito"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
