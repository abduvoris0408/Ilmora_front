import { CreditCardIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Cell, Pie, PieChart } from "recharts";

import { SectionCard } from "@/components/shared/SectionCard";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { PAYMENT_METHODS } from "../mocks/dashboard.mock";

export function PaymentMethodsChart() {
  const { t } = useTranslation();

  const config = Object.fromEntries(
    PAYMENT_METHODS.map((m) => [m.method, { label: t(`payment.${m.method}`), color: m.color }])
  ) satisfies ChartConfig;

  return (
    <SectionCard icon={CreditCardIcon} title={t("dashboard.paymentMethods")}>
      <div className="flex items-center gap-4">
        <ChartContainer config={config} className="aspect-square h-36 shrink-0">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="method" />}
            />
            <Pie
              data={[...PAYMENT_METHODS]}
              dataKey="value"
              nameKey="method"
              innerRadius="62%"
              strokeWidth={2}
              stroke="var(--card)"
            >
              {PAYMENT_METHODS.map((m) => (
                <Cell key={m.method} fill={m.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <ul className="min-w-0 flex-1 space-y-2">
          {PAYMENT_METHODS.map((m) => (
            <li key={m.method} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden
                className="size-2.5 shrink-0 rounded-sm"
                style={{ background: m.color }}
              />
              <span className="min-w-0 flex-1 truncate text-muted-foreground">
                {t(`payment.${m.method}`)}
              </span>
              <span className="font-medium tabular-nums">{m.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}
