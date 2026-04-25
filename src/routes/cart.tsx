import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Stepper } from "@/components/cart/Stepper";
import { StepBasicDetails } from "@/components/cart/StepBasicDetails";
import { StepOtp } from "@/components/cart/StepOtp";
import { StepAddress } from "@/components/cart/StepAddress";
import { StepCheckout } from "@/components/cart/StepCheckout";
import {
  initialFormState,
  type FormState,
  type Step,
} from "@/components/cart/types";
import { useCartStore } from "@/hooks/useCartStore";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId:
      typeof search.orderId === "string" ? search.orderId : undefined,
  }),
  head: () => ({
    meta: [{ title: "Cart & Checkout — Hot Neon Posters" }],
  }),
  component: Cart,
});

function Cart() {
  const { orderId } = Route.useSearch();

  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initialFormState);

  const items = useCartStore((s) => s.items);
  const activeOrderId = useCartStore((s) => s.activeOrderId);
  const setActive = useCartStore((s) => s.setActive);
  const addOrderId = useCartStore((s) => s.addOrderId);
  const loading = useCartStore((s) => s.loading);

  /* ---------------- INIT ORDER ---------------- */

  useEffect(() => {
    if (!orderId) return;
    void addOrderId(orderId);
  }, [addOrderId, orderId]);

  const effectiveActiveOrderId = useMemo(() => {
    return orderId ?? activeOrderId ?? items[0]?.orderId ?? null;
  }, [orderId, activeOrderId, items]);

  useEffect(() => {
    if (!effectiveActiveOrderId) return;
    if (activeOrderId === effectiveActiveOrderId) return;
    setActive(effectiveActiveOrderId);
  }, [activeOrderId, effectiveActiveOrderId, setActive]);

  /* ---------------- CONDITIONS ---------------- */

  const isCartEmpty = items.length === 0 && !loading;
  const canCheckout = items.length > 0 || !!effectiveActiveOrderId;

  /* ---------------- UI ---------------- */

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-xl space-y-6">

        {/* EMPTY CART */}
        {isCartEmpty && (
          <section className="bg-white rounded-2xl p-6 shadow-md border text-center space-y-3">
            <h1 className="text-xl font-extrabold uppercase tracking-wide">
              Cart is empty
            </h1>

            <p className="text-sm text-gray-500">
              Add products to your cart to continue checkout.
            </p>

            <Button asChild className="font-bold uppercase">
              <Link to="/products">Browse products</Link>
            </Button>
          </section>
        )}

        {/* CHECKOUT FLOW */}
        {canCheckout && (
          <>
            <Stepper current={step} verified={form.otpVerified} />

            {/* STEP 1 */}
            {step === 1 && (
              <StepBasicDetails
                value={form.basic}
                onChange={(basic) => setForm((p) => ({ ...p, basic }))}
                onNext={() => setStep(2)}
              />
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <StepOtp
                email={form.basic.email}
                verified={form.otpVerified}
                onVerified={() =>
                  setForm((p) => ({ ...p, otpVerified: true }))
                }
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <StepAddress
                country={form.basic.country}
                value={form.address}
                onChange={(address) =>
                  setForm((p) => ({ ...p, address }))
                }
                onBack={() => setStep(2)}
                onNext={() => setStep(4)}
              />
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <StepCheckout
                state={form}
                orderId={effectiveActiveOrderId ?? undefined}
                onBack={() => setStep(3)}
              />
            )}
          </>
        )}
      </div>
    </SiteLayout>
  );
}