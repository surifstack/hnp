import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { useTranslation } from "react-i18next";
import { ProductField } from "@/lib/api.types";
import { formatProductFieldValue } from "@/lib/data";
import { BadgeCheck, FileText, Package2 } from "lucide-react";

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
      <div className="mx-auto w-full max-w-6xl px-4 py-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* LEFT SIDE */}
          <section className="rounded-3xl border border-lime-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg">
            {/* HEADER */}
            <header className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-700">
                  <BadgeCheck className="h-4 w-4" />
                  Available Product
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                {product?.name ?? t("product.fallbackTitle")}
              </h1>

              {error && (
                <p className="rounded-xl bg-red-50 p-3 text-sm text-red-500">
                  {error}
                </p>
              )}

              <p className="text-sm leading-6 text-gray-600">
                {product?.description ?? t("product.noDescription")}
              </p>
            </header>

            {/* PROCESS */}
            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <Package2 className="h-4 w-4 text-lime-600" />

                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t("product.howItWorks")}
                </h2>
              </div>

              <ol className="space-y-2">
                {(product?.processSteps ?? []).map((s, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 rounded-2xl border border-gray-100 p-2.5 transition hover:border-lime-300 hover:bg-lime-50"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime-500 text-xs font-bold text-black">
                      {idx + 1}
                    </span>

                    <span className="text-sm leading-5 text-gray-700">
                      {s}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* SKU */}
            <div className="mt-5 border-t border-gray-100 pt-4">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                {t("product.skus")}
              </h2>

              <div className="grid grid-cols-3 gap-2">
                <SkuCard
                  label={t("product.green")}
                  value={skuMap?.G ?? "—"}
                />

                <SkuCard
                  label={t("product.pink")}
                  value={skuMap?.P ?? "—"}
                />

                <SkuCard
                  label={t("product.yellow")}
                  value={skuMap?.Y ?? "—"}
                />
              </div>
            </div>

            {/* PRODUCT INFO */}
            {productInfo.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t("product.productInfo")}
                </h2>

                <dl className="space-y-2">
                  {productInfo.map((row) => (
                    <div
                      key={row.label}
                      className="rounded-2xl border border-gray-100 px-3 py-2.5 transition hover:border-lime-300 hover:bg-lime-50"
                    >
                      <dt className="text-sm font-bold text-black">
                        {row.label}
                      </dt>

                      <dd className="mt-1 text-sm text-gray-600">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </section>

          {/* RIGHT SIDE */}
          <aside className="space-y-4 rounded-3xl border border-lime-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg md:sticky md:top-4">
            {/* DOCUMENTATION */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-lime-600" />

                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t("product.documentation")}
                </h2>
              </div>

              <p className="text-sm leading-6 text-gray-600">
                {documentation?.overview ?? t("product.noOverview")}
              </p>
            </div>

            {/* SPECS */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                {t("product.specs")}
              </h3>

              <SpecsList rows={specs} />
            </div>

            {/* BUTTON */}
            <Button
              size="lg"
              className="mt-4 h-11 w-full rounded-2xl bg-lime-500 text-sm font-black uppercase text-black transition-all hover:bg-lime-400"
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
function SkuCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 px-3 py-2.5 transition hover:border-lime-300 hover:bg-lime-50">
      <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
        {label}
      </div>

      <div className="mt-1 font-mono text-sm font-bold text-black">
        {value}
      </div>
    </div>
  );
}

/* SPECS */
export function SpecsList({ rows }: { rows: ProductField[] }) {
  return (
    <dl className="space-y-2">
      {rows.map((row) => (
        <div
          key={row.key}
          className="flex items-center justify-between rounded-2xl border border-gray-100 px-3 py-2.5 transition hover:border-lime-300 hover:bg-lime-50"
        >
          <dt className="text-sm font-bold text-black">
            {row.label}
          </dt>

          <dd className="text-sm text-gray-600">
            {row.key === "order_qty" ? "Multiples of " : ""}
            {formatProductFieldValue(row.value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* SKELETON */
function SkeletonPage() {
  return (
    <SiteLayout>
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="space-y-4 rounded-3xl border border-lime-100 bg-white p-4 shadow-sm animate-pulse"
          >
            <div className="h-6 w-32 rounded-full bg-lime-100" />

            <div className="h-8 w-2/3 rounded-xl bg-gray-200" />

            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-5/6 rounded bg-gray-100" />
              <div className="h-4 w-4/6 rounded bg-gray-100" />
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="h-4 w-24 rounded bg-gray-200" />

              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 p-2.5"
                >
                  <div className="h-6 w-6 rounded-full bg-lime-200" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="h-4 w-20 rounded bg-gray-200" />

              <div className="grid grid-cols-3 gap-2">
                <div className="h-14 rounded-2xl bg-gray-100" />
                <div className="h-14 rounded-2xl bg-gray-100" />
                <div className="h-14 rounded-2xl bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SiteLayout>
  );
}