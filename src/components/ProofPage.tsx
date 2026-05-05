import { Link, useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@/hooks/useCartStore";
import { NoActiveOrder } from "./NoActiveOrder";
import { Pencil, RotateCcw, ShoppingCart } from "lucide-react";
import { FlyerPreview } from "./FlyerPreview";


/* ---------------- MAIN PAGE ---------------- */

export function ProofPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const order = useOrderFlowStore((s) => s.order);
  const product = useOrderFlowStore((s) => s.product);
  const reset = useOrderFlowStore((s) => s.reset);
  const addOrder = useCartStore((s) => s.addOrder);
  const resetApprovals = useOrderFlowStore((s) => s.resetApprovals);

  const loading = useOrderFlowStore((s) => s.loading);

  if (!order) {
    return <NoActiveOrder />;
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
              asChild
              size="lg"
              className="h-11 rounded-2xl bg-[var(--neon-green)] text-sm font-black uppercase text-black transition-all hover:bg-lime-400"
            >
              <Link
                to="/cart"
                search={{ orderId: "" }}
                onClick={() => {
                  addOrder(order, product);
                }}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />

                {t("proof.approveAndOrder")}
              </Link>
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
            <Button
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
            </Button>
          </div>
        </div>
        </div>
    </SiteLayout>
  );
}