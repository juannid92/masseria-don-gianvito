/**
 * Generic client-side error reporter.
 * Replaced Lovable-specific telemetry after migration to Cloudflare Pages.
 * Logs errors to console; extend with Sentry/Datadog/etc. as needed.
 */
export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  console.error("[ErrorBoundary]", {
    source: "react_error_boundary",
    route: window.location.pathname,
    ...context,
    error,
  });
}
}
