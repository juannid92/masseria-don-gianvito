import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimaPagina } from "@/components/anime/AnimaPagina";
import { MASSERIA } from "@/data/masseria";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";


export const Route = createFileRoute("/legali/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Masseria Don Gianvito" },
      { name: "description", content: "Informativa sulla privacy della Masseria Don Gianvito." },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/legali/privacy") }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <AnimaPagina>
      <section className="bg-[color:var(--bianco-calce)] text-[color:var(--carbone)] pt-[var(--page-header-safe-offset)]">
        <div className="mx-auto max-w-[800px] px-5 py-16 md:py-24">
          <h1 className="font-display text-[3rem] leading-none">Privacy Policy</h1>
          <div className="hairline-oro mt-8 max-w-[200px]" />
          
          <div className="mt-12 space-y-8 text-[17px] leading-relaxed opacity-90">
            <div>
              <h2 className="font-display text-[1.8rem]">Titolare del Trattamento</h2>
              <p className="mt-4">
                Masseria Don Gianvito — Società Agricola Semplice<br />
                {MASSERIA.indirizzo}<br />
                P.IVA: {MASSERIA.piva}
              </p>
            </div>

            <div>
              <h2 className="font-display text-[1.8rem]">Dati trattati</h2>
              <p className="mt-4">
                Il sito non raccoglie dati personali in modo automatico. Se ci contatti via telefono o WhatsApp, utilizzeremo i tuoi recapiti solo per gestire la tua richiesta o prenotazione.
              </p>
            </div>

            <div>
              <h2 className="font-display text-[1.8rem]">Servizi di terze parti</h2>
              <p className="mt-4">
                Utilizziamo Google Maps per mostrarti la nostra posizione. La mappa viene caricata solo dopo il tuo consenso esplicito, momento in cui Google potrebbe raccogliere dati secondo la propria informativa privacy.
              </p>
            </div>

            <div className="pt-8">
              <Link to="/" className="font-eyebrow text-[14px] border-b border-[color:var(--oro-antico)] pb-1">
                Torna alla Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </AnimaPagina>
  );
}
