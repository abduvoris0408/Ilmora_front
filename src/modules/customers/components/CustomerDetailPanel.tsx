import { CakeIcon, MessageSquareTextIcon, PhoneIcon, ReceiptTextIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/shared/EmptyState";
import { InfoList } from "@/components/shared/InfoList";
import { Money } from "@/components/shared/Money";
import { SidePanel } from "@/components/shared/overlays/SidePanel";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatNumber, formatPhone, formatRelative } from "@/utils/format";

import { SEGMENT_TONES, type Customer } from "../types";

/** Mijoz kartochkasi — drawer ichida tablar bilan (Billz uslubi) */
export function CustomerDetailPanel({
  open,
  onClose,
  customer,
}: {
  open: boolean;
  onClose: () => void;
  customer: Customer;
}) {
  const { t } = useTranslation();
  const c = customer;
  const avg = c.visits ? c.totalSpent / c.visits : 0;

  return (
    <SidePanel
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={c.name}
      description={formatPhone(c.phone)}
      headerExtra={
        <Badge variant={SEGMENT_TONES[c.segment]}>{t(`customers.segments.${c.segment}`)}</Badge>
      }
      size="lg"
      flush
      footer={
        <>
          <Button variant="outline" asChild>
            <a href={`tel:+${c.phone}`}>
              <PhoneIcon />
              {t("common.phone")}
            </a>
          </Button>
          <Button>
            <MessageSquareTextIcon />
            SMS
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-4 px-4 pt-5 sm:px-6">
        <UserAvatar name={c.name} size="lg" className="size-14 text-base" />
        <div className="grid flex-1 grid-cols-3 gap-2 text-center">
          {[
            {
              label: t("customers.fields.totalSpent"),
              value: <Money value={c.totalSpent} hideCurrency />,
            },
            { label: t("customers.fields.visits"), value: formatNumber(c.visits) },
            {
              label: t("customers.fields.cashback"),
              value: <Money value={c.cashback} hideCurrency />,
            },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-muted/60 px-2 py-2.5">
              <p className="truncate text-sm font-semibold tabular-nums">{s.value}</p>
              <p className="truncate text-[0.6875rem] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="px-4 pt-5 pb-6 sm:px-6">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="overview">{t("customers.tabs.overview")}</TabsTrigger>
          <TabsTrigger value="purchases">{t("customers.tabs.purchases")}</TabsTrigger>
          <TabsTrigger value="notes">{t("customers.tabs.notes")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <InfoList
            columns={2}
            items={[
              { label: t("customers.fields.phone"), value: formatPhone(c.phone) },
              { label: t("customers.fields.gender"), value: t(`customers.genders.${c.gender}`) },
              {
                label: t("customers.fields.birthday"),
                value: (
                  <span className="inline-flex items-center gap-1.5">
                    <CakeIcon className="size-3.5 text-muted-foreground" />
                    {formatDate(c.birthday)}
                  </span>
                ),
              },
              { label: t("customers.fields.avgCheck"), value: <Money value={avg} /> },
              { label: t("customers.fields.lastVisit"), value: formatRelative(c.lastVisit) },
              { label: t("customers.fields.createdAt"), value: formatDate(c.createdAt) },
              {
                label: t("customers.fields.debt"),
                value: c.debt ? <Money value={c.debt} className="text-destructive" /> : "—",
                wide: true,
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="purchases" className="pt-4">
          <EmptyState
            icon={ReceiptTextIcon}
            title={t("common.comingSoon")}
            description={t("common.comingSoonDescription")}
          />
        </TabsContent>

        <TabsContent value="notes" className="pt-4">
          {c.note ? (
            <p className="rounded-lg border bg-muted/40 p-4 text-sm">{c.note}</p>
          ) : (
            <EmptyState icon={MessageSquareTextIcon} title={t("customers.noNotes")} />
          )}
        </TabsContent>
      </Tabs>
    </SidePanel>
  );
}
