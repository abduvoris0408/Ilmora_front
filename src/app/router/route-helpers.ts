import { createRoute } from "@tanstack/react-router";

import { ComingSoonPage } from "@/modules/system/pages/ComingSoonPage";

import { appLayoutRoute } from "./root-route";

/**
 * Hali qurilmagan sahifa uchun route. Sarlavha/ikon/ruxsat nav config'dan olinadi.
 * Sahifa tayyor bo'lganda: `comingSoon("/x")` → `createRoute({ …, component: lazyRouteComponent(…) })`.
 */
export function comingSoon<const TPath extends string>(path: TPath) {
  return createRoute({
    getParentRoute: () => appLayoutRoute,
    path,
    component: ComingSoonPage,
  });
}
