import { useAnimaReveals, FotoSegnaposto } from "@/components/anime/AnimaPagina";
import { useRef } from "react";

export function AgriturismoStoria() {
  const containerRef = useRef<HTMLDivElement>(null);
  useAnimaReveals(containerRef);

  return (
    <section 
      ref={containerRef}
      className="py-24 md:py-40 bg-[color:var(--bianco-calce)] text-[color:var(--carbone)] overflow-hidden"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 md:gap-24 items-start">
          {/* Left: Title */}
          <div className="md:col-span-7">
            <p data-reveal className="font-eyebrow text-[11px] tracking-[0.3em] text-[color:var(--oro-antico-testo)] mb-6">UNA STORIA CHE RESTA</p>
            <h2 data-reveal className="font-display text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] mb-12">
              Dal Cinquecento, <br />
              la stessa casa <br />
              nella stessa terra.
            </h2>
            
            <div className="relative mt-12 md:mt-24 max-w-[500px]">
               <FotoSegnaposto 
                etichetta="IL CORTILE DELLA MASSERIA" 
                ratio="4 / 3"
                className="shadow-sm"
               />
               {/* Sostituire con fotografia autentica prima della pubblicazione */}
               
               {/* Sottile filo oro che collega la storia alla foto */}
               <div className="absolute -top-12 left-1/2 w-px h-24 bg-gradient-to-b from-[color:var(--oro-antico)] to-transparent hidden md:block" />
            </div>
          </div>

          {/* Right: Text */}
          <div className="md:col-span-5 md:pt-32">
            <div className="max-w-[380px] space-y-12">
              <p data-reveal className="text-[18px] md:text-[20px] leading-relaxed">
                La masseria nasce nelle campagne di Noci e attraversa i secoli conservando il rapporto fra casa, animali, campi e lavoro. Oggi l’Agriturismo è il punto in cui questa storia si apre agli ospiti: ci si siede dove la masseria continua a vivere e lavorare.
              </p>
              
              <div data-reveal className="pt-8 border-t border-[color:var(--carbone)]/10">
                <p className="text-[16px] md:text-[17px] opacity-70 italic">
                  La tavola non è separata dal resto. Arriva dopo l’allevamento, il caseificio, la macelleria e il lavoro nei campi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AgriturismoTavola() {
  const containerRef = useRef<HTMLDivElement>(null);
  useAnimaReveals(containerRef);

  return (
    <section 
      ref={containerRef}
      className="py-24 md:py-32 bg-[color:var(--bianco-latte)] text-[color:var(--carbone)]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-12">
        <div className="max-w-[800px] mb-24">
          <p data-reveal className="font-eyebrow text-[11px] tracking-[0.3em] text-[color:var(--oro-antico-testo)] mb-6">A TAVOLA</p>
          <h2 data-reveal className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] mb-8">
            Quello che c’è, <br />
            arriva dalla <br />
            masseria.
          </h2>
          <p data-reveal className="text-[18px] md:text-[19px] leading-relaxed opacity-80">
            Gli antipasti aprono la tavola. Seguono preparazioni di cucina, arrosto alla brace e dolcini fatti in casa. I formaggi arrivano dal caseificio, la carne passa dal banco e la disponibilità cambia con quello che c’è.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-16">
          <div data-reveal className="space-y-4">
            <span className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro-antico-testo)]">DALLA MASSERIA</span>
            <p className="text-[16px] leading-relaxed">Allevamento, campi e laboratorio restano nello stesso luogo.</p>
          </div>
          <div data-reveal className="space-y-4">
            <span className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro-antico-testo)]">DALLA CUCINA</span>
            <p className="text-[16px] leading-relaxed">Le preparazioni seguono la disponibilità del giorno.</p>
          </div>
          <div data-reveal className="space-y-4">
            <span className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro-antico-testo)]">ALLA BRACE</span>
            <p className="text-[16px] leading-relaxed">I tagli scelti al banco possono arrivare sulla tavola.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
