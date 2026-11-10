import { PlusIcon, RotateCcwIcon, SearchIcon, ShieldCheckIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import type { TKey } from "@/lib/i18n";
import { confirm, overlay } from "@/lib/overlays";
import { ALL_PERMISSIONS, expandGrants, useCan, type Role } from "@/lib/rbac";
import { useAuthStore } from "@/stores/auth.store";
import { useRolesStore } from "@/stores/roles.store";
import { cn } from "@/utils/cn";

import { PermissionMatrix } from "../components/PermissionMatrix";
import { RoleCreateModal } from "../components/RoleCreateModal";

export function RolesPage() {
  const { t } = useTranslation();
  const roles = useRolesStore((s) => s.roles);
  const removeRole = useRolesStore((s) => s.removeRole);
  const resetRoles = useRolesStore((s) => s.reset);
  const myRoleId = useAuthStore((s) => s.user?.roleId);
  const canManage = useCan("roles.manage");

  const [selectedId, setSelectedId] = useState(roles[1]?.id ?? roles[0]!.id);
  const [query, setQuery] = useState("");
  const role = roles.find((r) => r.id === selectedId) ?? roles[0]!;

  const roleName = (r: Role) => (r.system ? t(r.name as TKey) : r.name);
  const isWildcard = role.permissions.includes("*");
  const readOnly = !canManage || isWildcard;

  const openCreate = () =>
    overlay.open(({ open, close }) => (
      <RoleCreateModal open={open} onClose={close} onCreated={setSelectedId} />
    ));

  const handleDelete = async () => {
    const ok = await confirm({
      destructive: true,
      title: t("rolesPage.deleteTitle"),
      description: t("rolesPage.deleteDescription", { name: roleName(role) }),
    });
    if (!ok) return;
    removeRole(role.id);
    setSelectedId(roles[0]!.id);
    toast.success(t("rolesPage.deleted"));
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("rolesPage.title")}
        description={t("rolesPage.description")}
        actions={
          canManage && (
            <>
              <Button variant="outline" onClick={() => resetRoles()} className="max-sm:hidden">
                <RotateCcwIcon />
                {t("rolesPage.resetDefaults")}
              </Button>
              <Button onClick={openCreate}>
                <PlusIcon />
                {t("rolesPage.newRole")}
              </Button>
            </>
          )
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        {/* Rollar ro'yxati: mobilda gorizontal scroll, lg+ da vertikal */}
        <nav
          aria-label={t("rolesPage.title")}
          className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0"
        >
          <ul className="flex gap-2 lg:flex-col">
            {roles.map((r) => {
              const count = r.permissions.includes("*")
                ? ALL_PERMISSIONS.length
                : expandGrants(r.permissions).size;
              const active = r.id === role.id;
              return (
                <li key={r.id} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setSelectedId(r.id)}
                    aria-current={active}
                    className={cn(
                      "flex w-full min-w-44 items-center gap-3 rounded-xl border bg-card px-3.5 py-3 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:ring-[3px] focus-visible:ring-ring/50",
                      active && "border-primary bg-accent hover:bg-accent"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-lg bg-muted",
                        active && "bg-primary text-primary-foreground"
                      )}
                    >
                      <ShieldCheckIcon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold">{roleName(r)}</span>
                        {r.id === myRoleId && (
                          <Badge variant="brand" className="h-4 px-1.5 text-[0.625rem]">
                            {t("rolesPage.yourRole")}
                          </Badge>
                        )}
                      </span>
                      <span className="block text-xs text-muted-foreground tabular-nums">
                        {t("rolesPage.permissionsCount", { count })}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <SectionCard
          icon={ShieldCheckIcon}
          title={roleName(role)}
          description={role.system ? t("rolesPage.systemRole") : role.description}
          actions={
            canManage &&
            !role.system && (
              <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDelete}>
                <Trash2Icon />
                <span className="max-sm:hidden">{t("common.delete")}</span>
              </Button>
            )
          }
        >
          <div className="space-y-4">
            {isWildcard ? (
              <Alert>
                <ShieldCheckIcon />
                <AlertDescription>{t("rolesPage.fullAccess")}</AlertDescription>
              </Alert>
            ) : (
              <InputGroup className="sm:max-w-xs">
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("rolesPage.searchPermissions")}
                />
              </InputGroup>
            )}
            <PermissionMatrix role={role} readOnly={readOnly} query={query} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
