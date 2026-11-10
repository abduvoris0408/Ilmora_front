import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/config/app";
import { expandGrants, type Permission, type PermissionGrant } from "@/lib/rbac/permissions";
import { DEFAULT_ROLES, type Role } from "@/lib/rbac/roles";

/**
 * Rollar va ularning ruxsatlari. Hozircha statik (localStorage) — backend ulanganda
 * shu store o'rniga TanStack Query ishlatiladi, interfeys (Role) o'zgarmaydi.
 */
interface RolesState {
  roles: Role[];
  upsertRole: (role: Role) => void;
  removeRole: (id: string) => void;
  setPermissions: (id: string, permissions: PermissionGrant[]) => void;
  togglePermission: (id: string, permission: Permission) => void;
  reset: () => void;
}

export const useRolesStore = create<RolesState>()(
  persist(
    (set) => ({
      roles: DEFAULT_ROLES,
      upsertRole: (role) =>
        set((s) => {
          const exists = s.roles.some((r) => r.id === role.id);
          return {
            roles: exists ? s.roles.map((r) => (r.id === role.id ? role : r)) : [...s.roles, role],
          };
        }),
      removeRole: (id) => set((s) => ({ roles: s.roles.filter((r) => r.id !== id || r.system) })),
      setPermissions: (id, permissions) =>
        set((s) => ({ roles: s.roles.map((r) => (r.id === id ? { ...r, permissions } : r)) })),
      togglePermission: (id, permission) =>
        set((s) => ({
          roles: s.roles.map((r) => {
            if (r.id !== id) return r;
            // Wildcard'larni ochib, aniq ro'yxat bilan ishlaymiz
            const expanded = expandGrants(r.permissions);
            if (expanded.has(permission)) expanded.delete(permission);
            else expanded.add(permission);
            return { ...r, permissions: [...expanded] };
          }),
        })),
      reset: () => set({ roles: DEFAULT_ROLES }),
    }),
    { name: STORAGE_KEYS.roles, version: 1 }
  )
);
