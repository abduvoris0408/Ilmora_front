import { MutationCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import i18n from "@/lib/i18n";

/**
 * Server holati — TanStack Query. Hozir mock funksiyalar bilan ishlaydi (`modules/<x>/api`),
 * backend ulanganda faqat queryFn'lar o'zgaradi.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(i18n.t("errors.generic.title"), { description: error.message });
    },
  }),
});
