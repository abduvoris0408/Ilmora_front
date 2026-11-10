import { createRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";

import { publicLayoutRoute } from "@/app/router/root-route";

export const loginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/login",
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: lazyRouteComponent(() => import("./pages/LoginPage"), "LoginPage"),
});

export const authRoutes = [loginRoute];
