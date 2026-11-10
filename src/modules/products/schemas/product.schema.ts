import { z } from "zod";

import { msg, v } from "@/lib/validation";

import { PRODUCT_CATEGORIES, PRODUCT_UNITS } from "../types";

export const productSchema = z
  .object({
    name: v.text(2),
    sku: z.string().trim().optional(),
    barcode: z.string().trim().optional(),
    category: z.enum(PRODUCT_CATEGORIES, { message: msg("validation.required") }),
    brand: z.string().trim().optional(),
    unit: z.enum(PRODUCT_UNITS),
    price: v.money(),
    cost: v.money(),
    stock: v.positiveInt(),
    trackStock: z.boolean(),
  })
  .refine((d) => d.price >= d.cost, {
    path: ["price"],
    message: msg("validation.priceBelowCost"),
  });

export type ProductFormValues = z.infer<typeof productSchema>;
export type ProductFormInput = z.input<typeof productSchema>;
