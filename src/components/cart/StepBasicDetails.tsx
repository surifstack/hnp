import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldRow } from "./FieldRow";
import type { BasicDetails, FieldErrors } from "./types";
import { COUNTRIES } from "./types";
import { basicDetailsSchema, zodErrorsToMap } from "./validation";

interface Props {
  value: BasicDetails;
  onChange: (next: BasicDetails) => void;
  onNext: () => void;
}

export function StepBasicDetails({ value, onChange, onNext }: Props) {
  const [errors, setErrors] = useState<FieldErrors>({});

  const isValid = useMemo(() => basicDetailsSchema.safeParse(value).success, [value]);

  const update = <K extends keyof BasicDetails>(key: K, v: BasicDetails[K]) => {
    onChange({ ...value, [key]: v });
    if (errors[key as string]) {
      setErrors((prev) => {
        const { [key as string]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = basicDetailsSchema.safeParse(value);
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
      <h2 className="text-lg font-extrabold uppercase tracking-wide">Basic details</h2>

      <FieldRow
        id="name"
        label="Name"
        value={value.name}
        onChange={(e) => update("name", e.target.value)}
        error={errors.name}
        autoComplete="name"
      />
      <FieldRow
        id="email"
        label="Email"
        type="email"
        value={value.email}
        onChange={(e) => update("email", e.target.value)}
        error={errors.email}
        autoComplete="email"
      />
      <FieldRow
        id="phone"
        label="Phone number"
        inputMode="numeric"
        value={value.phone}
        onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
        error={errors.phone}
        autoComplete="tel"
        maxLength={15}
      />

      <div className="space-y-1.5">
        <Label>Country</Label>
        <Select value={value.country} onValueChange={(v) => update("country", v)}>
          <SelectTrigger
            aria-invalid={!!errors.country}
            className={errors.country ? "border-destructive ring-1 ring-destructive" : ""}
          >
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.country && (
          <p role="alert" className="text-xs font-medium text-destructive">
            {errors.country}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={!isValid}
        className="w-full text-base font-bold uppercase mt-2"
      >
        Continue
      </Button>
    </form>
  );
}
