import i18n, { LANGUAGES, currentLanguage } from "@/lib/i18n";

/**
 * FORMATLASH — raqam, pul, sana. Har doim joriy tilga mos.
 * UI'da xom `toLocaleString` ishlatmang — shu funksiyalardan foydalaning.
 */

const locale = () =>
  LANGUAGES.find((l) => l.code === currentLanguage())?.dateLocale ?? "uz-Latn-UZ";

/** 1250000 → "1 250 000" (bo'shliq — ingichka, qatorda uzilmaydi) */
export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

/** 1250000 → "1 250 000 so'm" */
export function formatMoney(value: number, { withCurrency = true } = {}): string {
  const n = formatNumber(Math.round(value));
  return withCurrency ? `${n} ${i18n.t("common.currency")}` : n;
}

/** 1250000 → "1,25 mln" — kartochka va grafiklarda */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat(locale(), { notation: "compact", maximumFractionDigits: 1 }).format(
    value
  );
}

/** 0.124 → "+12,4%" */
export function formatPercent(value: number, { signed = false } = {}): string {
  const s = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(
    Math.abs(value) * 100
  );
  const sign = signed ? (value > 0 ? "+" : value < 0 ? "−" : "") : value < 0 ? "−" : "";
  return `${sign}${s}%`;
}

type DateInput = Date | string | number;

/** "12.03.2026" */
export function formatDate(value: DateInput): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

/** "12.03.2026, 14:05" */
export function formatDateTime(value: DateInput): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

/** "14:05" */
export function formatTime(value: DateInput): string {
  return new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" }).format(
    new Date(value)
  );
}

/** "12 mart" — grafik o'qlari uchun */
export function formatDayMonth(value: DateInput): string {
  return new Intl.DateTimeFormat(locale(), { day: "numeric", month: "short" }).format(
    new Date(value)
  );
}

/** "5 daqiqa oldin" */
export function formatRelative(value: DateInput): string {
  const diff = (new Date(value).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(Math.round(diff), "second");
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), "day");
  if (abs < 86400 * 365) return rtf.format(Math.round(diff / (86400 * 30)), "month");
  return rtf.format(Math.round(diff / (86400 * 365)), "year");
}

/** "998901234567" → "+998 90 123 45 67" */
export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  if (d.length !== 12) return raw;
  return `+${d.slice(0, 3)} ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}`;
}

/** "Abduvoris Mo'minov" → "AM" */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}
