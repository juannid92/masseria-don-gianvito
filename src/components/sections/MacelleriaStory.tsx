import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "@/hooks/useReducedMotion";

import bancoImg from "@/assets/macel-banco.jpg";
import granoImg from "@/assets/allev-c-grano.jpg";

/* ─────────────────────────────────────────────────────────────
 * /macelleria — A VISTA
 * Bianco → Oro → Pietra → Banco → Scelta → Cottura
 * ───────────────────────────────────────────────────────────── */

type Voce = {
  id: "filetto" | "bombette" | "salsiccia" | "altri";
  label: string;
  cat: "TAGLIO" | "PREPARAZIONE DEL BANCO" | "BANCO";
  titolo: string;
  testo: string;
  nota?: string;
  // Coordinate SVG (viewBox 400x260) — spot informativo, non taglio anatomico specifico
  x: number;
  y: number;
  isCut: boolean; // true = collegato alla silhouette; false = area preparazioni/altri
};

const VOCI: Voce[] = [
  {
    id: "filetto",
    label: "Filetto di vitello",
    cat: "TAGLIO",
    titolo: "Filetto di vitello",
    testo: "Tra i tagli emersi dal banco della Masseria.",
    nota: "La frollatura indicativa è di circa quindici giorni.",
    x: 245,
    y: 120,
    isCut: true,
  },
  {
    id: "bombette",
    label: "Bombette",
    cat: "PREPARAZIONE DEL BANCO",
    titolo: "Bombette",
    testo: "Tra le preparazioni scelte al banco e portate alla cottura.",
    x: 360,
    y: 60,
    isCut: false,
  },
  {
    id: "salsiccia",
    label: "Salsiccia",
    cat: "PREPARAZIONE DEL BANCO",
    titolo: "Salsiccia",
    testo: "Una delle preparazioni ricordate più spesso insieme alle bombette.",
    x: 360,
    y: 130,
    isCut: false,
  },
  {
    id: "altri",
    label: "Altri tagli al banco",
    cat: "BANCO",
    titolo: "La scelta cambia",
    testo:
      "Gli altri tagli seguono la disponibilità del banco e devono essere confermati direttamente con la Masseria.",
    x: 360,
    y: 210,
    isCut: false,
  },
];

const SALUMI = ["PROSCIUTTO CRUDO", "SOPPRESSATA", "SALSICCIA SECCA", "PANCETTA TESA"];

const FILO = ["ALLEVAMENTO", "TEMPO", "BANCO"] as const;

/* ─────────────────────────────────────────────────────────── */

