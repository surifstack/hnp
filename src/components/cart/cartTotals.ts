import type { CartItem } from "@/hooks/useCartStore";
import type { MoneyTotals } from "@/lib/api.types";

export function estimateItemTotals(item: CartItem): MoneyTotals {
  const product = item.product;
  const currency = product?.pricing.currency ?? "usd";
  const qty = item.order.setup.quantity ?? 40;
  const sets = Math.max(1, Math.round(qty / 40));

  const pricePerSet = product?.pricing.pricePerSetCents ?? 0;
  const shipping = product?.pricing.shippingCents ?? 0;
  const taxRate = product?.pricing.taxRate ?? 0;

  const subtotal = sets * pricePerSet;
  const taxes = Math.round((subtotal + shipping) * taxRate);
  const total = subtotal + shipping + taxes;

  return { subtotal, shipping, taxes, total, currency };
}

export function sumCartTotals(items: CartItem[]): MoneyTotals {
  const currency = items[0]?.product?.pricing.currency ?? "usd";
  console.log("Calculating totals for items:", items);
  const totals = items.reduce(
    (acc, item) => {
      const t = estimateItemTotals(item);
      acc.subtotal += t.subtotal;
      acc.shipping += t.shipping;
      acc.taxes += t.taxes;
      acc.total += t.total;
      return acc;
    },
    { subtotal: 0, shipping: 0, taxes: 0, total: 0, currency },
  );
  return totals;
}

export function formatCents(cents: number, currency: string) {
  const value = (cents / 100).toFixed(2);
  return `${value} ${currency.toUpperCase()}`;
}
