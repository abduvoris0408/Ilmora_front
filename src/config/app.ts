export const APP = {
  name: "Ilmora",
  description: "Savdo va biznesni boshqarish tizimi",
  version: "0.1.0",
  supportPhone: "+998 71 200 00 00",
  currency: "UZS",
} as const;

/** localStorage kalitlari — bitta joyda (index.html'dagi inline skript ham shularni o'qiydi) */
export const STORAGE_KEYS = {
  preferences: "ilmora.preferences",
  navigation: "ilmora.navigation",
  auth: "ilmora.auth",
  roles: "ilmora.roles",
  branch: "ilmora.branch",
  language: "ilmora.lang",
  tables: "ilmora.tables",
} as const;
