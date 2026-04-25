import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { useTranslation } from "react-i18next";

function splitLines(text: string, maxLines: number) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, maxLines);
}

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function StepCard({
  title,
  subtitle,
  value,
  rows,
  disabled,
  approved,
  isActive,
  onChange,
  onApprove,
  onEdit,
}: StepCardProps) {
  const { t } = useTranslation();
  const textareaDisabled = disabled || (approved && !isActive);

  return (
    <section
      className={`rounded-xl p-5 space-y-4 border transition-all duration-200 ${
        approved
          ? "border-green-500 bg-green-50"
        : disabled
            ? "border-gray-200 bg-gray-50 opacity-70"
            : isActive
              ? "border-black bg-white shadow-md"
              : "border-gray-200 bg-white"
      }`}
    >
      <div className="space-y-1">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>

      {textareaDisabled && !approved && value.trim().length === 0 ? (
        <div className="rounded-md border bg-gray-100 px-3 py-2 text-sm text-gray-500">Locked</div>
      ) : (
        <Textarea
          rows={rows}
          value={value}
          disabled={textareaDisabled}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-md border-gray-300 focus:ring-2 focus:ring-black/20 focus:border-black transition"
          placeholder="Type your text…"
        />
      )}

      <div className="flex gap-2">
        {!approved ? (
          <Button
            type="button"
            disabled={disabled || value.trim().length === 0}
            onClick={onApprove}
            className="bg-black text-white hover:bg-black/90 font-semibold"
          >
            {t("order.approve")}
          </Button>
        ) : (
          <Button type="button" variant="ghost" onClick={onEdit} className="text-gray-600">
            {t("order.edit")}
          </Button>
        )}
      </div>
    </section>
  );
}

type StepCardProps = {
  title: string;
  subtitle: string;
  value: string;
  rows: number;
  disabled: boolean;
  approved: boolean;
  isActive: boolean;
  onChange: (next: string) => void;
  onApprove: () => void;
  onEdit: () => void;
};

export function TextApprovalFlowPage({ slug }: { slug: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const order = useOrderFlowStore((s) => s.order);
  const activeStep = useOrderFlowStore((s) => s.activeStep);
  const setActiveStep = useOrderFlowStore((s) => s.setActiveStep);

  const draft = useOrderFlowStore((s) => s.draft);
  const setDraft = useOrderFlowStore((s) => s.setDraft);

  const approveTitle = useOrderFlowStore((s) => s.approveTitle);
  const approveSecondary = useOrderFlowStore((s) => s.approveSecondary);
  const approveLabel = useOrderFlowStore((s) => s.approveLabel);
  const approveAll = useOrderFlowStore((s) => s.approveAll);

  const loading = useOrderFlowStore((s) => s.loading);
  const error = useOrderFlowStore((s) => s.error);

  useEffect(() => {
    if (!order) return;

    if (!draft.title && order.text.titleLines.length) {
      setDraft("title", order.text.titleLines.join("\n"));
    }
    if (!draft.secondary && order.text.secondaryLines.length) {
      setDraft("secondary", order.text.secondaryLines.join("\n"));
    }
    if (!draft.label && order.text.labelLines.length) {
      setDraft("label", order.text.labelLines.join("\n"));
    }
  }, [draft.label, draft.secondary, draft.title, order, setDraft]);

  if (!order) {
    return (
      <SiteLayout>
        <div className="mx-auto w-full max-w-xl bg-white rounded-xl p-6 shadow border text-center space-y-3">
          <h1 className="text-xl font-semibold">No active order</h1>
          <Button
            onClick={() => router.navigate({ to: "/products/$slug/order", params: { slug } })}
          >
            Go to setup
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const titleUpToDate = arraysEqual(splitLines(draft.title, 2), order.text.titleLines);
  const secondaryUpToDate = arraysEqual(splitLines(draft.secondary, 3), order.text.secondaryLines);
  const labelUpToDate = arraysEqual(splitLines(draft.label, 2), order.text.labelLines);

  const titleApproved = order.approvals.title && titleUpToDate;
  const secondaryApproved = order.approvals.secondary && secondaryUpToDate && titleApproved;
  const labelApproved = order.approvals.label && labelUpToDate && secondaryApproved;
  const allApproved = titleApproved && secondaryApproved && labelApproved;

  const effectiveStep = allApproved && activeStep === "review" ? "review" : activeStep;

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-6xl space-y-4 pb-28 md:pb-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow border text-center space-y-2">
          <h1 className="text-xl font-semibold">{t("order.textLockedTitle")}</h1>
          <p className="text-xs text-gray-500">{t("order.textLockedSubtitle")}</p>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between text-xs font-semibold uppercase">
          <span className={titleApproved ? "text-green-600" : ""}>1</span>
          <span className={secondaryApproved ? "text-green-600" : "text-gray-400"}>2</span>
          <span className={labelApproved ? "text-green-600" : "text-gray-400"}>3</span>
          <span className={allApproved ? "text-green-600" : "text-gray-400"}>4</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <div className="space-y-4">
            {/* Steps */}
            <StepCard
              title={t("order.step1Title")}
              subtitle={t("order.step1Subtitle")}
              value={draft.title}
              rows={2}
              disabled={loading}
              approved={titleApproved}
              isActive={effectiveStep === "title"}
              onChange={(v: string) => setDraft("title", v)}
              onApprove={approveTitle}
              onEdit={() => setActiveStep("title")}
            />

            <StepCard
              title={t("order.step2Title")}
              subtitle={t("order.step2Subtitle")}
              value={draft.secondary}
              rows={3}
              disabled={!titleApproved || loading}
              approved={secondaryApproved}
              isActive={effectiveStep === "secondary"}
              onChange={(v: string) => setDraft("secondary", v)}
              onApprove={approveSecondary}
              onEdit={() => setActiveStep("secondary")}
            />

            <StepCard
              title={t("order.step3Title")}
              subtitle={t("order.step3Subtitle")}
              value={draft.label}
              rows={2}
              disabled={!secondaryApproved || loading}
              approved={labelApproved}
              isActive={effectiveStep === "label"}
              onChange={(v: string) => setDraft("label", v)}
              onApprove={approveLabel}
              onEdit={() => setActiveStep("label")}
            />
          </div>

          <div className="space-y-4">
            {/* Review */}
            <section className="bg-white rounded-xl p-6 shadow border space-y-4">
              <h2 className="text-sm font-semibold uppercase">{t("order.finalReview")}</h2>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Title</p>
                  <p className="font-semibold">{draft.title || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Secondary</p>
                  <p>{draft.secondary || "—"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Label</p>
                  <p>{draft.label || "—"}</p>
                </div>
              </div>
            </section>

           
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-2 md:static md:border md:rounded-xl md:shadow md:p-4">
          <Button
            className="flex-1 bg-black text-white"
            disabled={!allApproved || loading}
            onClick={async () => {
              await approveAll();
              router.navigate({ to: "/products/$slug/proof", params: { slug } });
            }}
          >
            {t("order.approveAllContinue")}
          </Button>

          <Button variant="outline" className="flex-1" onClick={() => setActiveStep("title")}>
            {t("order.editAny")}
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
