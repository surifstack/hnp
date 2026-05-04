import type { ReactNode } from "react";
import { Trash2, X } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useCartStore } from "@/hooks/useCartStore";
import {
  estimateItemTotals,
  formatCents,
  sumCartTotals,
} from "./cartTotals";

import { useTranslation } from "react-i18next";
import { buildQuantityConfig } from "@/lib/data";

export function CartSheet({ trigger }: { trigger: ReactNode }) {
  const { t } = useTranslation();

  const items = useCartStore((s) => s.items);
  const activeOrderId = useCartStore((s) => s.activeOrderId);
  const setActive = useCartStore((s) => s.setActive);
  const remove = useCartStore((s) => s.remove);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clear = useCartStore((s) => s.clear);
  const loading = useCartStore((s) => s.loading);
  const error = useCartStore((s) => s.error);

  const totals = sumCartTotals(items);

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent
        side="right"
        className="
          w-full sm:max-w-md
          border-l-4 border-[var(--neon-green)]
          bg-white
          p-0
          overflow-hidden
        "
      >
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-white border-b border-[var(--neon-green)]">
          <div className="flex items-center justify-between px-5 py-4">
            <SheetHeader className="space-y-0 text-left">
              <SheetTitle className="text-lg font-black uppercase tracking-wide text-black">
                {t("cart.title")}
              </SheetTitle>
            </SheetHeader>

            {/* FIXED CLOSE BUTTON */}
            <SheetClose asChild>
              <button
                className="
                  flex items-center justify-center
                  h-9 w-9 rounded-full
                  border-2 border-black
                  bg-[var(--neon-green)]
                  text-black
                  hover:scale-105
                  transition
                  shrink-0
                "
              >
                <X className="h-4 w-4" />
              </button>
            </SheetClose>
          </div>
        </div>

        {/* BODY */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto px-4 py-4 space-y-4">
          {/* ERROR */}
          {error && (
            <div className="rounded-2xl border-2 border-red-500 bg-red-50 p-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* EMPTY */}
          {items.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-[var(--neon-green)] bg-white p-6 text-center space-y-4 shadow-sm">
              <p className="text-sm text-gray-500">
                {t("cart.emptyTitle")}
              </p>

              <Button
                asChild
                className="
                  w-full h-11 rounded-2xl
                  bg-[var(--neon-green)]
                  text-black
                  font-black uppercase
                  hover:opacity-90
                "
              >
                <Link to="/products">
                  {t("cart.browseProducts")}
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {/* ITEMS */}
              <div className="space-y-4">
                {items.map((item) => {
                  const isActive = item.orderId === activeOrderId;

                  const tItem = estimateItemTotals(item);

                  const name =
                    item.product?.name ?? item.order.productSlug;

                  const qty = item.order.setup.quantity;

                  const color = item.order.setup.colorPms;

                  const { orderQty, maxQty } =
                    buildQuantityConfig(
                      item.product?.documentation?.specs ?? []
                    );

                  return (
                    <div
                      key={item.orderId}
                      className={`
                        rounded-3xl border-2 p-4 transition-all
                        ${
                          isActive
                            ? "border-[var(--neon-green)] bg-[rgba(57,255,20,0.08)] shadow-lg"
                            : "border-gray-200 bg-white"
                        }
                      `}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* LEFT */}
                        <button
                          type="button"
                          onClick={() => setActive(item.orderId)}
                          className="flex-1 text-left"
                        >
                          <div className="font-black text-base text-black">
                            {name}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                            <span>
                              {t("cart.quantity")}: {qty}
                            </span>

                            <span>•</span>

                            <span>
                              {t("cart.color")}: {color}
                            </span>
                          </div>

                          {/* QTY */}
                          <div className="mt-4 flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="
                                h-9 w-9 rounded-xl
                                border-2 border-black
                                p-0 font-black
                              "
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                updateQuantity(
                                  item.orderId,
                                  Math.max(orderQty, qty - orderQty)
                                );
                              }}
                            >
                              −
                            </Button>

                            <div className="min-w-[44px] text-center text-sm font-black">
                              {qty}
                            </div>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="
                                h-9 w-9 rounded-xl
                                border-2 border-black
                                p-0 font-black
                              "
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                updateQuantity(
                                  item.orderId,
                                  Math.min(maxQty, qty + orderQty)
                                );
                              }}
                            >
                              +
                            </Button>
                          </div>

                          <div className="mt-4 text-lg font-black text-black">
                            {formatCents(
                              tItem.total,
                              tItem.currency
                            )}
                          </div>
                        </button>

                        {/* REMOVE */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            remove(item.orderId);
                          }}
                          className="
                            h-10 w-10 shrink-0 rounded-xl
                            border border-gray-200
                            hover:bg-red-50 hover:text-red-500
                          "
                          aria-label={t("cart.remove")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TOTALS */}
              <div className="rounded-3xl border-2 border-black bg-[rgba(57,255,20,0.08)] p-5 space-y-3 shadow-sm">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t("cart.subtotal")}
                  </span>

                  <span className="font-bold">
                    {formatCents(
                      totals.subtotal,
                      totals.currency
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t("cart.shipping")}
                  </span>

                  <span className="font-bold">
                    {formatCents(
                      totals.shipping,
                      totals.currency
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {t("cart.taxes")}
                  </span>

                  <span className="font-bold">
                    {formatCents(
                      totals.taxes,
                      totals.currency
                    )}
                  </span>
                </div>

                <div className="border-t border-black/10 pt-3 flex justify-between text-lg font-black">
                  <span>{t("cart.total")}</span>

                  <span>
                    {formatCents(
                      totals.total,
                      totals.currency
                    )}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="sticky bottom-0 bg-white pt-2 pb-4 space-y-3">
                {/* CHECKOUT BUTTON FIXED */}
                <Button
                  asChild
                  disabled={loading}
                  className="
                    w-full h-12 rounded-2xl
                    bg-[var(--neon-green)]
                    text-black
                    text-sm font-black uppercase tracking-wide
                    hover:opacity-90
                    shadow-lg
                  "
                >
                  <Link to="/cart">
                    {t("cart.checkout")}
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={clear}
                  disabled={loading}
                  className="
                    w-full h-11 rounded-2xl
                    border-2 border-black
                    font-bold uppercase
                  "
                >
                  {t("cart.clear")}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}