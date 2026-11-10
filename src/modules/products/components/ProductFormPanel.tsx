import { zodResolver } from "@hookform/resolvers/zod";
import { BarcodeIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  FormInput,
  FormMoneyInput,
  FormSection,
  FormSelect,
  FormSwitch,
} from "@/components/shared/form";
import { SidePanel } from "@/components/shared/overlays/SidePanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useCan } from "@/lib/rbac/use-permission";
import { formatPercent } from "@/utils/format";

import { useSaveProduct } from "../api/products.api";
import {
  productSchema,
  type ProductFormInput,
  type ProductFormValues,
} from "../schemas/product.schema";
import { PRODUCT_CATEGORIES, PRODUCT_UNITS, type Product } from "../types";

const FORM_ID = "product-form";

/**
 * Mahsulot yaratish/tahrirlash — o'ng panel (mobilda pastdan). `overlay.open()` orqali ochiladi:
 *   overlay.open(({ open, close }) => <ProductFormPanel open={open} onClose={close} product={p} />)
 */
export function ProductFormPanel({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product?: Product;
}) {
  const { t } = useTranslation();
  const save = useSaveProduct();
  const canSeeCost = useCan("products.view_cost");

  const form = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
          category: product.category,
          brand: product.brand,
          unit: product.unit,
          price: product.price,
          cost: product.cost,
          stock: product.stock,
          trackStock: product.trackStock,
        }
      : {
          name: "",
          sku: "",
          barcode: "",
          brand: "",
          unit: "pcs",
          price: "",
          cost: "",
          stock: 0,
          trackStock: true,
        },
  });

  const [price, cost] = useWatch({ control: form.control, name: ["price", "cost"] });
  const margin = Number(cost) > 0 ? (Number(price) - Number(cost)) / Number(cost) : null;

  async function onSubmit(values: ProductFormValues) {
    await save.mutateAsync({ id: product?.id, values });
    toast.success(product ? t("products.updated") : t("products.created"), {
      description: values.name,
    });
    onClose();
  }

  return (
    <SidePanel
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={product ? t("products.editTitle") : t("products.createTitle")}
      description={product ? product.sku : t("products.createDescription")}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={save.isPending}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={save.isPending}>
            {save.isPending && <Spinner />}
            {t("common.save")}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <FormSection title={t("products.sections.main")} columns={2}>
          <FormInput
            control={form.control}
            name="name"
            label={t("products.fields.name")}
            placeholder={t("products.placeholders.name")}
            className="sm:col-span-2"
            autoFocus
          />
          <FormSelect
            control={form.control}
            name="category"
            label={t("products.fields.category")}
            placeholder={t("products.placeholders.selectCategory")}
            options={PRODUCT_CATEGORIES.map((c) => ({
              value: c,
              label: t(`products.categories.${c}`),
            }))}
          />
          <FormInput
            control={form.control}
            name="brand"
            label={t("products.fields.brand")}
            optional
          />
          <FormInput
            control={form.control}
            name="sku"
            label={t("products.fields.sku")}
            placeholder={t("products.placeholders.sku")}
            optional
          />
          <FormInput
            control={form.control}
            name="barcode"
            label={t("products.fields.barcode")}
            placeholder={t("products.placeholders.barcode")}
            addon={<BarcodeIcon />}
            inputMode="numeric"
            optional
          />
        </FormSection>

        <Separator />

        <FormSection title={t("products.sections.pricing")} columns={2}>
          <FormMoneyInput
            control={form.control}
            name="price"
            label={t("products.fields.price")}
            currency={t("common.currency")}
          />
          {canSeeCost && (
            <FormMoneyInput
              control={form.control}
              name="cost"
              label={t("products.fields.cost")}
              currency={t("common.currency")}
              description={
                margin !== null && (
                  <span className="inline-flex items-center gap-1.5">
                    {t("products.fields.margin")}:
                    <Badge variant={margin >= 0 ? "success" : "danger"} className="tabular-nums">
                      {formatPercent(margin, { signed: true })}
                    </Badge>
                  </span>
                )
              }
            />
          )}
        </FormSection>

        <Separator />

        <FormSection title={t("products.sections.inventory")} columns={2}>
          <FormSelect
            control={form.control}
            name="unit"
            label={t("products.fields.unit")}
            options={PRODUCT_UNITS.map((u) => ({ value: u, label: t(`products.units.${u}`) }))}
          />
          <FormInput
            control={form.control}
            name="stock"
            type="number"
            inputMode="numeric"
            label={t("products.fields.stock")}
          />
          <FormSwitch
            control={form.control}
            name="trackStock"
            label={t("products.fields.trackStock")}
            description={t("products.fields.trackStockHint")}
            className="sm:col-span-2"
          />
        </FormSection>
      </form>
    </SidePanel>
  );
}
