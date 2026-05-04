import { Order, StepCardProps } from "@/lib/api.types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useOrderFlowStore } from "@/hooks/useOrderFlowStore";
import { toast } from "sonner";
import { clampVisual, getVisualLines } from "@/helpers";
import {
  Check,
  PencilLine,
  Sparkles,
  Lock,
} from "lucide-react";

export function StepCard({
  title,
  name,
  subtitle,
  maxChars,
  label,
  value,
  rows,
  disabled,
  approved,
  isActive,
  anchorId,
  canEdit,
  onActivate,
  onChange,
  onApprove,
}: StepCardProps) {
  const { t } = useTranslation();

  const setApproval = useOrderFlowStore((s) => s.setApproval);

  return (
    <section
      id={anchorId}
      onClick={canEdit ? onActivate : undefined}
      className={`rounded-3xl border p-4 transition-all duration-200 ${
        approved
          ? "border-lime-400 bg-lime-50"
          : isActive
          ? "border-lime-500 bg-white shadow-lg"
          : "border-gray-200 bg-white hover:border-lime-300 hover:shadow-sm"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-lime-600" />

            <h2 className="text-sm font-black tracking-wide text-black">
              {title}
            </h2>
          </div>

          <p className="text-xs leading-5 text-gray-500">
            {subtitle}
          </p>
        </div>

        {/* STATUS */}
        {approved ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-lime-100 px-2 py-1 text-[10px] font-bold uppercase text-lime-700">
            <Check className="h-3 w-3" />
            Approved
          </div>
        ) : disabled ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase text-gray-500">
            <Lock className="h-3 w-3" />
            Locked
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase text-gray-500">
            <PencilLine className="h-3 w-3" />
            Editing
          </div>
        )}
      </div>

      {/* LABEL */}
      {label && (
        <div className="mt-3">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-gray-400">
            {label}
          </p>
        </div>
      )}

      {/* TEXTAREA */}
      <div className="mt-2">
        <Textarea
          rows={rows}
          value={value}
        //  onPaste={(e) => e.preventDefault()}

          disabled={disabled && !canEdit}
          onChange={(e) => {
            const v = clampVisual(e.target.value,maxChars);
            setApproval(name as keyof Order["approvals"], false);

            onChange(v);
          }}
          className={`min-h-[88px] resize-none rounded-2xl border text-sm leading-6 transition-all ${
            approved
              ? "border-lime-300 bg-lime-50 focus-visible:ring-lime-500"
              : "border-gray-200 bg-white focus-visible:ring-lime-500"
          }`}
        />
      </div>

      {/* FOOTER */}
      <div className="mt-4 flex items-center justify-between">
        {/* CHARACTER INFO */}
        <p className="text-[11px] font-medium text-gray-400">
          {value.length} characters
        </p>

        {/* APPROVE BUTTON */}
        <Button
          type="button"
          disabled={
            disabled ||
            value.length === 0 ||
            approved
          }
          onClick={(e) => {
            e.stopPropagation();

            if (!approved) onApprove();
          }}
          className={`h-10 rounded-2xl px-5 text-xs font-black uppercase tracking-wide transition-all ${
            approved
              ? "bg-lime-500 text-black hover:bg-lime-500"
              : "bg-lime-500 text-black hover:bg-lime-400"
          }`}
        >
          <Check className="mr-2 h-4 w-4" />

          {approved
            ? t("order.approved", {
                defaultValue: "Approved",
              })
            : t("order.approve")}
        </Button>
      </div>
    </section>
  );
}