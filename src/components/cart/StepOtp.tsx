import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ShieldCheck,
  Info,
  MailCheck,
  KeyRound,
  ArrowRight,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { Button } from "@/components/ui/button";

import { FieldRow } from "./FieldRow";

import { useTranslation } from "react-i18next";

const DUMMY_OTP = "1234";

interface Props {
  email: string;
  verified: boolean;
  onVerified: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepOtp({
  email,
  verified,
  onVerified,
  onBack,
  onNext,
}: Props) {
  const { t } = useTranslation();

  const [otp, setOtp] = useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(verified);

  useEffect(() => {
    setSuccess(verified);
  }, [verified]);

  const verify = () => {
    if (otp.trim() === DUMMY_OTP) {
      setError(null);

      setSuccess(true);

      onVerified();
    } else {
      setSuccess(false);

      setError(t("otp.invalid"));
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-lime-200 bg-white p-4 shadow-sm">
      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3 py-1 text-xs font-bold text-lime-700">
          <ShieldCheck className="h-4 w-4" />
          OTP Verification
        </div>

        <h2 className="text-2xl font-black tracking-tight text-black">
          {t("otp.title")}
        </h2>

        <p className="text-sm leading-6 text-gray-500">
          {t("otp.sentTo")}{" "}
          <span className="font-semibold text-black">
            {email}
          </span>
        </p>
      </div>

      {/* EMAIL INFO */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-lime-100 p-2">
            <MailCheck className="h-5 w-5 text-lime-700" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-black">
              Verification Email Sent
            </p>

            <p className="text-xs leading-5 text-gray-500">
              Please check your inbox and
              enter the 4-digit OTP code.
            </p>
          </div>
        </div>
      </div>

      {/* DEMO ALERT */}
      <Alert className="rounded-2xl border-lime-200 bg-lime-50">
        <Info className="h-4 w-4 text-lime-700" />

        <AlertTitle className="font-bold text-lime-800">
          {t("otp.demoTitle")}
        </AlertTitle>

        <AlertDescription className="text-lime-700">
          {t("otp.demoUse")}{" "}
          <span className="rounded-md bg-white px-2 py-1 font-black text-black">
            {DUMMY_OTP}
          </span>
        </AlertDescription>
      </Alert>

      {/* OTP INPUT */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-lime-600" />

          <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Enter OTP
          </h3>
        </div>

        <FieldRow
          id="otp"
          label={t("otp.fieldLabel")}
          inputMode="numeric"
          maxLength={4}
          value={otp}
          onChange={(e) => {
            setOtp(
              e.target.value.replace(
                /\D/g,
                ""
              )
            );

            if (error) setError(null);
          }}
          placeholder="1234"
          error={error ?? undefined}
        />
      </div>

      {/* SUCCESS */}
      {success && (
        <Alert className="rounded-2xl border-lime-300 bg-lime-50 text-lime-800">
          <ShieldCheck className="h-4 w-4" />

          <AlertTitle className="font-bold">
            {t("otp.verifiedTitle")}
          </AlertTitle>

          <AlertDescription>
            {t("otp.verifiedDesc")}
          </AlertDescription>
        </Alert>
      )}

      {/* ACTIONS */}
      <div className="flex gap-3 pt-1">
        {/* BACK */}
        <Button
          variant="outline"
          onClick={onBack}
          type="button"
          className="h-11 flex-1 rounded-2xl border-lime-200 font-bold uppercase hover:bg-lime-50"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />

          {t("common.back")}
        </Button>

        {/* VERIFY / CONTINUE */}
        {success ? (
          <Button
            onClick={onNext}
            size="lg"
            type="button"
            className="h-11 flex-1 rounded-2xl bg-lime-500 text-sm font-black uppercase text-black hover:bg-lime-400"
          >
            <ArrowRight className="mr-2 h-4 w-4" />

            {t("common.continue")}
          </Button>
        ) : (
          <Button
            onClick={verify}
            size="lg"
            type="button"
            disabled={otp.length !== 4}
            className="h-11 flex-1 rounded-2xl bg-lime-500 text-sm font-black uppercase text-black hover:bg-lime-400 disabled:opacity-50"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />

            {t("otp.verify")}
          </Button>
        )}
      </div>
    </div>
  );
}