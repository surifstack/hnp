import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  MapPin,
  Package,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/components/cart/cartTotals";
import { useTranslation } from "react-i18next";
import { apiJson } from "@/lib/api";
import type { OrderDetail, Product } from "@/lib/api.types";
import { useSessionStore } from "@/hooks/useSessionStore";
import { SiteLayout } from "./SiteLayout";
import { COUNTRY_OPTIONS, getCountryOption, getLanguageOption, LANGUAGE_OPTIONS } from "@/config/languages";
import { attentionKey } from "@/lib/data";
import { NoActiveOrder } from "./NoActiveOrder";
import { useCatalogStore } from "@/hooks/useCatalogStore";

/* ===================== TYPES ===================== */

type Props = {
  orderId: string;
};

/* ===================== COMPONENT ===================== */

export function OrderSuccessPage({ orderId }: Props) {
  const accentColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--neon-green")
    .trim();

  const { t, i18n } = useTranslation();
  const products = useCatalogStore((s) => s.products);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 

  const user = useSessionStore((s) => s.user);

  /* ===================== FETCH ORDER ===================== */

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiJson<OrderDetail>(
          `/orders/checkout/${orderId}`
        );

        if (!cancelled) setOrder(res);
      } catch (e) {
        if (!cancelled) setError("Failed to load order");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  /* ===================== PRODUCT IDS ===================== */

  
console.log(order, 'order')

  /* ===================== STATES ===================== */

  if (loading) return <OrderSuccessSkeleton />;

  if (error) {
    return (
      <div className="p-10 text-red-500 text-center">{error}</div>
    );
  }

  if (!order || (!user?.id)) return <NoActiveOrder />;

  /* ===================== DERIVED VALUES ===================== */

  const placedAt = new Date(order.createdAt);

  const selectedLanguage = COUNTRY_OPTIONS.find(
    (l) => l.code === order.countryCode
  );

  const addressFields = selectedLanguage?.addressFormat?.fields ?? [];

  const addressEntries = Object.entries(order.address ?? {}).filter(
    ([, v]) => String(v ?? "").trim().length > 0
  );

  const countryName = getCountryOption(order.countryCode);

  /* ===================== UI ===================== */

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-5xl space-y-10 py-10">

        {/* HEADER */}
        <section className="relative overflow-hidden rounded-3xl border bg-white p-8 shadow-sm">

          <div
            className="absolute inset-0 opacity-10"
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
                  {t("orderSuccess.confirmedTitle")}
                </h1>

                <p className="mt-1 text-muted-foreground">
                  {t("orderSuccess.confirmedSubtitle")}
                </p>

                <div className="mt-3 flex gap-3 text-sm">
                  <span
                    className="rounded-full px-3 py-1 text-white font-semibold"
                    style={{ backgroundColor: accentColor }}
                  >
                    {t("orderSuccess.successBadge")}
                  </span>

                  <span className="text-muted-foreground">
                    {placedAt.toLocaleString(i18n.language)}
                  </span>

                  <span className="font-semibold">
                    {formatCents(order.totals.total, order.totals.currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild style={{ backgroundColor: accentColor }}>
                <Link to="/dashboard/orders?tab=current">
                  {t("orderSuccess.viewOrdersCta")}
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link to="/products">
                  {t("orderSuccess.continueShopping")}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* BODY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-5">

            <h2 className="text-xl font-semibold">
              {t("orderSuccess.orderItemsTitle")}
            </h2>

            {order.items.map((it) => {
              const product = products?.find((p) => p.id === it.productId);
              return (
                <div key={it.id} className="rounded-2xl border bg-white p-5">

                  <div className="flex justify-between">

                    <div>
                      <div className="text-lg font-semibold">
                        {product?.name ?? "unknow"}
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {product?.description ?? ""}
                      </div>

                      <div className="mt-3 text-sm text-muted-foreground space-y-1">
                        <div>Qty: {it.setup.quantity}</div>
                        <div>Color: PMS {it.setup.colorPms}</div>
                        <div>Lang: {it.setup.languageCode}</div>
                      </div>
                    </div>

                    <div
                      className="text-lg font-bold"
                      style={{ color: accentColor }}
                    >
                      {formatCents(it.pricing.total, it.pricing.currency)}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-5">

            <Card title="Customer" icon={<Package />}>
              <Info label="Name" value={`${order.customer.first_name} ${order.customer.last_name}`} />
              <Info label="Email" value={order.customer.email} />
              <Info label="Phone" value={order.customer.phone} />
              <Info label="Country" value={countryName?.name ?? order.countryCode} />
            </Card>

            <Card title="Shipping Address" icon={<MapPin />}>
              {addressFields.length ? (
                addressFields.map((f) => (
                  <Info
                    key={f.key}
                    label={f.label}
                    value={order.address?.[f.key]}
                  />
                ))
              ) : (
                <div className="text-muted-foreground">
                  No address provided
                </div>
              )}
            </Card>

            <Card title="Summary" icon={<Package />}>
              <Info label="Items" value={order.items.length} />
              <Info
                label="Total"
                value={formatCents(order.totals.total, order.totals.currency)}
                highlight
                color={accentColor}
              />
            </Card>

          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

/* ===================== SKELETON ===================== */

function OrderSuccessSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 py-10 animate-pulse">
      <div className="h-32 bg-gray-200 rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-6 w-40 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/* ===================== UI HELPERS ===================== */

function Card({
  title,
  icon,
  children,
}: any) {
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
}: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={highlight ? "font-bold" : "font-medium"}
        style={{ color: highlight ? color : undefined }}
      >
        {value || "—"}
      </span>
    </div>
  );
}