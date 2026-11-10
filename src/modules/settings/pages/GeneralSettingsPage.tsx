import { zodResolver } from "@hookform/resolvers/zod";
import { Building2Icon, GlobeIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { FormInput, FormSelect } from "@/components/shared/form";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { LanguageSwitcher } from "@/layout/header/LanguageSwitcher";
import { useCan } from "@/lib/rbac";
import { delay } from "@/lib/mock/random";
import { v } from "@/lib/validation";

const schema = z.object({
  companyName: v.text(2),
  inn: z
    .string()
    .trim()
    .regex(/^\d{9}$/, "validation.required"),
  phone: v.phone(),
  address: z.string().trim().optional(),
  currency: z.enum(["UZS", "USD"]),
  timezone: z.string(),
});
type Values = z.infer<typeof schema>;

export function GeneralSettingsPage() {
  const { t } = useTranslation();
  const canManage = useCan("settings.manage");
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "Ilmora Market MChJ",
      inn: "305123456",
      phone: "998712000000",
      address: "Toshkent sh., Yunusobod tumani",
      currency: "UZS",
      timezone: "Asia/Tashkent",
    },
  });

  const onSubmit = async () => {
    await delay(null, 500);
    toast.success(t("common.savedSuccessfully"));
    form.reset(form.getValues());
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <PageHeader
        title={t("settingsPage.general.title")}
        description={t("settingsPage.general.description")}
        actions={
          canManage && (
            <Button type="submit" disabled={!form.formState.isDirty || form.formState.isSubmitting}>
              {t("common.save")}
            </Button>
          )
        }
      />
      <fieldset disabled={!canManage} className="grid max-w-4xl grid-cols-1 gap-4">
        <SectionCard icon={Building2Icon} title={t("settingsPage.general.company")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              control={form.control}
              name="companyName"
              label={t("settingsPage.general.companyName")}
              className="sm:col-span-2"
            />
            <FormInput
              control={form.control}
              name="inn"
              label={t("settingsPage.general.inn")}
              inputMode="numeric"
            />
            <FormInput control={form.control} name="phone" type="tel" label={t("common.phone")} />
            <FormInput
              control={form.control}
              name="address"
              label={t("common.address")}
              className="sm:col-span-2"
              optional
            />
          </div>
        </SectionCard>
        <SectionCard icon={GlobeIcon} title={t("settingsPage.general.regional")}>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormSelect
              control={form.control}
              name="currency"
              label={t("settingsPage.general.currency")}
              options={[
                { value: "UZS", label: "UZS — so'm" },
                { value: "USD", label: "USD — $" },
              ]}
            />
            <FormSelect
              control={form.control}
              name="timezone"
              label={t("settingsPage.general.timezone")}
              options={[{ value: "Asia/Tashkent", label: "(UTC+05:00) Toshkent" }]}
            />
            <Field className="gap-2">
              <FieldLabel>{t("settingsPage.general.language")}</FieldLabel>
              <LanguageSwitcher variant="label" className="justify-start" />
            </Field>
          </div>
        </SectionCard>
      </fieldset>
    </form>
  );
}
