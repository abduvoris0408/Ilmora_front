import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { appLayoutRoute } from "@/app/router/root-route";
import { comingSoon } from "@/app/router/route-helpers";

export const generalSettingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings",
  staticData: { permission: "settings.view" },
  component: lazyRouteComponent(() => import("./pages/GeneralSettingsPage"), "GeneralSettingsPage"),
});

/** Interfeys va menyu — shaxsiy sozlamalar, ruxsat talab qilmaydi */
export const appearanceRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings/appearance",
  component: lazyRouteComponent(() => import("./pages/AppearancePage"), "AppearancePage"),
});

export const menuSettingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings/menu",
  component: lazyRouteComponent(() => import("./pages/MenuSettingsPage"), "MenuSettingsPage"),
});

export const designSystemRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/settings/design-system",
  component: lazyRouteComponent(() => import("./pages/DesignSystemPage"), "DesignSystemPage"),
});

export const settingsRoutes = [
  generalSettingsRoute,
  appearanceRoute,
  menuSettingsRoute,
  designSystemRoute,
  comingSoon("/settings/receipt"),
  comingSoon("/settings/integrations"),
];
