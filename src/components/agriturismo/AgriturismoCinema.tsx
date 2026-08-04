import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function AgriturismoCinema() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const scenes = [
    {
      id: "strada",
      img: "/images/agriturismo-cinema-01-strada.webp",
      title: "IV · AGRITURISMO",
      headline: "La sera comincia\ndalla campagna.",
      desc: "Fuori Noci, la strada rallenta.",
      pos: "top-right",
    },
    {
      id: "facciata",
      img: "/images/agriturismo-cinema-02-facciata.webp",
      headline: "Si arriva\nquando la luce\nsta cambiando.",
      desc: "La Masseria resta circondata dai campi.",
      pos: "bottom-left",
    },
    {
      id: "cortile",
      img: "/images/agriturismo-cinema-03-cortile.webp",
      headline: "Dentro il cortile\nla sera prende\nun altro ritmo.",
      desc: "Una storia che attraversa i secoli e continua ad accogliere.",
      pos: "bottom-right",
    },
    {
      id: "tavola",
      img: "/images/agriturismo-cinema-04-tavola.webp",
      headline: "Poi ci si siede.\nLa Masseria\narriva a tavola.",
      desc: "Campi, allevamento, caseificio, banco e cucina appartengono allo stesso luogo.",
      pos: "center-left",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
        },
      });

      // Labels
      tl.addLabel("strada", 0);
      tl.addLabel("facciata", 0.24);
      tl.addLabel("cortile", 0.49);
      tl.addLabel("tavola", 0.74);
      tl.addLabel("handoff", 0.92);

      // Initial state
      gsap.set(".cinema-scene", { opacity: 0, scale: 1 });
      gsap.set(".cinema-scene-1", { opacity: 1 });
      gsap.set(".cinema-text", { opacity: 0, y: 30 });
      gsap.set(".cinema-text-1", { opacity: 1, y: 0 });

      // Scene 1 -> 2
      tl.to(".cinema-scene-1", { 
        opacity: 0, 
        scale: 1.05, 
        x: "-2%", 
        clipPath: "inset(0 0 0 100%)",
        duration: 0.3 
      }, "strada+=0.15");
      tl.to(".cinema-text-1", { opacity: 0, y: -20, duration: 0.2 }, "strada+=0.1");
      
      tl.to(".cinema-scene-2", { opacity: 1, scale: 1.04, duration: 0.3 }, "strada+=0.2");
      tl.to(".cinema-text-2", { opacity: 1, y: 0, duration: 0.2 }, "facciata-=0.05");

      // Scene 2 -> 3
      tl.to(".cinema-scene-2", { 
        opacity: 0, 
        scale: 1.08, 
        x: "2%", 
        clipPath: "inset(100% 0 0 0)",
        duration: 0.3 
      }, "facciata+=0.2");
      tl.to(".cinema-text-2", { opacity: 0, y: -20, duration: 0.2 }, "facciata+=0.15");

      tl.to(".cinema-scene-3", { opacity: 1, scale: 1.04, duration: 0.3 }, "facciata+=0.25");
      tl.to(".cinema-text-3", { opacity: 1, y: 0, duration: 0.2 }, "cortile-=0.05");

      // Scene 3 -> 4
      tl.to(".cinema-scene-3", { 
        opacity: 0, 
        scale: 1.08, 
        clipPath: "inset(0 100% 0 0)",
        duration: 0.3 
      }, "cortile+=0.2");
      tl.to(".cinema-text-3", { opacity: 0, y: -20, duration: 0.2 }, "cortile+=0.15");

      tl.to(".cinema-scene-4", { opacity: 1, scale: 1.04, duration: 0.3 }, "cortile+=0.25");
      tl.to(".cinema-text-4", { opacity: 1, y: 0, duration: 0.2 }, "tavola-=0.05");

      // Handoff zoom
      tl.to(".cinema-scene-4", { scale: 1.08, duration: 0.2 }, "handoff");

      // Indicator animation
      scenes.forEach((_, i) => {
        tl.to(`.nav-dot-${i+1}`, { backgroundColor: "var(--oro-antico)", width: "48px", duration: 0.1 }, `scene-${i+1}`);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[360dvh] bg-[color:var(--bianco-calce)]">
      <div ref={stickyRef} className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {scenes.map((scene, i) => (
          <div 
            key={scene.id} 
            className={`cinema-scene cinema-scene-${i+1} absolute inset-0 w-full h-full will-change-transform`}
            style={{ zIndex: scenes.length - i }}
          >
            <img 
              src={scene.img} 
              alt={scene.id}
              className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
            />
            {/* Scrim locale */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
          </div>
        ))}

        {/* Text Overlays */}
        <div className="relative z-50 w-full h-full pointer-events-none">
          {scenes.map((scene, i) => (
            <div 
              key={`text-${scene.id}`}
              className={`cinema-text cinema-text-${i+1} absolute inset-0 p-8 md:p-20 flex flex-col ${
                scene.pos === "top-right" ? "items-end text-right justify-start" :
                scene.pos === "bottom-left" ? "items-start text-left justify-end" :
                scene.pos === "bottom-right" ? "items-end text-right justify-end" :
                "items-start text-left justify-center"
              }`}
            >
              <div className="max-w-[700px]">
                {scene.title && (
                  <p className="font-eyebrow text-[12px] tracking-[0.4em] text-[color:var(--oro-antico)] mb-6">
                    {scene.title}
                  </p>
                )}
                <h2 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.95] text-[color:var(--bianco-calce)] mb-8 whitespace-pre-line drop-shadow-sm">
                  {scene.headline}
                </h2>
                <div className="flex items-start gap-4">
                  {scene.pos === "bottom-left" && (
                    <div className="w-px h-12 bg-[color:var(--oro-antico)] mt-2" />
                  )}
                  <p className="text-[18px] md:text-[22px] leading-relaxed text-[color:var(--bianco-calce)]/90 max-w-[40ch]">
                    {scene.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigatore Narrativo (Controlled by GSAP) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[60] hidden md:flex flex-col gap-8">
          {scenes.map((scene, i) => (
            <div key={`nav-${i}`} className="flex items-center gap-4 group">
              <span className="font-eyebrow text-[10px] tracking-[0.2em] text-[color:var(--bianco-calce)]/40 uppercase">
                0{i+1}
              </span>
              <div className={`nav-dot-${i+1} w-8 h-[1px] bg-[color:var(--bianco-calce)]/20 transition-all`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
