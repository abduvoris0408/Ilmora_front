import { PrinterIcon, Undo2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { InfoList } from "@/components/shared/InfoList";
import { Money } from "@/components/shared/Money";
import { SidePanel } from "@/components/shared/overlays/SidePanel";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { confirm } from "@/lib/overlays";
import { useCan } from "@/lib/rbac";
import { BRANCHES } from "@/mocks/branches";
import { formatDateTime, formatMoney, formatNumber } from "@/utils/format";

import { useRefundSale } from "../api/sales.api";
import type { Sale } from "../types";

export function SaleDetailPanel({
  open,
  onClose,
  sale,
}: {
  open: boolean;
  onClose: () => void;
  sale: Sale;
}) {
  const { t } = useTranslation();
  const refund = useRefundSale();
  const canRefund = useCan("sales.refund") && sale.status === "completed";
  const subtotal = sale.items.reduce((s, it) => s + it.price * it.qty, 0);

  const handleRefund = async () => {
    const ok = await confirm({
      destructive: true,
      title: t("sales.refundConfirmTitle"),
      description: t("sales.refundConfirmDescription", {
        number: sale.number,
        amount: formatMoney(sale.total),
      }),
      confirmText: t("sales.refund"),
      onConfirm: () => refund.mutateAsync(sale.id),
    });
    if (ok) {
      toast.success(t("sales.refunded"));
      onClose();
    }
  };

  return (
    <SidePanel
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={t("sales.detailTitle", { number: sale.number })}
      description={formatDateTime(sale.createdAt)}
      headerExtra={<StatusBadge status={sale.status} />}
      footer={
        <>
          <Button variant="outline">
            <PrinterIcon />
            {t("sales.printReceipt")}
          </Button>
          {canRefund && (
            <Button variant="destructive" onClick={handleRefund}>
              <Undo2Icon />
              {t("sales.refund")}
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-5">
        <InfoList
          columns={2}
          items={[
            { label: t("sales.fields.customer"), value: sale.customer ?? t("sales.walkIn") },
            { label: t("sales.fields.cashier"), value: sale.cashier },
            {
              label: t("common.branch"),
              value: BRANCHES.find((b) => b.id === sale.branchId)?.name,
            },
            { label: t("sales.fields.payment"), value: t(`payment.${sale.payment}`) },
          ]}
        />

        {/* Chek ko'rinishi */}
        <div className="rounded-xl border border-dashed bg-muted/30 p-4">
          <ul className="space-y-3">
            {sale.items.map((it, i) => (
              <li key={i} className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{it.name}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {formatNumber(it.qty)} × {formatNumber(it.price)}
                  </p>
                </div>
                <Money value={it.price * it.qty} hideCurrency className="font-medium" />
              </li>
            ))}
          </ul>
          <Separator className="my-4" />
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>{t("sales.subtotal")}</dt>
              <dd>
                <Money value={subtotal} hideCurrency />
              </dd>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <dt>{t("sales.fields.discount")}</dt>
                <dd>
                  <Money value={-sale.discount} hideCurrency className="text-destructive" />
                </dd>
              </div>
            )}
            <div className="flex justify-between pt-1 text-base font-semibold">
              <dt>{t("common.total")}</dt>
              <dd>
                <Money value={sale.total} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </SidePanel>
  );
}
