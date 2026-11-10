import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { appLayoutRoute } from "@/app/router/root-route";
import { comingSoon } from "@/app/router/route-helpers";

export const employeesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/management/employees",
  staticData: { permission: "employees.view" },
  component: lazyRouteComponent(() => import("./pages/EmployeesPage"), "EmployeesPage"),
});

export const rolesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/management/roles",
  staticData: { permission: "roles.view" },
  component: lazyRouteComponent(() => import("./pages/RolesPage"), "RolesPage"),
});

export const branchesRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/management/branches",
  staticData: { permission: "branches.view" },
  component: lazyRouteComponent(() => import("./pages/BranchesPage"), "BranchesPage"),
});

export const managementRoutes = [
  employeesRoute,
  rolesRoute,
  branchesRoute,
  comingSoon("/management/audit"),
];
