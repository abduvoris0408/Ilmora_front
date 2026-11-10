import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/ui/checkbox";
import {
  expandGrants,
  PERMISSION_REGISTRY,
  type Permission,
  type PermissionModule,
  type Role,
} from "@/lib/rbac";
import { useRolesStore } from "@/stores/roles.store";
import { cn } from "@/utils/cn";

/**
 * Ruxsatlar matritsasi — PERMISSION_REGISTRY'dan avtomatik quriladi.
 * Har modul — kartochka: sarlavhada "hammasi" checkbox (indeterminate), ichida amallar.
 * Mobilda 1 ustun, md+ da 2, 2xl da 3.
 */
export function PermissionMatrix({
  role,
  readOnly,
  query,
}: {
  role: Role;
  readOnly: boolean;
  query: string;
}) {
  const { t } = useTranslation();
  const toggle = useRolesStore((s) => s.togglePermission);
  const setPermissions = useRolesStore((s) => s.setPermissions);
  const granted = expandGrants(role.permissions);
  const q = query.trim().toLowerCase();

  const modules = (Object.entries(PERMISSION_REGISTRY) as [PermissionModule, readonly string[]][])
    .map(([module, actions]) => {
      const moduleLabel = t(`permissions.modules.${module}`);
      const items = actions
        .map((a) => ({
          permission: `${module}.${a}` as Permission,
          label: t(`permissions.actions.${a}` as `permissions.actions.view`),
        }))
        .filter(
          (i) => !q || moduleLabel.toLowerCase().includes(q) || i.label.toLowerCase().includes(q)
        );
      return { module, moduleLabel, items };
    })
    .filter((m) => m.items.length > 0);

  const setModule = (module: PermissionModule, on: boolean) => {
    const next = new Set(granted);
    PERMISSION_REGISTRY[module].forEach((a) => {
      const p = `${module}.${a}` as Permission;
      if (on) next.add(p);
      else next.delete(p);
    });
    setPermissions(role.id, [...next]);
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
      {modules.map(({ module, moduleLabel, items }) => {
        const all = PERMISSION_REGISTRY[module].map((a) => `${module}.${a}` as Permission);
        const count = all.filter((p) => granted.has(p)).length;
        const state = count === 0 ? false : count === all.length ? true : "indeterminate";
        const headerId = `perm-${role.id}-${module}`;

        return (
          <fieldset
            key={module}
            className={cn("min-w-0 rounded-xl border bg-card", count > 0 && "border-primary/30")}
          >
            <legend className="sr-only">{moduleLabel}</legend>
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <Checkbox
                id={headerId}
                checked={state}
                disabled={readOnly}
                onCheckedChange={(v) => setModule(module, v === true)}
              />
              <label htmlFor={headerId} className="min-w-0 flex-1 truncate text-sm font-semibold">
                {moduleLabel}
              </label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {count}/{all.length}
              </span>
            </div>
            <ul className="grid gap-0.5 p-2">
              {items.map(({ permission, label }) => {
                const id = `perm-${role.id}-${permission}`;
                return (
                  <li key={permission}>
                    <label
                      htmlFor={id}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors",
                        !readOnly && "cursor-pointer hover:bg-muted"
                      )}
                    >
                      <Checkbox
                        id={id}
                        checked={granted.has(permission)}
                        disabled={readOnly}
                        onCheckedChange={() => toggle(role.id, permission)}
                      />
                      <span className="min-w-0 flex-1 truncate">{label}</span>
                      <code className="text-[0.6875rem] text-muted-foreground max-sm:hidden">
                        {permission}
                      </code>
                    </label>
                  </li>
                );
              })}
            </ul>
          </fieldset>
        );
      })}
    </div>
  );
}
