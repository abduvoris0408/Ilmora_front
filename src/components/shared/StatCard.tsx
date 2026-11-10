import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/cn";

import { IconBox, type IconTone } from "./IconBox";

/** Ko'rsatkich kartochkasi. Grid: `grid-cols-2 lg:grid-cols-4` — mobilda ham 2 tadan. */
export function StatCard({
  icon,
  tone = "primary",
  label,
  value,
  hint,
  badge,
  loading = false,
  className,
}: {
  icon: LucideIcon;
  tone?: IconTone;
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  badge?: ReactNode;
  loading?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-3.5 sm:gap-4 sm:p-4 compact:gap-2.5 compact:p-3",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <IconBox icon={icon} tone={tone} className="max-sm:hidden" />
        <span className="min-w-0 flex-1 truncate text-xs font-medium text-muted-foreground sm:text-sm sm:text-foreground">
          {label}
        </span>
        <span className="max-sm:hidden">{badge}</span>
      </div>
      <div className="space-y-1">
        {loading ? (
          <Skeleton className="h-7 w-24 sm:h-8" />
        ) : (
          <p className="truncate text-xl leading-none font-semibold tracking-tight tabular-nums sm:text-[1.75rem]">
            {value}
          </p>
        )}
        {(hint || badge) && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="sm:hidden">{badge}</span>
            <span className="truncate">{hint}</span>
          </div>
        )}
      </div>
    </div>
  );
}
