import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  Package,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useHnpStore } from "@/hooks/useHnpStore";
import { formatCents } from "@/components/cart/cartTotals";
import { useTranslation } from "react-i18next";
import { apiJson } from "@/lib/api";
import type { Product } from "@/lib/api.types";
import { useSessionStore } from "@/hooks/useSessionStore";
import { SiteLayout } from "./SiteLayout";
import { getLanguageOption, LANGUAGE_OPTIONS } from "@/config/languages";
import { attentionKey } from "@/lib/data";
import { NoActiveOrder } from "./NoActiveOrder";

type Props = {
  orderId: string;
};

export function OrderSuccessPage({
  orderId,
}: Props) {
const accentColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--neon-color')
  .trim();  const { t, i18n } = useTranslation();
  const userId = useSessionStore((s) => s.userId);
  const checkout = useHnpStore((s) =>
    orderId ? s.userOrders.checkoutsById[orderId] : undefined
  );

  const [productsBySlug, setProductsBySlug] = useState<Record<string, Product>>({});

  const productSlugs = useMemo(() => {
    return [...new Set((checkout?.items ?? []).map((it) => it.productSlug))];
  }, [checkout]);

  const selectedLanguage = useMemo(() => {
    return LANGUAGE_OPTIONS.find((l) => l.value === checkout?.basic?.country);
  }, [checkout?.basic?.country]);

  const addressFields = selectedLanguage?.addressFields ?? [];

  useEffect(() => {
    if (!checkout) return;

    let cancelled = false;

    (async () => {
      const results = await Promise.allSettled(
        productSlugs.map((slug) => apiJson<Product>(`/products/${slug}`))
      );

      if (cancelled) return;

      const next: Record<string, Product> = {};
      for (const r of results) {
        if (r.status === "fulfilled") next[r.value.slug] = r.value;
      }

      setProductsBySlug(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [checkout, productSlugs]);

  if (!orderId || !checkout || (userId && checkout.userId !== userId)) {
    return <NoActiveOrder />;
  }

  const placedAt = new Date(checkout.acceptedAt);
  const money = formatCents(checkout.totals.total, checkout.totals.currency);

  const addressEntries = Object.entries(checkout.address ?? {}).filter(
    ([, v]) => String(v ?? "").trim().length > 0
  );
 const countryName =
    getLanguageOption(
      checkout.basic.country
    ) || null;
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-5xl space-y-10 py-10">

        {/* HEADER */}
        <section className="relative overflow-hidden rounded-3xl border bg-white p-8 shadow-sm">

          <div className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(circle at top, ${accentColor}, transparent 60%)`,
            }}
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex gap-4">

              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <CheckCircle2
                  className="h-7 w-7"
                  style={{ color: accentColor }}
                />
              </div>

              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  {t("orderSuccess.confirmedTitle", { defaultValue: "Order confirmed" })}
                </h1>

                <p className="mt-1 text-base text-muted-foreground">
                  {t("orderSuccess.confirmedSubtitle", {
                    defaultValue: "Your order has been successfully placed.",
                  })}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <span
                    className="rounded-full px-3 py-1 text-white font-semibold"
                    style={{ backgroundColor: accentColor }}
                  >
                    {t(
              "orderSuccess.successBadge"
            )}
                  </span>

                  <span className="text-muted-foreground">
                    {placedAt.toLocaleString(i18n.language)}
                  </span>

                  <span className="font-semibold">{money}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild className="text-white semibold" style={{ backgroundColor: accentColor }}>
                <Link to="/dashboard/orders">{t(
              "orderSuccess.viewOrdersCta"
            )}</Link>
              </Button>


              <Button asChild variant="outline">
                <Link to="/products">{t(
              "orderSuccess.continueShopping"
            )}</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-5">

            <h2 className="text-xl font-semibold"> {t(
              "orderSuccess.orderItemsTitle"
            )}</h2>

            {checkout.items.map((it) => {
              const product = productsBySlug[it.productSlug];

              return (
                <div key={it.clientItemId} className="rounded-2xl border bg-white p-5">

                  <div className="flex justify-between">
                    <div>
                      <div className="text-lg font-semibold">
                        {product?.name ?? it.productSlug}
                      </div>

                      <div className="mt-1 text-sm text-muted-foreground">
                        {product?.description ?? ""}
                      </div>

                      <div className="mt-3 text-sm text-muted-foreground space-y-1">
                        <div>{t(
              "orderSuccess.qtyLabel"
            )}: {it.quantity}</div>
                        <div>{t(
              "orderSuccess.colorLabel"
            )}: PMS {it.colorPms}</div>
                        <div>{t(
              "orderSuccess.languageLabel"
            )}: {it.languageCode}</div>
                      </div>
                    </div>

                    <div className="text-lg font-bold" style={{ color: accentColor }}>
                      {formatCents(it.totals.total, it.totals.currency)}
                    </div>
                  </div>

                </div>
              );
            })}
            
          </div>

          {/* SIDEBAR */}
          <div className="space-y-5">

            <h2 className="text-xl font-semibold"> {t(
              "orderSuccess.orderDetailsTitle"
            )}</h2>

            <Card title={t(
              "orderSuccess.customerTitle"
            )}  icon={<Package />}>
              <Info label={t(
              "orderSuccess.nameLabel"
            )} value={`${checkout.basic.first_name ?? ""} ${checkout.basic.last_name ?? ""}`} />
              <Info label={t(
              "orderSuccess.emailLabel"
            )} value={checkout.basic.email} />
              <Info label={t(
              "orderSuccess.phoneLabel"
            )} value={checkout.basic.phone} />
              <Info label={t(
              "orderSuccess.countryLabel"
            )} value={
              countryName
                ? countryName.name
                : checkout.basic.country
            } />
            </Card>

            <Card title={t(
              "orderSuccess.shippingAddressTitle"
            )} icon={<MapPin />}>
               {checkout.address[attentionKey]?.trim() ? (
                            <Info
                              label={t("cart.address.attentionOf", { defaultValue: "Attention Of" })}
                              value={checkout.address[attentionKey] ?? ""}
                            />
                          ) : null}
              {addressEntries.length ? (
                addressFields.map((f) => (
                  <Info
                    key={f.key}
                    label={f.label}
                    value={checkout.address?.[f.key]}
                  />
                ))
              ) : (
                <div className="text-muted-foreground">No address provided</div>
              )}
            </Card>

            <Card title={t(
              "orderSuccess.paymentTitle"
            )} icon={<CreditCard />}>
              <Info label={t(
              "orderSuccess.paymentMethodLabel"
            )} value={checkout.payment?.method} />
              <Info label={t(
              "orderSuccess.paymentStatusLabel"
            )} value={checkout.payment?.status} />
            </Card>

            <Card title={t(
              "orderSuccess.summaryTitle"
            )} icon={<Package />}>
              <Info label={t(
              "orderSuccess.itemsLabel"
            )}value={checkout.items.length} />
              <Info label={t(
              "orderSuccess.totalLabel"
            )} value={money} highlight color={accentColor} />
            </Card>

          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

/* ---------- UI HELPERS ---------- */

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center gap-2 font-semibold text-sm mb-3">
        {icon}
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Info({
  label,
  value,
  highlight,
  color,
}: {
  label: string;
  value?: string | number | null;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-medium ${highlight ? "font-bold" : ""}`}
        style={{ color: highlight ? color : undefined }}
      >
        {value || "—"}
      </span>
    </div>
  );
}