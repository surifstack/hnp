import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { useTranslation } from "react-i18next";
import {
  Check,
  Pencil,
  BadgeCheck,
  FileText,
  Sparkles,
} from "lucide-react";

import { NoActiveOrder } from "./NoActiveOrder";
import { StepCard } from "./StepCard";
import { FlyerPreview } from "./FlyerPreview";
import { useOverflowStore } from "@/hooks/useOverflowStore";

export function TextApprovalFlowPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const [editMode, setEditMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const order = useOrderFlowStore((s) => s.order);
  const activeStep = useOrderFlowStore((s) => s.activeStep);
  const setActiveStep = useOrderFlowStore((s) => s.setActiveStep);
  const resetApprovals = useOrderFlowStore((s) => s.resetApprovals);
  const draft = useOrderFlowStore((s) => s.draft);
  const setDraft = useOrderFlowStore((s) => s.setDraft);

  const approveTitle = useOrderFlowStore((s) => s.approveTitle);
  const approveSecondary = useOrderFlowStore((s) => s.approveSecondary);
  const approveAll = useOrderFlowStore((s) => s.approveAll);
  const approveLabel = useOrderFlowStore((s) => s.approveLabel);
  const textAllApproved = useOrderFlowStore((s) => s.textAllApproved);

  const loading = useOrderFlowStore((s) => s.loading);
  const error = useOrderFlowStore((s) => s.error);
  const overflowMap = useOverflowStore((s) => s.overflowMap);
const hasOverflow =overflowMap?.title || overflowMap?.secondary ||overflowMap?.label;
  useEffect(() => {
  if (!order || hydrated) return;

  setDraft("title", order.text.titleLines.join("\n"));
  setDraft("secondary", order.text.secondaryLines.join("\n"));
  setDraft("label", order.text.labelLines.join("\n"));

  setHydrated(true);
}, [order, hydrated]);

  if (!order) {
    return <NoActiveOrder />;
  }

  const titleApproved = order.approvals.title;

  const secondaryApproved =
    order.approvals.secondary && titleApproved;

  const labelApproved =
    order.approvals.label && secondaryApproved;

  const allApproved =
    titleApproved && secondaryApproved && labelApproved;

  const finalApproved = order.approvals.allApproved;
  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-4 pb-28 md:pb-4 space-y-4">
        {/* HEADER */}
        <div className="rounded-3xl border border-lime-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-700">
              <BadgeCheck className="h-4 w-4" />
              Text Approval
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-black">
            {t("order.textLockedTitle")}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {t("order.textLockedSubtitle")}
          </p>

          {error && (
            <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-500">
              {error}
            </p>
          )}
        </div>

        {/* PROGRESS */}
        <div className="rounded-3xl border border-lime-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex justify-between text-[11px] font-bold uppercase tracking-wide">
            <span className={titleApproved ? "text-lime-600" : "text-gray-400"}>
              {t("order.title")}
            </span>

            <span
              className={
                secondaryApproved
                  ? "text-lime-600"
                  : "text-gray-400"
              }
            >
              {t("order.secondary")}
            </span>

            <span
              className={
                labelApproved
                  ? "text-lime-600"
                  : "text-gray-400"
              }
            >
              {t("order.label")}
            </span>

            <span
              className={
                allApproved
                  ? "text-lime-600"
                  : "text-gray-400"
              }
            >
              {t("order.done")}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-lime-500 transition-all duration-300"
              style={{
                width: `${
                  allApproved
                    ? 100
                    : secondaryApproved
                    ? 66
                    : titleApproved
                    ? 33
                    : 10
                }%`,
              }}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* LEFT */}
          <div className="space-y-3">
            <StepCard
              title={t("order.step1Title")}
              subtitle={t("order.step1Subtitle")}
              label={""}
              name="title"
              value={draft.title}
              maxChars={80}
              rows={2}
              disabled={loading}
              approved={titleApproved}
              isActive={activeStep === "title"}
              anchorId="text-step-title"
              canEdit={editMode}
              onActivate={() => setActiveStep("title")}
              onChange={(v) => setDraft("title", v)}
              onApprove={async () => {
                await approveTitle();
                setEditMode(false);
              }}
            />

            <StepCard
              title={t("order.step2Title")}
              subtitle={t("order.step2Subtitle")}
              label={""}
              name="secondary"
              value={draft.secondary}
              rows={3}
              maxChars={170}
              disabled={!titleApproved || loading}
              approved={secondaryApproved}
              isActive={activeStep === "secondary"}
              anchorId="text-step-secondary"
              canEdit={editMode}
              onActivate={() => setActiveStep("secondary")}
              onChange={(v) => setDraft("secondary", v)}
              onApprove={async () => {
                await approveSecondary();
                setEditMode(false);
              }}
            />

            <StepCard
              title={t("order.step3Title")}
              subtitle={t("order.step3Subtitle")}
              label={t("order.label")}
              name="label"
              value={draft.label}
              rows={2}
              maxChars={65}
              disabled={!secondaryApproved || loading}
              approved={labelApproved}
              isActive={activeStep === "label"}
              onChange={(v) => setDraft("label", v)}
              onApprove={async () => {
                await approveLabel();
                setEditMode(false);
              }}
              canEdit={editMode}
              onActivate={() => setActiveStep("label")}
            />
          </div>

          {/* RIGHT REVIEW */}
          <section className="space-y-4 rounded-3xl border border-lime-200 bg-white p-4 shadow-sm md:sticky md:top-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-lime-600" />

              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {t("order.finalReview")}
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  {t("order.title")}
                </p>

                <p className="whitespace-pre-wrap break-all font-semibold text-black">
                  {draft.title || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  {t("order.secondary")}
                </p>

                <p className="whitespace-pre-wrap break-all text-gray-700">
                  {draft.secondary || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
                  {t("order.label")}
                </p>

                <p className="whitespace-pre-wrap break-all text-gray-700">
                  {draft.label || "—"}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-lime-100 bg-white/95 p-3 backdrop-blur md:static md:rounded-3xl md:border md:p-4 md:shadow-sm">
          <div className="flex gap-3">
            {/* APPROVE */}
            <Button
              className="h-11 flex-1 rounded-2xl bg-lime-500 text-sm font-black uppercase text-black transition-all hover:bg-lime-400"
              disabled={!allApproved || loading || hasOverflow}
              onClick={async () => {
                if (!finalApproved) {
                  await approveAll();
                  await textAllApproved(true);
                } else {
                  setTimeout(() => {
                    textAllApproved(false);
                  }, 2000);

                  router.navigate({
                    to: "/products/$slug/proof",
                    params: { slug },
                  });
                }
              }}
            >
              <Check className="mr-2 h-4 w-4" />

              {!finalApproved
                ? t("order.approveAllContinue")
                : t("order.continue")}
            </Button>

            {/* EDIT */}
            <Button
              variant={editMode ? "default" : "outline"}
              className={`h-11 flex-1 rounded-2xl text-sm font-bold uppercase transition-all ${
                editMode
                  ? "bg-lime-500 text-black hover:bg-lime-400"
                  : "border-lime-200 hover:bg-lime-50"
              }`}
              onClick={() => {
                setEditMode((v) => !v);

                requestAnimationFrame(() => {
                  resetApprovals();

                  document
                    .getElementById("title")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                });
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />

              {t("order.editAny")}
            </Button>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          visibility: "hidden",
          height: "auto",
        }}
      >
        <FlyerPreview isOrder={false} />
      </div>
      
    </SiteLayout>
  );
}