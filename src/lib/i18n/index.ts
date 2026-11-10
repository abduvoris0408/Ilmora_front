import i18n, { type ParseKeys } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { STORAGE_KEYS } from "@/config/app";

import { en } from "./locales/en";
import { ru } from "./locales/ru";
import { uz } from "./locales/uz";

export const LANGUAGES = [
  { code: "uz", label: "O'zbekcha", short: "UZ", dateLocale: "uz-Latn-UZ" },
  { code: "ru", label: "Русский", short: "RU", dateLocale: "ru-RU" },
  { code: "en", label: "English", short: "EN", dateLocale: "en-GB" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const resources = {
  uz: { translation: uz },
  ru: { translation: ru },
  en: { translation: en },
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "uz",
    supportedLngs: LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    interpolation: { escapeValue: false },
    returnNull: false,
    // Brauzer tiliga qaramaymiz: standart — o'zbekcha, foydalanuvchi tanlasa localStorage'da saqlanadi
    detection: {
      order: ["localStorage"],
      lookupLocalStorage: STORAGE_KEYS.language,
      caches: ["localStorage"],
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});
document.documentElement.lang = i18n.resolvedLanguage ?? "uz";

/** Type-safe tarjima kaliti: config'larda saqlash uchun (`titleKey: TKey`) */
export type TKey = ParseKeys;

export function currentLanguage(): LanguageCode {
  return (i18n.resolvedLanguage as LanguageCode | undefined) ?? "uz";
}

export default i18n;
