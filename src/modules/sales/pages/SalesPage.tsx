import type { ColumnDef } from "@tanstack/react-table";
import { DownloadIcon, ShoppingCartIcon } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

import { DataTable, DataTableColumnHeader, facetFilterFn } from "@/components/shared/data-table";
import { Money } from "@/components/shared/Money";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { overlay } from "@/lib/overlays";
import { Can } from "@/lib/rbac";
import { BRANCHES } from "@/mocks/branches";
import { useBranchStore } from "@/stores/branch.store";
import { formatDateTime, formatNumber } from "@/utils/format";

import { useSales } from "../api/sales.api";
import { SaleDetailPanel } from "../components/SaleDetailPanel";
import { PAYMENT_TYPES, SALE_STATUSES, type Sale } from "../types";

export function SalesPage() {
  const { t } = useTranslation();
  const { data = [], isLoading } = useSales();
  const branchId = useBranchStore((s) => s.branchId);

  // Header'dagi filial tanlovi ro'yxatga ta'sir qiladi
  const rows = useMemo(
    () => (branchId ? data.filter((s) => s.branchId === branchId) : data),
    [data, branchId]
  );

  const openDetail = (sale: Sale) =>
    overlay.open(({ open, close }) => <SaleDetailPanel open={open} onClose={close} sale={sale} />);

  const columns = useMemo<ColumnDef<Sale, unknown>[]>(
    () => [
      {
        accessorKey: "number",
        meta: { label: t("sales.fields.number") },
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("sales.fields.number")} />
        ),
        cell: ({ row }) => <span className="font-medium tabular-nums">#{row.original.number}</span>,
      },
      {
        accessorKey: "createdAt",
        meta: { label: t("sales.fields.date") },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("sales.fields.date")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {formatDateTime(row.original.createdAt)}
          </span>
        ),
      },
      {
        id: "customer",
        accessorFn: (s) => s.customer ?? t("sales.walkIn"),
        meta: { label: t("sales.fields.customer") },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("sales.fields.customer")} />
        ),
        cell: ({ row }) =>
          row.original.customer ?? (
            <span className="text-muted-foreground">{t("sales.walkIn")}</span>
          ),
      },
      {
        accessorKey: "cashier",
        meta: { label: t("sales.fields.cashier") },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("sales.fields.cashier")} />
        ),
      },
      {
        id: "branch",
        accessorFn: (s) => BRANCHES.find((b) => b.id === s.branchId)?.name ?? "",
        meta: { label: t("common.branch") },
        header: t("common.branch"),
        cell: ({ getValue }) => <span className="text-muted-foreground">{String(getValue())}</span>,
      },
      {
        id: "itemsCount",
        accessorFn: (s) => s.items.reduce((n, it) => n + it.qty, 0),
        meta: { label: t("sales.fields.items"), align: "right" },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("sales.fields.items")} align="right" />
        ),
        cell: ({ getValue }) => formatNumber(Number(getValue())),
      },
      {
        accessorKey: "payment",
        meta: { label: t("sales.fields.payment") },
        header: t("sales.fields.payment"),
        cell: ({ row }) => t(`payment.${row.original.payment}`),
        filterFn: facetFilterFn as never,
      },
      {
        accessorKey: "total",
        meta: { label: t("sales.fields.amount"), align: "right" },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("sales.fields.amount")} align="right" />
        ),
        cell: ({ row }) => <Money value={row.original.total} className="font-medium" />,
      },
      {
        accessorKey: "status",
        meta: { label: t("common.status") },
        header: t("common.status"),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        filterFn: facetFilterFn as never,
      },
    ],
    [t]
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("sales.title")}
        description={t("sales.description")}
        actions={
          <>
            <Can permission="sales.export">
              <Button variant="outline" className="max-sm:hidden">
                <DownloadIcon />
                {t("common.export")}
              </Button>
            </Can>
            <Can permission="pos.access">
              <Button asChild>
                <Link to="/sales/pos">
                  <ShoppingCartIcon />
                  {t("dashboard.newSale")}
                </Link>
              </Button>
            </Can>
          </>
        }
      />

      <SectionCard contentClassName="pt-4">
        <DataTable
          persistKey="sales"
          columns={columns}
          data={rows}
          loading={isLoading}
          getRowId={(s) => s.id}
          onRowClick={openDetail}
          initialState={{ columnVisibility: { branch: !branchId } }}
          filters={[
            {
              columnId: "payment",
              title: t("sales.fields.payment"),
              options: PAYMENT_TYPES.map((p) => ({ value: p, label: t(`payment.${p}`) })),
            },
            {
              columnId: "status",
              title: t("common.status"),
              options: SALE_STATUSES.map((s) => ({ value: s, label: t(`status.${s}`) })),
            },
          ]}
          renderMobileCard={({ row }) => {
            const s = row.original;
            return (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold tabular-nums">#{s.number}</span>
                  <StatusBadge status={s.status} />
                </div>
                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0 text-xs text-muted-foreground">
                    <p className="truncate">{s.customer ?? t("sales.walkIn")}</p>
                    <p className="tabular-nums">
                      {formatDateTime(s.createdAt)} · {t(`payment.${s.payment}`)}
                    </p>
                  </div>
                  <Money value={s.total} className="text-sm font-semibold" />
                </div>
              </div>
            );
          }}
        />
      </SectionCard>
    </div>
  );
}
