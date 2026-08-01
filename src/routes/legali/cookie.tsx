import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimaPagina } from "@/components/anime/AnimaPagina";
import { MASSERIA } from "@/data/masseria";

const SITE_URL = "https://masseriadongianvito.it";

export const Route = createFileRoute("/legali/cookie")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Masseria Don Gianvito" },
      { name: "description", content: "Informativa sui cookie della Masseria Don Gianvito." },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/legali/cookie` }],
  }),
  component: CookiePage,
});

function CookiePage() {
  return (
    <AnimaPagina>
      <section className="bg-[color:var(--bianco-calce)] text-[color:var(--carbone)] pt-[var(--page-header-safe-offset)]">
        <div className="mx-auto max-w-[800px] px-5 py-16 md:py-24">
          <h1 className="font-display text-[3rem] leading-none">Cookie Policy</h1>
          <div className="hairline-oro mt-8 max-w-[200px]" />
          
          <div className="mt-12 space-y-8 text-[17px] leading-relaxed opacity-90">
            <div>
              <h2 className="font-display text-[1.8rem]">Cosa sono i cookie</h2>
              <p className="mt-4">
                I cookie sono piccoli file di testo che i siti visitati dall'utente inviano al suo terminale, dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla successiva visita.
              </p>
            </div>

            <div>
              <h2 className="font-display text-[1.8rem]">Cookie utilizzati in questo sito</h2>
              <p className="mt-4">
                Questo sito non utilizza cookie di profilazione o tracciamento propri. Utilizziamo esclusivamente cookie tecnici necessari al funzionamento del sito o componenti di terze parti (Google Maps) che si attivano solo dopo il tuo consenso.
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
