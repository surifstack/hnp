import { StepCardProps } from "@/lib/api.types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
export function StepCard({
  title,
  subtitle,
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
  const textareaDisabled = disabled || (approved && !(canEdit && isActive));

  return (
    <section
      id={anchorId}
      onClick={canEdit ? onActivate : undefined}
      className={`rounded-2xl p-5 space-y-4 border transition-all duration-200 border-black bg-white shadow-lg scale-[1.01] cursor-pointer ${
        approved
          ? "border-green-500 bg-green-50"
          : disabled
          ? "border-gray-200 bg-gray-50 opacity-60"
          : isActive
          ? "border-black bg-white shadow-lg scale-[1.01]"
          : "border-gray-200 bg-white hover:shadow-sm"
      } ${canEdit ? "cursor-pointer" : ""}`}
    >
      <div className="space-y-1">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>

     
        <Textarea
          rows={rows}
          value={value}
          disabled={textareaDisabled}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg border-gray-300 focus:ring-2 focus:ring-[var(--neon-green)] focus:border-black transition text-sm"
          placeholder="Type your text…"
        />
      

      <div className="flex gap-2">
        <Button
          type="button"
          disabled={disabled || value.trim().length === 0 || approved}
          onClick={(e) => {
            e.stopPropagation();
            if (!approved) onApprove();
          }}
          className={`font-bold tracking-wide ${
            approved
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-[var(--neon-green)] text-black hover:opacity-90"
          }`}
        >
          {approved ? t("order.approved", { defaultValue: "Approved" }) : t("order.approve")}
        </Button>
      </div>
    </section>
  );
}