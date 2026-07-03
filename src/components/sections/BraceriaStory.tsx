import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import salaImg from "@/assets/brace-sala.jpg";
import handsImg from "@/assets/brace-hands.jpg";
import cotturaImg from "@/assets/brace-cottura.jpg";
import tavolaAntipasto from "@/assets/tavola-antipasto.jpg";
import tavolaAttesa from "@/assets/tavola-attesa.jpg";
import aerialAsset from "@/assets/masseria-aerial.asset.json";

/* ─────────────────────── DATA ─────────────────────── */

const BEATS = [
  {
    id: "01",
    label: "Scegli al banco",
    line: "Il filetto, le bombette, la salsiccia. La scegli tu.",
    img: handsImg,
  },
  {
    id: "02",
    label: "Ti siedi",
    line: "Nel frattempo, l'antipasto che non finisce mai.",
    img: tavolaAntipasto,
  },
  {
    id: "03",
    label: "Alla brace",
    line: "Te la portano cotta. Al sangue, se la scegli così.",
    img: cotturaImg,
  },
];

const MENU = [
  {
    cat: "Dall'antipasto",
    items: [
      "Salumi e formaggi nostri",
      "Frittelle del nostro grano · ricotta piccante",
      "Zucchine marinate",
    ],
  },
  {
    cat: "Dai primi",
    items: ["Polpettine al sugo", "Spezzatino di vitello e maiale"],
  },
  {
    cat: "Dalla brace",
    items: [
      "Pecora in Pignata · 5 ore, forno a legna",
      "Filetto di vitello · 15 giorni di frollatura",
      "Bombette · salsiccia",
    ],
  },
  {
    cat: "Dolci",
    items: ["Dolcini artigianali fatti in casa"],
  },
];

const QUOTES = [
  {
    text: "All'ingresso ci si sceglie la carne che si vorrà gustare alla brace e una volta seduti al tavolo partono con la carrellata di antipasti misti tipici.",
    from: "Tripadvisor",
    at: "mov2",
  },
  { text: "L'antipasto non finisce mai.", from: "Tripadvisor", at: "mov3" },
  {
    text: "Gli orologi si fermano quando la trasportano dal forno alla cucina.",
    from: "Luciano Pignataro Wine Blog",
    at: "mov3",
  },
];

/* ─────────────────────── COMPONENT ─────────────────────── */

