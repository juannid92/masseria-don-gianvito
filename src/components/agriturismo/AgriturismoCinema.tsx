import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const scenes = [
  {
    id: "strada",
    img: "/images/agriturismo-cinema-01-strada.webp",
    eyebrow: "IV · AGRITURISMO",
    headline: "La sera comincia\ndalla campagna.",
    desc: "Fuori Noci, la strada rallenta.",
    pos: "top-right",
    align: "text-right items-end justify-start",
  },
  {
    id: "facciata",
    img: "/images/agriturismo-cinema-02-facciata.webp",
    eyebrow: "",
    headline: "Si arriva quando\nla luce sta\ncambiando.",
    desc: "",
    verticalNote: "NOCI · PUGLIA",
    pos: "bottom-left",
    align: "text-left items-start justify-end",
  },
  {
    id: "cortile",
    img: "/images/agriturismo-cinema-03-cortile.webp",
    eyebrow: "",
    headline: "Dentro il cortile\nla sera prende\nun altro ritmo.",
    desc: "Una masseria del Cinquecento che continua ad accogliere.",
    pos: "bottom-right",
    align: "text-right items-end justify-end",
  },
  {
    id: "tavola",
    img: "/images/agriturismo-cinema-04-tavola.webp",
    eyebrow: "",
    headline: "Poi ci si siede.\nLa Masseria\narriva a tavola.",
    desc: "",
    pos: "center-left",
    align: "text-left items-start justify-center",
  },
];

