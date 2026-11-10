import {
  MapPinIcon,
  PlusIcon,
  StoreIcon,
  UserRoundIcon,
  UsersRoundIcon,
  WarehouseIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { IconBox } from "@/components/shared/IconBox";
import { Money } from "@/components/shared/Money";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Can } from "@/lib/rbac";
import { BRANCHES } from "@/mocks/branches";
import { useBranchStore } from "@/stores/branch.store";
import { cn } from "@/utils/cn";

export function BranchesPage() {
  const { t } = useTranslation();
  const currentId = useBranchStore((s) => s.branchId);

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("branches.title")}
        description={t("branches.description")}
        actions={
          <Can permission="branches.manage">
            <Button>
              <PlusIcon />
              {t("branches.add")}
            </Button>
          </Can>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {BRANCHES.map((b) => (
          <article
            key={b.id}
            className={cn(
              "flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5",
              b.id === currentId && "border-primary"
            )}
          >
            <header className="flex items-start gap-3">
              <IconBox
                icon={b.type === "warehouse" ? WarehouseIcon : StoreIcon}
                tone={b.type === "warehouse" ? "warning" : "primary"}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-sm font-semibold">{b.name}</h2>
                <Badge variant="muted" className="mt-1">
                  {t(`branches.types.${b.type}`)}
                </Badge>
              </div>
              <StatusBadge status={b.active ? "active" : "inactive"} />
            </header>
            <p className="flex gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="mt-0.5 size-4 shrink-0" />
              <span className="text-pretty">{b.address}</span>
            </p>
            <dl className="mt-auto grid grid-cols-3 gap-2 border-t pt-4 text-center">
              <div>
                <dt className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <UsersRoundIcon className="size-3" /> {t("branches.fields.employees")}
                </dt>
                <dd className="mt-1 text-sm font-semibold tabular-nums">{b.employees}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-muted-foreground">{t("branches.fields.revenue")}</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {b.monthlyRevenue ? <Money value={b.monthlyRevenue} /> : "—"}
                </dd>
              </div>
            </dl>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <UserRoundIcon className="size-3.5" />
              {t("branches.fields.manager")}:{" "}
              <span className="font-medium text-foreground">{b.manager}</span>
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
