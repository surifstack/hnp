import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldRow } from "./FieldRow";
import type { FieldErrors } from "./types";
import { COUNTRY_ADDRESS_FIELDS } from "./types";
import { buildAddressSchema, zodErrorsToMap } from "./validation";

interface Props {
  country: string;
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepAddress({ country, value, onChange, onBack, onNext }: Props) {
  const fields = useMemo(() => COUNTRY_ADDRESS_FIELDS[country] ?? [], [country]);
  const schema = useMemo(() => buildAddressSchema(fields), [fields]);
  const [errors, setErrors] = useState<FieldErrors>({});

  const isValid = useMemo(() => schema.safeParse(value).success, [schema, value]);

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
      <h2 className="text-lg font-extrabold uppercase tracking-wide">Shipping address</h2>
      <p className="text-xs text-muted-foreground">
        Address format for <strong>{country}</strong>
      </p>

      {fields.map((f) => (
        <FieldRow
          key={f}
          id={f}
          label={f}
          value={value[f] ?? ""}
          onChange={(e) => update(f, e.target.value)}
          error={errors[f]}
        />
      ))}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={!isValid}
          className="flex-1 text-base font-bold uppercase"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
