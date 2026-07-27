import type { ReactNode } from "react";
import { NavAnime } from "@/components/site/NavAnime";

/**
 * Guscio delle pagine interne (Tappa 0).
 * Il contenuto narrativo di ogni anima verrà costruito nelle tappe 5–8.
 */
export function AnimaShell({
  numero,
  titolo,
  claim,
  intro,
  children,
}: {
  numero: string;
  titolo: string;
  claim: string;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <>
      <section
        className="relative flex min-h-[100dvh] flex-col justify-between bg-[color:var(--marrone)]"
        style={{ paddingTop: "var(--page-header-safe-offset)" }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 18% 12%, color-mix(in oklab, var(--oliva) 26%, transparent) 0%, transparent 62%), linear-gradient(180deg, transparent 40%, color-mix(in oklab, var(--carbone) 65%, transparent) 100%)",
          }}
        />
        <div aria-hidden className="grain absolute inset-0" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between px-5 pb-10 md:px-10 md:pb-14">
          <p className="font-eyebrow text-[9px] tracking-[0.34em] text-[color:var(--oro)]/80 md:text-[10px]">
            {numero} · {claim}
          </p>
          <div className="max-w-3xl">
            <h1 className="font-display text-[clamp(2.6rem,8vw,5.6rem)] leading-[0.94] text-[color:var(--crema)]">
              {titolo}
            </h1>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[color:var(--crema)]/70">
              {intro}
            </p>
          </div>
        </div>
        <div aria-hidden className="hairline-oro relative z-10" />
      </section>

      <NavAnime />
      {children}
    </>
  );
}
