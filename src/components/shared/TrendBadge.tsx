import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/utils/format";

/** O'zgarish foizi: 0.124 → "↗ +12,4%" (yashil), -0.05 → "↘ −5%" (qizil). `inverse` — kamayish yaxshi bo'lsa */
export function TrendBadge({ value, inverse = false }: { value: number; inverse?: boolean }) {
  const positive = inverse ? value < 0 : value >= 0;
  const Icon = value >= 0 ? TrendingUpIcon : TrendingDownIcon;
  return (
    <Badge variant={positive ? "success" : "danger"} className="tabular-nums">
      <Icon />
      {formatPercent(value, { signed: true })}
    </Badge>
  );
}
