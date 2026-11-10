import type { LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";

const TONES = {
  neutral: "border bg-background text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  solid: "bg-primary text-primary-foreground",
} as const;

export type IconTone = keyof typeof TONES;

const SIZES = {
  xs: "size-6 rounded-md [&>svg]:size-3.5",
  sm: "size-8 rounded-lg [&>svg]:size-4",
  md: "size-10 rounded-lg [&>svg]:size-5",
  lg: "size-12 rounded-xl [&>svg]:size-6",
} as const;

/** Kvadrat ichida ikon — kartochka sarlavhalari, ro'yxatlar, bo'sh holatlar uchun */
export function IconBox({
  icon: Icon,
  size = "sm",
  tone = "neutral",
  className,
}: {
  icon: LucideIcon;
  size?: keyof typeof SIZES;
  tone?: IconTone;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        TONES[tone],
        SIZES[size],
        className
      )}
    >
      <Icon />
    </span>
  );
}
