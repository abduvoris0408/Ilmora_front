import type { ColumnDef } from "@tanstack/react-table";
import { UserPlusIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DataTable, DataTableColumnHeader, facetFilterFn } from "@/components/shared/data-table";
import { Money } from "@/components/shared/Money";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TKey } from "@/lib/i18n";
import { Can } from "@/lib/rbac";
import { BRANCHES } from "@/mocks/branches";
import { useRolesStore } from "@/stores/roles.store";
import { formatPhone, formatRelative } from "@/utils/format";

import { createEmployeesMock, type Employee } from "../mocks/employees.mock";

const EMPLOYEES = createEmployeesMock();

export function EmployeesPage() {
  const { t } = useTranslation();
  const roles = useRolesStore((s) => s.roles);
  const roleOf = (id: string) => roles.find((r) => r.id === id);
  const roleLabel = (id: string) => {
    const r = roleOf(id);
    return r ? (r.system ? t(r.name as TKey) : r.name) : "—";
  };

  const columns = useMemo<ColumnDef<Employee, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        meta: { label: t("employees.fields.name") },
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("employees.fields.name")} />
        ),
        cell: ({ row }) => (
          <div className="flex min-w-48 items-center gap-3">
            <UserAvatar name={row.original.name} />
            <div className="min-w-0">
              <p className="truncate font-medium">{row.original.name}</p>
              <p className="truncate text-xs text-muted-foreground tabular-nums">
                {formatPhone(row.original.phone)}
              </p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "roleId",
        meta: { label: t("employees.fields.role") },
        header: t("employees.fields.role"),
        cell: ({ row }) => (
          <Badge variant={roleOf(row.original.roleId)?.tone ?? "muted"}>
            {roleLabel(row.original.roleId)}
          </Badge>
        ),
        filterFn: facetFilterFn as never,
      },
      {
        accessorKey: "branchId",
        meta: { label: t("employees.fields.branch") },
        header: t("employees.fields.branch"),
        cell: ({ row }) => BRANCHES.find((b) => b.id === row.original.branchId)?.name,
        filterFn: facetFilterFn as never,
      },
      {
        accessorKey: "monthlySales",
        meta: { label: t("employees.fields.sales"), align: "right" },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("employees.fields.sales")}
            align="right"
          />
        ),
        cell: ({ row }) =>
          row.original.monthlySales ? (
            <Money value={row.original.monthlySales} />
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "lastActive",
        meta: { label: t("employees.fields.lastActive") },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("employees.fields.lastActive")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatRelative(row.original.lastActive)}</span>
        ),
      },
      {
        id: "status",
        accessorFn: (e) => (e.active ? "active" : "inactive"),
        meta: { label: t("common.status") },
        header: t("common.status"),
        cell: ({ row }) => <StatusBadge status={row.original.active ? "active" : "inactive"} />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, roles]
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("employees.title")}
        description={t("employees.description")}
        actions={
          <Can permission="employees.create">
            <Button>
              <UserPlusIcon />
              {t("employees.add")}
            </Button>
          </Can>
        }
      />
      <SectionCard contentClassName="pt-4">
        <DataTable
          persistKey="employees"
          columns={columns}
          data={EMPLOYEES}
          getRowId={(e) => e.id}
          filters={[
            {
              columnId: "roleId",
              title: t("employees.fields.role"),
              options: roles.map((r) => ({ value: r.id, label: roleLabel(r.id) })),
            },
            {
              columnId: "branchId",
              title: t("employees.fields.branch"),
              options: BRANCHES.map((b) => ({ value: b.id, label: b.name })),
            },
          ]}
          renderMobileCard={({ row }) => {
            const e = row.original;
            return (
              <div className="flex items-center gap-3">
                <UserAvatar name={e.name} size="lg" className="size-10" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{e.name}</p>
                    <Badge variant={roleOf(e.roleId)?.tone ?? "muted"}>{roleLabel(e.roleId)}</Badge>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {BRANCHES.find((b) => b.id === e.branchId)?.name} ·{" "}
                    {formatRelative(e.lastActive)}
                  </p>
                </div>
              </div>
            );
          }}
        />
      </SectionCard>
    </div>
  );
}
