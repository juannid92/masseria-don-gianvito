import { useEffect, useRef, useState, useCallback, useId } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import heroAerialAsset from "@/assets/masseria-aerial.asset.json";
import pinAllevamentoImg from "@/assets/pin-allevamento.jpg";
import pinCaseificioImg from "@/assets/pin-caseificio.jpg";
import pinMacelleriaImg from "@/assets/pin-macelleria.jpg";
import pinBraceriaImg from "@/assets/pin-braceria.jpg";

/* ──────────────────────────────────────────────────────────────
 * HERO — "IL SORVOLO · LA MAPPA CATASTALE VIVENTE"
 * Concept-first: la masseria vista dall'alto come un unico
 * organismo. Un filo d'oro catastale collega i 4 mestieri
 * (sigilli di brace incandescenti). Click = tuffo nel luogo.
 * ───────────────────────────────────────────────────────────── */

type PinId = "allevamento" | "caseificio" | "macelleria" | "braceria";

type Pin = {
  id: PinId;
  label: string;
  eyebrow?: string;
  caption: string;
  description: string;
  thumb: string;
  coords: string;
  to: "/allevamento" | "/caseificio" | "/macelleria" | "/braceria";
  /** Posizione % sulla mappa (desktop) */
  top: number;
  left: number;
  /** Posizione % adattata al ritaglio mobile (contain, centrato) */
  mTop?: number;
  mLeft?: number;
  /** Etichetta editoriale: posizione del leader-line */
  labelSide: "left" | "right";
  labelDy: number; // offset verticale dell'etichetta in % rispetto al pin
};

// Coordinate desktop = % sul contenitore foto (cover, centrato).
// Coordinate mobile = % sul contenitore foto (contain, aspect 720/579,
// quindi identiche all'originale — nessuna deformazione).
const PINS: Pin[] = [
  {
    id: "caseificio",
    label: "Caseificio",
    eyebrow: "Il latte",
    caption: "Il latte di ogni mattina.",
    description: "Latte appena munto, lavorato a mano prima che il giorno cominci.",
    thumb: pinCaseificioImg,
    coords: "40.6427°N · 17.0418°E",
    to: "/caseificio",
    top: 48,
    left: 46,
    labelSide: "right",
    labelDy: -10,
  },
  {
    id: "macelleria",
    label: "Macelleria",
    eyebrow: "La carne",
    caption: "La carne, a vista.",
    description: "Banco a vista, tagli del giorno, frollature curate dal macellaio.",
    thumb: pinMacelleriaImg,
    coords: "40.6425°N · 17.0415°E",
    to: "/macelleria",
    top: 63,
    left: 38,
    labelSide: "left",
    labelDy: -10,
  },
  {
    id: "allevamento",
    label: "Stalla",
    eyebrow: "Allevamento",
    caption: "Dove tutto comincia.",
    description: "I nostri capi, sulla nostra terra. Murgia, aria aperta, tempo lento.",
    thumb: pinAllevamentoImg,
    coords: "40.6428°N · 17.0421°E",
    to: "/allevamento",
    top: 43,
    left: 79,
    labelSide: "left",
    labelDy: -8,
  },
  {
    id: "braceria",
    label: "Agriturismo",
    eyebrow: "La tavola",
    caption: "La brace, ogni sera.",
    description: "Cottura su brace viva, taglio e servizio al tavolo. Il rito.",
    thumb: pinBraceriaImg,
    coords: "40.6424°N · 17.0419°E",
    to: "/braceria",
    top: 69,
    left: 34,
    labelSide: "right",
    labelDy: 10,
  },
];

const heroAerial = heroAerialAsset.url;

/* ─────────── L3 · CATASTAL OVERLAY + FILO D'ORO ───────────
 * Linee topografiche di sfondo + UN UNICO percorso d'oro
 * che attraversa i 4 sigilli — la prova visiva della filiera.
 */
