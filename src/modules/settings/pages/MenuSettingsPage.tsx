import { useTranslation } from "react-i18next";

import { PageHeader } from "@/components/shared/PageHeader";
import { MenuEditor } from "@/layout/customizer/MenuEditor";

export function MenuSettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <PageHeader title={t("menuEditor.title")} description={t("menuEditor.description")} />
      <MenuEditor />
    </div>
  );
}
