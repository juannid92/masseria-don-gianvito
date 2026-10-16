import { useAnimaReveals } from "@/components/anime/AnimaPagina";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { ANIME } from "@/data/masseria";
import { useHomeSectionNav } from "@/lib/nav";

export function AgriturismoStoriaNuova() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states ONLY if GSAP is running
      gsap.set([photoRef.current, titleRef.current, lineRef.current], { opacity: 1, visibility: "visible" });

      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 92%",
          once: true
        }
      })
      .from(photoRef.current, { 
        clipPath: "inset(0 0 100% 0)", 
        duration: 1.2, 
        ease: "power3.out" 
      })
      .from(titleRef.current, { 
        y: 16, 
        opacity: 0, 
        duration: 0.8, 
        ease: "power2.out" 
      }, "-=0.6")
      .from(lineRef.current, { 
        scaleX: 0, 
        transformOrigin: "left", 
        duration: 1, 
        ease: "expo.out" 
      }, "-=0.4");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="storia-nuova"
      className="relative py-20 md:py-32 bg-[#e8d5b0] text-[color:var(--carbone)] overflow-hidden"
    >
      <div className="absolute inset-y-0 right-0 w-full md:w-[38%] bg-[color:var(--carminio-scuro)] hidden md:block" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-[1300px] px-5 md:px-12">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div ref={photoRef} className="md:col-span-7 relative">
            <div className="absolute -left-4 -bottom-4 md:-left-6 md:-bottom-6 w-2/3 h-2/3 border border-[color:var(--oro-antico)]" aria-hidden="true" />
            <img
              src="/__l5e/assets-v1/81a5f591-4245-43dc-ad91-f989e8ef9ace/masseria-aerial.jpg"
              alt="Veduta aerea della Masseria Don Gianvito"
              className="relative w-full aspect-[4/3] object-cover shadow-[0_30px_60px_-30px_rgba(54,38,25,0.6)]"
            />
            <div ref={lineRef} className="hidden" />
          </div>

          <div className="md:col-span-5 relative md:pl-6">
            <span className="font-eyebrow text-[11px] tracking-[0.4em] text-[color:var(--carminio)] md:text-[color:var(--oro-su-scuro)] mb-6 block">DAL CINQUECENTO</span>
            <h2 ref={titleRef} className="font-display text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[1] mb-8 md:text-[color:var(--bianco-latte)]">
              Dal Cinquecento, la stessa casa nella <em className="not-italic text-[color:var(--carminio)] md:text-[color:var(--oro-su-scuro)]">stessa terra.</em>
            </h2>
            <div className="space-y-6 max-w-[420px] md:text-[color:var(--bianco-calce)]">
              <p className="text-[17px] md:text-[19px] leading-relaxed">
                La masseria attraversa i secoli conservando il rapporto fra casa, campi, animali e lavoro. Oggi l’Agriturismo è il punto in cui questa storia si apre agli ospiti.
              </p>
              <p className="text-[16px] italic border-l-2 border-[color:var(--oro-antico)] pl-5 opacity-80">
                La tavola arriva dopo tutto il resto: allevamento, caseificio, macelleria e cucina.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AgriturismoGalleriaNuova() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray(".gallery-img-wrap");
      
      // Ensure visibility
      gsap.set(images, { opacity: 1, visibility: "visible" });

      images.forEach((img: any) => {
        gsap.from(img, {
          scrollTrigger: {
            trigger: img,
            start: "top 92%",
            once: true
          },
          clipPath: "inset(100% 0 0 0)",
          y: 16,
          duration: 1.2,
          ease: "power3.out"
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      id="galleria-nuova"
      className="py-24 md:py-48 bg-[color:var(--bianco-calce)] text-[color:var(--carbone)]"
    >
      <div className="mx-auto w-full max-w-[1300px] px-5 md:px-12">
        <h2 className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-none mb-32">
          Una sera <br />
          alla Masseria.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-y-32">
          {/* 1. Verticale a sinistra */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="gallery-img-wrap relative overflow-hidden aspect-[4/5]">
              <img src="/images/agriturismo-gallery-01-ingresso.webp" className="w-full h-full object-cover" alt="L'ingresso" />
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-eyebrow text-[10px] tracking-[0.4em] opacity-40">L'INGRESSO</span>
            </div>
          </div>

          {/* 2. Larga, in alto a destra */}
          <div className="md:col-span-7 md:col-start-6 md:-translate-y-20 flex flex-col gap-6">
            <div className="gallery-img-wrap relative overflow-hidden aspect-[3/2]">
              <img src="/images/agriturismo-gallery-02-mani.webp" className="w-full h-full object-cover" alt="La tavola" />
            </div>
            <div className="flex justify-end">
              <span className="font-eyebrow text-[10px] tracking-[0.4em] opacity-40">LA TAVOLA</span>
            </div>
          </div>

          {/* 3. Piccola e sovrapposta */}
          <div className="md:col-span-3 md:col-start-5 md:-translate-y-48 z-10 flex flex-col gap-6">
            <div className="gallery-img-wrap relative overflow-hidden aspect-[4/5] shadow-2xl">
              <img src="/images/agriturismo-gallery-03-brace.webp" className="w-full h-full object-cover" alt="Il gesto" />
            </div>
            <span className="font-eyebrow text-[10px] tracking-[0.4em] opacity-40">IL GESTO</span>
          </div>

          {/* 4. Panoramica a chiusura */}
          <div className="md:col-span-10 md:col-start-2 flex flex-col gap-6">
            <div className="gallery-img-wrap relative overflow-hidden aspect-[21/9]">
              <img src="/images/agriturismo-gallery-04-sala.webp" className="w-full h-full object-cover" alt="La sala" />
            </div>
            <div className="flex justify-between">
              <span className="font-eyebrow text-[10px] tracking-[0.4em] opacity-40">LA SALA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AgriturismoDettagliNuovi() {
  return (
    <section id="dettagli-nuovi" className="py-24 md:py-48 bg-[color:var(--biscotto)]/30 text-[color:var(--carbone)] relative overflow-hidden">
      {/* Diagonale dorata */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <line x1="0" y1="100" x2="100" y2="0" stroke="var(--oro-antico)" strokeWidth="0.1" />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24 relative z-10">
          {/* DOVE */}
          <div className="md:col-span-4">
            <span className="font-eyebrow text-[11px] tracking-[0.4em] text-[color:var(--oro-antico-testo)] mb-6 block">DOVE</span>
            <p className="font-display text-[28px] md:text-[34px] leading-tight">
              Campagne di Noci, <br />
              provinciale per Mottola.
            </p>
          </div>

          {/* QUANDO */}
          <div className="md:col-span-5 md:col-start-6 text-center">
            <span className="font-eyebrow text-[11px] tracking-[0.4em] text-[color:var(--oro-antico-testo)] mb-6 block">QUANDO</span>
            <div className="space-y-4">
              <p className="font-display text-[32px] md:text-[42px] leading-none">Mercoledì — Sabato a cena</p>
              <p className="font-display text-[32px] md:text-[42px] leading-none text-[color:var(--oro-antico-testo)]">Domenica e festivi a pranzo</p>
            </div>
          </div>

          {/* COME */}
          <div className="md:col-span-4 md:col-start-9 text-right self-end">
            <span className="font-eyebrow text-[11px] tracking-[0.4em] text-[color:var(--oro-antico-testo)] mb-6 block">COME</span>
            <p className="text-[18px] md:text-[20px] opacity-70">Prenotazione consigliata.</p>
          </div>

          {/* NOTA VERTICALE */}
          <div className="absolute left-0 top-1/2 -rotate-90 origin-left translate-y-1/2 hidden md:block">
            <span className="font-eyebrow text-[9px] tracking-[0.5em] opacity-30 whitespace-nowrap">DENTRO LA MASSERIA · ALLEVAMENTO · CASEIFICIO · MACELLERIA</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AgriturismoCTANuovo() {
  const goToSection = useHomeSectionNav();
  const phone = "+39 080 4972322";
  const mobile = "+39 335 1234567";
  const waMessage = encodeURIComponent("Buongiorno Masseria Don Gianvito, vorrei richiedere informazioni per una prenotazione in agriturismo.");

  return (
    <section id="cta-nuovo" className="bg-[color:var(--biscotto-scuro)] text-[color:var(--bianco-calce)] py-32 md:py-48">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-12">
        <div className="grid md:grid-cols-12 gap-16 items-end">
          <div className="md:col-span-8">
            <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] mb-16">
              La sera comincia <br />
              prima di arrivare.
            </h2>
            
            <div className="flex flex-wrap gap-8 items-center">
              <button 
                onClick={() => goToSection('prenota')}
                className="h-[72px] px-16 bg-[color:var(--bianco-calce)] text-[color:var(--biscotto-scuro)] font-eyebrow text-[12px] tracking-[0.4em] hover:bg-[color:var(--oro-su-scuro)] transition-colors"
              >
                PRENOTA UN TAVOLO
              </button>
              <a 
                href={`https://wa.me/393351234567?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[72px] px-12 border border-[color:var(--oro-su-scuro)] flex items-center text-[12px] font-eyebrow tracking-[0.4em] hover:bg-[color:var(--oro-su-scuro)]/10 transition-colors"
              >
                SCRIVI SU WHATSAPP
              </a>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-12 md:text-right">
            <div>
              <span className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro-su-scuro)] block mb-4">TELEFONO</span>
              <a href={`tel:${phone}`} className="font-display text-[32px] md:text-[42px] hover:text-[color:var(--oro-su-scuro)] transition-colors">
                {phone}
              </a>
            </div>
            <div>
              <span className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro-su-scuro)] block mb-4">SOCIAL</span>
              <div className="flex gap-6 md:justify-end">
                <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Instagram</a>
                <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AgriturismoFooterNuovo() {
  const routes = ANIME.filter(a => a.id !== 'agriturismo');

  return (
    <section id="footer-nuovo" className="py-32 md:py-48 bg-[color:var(--bianco-calce)] text-[color:var(--carbone)]">
      <div className="mx-auto w-full max-w-[1200px] px-5 md:px-12">
        <div className="max-w-[800px] mb-24 md:mb-32">
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
              className="group p-10 border border-[color:var(--carbone)]/5 hover:bg-[color:var(--bianco-latte)] transition-colors flex flex-col justify-between min-h-[250px]"
            >
              <span className="font-eyebrow text-[10px] tracking-[0.4em] opacity-40 italic uppercase">
                {r.id === 'allevamento' ? 'I · ALLEVAMENTO' : r.id === 'caseificio' ? 'II · CASEIFICIO' : 'III · MACELLERIA'}
              </span>
              <div className="flex items-end justify-between">
                <span className="font-display text-[32px] md:text-[38px] group-hover:text-[color:var(--oro-antico-testo)] transition-colors">
                  {r.nome}
                </span>
                <span className="font-display text-[38px] opacity-10 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
