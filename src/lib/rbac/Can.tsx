import type { ReactNode } from "react";

import { useCan, type PermissionCheck } from "./use-permission";

/**
 * Ruxsat bo'lsa — `children`, bo'lmasa — `fallback` (standart: hech narsa).
 *
 * <Can permission="products.create"><Button>Qo'shish</Button></Can>
 * <Can permission={["sales.refund", "sales.delete"]} mode="any">…</Can>
 */
export function Can({
  permission,
  mode = "all",
  fallback = null,
  children,
}: {
  permission: PermissionCheck;
  mode?: "all" | "any";
  fallback?: ReactNode;
  children: ReactNode;
}) {
  return useCan(permission, mode) ? children : fallback;
}
