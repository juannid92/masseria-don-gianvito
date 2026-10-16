import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MASSERIA } from "@/data/masseria";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PrenotazioneForm } from "@/components/PrenotazioneForm";

/**
 * ATTO 07 — PRENOTA. Chiusura della Home.
 *
 * Regia: LA QUIETE. Nessuna tecnica dei sei atti precedenti.
 * - 2 soli trigger locali a soglia (nessun pin, nessuno scrub):
 *   1) comparsa dei blocchi dall'alto verso il basso con stagger;
 *   2) filo d'oro sotto il titolo che si distende (scaleX 0 → 1).
 * - Solo opacita' e traslazioni brevi (18px).
 * - Reduced motion: nessun trigger, tutto visibile e statico.
 *
 * Colore: fondo biscotto-scuro (stesso del footer → gap 0px e nessuno
 * stacco cromatico), testi bianco calce, un solo testo oro (il display),
 * occhielli bianco calce 70%, fili e bordi oro. Zero carminio, zero oliva.
 */

const APERTURA = [
  "Lunedì e martedì chiuso",
  "Da mercoledì a sabato, a cena",
  "Domenica e giorni festivi, a pranzo",
] as const;

export function Prenota() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement | null>(null);
  const [mappaAttiva, setMappaAttiva] = useState(false);
  const [formAperto, setFormAperto] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const blocchi = gsap.utils.toArray<HTMLElement>("[data-prenota-block]", root);
      if (blocchi.length) {
        gsap.fromTo(
          blocchi,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            stagger: 0.09,
            scrollTrigger: { trigger: root, start: "top 82%", once: true },
          },
        );
      }

      const filo = root.querySelector<HTMLElement>("[data-filo-oro]");
      if (filo) {
        gsap.fromTo(
          filo,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power2.inOut",
            scrollTrigger: { trigger: filo, start: "top 88%", once: true },
          },
        );
      }

      // Enhanced: Phone links with hover glow effect
      const phoneLinks = root.querySelectorAll<HTMLElement>("a[href^='tel']");
      phoneLinks.forEach((link) => {
        const glow = document.createElement("span");
        glow.className = "phone-glow";
        Object.assign(glow.style, {
          position: "absolute",
          inset: "-4px -12px",
          borderRadius: "4px",
          background: "var(--oro-antico)",
          opacity: "0",
          filter: "blur(12px)",
          pointerEvents: "none",
          transition: "opacity 0.3s ease",
          zIndex: "-1",
        });
        link.style.position = "relative";
        link.appendChild(glow);

        link.addEventListener("mouseenter", () => {
          gsap.to(glow, { opacity: 0.4, duration: 0.3 });
          gsap.to(link, { x: 4, duration: 0.3, ease: "power2.out" });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(glow, { opacity: 0, duration: 0.3 });
          gsap.to(link, { x: 0, duration: 0.3, ease: "power2.out" });
        });
      });

      // Enhanced: CTA buttons with magnetic effect
      const ctaButtons = root.querySelectorAll<HTMLElement>("button, a.inline-flex");
      ctaButtons.forEach((btn) => {
        let pos = { x: 0, y: 0 };
        let target = { x: 0, y: 0 };
        let rafId: number;

        const onMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          target = {
            x: (e.clientX - centerX) * 0.2,
            y: (e.clientY - centerY) * 0.2,
          };
        };

        const animate = () => {
          pos.x += (target.x - pos.x) * 0.1;
          pos.y += (target.y - pos.y) * 0.1;
          btn.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
          rafId = requestAnimationFrame(animate);
        };

        const onLeave = () => {
          target = { x: 0, y: 0 };
        };

        btn.addEventListener("mouseenter", () => {
          window.addEventListener("mousemove", onMove);
          rafId = requestAnimationFrame(animate);
        });
        btn.addEventListener("mouseleave", () => {
          window.removeEventListener("mousemove", onMove);
          cancelAnimationFrame(rafId);
          gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
        });
      });

      // Enhanced: List items with stagger reveal on scroll
      const listItems = root.querySelectorAll<HTMLElement>("li");
      listItems.forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          x: -20,
          duration: 0.4,
          delay: i * 0.05,
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            once: true,
          },
        });

        // Hover effect for list items
        item.addEventListener("mouseenter", () => {
          gsap.to(item, { x: 8, duration: 0.3, ease: "power2.out" });
        });
        item.addEventListener("mouseleave", () => {
          gsap.to(item, { x: 0, duration: 0.3, ease: "power2.out" });
        });
      });

      // Enhanced: Links with underline animation
      const underlineLinks = root.querySelectorAll<HTMLElement>("a:not([href^='tel'])");
      underlineLinks.forEach((link) => {
        const line = document.createElement("span");
        line.className = "link-underline";
        Object.assign(line.style, {
          position: "absolute",
          bottom: "-2px",
          left: "0",
          width: "100%",
          height: "1px",
          backgroundColor: "var(--oro-antico)",
          transformOrigin: "left center",
          transform: "scaleX(0)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        });
        link.style.position = "relative";
        link.appendChild(line);

        link.addEventListener("mouseenter", () => {
          line.style.transform = "scaleX(1)";
        });
        link.addEventListener("mouseleave", () => {
          line.style.transformOrigin = "right center";
          line.style.transform = "scaleX(0)";
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  const visibile = reduced ? undefined : { opacity: 0 };

  return (
    <section
      id="prenota"
      ref={rootRef}
      data-tone="dark"
      aria-labelledby="prenota-titolo"
      className="relative bg-[color:var(--biscotto-scuro)] text-[color:var(--bianco-calce)]"
    >
      <div aria-hidden className="hairline-oro" />

      <div className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        {/* 1 — Titolo e occhiello */}
        <div data-prenota-block style={visibile} className="max-w-3xl">
          <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70 md:text-[11px]">
            07 — PRENOTA
          </p>
          <h2
            id="prenota-titolo"
            className="mt-6 font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.95] text-[color:var(--oro-su-scuro)]"
          >
            Prenota
            <br />
            il tuo
            <br />
            tavolo.
          </h2>
        </div>

        <div
          data-filo-oro
          aria-hidden
          className="mt-8 h-px w-full origin-left bg-[color:var(--oro-antico)]/70"
        />

        <div className="mt-14 grid gap-14 md:mt-20 md:grid-cols-2 md:gap-x-16 md:gap-y-20">
          {/* 2 — Quando siamo aperti */}
          <div data-prenota-block style={visibile}>
            <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70">
              Quando siamo aperti
            </p>
            <ul className="mt-6 space-y-3 border-t border-[color:var(--oro-antico)]/35 pt-6">
              {APERTURA.map((riga) => (
                <li
                  key={riga}
                  className="border-b border-[color:var(--bianco-calce)]/10 pb-3 text-[17px] leading-relaxed text-[color:var(--bianco-calce)] md:text-[19px]"
                >
                  {riga}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[15px] leading-relaxed text-[color:var(--bianco-calce)]/75">
              Consigliata la prenotazione. I giorni possono variare: contattare la masseria per
              conferma.
            </p>
          </div>

          {/* 3 — Come si prenota */}
          <div data-prenota-block style={visibile}>
            <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70">
              Come si prenota
            </p>
            <div className="mt-6 border-t border-[color:var(--oro-antico)]/35 pt-6">
              <ul className="space-y-2">
                <li>
                  <a
                    href={MASSERIA.telefonoHref}
                    className="inline-flex min-h-[44px] items-center font-display text-[clamp(1.5rem,3.4vw,2rem)] leading-tight text-[color:var(--bianco-calce)] tabular-nums transition-colors hover:text-[color:var(--bianco-calce)]"
                  >
                    +39 333 939 5750
                  </a>
                </li>
                <li>
                  <a
                    href={MASSERIA.telefono2Href}
                    className="inline-flex min-h-[44px] items-center font-display text-[clamp(1.5rem,3.4vw,2rem)] leading-tight text-[color:var(--bianco-calce)] tabular-nums transition-colors hover:text-[color:var(--bianco-calce)]"
                  >
                    +39 333 387 0292
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setFormAperto(!formAperto)}
                    className="inline-flex min-h-[44px] items-center text-[16px] text-[color:var(--bianco-calce)]/80 underline decoration-[color:var(--oro-antico)] underline-offset-4 transition-colors hover:text-[color:var(--bianco-calce)]"
                    aria-expanded={formAperto}
                  >
                    {formAperto
                      ? "Chiudi il form di prenotazione"
                      : "WhatsApp, con il messaggio già pronto"}
                  </button>
                </li>
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setFormAperto(!formAperto)}
                  className="inline-flex min-h-[52px] w-full items-center justify-center bg-[color:var(--oro-antico)] px-7 font-eyebrow text-[11px] tracking-[0.26em] text-[color:var(--carbone)] transition-opacity hover:opacity-90 sm:w-auto"
                >
                  {formAperto ? "Chiudi" : "Prenota un tavolo"}
                </button>
                <a
                  href={MASSERIA.telefonoHref}
                  className="inline-flex min-h-[52px] w-full items-center justify-center border border-[color:var(--oro-antico)] px-7 font-eyebrow text-[11px] tracking-[0.26em] text-[color:var(--bianco-calce)] transition-colors hover:bg-[color:var(--oro-antico)]/12 sm:w-auto"
                >
                  Chiama la masseria
                </a>
              </div>

              {/* Form di prenotazione */}
              {formAperto && (
                <div className="mt-8 border-t border-[color:var(--oro-antico)]/35 pt-8">
                  <PrenotazioneForm variant="dark" showTitle={true} />
                </div>
              )}
            </div>
          </div>

          {/* 4 — Dove siamo */}
          <div data-prenota-block style={visibile} className="md:col-span-2">
            <p className="font-eyebrow text-[10px] tracking-[0.34em] text-[color:var(--bianco-calce)]/70">
              Dove siamo
            </p>
            <div className="mt-6 grid gap-10 border-t border-[color:var(--oro-antico)]/35 pt-6 md:grid-cols-2 md:gap-16">
              <div>
                <address className="not-italic text-[17px] leading-relaxed text-[color:var(--bianco-calce)]">
                  {MASSERIA.indirizzo}
                </address>
                <p className="mt-3 text-[15px] tabular-nums text-[color:var(--bianco-calce)]/70">
                  {MASSERIA.coordinateLabel}
                </p>
                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
                  <a
                    href={MASSERIA.maps}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] items-center border-b border-[color:var(--oro-antico)] font-eyebrow text-[10px] tracking-[0.24em] text-[color:var(--bianco-calce)]"
                  >
                    Apri in Maps
                  </a>
                  <a
                    href={MASSERIA.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] items-center text-[16px] text-[color:var(--bianco-calce)]/80 transition-colors hover:text-[color:var(--bianco-calce)]"
                  >
                    Instagram
                  </a>
                  <a
                    href={MASSERIA.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[44px] items-center text-[16px] text-[color:var(--bianco-calce)]/80 transition-colors hover:text-[color:var(--bianco-calce)]"
                  >
                    Facebook
                  </a>
                </div>
                <p className="mt-6 text-[15px] tabular-nums text-[color:var(--bianco-calce)]/70">
                  P.IVA / CF {MASSERIA.piva}
                </p>
              </div>

              {/* Mappa: caricata solo dopo clic esplicito (privacy + peso) */}
              <div className="relative min-h-[240px] border border-[color:var(--oro-antico)]/35 md:min-h-[300px]">
                {mappaAttiva ? (
                  <iframe
                    src={MASSERIA.mapsEmbed}
                    title={`Mappa di ${MASSERIA.nome}, ${MASSERIA.indirizzo}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <button
                    type="button"
                    data-mappa-trigger
                    onClick={() => setMappaAttiva(true)}
                    aria-label="Carica la mappa interattiva di Google Maps con la posizione della masseria"
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[color:var(--bianco-calce)]/[0.04] px-6 text-center transition-colors hover:bg-[color:var(--bianco-calce)]/[0.08]"
                  >
                    <span className="font-eyebrow text-[10px] tracking-[0.28em] text-[color:var(--bianco-calce)]">
                      Mostra la mappa
                    </span>
                    <span className="max-w-xs text-[15px] leading-relaxed text-[color:var(--bianco-calce)]/75">
                      La mappa viene caricata da Google solo dopo il tuo clic.
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
