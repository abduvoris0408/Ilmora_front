import "i18next";

import type { Translation } from "@/lib/i18n/locales/uz";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: Translation;
    };
    returnNull: false;
  }
}
