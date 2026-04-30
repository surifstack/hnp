import { createFileRoute, Link } from "@tanstack/react-router";
import { Cart } from "@/components/cart/Cart";

export const Route = createFileRoute("/cart")({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId:
      typeof search.orderId === "string" ? search.orderId : undefined,
  }),
  head: () => ({
    meta: [{ title: "Cart & Checkout — Hot Neon Posters" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { orderId } = Route.useSearch();

  return <Cart orderId={orderId} />;
}
