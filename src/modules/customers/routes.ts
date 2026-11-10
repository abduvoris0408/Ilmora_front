import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { appLayoutRoute } from "@/app/router/root-route";
import { comingSoon } from "@/app/router/route-helpers";

export const customersRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/customers",
  staticData: { permission: "customers.view" },
  component: lazyRouteComponent(() => import("./pages/CustomersPage"), "CustomersPage"),
});

export const customersRoutes = [
  customersRoute,
  comingSoon("/customers/segments"),
  comingSoon("/customers/debts"),
];
