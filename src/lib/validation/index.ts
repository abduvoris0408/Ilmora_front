import { z } from "zod";

import i18n, { type TKey } from "@/lib/i18n";

/**
 * VALIDATSIYA — zod schema'larida xabar o'rniga i18n KALITI yoziladi, tarjima render paytida
 * (FormField) bo'ladi. Shu sabab til almashganda xatolar ham darhol tarjima bo'ladi.
 *
 *   name: z.string().min(2, msg("validation.minLength", { min: 2 }))
 */
const SEP = "::";

export function msg(key: TKey, params?: Record<string, unknown>): string {
  return params ? `${key}${SEP}${JSON.stringify(params)}` : key;
}

export function translateError(message?: string): string | undefined {
  if (!message) return undefined;
  const [key, raw] = message.split(SEP);
  if (!key || !i18n.exists(key)) return message;
  const params = raw ? (JSON.parse(raw) as Record<string, unknown>) : undefined;
  return String(i18n.t(key as TKey, params as never));
}

/** Ko'p ishlatiladigan maydonlar */
export const v = {
  required: () => z.string().trim().min(1, msg("validation.required")),
  text: (min = 2) =>
    z
      .string()
      .trim()
      .min(1, msg("validation.required"))
      .min(min, msg("validation.minLength", { min })),
  phone: () =>
    z
      .string()
      .trim()
      .min(1, msg("validation.required"))
      .refine((s) => s.replace(/\D/g, "").length === 12, msg("validation.phone")),
  email: () => z.email(msg("validation.email")).or(z.literal("")),
  money: () =>
    z.coerce
      .number<string | number>({ message: msg("validation.required") })
      .min(0, msg("validation.positive")),
  positiveInt: () => z.coerce.number<string | number>().int().min(0, msg("validation.positive")),
};
