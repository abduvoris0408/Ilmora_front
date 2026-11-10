import { useTranslation } from "react-i18next";

import { cn } from "@/utils/cn";
import { formatNumber } from "@/utils/format";

/**
 * Pul summasi: raqam + kichikroq valyuta. Har doim tabular-nums.
 * `signed` — "+1 200" / "−300" (yashil/qizil).
 */
export function Money({
  value,
  signed = false,
  hideCurrency = false,
  className,
}: {
  value: number;
  signed?: boolean;
  hideCurrency?: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const sign = signed ? (value > 0 ? "+" : value < 0 ? "−" : "") : value < 0 ? "−" : "";
  return (
    <span
      className={cn(
        "whitespace-nowrap tabular-nums",
        signed && value > 0 && "text-success",
        signed && value < 0 && "text-destructive",
        className
      )}
    >
      {sign}
      {formatNumber(Math.abs(Math.round(value)))}
      {!hideCurrency && (
        <span className="ml-1 text-[0.85em] font-normal text-muted-foreground">
          {t("common.currency")}
        </span>
      )}
    </span>
  );
}
