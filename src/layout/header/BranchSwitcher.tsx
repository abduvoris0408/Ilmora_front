import { CheckIcon, ChevronsUpDownIcon, StoreIcon, WarehouseIcon, LayersIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BRANCHES } from "@/mocks/branches";
import { useBranchStore } from "@/stores/branch.store";
import { cn } from "@/utils/cn";

/** Filial tanlagich (Billz kabi multi-store). Tanlov barcha ro'yxat/hisobotlarga ta'sir qiladi. */
export function BranchSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation();
  const branchId = useBranchStore((s) => s.branchId);
  const setBranch = useBranchStore((s) => s.setBranch);
  const current = BRANCHES.find((b) => b.id === branchId);
  const Icon = current ? (current.type === "warehouse" ? WarehouseIcon : StoreIcon) : LayersIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("max-w-52 justify-start gap-2 px-3", className)}>
          <Icon className="text-muted-foreground" />
          <span className="truncate">{current?.name ?? t("header.allBranches")}</span>
          <ChevronsUpDownIcon className="ml-auto text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          {t("header.branch")}
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setBranch(null)}>
          <LayersIcon />
          {t("header.allBranches")}
          {!current && <CheckIcon className="ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {BRANCHES.map((b) => (
          <DropdownMenuItem key={b.id} onClick={() => setBranch(b.id)}>
            {b.type === "warehouse" ? <WarehouseIcon /> : <StoreIcon />}
            <span className="truncate">{b.name}</span>
            {b.id === branchId && <CheckIcon className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
