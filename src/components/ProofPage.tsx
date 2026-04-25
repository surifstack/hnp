import { useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@/hooks/useCartStore";
import type { Order } from "@/lib/api.types";

/* ---------------- FLYER PREVIEW ---------------- */

function FlyerPreview({ order }: { order: Order }) {
  const title = order.text.titleLines.join(" ");
  const secondary = order.text.secondaryLines.join(" ");
  const tearTabLines = (order.text.labelLines ?? [])
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 2);
  const tearTabLine1 = tearTabLines[0] ?? "";
  const tearTabLine2 = tearTabLines[1] ?? "";

  return (
    <div className="flex justify-center">
      <div className="bg-white shadow border rounded-md w-full max-w-[850px] aspect-[8.5/11] p-10">

        {/* TOP TEXT */}
        <div className="text-center space-y-4">
          <h1 className="text-[36px] font-extrabold tracking-wide text-gray-500 leading-tight uppercase">
            {title || "SEEKING COOL ROOMMATE WHO STUDIES HARD AND PLAYS HARD!!!"}
          </h1>

          <p className="text-[24px] text-gray-700 leading-snug max-w-[85%] mx-auto uppercase">
            {secondary ||
              "THIRD YEAR FEMALE LOOKING FOR ENERGETIC FEMALE COUNTERPART TO SHARE 1 BEDROOM FLAT OFF CAMPUS NO DEPOSIT REQUIRED, 1st MONTH RENT MOVES YOU IN"}
          </p>

        </div>

        {/* TEAR TABS */}
        <div className="grid grid-cols-4 gap-3 mt-8">
          {Array.from({ length: 52 }).map((_, i) => (
            <div
              key={i}
              className="bg-green-500 text-black text-[12px] leading-tight text-center py-3 px-2 border border-black rounded-sm"
            >
              <p>{tearTabLine1}</p>
              <p>{tearTabLine2}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export function ProofPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const userId = useSessionStore((s) => s.userId);
  const order = useOrderFlowStore((s) => s.order);
  const fetchProofSvg = useOrderFlowStore((s) => s.fetchProofSvg);
  const reset = useOrderFlowStore((s) => s.reset);
  const addOrder = useCartStore((s) => s.addOrder);

  const loading = useOrderFlowStore((s) => s.loading);
  const error = useOrderFlowStore((s) => s.error);

  useEffect(() => {
    if (!userId) return;
    void fetchProofSvg({ userId });
  }, [fetchProofSvg, userId, order?.id, order?.updatedAt]);

  /* ---------------- NO ORDER ---------------- */
  if (!order) {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-xl bg-white rounded-xl p-6 shadow border text-center space-y-3">
          <h1 className="text-xl font-semibold">No active order</h1>
          <Button
            onClick={() =>
              router.navigate({
                to: "/products/$slug",
                params: { slug },
              })
            }
          >
            Back to product
          </Button>
        </div>
      </SiteLayout>
    );
  }

  /* ---------------- NOT LOGGED IN ---------------- */
  if (!userId) {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-xl bg-white rounded-xl p-6 shadow border text-center space-y-4">
          <h1 className="text-lg font-semibold">
            {t("proof.createAccount")}
          </h1>

          <p className="text-sm text-gray-500">
            {t("proof.createAccountToView")}
          </p>

          <div className="space-y-2">
            <Button asChild size="lg" className="w-full bg-black text-white">
              <Link
                to="/create-account"
                search={{ redirect: `/products/${slug}/proof` }}
              >
                {t("proof.createAccount")}
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="w-full">
              <Link
                to="/signin"
                search={{ redirect: `/products/${slug}/proof` }}
              >
                {t("common.signIn")}
              </Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-5xl space-y-4 pb-28 md:pb-6">

       

        {/* ONLY PREVIEW */}
        <section >
        

          {loading ? (
            <div className="text-sm text-gray-500 text-center py-10">
              Generating preview…
            </div>
          ) : (
            <FlyerPreview order={order} />
          )}

         
        </section>

        {/* ACTIONS */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2
          md:static md:border md:rounded-xl md:shadow md:p-4"
        >
          <Button asChild size="lg" className="w-full bg-black text-white">
            <Link
              to="/cart"
              onClick={() => {
                void addOrder(order);
              }}
            >
              {t("proof.approveAndOrder") || "Approve & Order"}
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() =>
              router.navigate({
                to: "/products/$slug/order/text",
                params: { slug },
              })
            }
          >
            {t("common.makeChanges")}
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="w-full text-gray-500"
            onClick={() => {
              reset();
              router.navigate({
                to: "/products/$slug",
                params: { slug },
              });
            }}
          >
            {t("common.enterAnotherOrder")}
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
