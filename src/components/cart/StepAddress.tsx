import { useMemo, useState } from "react";

import {
  ChevronLeft,
  MapPin,
  Home,
  ArrowRight,
  Globe2,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { FieldRow } from "./FieldRow";

import type { FieldErrors } from "./types";

import {
  buildAddressSchema,
  zodErrorsToMap,
  getDefaultAddressValues,
} from "./validation";

import { useTranslation } from "react-i18next";

import { COUNTRY_OPTIONS } from "@/config/languages";

interface Props {
  country: string;
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

  const selectedCountry = useMemo(() => {
    return COUNTRY_OPTIONS.find(
      (c) => c.code === country
    );
  }, [country]);

  // Get address fields from the selected country's address format
  const addressFields = useMemo(() => {
    return selectedCountry?.addressFormat?.fields ?? [];
  }, [selectedCountry]);

  // Build validation schema based on country's address fields
  const schema = useMemo(
    () => buildAddressSchema(country),
    [country]
  );

  const [errors, setErrors] = useState<FieldErrors>({});

  const isValid = useMemo(
    () => schema.safeParse(value).success,
    [schema, value]
  );

  const update = (key: string, v: string) => {
    onChange({
      ...value,
      [key]: v,
    });

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

  // If no country is selected, show error state
  if (!selectedCountry) {
    return (
      <div className="space-y-4 rounded-3xl border border-red-200 bg-white p-4 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
            <MapPin className="h-4 w-4" />
            Error
          </div>
          <h2 className="text-2xl font-black tracking-tight text-black">
            No Country Selected
          </h2>
          <p className="text-sm text-gray-500">
            Please go back and select a country before entering your address.
          </p>
        </div>
        <Button
          type="button"
          onClick={onBack}
          className="h-11 w-full rounded-2xl bg-lime-500"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-4 rounded-3xl border border-lime-200 bg-white p-4 shadow-sm"
    >
      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-700">
          <MapPin className="h-4 w-4" />
          Shipping Address
        </div>

        <h2 className="text-2xl font-black tracking-tight text-black">
          {t("cart.address.title")}
        </h2>

        <p className="text-sm leading-6 text-gray-500">
          {t("cart.address.subtitle")}{" "}
          <span className="font-semibold text-black">
            {selectedCountry.name}
          </span>
        </p>
      </div>

      {/* COUNTRY CARD */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-lime-100 p-2">
            <Globe2 className="h-5 w-5 text-lime-700" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-black">
              Delivery Country
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">
                {selectedCountry.flag}
              </span>
              <span>{selectedCountry.name}</span>
              <span className="text-xs text-gray-400">
                ({selectedCountry.dialCode})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ADDRESS FIELDS */}
      <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-lime-600" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Address Details
          </h3>
        </div>

        <div className="grid gap-3">
          {/* Optional "Attention Of" field - useful for all countries */}
          <FieldRow
            id="attentionOf"
            label={t("cart.address.attentionOf", { 
              defaultValue: "Attention Of (Optional)" 
            })}
            value={value.attentionOf ?? ""}
            onChange={(e) => update("attentionOf", e.target.value)}
            error={errors.attentionOf}
            placeholder={t("cart.address.attentionPlaceholder", { 
              defaultValue: "e.g., John Smith / Mailroom" 
            })}
          />

          {/* Dynamic address fields based on selected country */}
          {addressFields.map((field) => (
            <FieldRow
              key={field.key}
              id={field.key}
              label={field.label}
              value={value[field.key] ?? ""}
              onChange={(e) => update(field.key, e.target.value)}
              error={errors[field.key]}
              required
            />
          ))}
        </div>
      </div>

     

      {/* INFO BOX */}
      <div className="rounded-2xl border border-lime-200 bg-lime-50 p-4">
        <div className="flex items-start gap-3">
          <BadgeCheck className="mt-0.5 h-5 w-5 text-lime-700" />

          <div>
            <p className="text-sm font-bold text-lime-800">
              Secure Delivery
            </p>

            <p className="mt-1 text-xs leading-5 text-lime-700">
              Please make sure your address information is correct to avoid
              shipping delays.
            </p>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 pt-1">
        {/* BACK */}
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 flex-1 rounded-2xl border-lime-200 font-bold uppercase hover:bg-lime-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>

        {/* CONTINUE */}
        <Button
          type="submit"
          size="lg"
          disabled={!isValid}
          className="h-11 flex-1 rounded-2xl bg-lime-500 text-sm font-black uppercase text-black transition-all hover:bg-lime-400 disabled:opacity-50"
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          {t("common.continue")}
        </Button>
      </div>
    </form>
  );
}