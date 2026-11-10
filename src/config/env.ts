import { z } from "zod";

/** Muhit o'zgaruvchilari — ilova ishga tushganda tekshiriladi (noto'g'ri bo'lsa darhol xato). */
const envSchema = z.object({
  VITE_API_URL: z.string().default("http://localhost:8000/api"),
  VITE_USE_MOCKS: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
  VITE_ENABLE_ROLE_SWITCHER: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
});

export const env = {
  ...envSchema.parse(import.meta.env),
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
};
