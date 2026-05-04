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
      <div className="space-y-5 pb-6">

        {/* HEADER */}
        <header
          className="
            rounded-3xl
            border-2 border-[var(--neon-green)]
            bg-white
            px-5 py-5
            shadow-[0_0_25px_rgba(57,255,20,0.08)]
          "
        >
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black">
            {t("product.title")}
          </h1>

          <p className="mt-2 text-sm text-gray-500 max-w-2xl leading-relaxed">
            {t("product.subtitle")}
          </p>

          {error && (
            <p className="mt-3 text-sm font-medium text-red-500">
              {error}
            </p>
          )}
        </header>

        {/* LOADING */}
        {loading ? <SkeletonList /> : null}

        {/* PRODUCTS */}
        <div className="space-y-4">
          {(products ?? []).map((p, index) => {
            const isAvailable = index === 0;

            const CardContent = (
              <div
                className={`
                  rounded-3xl
                  border-2
                  bg-white
                  px-5 py-5
                  transition-all duration-300
                  ${
                    isAvailable
                      ? `
                        border-[var(--neon-green)]
                        hover:-translate-y-1
                        hover:shadow-[0_0_30px_rgba(57,255,20,0.18)]
                      `
                      : "border-gray-200 opacity-70 cursor-not-allowed"
                  }
                `}
              >
                <div className="flex flex-col lg:flex-row gap-5">

                  {/* LEFT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-xl font-black text-black flex flex-wrap items-center gap-2">
                          {p.name}

                          {!isAvailable && (
                            <span
                              className="
                                rounded-full
                                bg-[var(--neon-green)]
                                px-3 py-1
                                text-[10px]
                                font-black
                                uppercase
                                tracking-wide
                                text-black
                                shadow-[0_0_10px_var(--neon-green)]
                              "
                            >
                              {t("product.commingSoon")}
                            </span>
                          )}
                        </h2>

                        <div className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                          {p.id}
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-gray-600">
                      {p.description}
                    </p>

                    {/* PROCESS */}
                    {p.processSteps?.length ? (
                      <div className="mt-5">
                        <div
                          className="
                            mb-3
                            text-[11px]
                            font-black
                            uppercase
                            tracking-[0.15em]
                            text-gray-400
                          "
                        >
                          {t("product.howItWorks")}
                        </div>

                        <div className="space-y-2">
                          {p.processSteps.map((step, i) => (
                            <div
                              key={i}
                              className="
                                flex items-start gap-3
                                rounded-2xl
                                border border-gray-100
                                bg-gray-50
                                px-3 py-2.5
                              "
                            >
                              <div
                                className="
                                  flex h-6 w-6 shrink-0 items-center justify-center
                                  rounded-full
                                  bg-[var(--neon-green)]
                                  text-[11px]
                                  font-black
                                  text-black
                                "
                              >
                                {i + 1}
                              </div>

                              <p className="text-sm text-gray-700 leading-relaxed">
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* RIGHT */}
                  <div className="w-full lg:w-[260px] space-y-4">

                    {/* PRICE */}
                    <div
                      className="
                        rounded-2xl
                        border border-[var(--neon-green)]
                        bg-[rgba(57,255,20,0.06)]
                        px-4 py-4
                      "
                    >
                      <div
                        className="
                          text-[11px]
                          font-black
                          uppercase
                          tracking-[0.14em]
                          text-gray-500
                        "
                      >
                        {t("product.pricing")}
                      </div>

                      <div className="mt-2 text-2xl font-black text-black">
                        ${(p.pricing?.pricePerSetCents ?? 0) / 100}
                      </div>

                      <div className="mt-1 text-xs text-gray-500">
                        {t("product.shipping")}: $
                        {(p.pricing?.shippingCents ?? 0) / 100}
                      </div>
                    </div>

                    {/* SKUS */}
                    <div
                      className="
                        rounded-2xl
                        border
                        bg-gray-50
                        px-4 py-4
                      "
                    >
                      <div
                        className="
                          mb-3
                          text-[11px]
                          font-black
                          uppercase
                          tracking-[0.14em]
                          text-gray-500
                        "
                      >
                        {t("products.skus")}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <SkuPill
                          label="G"
                          value={p.skus?.G ?? "—"}
                        />

                        <SkuPill
                          label="P"
                          value={p.skus?.P ?? "—"}
                        />

                        <SkuPill
                          label="Y"
                          value={p.skus?.Y ?? "—"}
                        />
                      </div>
                    </div>

                    {/* CTA */}
                    <div
                      className={`
                        flex items-center justify-center
                        rounded-2xl
                        px-4 py-3
                        text-sm font-black uppercase tracking-wide
                        transition
                        ${
                          isAvailable
                            ? `
                              bg-[var(--neon-green)]
                              text-black
                              group-hover:scale-[1.02]
                            `
                            : "bg-gray-100 text-gray-400"
                        }
                      `}
                    >
                      {isAvailable
                        ? t("product.cta")
                        : "Coming Soon"}
                    </div>
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
              <div
                key={p.slug}
                className="block"
              >
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </SiteLayout>
  );
}

/* SKELETON */

function SkeletonList() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="
            rounded-3xl
            border-2 border-gray-100
            bg-white
            px-5 py-5
          "
        >
          <div className="flex flex-col lg:flex-row gap-5">

            {/* LEFT */}
            <div className="flex-1 space-y-3">
              <div className="h-6 w-52 rounded-full bg-gray-200" />

              <div className="h-3 w-20 rounded-full bg-gray-200" />

              <div className="space-y-2 pt-2">
                <div className="h-3 w-full rounded-full bg-gray-200" />
                <div className="h-3 w-5/6 rounded-full bg-gray-200" />
              </div>

              <div className="space-y-2 pt-3">
                <div className="h-3 w-24 rounded-full bg-gray-200" />

                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className="h-10 rounded-2xl bg-gray-100"
                  />
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full lg:w-[260px] space-y-4">
              <div className="rounded-2xl bg-gray-100 p-4 space-y-2">
                <div className="h-3 w-20 rounded-full bg-gray-200" />
                <div className="h-6 w-24 rounded-full bg-gray-200" />
                <div className="h-3 w-28 rounded-full bg-gray-200" />
              </div>

              <div className="rounded-2xl bg-gray-100 p-4 space-y-3">
                <div className="h-3 w-16 rounded-full bg-gray-200" />

                <div className="grid grid-cols-3 gap-2">
                  <div className="h-10 rounded-xl bg-gray-200" />
                  <div className="h-10 rounded-xl bg-gray-200" />
                  <div className="h-10 rounded-xl bg-gray-200" />
                </div>
              </div>

              <div className="h-11 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* SKU */

function SkuPill({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border border-gray-200
        bg-white
        px-2 py-2
        text-center
      "
    >
      <div className="text-[10px] font-black uppercase text-gray-400">
        {label}
      </div>

      <div className="mt-1 text-[11px] font-mono font-bold text-black">
        {value}
      </div>
    </div>
  );
}