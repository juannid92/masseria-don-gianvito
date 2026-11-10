import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aerial from "@/assets/masseria-aerial.asset.json";

export function AgriturismoStoriaNuova() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [imgSrc, setImgSrc] = useState<string>(aerial.url);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set([photoRef.current, titleRef.current, lineRef.current], {
        opacity: 1,
        visibility: "visible",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 92%",
            once: true,
          },
        })
        .from(photoRef.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.2,
          ease: "power3.out",
        })
        .from(
          titleRef.current,
          {
            y: 16,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .from(
          lineRef.current,
          {
            scaleX: 0,
            transformOrigin: "left",
            duration: 1,
            ease: "expo.out",
          },
          "-=0.4",
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const capitoli = [
    { n: "I", t: "La casa", d: "Le stesse mura, da cinque secoli." },
    { n: "II", t: "I campi", d: "La terra che dà da mangiare a tutto il resto." },
    { n: "III", t: "Gli animali", d: "Allevati qui, nutriti qui." },
    { n: "IV", t: "Il lavoro", d: "Ogni giorno, prima che si apra la tavola." },
  ];

  return (
    <section
      ref={containerRef}
      id="storia-nuova"
      data-tone="dark"
      className="relative bg-[color:var(--carminio-scuro)] text-[color:var(--bianco-calce)] overflow-hidden"
    >
      {/* Foto a tutta larghezza con titolo sul gradiente */}
      <div ref={photoRef} className="relative h-[70svh] min-h-[460px] md:h-[85svh]">
        <img
          src={imgSrc}
          alt="Veduta della Masseria Don Gianvito nelle campagne di Noci"
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => {
            if (imgSrc !== "/images/storia-lavoro.jpg") {
              setImgSrc("/images/storia-lavoro.jpg");
            }
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[color:var(--carminio-scuro)] via-[color:var(--carminio-scuro)]/50 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto w-full max-w-[1300px] px-5 md:px-12 pb-10 md:pb-16">
            <span className="font-eyebrow text-[11px] tracking-[0.4em] text-[color:var(--oro-su-scuro)] mb-5 block">
              DAL CINQUECENTO
            </span>
            <h2
              ref={titleRef}
              className="font-display text-[clamp(2.6rem,7.5vw,7rem)] leading-[0.95] max-w-[14ch]"
            >
              La stessa casa,{" "}
              <span className="text-[color:var(--oro-su-scuro)]">la stessa terra.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Quattro capitoli */}
      <div className="mx-auto w-full max-w-[1300px] px-5 md:px-12 pt-8 pb-20 md:pb-28">
        <div ref={lineRef} className="h-px w-full bg-[color:var(--oro-su-scuro)]/60 mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {capitoli.map((c) => (
            <div key={c.n}>
              <span className="font-display text-[44px] md:text-[64px] leading-none text-[color:var(--oro-su-scuro)]/80 block mb-4">
                {c.n}
              </span>
              <h3 className="font-display text-[22px] md:text-[28px] mb-2">{c.t}</h3>
              <p className="text-[15px] leading-relaxed opacity-70">{c.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 grid md:grid-cols-12 gap-8 items-start">
          <p className="md:col-span-7 text-[19px] md:text-[24px] leading-relaxed">
            La masseria attraversa i secoli conservando il rapporto fra casa, campi, animali e
            lavoro. Oggi l’Agriturismo è il punto in cui questa storia si apre agli ospiti.
          </p>
          <p className="md:col-span-4 md:col-start-9 font-display italic text-[22px] md:text-[28px] leading-snug text-[color:var(--oro-su-scuro)]">
            La tavola arriva dopo tutto il resto: allevamento, caseificio, macelleria e cucina.
          </p>
        </div>
      </div>
    </section>
  );
}
