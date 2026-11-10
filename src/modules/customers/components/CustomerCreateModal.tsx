import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { FormInput, FormSelect, FormTextarea } from "@/components/shared/form";
import { ResponsiveModal } from "@/components/shared/overlays/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useCreateCustomer } from "../api/customers.api";
import { customerSchema, type CustomerFormValues } from "../schemas/customer.schema";

const FORM_ID = "customer-create";

/** Qisqa forma — markazdagi modal (telefonda pastdan chiquvchi panel) */
export function CustomerCreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const create = useCreateCustomer();
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", phone: "998", gender: "male", note: "" },
  });

  async function onSubmit(values: CustomerFormValues) {
    await create.mutateAsync(values);
    toast.success(t("customers.created"), { description: values.name });
    onClose();
  }

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={t("customers.createTitle")}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={create.isPending}>
            {create.isPending && <Spinner />}
            {t("common.save")}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4" noValidate>
        <FormInput
          control={form.control}
          name="name"
          label={t("customers.fields.name")}
          autoFocus
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            control={form.control}
            name="phone"
            type="tel"
            inputMode="tel"
            label={t("customers.fields.phone")}
            placeholder="998901234567"
          />
          <FormSelect
            control={form.control}
            name="gender"
            label={t("customers.fields.gender")}
            options={(["male", "female"] as const).map((g) => ({
              value: g,
              label: t(`customers.genders.${g}`),
            }))}
          />
        </div>
        <FormTextarea control={form.control} name="note" label={t("common.note")} optional />
      </form>
    </ResponsiveModal>
  );
}
