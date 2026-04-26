import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/hooks/useCartStore";
import { estimateItemTotals, formatCents, sumCartTotals } from "./cartTotals";
import { useTranslation } from "react-i18next";

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

      <SheetContent className="p-0">
        <div className="p-6 space-y-4">

          {/* HEADER */}
          <SheetHeader>
            <SheetTitle>{t("cart.title")}</SheetTitle>
          </SheetHeader>

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm">
              {error}
            </div>
          )}

          {/* EMPTY CART */}
          {items.length === 0 ? (
            <div className="rounded-xl border bg-white p-4 text-sm text-muted-foreground">
              {t("cart.emptyTitle")}

              <div className="mt-3">
                <Button asChild size="sm" className="font-bold uppercase">
                  <Link to="/products">
                    {t("cart.browseProducts")}
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* ITEMS */}
              <div className="space-y-3">
                {items.map((item) => {
                  const isActive = item.orderId === activeOrderId;
                  const tItem = estimateItemTotals(item);
                  const name = item.product?.name ?? item.order.productSlug;
                  const qty = item.order.setup.quantity;
                  const color = item.order.setup.colorPms;

                  return (
                    <button
                      key={item.orderId}
                      type="button"
                      onClick={() => setActive(item.orderId)}
                      className={`w-full text-left rounded-xl border p-4 transition ${
                        isActive
                          ? "border-black bg-white"
                          : "border-border bg-background hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">

                        {/* LEFT */}
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{name}</div>

                          <div className="mt-1 text-xs text-muted-foreground flex flex-wrap gap-x-2 gap-y-1">
                            <span>{t("cart.quantity")}: {qty}</span>
                            <span>•</span>
                            <span>{t("cart.color")}: {color}</span>
                          </div>

                          {/* QTY BUTTONS */}
                          <div className="mt-2 flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateQuantity(item.orderId, Math.max(40, qty - 40));
                              }}
                            >
                              {t("cart.decrease")}
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateQuantity(item.orderId, Math.min(400, qty + 40));
                              }}
                            >
                              {t("cart.increase")}
                            </Button>
                          </div>

                          <div className="mt-2 text-sm font-bold">
                            {formatCents(tItem.total, tItem.currency)}
                          </div>
                        </div>

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
                          className="shrink-0"
                          aria-label={t("cart.remove")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* TOTALS */}
              <div className="rounded-xl border bg-white p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("cart.subtotal")}
                  </span>
                  <span>{formatCents(totals.subtotal, totals.currency)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("cart.shipping")}
                  </span>
                  <span>{formatCents(totals.shipping, totals.currency)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("cart.taxes")}
                  </span>
                  <span>{formatCents(totals.taxes, totals.currency)}</span>
                </div>

                <div className="flex justify-between font-extrabold">
                  <span>{t("cart.total")}</span>
                  <span>{formatCents(totals.total, totals.currency)}</span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <Button
                  asChild
                  className="flex-1 font-bold uppercase"
                  disabled={loading}
                >
                  <Link to="/cart">
                    {t("cart.checkout")}
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={clear}
                  disabled={loading}
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