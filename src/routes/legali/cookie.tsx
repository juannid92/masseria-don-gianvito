import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, Sezione } from "@/components/legal/LegalLayout";
import { getAbsoluteUrl } from "@/config/site";
import { apriPreferenze } from "@/lib/consent";

export const Route = createFileRoute("/legali/cookie")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Masseria Don Gianvito" },
      {
        name: "description",
        content: "Informativa sui cookie e sugli strumenti simili usati dal sito della Masseria Don Gianvito.",
      },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/legali/cookie") }],
  }),
  component: CookiePage,
});

const celle = "border border-[color:var(--carbone)]/15 px-3 py-2 align-top text-[15px]";

function CookiePage() {
  return (
    <LegalLayout titolo="Cookie Policy" aggiornato="16 ottobre 2026">
      <p>
        Questa informativa spiega quali cookie e strumenti simili usa il sito, in conformità all’art.
        122 del Codice privacy, alla direttiva ePrivacy e alle Linee guida cookie del Garante per la
        protezione dei dati personali (10 giugno 2021). Per i dati personali in generale vedi la{" "}
        <Link to="/legali/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>

      <Sezione titolo="Cosa sono">
        <p>
          I cookie sono piccoli file di testo che un sito salva nel tuo dispositivo. Strumenti
          analoghi, come il Local Storage del browser, servono a scopi simili.
        </p>
      </Sezione>

      <Sezione titolo="Cosa usa questo sito">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[color:var(--carbone)]/5">
                <th className={celle}>Nome / servizio</th>
                <th className={celle}>Finalità</th>
                <th className={celle}>Tipo</th>
                <th className={celle}>Durata</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={celle}>masseria-consenso (Local Storage, prima parte)</td>
                <td className={celle}>Ricorda se hai accettato o rifiutato i servizi esterni.</td>
                <td className={celle}>Tecnico, non richiede consenso</td>
                <td className={celle}>6 mesi</td>
              </tr>
              <tr>
                <td className={celle}>Google Maps (terza parte, Google LLC / Google Ireland Ltd)</td>
                <td className={celle}>
                  Mostra la mappa con la posizione della masseria. Google riceve il tuo indirizzo IP
                  e può impostare propri cookie.
                </td>
                <td className={celle}>Terza parte, solo con il tuo consenso</td>
                <td className={celle}>Secondo la policy di Google</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Il sito <strong>non</strong> usa cookie di profilazione, strumenti di analisi statistica
          né pubblicità. I caratteri tipografici sono ospitati sul sito e non vengono richiesti a
          Google Fonts.
        </p>
      </Sezione>

      <Sezione titolo="Come gestire le tue scelte">
        <p>
          Al primo accesso ti mostriamo un avviso con i pulsanti «Rifiuta», «Personalizza» e
          «Accetta», tutti con la stessa evidenza. Se non scegli, i servizi esterni non vengono
          caricati. La scelta vale 6 mesi, poi ti verrà richiesta di nuovo. Puoi modificarla o
          revocarla in ogni momento:{" "}
          <button type="button" onClick={apriPreferenze} className="underline underline-offset-4">
            apri le preferenze cookie
          </button>
          , oppure usa il link «Preferenze cookie» in fondo a ogni pagina.
        </p>
        <p>
          Puoi anche cancellare i dati salvati o bloccare i cookie dalle impostazioni del tuo browser
          (Chrome, Firefox, Safari, Edge). Cancellando i dati del sito, ti verrà richiesta di nuovo
          la scelta.
        </p>
      </Sezione>

      <Sezione titolo="Informative di terze parti">
        <p>
          Google Maps:{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            policies.google.com/privacy
          </a>
          .
        </p>
      </Sezione>
    </LegalLayout>
  );
}
