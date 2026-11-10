import type { ColumnDef } from "@tanstack/react-table";
import {
  CrownIcon,
  DownloadIcon,
  GiftIcon,
  HandCoinsIcon,
  UserPlusIcon,
  UsersRoundIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DataTable, DataTableColumnHeader, facetFilterFn } from "@/components/shared/data-table";
import { Money } from "@/components/shared/Money";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatCard } from "@/components/shared/StatCard";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { overlay } from "@/lib/overlays";
import { Can } from "@/lib/rbac";
import { formatCompact, formatNumber, formatPhone, formatRelative } from "@/utils/format";

import { useCustomers } from "../api/customers.api";
import { CustomerCreateModal } from "../components/CustomerCreateModal";
import { CustomerDetailPanel } from "../components/CustomerDetailPanel";
import { CUSTOMER_SEGMENTS, SEGMENT_TONES, type Customer } from "../types";

export function CustomersPage() {
  const { t } = useTranslation();
  const { data = [], isLoading } = useCustomers();

  const openDetail = (customer: Customer) =>
    overlay.open(({ open, close }) => (
      <CustomerDetailPanel open={open} onClose={close} customer={customer} />
    ));
  const openCreate = () =>
    overlay.open(({ open, close }) => <CustomerCreateModal open={open} onClose={close} />);

  const columns = useMemo<ColumnDef<Customer, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        meta: { label: t("customers.fields.name") },
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("customers.fields.name")} />
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
        accessorKey: "phone",
        // Qidiruv telefon raqam bo'yicha ham ishlashi uchun — ko'rinmaydigan ustun
        meta: { label: t("customers.fields.phone") },
        header: t("customers.fields.phone"),
        cell: ({ row }) => <span className="tabular-nums">{formatPhone(row.original.phone)}</span>,
      },
      {
        accessorKey: "segment",
        meta: { label: t("customers.fields.segment") },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("customers.fields.segment")} />
        ),
        cell: ({ row }) => (
          <Badge variant={SEGMENT_TONES[row.original.segment]}>
            {t(`customers.segments.${row.original.segment}`)}
          </Badge>
        ),
        filterFn: facetFilterFn as never,
      },
      {
        accessorKey: "totalSpent",
        meta: { label: t("customers.fields.totalSpent"), align: "right" },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("customers.fields.totalSpent")}
            align="right"
          />
        ),
        cell: ({ row }) => <Money value={row.original.totalSpent} className="font-medium" />,
      },
      {
        accessorKey: "visits",
        meta: { label: t("customers.fields.visits"), align: "right" },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("customers.fields.visits")}
            align="right"
          />
        ),
        cell: ({ row }) => formatNumber(row.original.visits),
      },
      {
        accessorKey: "cashback",
        meta: { label: t("customers.fields.cashback"), align: "right" },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("customers.fields.cashback")}
            align="right"
          />
        ),
        cell: ({ row }) => (
          <Money value={row.original.cashback} hideCurrency className="text-success" />
        ),
      },
      {
        accessorKey: "debt",
        meta: { label: t("customers.fields.debt"), align: "right" },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("customers.fields.debt")} align="right" />
        ),
        cell: ({ row }) =>
          row.original.debt ? (
            <Money value={row.original.debt} hideCurrency className="text-destructive" />
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
      },
      {
        accessorKey: "lastVisit",
        meta: { label: t("customers.fields.lastVisit") },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("customers.fields.lastVisit")} />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{formatRelative(row.original.lastVisit)}</span>
        ),
      },
    ],
    [t]
  );

  const stats = useMemo(
    () => ({
      total: data.length,
      vip: data.filter((c) => c.segment === "vip").length,
      debtors: data.filter((c) => c.debt > 0).length,
      cashback: data.reduce((s, c) => s + c.cashback, 0),
    }),
    [data]
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("customers.title")}
        description={t("customers.description")}
        actions={
          <>
            <Can permission="customers.export">
              <Button variant="outline" className="max-sm:hidden">
                <DownloadIcon />
                {t("common.export")}
              </Button>
            </Can>
            <Can permission="customers.create">
              <Button onClick={openCreate}>
                <UserPlusIcon />
                {t("customers.add")}
              </Button>
            </Can>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={UsersRoundIcon}
          label={t("customers.stats.total")}
          value={formatNumber(stats.total)}
          loading={isLoading}
        />
        <StatCard
          icon={CrownIcon}
          tone="warning"
          label={t("customers.stats.vip")}
          value={formatNumber(stats.vip)}
          loading={isLoading}
        />
        <StatCard
          icon={HandCoinsIcon}
          tone="danger"
          label={t("customers.stats.debtors")}
          value={formatNumber(stats.debtors)}
          loading={isLoading}
        />
        <StatCard
          icon={GiftIcon}
          tone="success"
          label={t("customers.stats.cashback")}
          value={formatCompact(stats.cashback)}
          hint={t("common.currency")}
          loading={isLoading}
        />
      </div>

      <SectionCard contentClassName="pt-4">
        <DataTable
          persistKey="customers"
          columns={columns}
          data={data}
          loading={isLoading}
          getRowId={(c) => c.id}
          onRowClick={openDetail}
          initialState={{ columnVisibility: { phone: false } }}
          filters={[
            {
              columnId: "segment",
              title: t("customers.fields.segment"),
              options: CUSTOMER_SEGMENTS.map((s) => ({
                value: s,
                label: t(`customers.segments.${s}`),
              })),
            },
          ]}
          renderMobileCard={({ row }) => {
            const c = row.original;
            return (
              <div className="flex items-center gap-3">
                <UserAvatar name={c.name} size="lg" className="size-10" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <Badge variant={SEGMENT_TONES[c.segment]}>
                      {t(`customers.segments.${c.segment}`)}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="tabular-nums">{formatPhone(c.phone)}</span>
                    <Money value={c.totalSpent} className="font-medium text-foreground" />
                  </div>
                </div>
              </div>
            );
          }}
        />
      </SectionCard>
    </div>
  );
}
