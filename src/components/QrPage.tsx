import { useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import { useTranslation } from "react-i18next";
import { VideoBlock } from "@/components/VideoBlock";
import { BadgeCheck, Clock3 } from "lucide-react";

export const Route = createFileRoute("/qr")({
  component: QrPage,
});

export function QrPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const fetchProducts = useCatalogStore((s) => s.fetchProducts);
  const products = useCatalogStore((s) => s.products);
  const loading = useCatalogStore((s) => s.loading);
  const error = useCatalogStore((s) => s.error);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
        <VideoBlock />

        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black">
            {t("common.chooseProduct")}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground">
            Explore products and place your order easily.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse"
              >
                {/* Status */}
                <div className="mb-4 h-7 w-28 rounded-full bg-gray-200" />

                {/* Title */}
                <div className="space-y-3">
                  <div className="h-7 w-3/4 rounded-lg bg-gray-200" />

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-gray-100" />
                    <div className="h-4 w-5/6 rounded bg-gray-100" />
                    <div className="h-4 w-4/6 rounded bg-gray-100" />
                  </div>
                </div>

                {/* Features */}
                <div className="mt-5 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                      <div className="h-4 w-40 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="h-11 rounded-2xl bg-gray-200" />
                  <div className="h-11 rounded-2xl bg-gray-300" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(products ?? []).map((p, index) => {
              const isAvailable = index === 0;

              return (
                <div
                  key={p.id}
                  className={`rounded-3xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isAvailable
                      ? "border-lime-400"
                      : "border-gray-200"
                  }`}
                >
                  {/* Status */}
                  <div className="mb-4 flex items-center justify-between">
                    {isAvailable ? (
                      <div className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-700">
                        <BadgeCheck className="h-4 w-4" />
                        Available Now
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                        <Clock3 className="h-4 w-4" />
                        Coming Soon
                      </div>
                    )}
                  </div>

                  {/* Product Name */}
                  <div className="space-y-3">
                    <h2 className="text-2xl font-black tracking-tight text-black">
                      {p.name}
                    </h2>

                    {/* Description */}
                    <p className="min-h-[72px] text-sm leading-6 text-muted-foreground">
                      {p.description ||
                        "High quality product with premium features and smooth user experience."}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mt-5 space-y-2 text-sm">
                    {(p.processSteps ?? []).map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <span className="h-2 w-2 rounded-full bg-lime-500" />
                        {s}
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      disabled={!isAvailable}
                      className="h-11 rounded-2xl border-lime-500 font-bold uppercase hover:bg-lime-50"
                      onClick={() =>
                        router.navigate({
                          to: "/products/$slug",
                          params: { slug: p.slug },
                        })
                      }
                    >
                      {t("common.info")}
                    </Button>

                    <Button
                      disabled={!isAvailable}
                      className="h-11 rounded-2xl bg-lime-500 font-bold uppercase text-black hover:bg-lime-400"
                      onClick={() =>
                        router.navigate({
                          to: "/products/$slug/order",
                          params: { slug: p.slug },
                        })
                      }
                    >
                      {t("common.enterOrder")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && (products?.length ?? 0) === 0 && (
          <div className="rounded-3xl border border-dashed bg-white p-10 text-center">
            <p className="text-muted-foreground">
              No products available at the moment.
            </p>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}