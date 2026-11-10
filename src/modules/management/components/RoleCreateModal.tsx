import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { FormInput, FormTextarea } from "@/components/shared/form";
import { ResponsiveModal } from "@/components/shared/overlays/ResponsiveModal";
import { Button } from "@/components/ui/button";
import { v } from "@/lib/validation";
import { useRolesStore } from "@/stores/roles.store";

const schema = z.object({ name: v.text(2), description: z.string().trim().optional() });
type Values = z.infer<typeof schema>;

export function RoleCreateModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const { t } = useTranslation();
  const upsert = useRolesStore((s) => s.upsertRole);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = (values: Values) => {
    const id = `role-${crypto.randomUUID().slice(0, 8)}`;
    upsert({
      id,
      name: values.name,
      description: values.description,
      tone: "muted",
      permissions: ["dashboard.view"],
    });
    toast.success(t("rolesPage.created"), { description: values.name });
    onCreated(id);
    onClose();
  };

  return (
    <ResponsiveModal
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title={t("rolesPage.newRole")}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" form="role-create">
            {t("common.create")}
          </Button>
        </>
      }
    >
      <form
        id="role-create"
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4"
        noValidate
      >
        <FormInput
          control={form.control}
          name="name"
          label={t("rolesPage.roleName")}
          placeholder={t("rolesPage.roleNamePlaceholder")}
          autoFocus
        />
        <FormTextarea
          control={form.control}
          name="description"
          label={t("rolesPage.roleDescription")}
          optional
          rows={2}
        />
      </form>
    </ResponsiveModal>
  );
}
