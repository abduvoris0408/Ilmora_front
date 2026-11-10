import {
  AlertTriangleIcon,
  BoxesIcon,
  DownloadIcon,
  PackageIcon,
  PackageXIcon,
  PlusIcon,
  Trash2Icon,
  UploadIcon,
  WalletIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { DataTable } from "@/components/shared/data-table";
import { IconBox } from "@/components/shared/IconBox";
import { Money } from "@/components/shared/Money";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Can, useCan } from "@/lib/rbac";
import { confirm, overlay } from "@/lib/overlays";
import { formatCompact, formatNumber } from "@/utils/format";

import { useDeleteProducts, useProducts } from "../api/products.api";
import { ProductFormPanel } from "../components/ProductFormPanel";
import { productColumns } from "../components/product-columns";
import { PRODUCT_CATEGORIES, stockStatus, type Product } from "../types";

export function ProductsPage() {
  const { t } = useTranslation();
  const { data = [], isLoading } = useProducts();
  const remove = useDeleteProducts();

  const canCreate = useCan("products.create");
  const canEdit = useCan("products.edit");
  const canDelete = useCan("products.delete");
  const canSeeCost = useCan("products.view_cost");

  const openForm = (product?: Product) =>
    overlay.open(({ open, close }) => (
      <ProductFormPanel open={open} onClose={close} product={product} />
    ));

  const deleteProducts = (items: Product[], onDone?: () => void) =>
    confirm({
      destructive: true,
      title:
        items.length === 1
          ? t("products.deleteTitle")
          : t("products.bulkDeleteTitle", { count: items.length }),
      description:
        items.length === 1
          ? t("products.deleteDescription", { name: items[0]!.name })
          : t("products.bulkDeleteDescription"),
      onConfirm: () => remove.mutateAsync(items.map((p) => p.id)),
    }).then((ok) => {
      if (!ok) return;
      toast.success(t("products.deleted"));
      onDone?.();
    });

  const columns = useMemo(
    () =>
      productColumns({
        t,
        canEdit,
        canDelete,
        canSeeCost,
        selectable: canDelete,
        onEdit: openForm,
        onDelete: (p) => void deleteProducts([p]),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, canEdit, canDelete, canSeeCost]
  );

  const stats = useMemo(() => {
    const low = data.filter((p) => stockStatus(p) === "lowStock").length;
    const out = data.filter((p) => stockStatus(p) === "outOfStock").length;
    const value = data.reduce((sum, p) => sum + p.cost * p.stock, 0);
    return { total: data.length, low, out, value };
  }, [data]);

  return (
    <div className="space-y-4">
      <PageHeader
        title={t("products.title")}
        description={t("products.description")}
        actions={
          <>
            <Can permission="products.import">
              <Button variant="outline">
                <UploadIcon />
                {t("common.import")}
              </Button>
            </Can>
            <Can permission="products.export">
              <Button variant="outline" className="max-sm:hidden">
                <DownloadIcon />
                {t("common.export")}
              </Button>
            </Can>
            {canCreate && (
              <Button onClick={() => openForm()}>
                <PlusIcon />
                {t("products.add")}
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={BoxesIcon}
          label={t("products.stats.total")}
          value={formatNumber(stats.total)}
          loading={isLoading}
        />
        <StatCard
          icon={AlertTriangleIcon}
          tone="warning"
          label={t("products.stats.lowStock")}
          value={formatNumber(stats.low)}
          loading={isLoading}
        />
        <StatCard
          icon={PackageXIcon}
          tone="danger"
          label={t("products.stats.outOfStock")}
          value={formatNumber(stats.out)}
          loading={isLoading}
        />
        <Can permission="products.view_cost">
          <StatCard
            icon={WalletIcon}
            tone="success"
            label={t("products.stats.stockValue")}
            value={formatCompact(stats.value)}
            hint={t("common.currency")}
            loading={isLoading}
          />
        </Can>
      </div>

      <SectionCard contentClassName="pt-4">
        <DataTable
          persistKey="products"
          columns={columns}
          data={data}
          loading={isLoading}
          getRowId={(p) => p.id}
          initialState={{ columnVisibility: { barcode: false } }}
          onRowClick={canEdit ? openForm : undefined}
          filters={[
            {
              columnId: "category",
              title: t("products.fields.category"),
              options: PRODUCT_CATEGORIES.map((c) => ({
                value: c,
                label: t(`products.categories.${c}`),
              })),
            },
            {
              columnId: "status",
              title: t("common.status"),
              options: (["inStock", "lowStock", "outOfStock"] as const).map((s) => ({
                value: s,
                label: t(`status.${s}`),
              })),
            },
          ]}
          bulkActions={
            canDelete
              ? ({ rows, clear }) => (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-full"
                    onClick={() =>
                      void deleteProducts(
                        rows.map((r) => r.original),
                        clear
                      )
                    }
                  >
                    <Trash2Icon />
                    {t("common.delete")}
                  </Button>
                )
              : undefined
          }
          renderMobileCard={({ row }) => {
            const p = row.original;
            return (
              <div className="flex gap-3 pr-7">
                <IconBox icon={PackageIcon} size="md" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div>
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t(`products.categories.${p.category}`)} · {p.sku}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Money value={p.price} className="text-sm font-semibold" />
                    <StatusBadge status={stockStatus(p)} />
                  </div>
                </div>
              </div>
            );
          }}
        />
      </SectionCard>
    </div>
  );
}
