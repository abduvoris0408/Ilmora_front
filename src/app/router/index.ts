import { createRouter } from "@tanstack/react-router";

import { authRoutes } from "@/modules/auth/routes";
import { customersRoutes } from "@/modules/customers/routes";
import { dashboardRoutes } from "@/modules/dashboard/routes";
import { financeRoutes } from "@/modules/finance/routes";
import { financingRoutes } from "@/modules/financing/routes";
import { managementRoutes } from "@/modules/management/routes";
import { marketingRoutes } from "@/modules/marketing/routes";
import { productsRoutes } from "@/modules/products/routes";
import { reportsRoutes } from "@/modules/reports/routes";
import { salesRoutes } from "@/modules/sales/routes";
import { settingsRoutes } from "@/modules/settings/routes";

import { queryClient } from "../query-client";
import { PagePending } from "./PagePending";
import { appLayoutRoute, publicLayoutRoute, rootRoute } from "./root-route";

/**
 * ROUTE DARAXTI — har modul o'z `routes.ts` faylida route'larini e'lon qiladi, bu yerda yig'iladi.
 * Yangi modul: 1) modules/<nom>/routes.ts  2) shu ro'yxatga qo'shish  3) config/navigation.ts
 */
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([...authRoutes]),
  appLayoutRoute.addChildren([
    ...dashboardRoutes,
    ...productsRoutes,
    ...salesRoutes,
    ...customersRoutes,
    ...marketingRoutes,
    ...reportsRoutes,
    ...financeRoutes,
    ...financingRoutes,
    ...managementRoutes,
    ...settingsRoutes,
  ]),
]);

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultPendingComponent: PagePending,
  defaultPendingMs: 150,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
