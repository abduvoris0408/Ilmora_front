import { Link, useRouter } from "@tanstack/react-router";
import { MapPinOffIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { StatusScreen } from "@/components/shared/StatusScreen";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <StatusScreen
      icon={MapPinOffIcon}
      code="404"
      title={t("errors.notFound.title")}
      description={t("errors.notFound.description")}
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
