import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {COLORS} from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import type {  Product } from "@/lib/api.types";
import { skuForSelection } from "@/lib/sku";

const QUANTITIES = Array.from({ length: 20 }, (_, i) => (i + 1) * 20);



export function OrderSetupPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const loadProduct = useOrderFlowStore((s) => s.loadProduct);
  const startOrder = useOrderFlowStore((s) => s.startOrder);
  const updateSetup = useOrderFlowStore((s) => s.updateSetup);
  const setSetupDraft = useOrderFlowStore((s) => s.setSetupDraft);

  const order = useOrderFlowStore((s) => s.order);
  const product = useOrderFlowStore((s) => s.product);
  const languages = useOrderFlowStore((s) => s.languages);
  const setupDraft = useOrderFlowStore((s) => s.setupDraft);
  const loading = useOrderFlowStore((s) => s.loading);

  useEffect(() => {
    void loadProduct(slug);
  }, [loadProduct, slug]);

  useEffect(() => {
    if (!order || order.productSlug !== slug) {
      void startOrder(slug  as Product["slug"]);
    }
  }, [order, slug, startOrder]);

  const safeSetup = setupDraft ?? {
    quantity: 20,
    colorPms: "802",
    languageCode: "en",
  };

  const selectedSku =
    safeSetup && product
      ? skuForSelection(product, safeSetup.colorPms)
      : "";

  if (loading) return <Skeleton />;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl p-6 shadow-md border">
          <h1 className="text-2xl font-bold mb-2">
            {t("order.setupTitle", {
              name: product?.name ?? "Order",
            })}
          </h1>

          <p className="text-sm text-gray-500">
            {t("order.configureOrder")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT PANEL */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-5">

            {/* QUANTITY */}
            <div className="space-y-2">
              <Label>{t("order.quantity")}</Label>
              <Select
                value={String(safeSetup.quantity)}
                onValueChange={(v) =>
                  setSetupDraft({
                    ...safeSetup,
                    quantity: Number(v),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {QUANTITIES.map((q) => (
                    <SelectItem key={q} value={String(q)}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* LANGUAGE */}
            <div className="space-y-2">
              <Label>{t("order.language")}</Label>
              <Select
                value={safeSetup.languageCode}
                onValueChange={(v) =>
                  setSetupDraft({
                    ...safeSetup,
                    languageCode: v,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.code} value={l.code}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-5">

            <div className="flex justify-between items-center">
              <Label>{t("order.color")}</Label>

              {selectedSku && (
                <span className="text-xs text-gray-500">
                  {t("order.sku")}:{" "}
                  <span className="font-mono text-black">
                    {selectedSku}
                  </span>
                </span>
              )}
            </div>

            {/* COLORS */}
            <div className="grid grid-cols-3 gap-3">
              {COLORS.map((c) => {
                const selected = safeSetup.colorPms === c.pms;

                return (
                  <button
                    key={c.pms}
                    onClick={() =>
                      setSetupDraft({
                        ...safeSetup,
                        colorPms: c.pms,
                      })
                    }
                    className={`p-4 rounded-xl border transition transform hover:-translate-y-1 hover:shadow-md ${
                      selected
                        ? "border-black ring-2 ring-black"
                        : "border-gray-200"
                    }`}
                  >
                    <div
                      className="h-12 w-12 mx-auto rounded-md border"
                      style={{ backgroundColor: c.swatch }}
                    />
                    <div className="text-xs mt-2 font-semibold text-center">
                      {c.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CONTINUE */}
            <Button
              size="lg"
              className="w-full font-bold uppercase hover:scale-[1.02] transition"
              onClick={async () => {
                await updateSetup(safeSetup);
                router.navigate({
                  to: "/products/$slug/order/text",
                  params: { slug },
                });
              }}
            >
              {t("order.continue")}
            </Button>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

/* SKELETON */
function Skeleton() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
        <div className="h-16 bg-gray-200 rounded-2xl" />

        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border space-y-4">
              <div className="h-4 w-1/3 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}