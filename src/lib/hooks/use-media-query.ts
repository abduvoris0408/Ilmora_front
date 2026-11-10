import { useCallback, useSyncExternalStore } from "react";

/**
 * CSS media query'ga obuna — `useSyncExternalStore` bilan (birinchi chizishda ham to'g'ri qiymat,
 * "miltillash" yo'q).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}
