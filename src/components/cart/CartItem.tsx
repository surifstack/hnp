import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/useCartStore";
import { estimateItemTotals, formatCents, sumCartTotals } from "./cartTotals";

export function CartItems({
  effectiveActiveOrderId,
}: {
  effectiveActiveOrderId: string | null;
}) {
  const items = useCartStore((s) => s.items);
  const setActive = useCartStore((s) => s.setActive);
  const remove = useCartStore((s) => s.remove);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const loading = useCartStore((s) => s.loading);

  const totals = sumCartTotals(items);

  if (items.length === 0 && !loading) {
    return (
      <section className="bg-white rounded-2xl p-6 shadow-md border text-center space-y-3">
        <h1 className="text-xl font-extrabold uppercase">Cart is empty</h1>
        <p className="text-sm text-gray-500">
          Add products to your cart to continue checkout.
        </p>
        <Button asChild>
          <Link to="/products">Browse products</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="p-5  space-y-3">
      <div className="flex justify-between">
        <h2 className="text-sm font-extrabold uppercase">Your cart</h2>
        <div className="text-xs text-gray-500">{items.length} item(s)</div>
      </div>

      {loading && items.length === 0 ? (
        <div className="text-sm text-gray-500">Loading cart…</div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const isActive = item.orderId === effectiveActiveOrderId;
            const name = item.product?.name ?? item.order.productSlug;
            const t = estimateItemTotals(item);

            return (
              <div
                key={item.orderId}
                className={`rounded-xl border p-4 flex justify-between ${
                  isActive ? "border-black" : "border-gray-200"
                }`}
              >
                <div className="flex-1">
                  <button onClick={() => setActive(item.orderId)} className="text-left w-full">
                    <div className="font-semibold">{name}</div>
                  </button>
                  <div className="text-xs text-gray-500">
                    Qty: {item.order.setup.quantity}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(event) => {
                        event.stopPropagation();
                        updateQuantity(item.orderId, Math.max(40, item.order.setup.quantity - 40));
                      }}
                    >
                      -
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(event) => {
                        event.stopPropagation();
                        updateQuantity(item.orderId, Math.min(400, item.order.setup.quantity + 40));
                      }}
                    >
                      +
                    </Button>
                  </div>
                  <div className="font-bold">
                    {formatCents(t.total, t.currency)}
                  </div>
                </div>

                <Button size="sm" variant="outline" onClick={() => remove(item.orderId)}>
                  Remove
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-xl border space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatCents(totals.subtotal, totals.currency)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{formatCents(totals.shipping, totals.currency)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatCents(totals.total, totals.currency)}</span>
          </div>
        </div>
      )}
    </section>
  );
}
