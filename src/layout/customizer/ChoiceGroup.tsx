import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

/**
 * Radio kartochkalar guruhi (customizer uchun). Klaviatura: ←/→ bilan tanlash.
 * `preview` — tepada mini-ko'rinish, `label` — ostida.
 */
export function ChoiceGroup<V extends string | number>({
  value,
  onChange,
  options,
  columns = 3,
  label,
}: {
  value: V;
  onChange: (value: V) => void;
  options: { value: V; label: ReactNode; preview?: ReactNode; icon?: ReactNode }[];
  columns?: 2 | 3 | 4 | 5;
  label: string;
}) {
  const move = (dir: 1 | -1) => {
    const i = options.findIndex((o) => o.value === value);
    const next = options[(i + dir + options.length) % options.length];
    if (next) onChange(next.value);
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "grid gap-2",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-4",
        columns === 5 && "grid-cols-5"
      )}
      onKeyDown={(e) => {
        const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key] as
          1 | -1 | undefined;
        if (!dir) return;
        e.preventDefault();
        move(dir);
      }}
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn(
              "group relative flex min-w-0 flex-col items-center gap-2 rounded-lg border p-2 text-xs font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-[3px] focus-visible:ring-ring/50",
              selected && "border-primary bg-accent text-accent-foreground hover:bg-accent"
            )}
          >
            {o.preview}
            <span className="flex max-w-full items-center gap-1.5 truncate">
              {o.icon}
              {o.label}
            </span>
            {selected && (
              <span className="absolute top-1.5 right-1.5 grid size-4 place-items-center rounded-full bg-primary text-primary-foreground">
                <CheckIcon className="size-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Customizer bo'limi sarlavhasi */
export function SettingRow({
  title,
  action,
  children,
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {title}
        </h3>
        {action}
      </div>
      {children}
    </section>
  );
}
