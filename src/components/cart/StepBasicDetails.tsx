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

import type {
  BasicDetails,
  FieldErrors,
} from "./types";

import {
  basicDetailsSchema,
  zodErrorsToMap,
} from "./validation";

import { useTranslation } from "react-i18next";

import { COUNTRY_OPTIONS } from "@/config/languages";

import {
  ArrowRight,
  Globe2,
  Mail,
  Phone,
  User2,
  BadgeCheck,
} from "lucide-react";

interface Props {
  value: BasicDetails;
  onChange: (next: BasicDetails) => void;
  onNext: () => void;
}

export function StepBasicDetails({
  value,
  onChange,
  onNext,
}: Props) {
  const { t } = useTranslation();

  const [errors, setErrors] =
    useState<FieldErrors>({});

  const isValid = useMemo(
    () => basicDetailsSchema.safeParse(value).success,
    [value]
  );

  const update = <
    K extends keyof BasicDetails
  >(
    key: K,
    v: BasicDetails[K]
  ) => {
    onChange({
      ...value,
      [key]: v,
    });

    if (errors[key as string]) {
      setErrors((prev) => {
        const {
          [key as string]: _,
          ...rest
        } = prev;

        return rest;
      });
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const result =
      basicDetailsSchema.safeParse(value);

    if (!result.success) {
      setErrors(
        zodErrorsToMap(result.error)
      );

      return;
    }

    setErrors({});

    onNext();
  };

  // Get selected country details to show preview
  const selectedCountry = COUNTRY_OPTIONS.find(
    (c) => c.code === value.country
  );

  return (
    <form
      onSubmit={submit}
      noValidate
      className="space-y-4 rounded-3xl border border-lime-200 bg-white p-4 shadow-sm"
    >
      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-700">
          <BadgeCheck className="h-4 w-4" />
          Basic Details
        </div>

        <h2 className="text-2xl font-black tracking-tight text-black">
          {t("cart.basicDetailsTitle")}
        </h2>

        <p className="text-sm text-gray-500">
          Enter your contact details to continue your order.
        </p>
      </div>

      {/* NAME SECTION */}
      <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <User2 className="h-4 w-4 text-lime-600" />

          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Personal Information
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <FieldRow
            id="first_name"
            label={t("common.firstName")}
            value={value.first_name}
            onChange={(e) =>
              update(
                "first_name",
                e.target.value
              )
            }
            error={errors.first_name}
            autoComplete="given-name"
          />

          <FieldRow
            id="last_name"
            label={t("common.lastName")}
            value={value.last_name}
            onChange={(e) =>
              update(
                "last_name",
                e.target.value
              )
            }
            error={errors.last_name}
            autoComplete="family-name"
          />
        </div>
      </div>

      {/* CONTACT SECTION */}
      <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-lime-600" />

          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Contact Details
          </h3>
        </div>

        <FieldRow
          id="email"
          label={t("cart.email")}
          type="email"
          value={value.email}
          onChange={(e) =>
            update("email", e.target.value)
          }
          error={errors.email}
          autoComplete="email"
        />

        <FieldRow
          id="confirm_email"
          label={t("common.reEnterEmail")}
          type="email"
          value={value.confirm_email}
          onChange={(e) =>
            update(
              "confirm_email",
              e.target.value
            )
          }
          error={errors.confirm_email}
          autoComplete="email"
        />

        <FieldRow
          id="phone"
          label={t("cart.phone")}
          inputMode="numeric"
          value={value.phone}
          onChange={(e) =>
            update(
              "phone",
              e.target.value.replace(
                /\D/g,
                ""
              )
            )
          }
          error={errors.phone}
          autoComplete="tel"
          maxLength={15}
        />
      </div>

      {/* COUNTRY SELECTION */}
      <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-lime-600" />

          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Location
          </h3>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            {t("cart.country")} <span className="text-red-500">*</span>
          </Label>

          <Select
            value={value.country}
            onValueChange={(v) =>
              update("country", v)
            }
          >
            <SelectTrigger
              aria-invalid={
                !!errors.country
              }
              className={`h-11 rounded-2xl border-gray-200 focus:ring-lime-500 ${
                errors.country
                  ? "border-red-500 ring-1 ring-red-500"
                  : ""
              }`}
            >
              <SelectValue
                placeholder={t(
                  "cart.selectCountry"
                )}
              />
            </SelectTrigger>

            <SelectContent>
              {COUNTRY_OPTIONS.map(
                (c) => (
                  <SelectItem
                    key={c.code}
                    value={c.code}
                  >
                    <div className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span>{c.name}</span>
                      <span className="text-xs text-gray-400">
                        ({c.dialCode})
                      </span>
                    </div>
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>

          {errors.country && (
            <p
              role="alert"
              className="text-xs font-medium text-red-500"
            >
              {errors.country}
            </p>
          )}

       
        </div>
      </div>

      {/* BUTTON */}
      <Button
        type="submit"
        size="lg"
        disabled={!isValid}
        className="h-11 w-full rounded-2xl bg-lime-500 text-sm font-black uppercase text-black transition-all hover:bg-lime-400 disabled:opacity-50"
      >
        <ArrowRight className="mr-2 h-4 w-4" />

        { t("cart.continue")}
      </Button>
    </form>
  );
}