function CatastalOverlay() {
  // path che collega i 4 pin nell'ordine di filiera
  const order: PinId[] = ["allevamento", "caseificio", "macelleria", "braceria"];
  const pts = order.map((id) => PINS.find((p) => p.id === id)!);
  const filo = `M${pts[0].left},${pts[0].top} C${pts[0].left + 18},${pts[0].top - 18} ${pts[1].left - 12},${pts[1].top + 14} ${pts[1].left},${pts[1].top} S${pts[2].left - 14},${pts[2].top - 4} ${pts[2].left},${pts[2].top} S${pts[3].left + 8},${pts[3].top + 12} ${pts[3].left},${pts[3].top}`;

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden
    >
      {/* Linee catastali di sfondo */}
      <g
        fill="none"
        stroke="#c49a4a"
        strokeWidth="0.12"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ mixBlendMode: "overlay", opacity: 0.45 }}
      >
        <path data-catastal-path d="M2,18 Q22,14 38,22 T70,28 T98,22" />
        <path data-catastal-path d="M4,42 Q28,38 50,46 T82,52 L98,50" />
        <path data-catastal-path d="M0,66 Q24,60 46,68 T78,74 L100,70" />
        <path data-catastal-path d="M14,2 Q18,30 22,58 T28,98" />
        <path data-catastal-path d="M52,0 Q56,28 50,54 T58,100" />
        <path data-catastal-path d="M82,4 Q86,32 80,60 T86,100" />
        <path data-catastal-path strokeDasharray="0.6 0.9" d="M6,30 L94,34" />
        <path data-catastal-path strokeDasharray="0.6 0.9" d="M10,78 L90,82" />
      </g>

      {/* IL FILO D'ORO — connessione dei 4 mestieri */}
      <path
        data-filo-shadow
        d={filo}
        fill="none"
        stroke="#1a1210"
        strokeWidth="0.55"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity="0.6"
      />
      <path
        data-filo
        d={filo}
        fill="none"
        stroke="#c49a4a"
        strokeWidth="0.28"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "drop-shadow(0 0 4px rgba(196,154,74,0.6))" }}
      />

      {/* Micro-annotazioni angolari (Oswald monospace look) */}
      <g
        fill="#c49a4a"
        fontSize="1.1"
        fontFamily="ui-monospace, monospace"
        opacity="0.6"
      >
        <text x="2.5" y="3.5">FOGLIO 12 · NOCI (BA)</text>
        <text x="74" y="3.5">SETTORE IV</text>
        <text x="2.5" y="98.5">PART. 437 · 439 · 441</text>
        <text x="76" y="98.5">SCALA 1:2000</text>
      </g>
    </svg>
  );
}

/* Grana cinematografica via SVG turbulence */
function FilmGrain() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
      style={{ mixBlendMode: "overlay", opacity: 0.07 }}
    >
      <filter id={`grain-${id}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${id})`} />
    </svg>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

