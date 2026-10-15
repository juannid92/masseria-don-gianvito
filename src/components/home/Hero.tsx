import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aerial from "@/assets/masseria-aerial.asset.json";
import { PIN_ANIME } from "@/data/pin-anime";

/** Full-bleed photograph, overlaid title and direct links: no separate map/card. */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState(aerial.url);
  const [missing, setMissing] = useState(false);

  const failImage = () => {
    if (source === aerial.url) setSource("/images/masseria-aerial.jpg");
    else setMissing(true);
  };

  useEffect(() => {
    // The original request may fail before React hydrates the page.
    if (image.current?.complete && !image.current.naturalWidth) {
      if (source === aerial.url) setSource("/images/masseria-aerial.jpg");
      else setMissing(true);
    }
  }, [source]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        // Enhanced title reveal with stagger and character animation
        const titleChars = titleRef.current?.querySelectorAll("h1 span, h1 br");
        if (titleChars && titleChars.length > 0) {
          gsap.from(titleChars, {
            opacity: 0,
            y: 40,
            rotateX: -90,
            stagger: 0.08,
            duration: 1,
            ease: "power3.out",
          });
        } else {
          gsap.from(".fullscreen-hero-title > *", {
            opacity: 0,
            y: 30,
            stagger: 0.12,
            duration: 0.9,
            ease: "power3.out",
          });
        }

        // Enhanced parallax for the hero image with depth layers
        gsap.to(".fullscreen-hero-plane", {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Parallax for overlay gradient - moves at different speed
        if (overlayRef.current) {
          gsap.to(overlayRef.current, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }

        // Floating animation for pins
        gsap.utils.toArray<HTMLElement>(".fullscreen-hero-pin").forEach((pin, i) => {
          gsap.to(pin, {
            y: -6,
            duration: 2 + i * 0.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
          });
        });

        // Hero entrance: overlay fade in
        gsap.from(".fullscreen-hero-shade", {
          opacity: 0,
          duration: 1.5,
          delay: 0.3,
          ease: "power2.out",
        });
      }, root);
      return () => context.revert();
    });

    media.add("(prefers-reduced-motion: reduce)", () => {
      // Static version for reduced motion
      gsap.set(".fullscreen-hero-title > *", { opacity: 1, y: 0 });
      gsap.set(".fullscreen-hero-shade", { opacity: 1 });
    });

    return () => media.revert();
  }, []);

  // Mouse parallax effect for the hero
  useEffect(() => {
    const rootEl = root.current;
    if (!rootEl) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 20;
      targetY = (e.clientY / window.innerHeight - 0.5) * 20;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const plane = rootEl.querySelector(".fullscreen-hero-plane") as HTMLElement;
      if (plane) {
        plane.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="mappa"
      ref={root}
      className="fullscreen-hero"
      data-tone="dark"
      aria-label="Esplora la Masseria Don Gianvito"
    >
      <div className="fullscreen-hero-plane">
        {!missing && (
          <img
            key={source}
            ref={image}
            className="fullscreen-hero-photo"
            src={source}
            alt="Vista dall’alto della Masseria Don Gianvito"
            fetchPriority="high"
            decoding="async"
            onError={failImage}
          />
        )}
        <div className="fullscreen-hero-shade" aria-hidden="true" />
        <nav className="fullscreen-hero-pins" aria-label="Esplora le quattro anime della masseria">
          {PIN_ANIME.map((pin) => (
            <Link
              key={pin.id}
              to={pin.to}
              className="fullscreen-hero-pin"
              aria-label={`Entra nel capitolo ${pin.nome}`}
              style={
                {
                  "--pin-x": `${pin.d.x}%`,
                  "--pin-y": `${pin.d.y}%`,
                  "--pin-x-mobile": `${pin.m.x}%`,
                  "--pin-y-mobile": `${pin.m.y}%`,
                } as CSSProperties
              }
            >
              <span className="fullscreen-hero-pin-dot">{pin.numero}</span>
              <span className="fullscreen-hero-pin-label">
                {pin.nome}
                <span aria-hidden="true"> ↗</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="fullscreen-hero-title">
        <p className="fullscreen-hero-kicker">Masseria Don Gianvito · Noci, Puglia</p>
        <h1>
          Un luogo.
          <br />
          <em>Quattro anime.</em>
        </h1>
        <p className="fullscreen-hero-intro">
          Dalla terra alla tavola.
          <br />
          Entra nei luoghi della masseria.
        </p>
      </div>

      <div className="fullscreen-hero-bottom">
        <p>Un’unica masseria. Quattro storie da attraversare.</p>
        <Link to="/" hash="manifesto" className="fullscreen-hero-scroll">
          Scopri la masseria <span aria-hidden="true">↓</span>
        </Link>
      </div>
      {missing && (
        <p className="fullscreen-hero-asset-note" role="status">
          Fotografia aerea originale da ricollegare in Lovable.
        </p>
      )}
    </section>
  );
}
