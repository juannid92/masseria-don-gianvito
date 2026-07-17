import { useEffect, useState } from "react";

/** Restituisce true se l'utente preferisce ridurre le animazioni. SSR-safe. */
export function useReducedMotion(): boolean {
  // Il primo render (SSR + client-first) DEVE restituire sempre `false`
  // per evitare hydration mismatch quando l'utente ha prefers-reduced-motion.
  // La preferenza reale viene applicata nel primo useEffect post-mount.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
