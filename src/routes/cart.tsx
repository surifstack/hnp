import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Stepper } from "@/components/cart/Stepper";
import { StepBasicDetails } from "@/components/cart/StepBasicDetails";
import { StepOtp } from "@/components/cart/StepOtp";
import { StepAddress } from "@/components/cart/StepAddress";
import { StepCheckout } from "@/components/cart/StepCheckout";
import { useCartStore } from "@/hooks/useCartStore";
import { useCheckoutFlowStore } from "@/hooks/useCheckoutFlowStore";
import { Button } from "@/components/ui/button";
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
