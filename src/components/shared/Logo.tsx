import { cn } from "@/utils/cn";

/**
 * Ilmora belgisi — faqat `currentColor` va token ranglarida (mavzu bilan birga o'zgaradi).
 * `variant="mark"` — faqat belgi (yig'ilgan sidebar), `"full"` — belgi + so'z.
 */
export function Logo({
  variant = "full",
  className,
}: {
  variant?: "full" | "mark";
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-[1.1rem]" fill="none" aria-hidden>
          <path
            d="M7 4.5v15M12 9v10.5M17 4.5v15"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="4.6" r="1.7" fill="currentColor" />
        </svg>
      </span>
      {variant === "full" && (
        <span className="text-[1.05rem] font-semibold tracking-tight">Ilmora</span>
      )}
    </span>
  );
}
