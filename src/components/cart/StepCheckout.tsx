import { useEffect, useMemo, useState } from "react";

import { Link, useRouter } from "@tanstack/react-router";

import {
  ChevronLeft,
  AlertCircle,
  ShoppingCart,
  Receipt,
  MapPin,
  TicketPercent,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import { useSessionStore } from "@/hooks/useSessionStore";

import { useHnpStore } from "@/hooks/useHnpStore";

import { useTranslation } from "react-i18next";

import type { FormState } from "./types";

import {
  basicDetailsSchema,
  buildAddressSchema,
} from "./validation";

import { CartItems } from "@/components/cart/CartItem";

import type {
  CheckoutClientRequest,
  CheckoutRequest,
  CheckoutResponse,
} from "@/lib/api.types";

import {
  COUNTRY_OPTIONS,
  getCountryOption,
  getLanguageOption,
  LANGUAGE_OPTIONS,
} from "@/config/languages";

import { estimateItemTotals } from "@/components/cart/cartTotals";
import { attentionKey } from "@/lib/data";
import { apiJson } from "@/lib/api";

interface Props {
  state: FormState;

  orderId?: string;

  onBack: () => void;
}

export function StepCheckout({
  state,
  orderId,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const [submitted, setSubmitted] =
    useState(false);

  const [checkout, setCheckout] =
    useState<CheckoutResponse | null>(
      null
    );

  const [promo, setPromo] =
    useState("");

  const [promoApplied, setPromoApplied] =
    useState<string | null>(null);
    const user = useSessionStore((s) => s.user);

  const userId =  user?.id ?? null;
  const items = useHnpStore((s) => s.cart.items);
  const activeOrderId = useHnpStore((s) => s.cart.activeOrderId);
  const setActive = useHnpStore((s) => s.cart.setActive);
  const clearCart = useHnpStore((s) => s.cart.clear);
  const resetFlow = useHnpStore((s) => s.checkout.reset);

  const effectiveOrderId = orderId ?? activeOrderId;

   const selectedCountry = useMemo(() => {
      return COUNTRY_OPTIONS.find(
        (c) => c.code === state.basic.country
      );
    }, [state.basic.country]);

   const addressFields = useMemo(() => {
    return selectedCountry?.addressFormat?.fields ?? [];
  }, [selectedCountry]);
 
  useEffect(() => {
    if (!effectiveOrderId) return;

    if (
      activeOrderId ===
      effectiveOrderId
    )
      return;

    setActive(effectiveOrderId);
  }, [
    activeOrderId,
    effectiveOrderId,
    setActive,
  ]);

  const missing = useMemo(() => {
    const issues: string[] = [];

    if (items.length === 0) {
      issues.push(
        t("cart.cartEmptyTitle")
      );
    }

    if (
      !basicDetailsSchema.safeParse(
        state.basic
      ).success
    ) {
      issues.push(
        "Basic details are incomplete"
      );
    }

    if (!state.otpVerified) {
      issues.push(
        "Email is not verified"
      );
    }
    const fields = selectedCountry?.addressFormat?.fields ?? [];

    if (
      fields.length === 0 ||
      !buildAddressSchema(
        state.basic.country
      ).safeParse(state.address)
        .success
    ) {
      issues.push(
        "Shipping address is incomplete"
      );
    }

    return issues;
  }, [
    items,
    state,
    t,
    selectedCountry,
  ]);

  const checkoutPayload =
    useMemo<CheckoutClientRequest | null>(
      () => {
        if (!userId) return null;

        if (items.length === 0)
          return null;

        return {
          userId,

          items: items.map((item) => ({
            clientItemId:
              item.orderId,

            productSlug:
              item.order.productSlug,

            quantity:
              item.order.setup
                .quantity,

            colorPms:
              item.order.setup
                .colorPms,

            languageCode:
              item.order.setup
                .languageCode,

            titleLines:
              item.order.text
                .titleLines,

            secondaryLines:
              item.order.text
                .secondaryLines,

            labelLines:
              item.order.text
                .labelLines,
          })),

          customer: {
            first_name :state.basic.first_name,
            last_name :state.basic.last_name,
            email:state.basic.email,
            phone:state.basic.phone,
            country:state.basic.country,
          },
          address: state.address,
          otpVerified:state.otpVerified,
          promoCode:promoApplied ??undefined,
        };
      },
      [
        items,
        promoApplied,
        state,
        userId,
      ]
    );

  const placeOrder = () => {
    if (missing.length > 0) return;

    if (!userId) {
      toast.error(
        t("cart.signInRequired")
      );

      router.navigate({
        to: "/signin",
        search: { redirect: "/cart" },
      });

      return;
    }

    if (!checkoutPayload) return;

    setSubmitted(true);

    void (async () => {
      try {
        const itemSnapshots = items.map((it) => ({
          clientItemId: it.orderId,
          productSlug: it.order.productSlug,
          quantity: it.order.setup.quantity,
          colorPms: it.order.setup.colorPms,
          languageCode: it.order.setup.languageCode,
          titleLines: it.order.text.titleLines,
          secondaryLines: it.order.text.secondaryLines,
          labelLines: it.order.text.labelLines,
          totals: estimateItemTotals(it),
        }));

        const payload: CheckoutRequest = {
          items: itemSnapshots,
          customer: checkoutPayload.customer,
          address: checkoutPayload.address,
          otpVerified: checkoutPayload.otpVerified,
          promoCode: checkoutPayload.promoCode,
        };

        const resp = await apiJson<CheckoutResponse>("/orders/checkout", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        const checkoutId = resp?.checkoutId;
        
       if(!checkoutId){
        toast.error("Error in saving order")
       }
      toast.success("Order successfully completed");
      clearCart();
      resetFlow();
      router.navigate({ to: "/order-success", search: { orderId: checkoutId } });
      } catch (e) {
        toast.error(
          e instanceof Error
            ? e.message
            : t(
                "cart.checkoutFailed"
              )
        );
      } finally {
        setSubmitted(false);
      }
    })();
  };

  const applyPromo = () => {
    if (!promo.trim()) {
      toast.error(
        t("cart.promoRequired")
      );

      return;
    }

    setPromoApplied(
      promo.trim()
    );

    toast.success(
      t(
        "cart.promoAppliedSuccess"
      )
    );
  };

  if (
    !effectiveOrderId &&
    items.length === 0
  ) {
    return (
      <section className="space-y-4 rounded-3xl border border-lime-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-100">
          <ShoppingCart className="h-7 w-7 text-lime-700" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-black">
            {t(
              "cart.cartEmptyTitle"
            )}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {t(
              "cart.cartEmptyDesc"
            )}
          </p>
        </div>

        <Button
          asChild
          className="h-11 rounded-2xl bg-lime-500 font-black uppercase text-black hover:bg-lime-400"
        >
          <Link to="/products">
            {t(
              "cart.browseProducts"
            )}
          </Link>
        </Button>
      </section>
    );
  }

  const countryName =
    getCountryOption(
      state.basic.country
    ) || null;

  return (
    <div className="space-y-4">
      {/* ERRORS */}
      {missing.length > 0 && (
        <Alert className="rounded-2xl border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />

          <AlertTitle className="font-bold">
            {t(
              "cart.cannotPlaceOrder"
            )}
          </AlertTitle>

          <AlertDescription>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              {missing.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* PRODUCTS */}
      <section className="space-y-4 rounded-3xl border border-lime-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-lime-700" />

          <h2 className="text-xl font-black text-black">
            {t(
              "cart.selectedProducts"
            )}
          </h2>
        </div>

        <CartItems
          effectiveActiveOrderId={
            effectiveOrderId ??
            null
          }
        />
      </section>

      {/* SUMMARY */}
      <section className="space-y-4 rounded-3xl border border-lime-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-lime-700" />

          <h2 className="text-xl font-black text-black">
            {t(
              "cart.orderSummary"
            )}
          </h2>
        </div>

        <div className="grid gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <Row
            label={t(
              "cart.customer"
            )}
            value={`${state.basic.first_name} ${state.basic.last_name}`}
          />

          <Row
            label={t("cart.email")}
            value={state.basic.email}
          />

          <Row
            label={t("cart.phone")}
            value={state.basic.phone}
          />

          <Row
            label={t(
              "cart.country"
            )}
            value={
              countryName
                ? countryName.name
                : state.basic.country
            }
          />
        </div>

        {/* ADDRESS */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-lime-700" />

            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              {t(
                "cart.shippingAddress"
              )}
            </p>
          </div>

          <div className="space-y-2">
            {state.address[attentionKey]?.trim() ? (
              <Row
                label={t("cart.address.attentionOf", { defaultValue: "Attention Of" })}
                value={state.address[attentionKey] ?? ""}
              />
            ) : null}

            {addressFields.map(
              (f) => (
                <Row
                  key={f.key}
                  label={f.label}
                  value={
                    state.address[
                      f.key
                    ] ?? ""
                  }
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section className="space-y-4 rounded-3xl border border-lime-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <TicketPercent className="h-5 w-5 text-lime-700" />

          <h2 className="text-xl font-black text-black">
            {t("cart.promoCode")}
          </h2>
        </div>

        <div className="flex gap-2">
          <input
            value={promo}
            onChange={(e) =>
              setPromo(
                e.target.value
              )
            }
            placeholder={t(
              "cart.enterPromo"
            )}
            className="h-11 flex-1 rounded-2xl border border-gray-200 px-4 text-sm outline-none transition focus:border-lime-400 focus:ring-2 focus:ring-lime-200"
          />

          <Button
            variant="outline"
            onClick={applyPromo}
            className="h-11 rounded-2xl border-lime-200 font-bold hover:bg-lime-50"
          >
            {t("cart.apply")}
          </Button>
        </div>

        {promoApplied && (
          <div className="flex items-center gap-2 rounded-2xl border border-lime-200 bg-lime-50 px-3 py-2 text-sm font-medium text-lime-700">
            <CheckCircle2 className="h-4 w-4" />

            {t(
              "cart.appliedPromo",
              {
                code: promoApplied,
              }
            )}
          </div>
        )}
      </section>

      {/* CHECKOUT */}
      <section className="space-y-4 rounded-3xl border border-lime-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-lime-700" />

          <h2 className="text-xl font-black text-black">
            {t(
              "cart.checkoutSubmission"
            )}
          </h2>
        </div>

        <p className="text-sm leading-6 text-gray-500">
          {t(
            "cart.checkoutSubmittion"
          )}
        </p>

        <div className="rounded-2xl border border-dashed border-lime-200 bg-lime-50 p-4 text-sm">
          <p className="font-medium text-lime-800">
            {t(
              "cart.backendPreview"
            )}
          </p>

          {checkout?.orderIds
            ?.length ? (
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <span className="font-semibold">
                  {t(
                    "cart.savedOrders"
                  )}
                  :
                </span>{" "}
                {checkout.orderIds.join(
                  ", "
                )}
              </p>

              <p>
                <span className="font-semibold">
                  {t("cart.total")}
                  :
                </span>{" "}
                {(
                  checkout.totals
                    .total / 100
                ).toFixed(2)}{" "}
                {checkout.totals.currency.toUpperCase()}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="h-11 flex-1 rounded-2xl border-lime-200 font-bold uppercase hover:bg-lime-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />

          {t("cart.back")}
        </Button>

       <Button
        onClick={placeOrder}
        disabled={
          missing.length > 0 ||
          submitted ||
          (Boolean(userId) && !checkoutPayload) ||
          user?.role !== "USER"
        }
        className="h-11 flex-1 rounded-2xl bg-lime-500 text-sm font-black uppercase text-black hover:bg-lime-400 disabled:opacity-50"
      >
        <ArrowRight className="mr-2 h-4 w-4" />

        {submitted
          ? t("cart.working")
          : !userId
            ? "Sign in to order"
            : user?.role !== "USER"
              ? "Only users can order"
              : t("cart.submitOrder")}
      </Button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-gray-500">
        {label}
      </span>

      <span className="max-w-[60%] text-right font-semibold break-words text-black">
        {value || "—"}
      </span>
    </div>
  );
}
