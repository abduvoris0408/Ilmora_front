import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { delay } from "@/lib/mock/random";

import { createProductsMock } from "../mocks/products.mock";
import type { ProductFormValues } from "../schemas/product.schema";
import type { Product } from "../types";

/**
 * MAHSULOTLAR API — hozir xotiradagi mock "baza". Backend ulanganda faqat shu fayldagi
 * funksiyalar `http.get/post` ga almashadi; sahifa va komponentlar o'zgarmaydi.
 */
let db: Product[] = createProductsMock();

const api = {
  list: () => delay([...db]),
  create: (values: ProductFormValues) => {
    const product: Product = {
      ...values,
      id: `p-${Date.now()}`,
      sku: values.sku || `ILM-${String(db.length + 1000).padStart(5, "0")}`,
      barcode: values.barcode ?? "",
      brand: values.brand ?? "",
      minStock: 10,
      active: true,
      updatedAt: new Date().toISOString(),
    };
    db = [product, ...db];
    return delay(product);
  },
  update: (id: string, values: ProductFormValues) => {
    db = db.map((p) =>
      p.id === id ? { ...p, ...values, updatedAt: new Date().toISOString() } : p
    );
    return delay(db.find((p) => p.id === id)!);
  },
  remove: (ids: string[]) => {
    db = db.filter((p) => !ids.includes(p.id));
    return delay(ids);
  },
};

/** Query kalitlari — bitta joyda (invalidatsiya uchun) */
export const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
};

export const productsQuery = () =>
  queryOptions({ queryKey: productKeys.list(), queryFn: api.list });

export function useProducts() {
  return useQuery(productsQuery());
}

export function useSaveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id?: string; values: ProductFormValues }) =>
      id ? api.update(id, values) : api.create(values),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useDeleteProducts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => api.remove(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}
