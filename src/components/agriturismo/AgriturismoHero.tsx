import { useEffect, useRef } from "react";
import { useAnimaReveals, FotoSegnaposto } from "@/components/anime/AnimaPagina";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function AgriturismoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  useAnimaReveals(containerRef);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    // Mobile check: no sticky/gsap animations on mobile per brief
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // Timeline for the 3 moments
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        }
      });

      // Moment 1: Si lascia la strada (already visible at start)
      // Moment 2: Si entra nella masseria
      tl.to([text1Ref.current], { opacity: 0, y: -20, duration: 1 }, 0.2)
        .fromTo(text2Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, 0.3)
        // Moment 3: Poi ci si siede
        .to([text2Ref.current], { opacity: 0, y: -20, duration: 1 }, 0.6)
        .fromTo(text3Ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, 0.7);

      // Light transition from biscotto-caldo to oro-sera (simulated via overlay)
      gsap.to(".hero-light-overlay", {
        opacity: 0.6,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom 80%",
          scrub: true,
        }
      });

      // Parallax photo
      gsap.to(photoRef.current, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[100dvh] md:min-h-[180dvh] bg-[color:var(--bianco-calce)] overflow-hidden"
    >
      <div className="md:sticky md:top-0 md:h-[100dvh] flex flex-col justify-center overflow-hidden">
        {/* Photography Space */}
        <div className="absolute inset-0 z-0">
          <div ref={photoRef} className="w-full h-full scale-110">
            <FotoSegnaposto 
              etichetta="LA MASSERIA NELLA LUCE DELLA SERA" 
              className="w-full h-full object-cover"
              tone="light"
            />
            {/* Sostituire con fotografia autentica prima della pubblicazione */}
          </div>
          {/* Light Overlay for transition */}
          <div className="hero-light-overlay absolute inset-0 bg-[color:var(--oro-antico)] opacity-0 mix-blend-soft-light pointer-events-none" />
          {/* Gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--bianco-calce)]/40 via-transparent to-[color:var(--bianco-calce)]/80" />
        </div>

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 md:px-12 pt-[var(--page-header-safe-offset)] pb-12">
          {/* Static Intro - Always Visible */}
          <div className="max-w-[800px] mb-12 md:mb-24">
            <p className="font-eyebrow text-[12px] tracking-[0.4em] text-[color:var(--oro-antico-testo)] mb-6">IV · AGRITURISMO</p>
            <h1 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[1] text-[color:var(--carbone)] mb-8">
              La sera <br className="hidden md:block" />
              comincia <br className="hidden md:block" />
              dalla campagna.
            </h1>
            <p className="text-[18px] md:text-[20px] leading-relaxed text-[color:var(--carbone)] max-w-[40ch]">
              Fuori Noci, la strada rallenta. La masseria compare tra i campi e la sera prende un altro ritmo.
            </p>
          </div>

          {/* Sequential Moments */}
          <div className="relative h-[200px] md:h-auto">
            {/* Moment 1 */}
            <div ref={text1Ref} className="md:absolute md:top-0 left-0 max-w-[450px]">
              <h2 className="font-display text-[24px] md:text-[32px] mb-2">Si lascia la strada.</h2>
              <p className="text-[16px] md:text-[17px] opacity-70">La campagna resta intorno e il rumore si abbassa.</p>
            </div>

            {/* Moment 2 */}
            <div ref={text2Ref} className="mt-8 md:mt-0 md:absolute md:top-0 left-0 max-w-[450px] md:opacity-0">
              <h2 className="font-display text-[24px] md:text-[32px] mb-2">Si entra nella masseria.</h2>
              <p className="text-[16px] md:text-[17px] opacity-70">Il cortile, le stanze e la tavola appartengono alla stessa storia.</p>
            </div>

            {/* Moment 3 */}
            <div ref={text3Ref} className="mt-8 md:mt-0 md:absolute md:top-0 left-0 max-w-[450px] md:opacity-0">
              <h2 className="font-display text-[24px] md:text-[32px] mb-2">Poi ci si siede.</h2>
              <p className="text-[16px] md:text-[17px] opacity-70">Quello che nasce qui arriva a tavola seguendo la disponibilità della masseria.</p>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="hidden md:flex absolute bottom-12 left-12 items-center gap-4 opacity-30">
             <div className="w-px h-12 bg-[color:var(--carbone)]" />
             <span className="font-eyebrow text-[9px] tracking-[0.3em]">SCROLL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
