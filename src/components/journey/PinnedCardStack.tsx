import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

interface Moment {
  label: string;
  title: string;
  body: string;
}

/**
 * Card impilate con pin GSAP: la sezione resta ferma, ogni scroll porta
 * dentro la card successiva che copre la precedente (che arretra e si scurisce).
 * Reduced motion / no JS: le card restano una normale colonna leggibile.
 */
export function PinnedCardStack({ moments, kicker }: { moments: Moment[]; kicker: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = root.current!;
        el.classList.add("is-pinned");
        const cards = gsap.utils.toArray<HTMLElement>(".pinned-card", el);
        const dots = gsap.utils.toArray<HTMLElement>(".pinned-dot", el);
        const counter = el.querySelector<HTMLElement>(".pinned-current");
        const bar = el.querySelector<HTMLElement>(".pinned-bar-fill");

        gsap.set(cards, { yPercent: (i) => (i === 0 ? 0 : 115), rotate: (i) => (i === 0 ? 0 : 2) });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${window.innerHeight * (cards.length - 1) * 1.1}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (cards.length - 1),
              duration: 0.5,
              ease: "power2.inOut",
              delay: 0.05,
            },
            onUpdate: (self) => {
              const idx = Math.round(self.progress * (cards.length - 1));
              if (counter) counter.textContent = String(idx + 1).padStart(2, "0");
              dots.forEach((d, i) => d.classList.toggle("is-active", i === idx));
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        cards.forEach((card, i) => {
          if (i === 0) return;
          const prev = cards[i - 1];
          tl.to(card, { yPercent: 0, rotate: 0, duration: 1 }, i - 1)
            .to(prev, { scale: 0.9, yPercent: -6, filter: "brightness(0.7)", duration: 1 }, i - 1)
            .fromTo(
              card.querySelectorAll(".pinned-card-text > *"),
              { y: 40, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.5 },
              i - 0.6,
            );
          const photo = card.querySelector(".pinned-card-photo-inner");
          if (photo) tl.fromTo(photo, { scale: 1.25 }, { scale: 1, duration: 1 }, i - 1);
        });

        return () => el.classList.remove("is-pinned");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="pinned-stack" aria-label="Cinque momenti dell'allevamento">
      <div className="pinned-stack-head journey-shell">
        <p className="journey-kicker">{kicker}</p>
        <p className="pinned-counter" aria-hidden="true">
          <span className="pinned-current">01</span> / {String(moments.length).padStart(2, "0")}
        </p>
      </div>
      <div className="pinned-stack-deck journey-shell">
        {moments.map((m, i) => (
          <article key={m.label} className="pinned-card" style={{ zIndex: i + 1 }}>
            <div className="pinned-card-photo">
              <div className="pinned-card-photo-inner">
                <span>
                  {m.label
                    .split(" ")
                    .filter((w) => w.length > 2)
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <small>Foto da produrre · {m.label}</small>
              </div>
            </div>
            <div className="pinned-card-text">
              <span className="pinned-card-index">0{i + 1}</span>
              <p className="pinned-card-label">{m.label}</p>
              <h2>{m.title}</h2>
              <p>{m.body}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="pinned-stack-foot journey-shell" aria-hidden="true">
        <div className="pinned-dots">
          {moments.map((m, i) => (
            <span key={m.label} className={`pinned-dot${i === 0 ? " is-active" : ""}`} />
          ))}
        </div>
        <div className="pinned-bar">
          <span className="pinned-bar-fill" />
        </div>
      </div>
    </section>
  );
}
