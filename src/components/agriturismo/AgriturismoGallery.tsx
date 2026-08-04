import { useAnimaReveals, FotoSegnaposto } from "@/components/anime/AnimaPagina";
import { useRef } from "react";

export function AgriturismoGalleria() {
  const containerRef = useRef<HTMLDivElement>(null);
  useAnimaReveals(containerRef);

  const items = [
    { label: "LA MASSERIA NELLA LUCE DELLA SERA", ratio: "21 / 9", grid: "md:col-span-12" },
    { label: "L’INGRESSO E IL CORTILE", ratio: "4 / 5", grid: "md:col-span-5" },
    { label: "LA TAVOLA APPARECCHIATA", ratio: "1 / 1", grid: "md:col-span-7 md:translate-y-24" },
    { label: "LE MANI IN CUCINA", ratio: "3 / 4", grid: "md:col-span-4" },
    { label: "L’ARROSTO ALLA BRACE", ratio: "16 / 9", grid: "md:col-span-8" },
    { label: "UN DETTAGLIO DELLA SALA", ratio: "1 / 1", grid: "md:col-span-4 md:col-start-9 md:-translate-y-24" },
  ];

  return (
    <section 
      ref={containerRef}
      className="py-24 md:py-48 bg-[color:var(--bianco-calce)] text-[color:var(--carbone)]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-12">
        <h2 data-reveal className="font-display text-[clamp(2.2rem,6vw,4.5rem)] leading-none mb-24 md:mb-32">
          Una sera <br />
          alla Masseria.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-y-32">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              data-reveal 
              className={`${item.grid} relative group`}
            >
              <FotoSegnaposto 
                etichetta={item.label} 
                ratio={item.ratio}
                tone="light"
                className="w-full shadow-sm grayscale hover:grayscale-0 transition-[filter] duration-700"
              />
              {/* Sostituire con fotografia autentica prima della pubblicazione */}
              <p className="mt-4 font-eyebrow text-[9px] tracking-[0.3em] opacity-40 uppercase">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AgriturismoDettagli() {
  const containerRef = useRef<HTMLDivElement>(null);
  useAnimaReveals(containerRef);

  const dettagli = [
    { label: "DOVE", content: "Nelle campagne di Noci, lungo la provinciale per Mottola" },
    { label: "QUANDO", content: "Mercoledì-Sabato a cena, Domenica e festivi a pranzo" },
    { label: "COME", content: "Prenotazione consigliata tramite telefono o WhatsApp" },
    { label: "DENTRO LA MASSERIA", content: "Allevamento, caseificio, macelleria e agriturismo" },
  ];

  return (
    <section 
      ref={containerRef}
      className="py-16 md:py-24 bg-[color:var(--bianco-latte)] border-t border-b border-[color:var(--carbone)]/5"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {dettagli.map((d, i) => (
            <div key={i} data-reveal className="space-y-4">
              <span className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro-antico-testo)]">{d.label}</span>
              <p className="text-[15px] md:text-[16px] leading-snug">{d.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
