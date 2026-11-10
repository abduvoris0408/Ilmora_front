import { useEffect, useRef } from "react";

import { usePreferences } from "@/stores/preferences.store";

import { applyPreferences } from "./apply-preferences";

/**
 * Preferences store'ni <html> bilan sinxronlaydi. UI chizmaydi.
 * "system" rejimida OS mavzusi o'zgarishini tinglaydi.
 */
export function ThemeSync() {
  const firstRun = useRef(true);

  useEffect(() => {
    applyPreferences(usePreferences.getState());
    const unsub = usePreferences.subscribe((state) => {
      applyPreferences(state, { animate: !firstRun.current });
    });
    firstRun.current = false;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      const state = usePreferences.getState();
      if (state.mode === "system") applyPreferences(state, { animate: true });
    };
    mql.addEventListener("change", onSystemChange);

    return () => {
      unsub();
      mql.removeEventListener("change", onSystemChange);
    };
  }, []);

  return null;
}