export function MacelleriaStory() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Voce["id"]>("filetto");

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    let mounted = true;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* ═══ APERTURA · DENTRO IL BANCO ═══ */
      const openImg = root.querySelector<HTMLElement>("[data-open-img]");
      const openStamp = root.querySelector<HTMLElement>("[data-stamp]");
      const openGlass = root.querySelector<HTMLElement>("[data-open-glass]");
      const openLine = root.querySelector<HTMLElement>("[data-open-line]");
      const open = root.querySelector<HTMLElement>("[data-act='1']");

      if (open && openImg) {
        gsap.set(openImg, { scale: 1.08 });
        ScrollTrigger.create({
          trigger: open,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => {
            if (!mounted) return;
            const p = self.progress;
            gsap.set(openImg, { scale: 1.08 - p * 0.06, y: -p * 30 });
            if (openGlass) gsap.set(openGlass, { autoAlpha: 1 - p * 0.5 });
          },
        });
      }
      if (openStamp) {
        gsap.fromTo(
          openStamp,
          { scale: 0.85, autoAlpha: 0, rotate: -3 },
          {
            scale: 1,
            autoAlpha: 1,
            rotate: -1.4,
            ease: "power3.out",
            duration: 0.9,
            delay: 0.2,
            scrollTrigger: { trigger: open, start: "top 90%", once: true },
          },
        );
      }
      if (openLine) {
        gsap.fromTo(
          openLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "power2.out",
            duration: 1.2,
            scrollTrigger: { trigger: open, start: "top 80%", once: true },
          },
        );
      }

      /* ═══ RITO — reveal sequenziale dei 3 verbi ═══ */
      root.querySelectorAll<HTMLElement>("[data-verb]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 30, clipPath: "inset(0 0 100% 0)" },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.7,
            delay: i * 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });

      /* ═══ Big words generici ═══ */
      root.querySelectorAll<HTMLElement>("[data-bigword]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, autoAlpha: 0, clipPath: "inset(0 0 100% 0)" },
          {
            y: 0,
            autoAlpha: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });

      /* ═══ FILO oro — 3 parole (Allevamento, Tempo, Banco) ═══ */
      const filoSect = root.querySelector<HTMLElement>("[data-filo]");
      if (filoSect) {
        const line = filoSect.querySelector<SVGPathElement>("path[data-filo-line]");
        if (line) {
          const len = line.getTotalLength();
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(line, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: filoSect, start: "top 75%", end: "bottom 40%", scrub: 0.6 },
          });
        }
      }

      /* ═══ FROLLATURA — 15 segni progressivi con stagger, no pin lungo ═══ */
      const frollSect = root.querySelector<HTMLElement>("[data-frollatura]");
      if (frollSect) {
        const segni = frollSect.querySelectorAll<HTMLElement>("[data-segno]");
        gsap.fromTo(
          segni,
          { scaleY: 0, autoAlpha: 0.2 },
          {
            scaleY: 1,
            autoAlpha: 1,
            transformOrigin: "bottom center",
            stagger: 0.03,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: { trigger: frollSect, start: "top 75%", once: true },
          },
        );
      }

      /* ═══ SALUMI — reveal verticale con ombre allungate ═══ */
      root.querySelectorAll<HTMLElement>("[data-salume]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: (i % 4) * 0.08,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });

      /* ═══ Filo diagramma — si ridisegna al cambio voce (React state) ═══ */
      // Gestito nel componente Diagramma con useEffect locale

      const doRefresh = () => { if (mounted) ScrollTrigger.refresh(); };
      if (document.fonts?.ready) document.fonts.ready.then(doRefresh).catch(() => {});
      setTimeout(doRefresh, 200);
    }, root);

    return () => {
      mounted = false;
      ctx.revert();
    };
  }, [reduced]);

  const activeVoce = VOCI.find((v) => v.id === active) ?? VOCI[0];

  return (
    <div
      ref={rootRef}
      className="relative w-full"
      style={{ background: "var(--crema)", color: "var(--marrone)" }}
    >

      {/* ══════════ APERTURA · DENTRO IL BANCO ══════════ */}
      <section data-act="1" className="relative h-[180vh]" aria-label="Dentro il banco">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden" style={{ background: "#c5a159" }}>
          {/* Foto reale del banco */}
          <div
            data-open-img
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${bancoImg})`,
              backgroundSize: "cover",
              backgroundPosition: "center 55%",
              filter: "brightness(0.85) contrast(1.05) saturate(0.85)",
            }}
            role="img"
            aria-label="Il banco della Macelleria di Masseria Don Gianvito"
          />
          {/* Overlay vetro (crema + marrone) */}
          <div
            data-open-glass
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(197,161,89,0.35) 0%, rgba(61,42,30,0.15) 40%, rgba(26,18,16,0.55) 100%)",
            }}
            aria-hidden
          />
          {/* Linea oro (bordo banco) */}
          <div className="absolute inset-x-6 md:inset-x-14 top-[62%] pointer-events-none z-10">
            <div
              data-open-line
              className="h-px origin-left"
              style={{
                background: "linear-gradient(90deg, transparent, var(--oro), var(--oro), transparent)",
                boxShadow: "0 1px 0 rgba(197,161,89,0.4)",
              }}
              aria-hidden
            />
          </div>

          {/* Rail sx */}
          <div className="absolute left-4 md:left-8 top-0 h-full flex items-center pointer-events-none z-10" aria-hidden>
            <div
              className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--crema)]/85"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", letterSpacing: "0.3em" }}
            >
              MACELLERIA — MASSERIA DON GIANVITO · A VISTA
            </div>
          </div>

          {/* Timbro + titolo */}
          <div className="absolute inset-x-0 top-[26%] flex flex-col items-center px-6 text-center pointer-events-none">
            <div
              data-stamp
              className="inline-flex flex-col items-center justify-center px-6 py-3 mb-8"
              style={{
                border: "2px solid var(--bordeaux)",
                borderRadius: "2px",
                background: "color-mix(in oklab, var(--crema) 92%, transparent)",
                boxShadow: "0 4px 20px rgba(26,18,16,0.35)",
                transform: "rotate(-1.4deg)",
              }}
              aria-hidden
            >
              <span className="font-eyebrow text-[9px] tracking-[0.4em] text-[color:var(--bordeaux)]">
                MASSERIA DON GIANVITO
              </span>
              <span className="mt-1 font-eyebrow text-[10px] tracking-[0.3em] text-[color:var(--marrone)]/70">
                MACELLERIA · A VISTA
              </span>
            </div>
            <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--crema)]/85 tracking-[0.35em] mb-4">
              MACELLERIA — MASSERIA DON GIANVITO
            </div>
            <h1
              className="font-display leading-[0.9] text-[color:var(--crema)]"
              style={{ fontSize: "clamp(2.4rem, 8vw, 6.5rem)", fontWeight: 300, textShadow: "0 2px 30px rgba(26,18,16,0.7)" }}
            >
              La scelta<br/>avviene a vista.
            </h1>
          </div>

          {/* Testo apertura + indicatore */}
          <div className="absolute inset-x-0 bottom-16 md:bottom-20 flex flex-col items-center px-6 text-center pointer-events-none">
            <p className="max-w-xl text-[color:var(--crema)]/85 text-base md:text-lg leading-relaxed mb-4">
              Prima di sedersi, si passa dal banco. La carne viene osservata, scelta e preparata per il tavolo.
            </p>
            <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--crema)]/75 tracking-[0.4em]">
              ENTRA NEL BANCO ↓
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ IL RITO DELLA SCELTA ══════════ */}
      <section
        className="relative overflow-hidden py-24 md:py-40 px-6 md:px-14"
        aria-label="Il rito della scelta"
        style={{
          background: "linear-gradient(180deg, #e6d5a8 0%, #efe6ce 60%, #ddc8a3 100%)",
          color: "var(--marrone)",
        }}
      >
        <div className="relative max-w-6xl mx-auto">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/70 tracking-[0.35em] mb-6">
            01 — IL RITO
          </div>
          <h2
            data-bigword
            className="font-display text-[color:var(--marrone)] leading-[0.95] mb-6"
            style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)", fontWeight: 300 }}
          >
            Guarda.<br/>Scegli.<br/>Siedi.
          </h2>
          <p data-bigword className="text-[color:var(--marrone)]/80 text-lg md:text-xl max-w-2xl leading-relaxed mb-16 md:mb-20">
            La carne viene scelta direttamente al banco. Dopo la scelta, il pasto continua al tavolo e la cottura completa il passaggio.
          </p>

          {/* Linea continua che attraversa i 3 verbi */}
          <div className="relative">
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 1000 220"
            >
              <path
                d="M 30 60 Q 250 30, 500 90 T 970 130"
                fill="none"
                stroke="var(--oro)"
                strokeWidth="2"
                opacity="0.7"
              />
            </svg>
            <div className="relative grid md:grid-cols-3 gap-10 md:gap-6">
              {[
                { verb: "GUARDA", txt: "La carne è esposta a vista.", accent: false },
                { verb: "SCEGLI", txt: "Il taglio viene scelto al banco.", accent: true },
                { verb: "SIEDI", txt: "La scelta continua nella cucina e arriva al tavolo.", accent: false },
              ].map((v, i) => (
                <div
                  key={v.verb}
                  data-verb
                  className="relative"
                  style={{
                    marginTop: i === 1 ? "1.5rem" : i === 2 ? "3rem" : 0,
                  }}
                >
                  {v.accent && (
                    <span
                      aria-hidden
                      className="absolute -left-4 top-3 h-2 w-2 rounded-full"
                      style={{ background: "var(--oro)" }}
                    />
                  )}
                  <div
                    className="font-display leading-none text-[color:var(--marrone)] mb-3"
                    style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", fontWeight: 300, letterSpacing: "-0.01em" }}
                  >
                    {v.verb}
                  </div>
                  <p className="text-[color:var(--marrone)]/75 text-sm md:text-base italic max-w-xs">{v.txt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ATLANTE A VISTA — DIAGRAMMA ══════════ */}
      <section
        className="relative py-24 md:py-36 px-6 md:px-14"
        aria-label="Atlante a vista"
        style={{ background: "linear-gradient(180deg, #ddc8a3 0%, #d8c299 100%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/75 tracking-[0.35em] mb-6">
            02 — ATLANTE A VISTA
          </div>
          <h2
            data-bigword
            className="font-display text-[color:var(--marrone)] leading-[0.95] mb-6"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300 }}
          >
            Atlante a vista
          </h2>
          <p className="text-[color:var(--marrone)]/85 text-lg max-w-2xl leading-relaxed mb-3">
            Il banco mostra tagli e preparazioni diverse. La disponibilità segue il lavoro e il momento.
          </p>
          <p className="text-[color:var(--marrone)]/60 text-sm italic max-w-2xl mb-14">
            Il diagramma è una rappresentazione narrativa e non costituisce il menu completo del giorno.
          </p>

          <Diagramma active={active} setActive={setActive} activeVoce={activeVoce} />
        </div>
      </section>

      {/* ══════════ IL FILO — TRACCIABILITÀ ══════════ */}
      <section
        data-filo
        className="relative py-24 md:py-36 px-6 md:px-14"
        aria-label="Il filo della tracciabilità"
        style={{ background: "linear-gradient(180deg, #d8c299 0%, #c5a985 100%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/75 tracking-[0.35em] mb-6">
            03 — IL FILO
          </div>
          <h2
            data-bigword
            className="font-display text-[color:var(--marrone)] leading-[0.95] mb-6 max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300 }}
          >
            La scelta<br/>non comincia dal banco.
          </h2>
          <p className="text-[color:var(--marrone)]/85 text-lg max-w-2xl leading-relaxed mb-4">
            Prima della Macelleria ci sono l'allevamento, il lavoro agricolo e il tempo necessario alla materia.
          </p>
          <p className="text-[color:var(--marrone)]/60 text-base italic max-w-2xl leading-relaxed mb-16 md:mb-20">
            Il banco è un passaggio visibile di un percorso più lungo.
          </p>

          <div className="relative">
            <svg
              aria-hidden
              className="absolute inset-0 h-full w-full pointer-events-none"
              preserveAspectRatio="none"
              viewBox="0 0 1000 160"
            >
              <path
                data-filo-line
                d="M 40 90 Q 250 30, 500 100 T 960 70"
                fill="none"
                stroke="var(--oro)"
                strokeWidth="1.5"
                opacity="0.85"
              />
              {[
                { cx: 80, cy: 82 },
                { cx: 500, cy: 100 },
                { cx: 920, cy: 74 },
              ].map((n, i) => (
                <circle key={i} cx={n.cx} cy={n.cy} r="4" fill="var(--oro)" opacity="0.9" />
              ))}
            </svg>
            <div className="relative grid grid-cols-3 items-center py-10 md:py-14 gap-2">
              {FILO.map((word, i) => (
                <div key={word} className={i === 1 ? "text-center" : i === 2 ? "text-right" : ""}>
                  {word === "ALLEVAMENTO" ? (
                    <Link
                      to="/allevamento"
                      className="font-display text-[color:var(--marrone)] hover:text-[color:var(--bordeaux)] transition-colors leading-none inline-block"
                      style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.4rem)", fontWeight: 300 }}
                    >
                      {word}
                    </Link>
                  ) : (
                    <div
                      className="font-display text-[color:var(--marrone)] leading-none"
                      style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.4rem)", fontWeight: 300 }}
                    >
                      {word}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ IL TEMPO — FROLLATURA ══════════ */}
      <section
        data-frollatura
        className="relative py-24 md:py-36 px-6 md:px-14 overflow-hidden"
        aria-label="Il tempo prima del taglio"
        style={{
          background: "linear-gradient(180deg, #c5a985 0%, #a08668 100%)",
          color: "var(--crema)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--crema)]/80 tracking-[0.35em] mb-6">
            03 — IL TEMPO
          </div>
          <h2
            data-bigword
            className="font-display leading-[0.95] mb-6"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300, color: "var(--crema)" }}
          >
            Prima del taglio,<br/>l'attesa.
          </h2>

          <div className="grid md:grid-cols-12 gap-10 md:gap-8 items-end mt-14 md:mt-20">
            {/* 15 grande + parola CIRCA */}
            <div className="md:col-span-7 relative">
              <div
                className="font-eyebrow text-[color:var(--crema)]/75 tracking-[0.4em] text-sm md:text-base mb-2"
                aria-hidden
              >
                CIRCA
              </div>
              <div
                className="font-display leading-[0.8] text-[color:var(--crema)]"
                style={{ fontSize: "clamp(8rem, 22vw, 20rem)", fontWeight: 300, letterSpacing: "-0.03em" }}
              >
                15
              </div>
              <div
                className="font-eyebrow text-[color:var(--crema)]/85 tracking-[0.35em] text-sm md:text-base mt-2"
                aria-hidden
              >
                GIORNI · INDICATIVO
              </div>
            </div>
            {/* 15 segni sottili */}
            <div className="md:col-span-5">
              <div className="flex items-end gap-2 h-32 mb-6">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    data-segno
                    className="flex-1 origin-bottom"
                    style={{
                      height: `${40 + (i % 3) * 20}%`,
                      background: i === 14 ? "var(--oro)" : "color-mix(in oklab, var(--crema) 90%, transparent)",
                      opacity: 0.85,
                    }}
                    aria-hidden
                  />
                ))}
              </div>
              <p className="text-[color:var(--crema)]/85 text-base md:text-lg leading-relaxed">
                <span className="font-eyebrow tracking-[0.15em] text-[color:var(--crema)]">CIRCA 15 GIORNI</span> è la frollatura indicativa.
              </p>
              <p className="text-[color:var(--crema)]/70 text-sm italic mt-3 leading-relaxed">
                Tempi e disponibilità possono cambiare in base al taglio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ SALUMI PROPRI ══════════ */}
      <section
        className="relative py-24 md:py-36 px-6 md:px-14 overflow-hidden"
        aria-label="Salumi propri"
        style={{
          background: "linear-gradient(180deg, #a08668 0%, #7a5a4a 60%, #5c3d3d 100%)",
          color: "var(--crema)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--crema)]/80 tracking-[0.35em] mb-6">
            04 — I SALUMI
          </div>
          <h2
            data-bigword
            className="font-display leading-[0.95] mb-6 max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300, color: "var(--crema)" }}
          >
            Il tempo<br/>continua nelle forme.
          </h2>
          <p className="text-[color:var(--crema)]/80 text-lg max-w-2xl leading-relaxed mb-16 md:mb-24">
            La Masseria produce salumi propri che entrano negli antipasti e nella tavola.
          </p>

          {/* Quattro nomi verticali con "sospensione" e ombra allungata */}
          <ul className="relative grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
            {SALUMI.map((nome, i) => (
              <li key={nome} data-salume className="relative flex flex-col items-center">
                {/* sottile linea dall'alto */}
                <div
                  aria-hidden
                  className="h-16 md:h-24 w-px mb-6"
                  style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--crema) 40%, transparent))" }}
                />
                {/* nodo / forma sospesa */}
                <div
                  aria-hidden
                  className="mb-6 shrink-0"
                  style={{
                    width: i === 0 ? 110 : i === 1 ? 88 : i === 2 ? 70 : 96,
                    height: i === 0 ? 140 : i === 1 ? 110 : i === 2 ? 130 : 90,
                    background:
                      i === 0
                        ? "linear-gradient(180deg, #6b3d3d 0%, #4a2a2a 100%)"
                        : i === 1
                        ? "linear-gradient(180deg, #7c4a4a 0%, #4a2a2a 100%)"
                        : i === 2
                        ? "linear-gradient(180deg, #5c3d3d 0%, #3a2020 100%)"
                        : "linear-gradient(180deg, #8a6a5a 0%, #5c3d3d 100%)",
                    borderRadius:
                      i === 0 ? "40% 40% 45% 45% / 30% 30% 60% 60%" :
                      i === 1 ? "48% 48% 46% 46% / 45% 45% 55% 55%" :
                      i === 2 ? "35% 35% 40% 40% / 15% 15% 45% 45%" :
                      "30% 30% 8% 8% / 30% 30% 12% 12%",
                    boxShadow: "inset -10px -8px 20px rgba(0,0,0,0.35), inset 8px 8px 18px rgba(255,220,180,0.15), 0 20px 40px rgba(0,0,0,0.35)",
                  }}
                />
                <div
                  className="font-eyebrow text-[11px] md:text-[13px] tracking-[0.28em] text-center text-[color:var(--crema)]"
                  style={{ fontWeight: 500 }}
                >
                  {nome}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════ LA FARINA E LA FOCACCIA ══════════ */}
      <section
        className="relative py-24 md:py-36 px-6 md:px-14 overflow-hidden"
        aria-label="La farina e la focaccia"
        style={{
          background: "linear-gradient(180deg, #5c3d3d 0%, #a08668 25%, #efe6ce 100%)",
          color: "var(--marrone)",
        }}
      >
        {/* Superficie grano (reale) sfumata */}
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `url(${granoImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(1.1) saturate(0.7) sepia(0.15)",
            maskImage: "linear-gradient(180deg, transparent 0%, black 40%, black 100%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent 0%, black 40%, black 100%)",
          }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/75 tracking-[0.35em] mb-6">
            05 — DAL GRANO
          </div>
          <h2
            data-bigword
            className="font-display text-[color:var(--marrone)] leading-[0.95] mb-8 max-w-4xl"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300 }}
          >
            Accanto al banco,<br/>la farina della Masseria.
          </h2>
          <p className="text-[color:var(--marrone)]/85 text-lg md:text-xl max-w-3xl leading-relaxed mb-6">
            Il grano tenero coltivato nei terreni della Masseria diventa farina utilizzata anche per focaccia e frittelle.
          </p>
          <p className="text-[color:var(--marrone)]/65 text-sm md:text-base italic max-w-2xl leading-relaxed">
            La focaccia è stata segnalata nel fine settimana. La disponibilità va confermata direttamente.
          </p>

          {/* Filo oro che diventa bordo della focaccia */}
          <div className="relative mt-14 md:mt-20 flex justify-center">
            <svg viewBox="0 0 400 200" className="w-full max-w-2xl" aria-hidden>
              <path
                d="M 20 100 Q 100 40, 200 100 T 380 100"
                fill="none"
                stroke="var(--oro)"
                strokeWidth="1.5"
                opacity="0.7"
              />
              <ellipse
                cx="200"
                cy="130"
                rx="130"
                ry="35"
                fill="none"
                stroke="var(--oro)"
                strokeWidth="1"
                opacity="0.55"
              />
              <ellipse
                cx="200"
                cy="130"
                rx="110"
                ry="25"
                fill="color-mix(in oklab, #f4ecd8 80%, transparent)"
                opacity="0.6"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ══════════ PONTE VERSO LA BRACERIA ══════════ */}
      <section
        className="relative py-28 md:py-40 px-6 md:px-14 overflow-hidden"
        aria-label="Ponte verso la Braceria"
        style={{
          background: "linear-gradient(180deg, #efe6ce 0%, #d8c299 25%, #a5715a 65%, #6b3d2e 100%)",
          color: "var(--crema)",
        }}
      >
        {/* Linea oro che passa a terracotta locale */}
        <svg aria-hidden className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path
            d="M 8 15 Q 40 25, 55 55 T 92 88"
            fill="none"
            stroke="var(--oro)"
            strokeWidth="0.3"
            opacity="0.75"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="font-eyebrow text-[10px] md:text-[11px] tracking-[0.35em] mb-6" style={{ color: "color-mix(in oklab, var(--crema) 90%, transparent)" }}>
            06 — DOPO LA SCELTA
          </div>
          <h2
            data-bigword
            className="font-display leading-[0.95] mb-8"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)", fontWeight: 300, color: "var(--crema)" }}
          >
            Hai scelto.<br/>Ora siediti.
          </h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "color-mix(in oklab, var(--crema) 85%, transparent)" }}>
            Dal banco la carne passa alla cottura. Intanto il pasto è già cominciato.
          </p>

          {/* Sequenza SCEGLI · SIEDI · COTTURA · TAVOLA */}
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-14 font-eyebrow text-xs md:text-sm tracking-[0.3em]">
            {["SCEGLI", "SIEDI", "COTTURA", "TAVOLA"].map((w, i) => (
              <li key={w} className="flex items-center gap-3">
                <span
                  style={{
                    color: w === "COTTURA" ? "#e88b5c" : "color-mix(in oklab, var(--crema) 90%, transparent)",
                    fontWeight: w === "COTTURA" ? 600 : 400,
                  }}
                >
                  {w}
                </span>
                {i < 3 && <span aria-hidden style={{ color: "var(--oro)", opacity: 0.7 }}>—</span>}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
            <Link
              to="/braceria"
              className="group inline-flex items-center gap-3 px-8 py-4 min-h-[52px] font-eyebrow text-xs tracking-[0.35em] transition-all"
              style={{ background: "var(--crema)", color: "var(--marrone)" }}
            >
              ENTRA NELLA BRACERIA
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/caseificio"
              className="group inline-flex items-center gap-3 px-6 py-4 min-h-[52px] font-eyebrow text-xs tracking-[0.35em] border transition-all hover:bg-[color:var(--crema)]/10"
              style={{ borderColor: "color-mix(in oklab, var(--crema) 60%, transparent)", color: "var(--crema)" }}
            >
              TORNA AL CASEIFICIO
              <span className="transition-transform group-hover:-translate-x-1">←</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ NAV · LE QUATTRO ANIME ══════════ */}
      <NavAnime current="macelleria" />
    </div>
  );
}

