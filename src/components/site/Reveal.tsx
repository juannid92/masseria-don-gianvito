import { type ReactNode } from "react";

/** Reveal accessibile: visibile di default, animato una sola volta quando JS è pronto. */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
