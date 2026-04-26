import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiJson } from "@/lib/api";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useCartStore } from "@/hooks/useCartStore";
import { useTranslation } from "react-i18next";
import type { FormState } from "./types";
import { COUNTRY_ADDRESS_FIELDS } from "./types";
import { basicDetailsSchema, buildAddressSchema } from "./validation";
import { CartItems } from "@/components/cart/CartItem";
import type { CheckoutRequest, CheckoutResponse } from "@/lib/api.types";

interface Props {
  state: FormState;
  orderId?: string;
  onBack: () => void;
}

export function StepCheckout({ state, orderId, onBack }: Props) {
  const { t } = useTranslation();

  const [submitted, setSubmitted] = useState(false);
  const [checkout, setCheckout] = useState<CheckoutResponse | null>(null);

  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState<string | null>(null);

  const userId = useSessionStore((s) => s.userId);
  const items = useCartStore((s) => s.items);
  const activeOrderId = useCartStore((s) => s.activeOrderId);
  const setActive = useCartStore((s) => s.setActive);

  const effectiveOrderId = orderId ?? activeOrderId;

  useEffect(() => {
    if (!effectiveOrderId) return;
    if (activeOrderId === effectiveOrderId) return;
    setActive(effectiveOrderId);
  }, [activeOrderId, effectiveOrderId, setActive]);

  const missing = useMemo(() => {
    const issues: string[] = [];

    if (items.length === 0) {
      issues.push(t("cart.cartEmptyTitle"));
    }

    if (items.some((item) => !item.product)) {
      issues.push("One or more cart items are missing product data");
    }

    if (!basicDetailsSchema.safeParse(state.basic).success) {
      issues.push("Basic details are incomplete");
    }

    if (!state.otpVerified) {
      issues.push("Email is not verified");
    }

    const fields = COUNTRY_ADDRESS_FIELDS[state.basic.country] ?? [];
    if (
      fields.length === 0 ||
      !buildAddressSchema(fields).safeParse(state.address).success
    ) {
      issues.push("Shipping address is incomplete");
    }

    return issues;
  }, [items, state, t]);

  const checkoutPayload = useMemo<CheckoutRequest | null>(() => {
    if (items.length === 0) return null;

    return {
      items: items
        .filter((item) => item.product)
        .map((item) => ({
          clientItemId: item.orderId,
          productSlug: item.order.productSlug,
          product: {
            slug: item.product!.slug,
            name: item.product!.name,
            pricing: item.product!.pricing,
          },
          quantity: item.order.setup.quantity,
          colorPms: item.order.setup.colorPms,
          languageCode: item.order.setup.languageCode,
          titleLines: item.order.text.titleLines,
          secondaryLines: item.order.text.secondaryLines,
          labelLines: item.order.text.labelLines,
        })),
      customer: {
        name: state.basic.name,
        email: state.basic.email,
        phone: state.basic.phone,
        country: state.basic.country,
      },
      address: state.address,
      otpVerified: state.otpVerified,
      promoCode: promoApplied ?? undefined,
    };
  }, [items, promoApplied, state]);

  const placeOrder = () => {
    if (missing.length > 0 || !checkoutPayload) return;

    if (!userId) {
      toast.error(t("cart.signInRequired"));
      return;
    }

    setSubmitted(true);

    void (async () => {
      try {
        const resp = await apiJson<CheckoutResponse>("/orders/checkout", {
          method: "POST",
          headers: { "x-user-id": userId },
          body: JSON.stringify(checkoutPayload),
        });

        setCheckout(resp);
        toast.success(t("cart.checkoutSuccess"));
      } catch (e) {
        toast.error(e instanceof Error ? e.message : t("cart.checkoutFailed"));
      } finally {
        setSubmitted(false);
      }
    })();
  };

  const applyPromo = () => {
    if (!promo.trim()) {
      toast.error(t("cart.promoRequired"));
      return;
    }

    setPromoApplied(promo.trim());
    toast.success(t("cart.promoAppliedSuccess"));
  };

  if (!effectiveOrderId && items.length === 0) {
    return (
      <section className="bg-white rounded-2xl p-6 shadow border text-center space-y-3">
        <h2 className="text-lg font-bold uppercase">
          {t("cart.cartEmptyTitle")}
        </h2>
        <p className="text-sm text-gray-500">
          {t("cart.cartEmptyDesc")}
        </p>
        <Button asChild>
          <Link to="/products">{t("cart.browseProducts")}</Link>
        </Button>
      </section>
    );
  }

  return (
    <div className="space-y-4">

      {missing.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("cart.cannotPlaceOrder")}</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-4 mt-1">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <section className="bg-white rounded-2xl p-5 shadow border space-y-3">
        <h2 className="text-lg font-bold uppercase">
          {t("cart.selectedProducts")}
        </h2>
        <CartItems effectiveActiveOrderId={effectiveOrderId ?? null} />
      </section>

      <section className="bg-white rounded-2xl p-5 shadow border space-y-2">
        <h2 className="text-lg font-bold uppercase">
          {t("cart.orderSummary")}
        </h2>

        <Row label={t("cart.customer")} value={state.basic.name} />
        <Row label={t("cart.email")} value={state.basic.email} />
        <Row label={t("cart.phone")} value={state.basic.phone} />
        <Row label={t("cart.country")} value={state.basic.country} />

        <div className="border-t pt-2 mt-2">
          <p className="text-xs font-bold uppercase mb-1">
            {t("cart.shippingAddress")}
          </p>

          {(COUNTRY_ADDRESS_FIELDS[state.basic.country] ?? []).map((f) => (
            <Row key={f} label={f} value={state.address[f] ?? ""} />
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-5 shadow border space-y-3">
        <h2 className="text-lg font-bold uppercase">
          {t("cart.promoCode")}
        </h2>

        <div className="flex gap-2">
          <input
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            placeholder={t("cart.enterPromo")}
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />

          <Button variant="outline" onClick={applyPromo}>
            {t("cart.apply")}
          </Button>
        </div>

        {promoApplied && (
          <p className="text-sm text-green-600">
            {t("cart.appliedPromo", { code: promoApplied })}
          </p>
        )}
      </section>

      <section className="bg-white rounded-2xl p-5 shadow border">
        <h2 className="text-lg font-bold uppercase mb-2">
          {t("cart.checkoutSubmission")}
        </h2>

        <p className="text-sm text-gray-500">
          {t("cart.checkoutSubmittion")}
        </p>

        <div className="mt-3 p-4 border-dashed border text-center text-sm">
          {t("cart.backendPreview")}

          {checkout?.orderIds?.length ? (
            <>
              <p className="text-xs mt-2">
                {t("cart.savedOrders")}: {checkout.orderIds.join(", ")}
              </p>
              <p className="text-xs mt-1">
                {t("cart.total")}: {(checkout.totals.total / 100).toFixed(2)}{" "}
                {checkout.totals.currency.toUpperCase()}
              </p>
            </>
          ) : null}
        </div>
      </section>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="h-4 w-4" /> {t("cart.back")}
        </Button>

        <Button
          onClick={placeOrder}
          className="flex-1 font-bold uppercase"
          disabled={missing.length > 0 || submitted || !checkoutPayload}
        >
          {submitted ? t("cart.working") : t("cart.submitOrder")}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}