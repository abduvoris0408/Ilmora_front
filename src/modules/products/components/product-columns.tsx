import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, PackageIcon, PencilIcon, Trash2Icon } from "lucide-react";
import type { TFunction } from "i18next";

import { DataTableColumnHeader, facetFilterFn, selectColumn } from "@/components/shared/data-table";
import { IconBox } from "@/components/shared/IconBox";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatNumber, formatPercent, formatRelative } from "@/utils/format";

import { marginPercent, stockStatus, type Product } from "../types";

export interface ProductColumnOptions {
  t: TFunction;
  canEdit: boolean;
  canDelete: boolean;
  canSeeCost: boolean;
  selectable: boolean;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

/**
 * Ustunlar — ruxsatga qarab (masalan tannarx faqat `products.view_cost` bo'lsa).
 * `meta.label` — "Ustunlar" menyusidagi nom.
 */
export function productColumns(o: ProductColumnOptions): ColumnDef<Product, unknown>[] {
  const { t } = o;
  const cols: ColumnDef<Product, unknown>[] = [];
  if (o.selectable) cols.push(selectColumn<Product>());

  cols.push(
    {
      accessorKey: "name",
      meta: { label: t("products.fields.name") },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("products.fields.name")} />
      ),
      cell: ({ row }) => (
        <div className="flex min-w-56 items-center gap-3">
          <IconBox icon={PackageIcon} />
          <div className="min-w-0">
            <p className="truncate font-medium">{row.original.name}</p>
            <p className="truncate text-xs text-muted-foreground tabular-nums">
              {row.original.sku}
            </p>
          </div>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "category",
      meta: { label: t("products.fields.category") },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("products.fields.category")} />
      ),
      cell: ({ row }) => t(`products.categories.${row.original.category}`),
      filterFn: facetFilterFn as never,
    },
    {
      accessorKey: "brand",
      meta: { label: t("products.fields.brand") },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("products.fields.brand")} />
      ),
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.brand || "—"}</span>,
    },
    {
      accessorKey: "barcode",
      meta: { label: t("products.fields.barcode") },
      header: t("products.fields.barcode"),
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">{row.original.barcode}</span>
      ),
      enableSorting: false,
    }
  );

  if (o.canSeeCost) {
    cols.push({
      accessorKey: "cost",
      meta: { label: t("products.fields.cost"), align: "right" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("products.fields.cost")} align="right" />
      ),
      cell: ({ row }) => (
        <Money value={row.original.cost} hideCurrency className="text-muted-foreground" />
      ),
    });
  }

  cols.push(
    {
      accessorKey: "price",
      meta: { label: t("products.fields.price"), align: "right" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("products.fields.price")} align="right" />
      ),
      cell: ({ row }) => (
        <div>
          <Money value={row.original.price} className="font-medium" />
          {o.canSeeCost && (
            <p className="text-xs text-success tabular-nums">
              +{formatPercent(marginPercent(row.original))}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "stock",
      meta: { label: t("products.fields.stock"), align: "right" },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("products.fields.stock")} align="right" />
      ),
      cell: ({ row }) => (
        <span className="tabular-nums">
          {formatNumber(row.original.stock)}{" "}
          <span className="text-xs text-muted-foreground">
            {t(`products.units.${row.original.unit}`)}
          </span>
        </span>
      ),
    },
    {
      id: "status",
      accessorFn: (p) => stockStatus(p),
      meta: { label: t("common.status") },
      header: ({ column }) => <DataTableColumnHeader column={column} title={t("common.status")} />,
      cell: ({ row }) => <StatusBadge status={stockStatus(row.original)} />,
      filterFn: facetFilterFn as never,
    },
    {
      accessorKey: "updatedAt",
      meta: { label: t("products.fields.updatedAt") },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("products.fields.updatedAt")} />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{formatRelative(row.original.updatedAt)}</span>
      ),
    }
  );

  if (o.canEdit || o.canDelete) {
    cols.push({
      id: "actions",
      meta: { className: "w-12" },
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground"
              aria-label={t("common.actions")}
            >
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {o.canEdit && (
              <DropdownMenuItem onClick={() => o.onEdit(row.original)}>
                <PencilIcon />
                {t("common.edit")}
              </DropdownMenuItem>
            )}
            {o.canEdit && o.canDelete && <DropdownMenuSeparator />}
            {o.canDelete && (
              <DropdownMenuItem variant="destructive" onClick={() => o.onDelete(row.original)}>
                <Trash2Icon />
                {t("common.delete")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    });
  }

  return cols;
}
