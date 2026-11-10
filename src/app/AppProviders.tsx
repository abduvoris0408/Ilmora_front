import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { env } from "@/config/env";
import i18n from "@/lib/i18n";
import { OverlayHost } from "@/lib/overlays";
import { ThemeSync } from "@/lib/theme/ThemeSync";

import { queryClient } from "./query-client";

const QueryDevtools = env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((m) => ({ default: m.ReactQueryDevtools }))
    )
  : () => null;

/** Barcha global provider'lar — tartib muhim emas, lekin hammasi shu yerda */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider delayDuration={300}>
          <ThemeSync />
          {children}
          <OverlayHost />
          <Toaster position="top-center" richColors={false} closeButton />
        </TooltipProvider>
        <Suspense>
          <QueryDevtools buttonPosition="bottom-left" />
        </Suspense>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
