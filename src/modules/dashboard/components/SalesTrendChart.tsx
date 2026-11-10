import { TrendingUpIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { SectionCard } from "@/components/shared/SectionCard";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useCan } from "@/lib/rbac";
import { formatCompact, formatDayMonth, formatMoney } from "@/utils/format";

import { SALES_TREND } from "../mocks/dashboard.mock";

export function SalesTrendChart() {
  const { t } = useTranslation();
  const canSeeProfit = useCan("reports.view_profit");

  const config = {
    revenue: { label: t("dashboard.revenue"), color: "var(--chart-1)" },
    profit: { label: t("dashboard.profit"), color: "var(--chart-3)" },
  } satisfies ChartConfig;

  return (
    <SectionCard
      icon={TrendingUpIcon}
      title={t("dashboard.salesChart")}
      description={t("dashboard.salesChartDescription")}
    >
      <ChartContainer config={config} className="aspect-auto h-64 w-full sm:h-72">
        <AreaChart data={SALES_TREND} margin={{ left: 0, right: 8, top: 8 }}>
          <defs>
            {(["revenue", "profit"] as const).map((k) => (
              <linearGradient key={k} id={`fill-${k}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`var(--color-${k})`} stopOpacity={0.25} />
                <stop offset="95%" stopColor={`var(--color-${k})`} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            tickFormatter={(v: string) => formatDayMonth(v)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={44}
            tickFormatter={(v: number) => formatCompact(v)}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) =>
                  formatDayMonth(payload?.[0]?.payload?.date ?? Date.now())
                }
                formatter={(value, name) => (
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      {config[name as keyof typeof config]?.label}
                    </span>
                    <span className="font-medium tabular-nums">{formatMoney(Number(value))}</span>
                  </div>
                )}
              />
            }
          />
          <Area
            dataKey="revenue"
            type="monotone"
            stroke="var(--color-revenue)"
            fill="url(#fill-revenue)"
            strokeWidth={2}
          />
          {canSeeProfit && (
            <Area
              dataKey="profit"
              type="monotone"
              stroke="var(--color-profit)"
              fill="url(#fill-profit)"
              strokeWidth={2}
            />
          )}
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </SectionCard>
  );
}
