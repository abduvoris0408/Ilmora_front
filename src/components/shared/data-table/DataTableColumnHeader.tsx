import type { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon, EyeOffIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/cn";

/** Saralanadigan ustun sarlavhasi: bosilganda menyu (o'sish / kamayish / yashirish) */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  align = "left",
}: {
  column: Column<TData, TValue>;
  title: ReactNode;
  className?: string;
  align?: "left" | "right";
}) {
  const { t } = useTranslation();

  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(align === "right" && "text-right", className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();
  const SortIcon =
    sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon;

  return (
    <div className={cn("flex items-center", align === "right" && "justify-end", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "-mx-2 h-7 gap-1 px-2 text-xs font-medium text-muted-foreground hover:bg-background data-[state=open]:bg-background",
              sorted && "text-foreground"
            )}
          >
            {title}
            <SortIcon className={cn("size-3.5", !sorted && "opacity-50")} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align === "right" ? "end" : "start"}>
          {column.getCanSort() && (
            <>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <ArrowUpIcon /> {t("table.sortAsc")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <ArrowDownIcon /> {t("table.sortDesc")}
              </DropdownMenuItem>
            </>
          )}
          {column.getCanSort() && column.getCanHide() && <DropdownMenuSeparator />}
          {column.getCanHide() && (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOffIcon /> {t("table.hideColumn")}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
