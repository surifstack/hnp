import { useEffect } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useTranslation } from "react-i18next";
import { useCartStore } from "@/hooks/useCartStore";
import type { Order, PmsColor } from "@/lib/api.types";

/* ---------------- FLYER PREVIEW ---------------- */

const PAGE_WIDTH_IN = 6;
const USABLE_WIDTH_IN = 5.8;
const SAFE_MARGIN_IN = 0.1;
const TOP_SAFE_OFFSET_IN = 0.2;
const BOX_GAP_IN = 0.18;
const BOX1_MAX_CHARS = 59;
const BOX2_MAX_CHARS = 158;
const DUMMY_PHONE = "(999) 999-9999";

function clampText(value: string, maxChars: number, fallback: string) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return fallback;
  return normalized.slice(0, maxChars).trim();
}

function pmsToPrintColor(pms: PmsColor | undefined) {
  if (pms === "806") return "oklch(0.7 0.32 5)";
  if (pms === "803") return "oklch(0.92 0.22 100)";
  return "oklch(0.88 0.28 130)";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getProofValues(order: Order) {
  return {
    box1Text: clampText(
      order.text.titleLines.join(" "),
      BOX1_MAX_CHARS,
      "YOUR TEXT HEADLINE HERE",
    ),
    box2Text: clampText(
      order.text.secondaryLines.join(" "),
      BOX2_MAX_CHARS,
      "Your supporting text stays centered inside the print-safe area.",
    ),
    labelText: clampText(order.text.labelLines.join(" "), 32, "YOUR TEXT"),
  };
}

function buildProofPdfHtml(order: Order) {
  const { box1Text, box2Text, labelText } = getProofValues(order);
  const labelBg = pmsToPrintColor(order.setup.colorPms);
  const labels = Array.from({ length: 24 }, () => `
    <div class="label">
      <div class="label-line1">${escapeHtml(labelText)}</div>
      <div class="label-line2">${escapeHtml(DUMMY_PHONE)}</div>
    </div>
  `).join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MININOTE Proof</title>
    <style>
      @page {
        size: 6in 8in;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        color: #000000;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      body {
        width: 6in;
      }

      .sheet {
        width: 6in;
        min-height: 8in;
        padding: ${TOP_SAFE_OFFSET_IN}in ${SAFE_MARGIN_IN}in 0.35in;
      }

      .content {
        width: ${USABLE_WIDTH_IN}in;
        margin: 0 auto;
      }

      .box1 {
        font-size: 28pt;
        line-height: 1.05;
        letter-spacing: 0.02em;
        font-weight: 800;
        text-transform: uppercase;
        text-align: center;
        overflow-wrap: break-word;
      }

      .box2 {
        margin-top: ${BOX_GAP_IN}in;
        font-size: 16pt;
        line-height: 1.25;
        text-align: center;
        overflow-wrap: break-word;
      }

      .labels {
        width: ${USABLE_WIDTH_IN}in;
        margin: 0.55in auto 0;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.08in;
      }

      .label {
        min-height: 0.6in;
        border: 1px solid #000000;
        background: ${labelBg};
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 0.08in 0.06in;
      }

      .label-line1 {
        font-size: 11px;
        line-height: 1.15;
        font-weight: 700;
        text-transform: uppercase;
      }

      .label-line2 {
        font-size: 10px;
        line-height: 1.15;
        margin-top: 2px;
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <section class="content">
        <div class="box1">${escapeHtml(box1Text)}</div>
        <div class="box2">${escapeHtml(box2Text)}</div>
      </section>
      <section class="labels">${labels}</section>
    </main>
  </body>
</html>`;
}

function exportProofPdf(order: Order) {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=900");
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(buildProofPdfHtml(order));
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

function FlyerPreview({ order }: { order: Order }) {
  const { box1Text, box2Text, labelText } = getProofValues(order);

  return (
    <div className="flex justify-center">
      <div className="w-full overflow-x-auto rounded-xl border bg-neutral-100 p-4">
        <div
          className="mx-auto bg-white shadow-sm"
          style={{
            width: `${PAGE_WIDTH_IN}in`,
            minHeight: "8in",
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
              className="text-center font-extrabold uppercase text-black"
              style={{
                fontSize: "28pt",
                lineHeight: 1.05,
                letterSpacing: "0.02em",
                overflowWrap: "break-word",
              }}
            >
              {box1Text}
            </div>

            <div
              className="text-center text-black"
              style={{
                fontSize: "16pt",
                lineHeight: 1.25,
                overflowWrap: "break-word",
              }}
            >
              {box2Text}
            </div>
          </div>

          <div className="mx-auto mt-8 grid grid-cols-4 gap-2" style={{ width: `${USABLE_WIDTH_IN}in` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="flex min-h-[58px] flex-col items-center justify-center border border-black bg-green-500 px-2 py-2 text-center text-black"
              >
                <p className="text-[11px] font-semibold uppercase leading-tight">{labelText}</p>
                <p className="text-[10px] leading-tight">{DUMMY_PHONE}</p>
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
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2
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

          {/* <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => exportProofPdf(order)}
          >
            Export PDF
          </Button> */}

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
