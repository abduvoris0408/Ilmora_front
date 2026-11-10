import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * Har sahifa tepasida. Mobilda: sarlavha ustida, tugmalar ostida (to'liq kenglikda o'raladi).
 * `actions` ichida asosiy tugma oxirida turadi.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className
      )}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-balance sm:truncate sm:text-2xl">
          {title}
        </h1>
        {description && <p className="text-sm text-pretty text-muted-foreground">{description}</p>}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 *:max-sm:flex-1">{actions}</div>
      )}
    </div>
  );
}
