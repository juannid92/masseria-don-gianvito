import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { RouteAtmosphere } from "@/components/journey/RouteAtmosphere";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ScrollProvider } from "@/components/site/ScrollProvider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SITE_CONFIG, getAbsoluteUrl } from "@/config/site";
import { MASSERIA } from "@/data/masseria";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bianco-calce)] px-4 pt-[var(--page-header-safe-offset)]">
      <HeadContent />
      {/* 404 DEVE AVERE NOINDEX */}
      <title>Pagina non trovata — Masseria Don Gianvito</title>
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={getAbsoluteUrl("/404")} />

      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-[color:var(--carbone)]">404</h1>
        <h2 className="mt-4 font-display text-2xl text-[color:var(--carbone)]">
          Pagina non trovata
        </h2>
        <div className="hairline-oro mx-auto mt-6 max-w-[120px]" />
        <p className="mt-6 text-[16px] text-[color:var(--carbone)]/70">
          La pagina che cerchi non esiste o è stata spostata.
        </p>
        <div className="mt-10">
          <Link
            to="/"
            className="font-eyebrow inline-flex items-center justify-center border border-[color:var(--oro-antico)] px-8 py-3 text-[14px] text-[color:var(--carbone)] transition-colors hover:bg-[color:var(--oro-antico)]/10"
          >
            Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_CONFIG.title },
      { name: "description", content: SITE_CONFIG.description },
      { name: "author", content: SITE_CONFIG.name },
      { name: "theme-color", content: SITE_CONFIG.themeColor },
      { property: "og:site_name", content: SITE_CONFIG.name },
      { property: "og:title", content: SITE_CONFIG.title },
      { name: "twitter:title", content: SITE_CONFIG.title },
      { property: "og:description", content: SITE_CONFIG.description },
      { name: "twitter:description", content: SITE_CONFIG.description },
      { name: "twitter:card", content: SITE_CONFIG.twitterCard },
      { property: "og:type", content: "website" },
      { property: "og:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
      { name: "twitter:image", content: getAbsoluteUrl(SITE_CONFIG.ogImage) },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Anton&family=Instrument+Serif:ital@0;1&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&family=Oswald:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              name: SITE_CONFIG.name,
              description: SITE_CONFIG.description,
              url: SITE_CONFIG.url,
              telephone: [
                `tel:+39${MASSERIA.telefono.replace(/\s/g, "")}`,
                `tel:+39${MASSERIA.telefono2.replace(/\s/g, "")}`,
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: MASSERIA.indirizzo,
                addressLocality: "Noci",
                addressRegion: "BA",
                postalCode: "70015",
                addressCountry: "IT",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: MASSERIA.coordinate.lat,
                longitude: MASSERIA.coordinate.lng,
              },
              servesCuisine: "Pugliese",
              priceRange: "$$",
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollProvider>
        <RouteAtmosphere />
        <Header />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <main className="relative">
          <Outlet />
        </main>
        <Footer />
      </ScrollProvider>
    </QueryClientProvider>
  );
}
