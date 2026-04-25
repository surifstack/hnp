import { useEffect, useState } from "react";
import { ChevronLeft, ShieldCheck, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldRow } from "./FieldRow";

const DUMMY_OTP = "1234";

interface Props {
  email: string;
  verified: boolean;
  onVerified: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function StepOtp({ email, verified, onVerified, onBack, onNext }: Props) {
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
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="bg-white/95 rounded-2xl p-5 shadow-xl border-2 border-black space-y-3">
      <h2 className="text-lg font-extrabold uppercase tracking-wide">Verify OTP</h2>
      <p className="text-sm text-muted-foreground">
        We sent a 4-digit code to <strong>{email}</strong>.
      </p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Demo OTP</AlertTitle>
        <AlertDescription>
          Use code <span className="font-mono font-bold">{DUMMY_OTP}</span> to verify.
        </AlertDescription>
      </Alert>

      <FieldRow
        id="otp"
        label="Enter OTP"
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
          <AlertTitle>Email verified</AlertTitle>
          <AlertDescription>You can continue to the next step.</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={onBack} className="flex-1" type="button">
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
        {success ? (
          <Button
            onClick={onNext}
            size="lg"
            className="flex-1 text-base font-bold uppercase"
            type="button"
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={verify}
            size="lg"
            className="flex-1 text-base font-bold uppercase"
            disabled={otp.length !== 4}
            type="button"
          >
            Verify
          </Button>
        )}
      </div>
    </div>
  );
}
