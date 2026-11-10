export const PAYMENT_TYPES = ["cash", "card", "click", "payme", "credit"] as const;
export type PaymentType = (typeof PAYMENT_TYPES)[number];

export const SALE_STATUSES = ["completed", "refunded", "pending"] as const;
export type SaleStatus = (typeof SALE_STATUSES)[number];

export interface SaleItem {
  name: string;
  qty: number;
  price: number;
}

export interface Sale {
  id: string;
  number: number;
  branchId: string;
  cashier: string;
  customer: string | null;
  items: SaleItem[];
  discount: number;
  total: number;
  payment: PaymentType;
  status: SaleStatus;
  createdAt: string;
}
