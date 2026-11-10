import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

import { IconBox, type IconTone } from "./IconBox";

/** Sahifa bloki (eng ko'p ishlatiladigan). Sarlavha kichik — sahifada faqat PageHeader katta. */
export function SectionCard({
  icon,
  iconTone = "primary",
  title,
  description,
  actions,
  footer,
  children,
  className,
  contentClassName,
}: {
  icon?: LucideIcon;
  iconTone?: IconTone;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    // min-w-0: grid/flex ichida keng jadval kartochkani ekrandan chiqarib yubormasin
    <section className={cn("flex min-w-0 flex-col rounded-xl border bg-card", className)}>
      {(title || actions) && (
        <header className="flex min-h-14 flex-wrap items-center gap-3 px-4 pt-4 pb-3 sm:px-5 compact:min-h-12 compact:pt-3 compact:pb-2">
          {icon && <IconBox icon={icon} tone={iconTone} />}
          <div className="min-w-0 flex-1">
            {title && <h2 className="truncate text-sm font-semibold">{title}</h2>}
            {description && <p className="truncate text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div
        className={cn(
          "min-w-0 flex-1 px-4 pb-4 sm:px-5 sm:pb-5",
          !title && !actions && "pt-4 sm:pt-5",
          contentClassName
        )}
      >
        {children}
      </div>
      {footer && <footer className="border-t px-4 py-3 sm:px-5">{footer}</footer>}
    </section>
  );
}
