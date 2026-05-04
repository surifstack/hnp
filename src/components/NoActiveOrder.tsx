import { PackageSearch } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";

/* ✅ NoActiveOrder */
export function NoActiveOrder() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <SiteLayout>
      <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
        <section className="w-full rounded-3xl border bg-white p-8 shadow-2xl text-center">

          {/* ICON */}
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-4 border-[var(--neon-green)]/30 bg-[var(--neon-green)]/10">
            <PackageSearch className="h-10 w-10 text-black" />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-extrabold uppercase tracking-wide text-black">
            {t("order.noActiveOrder")}
          </h1>

          {/* SUBTITLE */}
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {t("order.noActiveOrderSubtitle", {
              defaultValue:
                "You don’t currently have an active order in progress.",
            })}
          </p>

          {/* BUTTON */}
          <Button
            size="lg"
            onClick={() => router.navigate({ to: "/products" })}
            className="mt-8 h-12 w-full rounded-xl bg-black text-white font-extrabold uppercase tracking-wide transition active:scale-[0.98]"
          >
            {t("order.backToProduct")}
          </Button>
        </section>
      </div>
    </SiteLayout>
  );
}