import { lazy, Suspense, type ReactNode } from "react";

/**
 * Shell lazy per ScrollProvider + RouteAtmosphere.
 * Carica gsap, lenis e ScrollTrigger SOLO nelle route che usano animazioni.
 * Le pagine semplici (chi-siamo, faq, contatti, ecc.) non pagano il costo del bundle.
 */
const LazyScrollProvider = lazy(() =>
  import("@/components/site/ScrollProvider").then((m) => ({
    default: m.ScrollProvider,
  })),
);

const LazyRouteAtmosphere = lazy(() =>
  import("@/components/journey/RouteAtmosphere").then((m) => ({
    default: m.RouteAtmosphere,
  })),
);

export function AnimationShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <LazyScrollProvider>
        {children}
        <LazyRouteAtmosphere />
      </LazyScrollProvider>
    </Suspense>
  );
}
