import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * REDIRECT PERMANENTE (Legacy)
 * La rotta /braceria è deprecata e reindirizza permanentemente a /agriturismo.
 * Nota: TanStack Start gestisce il redirect via server function in produzione
 * restituendo un codice 301/308 se lanciato in beforeLoad.
 */
export const Route = createFileRoute("/braceria")({
  beforeLoad: () => {
    throw redirect({
      to: "/agriturismo",
      code: 301, // Redirect Permanente
    });
  },
  component: () => null,
});

