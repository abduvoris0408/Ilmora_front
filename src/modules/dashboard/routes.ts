import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { appLayoutRoute } from "@/app/router/root-route";

export const dashboardRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  staticData: { permission: "dashboard.view" },
  component: lazyRouteComponent(() => import("./pages/DashboardPage"), "DashboardPage"),
});

export const dashboardRoutes = [dashboardRoute];