export function BraceriaStory() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [ora, setOra] = useState("19:30");

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (reduced) return;
      const mm = gsap.matchMedia();

      /* ══════ INGRESSO · SALA VUOTA CHE SI ILLUMINA ══════ */
      const ing = root.querySelector<HTMLElement>("[data-mov='ing']");
      const salaLight = root.querySelector<HTMLElement>("[data-sala-light]");
      const darkVeil = root.querySelector<HTMLElement>("[data-dark-veil]");
      const salaTitle = root.querySelector<HTMLElement>("[data-sala-title]");

      if (ing && salaLight && darkVeil) {
        ScrollTrigger.create({
          trigger: ing,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(darkVeil, { autoAlpha: 1 - p * 0.85 });
            gsap.set(salaLight, { autoAlpha: p * 0.55 });
            const ore = 19 + Math.floor(p * 3);
            const min = Math.floor((p * 60) % 60);
            setOra(`${String(ore).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
          },
        });
        if (salaTitle) {
          gsap.fromTo(
            salaTitle,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              ease: "power2.out",
              scrollTrigger: {
                trigger: ing,
                start: "65% top",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }
      }

      /* ══════ MOV 2 · IL RITO (3 beat morph) ══════ */
      mm.add("(min-width: 900px)", () => {
        const mov2 = root.querySelector<HTMLElement>("[data-mov='2']");
        const stage = root.querySelector<HTMLElement>("[data-stage]");
        if (!mov2 || !stage) return;

        ScrollTrigger.create({
          trigger: mov2,
          start: "top top",
          end: "+=" + BEATS.length * 100 + "%",
          pin: stage,
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const activeIdx = Math.min(
              BEATS.length - 1,
              Math.floor(p * BEATS.length),
            );
            BEATS.forEach((b, i) => {
              const el = root.querySelector<HTMLElement>(`[data-beat='${b.id}']`);
              if (!el) return;
              gsap.set(el, {
                autoAlpha: i === activeIdx ? 1 : 0,
                scale: i === activeIdx ? 1 : 1.06,
              });
            });
            const grill = root.querySelector<HTMLElement>("[data-grill-wash]");
            if (grill) {
              // Warm-wash --terracotta SOLO nel beat 3 (breve)
              const in3 = p > 0.66 && p < 0.9 ? (p - 0.66) / 0.24 : 0;
              const out3 = p >= 0.9 ? 1 - (p - 0.9) / 0.1 : in3;
              gsap.set(grill, { autoAlpha: Math.max(0, Math.min(0.55, out3)) });
            }
          },
        });
      });

      // Mobile: beat verticali con reveal
      mm.add("(max-width: 899px)", () => {
        BEATS.forEach((b) => {
          const el = root.querySelector<HTMLElement>(`[data-beat-mobile='${b.id}']`);
          if (!el) return;
          gsap.fromTo(
            el,
            { y: 40, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        });
      });

      /* ══════ MOV 3 · MENÙ EDITORIALE (stagger portate) ══════ */
      root.querySelectorAll<HTMLElement>("[data-menu-cat]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            delay: i * 0.05,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });
      root.querySelectorAll<HTMLElement>("[data-menu-item]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 16, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
            delay: 0.08 + (i % 8) * 0.05,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });

      /* ══════ CHIUSURA · zoom-out alla mappa aerea ══════ */
      const closeSec = root.querySelector<HTMLElement>("[data-mov='close']");
      const aerial = root.querySelector<HTMLElement>("[data-aerial-close]");
      if (closeSec && aerial) {
        gsap.fromTo(
          aerial,
          { scale: 3.2, autoAlpha: 0.2, filter: "blur(6px)" },
          {
            scale: 1,
            autoAlpha: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: closeSec,
              start: "top bottom",
              end: "center center",
              scrub: 1,
            },
          },
        );
      }

      /* Filo d'oro che chiude il cerchio */
      const thread = root.querySelector<SVGPathElement>("[data-close-thread]");
      if (thread) {
        const len = thread.getTotalLength?.() ?? 800;
        gsap.set(thread, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(thread, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: closeSec,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={rootRef}
      className="relative w-full text-[color:var(--crema)]"
      style={{ background: "var(--marrone)" }}
    >
      {/* ══════════════════ INGRESSO · SALA VUOTA ══════════════════ */}
      <section
        data-mov="ing"
        className="relative h-[220vh]"
        aria-label="La sala vuota"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Sala */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${salaImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.35) saturate(0.7)",
            }}
          />
          {/* Warm wash che si accende */}
          <div
            data-sala-light
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 55%, color-mix(in oklab, var(--crema) 65%, transparent) 0%, transparent 60%)",
              opacity: 0,
            }}
          />
          {/* Velo scuro che si toglie */}
          <div
            data-dark-veil
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(26,18,16,0.85)" }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, transparent 40%, rgba(26,18,16,0.65) 100%)",
            }}
          />

          {/* Rail sinistro */}
          <div
            aria-hidden
            className="absolute left-4 md:left-8 top-0 h-full flex items-center pointer-events-none z-10"
          >
            <div
              className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--crema)]/55"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                letterSpacing: "0.3em",
              }}
            >
              BRACERIA · IV · NOCI · {ora} APERTURA
            </div>
          </div>

          {/* Titolo che emerge con la luce */}
          <div className="absolute inset-x-0 top-[52%] flex justify-center pointer-events-none px-6 z-20">
            <h1
              data-sala-title
              className="font-display text-center leading-[0.9]"
              style={{
                color: "var(--crema)",
                fontSize: "clamp(2.4rem, 7.5vw, 6rem)",
                fontWeight: 300,
                textShadow: "0 2px 40px rgba(26,18,16,0.7)",
                letterSpacing: "-0.02em",
              }}
            >
              La brace, ogni sera
            </h1>
          </div>

          <div className="absolute bottom-8 inset-x-0 flex justify-center pointer-events-none z-20">
            <div className="font-eyebrow text-[10px] text-[color:var(--crema)]/50 tracking-[0.3em]">
              ↓ ENTRA
            </div>
          </div>
          <div className="grain absolute inset-0 pointer-events-none" />
        </div>
      </section>

      {/* ══════════════════ MOV 2 · IL RITO (desktop pinned) ══════════════════ */}
      <section
        data-mov="2"
        className="relative hidden md:block"
        aria-label="Il rito"
        style={{ minHeight: "400vh", background: "var(--marrone)" }}
      >
        <div
          data-stage
          className="relative h-screen w-full overflow-hidden"
        >
          {/* Beat backgrounds */}
          {BEATS.map((b, i) => (
            <div
              key={b.id}
              data-beat={b.id}
              className="absolute inset-0 will-change-transform"
              style={{
                backgroundImage: `url(${b.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: i === 0 ? 1 : 0,
                filter: "brightness(0.6) saturate(0.85)",
              }}
            />
          ))}
          {/* Warm wash --crema per il tavolo (beat 2 e 3) */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(61,42,30,0.3) 0%, rgba(26,18,16,0.55) 100%)",
            }}
          />
          {/* Warm wash --terracotta SOLO nel beat 3 (griglia) */}
          <div
            data-grill-wash
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 80%, color-mix(in oklab, var(--terracotta) 60%, transparent) 0%, transparent 55%)",
              opacity: 0,
            }}
          />

          {/* Etichette numeriche stamp */}
          <div className="absolute inset-0 z-10 flex items-end pb-16 md:pb-24 px-8 md:px-16">
            <div className="grid grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
              {BEATS.map((b) => (
                <div key={b.id} className="text-center">
                  <div
                    className="font-eyebrow text-[11px] md:text-[13px] mb-2"
                    style={{
                      color: "var(--oro)",
                      letterSpacing: "0.35em",
                    }}
                  >
                    {b.id} · {b.label.toUpperCase()}
                  </div>
                  <div
                    className="font-display italic text-[color:var(--crema)]/90 leading-snug max-w-xs mx-auto"
                    style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.15rem)", fontWeight: 300 }}
                  >
                    {b.line}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cornice titolo mov2 in alto */}
          <div className="absolute top-8 left-8 z-10 font-eyebrow text-[10px] text-[color:var(--crema)]/60 tracking-[0.3em]">
            IL RITO · TRE MOMENTI
          </div>

          {/* Recensione mov2 */}
          <div className="absolute top-1/3 right-8 max-w-xs z-10 hidden lg:block">
            <blockquote>
              <p
                className="font-display italic text-[color:var(--crema)]"
                style={{ fontSize: "1rem", fontWeight: 300, lineHeight: 1.35 }}
              >
                “{QUOTES[0].text}”
              </p>
              <footer className="mt-2 font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.3em]">
                — {QUOTES[0].from}
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ══════════════════ MOV 2 · IL RITO (mobile stacked) ══════════════════ */}
      <section
        className="relative md:hidden py-16 px-5"
        aria-label="Il rito"
        style={{ background: "var(--marrone)" }}
      >
        <div className="font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.35em] mb-6">
          IL RITO · TRE MOMENTI
        </div>
        <div className="space-y-8">
          {BEATS.map((b) => (
            <article
              key={b.id}
              data-beat-mobile={b.id}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-2xl">
                <img
                  src={b.img}
                  alt={b.label}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                  style={{ filter: "brightness(0.75)" }}
                />
                {b.id === "03" && (
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 70%, color-mix(in oklab, var(--terracotta) 50%, transparent) 0%, transparent 60%)",
                    }}
                  />
                )}
              </div>
              <div className="mt-3">
                <div className="font-eyebrow text-[10px] text-[color:var(--oro)] tracking-[0.35em]">
                  {b.id} · {b.label.toUpperCase()}
                </div>
                <p
                  className="mt-1 font-display italic text-[color:var(--crema)]/90 leading-snug"
                  style={{ fontSize: "1.05rem", fontWeight: 300 }}
                >
                  {b.line}
                </p>
              </div>
            </article>
          ))}
          <blockquote className="pt-4 border-t border-[color:var(--oro)]/25">
            <p
              className="font-display italic text-[color:var(--crema)]"
              style={{ fontSize: "1rem", fontWeight: 300 }}
            >
              “{QUOTES[0].text}”
            </p>
            <footer className="mt-2 font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.3em]">
              — {QUOTES[0].from}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ══════════════════ MOV 3 · LA TAVOLA (menù editoriale) ══════════════════ */}
      <section
        className="relative py-24 md:py-32"
        aria-label="La tavola"
        style={{
          background:
            "linear-gradient(180deg, var(--marrone) 0%, color-mix(in oklab, var(--marrone) 80%, var(--carbone)) 100%)",
        }}
      >
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="mb-16 md:mb-20">
            <div className="font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.35em] mb-3">
              LA TAVOLA · LA CENA
            </div>
            <h2
              className="font-display text-[color:var(--crema)] leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", fontWeight: 300 }}
            >
              Le portate arrivano.
              <br />
              Una dopo l'altra.
            </h2>
          </div>

          <div className="space-y-12 md:space-y-16">
            {MENU.map((sec) => (
              <div
                key={sec.cat}
                data-menu-cat
                className="grid md:grid-cols-[220px_1fr] gap-4 md:gap-10 border-t border-[color:var(--oro)]/25 pt-8"
              >
                <div className="font-eyebrow text-[11px] md:text-[13px] text-[color:var(--oro)] tracking-[0.35em] pt-1">
                  {sec.cat.toUpperCase()}
                </div>
                <ul className="space-y-3">
                  {sec.items.map((it) => (
                    <li
                      key={it}
                      data-menu-item
                      className="font-display text-[color:var(--crema)] leading-snug"
                      style={{ fontSize: "clamp(1.2rem, 2vw, 1.7rem)", fontWeight: 300 }}
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Recensioni fluttuanti */}
          <div className="relative mt-24 md:mt-32 flex flex-col md:flex-row gap-8 md:gap-16">
            <blockquote data-menu-item className="max-w-sm md:mt-0">
              <p
                className="font-display italic text-[color:var(--crema)] leading-snug"
                style={{ fontSize: "clamp(1.25rem, 2vw, 1.7rem)", fontWeight: 300 }}
              >
                “L'antipasto non finisce mai.”
              </p>
              <footer className="mt-2 font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.3em]">
                — Tripadvisor
              </footer>
            </blockquote>
            <blockquote data-menu-item className="max-w-md md:mt-16">
              <p
                className="font-display italic text-[color:var(--crema)] leading-snug"
                style={{ fontSize: "clamp(1.15rem, 1.8vw, 1.5rem)", fontWeight: 300 }}
              >
                “Gli orologi si fermano quando la trasportano dal forno alla cucina.”
              </p>
              <footer className="mt-2 font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.3em]">
                — Luciano Pignataro Wine Blog
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ══════════════════ CHIUSURA · TUTTO TORNA (zoom-out aerea) ══════════════════ */}
      <section
        data-mov="close"
        className="relative"
        aria-label="Il cerchio si chiude"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--marrone) 60%, var(--carbone)) 0%, var(--carbone) 100%)",
          minHeight: "150vh",
        }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Attesa sul tavolo prima dello zoom-out */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${tavolaAttesa})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.35) saturate(0.7)",
              opacity: 0.5,
            }}
          />
          {/* Mappa aerea (zoom-out) */}
          <div
            data-aerial-close
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${aerialAsset.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.5) saturate(0.8)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(26,18,16,0.55) 0%, rgba(26,18,16,0.4) 50%, rgba(26,18,16,0.85) 100%)",
            }}
          />

          {/* Filo che chiude il cerchio */}
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              data-close-thread
              d="M 15 20 C 30 40, 70 20, 85 45 S 30 75, 50 90"
              fill="none"
              stroke="var(--oro)"
              strokeWidth="0.35"
              opacity="0.75"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Testo finale + CTA */}
          <div className="relative z-10 text-center px-6 max-w-3xl">
            <div className="font-eyebrow text-[10px] text-[color:var(--oro)]/80 tracking-[0.4em] mb-5">
              IL CERCHIO SI CHIUDE
            </div>
            <h2
              className="font-display text-[color:var(--crema)] leading-[1]"
              style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)", fontWeight: 300, letterSpacing: "-0.02em" }}
            >
              Dalla terra alla tavola.
              <br />
              <span className="italic text-[color:var(--crema)]/85">Ogni sera, a Noci.</span>
            </h2>

            <div className="mt-10 flex flex-col items-center gap-4">
              <a
                href="https://wa.me/393339395750"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-block font-display text-[color:var(--crema)] hover:text-[color:var(--oro)] transition-colors"
                style={{ fontSize: "clamp(1.4rem, 2.6vw, 2rem)", fontWeight: 300 }}
              >
                Prenota un tavolo →
                <span
                  aria-hidden
                  className="block mx-auto mt-2 h-px transition-all duration-500 group-hover:w-full"
                  style={{ width: "60%", background: "var(--oro)" }}
                />
              </a>
              <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--crema)]/70 tracking-[0.3em] mt-2">
                MER–SAB · CENA · DOMENICA E FESTIVI · PRANZO
              </div>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[color:var(--crema)]/85 text-sm md:text-base">
                <a href="tel:+393339395750" className="hover:text-[color:var(--oro)] transition-colors">
                  333 939 5750
                </a>
                <span className="text-[color:var(--oro)]/50">·</span>
                <a href="tel:+393333870292" className="hover:text-[color:var(--oro)] transition-colors">
                  333 387 0292
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
