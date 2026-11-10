import { Link } from "@tanstack/react-router";
import {
  BanknoteIcon,
  PackageXIcon,
  ReceiptTextIcon,
  ShoppingBagIcon,
  TrophyIcon,
  UsersRoundIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Money } from "@/components/shared/Money";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatCard } from "@/components/shared/StatCard";
import { TrendBadge } from "@/components/shared/TrendBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Can } from "@/lib/rbac";
import { formatCompact, formatNumber, formatTime } from "@/utils/format";

import { DashboardHero } from "../components/DashboardHero";
import { PaymentMethodsChart } from "../components/PaymentMethodsChart";
import { SalesTrendChart } from "../components/SalesTrendChart";
import {
  LOW_STOCK,
  RECENT_SALES,
  statsFor,
  TOP_PRODUCTS,
  type Period,
} from "../mocks/dashboard.mock";

const PERIODS: Period[] = ["today", "week", "month", "year"];

export function DashboardPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>("today");
  const s = statsFor(period);
  const maxSold = Math.max(...TOP_PRODUCTS.map((p) => p.sold));

  return (
    <div className="space-y-4">
      <DashboardHero />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <h2 className="text-base font-semibold">{t("dashboard.subtitle")}</h2>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList>
            {PERIODS.map((p) => (
              <TabsTrigger key={p} value={p}>
                {t(`dashboard.period.${p}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          icon={BanknoteIcon}
          label={t("dashboard.stats.revenue")}
          value={formatCompact(s.revenue)}
          badge={<TrendBadge value={s.revenueTrend} />}
          hint={t("dashboard.vsLastPeriod")}
        />
        <StatCard
          icon={ReceiptTextIcon}
          tone="success"
          label={t("dashboard.stats.orders")}
          value={formatNumber(s.orders)}
          badge={<TrendBadge value={s.ordersTrend} />}
          hint={t("dashboard.vsLastPeriod")}
        />
        <StatCard
          icon={ShoppingBagIcon}
          tone="warning"
          label={t("dashboard.stats.avgCheck")}
          value={formatNumber(Math.round(s.avgCheck))}
          badge={<TrendBadge value={s.avgCheckTrend} />}
          hint={t("common.currency")}
        />
        <StatCard
          icon={UsersRoundIcon}
          tone="info"
          label={t("dashboard.stats.customers")}
          value={formatNumber(s.customers)}
          badge={<TrendBadge value={s.customersTrend} />}
          hint={t("dashboard.vsLastPeriod")}
        />
      </div>

      {/* grid-cols-1 (minmax(0,1fr)) — mobilda keng jadval ustunni ekrandan chiqarib yubormasin */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="grid min-w-0 grid-cols-1 content-start gap-4 xl:col-span-8">
          <SalesTrendChart />

          <Can permission="sales.view">
            <SectionCard
              icon={ReceiptTextIcon}
              title={t("dashboard.recentSales")}
              actions={
                <Button asChild variant="ghost" size="sm">
                  <Link to="/sales">{t("common.viewAll")}</Link>
                </Button>
              }
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("sales.fields.number")}</TableHead>
                    <TableHead>{t("sales.fields.customer")}</TableHead>
                    <TableHead className="max-md:hidden">{t("sales.fields.payment")}</TableHead>
                    <TableHead className="text-right">{t("sales.fields.amount")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_SALES.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        <p className="font-medium tabular-nums">#{sale.number}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {formatTime(sale.at)}
                        </p>
                      </TableCell>
                      <TableCell>
                        {sale.customer ? (
                          <span className="flex items-center gap-2">
                            <UserAvatar name={sale.customer} size="sm" />
                            <span className="truncate">{sale.customer}</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">{t("sales.walkIn")}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-md:hidden">
                        {t(`payment.${sale.payment}`)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Money value={sale.amount} className="font-medium" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SectionCard>
          </Can>
        </div>

        <div className="grid min-w-0 grid-cols-1 content-start gap-4 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1">
          <PaymentMethodsChart />

          <SectionCard icon={TrophyIcon} iconTone="warning" title={t("dashboard.topProducts")}>
            <ol className="space-y-4">
              {TOP_PRODUCTS.map((p, i) => (
                <li key={p.name} className="space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-4 text-xs font-semibold text-muted-foreground tabular-nums">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium">{p.name}</span>
                    <Money
                      value={p.revenue}
                      hideCurrency
                      className="text-xs text-muted-foreground"
                    />
                  </div>
                  <div className="flex items-center gap-2 pl-6">
                    <Progress value={(p.sold / maxSold) * 100} className="h-1.5" />
                    <span className="w-16 text-right text-xs text-muted-foreground tabular-nums">
                      {formatNumber(p.sold)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>

          <Can permission="inventory.view">
            <SectionCard
              icon={PackageXIcon}
              iconTone="danger"
              title={t("dashboard.lowStock")}
              className="sm:col-span-2 xl:col-span-1"
              contentClassName="px-0 sm:px-0 pb-2 sm:pb-2"
            >
              <ul className="divide-y border-t">
                {LOW_STOCK.map((p) => (
                  <li key={p.name} className="flex items-center gap-3 px-4 py-2.5 sm:px-5">
                    <span className="min-w-0 flex-1 truncate text-sm">{p.name}</span>
                    <span className="text-xs font-medium text-destructive tabular-nums">
                      {t("dashboard.left", { count: p.left })}
                    </span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </Can>
        </div>
      </div>
    </div>
  );
}
