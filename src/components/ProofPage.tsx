import { Link, useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@/hooks/useCartStore";
import type { Order } from "@/lib/api.types";
import { NoActiveOrder } from "./NoActiveOrder";
import { buildQuantityConfig, getFieldValue, getSwatchByPms } from "@/lib/data";
import { Pencil, RotateCcw, ShoppingCart } from "lucide-react";

/* ---------------- FLYER PREVIEW ---------------- */

const SAFE_MARGIN_IN = 0.1;
const TOP_SAFE_OFFSET_IN = 0.2;
const BOX_GAP_IN = 0.18;


function getProofValues(order: Order) {
  return {
    box1Text: order.text.titleLines,
    box2Text: order.text.secondaryLines,
    labelText: order.text.labelLines
  };
}

function FlyerPreview({
  order,
  pageWidth,
  pageHeight,
  labelQty,
}: {
  order: Order;
  pageWidth: number;
  pageHeight: number;
  labelQty: number;
}) {
  const { box1Text, box2Text, labelText } = getProofValues(order);
  const bgClass = getSwatchByPms(order.setup.colorPms).swatch;

  const USABLE_WIDTH_IN = Math.max(pageWidth - 0.2, 0);

  return (
    <div className="flex justify-center">
      <div className="w-full overflow-x-auto rounded-xl border bg-neutral-100 p-4">
        <div
          className="mx-auto shadow-sm"
          style={{
            backgroundColor: bgClass,
            width: `${pageWidth}in`,
            minHeight: `${pageHeight}in`,
            paddingLeft: `${SAFE_MARGIN_IN}in`,
            paddingRight: `${SAFE_MARGIN_IN}in`,
            paddingTop: `${TOP_SAFE_OFFSET_IN}in`,
            paddingBottom: "0.35in",
            boxSizing: "border-box",
          }}
        >
          <div
            className="mx-auto flex flex-col"
            style={{
              width: `${USABLE_WIDTH_IN}in`,
              maxWidth: `${USABLE_WIDTH_IN}in`,
              gap: `${BOX_GAP_IN}in`,
            }}
          >
            <div
              className="text-center font-extrabold uppercase text-gray"
              style={{
                fontSize: "26pt",
                lineHeight: 1.05,
                letterSpacing: "0.02em",
                overflowWrap: "break-word",
                width: "70%", // 👈 IMPORTANT: 70% screen width rule
                margin: "0 auto",
              }}
            >
              {box1Text}
            </div>
            <div
              className="text-center text-black"
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "16pt",
                lineHeight: 1.25,
                overflowWrap: "break-word",
              }}
            >
              {box2Text}
            </div>
          </div>

          <div
            className="mx-auto mt-8 grid grid-cols-4 gap-2 gap-y-0"
            style={{ width: `${USABLE_WIDTH_IN}in` }}
          >
            {Array.from({ length: labelQty }).map((_, i) => (
              <div
                key={i}
                className="flex min-h-[58px] flex-col items-center justify-center border border-black p-1 text-center text-black"
              >
                <p className="text-[11px] text-gray-700 leading-tight">
                  {labelText}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- MAIN PAGE ---------------- */

export function ProofPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const order = useOrderFlowStore((s) => s.order);
  const product = useOrderFlowStore((s) => s.product);
  const reset = useOrderFlowStore((s) => s.reset);
  const addOrder = useCartStore((s) => s.addOrder);
  const resetApprovals = useOrderFlowStore((s) => s.resetApprovals);

  const documentation = product?.documentation;
  const specs = documentation?.specs ?? [];

  const {labelsQty} = buildQuantityConfig(specs ?? []);
  

  const PAGE_HEIGHT_IN = getFieldValue(specs, "height_in", 8.5) as number;
  const PAGE_WIDTH_IN = getFieldValue(specs, "width_in", 6) as number;

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
            <FlyerPreview
              order={order}
              pageWidth={PAGE_WIDTH_IN}
              pageHeight={PAGE_HEIGHT_IN}
              labelQty={labelsQty}
            />
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
              className="h-11 rounded-2xl bg-lime-500 text-sm font-black uppercase text-black transition-all hover:bg-lime-400"
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