import { InboxIcon, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

import { IconBox, type IconTone } from "./IconBox";

/** Bo'sh ro'yxat / natija yo'q / "tez orada". */
export function EmptyState({
  icon = InboxIcon,
  tone = "neutral",
  title,
  description,
  action,
  bordered = true,
  className,
}: {
  icon?: LucideIcon;
  tone?: IconTone;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  bordered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-52 flex-col items-center justify-center px-6 py-10 text-center",
        bordered && "rounded-xl border border-dashed bg-muted/30",
        className
      )}
    >
      <div className="relative">
        {/* Bezak halqalari — faqat token ranglarida */}
        <span
          aria-hidden
          className="absolute -inset-3 rounded-2xl border border-dashed opacity-60"
        />
        <IconBox icon={icon} tone={tone} size="lg" className="relative animate-float" />
      </div>
      <p className="mt-6 text-sm font-semibold text-balance">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-pretty text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
