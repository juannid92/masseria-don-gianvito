import { Link, useLocation } from "@tanstack/react-router";
import { ANIME } from "@/data/masseria";

/**
 * NAVANIME — presente su ogni pagina interna, identico in struttura.
 * La pagina corrente non è cliccabile e porta aria-current="page".
 */
export function NavAnime() {
  const location = useLocation();

  return (
    <nav
      aria-label="Le quattro anime"
      className="border-y border-[color:var(--crema)]/15 bg-[color:var(--marrone)]"
    >
      <ul className="mx-auto grid max-w-[1600px] grid-cols-2 md:grid-cols-4">
        {ANIME.map((a) => {
          const corrente = location.pathname === a.to;
          const base =
            "flex h-full flex-col gap-1 border-r border-[color:var(--crema)]/12 px-5 py-5 md:px-8 md:py-6";
          return (
            <li key={a.id} className="contents">
              {corrente ? (
                <span aria-current="page" className={`${base} bg-[color:var(--carbone)]/45`}>
                  <span className="font-eyebrow text-[9px] tracking-[0.3em] text-[color:var(--oro)]">
                    {a.numero} · qui
                  </span>
                  <span className="font-display text-[19px] text-[color:var(--crema)]">
                    {a.nome}
                  </span>
                  <span className="text-[13px] text-[color:var(--crema)]/50">{a.claim}</span>
                </span>
              ) : (
                <Link
                  to={a.to}
                  className={`${base} transition-colors hover:bg-[color:var(--carbone)]/30`}
                >
                  <span className="font-eyebrow text-[9px] tracking-[0.3em] text-[color:var(--crema)]/45">
                    {a.numero}
                  </span>
                  <span className="font-display text-[19px] text-[color:var(--crema)]/85">
                    {a.nome}
                  </span>
                  <span className="text-[13px] text-[color:var(--crema)]/45">{a.claim}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
