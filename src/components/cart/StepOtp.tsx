import { useEffect, useState } from "react";
import { ChevronLeft, ShieldCheck, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

export function StepOtp({ email, verified, onVerified, onBack, onNext }: Props) {
  const { t } = useTranslation();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(verified);

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
    <div className="bg-white/95 rounded-2xl p-5 shadow-xl border-2 border-black space-y-3">
      <h2 className="text-lg font-extrabold uppercase tracking-wide">
        {t("otp.title")}
      </h2>

      <p className="text-sm text-muted-foreground">
        {t("otp.sentTo")} <strong>{email}</strong>.
      </p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>{t("otp.demoTitle")}</AlertTitle>
        <AlertDescription>
          {t("otp.demoUse")}{" "}
          <span className="font-mono font-bold">{DUMMY_OTP}</span>
        </AlertDescription>
      </Alert>

      <FieldRow
        id="otp"
        label={t("otp.fieldLabel")}
        inputMode="numeric"
        maxLength={4}
        value={otp}
        onChange={(e) => {
          setOtp(e.target.value.replace(/\D/g, ""));
          if (error) setError(null);
        }}
        placeholder="1234"
        error={error ?? undefined}
      />

      {success && (
        <Alert className="border-primary/40 text-primary">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>{t("otp.verifiedTitle")}</AlertTitle>
          <AlertDescription>{t("otp.verifiedDesc")}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          type="button"
        >
          <ChevronLeft className="h-4 w-4" /> {t("common.back")}
        </Button>

        {success ? (
          <Button
            onClick={onNext}
            size="lg"
            className="flex-1 text-base font-bold uppercase"
            type="button"
          >
            {t("common.continue")}
          </Button>
        ) : (
          <Button
            onClick={verify}
            size="lg"
            className="flex-1 text-base font-bold uppercase"
            disabled={otp.length !== 4}
            type="button"
          >
            {t("otp.verify")}
          </Button>
        )}
      </div>
    </div>
  );
}