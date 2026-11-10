import { BREAKPOINTS, type Breakpoint } from "@/config/breakpoints";

import { useMediaQuery } from "./use-media-query";

/** `useBreakpoint("md")` → ekran kamida 768px bo'lsa `true` (Tailwind'dagi `md:` bilan bir xil) */
export function useBreakpoint(bp: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[bp]}px)`);
}

/** Ekran berilgan breakpoint'dan kichikmi (`max-md:` bilan bir xil) */
export function useBelow(bp: Breakpoint): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS[bp] - 0.02}px)`);
}

/** Joriy eng katta mos breakpoint: "base" | "sm" | "md" | "lg" | "xl" | "2xl" */
export function useCurrentBreakpoint(): Breakpoint | "base" {
  const sm = useBreakpoint("sm");
  const md = useBreakpoint("md");
  const lg = useBreakpoint("lg");
  const xl = useBreakpoint("xl");
  const xxl = useBreakpoint("2xl");
  if (xxl) return "2xl";
  if (xl) return "xl";
  if (lg) return "lg";
  if (md) return "md";
  if (sm) return "sm";
  return "base";
}

/** Sensorli qurilma (hover yo'q) — tooltip'lar o'rniga matn ko'rsatish uchun */
export function useIsTouch(): boolean {
  return useMediaQuery("(hover: none) and (pointer: coarse)");
}
