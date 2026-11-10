import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { cn } from "@/utils/cn";

const SIZES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
} as const;

export interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Tugmalar. Mobilda ustma-ust, to'liq kenglikda */
  footer?: ReactNode;
  size?: keyof typeof SIZES;
  className?: string;
}

/**
 * RESPONSIV MODAL — sm (640) va kattada markazdagi Dialog, telefonda pastdan chiquvchi Drawer
 * (bosh barmoq bilan yopish qulay). API ikkalasida bir xil.
 */
export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: ResponsiveModalProps) {
  const desktop = useBreakpoint("sm");

  if (desktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "max-h-[90dvh] grid-rows-[auto_1fr_auto] gap-0 p-0",
            SIZES[size],
            className
          )}
        >
          <DialogHeader className="border-b px-6 pt-5 pb-4">
            <DialogTitle className="pr-6 text-base">{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : (
              <DialogDescription className="sr-only">{title}</DialogDescription>
            )}
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto px-6 py-5">{children}</div>
          {footer && <DialogFooter className="border-t px-6 py-4">{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className={className}>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : (
            <DrawerDescription className="sr-only">{title}</DrawerDescription>
          )}
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">{children}</div>
        {footer && (
          <DrawerFooter className="border-t pb-[max(1rem,env(safe-area-inset-bottom))] *:w-full">
            {footer}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
