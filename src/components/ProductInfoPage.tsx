import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { useTranslation } from "react-i18next";

export function ProductInfoPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const loadProduct = useOrderFlowStore((s) => s.loadProduct);
  const product = useOrderFlowStore((s) => s.product);
  const loading = useOrderFlowStore((s) => s.loading);
  const error = useOrderFlowStore((s) => s.error);

  useEffect(() => {
    void loadProduct(slug);
  }, [loadProduct, slug]);

  const skuMap = product?.skus;
  const documentation = product?.documentation;
  const specs = documentation?.specs ?? [];
  const productInfo = product?.productInfo ?? [];

  if (loading) return <SkeletonPage />;

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-6 md:grid-cols-2">

          {/* LEFT */}
          <section className="group bg-white rounded-2xl p-6 shadow-md border transition hover:shadow-xl hover:-translate-y-1">
            <header className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-wide">
                {product?.name ?? t("product.fallbackTitle")}
              </h1>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <p className="text-sm text-gray-600 leading-relaxed">
                {product?.description ?? t("product.noDescription")}
              </p>
            </header>

            {/* PROCESS */}
            <div className="mt-6 border-t pt-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                {t("product.howItWorks")}
              </h2>

              <ol className="space-y-2 text-sm">
                {(product?.processSteps ?? []).map((s, idx) => (
                  <li key={idx} className="flex gap-3 group/item">
                    <span className="font-bold text-gray-400 group-hover/item:text-black transition">
                      {idx + 1}
                    </span>
                    <span className="text-gray-600 group-hover/item:text-black transition">
                      {s}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* SKU */}
            <div className="mt-6 border-t pt-4">
              <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                {t("product.skus")}
              </h2>

              <div className="grid grid-cols-3 gap-3">
                <SkuCard label={t("product.green")} value={skuMap?.G ?? "—"} />
                <SkuCard label={t("product.pink")} value={skuMap?.P ?? "—"} />
                <SkuCard label={t("product.yellow")} value={skuMap?.Y ?? "—"} />
              </div>
            </div>

            {/* PRODUCT INFO */}
            {productInfo.length > 0 ? (
              <div className="mt-6 border-t pt-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">
                  Product info
                </h2>

                <dl className="space-y-2">
                  {productInfo.map((row) => (
                    <div
                      key={row.label}
                      className="rounded-lg border px-3 py-2 transition hover:border-black hover:bg-gray-50"
                    >
                      <dt className="font-medium text-sm">{row.label}</dt>
                      <dd className="mt-0.5 text-sm text-gray-500">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </section>

          {/* RIGHT */}
          <aside className="group bg-white rounded-2xl p-6 shadow-md border transition hover:shadow-xl hover:-translate-y-1 md:sticky md:top-6 space-y-5">
            {/* DOCUMENTATION */}
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2 tracking-wide">
                {t("product.documentation")}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {documentation?.overview ?? t("product.noOverview")}
              </p>
            </div>

            {/* SPECS */}
            <div className="border-t pt-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                {t("product.specs")}
              </h3>
              <SpecsList rows={specs} />
            </div>

            <Button
              size="lg"
              className="w-full text-base font-bold uppercase transition hover:scale-[1.02] mt-5"
              onClick={() =>
                router.navigate({
                  to: "/products/$slug/order",
                  params: { slug },
                })
              }
            >
              {t("common.enterOrder")}
            </Button>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}

/* SKU CARD */
function SkuCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border px-3 py-2 transition hover:border-black hover:bg-gray-50">
      <div className="text-[11px] font-semibold text-gray-400 uppercase">
        {label}
      </div>
      <div className="mt-1 font-mono text-sm font-semibold">{value}</div>
    </div>
  );
}

function SpecsList({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <dl className="space-y-2">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex justify-between items-center rounded-lg border px-3 py-2 transition hover:border-black hover:bg-gray-50"
        >
          <dt className="font-medium text-sm">{row.label}</dt>
          <dd className="text-sm text-gray-500">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* SKELETON */
function SkeletonPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-6 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border space-y-4">
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />

            <div className="space-y-2 pt-4 border-t">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-200 rounded" />
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="grid grid-cols-3 gap-2">
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SiteLayout>
  );
}
