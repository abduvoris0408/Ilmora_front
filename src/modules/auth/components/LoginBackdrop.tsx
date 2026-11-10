import type { CSSProperties } from "react";

import { cn } from "@/utils/cn";

/**
 * Login foni: nozik grid + yumshoq brend yorug'ligi. Faqat dekorativ, ranglar token'lardan —
 * mavzu (yorug'/qorong'i) va tanlangan brend rangi bilan birga o'zgaradi.
 */
export function LoginBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-background"
    >
      <div
        className="absolute inset-0 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000,transparent)] opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute -top-48 -left-24 size-[40rem] rounded-full bg-primary/15 blur-[130px] dark:bg-primary/20" />
      <div className="absolute top-[20%] right-[-10%] size-[42rem] rounded-full bg-chart-2/35 blur-[130px] dark:bg-primary/20" />
      <div className="absolute -bottom-56 left-[30%] size-[32rem] rounded-full bg-chart-3/10 blur-[130px]" />
    </div>
  );
}

/** Yaltiroq 3D sfera — yuqori-chapdan yorug'lik tushgandek */
function Orb({ color, className }: { color: string; className?: string }) {
  return (
    <span
      className={cn("absolute rounded-full", className)}
      style={
        {
          background: `radial-gradient(circle at 32% 28%, color-mix(in oklch, ${color}, white 55%) 0%, ${color} 42%, color-mix(in oklch, ${color}, black 35%) 100%)`,
          boxShadow: `0 30px 60px -20px color-mix(in oklch, ${color}, transparent 40%)`,
        } as CSSProperties
      }
    />
  );
}

/**
 * Shisha kartochka ORQASIDAGI sahna — kartochkaga bog'langan (har ekranda to'g'ri joyda).
 * Aniq qirrali rangli shakllar shisha chetida "suyuq" sinadi, markazda xiralashadi — liquid glass effekti
 * aynan shu kontrastdan ko'rinadi.
 */
export function GlassStage() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <Orb
        color="var(--primary)"
        className="-top-14 -right-10 size-44 motion-safe:animate-float sm:-top-20 sm:-right-24 sm:size-64"
      />
      <span className="absolute top-[42%] -left-10 size-28 rounded-full border-[14px] border-chart-2 sm:-left-20 sm:size-44 sm:border-[22px]" />
      <Orb
        color="var(--chart-4)"
        className="-bottom-8 left-[18%] size-20 motion-safe:animate-float motion-safe:[animation-delay:-2s] sm:size-24"
      />
      <span className="absolute -right-6 bottom-[22%] h-16 w-40 rotate-[-24deg] rounded-full bg-chart-3/90 sm:-right-16 sm:h-20 sm:w-52" />
    </div>
  );
}
