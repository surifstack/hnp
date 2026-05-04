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
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function Cart({ orderId }: { orderId: string | undefined }) {
  const { t } = useTranslation();

  const items = useCartStore((s) => s.items);
  const activeOrderId = useCartStore((s) => s.activeOrderId);
  const setActive = useCartStore((s) => s.setActive);
  const loading = useCartStore((s) => s.loading);

  const step = useCheckoutFlowStore((s) => s.step);
  const form = useCheckoutFlowStore((s) => s.form);
  const setStep = useCheckoutFlowStore((s) => s.setStep);
  const setBasic = useCheckoutFlowStore((s) => s.setBasic);
  const setAddress = useCheckoutFlowStore((s) => s.setAddress);
  const setOtpVerified = useCheckoutFlowStore((s) => s.setOtpVerified);

  /* ---------------- INIT ORDER ---------------- */

  const effectiveActiveOrderId = useMemo(() => {
    const matchingOrderId =
      orderId && items.some((item) => item.orderId === orderId)
        ? orderId
        : null;

    return matchingOrderId ?? activeOrderId ?? items[0]?.orderId ?? null;
  }, [orderId, activeOrderId, items]);

  useEffect(() => {
    if (!effectiveActiveOrderId) return;
    if (activeOrderId === effectiveActiveOrderId) return;
    setActive(effectiveActiveOrderId);
  }, [activeOrderId, effectiveActiveOrderId, setActive]);

  /* ---------------- CONDITIONS ---------------- */

  const isCartEmpty = items.length === 0 && !loading;
  const canCheckout = items.length > 0 || !!effectiveActiveOrderId;

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-xl space-y-6">

        {/* EMPTY CART */}
        {isCartEmpty && (
        <section
            className="
              rounded-3xl
              border-2 border-[var(--neon-green)]
              bg-white
              px-6 py-8
              text-center
              space-y-5
              shadow-[0_0_25px_rgba(57,255,20,0.10)]
            "
          >
            <div
              className="
                mx-auto
                flex h-16 w-16 items-center justify-center
                rounded-full
                bg-[rgba(57,255,20,0.12)]
                border border-[var(--neon-green)]
              "
            >
              <span className="text-3xl">🛒</span>
            </div>

            <div className="space-y-2">
              <h1
                className="
                  text-2xl
                  font-black
                  uppercase
                  tracking-wide
                  text-black
                "
              >
                {t("cart.emptyTitle")}
              </h1>

              <p className="text-sm leading-relaxed text-gray-500 max-w-md mx-auto">
                {t("cart.emptySubtitle")}
              </p>
            </div>

            <Button
              asChild
              className="
                h-12
                rounded-2xl
                bg-[var(--neon-green)]
                px-6
                text-sm
                font-black
                uppercase
                tracking-wide
                text-black
                shadow-[0_0_15px_rgba(57,255,20,0.25)]
                hover:scale-[1.02]
                hover:opacity-90
                transition
              "
            >
              <Link to="/products">
                {t("cart.browseProducts")}
              </Link>
            </Button>
          </section>
        )}

        {/* CHECKOUT FLOW */}
        {canCheckout && (
          <>
            <Stepper current={step} verified={form.otpVerified} />

            {step === 1 && (
              <StepBasicDetails
                value={form.basic}
                onChange={setBasic}
                onNext={() => setStep(2)}
              />
            )}

            {step === 2 && (
              <StepOtp
                email={form.basic.email}
                verified={form.otpVerified}
                onVerified={() => setOtpVerified(true)}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}

            {step === 3 && (
              <StepAddress
                country={form.basic.country}
                value={form.address}
                onChange={setAddress}
                onBack={() => setStep(2)}
                onNext={() => setStep(4)}
              />
            )}

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