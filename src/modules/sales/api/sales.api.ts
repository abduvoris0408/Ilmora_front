import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { delay } from "@/lib/mock/random";

import { createSalesMock } from "../mocks/sales.mock";
import type { Sale } from "../types";

let db: Sale[] = createSalesMock();

export const saleKeys = {
  all: ["sales"] as const,
  list: () => [...saleKeys.all, "list"] as const,
};

export function useSales() {
  return useQuery({ queryKey: saleKeys.list(), queryFn: () => delay([...db]) });
}

export function useRefundSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      db = db.map((s) => (s.id === id ? { ...s, status: "refunded" as const } : s));
      return delay(id, 600);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: saleKeys.all }),
  });
}
