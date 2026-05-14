import { useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useHnpStore } from "@/hooks/useHnpStore";
import { useSessionStore } from "@/hooks/useSessionStore";
import { NoActiveOrder } from "./NoActiveOrder";
import { Pencil, RotateCcw, ShoppingCart } from "lucide-react";
import { FlyerPreview } from "./FlyerPreview";
import { SignIn } from "./SignIn";


/* ---------------- MAIN PAGE ---------------- */

export function ProofPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const order = useHnpStore((s) => s.order.order);
  const product = useHnpStore((s) => s.order.product);
  const reset = useHnpStore((s) => s.order.reset);
  const addOrder = useHnpStore((s) => s.cart.addOrder);
  const resetApprovals = useHnpStore((s) => s.order.resetApprovals);
  const user = useSessionStore((s) => s.user);
  const sessionStatus = useSessionStore((s) => s.status);

  const loading = useHnpStore((s) => s.order.loading);

  if (!order) {
    return <NoActiveOrder />;
  }

  // Avoid redirecting during initial session rehydration (prevents 1-2s flicker/collapse).
  // Only decide after the session status is "ready".
  if (sessionStatus !== "ready") {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-5xl space-y-4 pb-28 md:pb-6">
          <section className="text-sm text-gray-500 text-center py-10">
            {t("common.loading", { defaultValue: "Loading..." })}
          </section>
        </div>
      </SiteLayout>
    );
  }

  if (!user?.id) {
    return <SignIn search={{ redirect: `/products/${slug}/proof` }} />;
  }

  if (user.role !== "USER") {
    // Logged in as employee/admin; send them to their correct area.
    void router.navigate({ to: user.role === "EMPLOYEE" ? "/employee" : "/admin" });
    return null;
  }

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-5xl space-y-4 pb-28 md:pb-6">
        <section>
          {loading ? (
            <div className="text-sm text-gray-500 text-center py-10">
              {t("proof.generatingPreview")}
            </div>
          ) : (
            <FlyerPreview isOrder={true} />
          )}
        </section>

          <div
          className="fixed bottom-0 left-0 right-0 border-t border-lime-100 bg-white/95 p-3 backdrop-blur
          md:static md:rounded-3xl md:border md:p-4 md:shadow-sm"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* APPROVE */}
            <Button
              size="lg"
              className="h-11 rounded-2xl bg-[var(--neon-green)] text-sm font-black uppercase text-black transition-all hover:bg-lime-400"
              onClick={() => {
                addOrder(order, product);
                router.navigate({
                  to: "/cart",
                  search: { orderId: "" },
                });
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />

              {user?.id ? t("proof.approveAndOrder") : "Sign in to order"}
            </Button>

            {/* EDIT */}
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-2xl border-lime-200 text-sm font-bold uppercase hover:bg-lime-50"
              onClick={() => {
                resetApprovals();

                router.navigate({
                  to: "/products/$slug/order/text",
                  params: { slug },
                });
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />

              {t("proof.makeChanges")}
            </Button>

            {/* RESET */}
            {/* <Button
              size="lg"
              variant="ghost"
              className="h-11 rounded-2xl text-sm font-bold uppercase text-gray-500 hover:bg-gray-100"
              onClick={() => {
                reset();

                router.navigate({
                  to: "/products/$slug",
                  params: { slug },
                });
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />

              {t("proof.enterAnotherOrder")}
            </Button> */}
          </div>
        </div>
        </div>
    </SiteLayout>
  );
}
