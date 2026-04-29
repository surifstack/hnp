import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useRouter } from "@tanstack/react-router";

/* ✅ NoActiveOrder */
export function NoActiveOrder() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SiteLayout>
      <div className="mx-auto max-w-xl bg-white rounded-xl p-6 shadow border text-center space-y-3">
        <h1 className="text-xl font-semibold">{t("order.noActiveOrder")}</h1>
        <Button
          onClick={() => router.navigate({ to: "/products" })}
        >
          {t("order.backToProduct")}
        </Button>
      </div>
    </SiteLayout>
  );
}