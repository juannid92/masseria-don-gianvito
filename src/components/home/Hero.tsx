import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import aerial from "@/assets/masseria-aerial.asset.json";
import { ANIME, MASSERIA } from "@/data/masseria";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * HERO HOME — fotografia aerea autentica della Masseria + quattro accessi alle anime.
 * Il testo è leggibile senza JavaScript: le animazioni sono solo un velo.
 * Il fondo dell'Hero si trasforma nella sezione successiva (nessun gap).
 */
export function Hero() {
  const reduced = useReducedMotion();
  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="hero"
      className="relative isolate min-h-[100dvh] w-full overflow-hidden bg-[color:var(--carbone)]"
    >
      {/* Fotografia aerea REALE della Masseria (unico asset autentico disponibile). */}
      <img
        src={aerial.url}
        alt="Veduta aerea della Masseria Don Gianvito e dei suoi terreni, a Noci"
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
        decoding="async"
      />

      {/* Luce e ombra: leggibilità del testo e discesa verso la sezione successiva */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--carbone) 78%, transparent) 0%, color-mix(in oklab, var(--carbone) 22%, transparent) 34%, color-mix(in oklab, var(--carbone) 60%, transparent) 68%, color-mix(in oklab, var(--carbone) 92%, transparent) 100%), linear-gradient(96deg, color-mix(in oklab, var(--carbone) 72%, transparent) 0%, transparent 58%)",
        }}
      />
      <div aria-hidden className="grain absolute inset-0" />

      <div
        className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col justify-between px-5 pb-8 md:px-10 md:pb-10"
        style={{ paddingTop: "var(--page-header-safe-offset)" }}
      >
        {/* Occhiello — sempre sotto la safe area dell'header */}
        <motion.p
          {...fade(0.05)}
          className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--crema)]/70 md:text-[10px]"
        >
          {MASSERIA.sopratitolo}
        </motion.p>

        {/* Titolo editoriale, ancorato in basso a sinistra */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <motion.div {...fade(0.15)} className="lg:col-span-7">
            <h1 className="font-display text-[clamp(2.7rem,8.4vw,6.4rem)] leading-[0.92] text-[color:var(--crema)]">
              <span className="block">Dalla terra</span>
              <span className="block">
                alla <em className="not-italic text-[color:var(--oro)]">tavola.</em>
              </span>
              <span className="block text-[0.42em] font-normal leading-tight text-[color:var(--crema)]/70">
                Ogni sera, a Noci.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-[16px] leading-relaxed text-[color:var(--crema)]/75">
              Una masseria del Cinquecento sulla strada verso Mottola. Qui si allevano gli animali,
              si fa il formaggio, si sceglie la carne al banco e ci si siede a tavola.
            </p>
          </motion.div>

          {/* Quattro accessi alle anime */}
          <motion.nav
            {...fade(0.3)}
            aria-label="Le quattro anime della Masseria"
            className="lg:col-span-5"
          >
            <p className="font-eyebrow mb-3 text-[9px] tracking-[0.34em] text-[color:var(--oro)]/80">
              Le quattro anime
            </p>
            <ul className="border-t border-[color:var(--crema)]/20">
              {ANIME.map((a) => (
                <li key={a.id} className="border-b border-[color:var(--crema)]/20">
                  <Link
                    to={a.to}
                    className="group flex items-baseline gap-4 py-3 transition-colors hover:bg-[color:var(--crema)]/8 md:py-4"
                  >
                    <span className="font-display w-6 text-[12px] text-[color:var(--oro)]/80">
                      {a.numero}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-[21px] leading-none text-[color:var(--crema)] md:text-[26px]">
                        {a.nome}
                      </span>
                      <span className="mt-1 block text-[13px] text-[color:var(--crema)]/55">
                        {a.claim}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="font-eyebrow text-[10px] text-[color:var(--oro)] transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>
      </div>

      {/* Continuità: filo oro che chiude l'Hero e apre la sezione successiva */}
      <div aria-hidden className="hairline-oro absolute inset-x-0 bottom-0 z-20" />
    </section>
  );
}
