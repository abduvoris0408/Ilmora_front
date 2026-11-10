import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/** Forma ichidagi bo'lim: kichik sarlavha + maydonlar grid'i (mobilda 1, sm+ da `columns`) */
export function FormSection({
  title,
  description,
  columns = 1,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  columns?: 1 | 2;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("min-w-0 space-y-4", className)}>
      {(title || description) && (
        <legend className="mb-4 space-y-0.5">
          {title && <span className="block text-sm font-semibold">{title}</span>}
          {description && (
            <span className="block text-xs text-muted-foreground">{description}</span>
          )}
        </legend>
      )}
      <div className={cn("grid gap-4", columns === 2 && "sm:grid-cols-2")}>{children}</div>
    </fieldset>
  );
}
