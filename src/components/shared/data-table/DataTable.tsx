import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type InitialTableState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { SearchIcon, SearchXIcon, XIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STORAGE_KEYS } from "@/config/app";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { cn } from "@/utils/cn";

import { EmptyState } from "../EmptyState";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableViewOptions } from "./DataTableViewOptions";
import type { BulkActionsContext, FacetFilterConfig, MobileCardRenderer } from "./types";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  data: TData[];
  getRowId?: (row: TData) => string;
  loading?: boolean;
  /** Global qidiruv (barcha matnli ustunlar bo'yicha) */
  searchable?: boolean;
  searchPlaceholder?: string;
  filters?: FacetFilterConfig[];
  /** Toolbar o'ng tomonidagi qo'shimcha tugmalar (eksport va h.k.) */
  toolbar?: ReactNode;
  /** Tanlangan qatorlar uchun suzuvchi panel tugmalari */
  bulkActions?: (ctx: BulkActionsContext<TData>) => ReactNode;
  onRowClick?: (row: TData) => void;
  /** md (768) dan kichik ekranda jadval o'rniga kartochka. Berilmasa — gorizontal scroll. */
  renderMobileCard?: MobileCardRenderer<TData>;
  /** Ustunlar ko'rinishini localStorage'da saqlash kaliti */
  persistKey?: string;
  initialState?: InitialTableState;
  pageSize?: number;
  emptyState?: ReactNode;
  className?: string;
}

function loadVisibility(key?: string): VisibilityState {
  if (!key) return {};
  try {
    return JSON.parse(localStorage.getItem(`${STORAGE_KEYS.tables}.${key}`) ?? "{}");
  } catch {
    return {};
  }
}

/**
 * UNIVERSAL JADVAL — barcha ro'yxat sahifalari shu komponentdan foydalanadi.
 * Hozir klient tomonida (statik ma'lumot). Server pagination kerak bo'lganda — `manualPagination`
 * bilan kengaytiriladi, API o'zgarmaydi.
 */
