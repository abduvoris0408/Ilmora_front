import { createRoute, lazyRouteComponent } from "@tanstack/react-router";

import { appLayoutRoute } from "@/app/router/root-route";
import { comingSoon } from "@/app/router/route-helpers";

export const productsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/products",
  staticData: { permission: "products.view" },
  component: lazyRouteComponent(() => import("./pages/ProductsPage"), "ProductsPage"),
});

export const productsRoutes = [
  productsRoute,
  comingSoon("/products/categories"),
  comingSoon("/products/stock"),
  comingSoon("/products/import"),
  comingSoon("/products/transfers"),
  comingSoon("/products/write-offs"),
  comingSoon("/products/repricing"),
  comingSoon("/products/stocktaking"),
  comingSoon("/products/suppliers"),
];
