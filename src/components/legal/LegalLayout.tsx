import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AnimaPagina } from "@/components/anime/AnimaPagina";

export function LegalLayout({
  titolo,
  aggiornato,
  children,
}: {
  titolo: string;
  aggiornato: string;
  children: ReactNode;
}) {
  return (
    <AnimaPagina>
      <section className="bg-[color:var(--bianco-calce)] pt-[var(--page-header-safe-offset)] text-[color:var(--carbone)]">
        <div className="mx-auto max-w-[800px] px-5 py-16 md:py-24">
          <h1 className="font-display text-[3rem] leading-none">{titolo}</h1>
          <div className="hairline-oro mt-8 max-w-[200px]" />
          <p className="mt-6 text-[14px] opacity-60">Ultimo aggiornamento: {aggiornato}</p>
          <div className="mt-10 space-y-10 text-[17px] leading-relaxed opacity-90">{children}</div>
          <div className="pt-12">
            <Link to="/" className="border-b border-[color:var(--oro-antico)] pb-1 font-eyebrow text-[14px]">
              Torna alla Home
            </Link>
          </div>
        </div>
      </section>
    </AnimaPagina>
  );
}

export function Sezione({ titolo, children }: { titolo: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-[1.6rem] leading-tight">{titolo}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}
