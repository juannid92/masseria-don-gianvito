import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { AgriturismoRegiaSVG } from "./AgriturismoRegiaSVG";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AgriturismoHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentChapter, setCurrentChapter] = useState(1);
  const isReduced = useReducedMotion();

  const chapters = [
    { id: 1, label: "01 STRADA", title: "La sera comincia\ndalla campagna.", desc: "Fuori Noci, la strada rallenta.", pos: "top-right" },
    { id: 2, label: "02 MASSERIA", title: "La campagna\nresta intorno.", desc: "NOCI · PUGLIA", pos: "bottom-left" },
    { id: 3, label: "03 ARCO", title: "Si entra\nin una storia\nche era già qui.", desc: "Una masseria del Cinquecento nelle campagne di Noci.", pos: "bottom-right" },
    { id: 4, label: "04 CORTILE", title: "Il cortile si accende.\nLa tavola aspetta.", desc: "", pos: "top-center" },
    { id: 5, label: "05 TAVOLA", title: "La Masseria\narriva a tavola.", desc: "Poi ci si siede.\nQuello che c’è segue il lavoro dei campi, del caseificio, del banco e della cucina.", pos: "split-tavola" },
  ];

  useEffect(() => {
    if (isReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 95%",
          end: "bottom bottom",
          scrub: 0.85,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.18) setCurrentChapter(1);
            else if (p < 0.38) setCurrentChapter(2);
            else if (p < 0.58) setCurrentChapter(3);
            else if (p < 0.78) setCurrentChapter(4);
            else setCurrentChapter(5);
          },
        },
      });

      // Target SVG elements
      const group = "#masseria-camera-group";
      const arch = "[data-svg-arch]";
      const road = "[data-svg-road-to-table]";
      const courtyard = "[data-svg-courtyard]";
      const table = "[data-svg-table]";
      const foreground = "[data-svg-foreground]";
      const lights = "[data-svg-lights] circle";

      // CHAPTER 1 -> 2 (0 - 18 - 38%)
      // L'avvicinamento: zoom sul gruppo masseria
      tl.to(group, { scale: 2.5, y: 100, x: 0, duration: 2 }, 0)
        .to(foreground, { y: 200, opacity: 0, duration: 1.5 }, 0)
        .to(road, { attr: { d: "M800 600 L -400 1200 M 800 600 L 2000 1200" }, strokeWidth: 8, duration: 2 }, 0);

      // CHAPTER 2 -> 3 (38 - 58%)
      // L'attraversamento dell'arco
      tl.to(group, { scale: 8, y: 600, duration: 2 }, 1.5)
        .to(arch, { opacity: 0, duration: 0.5 }, 2.5)
        .to(courtyard, { opacity: 1, duration: 1 }, 2.5);

      // CHAPTER 4 (58 - 78%)
      // Il cortile si accende
      tl.to(lights, { 
        fill: "#ffcf00", 
        r: 6, 
        stagger: 0.2, 
        duration: 1,
        ease: "back.out(2)" 
      }, 3.5);

      // CHAPTER 5 (78 - 90%)
      // Match cut: Strada -> Tavola
      tl.to(courtyard, { opacity: 0, duration: 1 }, 4.5)
        .to(table, { opacity: 1, duration: 1 }, 4.5)
        .to(road, { 
          attr: { d: "M100 200 H 1500 M 100 900 H 1500" }, 
          strokeWidth: 2, 
          duration: 1.5,
          ease: "power2.inOut"
        }, 4.5);

    }, containerRef);

    return () => ctx.revert();
  }, [isReduced]);

  if (isReduced) {
    return (
      <section className="min-h-[100dvh] bg-[color:var(--bianco-calce)] flex items-center justify-center p-12">
        <div className="max-w-[800px] text-center">
          <p className="font-eyebrow text-[12px] tracking-[0.4em] text-[color:var(--oro-antico-testo)] mb-6">IV · AGRITURISMO</p>
          <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-[1] text-[color:var(--carbone)] mb-8">
            La sera comincia dalla campagna.
          </h1>
          <p className="text-[18px] md:text-[20px] leading-relaxed text-[color:var(--carbone)]">
            La Masseria arriva a tavola. Quello che c’è segue il lavoro dei campi, del caseificio e della cucina.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={containerRef} 
      className="relative h-[420dvh] bg-[color:var(--bianco-calce)]"
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* L'illustrazione SVG che occupa tutto lo spazio */}
        <div className="absolute inset-0 z-0">
          <AgriturismoRegiaSVG ref={svgRef} progress={0} />
        </div>

        {/* Overlay Testuali con Framer Motion */}
        <div className="relative z-10 w-full h-full pointer-events-none">
          <AnimatePresence mode="wait">
            {chapters.map((ch) => (
              currentChapter === ch.id && (
                <motion.div
                  key={ch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className={`absolute p-8 md:p-16 w-full max-w-[1200px] left-1/2 -translate-x-1/2 ${
                    ch.pos === "top-right" ? "top-0 flex flex-col items-end text-right" :
                    ch.pos === "bottom-left" ? "bottom-0 flex flex-col items-start text-left" :
                    ch.pos === "bottom-right" ? "bottom-0 flex flex-col items-end text-right" :
                    ch.pos === "top-center" ? "top-[20%] flex flex-col items-center text-center" :
                    "bottom-0 flex justify-between items-end w-full"
                  }`}
                >
                  {ch.pos === "split-tavola" ? (
                    <>
                      <div className="max-w-[300px] text-left">
                        <p className="font-display text-[24px] text-[color:var(--carbone)]">{ch.desc.split('\n')[0]}</p>
                      </div>
                      <div className="max-w-[500px] text-right">
                        <h2 className="font-display text-[clamp(2rem,6vw,4rem)] leading-[1] text-[color:var(--carbone)] mb-4">
                          {ch.title.split('\n').map((line, i) => (
                            <span key={i} className="block">{line}</span>
                          ))}
                        </h2>
                        <p className="text-[15px] md:text-[16px] leading-relaxed opacity-70">
                          {ch.desc.split('\n')[1]}
                        </p>
                        <div className="mt-4 h-1 w-24 bg-[color:var(--carminio)] ml-auto" />
                      </div>
                    </>
                  ) : (
                    <>
                      {ch.id === 1 && <p className="font-eyebrow text-[12px] tracking-[0.4em] text-[color:var(--oro-antico-testo)] mb-6">IV · AGRITURISMO</p>}
                      <h2 className={`font-display text-[clamp(2rem,6vw,4.5rem)] leading-[1] text-[color:var(--carbone)] mb-6 whitespace-pre-line`}>
                        {ch.title}
                      </h2>
                      {ch.desc && (
                        <div className={`${ch.pos === "bottom-left" ? "flex items-end gap-6" : ""}`}>
                          {ch.pos === "bottom-left" && (
                            <span className="font-eyebrow text-[10px] tracking-[0.3em] opacity-40 [writing-mode:vertical-lr] rotate-180">
                              {ch.desc.split(' · ')[0]}
                            </span>
                          )}
                          <p className="text-[17px] md:text-[19px] leading-relaxed opacity-70 max-w-[30ch]">
                            {ch.pos === "bottom-left" ? ch.desc.split(' · ')[1] : ch.desc}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )
            ))}
          </AnimatePresence>
        </div>

        {/* Indicatore Narrativo Laterale */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-6">
          {chapters.map((ch) => (
            <div key={ch.id} className="flex items-center gap-4 group">
              <span className={`font-eyebrow text-[9px] tracking-[0.2em] transition-opacity ${currentChapter === ch.id ? "opacity-100" : "opacity-20"}`}>
                {ch.label.split(' ')[0]}
              </span>
              <div className={`w-8 h-[1px] transition-all ${currentChapter === ch.id ? "w-12 bg-[color:var(--oro-antico)]" : "bg-[color:var(--carbone)]/20"}`} />
              <span className={`font-eyebrow text-[9px] tracking-[0.2em] transition-opacity ${currentChapter === ch.id ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}>
                {ch.label.split(' ')[1]}
              </span>
            </div>
          ))}
        </div>
        
        {/* Indicatore Mobile */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 md:hidden">
          <span className="font-eyebrow text-[10px] tracking-[0.4em] opacity-40">
            0{currentChapter} / 05
          </span>
        </div>
      </div>
    </section>
  );
}
