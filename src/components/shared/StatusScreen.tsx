import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { IconBox, type IconTone } from "./IconBox";

/** 404 / 403 / xato ekrani */
export function StatusScreen({
  icon,
  tone = "primary",
  code,
  title,
  description,
  actions,
}: {
  icon: LucideIcon;
  tone?: IconTone;
  code?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-16 text-center">
      <IconBox icon={icon} tone={tone} size="lg" />
      {code && <p className="mt-6 text-sm font-semibold text-primary tabular-nums">{code}</p>}
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-balance">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-pretty text-muted-foreground">{description}</p>
      )}
      {actions && (
        <div className="mt-8 flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
          {actions}
        </div>
      )}
    </div>
  );
}
