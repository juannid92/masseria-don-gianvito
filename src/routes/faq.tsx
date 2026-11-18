import { createFileRoute } from "@tanstack/react-router";
import { getAbsoluteUrl } from "@/config/site";

const FAQ_ITEMS = [
  {
    q: "Come si prenota un tavolo?",
    a: "Puoi prenotare tramite WhatsApp al numero 333 939 5750, oppure chiamando direttamente. Ti consigliamo di prenotare con almeno 2-3 giorni di anticipo, specialmente per il sabato sera e la domenica a pranzo.",
  },
  {
    q: "Quali sono gli orari di apertura?",
    a: "Siamo chiusi lunedì e martedì. Da mercoledì a sabato serviamo la cena, la domenica e i festivi il pranzo. Per orari specifici e variazioni stagionali, contattaci direttamente.",
  },
  {
    q: "Avete opzioni per intolleranze o allergie alimentari?",
    a: "Sì, possiamo adattare i piatti in base a intolleranze e allergie. Ti chiediamo di comunicarcelo al momento della prenotazione così possiamo preparare il menù più adatto.",
  },
  {
    q: "C'è parcheggio disponibile?",
    a: "Sì, la masseria dispone di un ampio parcheggio gratuito all'interno della proprietà, accessibile direttamente dalla strada provinciale.",
  },
  {
    q: "Gli animali domestici sono ammessi?",
    a: "Gli animali domestici sono benvenuti negli spazi esterni della masseria. All'interno del ristorante ti chiediamo di contattarci prima per verificare la disponibilità.",
  },
  {
    q: "I prodotti sono davvero di produzione propria?",
    a: "Sì. La Masseria Don Gianvito è un'azienda agricola a filiera completa: alleviamo gli animali, produciamo i formaggi nel caseificio interno, lavoriamo la carne nella macelleria della masseria e cuciniamo tutto nell'agriturismo. Non importiamo materie prime da fuori.",
  },
  {
    q: "Organizzate eventi privati o cerimonie?",
    a: "Sì, ospitiamo eventi privati, cene aziendali e piccole cerimonie. Contattaci per discutere le tue esigenze e ricevere un preventivo personalizzato.",
  },
  {
    q: "Dove si trova esattamente la masseria?",
    a: "Siamo sulla SP237 ex SS377 per Mottola, al km 6,5, in Zona C 76, a Noci (BA). Puoi trovare le indicazioni complete e la mappa nella pagina Dove Siamo.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Domande Frequenti — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Risposte alle domande più frequenti su prenotazioni, orari, menù, parcheggio e servizi della Masseria Don Gianvito a Noci.",
      },
      { property: "og:title", content: "FAQ — Masseria Don Gianvito" },
      { property: "og:url", content: getAbsoluteUrl("/faq") },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: getAbsoluteUrl("/faq") }],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="bg-[color:var(--bianco-calce)] pt-[var(--page-header-safe-offset)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ_ITEMS.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <p className="font-eyebrow text-xs tracking-[0.28em] text-[color:var(--oro-antico)]">
            Informazioni utili
          </p>
          <h1 className="mt-6 font-display text-4xl md:text-5xl text-[color:var(--carbone)]">
            Domande frequenti
          </h1>
          <div className="hairline-oro mx-auto mt-8 max-w-[120px]" />
        </div>

        <div className="mt-16 space-y-0">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="border-t border-[color:var(--carbone)]/10 py-8">
              <h2 className="font-display text-xl text-[color:var(--carbone)]">{item.q}</h2>
              <p className="mt-3 text-lg leading-relaxed text-[color:var(--carbone)]/80">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}