import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const HERO_IMG = "/images/masseria-aerial.jpg";

export function AgriturismoStoriaNuova() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

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
    {
      n: "I",
      t: "La casa",
      d: "Le stesse mura, da cinque secoli.",
      img: HERO_IMG,
      alt: "Vista aerea della Masseria Don Gianvito",
    },
    {
      n: "II",
      t: "I campi",
      d: "La terra che dà da mangiare a tutto il resto.",
      img: "/images/masseria/allevamento-campi-coltivati-01.jpeg",
      alt: "Campi coltivati intorno alla masseria",
    },
    {
      n: "III",
      t: "Gli animali",
      d: "Allevati qui, nutriti qui.",
      img: "/images/masseria/allevamento-bovini-recinti-01.jpeg",
      alt: "Bovini allevati nei recinti della masseria",
    },
    {
      n: "IV",
      t: "Il lavoro",
      d: "Ogni giorno, prima che si apra la tavola.",
      img: "/images/masseria/allevamento-lavoro-campi-01.jpeg",
      alt: "Lavoro quotidiano nei campi della masseria",
    },
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
          src={HERO_IMG}
          alt="Veduta aerea della Masseria Don Gianvito nelle campagne di Noci"
          className="absolute inset-0 w-full h-full object-cover"
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
              <div className="aspect-[4/3] overflow-hidden mb-4 bg-[color:var(--carminio-scuro)]/40">
                <img
                  src={c.img}
                  alt={c.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <span className="font-display text-[44px] md:text-[64px] leading-none text-[color:var(--oro-su-scuro)]/80 block mb-4">
                {c.n}
              </span>
              <h3 className="font-display text-[22px] md:text-[28px] mb-2">{c.t}</h3>
              <p className="text-[15px] leading-relaxed opacity-70">{c.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 md:mt-24 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 aspect-[4/3] overflow-hidden bg-[color:var(--carminio-scuro)]/40">
            <img
              src="/images/agriturismo/agriturismo-sala-panoramica-01.jpeg"
              alt="Sala panoramica dell'agriturismo Masseria Don Gianvito"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <p className="md:col-span-7 text-[19px] md:text-[24px] leading-relaxed">
            La masseria attraversa i secoli conservando il rapporto fra casa, campi, animali e
            lavoro. Oggi l’Agriturismo è il punto in cui questa storia si apre agli ospiti.
          </p>
          <p className="md:col-span-4 md:col-start-5 font-display italic text-[22px] md:text-[28px] leading-snug text-[color:var(--oro-su-scuro)]">
            La tavola arriva dopo tutto il resto: allevamento, caseificio, macelleria e cucina.
          </p>
          <div className="md:col-span-8 aspect-[4/3] overflow-hidden bg-[color:var(--carminio-scuro)]/40">
            <img
              src="/images/agriturismo/agriturismo-convivialita-01.jpeg"
              alt="Momenti di convivialità alla tavola della masseria"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
