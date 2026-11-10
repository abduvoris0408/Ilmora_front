import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";

/**
 * Holat chipi — status kalitidan rang va matn avtomatik. Yangi holat: shu xaritaga + i18n `status.*`.
 */
const STATUS_TONES = {
  active: "success",
  inactive: "muted",
  draft: "muted",
  completed: "success",
  pending: "warning",
  cancelled: "danger",
  refunded: "info",
  paid: "success",
  partial: "warning",
  overdue: "danger",
  inStock: "success",
  lowStock: "warning",
  outOfStock: "danger",
  archived: "muted",
  online: "success",
  offline: "muted",
} as const;

export type StatusKey = keyof typeof STATUS_TONES;

export function StatusBadge({ status, dot = true }: { status: StatusKey; dot?: boolean }) {
  const { t } = useTranslation();
  return (
    <Badge variant={STATUS_TONES[status]}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {t(`status.${status}`)}
    </Badge>
  );
}
