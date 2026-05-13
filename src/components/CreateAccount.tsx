import { Link, useRouter } from "@tanstack/react-router";
import { KeyRound, LockKeyhole, Mail, Phone, User, UserPlus } from "lucide-react";
import { forwardRef, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProfileStore } from "@/hooks/useUserProfileStore";
import { register, requestRegisterOtp } from "@/lib/auth";
import { COUNTRY_OPTIONS, LANGUAGE_OPTIONS } from "@/config/languages";

type RegisterDraft = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneCountryCode: string;
  phoneNumber: string;
};

export function CreateAccount({
  search,
}: {
  search: { redirect: string | undefined };
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const upsertProfile = useUserProfileStore((s) => s.upsertProfile);
  const [draft, setDraft] = useState<RegisterDraft | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const confirmEmailRef = useRef<HTMLInputElement | null>(null);

  const finishRegister = () => {
    if (!draft || otpCode.length < 4) return;

    setSubmitting(true);
    setSubmitError(null);

    void register({
      firstName: draft.firstName,
      lastName: draft.lastName,
      email: draft.email,
      password: draft.password,
      phoneCountryCode: draft.phoneCountryCode,
      phoneNumber: draft.phoneNumber,
      otpCode,
    })
      .then(() => {
        upsertProfile({
          firstName: draft.firstName,
          lastName: draft.lastName,
          phoneCountryCode: draft.phoneCountryCode,
          phoneNumber: draft.phoneNumber,
        });
        if (search.redirect) {
          window.location.assign(search.redirect);
          return;
        }

        router.navigate({ to: "/dashboard" });
      })
      .catch((err) => {
        setSubmitError(err instanceof Error ? err.message : "Unable to create account");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <section className="bg-white rounded-3xl border shadow-xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[var(--neon-green)]/30 bg-[var(--neon-green)]/10">
            <UserPlus className="h-8 w-8 text-black" />
          </div>

          <h1 className="text-3xl font-extrabold uppercase tracking-wide">
            {t("common.createAccount")}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {draft ? `Enter the OTP sent to ${draft.email}` : t("common.createAccountSubtitle")}
          </p>
        </section>

        <form
          className="bg-white rounded-3xl border shadow-xl p-6 md:p-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();

            if (draft) {
              finishRegister();
              return;
            }

            const fd = new FormData(e.currentTarget);
            const firstName = (fd.get("first")?.toString() ?? "").trim();
            const lastName = (fd.get("last")?.toString() ?? "").trim();
            const email = (fd.get("email")?.toString() ?? "").trim();
            const confirmEmail = (fd.get("confirmEmail")?.toString() ?? "").trim();
            const phoneCountryCode = (fd.get("phoneCountryCode")?.toString() ?? "").trim();
            const phoneNumber = (fd.get("phoneNumber")?.toString() ?? "").trim();
            const password = (fd.get("password")?.toString() ?? "").trim();

            if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
              setEmailError(t("common.unMatchEmail"));
              confirmEmailRef.current?.focus();
              return;
            }

            setSubmitting(true);
            setSubmitError(null);

            void requestRegisterOtp(email)
              .then((res) => {
                setDraft({
                  firstName,
                  lastName,
                  email,
                  password,
                  phoneCountryCode,
                  phoneNumber,
                });
                setDevOtp(res.devOtp ?? null);
                setExpiresAt(res.expiresAt);
              })
              .catch((err) => {
                setSubmitError(err instanceof Error ? err.message : "Unable to send OTP");
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {!draft ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AccountField icon={<User />} id="first" name="first" label={t("common.firstName")} required />
                <AccountField icon={<User />} id="last" name="last" label={t("common.lastName")} required />
              </div>

              <AccountField
                icon={<Mail />}
                id="email"
                name="email"
                label={t("common.email")}
                type="email"
                required
                onChange={() => setEmailError(null)}
              />

              <AccountField
                ref={confirmEmailRef}
                icon={<Mail />}
                id="confirmEmail"
                name="confirmEmail"
                label={t("common.reEnterEmail")}
                type="email"
                required
                error={emailError}
                onChange={() => setEmailError(null)}
              />

              <AccountField
                icon={<LockKeyhole />}
                id="pw"
                name="password"
                label={t("common.password")}
                type="password"
                minLength={8}
                required
              />

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wide">
                  {t("common.mobileNumber")}
                </Label>

                <div className="flex gap-2">
                  <Select
  name="phoneCountryCode"
  defaultValue="+91"
  onValueChange={(v) => {
    const form = document.querySelector("form") as HTMLFormElement;
    const input = form?.elements.namedItem("phoneCountryCode") as HTMLInputElement;
    if (input) input.value = v;
  }}
>
  <SelectTrigger className="h-12 w-32 rounded-xl border-2">
    <SelectValue placeholder="+Code" />
  </SelectTrigger>

  <SelectContent>
    {COUNTRY_OPTIONS.map((c) => (
      <SelectItem key={c.dialCode} value={c.dialCode as string}>
        <span className="flex items-center gap-2">
          <span>{c.flag}</span>
          <span>{c.dialCode}</span>
          <span className="text-xs text-gray-500">{c.name}</span>
        </span>
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                  

                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      type="tel"
                      name="phoneNumber"
                      placeholder={t("common.phonePlaceholder")}
                      className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
                <p className="rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-800">
                  Development OTP: <span className="text-black">{devOtp}</span>
                </p>

              <AccountField
                icon={<KeyRound />}
                id="otpCode"
                name="otpCode"
                label="OTP code"
                inputMode="numeric"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, ""));
                  setSubmitError(null);
                }}
              />

              {expiresAt ? (
                <p className="text-xs font-medium text-gray-500">
                  Code expires at {new Date(expiresAt).toLocaleTimeString()}.
                </p>
              ) : null}
            </div>
          )}

          {submitError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {submitError}
            </p>
          ) : null}

          <div className="grid gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={submitting || (Boolean(draft) && otpCode.length < 4)}
              className="w-full h-12 rounded-xl bg-black text-white font-extrabold uppercase tracking-wide transition active:scale-[0.98]"
            >
              {submitting ? "Working..." : draft ? "Verify OTP and create account" : "Send OTP"}
            </Button>

            {draft ? (
              <Button
                type="button"
                variant="outline"
                className="h-12 rounded-xl font-bold uppercase tracking-wide"
                onClick={() => {
                  setDraft(null);
                  setOtpCode("");
                  setDevOtp(null);
                  setExpiresAt(null);
                  setSubmitError(null);
                }}
              >
                Change email
              </Button>
            ) : null}
          </div>

          <div className="pt-2 text-center text-sm text-gray-500">
            {t("common.alreadyHaveAccount")}{" "}
            <Link
              to="/signin"
              search={{redirect:search.redirect  ? search.redirect : "/dashboard"}}

              className="font-bold text-black underline underline-offset-4 hover:opacity-70"
            >
              {t("common.signIn")}
            </Link>
          </div>
        </form>
      </div>
    </SiteLayout>
  );
}

const AccountField = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & {
  icon: ReactNode;
  label: string;
  error?: string | null;
}>(({
  icon,
  label,
  error,
  ...props
}, ref) => (
  <div className="space-y-2">
    <Label htmlFor={props.id} className="text-xs font-bold uppercase tracking-wide">
      {label}
    </Label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 flex h-4 w-4 -translate-y-1/2 text-gray-400 [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <Input
        {...props}
        ref={ref}
        aria-invalid={error ? "true" : undefined}
        className={`h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)] ${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        } ${props.className ?? ""}`}
      />
    </div>
    {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
  </div>
));

AccountField.displayName = "AccountField";
