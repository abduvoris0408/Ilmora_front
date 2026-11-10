export const CUSTOMER_SEGMENTS = ["vip", "regular", "new", "sleeping"] as const;
export type CustomerSegment = (typeof CUSTOMER_SEGMENTS)[number];

export interface Customer {
  id: string;
  name: string;
  phone: string;
  gender: "male" | "female";
  segment: CustomerSegment;
  totalSpent: number;
  visits: number;
  cashback: number;
  debt: number;
  birthday: string;
  lastVisit: string;
  createdAt: string;
  note?: string;
}

export const SEGMENT_TONES: Record<CustomerSegment, "brand" | "success" | "info" | "muted"> = {
  vip: "brand",
  regular: "success",
  new: "info",
  sleeping: "muted",
};
