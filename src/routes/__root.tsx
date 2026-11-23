import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GlassButton } from "@/components/glass-button";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";

// ─── GA4 helpers ─────────────────────────────────────────────────────────────
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Fire a GA4 event. No-ops gracefully if the tag hasn't loaded yet. */
export function gtagEvent(name: string, params?: Record<string, unknown>) {
  window.gtag?.("event", name, params);
}

/** Fire a GA4 page_view for the current URL. */
function gtagPageView(path: string) {
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
  });
}

import { SiteNav } from "@/components/site-nav";
import { ChatWidgets } from "@/components/chat-widgets";
import { reportError } from "../lib/error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <GlassButton as={Link} to="/">Go Home</GlassButton>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
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
          <GlassButton
            as="button"
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try Again
          </GlassButton>
          <GlassButton as="a" href="/" variant="secondary">Go Home</GlassButton>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const isAdmin = useRouterState({
    select: (state) =>
      state.location.pathname === "/adzvoadmin" ||
      state.location.pathname.startsWith("/adzvoadmin/"),
  });

  // ── SPA page-view tracking ──────────────────────────────────────────────
  // TanStack Router navigation isn't a real page load, so GA4's tag won't
  // fire automatically. Subscribe to the router and fire page_view manually
  // on every route change. We track the previous path to avoid double-firing
  // on the initial render (the tag is configured with send_page_view: false).
  const prevPath = useRef<string | null>(null);
  useEffect(() => {
    const unsub = router.subscribe("onResolved", ({ toLocation }) => {
      const path = toLocation.pathname + toLocation.searchStr;
      if (path !== prevPath.current) {
        prevPath.current = path;
        gtagPageView(path);
      }
    });
    // Fire once for the initial page load
    const initial = window.location.pathname + window.location.search;
    prevPath.current = initial;
    gtagPageView(initial);
    return unsub;
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      {!isAdmin && <SiteNav />}
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <ChatWidgets />
    </QueryClientProvider>
  );
}
