import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import i18n from "@/lib/i18n";

/** Qator tanlash ustuni — `columns` ro'yxatining boshiga qo'shiladi */
export function selectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    meta: { className: "w-10" },
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(Boolean(v))}
        aria-label={i18n.t("table.selectAll")}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(Boolean(v))}
        onClick={(e) => e.stopPropagation()}
        aria-label={i18n.t("table.selectRow")}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}
