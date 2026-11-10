import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { usePreferences } from "@/stores/preferences.store";

/** Haqiqiy rejim: "system" bo'lsa — OS sozlamasiga qarab */
export function useResolvedTheme(): "light" | "dark" {
  const mode = usePreferences((s) => s.mode);
  const systemDark = useMediaQuery("(prefers-color-scheme: dark)");
  if (mode === "system") return systemDark ? "dark" : "light";
  return mode;
}
