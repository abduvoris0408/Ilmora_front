import { useMemo } from "react";

import { useAuthStore } from "@/stores/auth.store";
import { useRolesStore } from "@/stores/roles.store";

import { grantsInclude, type Permission } from "./permissions";

export type PermissionCheck = Permission | Permission[] | undefined;

/** Joriy foydalanuvchi ruxsatlari (wildcard'lar bilan) */
export function useGrants(): ReadonlySet<string> {
  const roleId = useAuthStore((s) => s.user?.roleId);
  const roles = useRolesStore((s) => s.roles);
  return useMemo(() => {
    const role = roles.find((r) => r.id === roleId);
    return new Set<string>(role?.permissions ?? []);
  }, [roles, roleId]);
}

/**
 * `check` — bitta ruxsat yoki ro'yxat. Ro'yxat berilsa: `mode="all"` (standart) — hammasi kerak,
 * `mode="any"` — bittasi yetarli. `undefined` — cheklov yo'q (true).
 */
export function checkGrants(
  grants: ReadonlySet<string>,
  check: PermissionCheck,
  mode: "all" | "any" = "all"
): boolean {
  if (!check) return true;
  const list = Array.isArray(check) ? check : [check];
  if (list.length === 0) return true;
  return mode === "all"
    ? list.every((p) => grantsInclude(grants, p))
    : list.some((p) => grantsInclude(grants, p));
}

/** Komponent ichida: `const can = usePermission(); can("products.create")` */
export function usePermission() {
  const grants = useGrants();
  return useMemo(
    () =>
      (check: PermissionCheck, mode: "all" | "any" = "all") =>
        checkGrants(grants, check, mode),
    [grants]
  );
}

/** Bitta tekshiruv: `const canEdit = useCan("products.edit")` */
export function useCan(check: PermissionCheck, mode: "all" | "any" = "all"): boolean {
  const grants = useGrants();
  return checkGrants(grants, check, mode);
}

/** Router `beforeLoad` va komponentdan tashqarida ishlatish uchun */
export function canNow(check: PermissionCheck, mode: "all" | "any" = "all"): boolean {
  const roleId = useAuthStore.getState().user?.roleId;
  const role = useRolesStore.getState().roles.find((r) => r.id === roleId);
  return checkGrants(new Set(role?.permissions ?? []), check, mode);
}
