/**
 * Generic runtime error reporter.
 *
 * Call this from React error boundaries to surface exceptions to any
 * monitoring/observability tool you wire up. The function is intentionally
 * side-effect-free in production until you add your own integration (e.g.
 * Sentry, Datadog, Cloudflare Workers Analytics Engine).
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // ----- Add your production error-tracking SDK call here -----
  // Example (Sentry):
  //   import * as Sentry from "@sentry/react";
  //   Sentry.captureException(error, { extra: context });
  // ------------------------------------------------------------

  // Always log to the console so errors are visible in Cloudflare's
  // Workers / Pages log tail and in local development.
  console.error("[error-reporting]", describeThrown(error), context);
}

const MAX_SERIALIZED_LENGTH = 2000;

function describeThrown(error: unknown): string {
  if (error instanceof Response) {
    return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  const { message } = (error ?? {}) as { message?: unknown };
  if (typeof message === "string" && message.length > 0) return message;
  try {
    return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
  } catch {
    return String(error);
  }
}
