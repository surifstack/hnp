import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldRow } from "./FieldRow";
import type { FieldErrors } from "./types";
import { buildAddressSchema, zodErrorsToMap } from "./validation";
import { useTranslation } from "react-i18next";
import { LANGUAGE_OPTIONS } from "@/config/languages";

interface Props {
  country: string; // ✅ this is language, not country
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepAddress({
  country,
  value,
  onChange,
  onBack,
  onNext,
}: Props) {
  const { t } = useTranslation();

  const selectedLanguage = useMemo(() => {
    return LANGUAGE_OPTIONS.find((l) => l.value === country);
  }, [country]);

  // ✅ get fields from language option
  const fields = selectedLanguage?.addressFields ?? [];

  const schema = useMemo(() => buildAddressSchema(fields), [fields]);
  const [errors, setErrors] = useState<FieldErrors>({});

  const isValid = useMemo(
    () => schema.safeParse(value).success,
    [schema, value]
  );

  const update = (key: string, v: string) => {
    onChange({ ...value, [key]: v });

    if (errors[key]) {
      setErrors((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse(value);

    if (!result.success) {
      setErrors(zodErrorsToMap(result.error));
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="bg-white/95 rounded-2xl p-5 shadow-xl border-2 border-black space-y-3"
    >
      <h2 className="text-lg font-extrabold uppercase tracking-wide">
        {t("cart.address.title")}
      </h2>

      <p className="text-xs text-muted-foreground">
        {t("cart.address.subtitle")}{" "}
        <strong>{selectedLanguage?.name}</strong>
      </p>

      {/* ✅ dynamic fields from language */}
      {fields.map((f) => (
        <FieldRow
          key={f.key}
          id={f.key}
          label={f.label}
          value={value[f.key] ?? ""}
          onChange={(e) => update(f.key, e.target.value)}
          error={errors[f.key]}
        />
      ))}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="h-4 w-4" /> {t("common.back")}
        </Button>

        <Button
          type="submit"
          size="lg"
          disabled={!isValid}
          className="flex-1 text-base font-bold uppercase"
        >
          {t("common.continue")}
        </Button>
      </div>
    </form>
  );
}