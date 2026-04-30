import { useEffect } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function Products() {
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
      <div className="space-y-6">

        {/* HEADER */}
        <header className="bg-white p-6 shadow-lg border">
          <h1 className="text-3xl font-extrabold">
            {t("product.title")}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {t("product.subtitle")}
          </p>

          {loading && <SkeletonList />}

          {error && (
            <p className="mt-2 text-sm text-red-500">
              {error}
            </p>
          )}
        </header>

        {/* LIST */}
        <div className="space-y-5">
          {(products ?? []).map((p, index) => {
            const isAvailable = index === 0;

            const CardContent = (
              <div
                className={`flex flex-col lg:flex-row gap-6 bg-white p-6 shadow-md border transition
                  ${isAvailable ? "hover:shadow-xl" : "opacity-60 cursor-not-allowed"}
                `}
              >
                {/* LEFT */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {p.name}

                      {!isAvailable && (
                       <span className="text-xs px-3 py-1 font-semibold text-black bg-[var(--neon-green)] rounded 
                        shadow-[0_0_6px_var(--neon-green)]">
                          {t('product.commingSoon')}
                        </span>
                      )}
                    </h2>

                    <span className="text-xs uppercase text-gray-400">
                      {p.id}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {p.description}
                  </p>

                  {/* PROCESS */}
                  {p.processSteps && (
                    <div className="mt-4">
                      <div className="text-xs font-semibold text-gray-400 uppercase mb-2">
                        {t("product.howItWorks")}
                      </div>

                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {p.processSteps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* RIGHT */}
                <div className="w-full lg:w-64 space-y-4">

                  {/* PRICING */}
                  <div className="bg-gray-50 p-4 border">
                    <div className="text-xs uppercase text-gray-400 font-semibold">
                      {t("product.pricing")}
                    </div>

                    <div className="mt-2 text-lg font-bold">
                      ${(p.pricing?.pricePerSetCents ?? 0) / 100}
                    </div>

                    <div className="text-xs text-gray-500">
                      {t("product.shipping")}: $
                      {(p.pricing?.shippingCents ?? 0) / 100}
                    </div>
                  </div>

                  {/* SKUS */}
                  <div className="bg-gray-50 p-4 border">
                    <div className="text-xs uppercase text-gray-400 font-semibold mb-2">
                      {t("products.skus")}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <SkuPill label="G" value={p.skus?.G ?? "—"} />
                      <SkuPill label="P" value={p.skus?.P ?? "—"} />
                      <SkuPill label="Y" value={p.skus?.Y ?? "—"} />
                    </div>
                  </div>

                  {/* CTA */}
                  <div
                    className={`text-sm font-semibold ${
                      isAvailable
                        ? "text-[var(--neon-green)] group-hover:underline"
                        : "text-gray-400"
                    }`}
                  >
                    {isAvailable ? t("product.cta") : "Coming Soon"}
                  </div>

                </div>
              </div>
            );

            return isAvailable ? (
              <Link
                key={p.slug}
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="block group"
              >
                {CardContent}
              </Link>
            ) : (
              <div key={p.slug} className="block group">
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </SiteLayout>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-5 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="flex flex-col lg:flex-row gap-6 bg-white p-6 shadow-md border"
        >
          <div className="flex-1 space-y-3">
            <div className="h-5 w-1/3 bg-gray-200" />
            <div className="h-4 w-2/3 bg-gray-200" />
            <div className="h-4 w-1/2 bg-gray-200" />

            <div className="space-y-2 mt-4">
              <div className="h-3 w-24 bg-gray-200" />
              <div className="h-3 w-3/4 bg-gray-200" />
              <div className="h-3 w-2/3 bg-gray-200" />
            </div>
          </div>

          <div className="w-full lg:w-64 space-y-4">
            <div className="bg-gray-50 p-4 border space-y-2">
              <div className="h-3 w-16 bg-gray-200" />
              <div className="h-5 w-20 bg-gray-200" />
              <div className="h-3 w-24 bg-gray-200" />
            </div>

            <div className="bg-gray-50 p-4 border space-y-2">
              <div className="h-3 w-16 bg-gray-200" />
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="h-6 bg-gray-200" />
                <div className="h-6 bg-gray-200" />
                <div className="h-6 bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkuPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="border px-2 py-1 text-center bg-white">
      <span className="font-mono text-xs">
        {label}:{value}
      </span>
    </div>
  );
}