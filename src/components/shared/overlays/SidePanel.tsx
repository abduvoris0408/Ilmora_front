import { XIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { cn } from "@/utils/cn";

const WIDTHS = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-xl",
  xl: "sm:max-w-3xl",
} as const;

export interface SidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Sarlavha yonidagi qo'shimcha (badge, menyu) */
  headerExtra?: ReactNode;
  children: ReactNode;
  /** Pastda yopishqoq tugmalar paneli */
  footer?: ReactNode;
  size?: keyof typeof WIDTHS;
  side?: "right" | "left";
  /** Tana bo'shlig'ini olib tashlash (tablar, to'liq kenglikdagi ro'yxat uchun) */
  flush?: boolean;
  className?: string;
}

/**
 * YON PANEL (drawer) — Billz uslubidagi forma/batafsil ko'rinish.
 * md (768) va kattada o'ngdan chiquvchi Sheet, telefonda pastdan 92% balandlikdagi Drawer.
 * Tuzilma: yopishqoq sarlavha → aylanuvchi tana → yopishqoq footer.
 */
export function SidePanel({
  open,
  onOpenChange,
  title,
  description,
  headerExtra,
  children,
  footer,
  size = "md",
  side = "right",
  flush = false,
  className,
}: SidePanelProps) {
  const { t } = useTranslation();
  const desktop = useBreakpoint("md");

  const body = (
    <div className={cn("min-h-0 flex-1 overflow-y-auto", !flush && "px-4 py-4 sm:px-6 sm:py-5")}>
      {children}
    </div>
  );
  const foot = footer && (
    <div className="flex flex-col-reverse gap-2 border-t bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:px-6">
      {footer}
    </div>
  );

  if (desktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side={side}
          showCloseButton={false}
          className={cn("w-full gap-0 p-0", WIDTHS[size], className)}
        >
          <SheetHeader className="flex-row items-start gap-3 border-b px-6 py-4">
            <div className="min-w-0 flex-1 space-y-1">
              <SheetTitle className="truncate text-base">{title}</SheetTitle>
              {description ? (
                <SheetDescription>{description}</SheetDescription>
              ) : (
                <SheetDescription className="sr-only">{title}</SheetDescription>
              )}
            </div>
            {headerExtra}
            <Button
              variant="ghost"
              size="icon-sm"
              className="-mt-1 -mr-2 text-muted-foreground"
              onClick={() => onOpenChange(false)}
              aria-label={t("common.close")}
            >
              <XIcon />
            </Button>
          </SheetHeader>
          {body}
          {foot}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={cn("h-[92dvh]", className)}>
        <DrawerHeader className="flex-row items-start gap-3 border-b text-left">
          <div className="min-w-0 flex-1 space-y-0.5">
            <DrawerTitle className="truncate">{title}</DrawerTitle>
            {description ? (
              <DrawerDescription>{description}</DrawerDescription>
            ) : (
              <DrawerDescription className="sr-only">{title}</DrawerDescription>
            )}
          </div>
          {headerExtra}
        </DrawerHeader>
        {body}
        {foot}
      </DrawerContent>
    </Drawer>
  );
}
