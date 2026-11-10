import { Link, useRouter } from "@tanstack/react-router";
import { ShieldXIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { StatusScreen } from "@/components/shared/StatusScreen";
import { Button } from "@/components/ui/button";

export function ForbiddenPage() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <StatusScreen
      icon={ShieldXIcon}
      tone="danger"
      code="403"
      title={t("errors.forbidden.title")}
      description={t("errors.forbidden.description")}
      actions={
        <>
          <Button variant="outline" onClick={() => router.history.back()}>
            {t("errors.goBack")}
          </Button>
          <Button asChild>
            <Link to="/">{t("errors.goHome")}</Link>
          </Button>
        </>
      }
    />
  );
}
