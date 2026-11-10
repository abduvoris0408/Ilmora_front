import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { appLayoutRoute } from "@/app/router/root-route";
import { comingSoon } from "@/app/router/route-helpers";

export const salesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/sales",
  staticData: { permission: "sales.view" },
  component: lazyRouteComponent(() => import("./pages/SalesPage"), "SalesPage"),
});

export const salesRoutes = [
  salesRoute,
  comingSoon("/sales/pos"),
  comingSoon("/sales/returns"),
  comingSoon("/sales/shifts"),
  comingSoon("/sales/orders"),
];