/* ─────────────────── Diagramma (interattivo, accessibile) ─────────────────── */

function Diagramma({
  active,
  setActive,
  activeVoce,
}: {
  active: Voce["id"];
  setActive: (id: Voce["id"]) => void;
  activeVoce: Voce;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  // Ridisegno filo oro dal nodo attivo verso il pannello dx (soltanto informativo)
  useEffect(() => {
    if (!lineRef.current || !svgRef.current) return;
    const line = lineRef.current;
    const len = line.getTotalLength();
    line.style.strokeDasharray = String(len);
    line.style.strokeDashoffset = String(len);
    // trigger reflow
    void line.getBoundingClientRect();
    line.style.transition = "stroke-dashoffset .8s ease";
    line.style.strokeDashoffset = "0";
  }, [active]);

  return (
    <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
      {/* SILHOUETTE + PUNTI */}
      <div className="md:col-span-7 relative">
        <div
          className="relative rounded-sm p-6 md:p-10"
          style={{
            background: "color-mix(in oklab, var(--crema) 55%, transparent)",
            border: "1px solid color-mix(in oklab, var(--marrone) 25%, transparent)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="font-eyebrow text-[10px] md:text-[11px] text-[color:var(--marrone)]/70 tracking-[0.3em]">
              ESPLORA IL BANCO
            </div>
            <div className="font-eyebrow text-[10px] text-[color:var(--marrone)]/50 tracking-[0.3em] hidden md:block">
              ANTERIORE · CENTRO · POSTERIORE
            </div>
          </div>

          <svg
            ref={svgRef}
            viewBox="0 0 400 260"
            className="w-full h-auto"
            role="img"
            aria-label="Silhouette editoriale di un bovino con punti attivi sul banco"
          >
            {/* Silhouette bovina editoriale — profilo semplice */}
            <g stroke="var(--marrone)" strokeWidth="1.5" fill="color-mix(in oklab, var(--crema) 70%, transparent)" strokeLinejoin="round" strokeLinecap="round">
              <path d="M 60 150
                       Q 55 100, 90 90
                       L 110 80
                       Q 130 65, 155 72
                       Q 175 66, 195 80
                       L 265 82
                       Q 300 82, 315 100
                       L 325 130
                       L 315 160
                       L 305 165
                       L 300 200
                       L 285 205
                       L 285 175
                       L 210 175
                       L 210 205
                       L 195 205
                       L 195 175
                       L 130 175
                       L 130 205
                       L 115 205
                       L 115 172
                       Q 78 175, 68 165 Z" />
              {/* Occhio + orecchio */}
              <circle cx="102" cy="100" r="2" fill="var(--marrone)" stroke="none" />
              <path d="M 92 82 L 88 70 L 96 78 Z" fill="var(--marrone)" opacity="0.7" />
              {/* Coda */}
              <path d="M 325 130 Q 340 130, 340 155 Q 340 170, 335 175" fill="none" />
            </g>

            {/* Divisioni delicate: anteriore · centro · posteriore */}
            <g stroke="var(--marrone)" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.35">
              <line x1="150" y1="80" x2="150" y2="175" />
              <line x1="245" y1="80" x2="245" y2="175" />
            </g>
            <g fill="var(--marrone)" opacity="0.4" style={{ font: "8px sans-serif", letterSpacing: "0.15em" }}>
              <text x="90" y="230" textAnchor="middle">ANTERIORE</text>
              <text x="195" y="230" textAnchor="middle">CENTRO</text>
              <text x="285" y="230" textAnchor="middle">POSTERIORE</text>
            </g>

            {/* Area separata: PREPARAZIONI DEL BANCO */}
            <g>
              <rect
                x="335"
                y="30"
                width="60"
                height="205"
                rx="2"
                fill="color-mix(in oklab, var(--crema) 90%, transparent)"
                stroke="var(--marrone)"
                strokeWidth="0.8"
                opacity="0.6"
              />
              <text
                x="365"
                y="24"
                textAnchor="middle"
                fill="var(--marrone)"
                opacity="0.55"
                style={{ font: "7px sans-serif", letterSpacing: "0.18em" }}
              >
                PREPARAZIONI DEL BANCO
              </text>
            </g>

            {/* Filo oro dal punto attivo verso dx (uscente) */}
            <path
              ref={lineRef}
              d={`M ${activeVoce.x} ${activeVoce.y} L 400 ${activeVoce.y}`}
              stroke="var(--oro)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.85"
            />

            {/* Nodi cliccabili */}
            {VOCI.map((v) => {
              const isActive = v.id === active;
              return (
                <g key={v.id}>
                  {/* touch target invisibile 44x44 */}
                  <rect
                    x={v.x - 22}
                    y={v.y - 22}
                    width="44"
                    height="44"
                    fill="transparent"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setActive(v.id)}
                    onFocus={() => setActive(v.id)}
                    onClick={() => setActive(v.id)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isActive}
                    aria-label={`${v.label} — ${v.cat.toLowerCase()}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActive(v.id);
                      }
                    }}
                  />
                  {/* punto visibile */}
                  <circle
                    cx={v.x}
                    cy={v.y}
                    r={isActive ? 7 : 5}
                    fill={isActive ? "#a5715a" : "color-mix(in oklab, var(--crema) 90%, transparent)"}
                    stroke="var(--marrone)"
                    strokeWidth="1.2"
                    style={{ transition: "r .3s, fill .3s" }}
                  />
                  {isActive && (
                    <circle cx={v.x} cy={v.y} r="12" fill="none" stroke="var(--oro)" strokeWidth="1" opacity="0.75" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* PANNELLO INFORMATIVO */}
      <div className="md:col-span-5">
        <div
          className="p-6 md:p-8 rounded-sm"
          style={{
            background: "color-mix(in oklab, var(--crema) 85%, transparent)",
            border: "1px solid color-mix(in oklab, var(--marrone) 20%, transparent)",
          }}
          aria-live="polite"
        >
          <div className="font-eyebrow text-[10px] tracking-[0.35em] mb-3" style={{ color: activeVoce.isCut ? "var(--oliva)" : "var(--bordeaux)" }}>
            {activeVoce.cat}
          </div>
          <h3
            className="font-display text-3xl md:text-4xl text-[color:var(--marrone)] leading-tight mb-4"
            style={{ fontWeight: 300 }}
          >
            {activeVoce.titolo}
          </h3>
          <p className="text-[color:var(--marrone)]/85 text-base md:text-lg leading-relaxed mb-4">
            {activeVoce.testo}
          </p>
          {activeVoce.nota && (
            <p className="text-[color:var(--marrone)]/65 text-sm italic border-l-2 pl-3" style={{ borderColor: "var(--oro)" }}>
              {activeVoce.nota}
            </p>
          )}
        </div>

        {/* Legenda tappabile (mobile + tastiera) */}
        <ul className="mt-6 grid grid-cols-2 md:grid-cols-1 gap-2">
          {VOCI.map((v) => {
            const isActive = v.id === active;
            return (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => setActive(v.id)}
                  aria-pressed={isActive}
                  className="w-full text-left flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-sm transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    background: isActive ? "color-mix(in oklab, var(--marrone) 12%, transparent)" : "transparent",
                    border: "1px solid color-mix(in oklab, var(--marrone) 18%, transparent)",
                  }}
                >
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: isActive ? "#a5715a" : "color-mix(in oklab, var(--marrone) 40%, transparent)" }}
                  />
                  <span className="font-eyebrow text-[11px] tracking-[0.2em] text-[color:var(--marrone)]/85">
                    {v.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────── Nav Anime ─────────────────── */
function NavAnime({ current }: { current: "allevamento" | "caseificio" | "macelleria" | "braceria" }) {
  const items = [
    { key: "allevamento", n: "01", nome: "ALLEVAMENTO", sub: "La terra e gli animali", to: "/allevamento" as const },
    { key: "caseificio", n: "02", nome: "CASEIFICIO", sub: "Il bianco prende forma", to: "/caseificio" as const },
    { key: "macelleria", n: "03", nome: "MACELLERIA", sub: "Pagina corrente", to: "/macelleria" as const },
    { key: "braceria", n: "04", nome: "BRACERIA", sub: "La sera prende posto", to: "/braceria" as const },
  ];

  return (
    <nav
      aria-label="Le quattro anime della Masseria"
      className="relative px-6 md:px-14 py-20 md:py-28"
      style={{ background: "var(--crema)", color: "var(--marrone)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="font-eyebrow text-[10px] md:text-[11px] tracking-[0.35em] opacity-70 mb-4">
          CONTINUA NELLA MASSERIA
        </div>
        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-10 md:mb-14" style={{ fontWeight: 300 }}>
          Continua nella Masseria
        </h2>
        <ul className="divide-y divide-[color:var(--marrone)]/20 border-y border-[color:var(--marrone)]/20">
          {items.map((it) => {
            const isCurrent = it.key === current;
            const content = (
              <div className="flex items-center gap-4 md:gap-8 py-5 md:py-6 group">
                <span className="font-eyebrow text-xs md:text-sm opacity-60 tracking-[0.2em] w-10">{it.n}</span>
                <span className="font-display text-2xl md:text-4xl flex-shrink-0" style={{ fontWeight: 300 }}>
                  {it.nome}
                </span>
                <span className="hidden md:block flex-1 h-px bg-[color:var(--marrone)]/25 group-hover:bg-[color:var(--marrone)]/50 transition-colors" />
                <span className="text-sm md:text-base italic opacity-70 flex-1 md:flex-none">{it.sub}</span>
                {!isCurrent && <span className="font-eyebrow text-lg transition-transform group-hover:translate-x-1">→</span>}
              </div>
            );
            return (
              <li key={it.key}>
                {isCurrent ? (
                  <div className="opacity-50 px-2" aria-current="page">{content}</div>
                ) : (
                  <Link to={it.to} className="block hover:bg-[color:var(--marrone)]/5 transition-colors px-2">
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
