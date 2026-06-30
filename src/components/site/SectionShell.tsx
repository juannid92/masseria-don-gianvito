import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
};

/** Placeholder coerente per le sezioni "in arrivo". */
export function SectionShell({ id, eyebrow, title, children, align = "left" }: Props) {
  return (
    <section
      id={id}
      className="relative mx-auto w-full max-w-7xl px-6 py-28 md:py-36 lg:py-44"
    >
      <Reveal className={align === "center" ? "text-center" : "text-left"}>
        <p
          data-reveal-item
          className="font-eyebrow text-[11px] text-[color:var(--oro)]"
        >
          {eyebrow}
        </p>
        <h2
          data-reveal-item
          className="font-display mt-4 max-w-4xl text-balance text-4xl leading-[1.05] text-[color:var(--crema)] md:text-6xl lg:text-7xl"
          style={align === "center" ? { marginInline: "auto" } : undefined}
        >
          {title}
        </h2>
        {children ? (
          <div data-reveal-item className="mt-10">
            {children}
          </div>
        ) : (
          <div data-reveal-item className="mt-10">
            <p className="text-sm text-[color:var(--crema)]/45">
              · sezione in costruzione — verrà definita in un prompt dedicato ·
            </p>
          </div>
        )}
      </Reveal>
    </section>
  );
}
