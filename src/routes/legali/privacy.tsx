import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout, Sezione } from "@/components/legal/LegalLayout";
import { MASSERIA } from "@/data/masseria";
import { getAbsoluteUrl } from "@/config/site";
import { apriPreferenze } from "@/lib/consent";

export const Route = createFileRoute("/legali/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Masseria Don Gianvito" },
      {
        name: "description",
        content:
          "Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679 (GDPR).",
      },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/legali/privacy") }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout titolo="Privacy Policy" aggiornato="16 ottobre 2026">
      <p>
        Questa informativa descrive come vengono trattati i dati personali di chi visita il sito e
        ci contatta, ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 («GDPR») e del
        D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018.
      </p>

      <Sezione titolo="1. Titolare del trattamento">
        <p>
          Masseria Don Gianvito — Società Agricola Semplice
          <br />
          Sede: {MASSERIA.indirizzo}
          <br />
          P.IVA / C.F.: {MASSERIA.piva}
          <br />
          Telefono e WhatsApp:{" "}
          <a href={MASSERIA.telefonoHref} className="underline underline-offset-4">
            {MASSERIA.telefono}
          </a>
        </p>
        <p>
          Non è stato nominato un Responsabile della protezione dei dati (DPO), perché non ricorrono
          i casi di nomina obbligatoria previsti dall’art. 37 GDPR. Per qualsiasi richiesta sui tuoi
          dati puoi contattare direttamente il Titolare ai recapiti indicati.
        </p>
      </Sezione>

      <Sezione titolo="2. Quali dati trattiamo, perché e su quale base">
        <p>
          <strong>a) Dati di navigazione.</strong> I sistemi che ospitano il sito registrano in modo
          automatico alcuni dati tecnici (indirizzo IP, data e ora della richiesta, pagina richiesta,
          tipo di browser e di dispositivo). Servono a far funzionare il sito e a garantirne la
          sicurezza. Base giuridica: legittimo interesse del Titolare (art. 6.1.f GDPR). Non
          utilizziamo questi dati per profilarti. I tempi di conservazione sono quelli stabiliti dal
          fornitore di hosting, limitati al tempo strettamente necessario alla sicurezza.
        </p>
        <p>
          <strong>b) Richieste di contatto e prenotazioni.</strong> Se ci chiami, ci scrivi su
          WhatsApp o usi il modulo di prenotazione, trattiamo i dati che ci fornisci: nome, numero
          di telefono, data, orario e numero di persone, eventuali note. Li usiamo per rispondere e
          gestire la tua prenotazione. Base giuridica: esecuzione di misure precontrattuali e
          contrattuali richieste da te (art. 6.1.b GDPR). Conserviamo i dati per il tempo necessario
          a gestire la prenotazione e, di norma, non oltre 12 mesi dalla data prenotata, salvo
          obblighi di legge o necessità di tutelare un diritto in sede giudiziaria.
        </p>
        <p>
          <strong>c) Allergie e intolleranze.</strong> Se nelle note indichi allergie o intolleranze,
          queste informazioni possono rivelare dati relativi alla salute (art. 9 GDPR). Ti chiediamo
          di indicarle solo se vuoi che ne teniamo conto. Le useremo esclusivamente per servirti in
          sicurezza, sulla base del tuo consenso esplicito, che manifesti scrivendole e inviando la
          richiesta (art. 9.2.a GDPR). Puoi revocarlo in qualsiasi momento.
        </p>
        <p>
          <strong>d) Mappa di Google Maps.</strong> La mappa è caricata solo se lo consenti dal
          banner cookie o con un clic sul pulsante dedicato. In quel caso Google riceve il tuo
          indirizzo IP e può impostare cookie. Base giuridica: consenso (art. 6.1.a GDPR),
          revocabile in ogni momento da «Preferenze cookie».
        </p>
        <p>
          <strong>e) Obblighi di legge.</strong> Alcuni dati possono essere conservati per adempiere
          a obblighi fiscali, contabili o di altra natura (art. 6.1.c GDPR).
        </p>
      </Sezione>

      <Sezione titolo="3. Il modulo di prenotazione e WhatsApp">
        <p>
          Il modulo di prenotazione del sito non invia i dati ai nostri server e non li salva: li
          usa solo per preparare un messaggio WhatsApp. Il messaggio parte soltanto se premi il
          pulsante «Prenota tramite WhatsApp» e lo invii dall’applicazione. Da quel momento i dati
          sono trattati anche da WhatsApp (WhatsApp Ireland Ltd / Meta), come titolare autonomo,
          secondo la sua informativa.
        </p>
      </Sezione>

      <Sezione titolo="4. Cookie e strumenti simili">
        <p>
          Il sito non usa cookie di profilazione né strumenti di analisi o pubblicità. I font sono
          ospitati sul sito stesso e non vengono richiesti a server esterni. Per i dettagli vedi la{" "}
          <Link to="/legali/cookie" className="underline underline-offset-4">
            Cookie Policy
          </Link>
          . Puoi cambiare le tue scelte in qualsiasi momento:{" "}
          <button
            type="button"
            onClick={apriPreferenze}
            className="underline underline-offset-4"
          >
            apri le preferenze cookie
          </button>
          .
        </p>
      </Sezione>

      <Sezione titolo="5. Link a servizi esterni">
        <p>
          Il sito contiene collegamenti a Instagram, Facebook, WhatsApp e Google Maps. Sono semplici
          link: non carichiamo plugin social. Se li apri, esci dal sito e valgono le informative dei
          rispettivi gestori.
        </p>
      </Sezione>

      <Sezione titolo="6. A chi comunichiamo i dati">
        <p>
          I dati sono trattati dal Titolare e da persone autorizzate. Possono riceverli fornitori
          che svolgono servizi per noi (hosting e manutenzione del sito), nominati responsabili del
          trattamento ai sensi dell’art. 28 GDPR, e consulenti professionali per gli obblighi di
          legge. Google e Meta agiscono come titolari autonomi per i servizi indicati sopra. I tuoi
          dati non vengono venduti né diffusi.
        </p>
      </Sezione>

      <Sezione titolo="7. Trasferimenti fuori dallo Spazio Economico Europeo">
        <p>
          Alcuni fornitori (ad esempio Google e Meta) possono trattare dati in Paesi extra-UE, in
          particolare negli Stati Uniti. Il trasferimento avviene sulla base di una decisione di
          adeguatezza della Commissione europea (EU-US Data Privacy Framework, per i soggetti
          certificati) o delle clausole contrattuali standard (artt. 45 e 46 GDPR).
        </p>
      </Sezione>

      <Sezione titolo="8. I tuoi diritti">
        <p>Puoi chiederci in qualsiasi momento, gratuitamente:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>di accedere ai tuoi dati e averne copia (art. 15);</li>
          <li>di correggerli o completarli (art. 16);</li>
          <li>di cancellarli (art. 17);</li>
          <li>di limitarne il trattamento (art. 18);</li>
          <li>di riceverli in formato strutturato e trasferirli ad altri (art. 20);</li>
          <li>di opporti al trattamento fondato sul legittimo interesse (art. 21);</li>
          <li>di revocare il consenso, senza effetti sul trattamento già avvenuto (art. 7.3).</li>
        </ul>
        <p>
          Per esercitarli contatta il Titolare ai recapiti indicati al punto 1, anche per posta
          all’indirizzo della sede. Rispondiamo entro un mese. Hai inoltre il diritto di proporre
          reclamo al Garante per la protezione dei dati personali (
          <a
            href="https://www.garanteprivacy.it"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            www.garanteprivacy.it
          </a>
          ).
        </p>
      </Sezione>

      <Sezione titolo="9. Obbligatorietà del conferimento">
        <p>
          Fornire i dati richiesti per una prenotazione è facoltativo, ma senza nome e recapito non
          possiamo gestirla. Navigare il sito non richiede di fornire dati.
        </p>
      </Sezione>

      <Sezione titolo="10. Decisioni automatizzate e minori">
        <p>
          Non facciamo profilazione e non adottiamo decisioni basate su trattamenti automatizzati
          (art. 22 GDPR). Il sito non è rivolto a minori di 14 anni: se hai meno di 14 anni, chiedi
          a un genitore di contattarci.
        </p>
      </Sezione>

      <Sezione titolo="11. Modifiche">
        <p>
          Possiamo aggiornare questa informativa, ad esempio se cambiano i servizi del sito o la
          normativa. La data in alto indica l’ultima versione.
        </p>
      </Sezione>
    </LegalLayout>
  );
}
