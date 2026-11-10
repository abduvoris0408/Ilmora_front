import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

export interface InfoItem {
  label: ReactNode;
  value: ReactNode;
  /** 2 ustunli ro'yxatda butun qatorni egallaydi */
  wide?: boolean;
}

/** "Nom — qiymat" ro'yxati. Bo'sh qiymat → "—". Mobilda doim 1 ustun. */
export function InfoList({
  items,
  columns = 1,
  className,
}: {
  items: InfoItem[];
  columns?: 1 | 2;
  className?: string;
}) {
  return (
    <dl className={cn("grid gap-x-6 gap-y-4", columns === 2 && "sm:grid-cols-2", className)}>
      {items.map((item, i) => (
        <div key={i} className={cn("min-w-0 space-y-1", item.wide && "sm:col-span-2")}>
          <dt className="text-xs text-muted-foreground">{item.label}</dt>
          <dd className="text-sm font-medium break-words">
            {item.value === null || item.value === undefined || item.value === ""
              ? "—"
              : item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
