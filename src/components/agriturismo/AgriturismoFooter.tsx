import { useHomeSectionNav } from "@/lib/nav";
import { Link } from "@tanstack/react-router";
import { ANIME } from "@/data/masseria";

export function AgriturismoCTA() {
  const goToSection = useHomeSectionNav();
  const phone = "+39 080 4972322";
  const mobile = "+39 335 1234567"; // placeholder
  const waMessage = encodeURIComponent("Buongiorno Masseria Don Gianvito, vorrei richiedere informazioni per una prenotazione in agriturismo.");

  return (
    <section className="bg-[color:var(--biscotto-scuro)] text-[color:var(--bianco-calce)] py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1100px] px-5 md:px-12">
        <div className="border border-[color:var(--oro-su-scuro)]/20 p-8 md:p-16">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24">
            <div>
              <h2 className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight mb-8">
                Ti aspettiamo <br />
                a tavola.
              </h2>
              <div className="space-y-8">
                <div>
                  <span className="font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--oro-su-scuro)] block mb-2">TELEFONO</span>
                  <a href={`tel:${phone}`} className="text-[20px] md:text-[24px] font-bold hover:text-[color:var(--oro-su-scuro)] transition-colors">
                    {phone}
                  </a>
                </div>
                <div>
                  <span className="font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--oro-su-scuro)] block mb-2">WHATSAPP</span>
                  <a href={`https://wa.me/393351234567?text=${waMessage}`} target="_blank" rel="noopener noreferrer" className="text-[20px] md:text-[24px] font-bold hover:text-[color:var(--oro-su-scuro)] transition-colors underline decoration-[color:var(--oro-su-scuro)]/30 underline-offset-8">
                    Invia un messaggio
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-12">
              <div className="space-y-6">
                <p className="text-[17px] leading-relaxed opacity-80">
                  La prenotazione è consigliata per permetterci di accogliervi al meglio e rispettare i tempi della masseria.
                </p>
                <div className="text-[15px] opacity-60 space-y-1">
                  <p>Mercoledì — Sabato: cena</p>
                  <p>Domenica e festivi: pranzo</p>
                </div>
              </div>
              
              <button 
                onClick={() => goToSection('prenota')}
                className="w-full md:w-auto h-[64px] px-12 bg-[color:var(--oro-su-scuro)] text-[color:var(--biscotto-scuro)] font-eyebrow text-[11px] tracking-[0.4em] transition-transform active:scale-[0.98] hover:brightness-110"
              >
                PRENOTA UN TAVOLO
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AgriturismoFooterLinks() {
  const routes = ANIME.filter(a => a.id !== 'agriturismo');

  return (
    <section className="py-24 md:py-40 bg-[color:var(--bianco-calce)] text-[color:var(--carbone)]">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-12">
        <div className="max-w-[800px] mb-20 md:mb-32">
          <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
            Prima della tavola <br />
            c’è tutto il resto.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {routes.map((r, i) => (
            <Link 
              key={i} 
              to={r.to} 
              className="group p-10 border border-[color:var(--carbone)]/5 hover:bg-[color:var(--bianco-latte)] transition-colors flex flex-col justify-between min-h-[220px]"
            >
              <span className="font-eyebrow text-[10px] tracking-[0.4em] opacity-40 italic uppercase">
                {r.id === 'allevamento' ? 'I · ALLEVAMENTO' : r.id === 'caseificio' ? 'II · CASEIFICIO' : 'III · MACELLERIA'}
              </span>
              <div className="flex items-end justify-between">
                <span className="font-display text-[28px] md:text-[32px] group-hover:text-[color:var(--oro-antico-testo)] transition-colors">
                  {r.label}
                </span>
                <span className="font-display text-[32px] opacity-10 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
