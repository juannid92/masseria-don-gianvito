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

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ScrollProvider } from "@/components/site/ScrollProvider";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--bianco-calce)] px-4 pt-[var(--page-header-safe-offset)]">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-[color:var(--carbone)]">404</h1>
        <h2 className="mt-4 font-display text-2xl text-[color:var(--carbone)]">Pagina non trovata</h2>
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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
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
      { title: "Masseria Don Gianvito — Dalla terra alla tavola" },
      {
        name: "description",
        content:
          "Azienda agricola a filiera propria a Noci (BA): allevamento, caseificio, macelleria e agriturismo della Murgia.",
      },
      { name: "author", content: "Masseria Don Gianvito" },
      { name: "theme-color", content: "#f4f0e6" },
      { property: "og:site_name", content: "Masseria Don Gianvito" },
      { property: "og:title", content: "Masseria Don Gianvito — Dalla terra alla tavola" },
      { name: "twitter:title", content: "Masseria Don Gianvito — Dalla terra alla tavola" },
      {
        property: "og:description",
        content:
          "Azienda agricola a filiera propria a Noci (BA): allevamento, caseificio, macelleria e agriturismo della Murgia.",
      },
      {
        name: "twitter:description",
        content:
          "Azienda agricola a filiera propria a Noci (BA): allevamento, caseificio, macelleria e agriturismo della Murgia.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
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
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=Oswald:wght@400;500;600&display=swap",
      },
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
              "@type": "Agriturismo",
              "name": "Masseria Don Gianvito",
              "description": "Azienda agricola a filiera propria a Noci (BA): allevamento, caseificio, macelleria e agriturismo della Murgia.",
              "url": "https://masseriadongianvito.it",
              "telephone": ["tel:+393339395750", "tel:+393333870292"],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "SP237 ex SS377 per Mottola km 6,5, Zona C 76",
                "addressLocality": "Noci",
                "addressRegion": "BA",
                "postalCode": "70015",
                "addressCountry": "IT"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 40.642739,
                "longitude": 17.0426
              }
            })
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

