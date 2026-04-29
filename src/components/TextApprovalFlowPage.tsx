import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { useTranslation } from "react-i18next";
import { Check, Pencil } from "lucide-react";
import { NoActiveOrder } from "./NoActiveOrder";
import { StepCard } from "./StepCard";
import {toast} from "sonner"
/* ---------------- Main Page ---------------- */

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

  useEffect(() => {
    if (!order || hydrated) return;

    setDraft("title", order.text.titleLines.join("\n"));
    setDraft("secondary", order.text.secondaryLines.join("\n"));

    setHydrated(true);
  }, [order, hydrated]);

 

  if (!order) {
    return (
      <NoActiveOrder/>
        );
  }

const titleApproved = order.approvals.title;
const secondaryApproved = order.approvals.secondary && titleApproved;
const labelApproved = order.approvals.label && secondaryApproved;
const allApproved = titleApproved && secondaryApproved && labelApproved;
const finalApproved = order.approvals.allApproved;

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl space-y-6 pb-28 md:pb-6">

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-md border text-center space-y-2">
          <h1 className="text-xl font-bold">{t("order.textLockedTitle")}</h1>
          <p className="text-xs text-gray-500">{t("order.textLockedSubtitle")}</p>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase">
            <span className={titleApproved ? "text-green-500" : ""}>{t("order.title")}</span>
            <span className={secondaryApproved ? "text-green-500" : "text-gray-400"}>{t("order.secondary")}</span>
            <span className={labelApproved ? "text-green-500" : "text-gray-400"}>{t("order.label")}</span>
            <span className={allApproved ? "text-green-500" : "text-gray-400"}>{t("order.done")}</span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--neon-green)] transition-all duration-300"
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

        {/* Content */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Steps */}
	          <div className="space-y-4">
	            <StepCard
	              title={t("order.step1Title")}
	              subtitle={t("order.step1Subtitle")}
                label={t("order.label")}
                name="title"
	              value={draft.title}
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
                                label={t("order.label")}
                name="secondary"

	              value={draft.secondary}
	              rows={3}
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
              disabled={!secondaryApproved || loading}
              approved={labelApproved}
              isActive={activeStep === "label"}
              onChange={(v) => setDraft("label", v)}
              onApprove={async () => {
	                await    approveLabel();
	                setEditMode(false);
	              }}
              canEdit={editMode}

              onActivate={() => setActiveStep("label")}
            />
	          </div>

          {/* Review */}
          <section className="bg-white rounded-2xl p-6 shadow-md border space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider">
              {t("order.finalReview")}
            </h2>

            <div className="space-y-4 text-sm">
              <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-gray-400 text-xs">{t("order.title")}</p>
                <p className="font-semibold break-all whitespace-pre-wrap min-w-0">{draft.title || "—"}</p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-gray-400 text-xs">{t("order.secondary")}</p>
                <p className="break-all whitespace-pre-wrap min-w-0">{draft.secondary || "—"}</p>
              </div>

                <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-gray-400 text-xs">{t("order.label")}</p>
                <p className="break-all whitespace-pre-wrap min-w-0">{draft.label || "—"}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t p-4 flex gap-2 md:static md:border md:rounded-xl md:shadow md:p-4">
      <Button
        className="flex-1 bg-black text-white font-bold tracking-wide active:scale-95 transition flex items-center justify-center gap-2"
        disabled={!allApproved || loading}
        onClick={async () => {
          if (!finalApproved) {
            await approveAll();
            await textAllApproved(true);
          } else {
            setTimeout(()=>{
             textAllApproved(false);
            },2000)

            router.navigate({ to: "/products/$slug/proof", params: { slug } });
          }
        }}
      >
        <Check size={18} />
        {!finalApproved ? t("order.approveAllContinue") : t("order.continue")}
      </Button>
     

      <Button
        variant={editMode ? "default" : "outline"}
        className={`flex-1 font-semibold flex items-center justify-center gap-2 ${
          editMode ? "bg-[var(--neon-green)] text-black hover:opacity-90" : ""
        }`}
        onClick={() => {
          setEditMode((v) => !v);
          requestAnimationFrame( () => {
            resetApprovals();
            document
              .getElementById("title")
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        }}
      >
        <Pencil size={18} />
        {t("order.editAny")}
      </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
