import { cn } from "@/utils/cn";

/**
 * Customizer'dagi mini-ko'rinishlar — haqiqiy token'lar bilan chiziladi,
 * shuning uchun tanlangan rang/rejim darhol ko'rinadi.
 */

const frame = "aspect-[4/3] w-full overflow-hidden rounded-md border bg-background";

/*
 * Istisno: rejim preview'lari ataylab qat'iy yorug'/qorong'i ranglarda chiziladi —
 * joriy mavzudan qat'i nazar "yorug'" varianti yorug', "qorong'i" varianti qorong'i ko'rinishi kerak.
 */
function ModePane({ dark }: { dark: boolean }) {
  return (
    <div
      className={cn(
        "flex size-full gap-1 p-1",
        dark ? "bg-[oklch(0.18_0.01_265)]" : "bg-[oklch(0.98_0_0)]"
      )}
    >
      <div
        className={cn(
          "w-1/4 rounded-sm",
          dark ? "bg-[oklch(0.26_0.01_265)]" : "bg-[oklch(0.92_0_0)]"
        )}
      />
      <div className="flex flex-1 flex-col gap-1">
        <div
          className={cn(
            "h-1.5 w-2/3 rounded-full",
            dark ? "bg-[oklch(0.4_0.01_265)]" : "bg-[oklch(0.85_0_0)]"
          )}
        />
        <div className="h-1.5 w-1/3 rounded-full bg-primary" />
        <div
          className={cn(
            "flex-1 rounded-sm",
            dark ? "bg-[oklch(0.24_0.01_265)]" : "bg-[oklch(0.94_0_0)]"
          )}
        />
      </div>
    </div>
  );
}

export function ModePreview({ mode }: { mode: "light" | "dark" | "system" }) {
  const Pane = ModePane;
  return (
    <div className={cn(frame, "flex")}>
      {mode === "system" ? (
        <>
          <div className="w-1/2 overflow-hidden">
            <Pane dark={false} />
          </div>
          <div className="w-1/2 overflow-hidden">
            <Pane dark />
          </div>
        </>
      ) : (
        <Pane dark={mode === "dark"} />
      )}
    </div>
  );
}

const SIDEBAR_SWATCH = {
  light: "bg-card border-r",
  dark: "bg-[oklch(0.22_0.014_265)]",
  brand: "bg-primary",
} as const;

export function SidebarStylePreview({ style }: { style: keyof typeof SIDEBAR_SWATCH }) {
  const bar = style === "light" ? "bg-muted-foreground/30" : "bg-white/35";
  const active = style === "light" ? "bg-primary/25" : "bg-white/25";
  return (
    <div className={cn(frame, "flex")}>
      <div className={cn("flex w-1/3 flex-col gap-1 p-1", SIDEBAR_SWATCH[style])}>
        <div className={cn("h-1.5 rounded-full", bar)} />
        <div className={cn("h-1.5 rounded-full", active)} />
        <div className={cn("h-1.5 rounded-full", bar)} />
        <div className={cn("h-1.5 rounded-full", bar)} />
      </div>
      <div className="flex flex-1 flex-col gap-1 bg-muted/40 p-1">
        <div className="h-1.5 w-1/2 rounded-full bg-muted-foreground/25" />
        <div className="flex-1 rounded-sm border bg-card" />
      </div>
    </div>
  );
}

export function LayoutPreview({ layout }: { layout: "left" | "right" | "top" }) {
  const side = (
    <div className="flex w-1/4 flex-col gap-1 bg-primary/15 p-1">
      <div className="h-1.5 rounded-full bg-primary/50" />
      <div className="h-1.5 rounded-full bg-primary/30" />
      <div className="h-1.5 rounded-full bg-primary/30" />
    </div>
  );
  const content = (
    <div className="flex flex-1 flex-col gap-1 p-1">
      <div className="h-1.5 w-1/2 rounded-full bg-muted-foreground/25" />
      <div className="grid flex-1 grid-cols-2 gap-1">
        <div className="rounded-sm border bg-card" />
        <div className="rounded-sm border bg-card" />
      </div>
    </div>
  );
  if (layout === "top") {
    return (
      <div className={cn(frame, "flex flex-col")}>
        <div className="flex h-1/4 items-center gap-1 bg-primary/15 px-1">
          <div className="h-1.5 w-1/6 rounded-full bg-primary/50" />
          <div className="h-1.5 w-1/6 rounded-full bg-primary/30" />
          <div className="h-1.5 w-1/6 rounded-full bg-primary/30" />
        </div>
        {content}
      </div>
    );
  }
  return (
    <div className={cn(frame, "flex", layout === "right" && "flex-row-reverse")}>
      {side}
      {content}
    </div>
  );
}

export function DensityPreview({ compact }: { compact: boolean }) {
  return (
    <div
      className={cn(frame, "flex flex-col justify-center p-1.5", compact ? "gap-0.5" : "gap-1.5")}
    >
      {Array.from({ length: compact ? 5 : 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="size-1.5 rounded-full bg-primary/40" />
          <div className="h-1.5 flex-1 rounded-full bg-muted-foreground/25" />
        </div>
      ))}
    </div>
  );
}

export function WidthPreview({ full }: { full: boolean }) {
  return (
    <div className={cn(frame, "flex items-stretch bg-muted/40 p-1")}>
      <div
        className={cn(
          "flex flex-col gap-1 rounded-sm border bg-card p-1",
          full ? "w-full" : "mx-auto w-3/5"
        )}
      >
        <div className="h-1.5 w-1/2 rounded-full bg-muted-foreground/25" />
        <div className="h-1.5 w-1/3 rounded-full bg-primary/40" />
      </div>
    </div>
  );
}
