import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { buildQuantityConfig, COLORS } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import type { Product } from "@/lib/api.types";
import { skuForSelection } from "@/lib/sku";
import { LANGUAGE_OPTIONS } from "@/config/languages";
import {
  BadgeCheck,
  Globe2,
  Hash,
  Palette,
  ShoppingCart,
} from "lucide-react";

export function OrderSetupPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const loadProduct = useOrderFlowStore((s) => s.loadProduct);
  const startOrder = useOrderFlowStore((s) => s.startOrder);
  const updateSetup = useOrderFlowStore((s) => s.updateSetup);
  const setSetupDraft = useOrderFlowStore((s) => s.setSetupDraft);
  const clearOrderFlow = useOrderFlowStore((s) => s.clearOrderFlow);

  const order = useOrderFlowStore((s) => s.order);
  const product = useOrderFlowStore((s) => s.product);
  const setupDraft = useOrderFlowStore((s) => s.setupDraft);
  const loading = useOrderFlowStore((s) => s.loading);

  useEffect(() => {
    clearOrderFlow();
    startOrder(slug);
    void loadProduct(slug);
  }, [slug]);

  const { orderQty, maxQty, quantities } = buildQuantityConfig(
    product?.documentation?.specs ?? []
  );

  useEffect(() => {
    if (!order || order.productSlug !== slug) {
      void startOrder(slug as Product["slug"]);
    }
  }, [order, slug, startOrder]);

  const safeSetup = setupDraft ?? {
    quantity: orderQty,
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
      <div className="mx-auto max-w-5xl px-4 py-4 space-y-4">
        {/* HEADER */}
        <div className="rounded-3xl border border-lime-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-700">
              <BadgeCheck className="h-4 w-4" />
              Setup Order
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
            {t("order.setupTitle", {
              name: product?.name ?? "Order",
            })}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {t("order.configureOrder")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* LEFT PANEL */}
          <div className="space-y-4 rounded-3xl border border-lime-200 bg-white p-4 shadow-sm">
            {/* QUANTITY */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-lime-600" />

                <Label className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  {t("order.quantity", {
                    qty: `(${orderQty}-${maxQty})`,
                  })}
                </Label>
              </div>

              <Select
                value={String(safeSetup.quantity)}
                onValueChange={(v) =>
                  setSetupDraft({
                    ...safeSetup,
                    quantity: Number(v),
                  })
                }
              >
                <SelectTrigger className="h-11 rounded-2xl border-lime-200 focus:ring-lime-500">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {quantities.map((q) => (
                    <SelectItem key={q} value={String(q)}>
                      {q}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* LANGUAGE */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-lime-600" />

                <Label className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  {t("order.language")}
                </Label>
              </div>

              <Select
                value={safeSetup.languageCode}
                onValueChange={(v) =>
                  setSetupDraft({
                    ...safeSetup,
                    languageCode: v,
                  })
                }
              >
                <SelectTrigger className="h-11 rounded-2xl border-lime-200 focus:ring-lime-500">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {LANGUAGE_OPTIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-4 rounded-3xl border border-lime-200 bg-white p-4 shadow-sm">
            {/* COLOR HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-lime-600" />

                <Label className="text-xs font-bold uppercase tracking-wide text-gray-500">
                  {t("order.color")}
                </Label>
              </div>

              {selectedSku && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-600">
                  SKU:
                  <span className="ml-1 font-mono text-black">
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
                    className={`rounded-2xl border p-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                      selected
                        ? "border-lime-500 bg-lime-50 ring-2 ring-lime-500"
                        : "border-gray-200 hover:border-lime-300"
                    }`}
                  >
                    <div
                      className="mx-auto h-10 w-10 rounded-xl border border-black/10"
                      style={{ backgroundColor: c.swatch }}
                    />

                    <div className="mt-2 text-center text-xs font-bold text-black">
                      {c.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CONTINUE */}
            <Button
              size="lg"
              className="mt-2 h-11 w-full rounded-2xl bg-lime-500 text-sm font-black uppercase text-black transition-all hover:bg-lime-400"
              onClick={async () => {
                await updateSetup(safeSetup);

                router.navigate({
                  to: "/products/$slug/order/text",
                  params: { slug },
                });
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />

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
      <div className="mx-auto max-w-5xl px-4 py-4 space-y-4 animate-pulse">
        {/* HEADER */}
        <div className="rounded-3xl border border-lime-100 bg-white p-4 space-y-3">
          <div className="h-6 w-32 rounded-full bg-lime-100" />
          <div className="h-8 w-2/3 rounded-xl bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-100" />
        </div>

        {/* GRID */}
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="space-y-4 rounded-3xl border border-lime-100 bg-white p-4"
            >
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-11 rounded-2xl bg-gray-100" />
              </div>

              <div className="space-y-2">
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="h-11 rounded-2xl bg-gray-100" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 rounded-2xl bg-gray-100" />
                <div className="h-20 rounded-2xl bg-gray-100" />
                <div className="h-20 rounded-2xl bg-gray-100" />
              </div>

              <div className="h-11 rounded-2xl bg-lime-100" />
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}