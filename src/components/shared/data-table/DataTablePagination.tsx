import type { Table } from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/cn";
import { formatNumber } from "@/utils/format";

const PAGE_SIZES = [10, 20, 50, 100];

/** Sahifa raqamlari: 1 … 4 5 6 … 12 */
function pageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages = new Set([0, total - 1, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 0 && p < total).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1]! > 1) out.push("…");
    out.push(p);
  });
  return out;
}

/**
 * Jadval ostida: chapda "21–40 / 135", o'ngda sahifalar. Mobilda faqat ‹ › va "2 / 7".
 * Bitta sahifa bo'lsa — faqat hisoblagich.
 */
export function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
  const { t } = useTranslation();
  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();
  const from = total === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(total, (pageIndex + 1) * pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
      <div className="flex items-center gap-3 text-sm text-muted-foreground tabular-nums">
        <span>
          {formatNumber(from)}–{formatNumber(to)} / {formatNumber(total)}
        </span>
        <div className="flex items-center gap-2 max-sm:hidden">
          <span className="text-xs">{t("table.rowsPerPage")}</span>
          <Select value={String(pageSize)} onValueChange={(v) => table.setPageSize(Number(v))}>
            <SelectTrigger size="sm" className="h-8 w-[4.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZES.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label={t("common.previous")}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="px-2 text-sm tabular-nums sm:hidden">
            {pageIndex + 1} / {pageCount}
          </span>
          <div className="flex items-center gap-1 max-sm:hidden">
            {pageRange(pageIndex, pageCount).map((p, i) =>
              p === "…" ? (
                <span key={`e${i}`} className="w-8 text-center text-sm text-muted-foreground">
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === pageIndex ? "outline" : "ghost"}
                  size="icon-sm"
                  className={cn("tabular-nums", p !== pageIndex && "text-muted-foreground")}
                  onClick={() => table.setPageIndex(p)}
                  aria-current={p === pageIndex ? "page" : undefined}
                >
                  {p + 1}
                </Button>
              )
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label={t("common.next")}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      )}
    </div>
  );
}
