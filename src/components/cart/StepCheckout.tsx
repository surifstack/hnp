import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiJson } from "@/lib/api";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { skuForSelection } from "@/lib/sku";
import type { FormState } from "./types";
import { COUNTRY_ADDRESS_FIELDS } from "./types";
import { basicDetailsSchema, buildAddressSchema } from "./validation";
import { CartItems } from "@/components/cart/CartItem";

interface Props {
  state: FormState;
  orderId?: string;
  onBack: () => void;
}

type PaymentIntentResp = {
  totals: { subtotal: number; shipping: number; taxes: number; total: number; currency: string };
  stripe: { paymentIntentId: string; clientSecret?: string };
};

export function StepCheckout({ state, orderId, onBack }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [payment, setPayment] = useState<PaymentIntentResp | null>(null);

  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<string | null>(null);

  const userId = useSessionStore((s) => s.userId);
  const loadOrder = useOrderFlowStore((s) => s.loadOrder);
  const storeOrderId = useOrderFlowStore((s) => s.order?.id);
  const orderLoading = useOrderFlowStore((s) => s.loading);

  const effectiveOrderId = orderId ?? storeOrderId;

  useEffect(() => {
    if (!effectiveOrderId) return;
    if (storeOrderId === effectiveOrderId) return;
    void loadOrder(effectiveOrderId);
  }, [effectiveOrderId, loadOrder, storeOrderId]);

  const missing = useMemo(() => {
    const issues: string[] = [];
    if (!basicDetailsSchema.safeParse(state.basic).success) {
      issues.push("Basic details are incomplete");
    }
    if (!state.otpVerified) issues.push("Email is not verified");

    const fields = COUNTRY_ADDRESS_FIELDS[state.basic.country] ?? [];
    if (
      fields.length === 0 ||
      !buildAddressSchema(fields).safeParse(state.address).success
    ) {
      issues.push("Shipping address is incomplete");
    }

    return issues;
  }, [state]);

  const placeOrder = () => {
    if (missing.length > 0) return;

    if (!userId) {
      toast.error("Please sign in to pay");
      return;
    }

    setSubmitted(true);

    void (async () => {
      try {
        const resp = await apiJson<PaymentIntentResp>(
          `/orders/${effectiveOrderId}/payment/intent`,
          {
            method: "POST",
            headers: { "x-user-id": userId },
          }
        );

        setPayment(resp);
        toast.success("PaymentIntent created");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Payment failed");
      } finally {
        setSubmitted(false);
      }
    })();
  };

  const applyPromo = () => {
    if (!promo.trim()) {
      toast.error("Enter a promo code");
      return;
    }

    setPromoApplied(promo.trim());
    toast.success("Promo code applied");
  };

  if (!effectiveOrderId) {
    return (
      <section className="bg-white rounded-2xl p-6 shadow border text-center space-y-3">
        <h2 className="text-lg font-bold uppercase">Cart is empty</h2>
        <p className="text-sm text-gray-500">
          Add a product to your cart to continue checkout.
        </p>
        <Button asChild>
          <Link to="/products">Browse products</Link>
        </Button>
      </section>
    );
  }

  return (
    <div className="space-y-4">

      {/* ERRORS */}
      {missing.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Cannot place order yet</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 mt-1">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* CART ITEMS (WITH TOTALS INSIDE) */}
      <section className="bg-white rounded-2xl p-5 shadow border space-y-3">
        <h2 className="text-lg font-bold uppercase">Selected product</h2>

        {orderLoading && (
          <p className="text-sm text-gray-500">Loading your order…</p>
        )}

        <CartItems effectiveActiveOrderId={orderId as string} />
      </section>

      {/* ORDER DETAILS */}
      <section className="bg-white rounded-2xl p-5 shadow border space-y-2">
        <h2 className="text-lg font-bold uppercase">Order summary</h2>

        <Row label="Customer" value={state.basic.name} />
        <Row label="Email" value={state.basic.email} />
        <Row label="Phone" value={state.basic.phone} />
        <Row label="Country" value={state.basic.country} />

        <div className="border-t pt-2 mt-2">
          <p className="text-xs font-bold uppercase mb-1">
            Shipping address
          </p>

          {(COUNTRY_ADDRESS_FIELDS[state.basic.country] ?? []).map((f) => (
            <Row key={f} label={f} value={state.address[f] ?? ""} />
          ))}
        </div>

      
      </section>

      {/* PROMO */}
      <section className="bg-white rounded-2xl p-5 shadow border space-y-3">
        <h2 className="text-lg font-bold uppercase">Promo Code</h2>

        <div className="flex gap-2">
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />

          <Button variant="outline" onClick={applyPromo}>
            Apply
          </Button>
        </div>

        {promoApplied && (
          <p className="text-sm text-green-600">
            Applied: {promoApplied}
          </p>
        )}
      </section>

      {/* PAYMENT */}
      <section className="bg-white rounded-2xl p-5 shadow border">
        <h2 className="text-lg font-bold uppercase mb-2">Payment</h2>

        <p className="text-sm text-gray-500">
          Secure payment powered by Stripe.
        </p>

        <div className="mt-3 p-4 border-dashed border text-center text-sm">
          Stripe placeholder

          {payment?.stripe?.paymentIntentId && (
            <p className="text-xs mt-2">
              {payment.stripe.paymentIntentId}
            </p>
          )}
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>

        <Button
          onClick={placeOrder}
          className="flex-1 font-bold uppercase"
          disabled={missing.length > 0 || submitted}
        >
          {submitted ? "Working…" : "Pay now"}
        </Button>
      </div>
    </div>
  );
}

/* SMALL ROW COMPONENT */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}