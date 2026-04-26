import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { useTranslation } from "react-i18next";

/* ---------------- helpers ---------------- */

function splitLines(text: string, maxLines: number) {
  return text.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, maxLines);
}

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/* ---------------- Step Card ---------------- */

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
      className={`rounded-2xl p-5 space-y-4 border transition-all duration-200 ${
        approved
          ? "border-green-500 bg-green-50"
          : disabled
          ? "border-gray-200 bg-gray-50 opacity-60"
          : isActive
          ? "border-black bg-white shadow-lg scale-[1.01]"
          : "border-gray-200 bg-white hover:shadow-sm"
      }`}
    >
      <div className="space-y-1">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>

      {textareaDisabled && !approved && value.trim().length === 0 ? (
        <div className="rounded-md border bg-gray-100 px-3 py-2 text-sm text-gray-500">
          Locked
        </div>
      ) : (
        <Textarea
          rows={rows}
          value={value}
          disabled={textareaDisabled}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[var(--neon-green)] focus:border-black transition text-sm"
          placeholder="Type your text…"
        />
      )}

      <div className="flex gap-2">
        {!approved ? (
          <Button
            type="button"
            disabled={disabled || value.trim().length === 0}
            onClick={onApprove}
            className="bg-[var(--neon-green)] text-black font-bold tracking-wide hover:opacity-90"
          >
            {t("order.approve")}
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={onEdit}
            className="text-gray-600 hover:text-black"
          >
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

/* ---------------- Main Page ---------------- */

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
  }, [draft, order, setDraft]);

  if (!order) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-xl bg-white rounded-xl p-6 shadow border text-center space-y-3">
          <h1 className="text-xl font-semibold">No active order</h1>
          <Button
            onClick={() =>
              router.navigate({ to: "/products/$slug/order", params: { slug } })
            }
          >
            Go to setup
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const titleApproved = order.approvals.title;
  const secondaryApproved = order.approvals.secondary && titleApproved;
  const labelApproved = order.approvals.label && secondaryApproved;
  const allApproved = titleApproved && secondaryApproved && labelApproved;

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
            <span className={titleApproved ? "text-green-500" : ""}>Title</span>
            <span className={secondaryApproved ? "text-green-500" : "text-gray-400"}>Secondary</span>
            <span className={labelApproved ? "text-green-500" : "text-gray-400"}>Label</span>
            <span className={allApproved ? "text-green-500" : "text-gray-400"}>Done</span>
          </div>

          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--neon-green)] transition-all duration-300"
              style={{
                width: `${
                  allApproved
                    ? 100
                    : labelApproved
                    ? 75
                    : secondaryApproved
                    ? 50
                    : titleApproved
                    ? 25
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
              value={draft.title}
              rows={2}
              disabled={loading}
              approved={titleApproved}
              isActive={activeStep === "title"}
              onChange={(v) => setDraft("title", v)}
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
              isActive={activeStep === "secondary"}
              onChange={(v) => setDraft("secondary", v)}
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
              isActive={activeStep === "label"}
              onChange={(v) => setDraft("label", v)}
              onApprove={approveLabel}
              onEdit={() => setActiveStep("label")}
            />
          </div>

          {/* Review */}
          <section className="bg-white rounded-2xl p-6 shadow-md border space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider">
              {t("order.finalReview")}
            </h2>

            <div className="space-y-4 text-sm">
              <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-gray-400 text-xs">Title</p>
                <p className="font-semibold">{draft.title || "—"}</p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-gray-400 text-xs">Secondary</p>
                <p>{draft.secondary || "—"}</p>
              </div>

              <div className="p-3 rounded-lg bg-gray-50">
                <p className="text-gray-400 text-xs">Label</p>
                <p>{draft.label || "—"}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t p-4 flex gap-2 md:static md:border md:rounded-xl md:shadow md:p-4">

          <Button
            className="flex-1 bg-black text-white font-bold tracking-wide active:scale-95 transition"
            disabled={!allApproved || loading}
            onClick={async () => {
              await approveAll();
              router.navigate({ to: "/products/$slug/proof", params: { slug } });
            }}
          >
            {t("order.approveAllContinue")}
          </Button>

          <Button
            variant="outline"
            className="flex-1 font-semibold"
            onClick={() => setActiveStep("title")}
          >
            {t("order.editAny")}
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