export function Hero() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const catastalRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const pinLayerRef = useRef<HTMLDivElement>(null);
  const letterTopRef = useRef<HTMLDivElement>(null);
  const letterBotRef = useRef<HTMLDivElement>(null);
  const viewfinderRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const [hoverPin, setHoverPin] = useState<PinId | null>(null);
  const [focusPin, setFocusPin] = useState<PinId | null>(null);
  const [sheetPin, setSheetPin] = useState<PinId | null>(null);
  const [diving, setDiving] = useState<PinId | null>(null);
  const [touch, setTouch] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    // Js-ready guard: contenuto sempre visibile in fallback, ma sblocca
    // l'intro cinematografica una volta che JS è in piedi.
    setReady(true);
  }, []);

  const activePin = hoverPin ?? focusPin;

  /* ─── INTRO TIMELINE · AMBIENT LOOP · SCROLL OUTRO ─── */
  useEffect(() => {
    if (reduced || !ready || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger, Flip);

    const ctx = gsap.context(() => {
      // Stato iniziale (solo con JS attivo: il fallback resta visibile)
      gsap.set([letterTopRef.current, letterBotRef.current], { height: "12vh" });
      gsap.set(photoRef.current, {
        scale: 1.18,
        filter: "blur(8px) brightness(0.65)",
        transformOrigin: "50% 55%",
      });
      gsap.set("[data-catastal-path]", {
        strokeDasharray: 220,
        strokeDashoffset: 220,
      });
      gsap.set("[data-filo], [data-filo-shadow]", {
        strokeDasharray: 320,
        strokeDashoffset: 320,
      });
      gsap.set("[data-ghost]", { opacity: 0, y: 30 });
      gsap.set("[data-copy-line]", {
        clipPath: "inset(100% 0 0 0)",
        y: 24,
        opacity: 0,
      });
      gsap.set("[data-eyebrow]", { opacity: 0, letterSpacing: "0.12em" });
      gsap.set("[data-meta]", { opacity: 0, y: 8 });
      gsap.set("[data-meta-rule]", { scaleX: 0 });
      gsap.set("[data-cta]", { opacity: 0, y: 16 });
      gsap.set("[data-pin]", { scale: 0, opacity: 0 });
      gsap.set("[data-pin-label], [data-pin-leader]", { opacity: 0 });
      gsap.set("[data-cue]", { opacity: 0 });
      gsap.set("[data-monogram]", {
        scale: 0.4,
        opacity: 0,
        transformOrigin: "50% 50%",
      });
      gsap.set("[data-wordmark-rule]", { scaleX: 0 });
      if (viewfinderRef.current) gsap.set(viewfinderRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Letterbox cinemascope
      tl.to([letterTopRef.current, letterBotRef.current], {
        height: 0,
        duration: 0.8,
        ease: "power3.inOut",
      });

      // 2. La mappa "arriva" (drone che scende)
      tl.to(
        photoRef.current,
        {
          scale: 1.04,
          filter: "blur(0px) brightness(1)",
          duration: 1.6,
          ease: "expo.out",
        },
        0.2,
      );

      // 3. Parola-fantasma (NOCI)
      tl.to("[data-ghost]", { opacity: 0.07, y: 0, duration: 1.2 }, 0.4);

      // 4. Linee catastali di sfondo
      tl.to(
        "[data-catastal-path]",
        { strokeDashoffset: 0, duration: 1.2, stagger: 0.05 },
        0.6,
      );

      // 5. FILO D'ORO che si disegna (la firma)
      tl.to(
        ["[data-filo-shadow]", "[data-filo]"],
        { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.05 },
        0.9,
      );

      // 6. Metadati editoriali + filetti
      tl.to("[data-meta-rule]", { scaleX: 1, duration: 0.7 }, 1.1);
      tl.to("[data-meta]", { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, 1.2);

      // 7. Logotipo: monogramma DG → Masseria mask-reveal → filetti + DON GIANVITO
      tl.to(
        "[data-monogram]",
        { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(2)" },
        1.0,
      );
      tl.to(
        "[data-copy-line]",
        {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.1,
        },
        1.2,
      );
      tl.to("[data-eyebrow]", { opacity: 1, letterSpacing: "0.32em", duration: 0.8 }, 1.1);
      tl.to("[data-wordmark-rule]", { scaleX: 1, duration: 0.8 }, 1.4);

      // 8. CTA
      tl.to("[data-cta]", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 1.7);

      // 9. SIGILLI DI BRACE — si accendono in stagger come braci
      tl.to(
        "[data-pin]",
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "back.out(2.2)",
          stagger: 0.12,
        },
        1.6,
      );
      tl.to(
        ["[data-pin-leader]", "[data-pin-label]"],
        { opacity: 1, duration: 0.6, stagger: 0.08 },
        2.0,
      );

      // 10. Cue + viewfinder
      tl.to([viewfinderRef.current, "[data-cue]"].filter(Boolean) as gsap.TweenTarget[], { opacity: 1, duration: 0.6 }, 2.3);

      // Skip se l'utente scrolla durante l'intro
      const onScroll = () => {
        if (tl.progress() < 1) tl.timeScale(2.4);
      };
      window.addEventListener("scroll", onScroll, { passive: true, once: true });

      // Ambient drone-hover loop
      gsap.to(photoRef.current, {
        scale: 1.08,
        duration: 18,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2.6,
      });
      gsap.to(stageRef.current, {
        y: 6,
        duration: 7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Pin respiro (sfasati)
      gsap.utils.toArray<HTMLElement>("[data-pin-core]").forEach((el, i) => {
        gsap.to(el, {
          scale: 1.08,
          duration: 2.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.4,
        });
      });

      // Outro: parallax leggero su scroll
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
        animation: gsap
          .timeline()
          .to(stageRef.current, { yPercent: 12, ease: "none" }, 0)
          .to([copyRef.current, ghostRef.current], { opacity: 0, yPercent: -20, ease: "none" }, 0)
          .to("[data-meta]", { opacity: 0, ease: "none" }, 0),
      });

      return () => window.removeEventListener("scroll", onScroll);
    }, sectionRef);

    return () => ctx.revert();
  }, [reduced, ready]);

  /* ─── MOUSE PARALLAX + VIEWFINDER ─── */
  useEffect(() => {
    if (reduced || touch || !ready || typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    const xPhoto = gsap.quickTo(photoRef.current, "x", { duration: 0.9, ease: "power3.out" });
    const yPhoto = gsap.quickTo(photoRef.current, "y", { duration: 0.9, ease: "power3.out" });
    const xCat = gsap.quickTo(catastalRef.current, "x", { duration: 0.7, ease: "power3.out" });
    const yCat = gsap.quickTo(catastalRef.current, "y", { duration: 0.7, ease: "power3.out" });
    const xPins = gsap.quickTo(pinLayerRef.current, "x", { duration: 0.7, ease: "power3.out" });
    const yPins = gsap.quickTo(pinLayerRef.current, "y", { duration: 0.7, ease: "power3.out" });
    const xCopy = gsap.quickTo(copyRef.current, "x", { duration: 0.7, ease: "power3.out" });
    const yCopy = gsap.quickTo(copyRef.current, "y", { duration: 0.7, ease: "power3.out" });
    const xVF = gsap.quickTo(viewfinderRef.current, "x", { duration: 0.3, ease: "power3.out" });
    const yVF = gsap.quickTo(viewfinderRef.current, "y", { duration: 0.3, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      xPhoto(cx * -10);
      yPhoto(cy * -10);
      xCat(cx * -16);
      yCat(cy * -16);
      xPins(cx * -20);
      yPins(cy * -20);
      xCopy(cx * -24);
      yCopy(cy * -24);
      xVF(e.clientX - r.left);
      yVF(e.clientY - r.top);
    };

    section.addEventListener("mousemove", onMove);
    return () => section.removeEventListener("mousemove", onMove);
  }, [reduced, touch, ready]);

  /* ─── HOVER: SPOTLIGHT + DESATURAZIONE ─── */
  useEffect(() => {
    if (reduced) return;
    const stage = stageRef.current;
    const spot = spotlightRef.current;
    if (!stage || !spot) return;

    if (activePin) {
      const p = PINS.find((x) => x.id === activePin)!;
      gsap.to(stage, {
        filter: "brightness(0.55) saturate(0.6)",
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(spot, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        "--sx": `${p.left}%`,
        "--sy": `${p.top}%`,
        "--sr": "22vw",
      } as gsap.TweenVars);
    } else {
      gsap.to(stage, {
        filter: "brightness(1) saturate(1)",
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(spot, { opacity: 0, duration: 0.5, ease: "power2.out" });
    }
  }, [activePin, reduced]);

  /* ─── CLICK: TUFFO NEL LUOGO ─── */
  const dive = useCallback(
    (pin: Pin) => {
      if (reduced) {
        navigate({ to: pin.to });
        return;
      }
      if (diving) return;
      setDiving(pin.id);
      const spot = spotlightRef.current;
      const stage = stageRef.current;
      const tl = gsap.timeline({
        onComplete: () => navigate({ to: pin.to }),
      });
      if (spot) {
        gsap.set(spot, {
          "--sx": `${pin.left}%`,
          "--sy": `${pin.top}%`,
        } as gsap.TweenVars);
        tl.to(
          spot,
          {
            opacity: 1,
            "--sr": "180%",
            duration: 0.9,
            ease: "power3.inOut",
          } as gsap.TweenVars,
          0,
        );
      }
      if (stage) {
        tl.to(
          stage,
          {
            scale: 1.6,
            transformOrigin: `${pin.left}% ${pin.top}%`,
            filter: "brightness(1) saturate(1.1)",
            duration: 0.9,
            ease: "power3.inOut",
          },
          0,
        );
      }
      tl.to(
        [copyRef.current, pinLayerRef.current, viewfinderRef.current, ghostRef.current].filter(Boolean) as gsap.TweenTarget[],
        { opacity: 0, duration: 0.5, ease: "power2.out" },
        0,
      );
    },
    [diving, navigate, reduced],
  );

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[color:var(--carbone)]"
      style={{
        perspective: "1200px",
        cursor: !reduced && !touch ? "none" : "default",
      }}
      aria-label="Sorvolo cinematografico della Masseria Don Gianvito a Noci"
    >
      {/* STAGE: tutto ciò che riceve desat/zoom su hover/click */}
      <div ref={stageRef} className="absolute inset-0">
        {/* L0 — Mappa (foto aerea).
            Desktop: cover a tutto viewport, leggero over-crop per parallax.
            Mobile: contain con aspect nativo, così i 4 pin restano tutti
            dentro alla foto senza deformazione né bande nere (bg carbone). */}
        <div
          ref={photoRef}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-full aspect-[720/579] max-h-[100svh] md:inset-0 md:top-0 md:translate-y-0 md:aspect-auto md:h-full md:-m-[6%]"
        >
          <img
            src={heroAerial}
            alt="Veduta aerea di Masseria Don Gianvito nelle campagne di Noci"
            width={1920}
            height={1280}
            className="h-full w-full object-contain md:object-cover"
            style={{ objectPosition: "50% 50%" }}
            draggable={false}
            fetchPriority="high"
          />
        </div>

        {/* L1 — Overlay leggero per leggibilità (niente red grading forte) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 40%, rgba(26,18,16,0.35) 80%, rgba(26,18,16,0.72) 100%)",
          }}
        />


        {/* L2 — Grana */}
        <FilmGrain />

        {/* L3 — Mappa catastale + FILO D'ORO che collega i 4 mestieri */}
        <div ref={catastalRef} className="absolute inset-0">
          <CatastalOverlay />
        </div>

        {/* L4 — Spotlight su hover/click */}
        <div
          ref={spotlightRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0"
          style={
            {
              ["--sx" as string]: "50%",
              ["--sy" as string]: "50%",
              ["--sr" as string]: "22vw",
              background:
                "radial-gradient(circle var(--sr) at var(--sx) var(--sy), rgba(255,205,140,0.22) 0%, rgba(255,180,90,0.08) 30%, transparent 60%)",
              mixBlendMode: "screen",
            } as React.CSSProperties
          }
        />
      </div>

      {/* L3b — Parola-fantasma stratificata (sotto al copy, sopra alla mappa) */}
      <div
        ref={ghostRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[8] hidden items-center justify-center md:flex"
        style={{ mixBlendMode: "overlay" }}
      >
        <span
          data-ghost
          className="font-display whitespace-nowrap text-[color:var(--crema)] leading-none"
          style={{
            fontSize: "clamp(14rem, 28vw, 28rem)",
            opacity: 0.06,
            letterSpacing: "-0.04em",
            transform: "translateX(-2%)",
          }}
        >
          NOCI
        </span>
      </div>

      {/* Bordo notte basso per leggibilità CTA/cue */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[9] h-80"
        style={{
          background:
            "linear-gradient(0deg, var(--carbone) 0%, rgba(26,18,16,0.5) 50%, transparent 100%)",
        }}
      />

      {/* L6 — METADATI EDITORIALI (angoli) */}
      <div className="pointer-events-none absolute inset-0 z-30 hidden md:block">
        <div className="absolute left-6 top-24 flex items-center gap-3">
          <span
            data-meta-rule
            aria-hidden
            className="block h-px w-12 origin-left"
            style={{ background: "linear-gradient(90deg, var(--oro), transparent)" }}
          />
          <span
            data-meta
            className="font-eyebrow text-[10px] text-[color:var(--oro)]"
            style={{ letterSpacing: "0.32em" }}
          >
            QUI NON ARRIVA NIENTE DA FUORI
          </span>
        </div>
        <div className="absolute right-6 top-24">
          <span
            data-meta
            className="font-eyebrow text-[10px] text-[color:var(--crema)]/70"
            style={{ letterSpacing: "0.28em" }}
          >
            40.642°N — 17.042°E
          </span>
        </div>
        <div className="absolute bottom-24 right-6 flex items-center gap-3">
          <span
            data-meta
            className="font-eyebrow text-[10px] text-[color:var(--crema)]/70"
            style={{ letterSpacing: "0.28em" }}
          >
            MASSERIA · NOCI · PUGLIA
          </span>
          <span
            data-meta-rule
            aria-hidden
            className="block h-px w-12 origin-right"
            style={{ background: "linear-gradient(270deg, var(--oro), transparent)" }}
          />
        </div>
      </div>

      {/* L5 — PIN LAYER (desktop) */}
      <div
        ref={pinLayerRef}
        className="pointer-events-none absolute inset-0 z-40 hidden md:block"
      >
        {PINS.map((p) => {
          const isActive = activePin === p.id;
          const isOtherActive = activePin && !isActive;
          const showCard = isActive;
          const cardFlipRight = p.left < 42;
          const cardFlipDown = p.top < 28;
          const leaderRight = p.labelSide === "right";

          return (
            <div
              key={p.id}
              className="absolute"
              style={{ top: `${p.top}%`, left: `${p.left}%` }}
            >
              {/* Etichetta editoriale + leader-line (SEMPRE visibile) */}
              <div
                className="absolute"
                style={{
                  top: `${p.labelDy}%`,
                  [leaderRight ? "left" : "right"]: "18px",
                  transform: `translateY(-50%)`,
                  opacity: isOtherActive ? 0.35 : 1,
                  transition: "opacity .35s",
                }}
              >
                <div
                  className={[
                    "flex items-center gap-3",
                    leaderRight ? "flex-row" : "flex-row-reverse",
                  ].join(" ")}
                >
                  <span
                    data-pin-leader
                    aria-hidden
                    className="block h-px w-[56px] shrink-0"
                    style={{
                      background: leaderRight
                        ? "linear-gradient(90deg, var(--oro), transparent)"
                        : "linear-gradient(270deg, var(--oro), transparent)",
                    }}
                  />
                  <div
                    data-pin-label
                    className={[
                      "whitespace-nowrap",
                      leaderRight ? "text-left" : "text-right",
                    ].join(" ")}
                  >
                    <p
                      className="font-eyebrow text-[10px] text-[color:var(--oro)]"
                      style={{ letterSpacing: "0.28em" }}
                    >
                      {p.label}
                    </p>
                    <p className="font-display text-[15px] italic leading-tight text-[color:var(--crema)]">
                      {p.caption}
                    </p>
                    <p className="mt-0.5 font-eyebrow text-[9px] tracking-[0.22em] text-[color:var(--crema)]/55">
                      {p.coords}
                    </p>
                  </div>
                </div>
              </div>

              {/* SIGILLO DI BRACE */}
              <div
                data-pin
                className="pointer-events-auto absolute"
                style={{
                  top: 0,
                  left: 0,
                  transform: "translate(-50%, -50%)",
                  opacity: isOtherActive ? 0.55 : 1,
                  transition: "opacity .35s",
                }}
              >
                <motion.button
                  type="button"
                  onMouseEnter={() => setHoverPin(p.id)}
                  onMouseLeave={() => setHoverPin(null)}
                  onFocus={() => setFocusPin(p.id)}
                  onBlur={() => setFocusPin(null)}
                  onClick={() => dive(p)}
                  aria-label={`Apri ${p.label} — ${p.description}`}
                  whileHover={{ scale: 1.25 }}
                  whileFocus={{ scale: 1.25 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                  className="group relative block h-7 w-7 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--oro)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--carbone)]"
                >
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(196,154,74,0.55) 0%, rgba(179,58,26,0.32) 35%, transparent 70%)",
                      filter: "blur(2px)",
                    }}
                  />
                  <span
                    data-pin-core
                    aria-hidden
                    className="relative block h-7 w-7 rounded-full border-[1.5px] border-[color:var(--oro)] shadow-[0_8px_24px_-4px_rgba(179,58,26,0.7),inset_0_0_8px_rgba(0,0,0,0.4)]"
                    style={{ background: "var(--grad-ember)" }}
                  >
                    <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--crema)]/95 shadow-[0_0_8px_rgba(242,232,213,0.9)]" />
                  </span>
                </motion.button>

                {/* Preview card su hover/focus */}
                <AnimatePresence>
                  {showCard && (
                    <motion.div
                      initial={{ opacity: 0, y: cardFlipDown ? -8 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: cardFlipDown ? -8 : 8 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className={[
                        "pointer-events-auto absolute z-50 w-[300px]",
                        cardFlipDown ? "top-8" : "bottom-8",
                        cardFlipRight ? "left-6" : "right-6",
                      ].join(" ")}
                    >
                      <a
                        href={p.to}
                        onClick={(e) => {
                          e.preventDefault();
                          dive(p);
                        }}
                        className="block overflow-hidden rounded-2xl border border-[color:var(--oro)]/45 bg-[color:var(--carbone)]/95 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.85),0_0_0_1px_rgba(196,154,74,0.15)] transition-transform hover:scale-[1.015]"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <img
                            src={p.thumb}
                            alt=""
                            loading="lazy"
                            width={640}
                            height={400}
                            className="h-full w-full object-cover"
                            draggable={false}
                          />
                          <div
                            aria-hidden
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(180deg, transparent 50%, rgba(26,18,16,0.85) 100%)",
                            }}
                          />
                        </div>
                        <div className="px-4 pb-4 pt-3">
                          <p
                            className="font-eyebrow text-[10px] text-[color:var(--oro)]"
                            style={{ letterSpacing: "0.28em" }}
                          >
                            {p.label}
                          </p>
                          <p className="mt-1.5 text-[13px] leading-snug text-[color:var(--crema)]/90">
                            {p.description}
                          </p>
                          <p
                            className="mt-3 font-eyebrow text-[10px] text-[color:var(--terracotta)]"
                            style={{ letterSpacing: "0.28em" }}
                          >
                            Scopri →
                          </p>
                        </div>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* L4b — LOGOTIPO (pointer-events:none, CTA riattivano) */}
      <div
        ref={copyRef}
        className="pointer-events-none relative z-20 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{
          opacity: activePin ? 0.22 : 1,
          transition: "opacity .35s",
        }}
      >
        <div className="relative flex max-w-3xl flex-col items-center">
          {/* Velo locale per leggibilità AA sopra alla mappa */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-20 -inset-y-16 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 75% at 50% 55%, rgba(26,18,16,0.78) 0%, rgba(61,42,30,0.38) 55%, transparent 88%)",
            }}
          />

          {/* Eyebrow */}
          <div data-copy-line className="overflow-hidden">
            <p
              data-eyebrow
              className="font-eyebrow text-[10px] text-[color:var(--oro)] md:text-xs"
              style={{ letterSpacing: "0.32em" }}
            >
              IL RITO DELLA BRACE
            </p>
          </div>

          {/* Monogramma DG — sigillo ceralacca */}
          <div
            data-monogram
            className="mt-5 flex h-16 w-16 items-center justify-center rounded-full border-[1.5px] border-[color:var(--oro)] shadow-[0_10px_30px_-6px_rgba(179,58,26,0.7),inset_0_0_10px_rgba(0,0,0,0.45)]"
            style={{ background: "var(--grad-ember)" }}
            aria-hidden
          >
            <span
              className="font-display text-[26px] italic leading-none text-[color:var(--crema)]"
              style={{ textShadow: "0 1px 0 rgba(0,0,0,0.4)" }}
            >
              DG
            </span>
          </div>

          {/* Logotipo */}
          <h1 className="mt-5 flex flex-col items-center text-[color:var(--crema)]">
            <span data-copy-line className="block overflow-hidden leading-none">
              <span
                className="font-display block leading-[0.95]"
                style={{ fontSize: "clamp(2.6rem, 7.5vw, 6.5rem)" }}
              >
                <span className="italic">M</span>asseria
              </span>
            </span>

            <span
              className="mt-4 flex w-full items-center justify-center gap-4"
              aria-label="Don Gianvito"
            >
              <span
                data-wordmark-rule
                aria-hidden
                className="h-px w-[clamp(40px,12vw,140px)] origin-right"
                style={{
                  background: "linear-gradient(90deg, transparent, var(--oro))",
                }}
              />
              <span
                className="font-eyebrow whitespace-nowrap text-[color:var(--oro)]"
                style={{
                  fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)",
                  letterSpacing: "0.35em",
                }}
              >
                DON GIANVITO
              </span>
              <span
                data-wordmark-rule
                aria-hidden
                className="h-px w-[clamp(40px,12vw,140px)] origin-left"
                style={{
                  background: "linear-gradient(270deg, transparent, var(--oro))",
                }}
              />
            </span>
          </h1>

          {/* Microriga mestieri */}
          <div data-copy-line className="mt-6 overflow-hidden">
            <p
              className="font-sans text-[13px] text-[color:var(--crema)]/75 md:text-[14px]"
              style={{ letterSpacing: "0.1em" }}
            >
              Allevamento · Caseificio · Macelleria · Braceria
              <span className="text-[color:var(--oro)]/70"> — Noci, Puglia</span>
            </p>
          </div>

          {/* CTA */}
          <div className="pointer-events-auto mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <MagneticCTA data-cta as="a" href="tel:+393339395750" primary>
              Prenota un tavolo
            </MagneticCTA>
            <MagneticCTA
              data-cta
              as="button"
              onClick={() => {
                const next = sectionRef.current?.nextElementSibling as HTMLElement | null;
                next?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Entra nella masseria
            </MagneticCTA>
          </div>
        </div>
      </div>

      {/* L7 — LETTERBOX */}
      <div
        ref={letterTopRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-40 bg-[color:var(--carbone)]"
      />
      <div
        ref={letterBotRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 bg-[color:var(--carbone)]"
      />

      {/* VIEWFINDER cursor (desktop, no-touch) */}
      {!reduced && !touch && (
        <div
          ref={viewfinderRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-50 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative h-10 w-10">
            <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-[color:var(--oro)]" />
            <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-[color:var(--oro)]" />
            <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-[color:var(--oro)]" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-[color:var(--oro)]" />
            <span className="absolute left-1/2 top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-[color:var(--oro)]/70" />
            <span className="absolute left-1/2 top-1/2 h-px w-2 -translate-x-1/2 -translate-y-1/2 bg-[color:var(--oro)]/70" />
          </div>
          <AnimatePresence>
            {hoverPin && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-eyebrow absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[0.25em] text-[color:var(--oro)]"
              >
                APRI →
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Scroll cue */}
      <div
        data-cue
        aria-hidden
        className="absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-[color:var(--crema)]/70 md:flex"
      >
        <span className="font-eyebrow text-[9px] tracking-[0.3em]">SORVOLA</span>
        <motion.span
          aria-hidden
          className="block h-8 w-px"
          style={{
            transformOrigin: "top",
            background: "linear-gradient(180deg, var(--oro), transparent)",
          }}
          animate={reduced ? undefined : { scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* MOBILE — Sigilli sulla mappa + bottom-sheet */}
      <div className="absolute inset-0 z-40 md:hidden">
        {PINS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSheetPin(p.id)}
            aria-label={`Apri ${p.label}`}
            className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[color:var(--oro)] shadow-[0_8px_24px_-4px_rgba(179,58,26,0.7)]"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              background: "var(--grad-ember)",
            }}
          >
            <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--crema)]" />
          </button>
        ))}
      </div>

      {/* MOBILE BOTTOM-SHEET */}
      <AnimatePresence>
        {sheetPin && (
          <>
            <motion.div
              key="sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSheetPin(null)}
              className="absolute inset-0 z-[55] bg-[color:var(--carbone)]/70 md:hidden"
            />
            {(() => {
              const p = PINS.find((x) => x.id === sheetPin)!;
              return (
                <motion.div
                  key="sheet"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 280, damping: 32 }}
                  className="absolute inset-x-0 bottom-0 z-[56] rounded-t-3xl border-t border-[color:var(--oro)]/35 bg-[color:var(--carbone)]/98 p-5 md:hidden"
                >
                  <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[color:var(--crema)]/30" />
                  <div className="overflow-hidden rounded-2xl">
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <img
                        src={p.thumb}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </div>
                  </div>
                  <p
                    className="font-eyebrow mt-4 text-[10px] text-[color:var(--oro)]"
                    style={{ letterSpacing: "0.28em" }}
                  >
                    {p.label}
                  </p>
                  <p className="mt-1 font-display text-2xl italic text-[color:var(--crema)]">
                    {p.caption}
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--crema)]/80">
                    {p.description}
                  </p>
                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSheetPin(null);
                        dive(p);
                      }}
                      className="bg-grad-brace inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 font-eyebrow text-[11px] tracking-[0.22em] text-[color:var(--crema)] shadow-[0_14px_36px_-10px_rgba(179,58,26,0.65)]"
                    >
                      Scopri →
                    </button>
                    <button
                      type="button"
                      onClick={() => setSheetPin(null)}
                      className="inline-flex items-center justify-center rounded-full border border-[color:var(--oro)]/50 px-5 py-3 font-eyebrow text-[11px] tracking-[0.22em] text-[color:var(--crema)]"
                    >
                      Chiudi
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </>
        )}
      </AnimatePresence>

      {/* DIVE OVERLAY — blocca interazioni durante la transizione */}
      {diving && (
        <div className="pointer-events-auto absolute inset-0 z-[60]" aria-hidden />
      )}
    </section>
  );
}

/* ─────────────────────── MAGNETIC CTA ─────────────────────── */

type CTABase = {
  primary?: boolean;
  children: React.ReactNode;
};
type CTAProps =
  | (CTABase & React.ButtonHTMLAttributes<HTMLButtonElement> & { as: "button" })
  | (CTABase & React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" });

function MagneticCTA(props: CTAProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const xT = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const yT = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xT((e.clientX - (r.left + r.width / 2)) * 0.25);
      yT((e.clientY - (r.top + r.height / 2)) * 0.25);
    };
    const onLeave = () => {
      xT(0);
      yT(0);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  const cls = props.primary
    ? "bg-grad-brace inline-flex items-center justify-center rounded-full px-7 py-3.5 font-eyebrow text-[11px] tracking-[0.22em] text-[color:var(--crema)] shadow-[0_14px_36px_-10px_rgba(179,58,26,0.65)] ring-1 ring-white/10 will-change-transform"
    : "inline-flex items-center justify-center rounded-full border border-[color:var(--oro)]/55 px-7 py-3.5 font-eyebrow text-[11px] tracking-[0.22em] text-[color:var(--crema)] transition-colors hover:bg-[color:var(--oro)]/10 will-change-transform";

  if (props.as === "a") {
    const { as: _as, primary: _p, children, ...rest } = props;
    return (
      <a
        ref={(el) => {
          ref.current = el;
        }}
        className={cls}
        {...rest}
      >
        {children}
      </a>
    );
  }
  const { as: _as, primary: _p, children, ...rest } = props;
  return (
    <button
      ref={(el) => {
        ref.current = el;
      }}
      className={cls}
      {...rest}
    >
      {children}
    </button>
  );
}
