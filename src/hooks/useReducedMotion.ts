import { useEffect, useState } from "react";

/** Restituisce true se l'utente preferisce ridurre le animazioni. SSR-safe. */
export function useReducedMotion(): boolean {
  // Lazy initializer: legge la media query synchronously sul client per evitare
  // un flash di animazioni al primo render; su SSR il default è false.
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

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