export function AgriturismoCinema() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          end: "bottom bottom",
          scrub: 0.9,
        },
      });

      // Labels
      tl.addLabel("strada", 0);
      tl.addLabel("facciata", 0.24);
      tl.addLabel("cortile", 0.50);
      tl.addLabel("tavola", 0.74);
      tl.addLabel("handoff", 0.92);

      // Initial state set only after GSAP context starts
      gsap.set(".cinema-scene", { opacity: 0, scale: 1, x: 0 });
      gsap.set(".cinema-scene-1", { opacity: 1, clipPath: "inset(0 0 0 0)" });
      gsap.set(".cinema-scene-2", { clipPath: "inset(0 0 0 100%)" });
      gsap.set(".cinema-scene-3", { clipPath: "circle(0% at 50% 50%)" });
      gsap.set(".cinema-scene-4", { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" });
      
      gsap.set(".cinema-text", { opacity: 0, y: 16 });
      gsap.set(".cinema-text-1", { opacity: 1, y: 0 });
      gsap.set(".cinema-mask", { attr: { "clip-path": "inset(0 0 0 0)" } });
      gsap.set(".cinema-light", { opacity: 0 });
      gsap.set(".gold-line", { strokeDashoffset: 1600 });
      gsap.set(".letterbox", { y: 0 });

      // SCENE 1: Strada (starts visible)
      tl.to(".cinema-scene-1 img", { scale: 1.06, x: "1.5%", duration: 0.3 }, "strada");
      tl.to(".cinema-light-1", { opacity: 0.35, duration: 0.15 }, "strada");
      tl.to(".gold-line", { strokeDashoffset: 1200, duration: 0.24 }, "strada");
      
      // SCENE 2: Facciata (Reveal 1->2)
      tl.to(".cinema-scene-1", { opacity: 0.5, duration: 0.24 }, "facciata-=0.1");
      tl.to(".cinema-scene-2", { opacity: 1, duration: 0.24 }, "facciata-=0.2");
      tl.to(".cinema-scene-2", 
        { clipPath: "inset(0 0 0 0%)", duration: 0.24 }, 
        "facciata-=0.2"
      );
      tl.to(".cinema-text-1", { opacity: 0, y: -20, duration: 0.1 }, "facciata-=0.15");
      tl.to(".cinema-text-2", { opacity: 1, y: 0, duration: 0.15 }, "facciata");
      tl.to(".cinema-scene-2 img", { scale: 1.06, x: "-1.5%", duration: 0.3 }, "facciata");
      tl.to(".cinema-light-2", { opacity: 0.35, duration: 0.15 }, "facciata");
      tl.to(".gold-line", { strokeDashoffset: 800, duration: 0.26 }, "facciata");

      // SCENE 3: Cortile (Reveal 2->3)
      tl.to(".cinema-scene-2", { opacity: 0.5, duration: 0.24 }, "cortile-=0.1");
      tl.to(".cinema-scene-3", { opacity: 1, duration: 0.24 }, "cortile-=0.2");
      tl.to(".cinema-scene-3", 
        { clipPath: "circle(75% at 50% 50%)", duration: 0.24 }, 
        "cortile-=0.2"
      );
      tl.to(".cinema-text-2", { opacity: 0, y: -20, duration: 0.1 }, "cortile-=0.15");
      tl.to(".cinema-text-3", { opacity: 1, y: 0, duration: 0.15 }, "cortile");
      tl.to(".cinema-scene-3 img", { scale: 1.06, x: "1.5%", duration: 0.3 }, "cortile");
      tl.to(".cinema-light-3", { opacity: 0.35, duration: 0.15 }, "cortile");
      tl.to(".gold-line", { strokeDashoffset: 400, duration: 0.24 }, "cortile");

      // SCENE 4: Tavola (Reveal 3->4)
      tl.to(".cinema-scene-3", { opacity: 0.5, duration: 0.24 }, "tavola-=0.1");
      tl.to(".cinema-scene-4", { opacity: 1, duration: 0.24 }, "tavola-=0.2");
      tl.to(".cinema-scene-4", 
        { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 0.24 }, 
        "tavola-=0.2"
      );
      tl.to(".cinema-text-3", { opacity: 0, y: -20, duration: 0.1 }, "tavola-=0.15");
      tl.to(".cinema-text-4", { opacity: 1, y: 0, duration: 0.15 }, "tavola");
      tl.to(".cinema-scene-4 img", { scale: 1.06, x: "-1.5%", duration: 0.3 }, "tavola");
      tl.to(".cinema-light-4", { opacity: 0.35, duration: 0.15 }, "tavola");
      tl.to(".gold-line", { strokeDashoffset: 0, duration: 0.18 }, "tavola");

      // Exit / Handoff
      tl.to(".letterbox-top", { y: -20, duration: 0.08 }, "handoff");
      tl.to(".letterbox-bottom", { y: 20, duration: 0.08 }, "handoff");
      tl.to(".cinema-scene-4", { scale: 1.02, duration: 0.08 }, "handoff");
      tl.to(".cinema-light-4", { opacity: 0, duration: 0.08 }, "handoff");
      tl.to(stickyRef.current, { backgroundColor: "var(--bianco-calce)", duration: 0.08 }, "handoff");

      // Indicator logic
      scenes.forEach((_, i) => {
        const startLabel = i === 0 ? "strada" : i === 1 ? "facciata" : i === 2 ? "cortile" : "tavola";
        tl.to(`.nav-line-${i+1}`, { scaleX: 1, duration: 0.1 }, startLabel);
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="agriturismo-cinema" className="relative h-[360dvh] bg-[color:var(--carbone)]">
      <div ref={stickyRef} className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-black">
        
        {/* Cinematic Scenes Layer */}
        <div className="absolute inset-0 z-0">
          {scenes.map((scene, i) => (
            <div 
              key={scene.id} 
              className={`cinema-scene cinema-scene-${i+1} absolute inset-0 w-full h-full will-change-transform`}
              style={{ 
                zIndex: i + 1,
                // No default clipPath here, set it in GSAP to avoid flashes or JS-disable invisibility
              }}
            >
              <img 
                src={scene.img} 
                alt={scene.id}
                className="w-full h-full object-cover grayscale-[0.1] contrast-[1.05]"
              />
            </div>
          ))}
        </div>

        {/* SVG Regia Layer */}
        <svg 
          ref={svgRef}
          viewBox="0 0 1600 900" 
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          <defs>
            {/* Grain */}
            <filter id="cinema-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.10 0" />
            </filter>
            
            {/* Cinematic Lights */}
            <radialGradient id="gold-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--oro-antico)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--oro-antico)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grain Overlay */}
          <rect width="100%" height="100%" filter="url(#cinema-grain)" className="opacity-100" />

          {/* Volumetric Lights */}
          <rect width="100%" height="100%" fill="url(#gold-glow)" className="cinema-light cinema-light-1" opacity="0" />
          <rect width="100%" height="100%" fill="url(#gold-glow)" className="cinema-light cinema-light-2" opacity="0" />
          <rect width="100%" height="100%" fill="url(#gold-glow)" className="cinema-light cinema-light-3" opacity="0" />
          <rect width="100%" height="100%" fill="url(#gold-glow)" className="cinema-light cinema-light-4" opacity="0" />

          {/* The Gold Thread */}
          <path 
            className="gold-line"
            d="M 1600,200 C 1400,200 1200,600 800,600 C 400,600 200,800 100,800"
            fill="none" 
            stroke="var(--oro-antico)" 
            strokeWidth="2"
            strokeDasharray="1600"
            strokeDashoffset="1600"
          />

          {/* Letterbox Bands */}
          <rect className="letterbox letterbox-top" width="1600" height="40" fill="black" y="0" />
          <rect className="letterbox letterbox-bottom" width="1600" height="40" fill="black" y="860" />
          
          {/* Vignette */}
          <rect width="1600" height="900" fill="url(#gold-glow)" opacity="0.1" style={{ mixBlendMode: 'multiply' }} />
        </svg>

        {/* Text Overlays Layer */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {scenes.map((scene, i) => (
            <div 
              key={`text-${scene.id}`}
              className={`cinema-text cinema-text-${i+1} absolute inset-0 p-8 md:p-24 flex flex-col ${scene.align}`}
            >
              <div className="max-w-[700px] relative">
                {/* Scrim locale sfumato */}
                <div className="absolute inset-[-40px] bg-black/20 blur-2xl rounded-full z-[-1] opacity-60" />
                
                {scene.eyebrow && (
                  <p className="font-eyebrow text-[12px] tracking-[0.4em] text-[color:var(--oro-su-scuro)] mb-6">
                    {scene.eyebrow}
                  </p>
                )}
                <h2 className="font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.92] text-[color:var(--bianco-calce)] mb-8 whitespace-pre-line">
                  {scene.headline}
                </h2>
                {scene.desc && (
                  <p className="text-[17px] md:text-[20px] leading-relaxed text-[color:var(--bianco-calce)]/85 max-w-[36ch]">
                    {scene.desc}
                  </p>
                )}
                {scene.verticalNote && (
                  <div className="absolute left-[-60px] top-1/2 -rotate-90 origin-center hidden md:block">
                    <span className="font-eyebrow text-[10px] tracking-[0.4em] text-[color:var(--oro-su-scuro)] whitespace-nowrap">
                      {scene.verticalNote}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Narrative Indicator */}
        <div className="absolute left-8 md:left-12 bottom-12 md:bottom-20 z-30 flex flex-col gap-6">
          {scenes.map((_, i) => (
            <div key={`nav-${i}`} className="flex items-center gap-4">
              <span className="font-eyebrow text-[11px] text-[color:var(--bianco-calce)]/40">
                0{i+1}
              </span>
              <div className={`nav-line-${i+1} w-6 md:w-10 h-[1px] bg-[color:var(--oro-antico)] scale-x-0 origin-left transition-transform`} />
            </div>
          ))}
          <div className="md:hidden text-[color:var(--bianco-calce)]/40 font-eyebrow text-[10px]">
            01/04
          </div>
        </div>

      </div>
    </section>
  );
}