export function DataTable<TData>({
  columns,
  data,
  getRowId,
  loading = false,
  searchable = true,
  searchPlaceholder,
  filters = [],
  toolbar,
  bulkActions,
  onRowClick,
  renderMobileCard,
  persistKey,
  initialState,
  pageSize = 20,
  emptyState,
  className,
}: DataTableProps<TData>) {
  const { t } = useTranslation();
  const desktop = useBreakpoint("md");
  const cardMode = !desktop && Boolean(renderMobileCard);

  const [sorting, setSorting] = useState<SortingState>(initialState?.sorting ?? []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => ({
    ...initialState?.columnVisibility,
    ...loadVisibility(persistKey),
  }));

  useEffect(() => {
    if (!persistKey) return;
    try {
      localStorage.setItem(
        `${STORAGE_KEYS.tables}.${persistKey}`,
        JSON.stringify(columnVisibility)
      );
    } catch {
      /* private rejim — e'tiborsiz */
    }
  }, [columnVisibility, persistKey]);

  // TanStack Table React Compiler bilan memoizatsiya qilinmaydi — bu kutilgan va xavfsiz
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, columnFilters, globalFilter, rowSelection, columnVisibility },
    initialState: { pagination: { pageIndex: 0, pageSize }, ...initialState },
    enableRowSelection: Boolean(bulkActions),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    autoResetPageIndex: true,
  });

  const isFiltered = globalFilter.length > 0 || columnFilters.length > 0;
  const resetFilters = () => {
    setGlobalFilter("");
    setColumnFilters([]);
  };
  const rows = table.getRowModel().rows;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns().length;

  const empty = emptyState ?? (
    <EmptyState
      icon={SearchXIcon}
      bordered={false}
      title={t("table.noResults")}
      description={t("table.noResultsHint")}
      action={
        isFiltered && (
          <Button variant="outline" size="sm" onClick={resetFilters}>
            {t("table.clearFilters")}
          </Button>
        )
      }
    />
  );

  return (
    <div className={cn("min-w-0", className)}>
      {/* Toolbar: mobilda qidiruv to'liq qatorda, filtrlar ostida gorizontal scroll */}
      {(searchable || filters.length > 0 || toolbar) && (
        <div className="flex flex-col gap-2 pb-3 lg:flex-row lg:items-center">
          {searchable && (
            <InputGroup className="h-9 lg:w-72">
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder ?? t("table.search")}
              />
              {globalFilter && (
                <InputGroupAddon align="inline-end">
                  <button
                    type="button"
                    onClick={() => setGlobalFilter("")}
                    aria-label={t("common.clear")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <XIcon className="size-4" />
                  </button>
                </InputGroupAddon>
              )}
            </InputGroup>
          )}
          <div className="-mx-4 flex flex-1 items-center gap-2 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:px-0 [&>*]:shrink-0">
            {filters.map((f) => (
              <DataTableFacetedFilter
                key={f.columnId}
                column={table.getColumn(f.columnId)}
                title={f.title}
                options={f.options}
              />
            ))}
            {isFiltered && (
              <Button variant="ghost" size="sm" className="h-9" onClick={resetFilters}>
                {t("common.reset")}
                <XIcon />
              </Button>
            )}
            <div className="ml-auto flex items-center gap-2">
              {toolbar}
              <DataTableViewOptions table={table} />
            </div>
          </div>
        </div>
      )}

      {cardMode ? (
        <MobileCardList
          rows={rows}
          loading={loading}
          empty={empty}
          selectable={Boolean(bulkActions)}
          render={renderMobileCard!}
          onRowClick={onRowClick}
        />
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        meta?.align === "right" && "text-right",
                        meta?.align === "center" && "text-center",
                        meta?.className
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {Array.from({ length: visibleColumns }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full max-w-32" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(onRowClick && "cursor-pointer")}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta;
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          meta?.align === "right" && "text-right tabular-nums",
                          meta?.align === "center" && "text-center",
                          meta?.className
                        )}
                        onClick={
                          cell.column.id === "actions" ? (e) => e.stopPropagation() : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={visibleColumns} className="p-0">
                  {empty}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {!loading && rows.length > 0 && <DataTablePagination table={table} />}

      {bulkActions && selectedRows.length > 0 && (
        <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-4 md:bottom-6">
          <div className="flex max-w-full animate-in items-center gap-2 overflow-x-auto rounded-full glass py-1.5 pr-1.5 pl-4 duration-200 fade-in slide-in-from-bottom-4">
            <span className="text-sm font-medium whitespace-nowrap tabular-nums">
              {t("table.selected", { count: selectedRows.length })}
            </span>
            <div className="flex items-center gap-1.5">
              {bulkActions({ rows: selectedRows, table, clear: () => setRowSelection({}) })}
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-full"
              onClick={() => setRowSelection({})}
              aria-label={t("common.clear")}
            >
              <XIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileCardList<TData>({
  rows,
  loading,
  empty,
  selectable,
  render,
  onRowClick,
}: {
  rows: Row<TData>[];
  loading: boolean;
  empty: ReactNode;
  selectable: boolean;
  render: MobileCardRenderer<TData>;
  onRowClick?: (row: TData) => void;
}) {
  if (loading) {
    return (
      <div className="grid gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }
  if (!rows.length) return <div className="rounded-xl border">{empty}</div>;

  return (
    <ul className="grid gap-2">
      {rows.map((row) => {
        const open = onRowClick ? () => onRowClick(row.original) : undefined;
        return (
          <li
            key={row.id}
            data-state={row.getIsSelected() ? "selected" : undefined}
            className={cn(
              "relative rounded-xl border bg-card p-3.5 transition-colors data-[state=selected]:border-primary/40 data-[state=selected]:bg-accent/40",
              open && "cursor-pointer active:bg-muted/60"
            )}
            onClick={open}
          >
            {selectable && (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(v) => row.toggleSelected(Boolean(v))}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-3.5 right-3.5"
                aria-label="select"
              />
            )}
            {render({ row, open })}
          </li>
        );
      })}
    </ul>
  );
}
