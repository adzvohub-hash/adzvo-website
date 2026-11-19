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
import { useEffect } from "react";

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
  const isAdmin = useRouterState({
    select: (state) =>
      state.location.pathname === "/adzvoadmin" ||
      state.location.pathname.startsWith("/adzvoadmin/"),
  });

  return (
    <QueryClientProvider client={queryClient}>
      {!isAdmin && <SiteNav />}
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <ChatWidgets />
    </QueryClientProvider>
  );
}
