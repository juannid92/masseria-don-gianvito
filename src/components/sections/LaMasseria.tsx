import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import masseriaImg from "@/assets/home-masseria.jpg";
import olivesImg from "@/assets/home-olives-foreground.png";

gsap.registerPlugin(ScrollTrigger);

const DATA = [
  { k: "DAL", v: 2002, suffix: "" },
  { k: "SPECIE", v: 5, suffix: "" },
  { k: "MESTIERI", v: 4, suffix: "" },
  { k: "MASSERIA", v: 1, suffix: "" },
] as const;

export function LaMasseria() {
  const rootRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const houseRef = useRef<HTMLDivElement>(null);
  const olivesRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const closingRef = useRef<HTMLParagraphElement>(null);
  const numsRef = useRef<HTMLUListElement>(null);
  const threadRef = useRef<SVGPathElement>(null);

  // Framer scroll for numbers skew
  const { scrollY } = useScroll();
  const rawVelocity = useVelocity(scrollY);
  const smoothVel = useSpring(rawVelocity, { damping: 40, stiffness: 200 });
  const skewY = useTransform(smoothVel, [-2000, 0, 2000], [2, 0, -2]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    const safety = window.setTimeout(() => {
      gsap.set(root.querySelectorAll("[data-reveal]"), { autoAlpha: 1, y: 0, clipPath: "inset(0 0 0 0)" });
    }, 3000);

    mm.add(
      {
        isDesktop: "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
        isMobile: "(max-width: 899px) and (prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isDesktop, isMobile, reduced } = ctx.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          reduced: boolean;
        };

        // Parallax
        if (!reduced) {
          const skyAmt = isDesktop ? -3 : -1;
          const houseAmt = isDesktop ? -20 : -6;
          const olivesAmt = isDesktop ? -8 : 0;

          gsap.to(skyRef.current, {
            yPercent: skyAmt,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 },
          });
          gsap.to(houseRef.current, {
            yPercent: houseAmt,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 },
          });
          if (isDesktop && olivesRef.current) {
            gsap.to(olivesRef.current, {
              yPercent: olivesAmt,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 },
            });
          }
        }

        // Title word reveal
        const words = titleRef.current?.querySelectorAll<HTMLElement>("[data-word]") ?? [];
        gsap.set(words, { yPercent: 110 });
        gsap.to(words, {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "cubic-bezier(0.16,1,0.3,1)" as unknown as string,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            once: true,
          },
        });

        // Count up numbers
        const nums = numsRef.current?.querySelectorAll<HTMLElement>("[data-count]") ?? [];
        nums.forEach((el) => {
          const target = Number(el.dataset.count ?? "0");
          const obj = { n: 0 };
          gsap.to(obj, {
            n: target,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
              el.textContent = Math.round(obj.n).toString();
            },
          });
        });

        // Closing clip-path wipe
        if (closingRef.current) {
          gsap.fromTo(
            closingRef.current,
            { clipPath: "inset(100% 0 0 0)" },
            {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: { trigger: closingRef.current, start: "top 85%", once: true },
            }
          );
        }

        // Gold thread draw
        if (threadRef.current) {
          const len = threadRef.current.getTotalLength();
          gsap.set(threadRef.current, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(threadRef.current, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.8 },
          });
        }
      },
      root
    );

    return () => {
      window.clearTimeout(safety);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="masseria-title"
      className="relative overflow-hidden text-crema"
      style={{ backgroundColor: "var(--carbone)" }}
    >
      {/* Parallax background layers */}
      <div className="absolute inset-0 -z-10">
        {/* L1 · sky / atmosphere */}
        <div
          ref={skyRef}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 0%, color-mix(in oklab, var(--crema) 18%, transparent) 0%, transparent 55%), linear-gradient(180deg, #241612 0%, #1a1210 60%)",
          }}
          aria-hidden
        />
        {/* L2 · masseria photo */}
        <div ref={houseRef} className="absolute inset-x-0 top-[6%] bottom-[-8%]">
          <img
            src={masseriaImg}
            alt="Masseria del Cinquecento in pietra tra ulivi secolari a Noci, Puglia"
            loading="lazy"
            width={1920}
            height={1280}
            className="h-full w-full object-cover object-[50%_55%] opacity-[0.92]"
          />
          {/* grade */}
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background:
                "linear-gradient(180deg, rgba(26,18,16,0.35) 0%, rgba(26,18,16,0) 30%, rgba(26,18,16,0) 60%, rgba(26,18,16,0.75) 100%)",
            }}
            aria-hidden
          />
        </div>
        {/* L3 · foreground olives */}
        <div ref={olivesRef} className="pointer-events-none absolute inset-x-0 top-[-6%] h-[55%]">
          <img
            src={olivesImg}
            alt=""
            aria-hidden
            loading="lazy"
            width={1920}
            height={1280}
            className="h-full w-full object-cover object-top opacity-[0.55] mix-blend-multiply"
          />
        </div>
        {/* film grain */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </div>

      {/* Gold thread — enters top, exits bottom */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={threadRef}
          d="M50 0 C 52 20, 40 35, 48 50 C 56 65, 45 80, 50 100"
          fill="none"
          stroke="var(--oro)"
          strokeWidth="0.15"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--oro) 55%, transparent))" }}
        />
      </svg>

      {/* Ghost "1500" */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-8%] top-[8%] select-none text-center"
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 300,
          fontStyle: "italic",
          fontSize: "clamp(18rem, 42vw, 44rem)",
          lineHeight: 0.85,
          color: "color-mix(in oklab, var(--crema) 5%, transparent)",
          letterSpacing: "-0.04em",
        }}
      >
        1500
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[110svh] max-w-[1400px] flex-col justify-between px-6 py-[18svh] md:px-12">
        <header className="max-w-[1100px]">
          <p
            data-reveal
            className="mb-6 font-oswald text-[0.72rem] tracking-[0.35em] text-oro/85 uppercase"
          >
            La Masseria · Noci, Puglia
          </p>
          <h2
            id="masseria-title"
            ref={titleRef}
            className="font-serif text-crema"
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 300,
              fontSize: "clamp(2.6rem, 6.4vw, 6.4rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            {[
              "Una",
              "masseria",
              "del",
              "Cinquecento,",
              <span key="br" className="block h-0 w-full" aria-hidden />,
              "tra",
              "gli",
              <em
                key="ulivi"
                data-word-wrap
                style={{ fontStyle: "italic", color: "color-mix(in oklab, var(--crema) 92%, var(--oro))" }}
              >
                ulivi
              </em>,
              "di",
              "Noci.",
            ].map((w, i) =>
              typeof w === "string" ? (
                <span key={i} className="inline-block overflow-hidden align-baseline">
                  <span data-word className="inline-block will-change-transform">
                    {w}
                  </span>
                  {i < 9 ? "\u00A0" : ""}
                </span>
              ) : (
                <span key={i} className="inline-block overflow-hidden align-baseline">
                  <span data-word className="inline-block will-change-transform">
                    {w}
                  </span>
                  {"\u00A0"}
                </span>
              )
            )}
          </h2>

          <p
            data-reveal
            className="mt-8 max-w-[52ch] font-sans text-crema/75"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(1rem, 1.25vw, 1.2rem)", lineHeight: 1.55 }}
          >
            Oltre vent&apos;anni di mestiere. Alleviamo, coltiviamo, trasformiamo e cuciniamo tutto qui.
          </p>
        </header>

        {/* Data row */}
        <motion.ul
          ref={numsRef}
          style={{ skewY }}
          className="mt-[14svh] grid grid-cols-2 gap-y-10 md:mt-[10svh] md:flex md:items-end md:justify-between md:gap-6"
          aria-label="Dati della Masseria"
        >
          {DATA.map((d, i) => (
            <li key={d.k} className="relative flex items-baseline gap-4 md:flex-1">
              {i > 0 && (
                <span
                  aria-hidden
                  className="mr-4 hidden h-10 w-px md:block"
                  style={{ backgroundColor: "color-mix(in oklab, var(--oro) 55%, transparent)" }}
                />
              )}
              <div>
                <span
                  data-count={d.v}
                  className="block font-serif text-crema"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontWeight: 300,
                    fontSize: "clamp(2.6rem, 5vw, 4.6rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  0
                </span>
                <span
                  className="mt-2 block font-oswald text-[0.7rem] tracking-[0.3em] text-crema/70 uppercase"
                >
                  {d.k === "DAL" ? "DAL 2002" : d.k === "SPECIE" ? "SPECIE ALLEVATE" : d.k === "MESTIERI" ? "MESTIERI" : "MASSERIA"}
                </span>
              </div>
            </li>
          ))}
        </motion.ul>

        {/* Closing */}
        <div className="mt-[10svh] overflow-hidden">
          <p
            ref={closingRef}
            data-reveal
            className="font-oswald text-oro"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 500,
              letterSpacing: "0.28em",
              fontSize: "clamp(0.85rem, 1.15vw, 1.05rem)",
            }}
          >
            QUI NON ARRIVA NIENTE DA FUORI.
          </p>
        </div>
      </div>
    </section>
  );
}

export default LaMasseria;
