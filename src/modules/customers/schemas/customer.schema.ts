import { z } from "zod";

import { v } from "@/lib/validation";

export const customerSchema = z.object({
  name: v.text(3),
  phone: v.phone(),
  gender: z.enum(["male", "female"]),
  note: z.string().trim().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
