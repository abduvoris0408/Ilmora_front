/**
 * Commit oldidan faqat o'zgargan fayllar tekshiriladi.
 * Windows'da buyruq qatori uzunligi cheklangan — fayllar ko'p bo'lsa butun loyiha bo'yicha ishlaydi.
 */
const MAX_FILES = 40;
const quote = (files) => files.map((f) => `"${f}"`).join(" ");

export default {
  "*.{ts,tsx}": (files) =>
    files.length > MAX_FILES
      ? ["eslint . --fix --max-warnings=0", "prettier --write ."]
      : [`eslint --fix --max-warnings=0 ${quote(files)}`, `prettier --write ${quote(files)}`],
  "*.{js,mjs,json,css,html,yml,yaml}": (files) =>
    files.length > MAX_FILES ? ["prettier --write ."] : [`prettier --write ${quote(files)}`],
};
