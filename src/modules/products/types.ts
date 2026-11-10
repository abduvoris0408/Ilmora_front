export const PRODUCT_CATEGORIES = [
  "drinks",
  "food",
  "household",
  "electronics",
  "clothing",
  "cosmetics",
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const PRODUCT_UNITS = ["pcs", "kg", "l", "m", "pack"] as const;
export type ProductUnit = (typeof PRODUCT_UNITS)[number];

export type StockStatus = "inStock" | "lowStock" | "outOfStock";

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  category: ProductCategory;
  brand: string;
  unit: ProductUnit;
  price: number;
  cost: number;
  stock: number;
  /** Shu miqdordan kam bo'lsa — "kam qolgan" */
  minStock: number;
  trackStock: boolean;
  active: boolean;
  updatedAt: string;
}

export function stockStatus(p: Pick<Product, "stock" | "minStock">): StockStatus {
  if (p.stock <= 0) return "outOfStock";
  if (p.stock <= p.minStock) return "lowStock";
  return "inStock";
}

export function marginPercent(p: Pick<Product, "price" | "cost">): number {
  return p.cost > 0 ? (p.price - p.cost) / p.cost : 0;
}
