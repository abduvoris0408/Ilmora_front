import type { FilterFn, Row, RowData, Table } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface FacetOption {
  label: string;
  value: string;
  icon?: LucideIcon;
}

export interface FacetFilterConfig {
  columnId: string;
  title: string;
  options: FacetOption[];
}

export interface BulkActionsContext<TData> {
  rows: Row<TData>[];
  table: Table<TData>;
  clear: () => void;
}

export interface MobileCardContext<TData> {
  row: Row<TData>;
  /** Kartochka bosilganda (onRowClick bilan bir xil) */
  open?: () => void;
}

export type MobileCardRenderer<TData> = (ctx: MobileCardContext<TData>) => ReactNode;

/** Faceted filtr uchun: qiymat tanlanganlar ro'yxatida bormi */
export const facetFilterFn: FilterFn<unknown> = (row, columnId, value: string[]) =>
  !value?.length || value.includes(String(row.getValue(columnId)));

declare module "@tanstack/react-table" {
  // Ustun meta'si: mobil kartochka, hizalash, sarlavha nomi (ustunlar menyusi uchun)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Ustunlar menyusida ko'rinadigan nom */
    label?: string;
    align?: "left" | "right" | "center";
    /** Kenglikni cheklash uchun klass (masalan "w-12") */
    className?: string;
  }
}
