import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, createRoute, Outlet, redirect } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { env } from "@/config/env";
import { AppLayout } from "@/layout/AppLayout";
import { ErrorPage } from "@/modules/system/pages/ErrorPage";
import { NotFoundPage } from "@/modules/system/pages/NotFoundPage";
import { isAuthenticated } from "@/stores/auth.store";

export interface RouterContext {
  queryClient: QueryClient;
}

const Devtools = env.DEV
  ? lazy(() =>
      import("@tanstack/react-router-devtools").then((m) => ({
        default: m.TanStackRouterDevtools,
      }))
    )
  : () => null;

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <Devtools position="bottom-right" />
      </Suspense>
    </>
  ),
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
});

/** Himoyalangan kabinet — tizimga kirmagan foydalanuvchi /login ga yo'naltiriladi */
export const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  beforeLoad: ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
  component: AppLayout,
  notFoundComponent: NotFoundPage,
});

/** Ochiq sahifalar (login) — kirgan foydalanuvchi bosh sahifaga yo'naltiriladi */
export const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public",
  beforeLoad: () => {
    if (isAuthenticated()) throw redirect({ to: "/" });
  },
  component: Outlet,
});
