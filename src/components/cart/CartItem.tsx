import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCartStore";
import { useTranslation } from "react-i18next";
import { estimateItemTotals, formatCents, sumCartTotals } from "./cartTotals";
import { buildQuantityConfig } from "@/lib/data";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

export function CartItems({
  effectiveActiveOrderId,
}: {
  effectiveActiveOrderId: string | null;
}) {
  const { t } = useTranslation();

  const items = useCartStore((s) => s.items);
  const setActive = useCartStore((s) => s.setActive);
  const remove = useCartStore((s) => s.remove);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const loading = useCartStore((s) => s.loading);

  const totals = sumCartTotals(items);

  /* EMPTY STATE */
  if (items.length === 0 && !loading) {
    return (
      <section className="rounded-[28px] border border-neutral-200 bg-white p-6 sm:p-7 shadow-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--neon-green)]/15">
          <ShoppingCart className="h-7 w-7 text-black" />
        </div>

        <div className="mt-4 space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-black">
            {t("cart.emptyTitle")}
          </h1>

          <p className="text-sm leading-6 text-neutral-500 max-w-sm mx-auto">
            {t("cart.emptyDesc")}
          </p>
        </div>

        <Button
          asChild
          className="mt-5 h-11 rounded-2xl bg-[var(--neon-green)] px-6 text-sm font-bold text-black hover:opacity-90"
        >
          <Link to="/products">{t("cart.browseProducts")}</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black tracking-tight text-black">
            {t("cart.yourCart")}
          </h2>

          <p className="text-sm text-neutral-500">
            {t("cart.itemsCount", { count: items.length })}
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading && items.length === 0 ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-[26px] border border-neutral-200 bg-white p-5"
            >
              <div className="h-5 w-40 rounded bg-neutral-200" />

              <div className="mt-3 h-4 w-24 rounded bg-neutral-200" />

              <div className="mt-5 flex gap-2">
                <div className="h-10 w-10 rounded-xl bg-neutral-200" />
                <div className="h-10 w-16 rounded-xl bg-neutral-200" />
                <div className="h-10 w-10 rounded-xl bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* ITEMS */}
          <div className="space-y-4">
            {items.map((item) => {
              const isActive = item.orderId === effectiveActiveOrderId;

              const name =
                item.product?.name ?? item.order.productSlug;

              const tItem = estimateItemTotals(item);

              const { orderQty, maxQty } = buildQuantityConfig(
                item.product?.documentation?.specs ?? []
              );

              return (
                <div
                  key={item.orderId}
                  className={`rounded-[28px] border bg-white p-5 sm:p-6 transition-all duration-200 ${
                    isActive
                      ? "border-[var(--neon-green)] shadow-lg"
                      : "border-neutral-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* LEFT */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => setActive(item.orderId)}
                        className="w-full text-left"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black tracking-tight text-black">
                            {name}
                          </h3>

                          {isActive && (
                            <span className="rounded-full bg-[var(--neon-green)] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black">
                              Active
                            </span>
                          )}
                        </div>
                      </button>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        <div className="rounded-xl bg-neutral-100 px-3 py-2">
                          <span className="text-neutral-500">
                            {t("cart.quantity")}:
                          </span>{" "}
                          <span className="font-bold text-black">
                            {item.order.setup.quantity}
                          </span>
                        </div>

                        <div className="rounded-xl bg-neutral-100 px-3 py-2">
                          <span className="text-neutral-500">
                            SKU:
                          </span>{" "}
                          <span className="font-bold text-black">
                            {item.order.setup.colorPms}
                          </span>
                        </div>
                      </div>

                      {/* QUANTITY CONTROLS */}
                      <div className="mt-5 flex items-center gap-3">

                        <Button
                          size="icon"
                          variant="outline"
                          className="h-11 w-11 rounded-2xl border-neutral-300"
                          onClick={(e) => {
                            e.stopPropagation();

                            updateQuantity(
                              item.orderId,
                              Math.max(
                                orderQty,
                                item.order.setup.quantity - orderQty
                              )
                            );
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <div className="flex h-11 min-w-[72px] items-center justify-center rounded-2xl border border-neutral-300 bg-white px-4 text-sm font-black text-black">
                          {item.order.setup.quantity}
                        </div>

                        <Button
                          size="icon"
                          variant="outline"
                          className="h-11 w-11 rounded-2xl border-neutral-300"
                          onClick={(e) => {
                            e.stopPropagation();

                            updateQuantity(
                              item.orderId,
                              Math.min(
                                maxQty,
                                item.order.setup.quantity + orderQty
                              )
                            );
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-start gap-4 lg:items-end">

                      <div className="space-y-1 text-left lg:text-right">
                        <p className="text-xs font-bold uppercase tracking-wide text-neutral-400">
                          Total
                        </p>

                        <div className="text-2xl font-black tracking-tight text-black">
                          {formatCents(tItem.total, tItem.currency)}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="h-11 rounded-2xl border-red-200 px-4 font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => remove(item.orderId)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("cart.remove")}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TOTALS */}
          {items.length > 0 && (
            <div className="rounded-[28px] border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="space-y-4">

                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">
                    {t("cart.subtotal")}
                  </span>

                  <span className="font-semibold text-black">
                    {formatCents(
                      totals.subtotal,
                      totals.currency
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">
                    {t("cart.shipping")}
                  </span>

                  <span className="font-semibold text-black">
                    {formatCents(
                      totals.shipping,
                      totals.currency
                    )}
                  </span>
                </div>

                <div className="h-px bg-neutral-200" />

                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-black">
                    {t("cart.total")}
                  </span>

                  <span className="text-2xl font-black tracking-tight text-black">
                    {formatCents(
                      totals.total,
                      totals.currency
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}