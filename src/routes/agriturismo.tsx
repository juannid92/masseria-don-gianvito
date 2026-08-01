import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AnimaChiusura,
  AnimaHero,
  AnimaPagina,
  AnimaSezione,
} from "@/components/anime/AnimaPagina";
import { MASSERIA, ORARI } from "@/data/masseria";
import { useHomeSectionNav } from "@/lib/nav";

const SITE_URL = "https://masseriadongianvito.it";

export const Route = createFileRoute("/agriturismo")({
  head: () => ({
    meta: [
      { title: "Agriturismo — Masseria Don Gianvito · Noci" },
      {
        name: "description",
        content:
          "Cucina, tavola e brace alla Masseria Don Gianvito di Noci: Pecora in Pignata, antipasti, spezzatino e carne alla brace serviti ogni sera a Noci.",
      },
      { property: "og:title", content: "Agriturismo — Masseria Don Gianvito" },
      {
        property: "og:description",
        content:
          "La cucina del tempo lungo: la Pecora in Pignata e i piatti della masseria serviti ogni sera a Noci.",
      },
      { property: "og:image", content: `${SITE_URL}/og-masseria.jpg` },
      { property: "og:url", content: `${SITE_URL}/agriturismo` },
      { property: "og:type", content: "restaurant" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Agriturismo — Masseria Don Gianvito" },
      { name: "twitter:description", content: "La cucina del tempo lungo a Noci." },
      { name: "twitter:image", content: `${SITE_URL}/og-masseria.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/agriturismo` }],
  }),
  component: AgriturismoPage,
});

function AgriturismoPage() {
  const goToHomeSection = useHomeSectionNav();

  return (
    <AnimaPagina>
      <AnimaHero
        occhiello="IV · Agriturismo"
        righe={["Cinque ore", "prima che", "tu ti sieda."]}
        frase="Quello che mangi era già in cottura molto prima del tuo arrivo. La cucina qui segue il tempo del fuoco e della brace."
        fotoEtichetta="la tavola apparecchiata con la luce della sera, a piena larghezza"
      />

      <div data-reveal-group>
        <AnimaSezione
          tone="light"
          layout="text-left"
          occhiello="01 · L'attesa"
          titolo="La sera comincia prima"
          paragrafi={[
            "Il lavoro in cucina comincia nel pomeriggio, quando si accende il forno a legna e si preparano i cocci. Non c'è fretta, perché il calore deve entrare piano nella pietra.",
            "Mentre il sole scende, quello che finirà in tavola sta già cuocendo. L'attesa fa parte della ricetta: è il tempo che trasforma la materia in cibo.",
          ]}
          fotoEtichetta="il forno a legna acceso, riflessi di fiamma"
        />

        <AnimaSezione
          tone="dark"
          layout="full-width"
          occhiello="02 · Il tempo lungo"
          titolo="La Pecora in Pignata"
          paragrafi={[
            "È il piatto che porta il tempo lungo in tavola. La carne viene chiusa nel coccio con la pasta di pane, perché nulla del profumo e dell'umidità vada perduto.",
            "Resta nel forno per circa cinque ore. Quando arriva al tavolo e si rompe la crosta di pane, quello che esce è il racconto di tutto quel pomeriggio di fuoco.",
          ]}
          fotoEtichetta="la Pecora in Pignata nel coccio, appena sfornata"
        />
      </div>

      <div data-reveal-group>
        <AnimaSezione
          tone="light"
          layout="text-right"
          occhiello="03 · La varietà"
          titolo="Il resto della tavola"
          paragrafi={[
            "Accanto alla pignata arrivano gli antipasti della masseria e le polpettine nel pignatiello. Lo spezzatino cuoce piano, mentre l'arrosto alla brace viene preparato al momento, con il calore vivo del legno.",
            "Si chiude con i dolcini fatti in casa. La lista non è mai la stessa: cambia con quello che la terra e il banco offrono in quel giorno.",
          ]}
          fotoEtichetta="la brace con l'arrosto, fumo e calore"
        />

        <AnimaSezione
          tone="dark"
          layout="text-left"
          occhiello="04 · L'origine"
          titolo="Da dove arriva tutto"
          paragrafi={[
            "Tutto quello che finisce su questi tavoli ha fatto pochi passi. La carne arriva dal banco della macelleria, i formaggi dal laboratorio del caseificio, gli animali dalle stalle che circondano la masseria.",
            "È una filiera corta che si chiude qui, tra queste mura di pietra.",
          ]}
          fotoEtichetta="la sala vista dall'ingresso, accogliente e buia"
        >
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/macelleria"
              className="font-eyebrow border border-[color:var(--bianco-calce)]/35 px-6 py-3 text-[15px] tracking-[0.22em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--bianco-calce)]/10"
            >
              Il banco
            </Link>
            <Link
              to="/caseificio"
              className="font-eyebrow border border-[color:var(--bianco-calce)]/35 px-6 py-3 text-[15px] tracking-[0.22em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--bianco-calce)]/10"
            >
              Il laboratorio
            </Link>
          </div>
        </AnimaSezione>
      </div>

      {/* Blocco Pratico */}
      <section
        data-reveal-group
        data-tone="light"
        className="bg-[color:var(--biscotto)] text-[color:var(--carbone)]"
      >
        <div className="mx-auto max-w-[1100px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p data-reveal className="font-eyebrow text-[15px] tracking-[0.3em] opacity-62">
                Informazioni pratiche
              </p>
              <h2 data-reveal className="mt-4 font-display text-[2.5rem] leading-none">
                Quando venire
              </h2>
              <div data-reveal aria-hidden className="hairline-oro mt-5 max-w-[160px]" />
              
              <div className="mt-8 space-y-6">
                <div data-reveal>
                  <p className="font-eyebrow text-[15px] tracking-[0.2em] opacity-50 uppercase">Giorni e orari</p>
                  <p className="mt-2 text-[17px] leading-relaxed">
                    Lunedì e martedì restiamo chiusi.<br />
                    Da mercoledì a sabato ci siamo a cena.<br />
                    La domenica e i giorni festivi apriamo a pranzo.
                  </p>
                </div>
                
                <div data-reveal>
                  <p className="font-eyebrow text-[15px] tracking-[0.2em] opacity-50 uppercase">Prenotazione</p>
                  <p className="mt-2 text-[17px] leading-relaxed">
                    La prenotazione è sempre consigliata. I giorni possono variare a seconda della stagione: contattateci per conferma.
                  </p>
                </div>

                <div data-reveal className="pt-4">
                   <button
                    type="button"
                    onClick={() => goToHomeSection("prenota")}
                    className="group inline-flex items-center gap-3 text-[16px] font-medium transition-colors hover:text-[color:var(--oro-antico-testo)]"
                  >
                    <span>Torna alla sezione prenotazioni</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end bg-[color:var(--bianco-calce)]/40 p-8 md:p-12">
              <p data-reveal className="font-eyebrow text-[15px] tracking-[0.2em] opacity-50 uppercase">Contatti</p>
              <h3 data-reveal className="mt-4 font-display text-[2rem] leading-tight">
                Telefona o scrivi
              </h3>
              <p data-reveal className="mt-4 text-[16px] opacity-80">
                Basta dire in quante persone siete e per quale giorno volete venire.
              </p>
              
              <div className="mt-8 flex flex-col gap-4">
                <a
                  href={MASSERIA.telefonoHref}
                  data-reveal
                  className="font-eyebrow flex items-center justify-center bg-[color:var(--carbone)] px-7 py-4 text-[15px] tracking-[0.22em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--biscotto-scuro)]"
                >
                  {MASSERIA.telefono}
                </a>
                <a
                  href={MASSERIA.telefono2Href}
                  data-reveal
                  className="font-eyebrow flex items-center justify-center border border-[color:var(--carbone)]/20 px-7 py-4 text-[15px] tracking-[0.22em] transition-colors hover:bg-[color:var(--carbone)]/5"
                >
                  {MASSERIA.telefono2}
                </a>
                <a
                  href={MASSERIA.whatsappPrenota}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-reveal
                  className="font-eyebrow flex items-center justify-center border border-[color:var(--carbone)]/20 px-7 py-4 text-[15px] tracking-[0.22em] transition-colors hover:bg-[color:var(--carbone)]/5"
                >
                  Messaggio WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div data-reveal-group>
        <AnimaChiusura corrente="agriturismo" />
      </div>
    </AnimaPagina>
  );
}
