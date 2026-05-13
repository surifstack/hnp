import { Link, useRouter } from "@tanstack/react-router";
import { KeyRound, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, requestLoginOtp } from "@/lib/auth";

type LoginDraft = {
  email: string;
  password: string;
};

export function SignIn({
  search,
}: {
  search: { redirect: string | undefined };
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [draft, setDraft] = useState<LoginDraft | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const finishLogin = () => {
    if (!draft || otpCode.length < 4) return;

    setSubmitting(true);
    setError(null);

    void login(draft.email, draft.password, otpCode)
  .then((data) => {
    // custom redirect from protected route
    if (search.redirect) {
      const redirect = search.redirect;

      // ONLY restrict normal USER
      if (
        data.role === "USER" &&
        (redirect.startsWith("/admin") ||
          redirect.startsWith("/employee"))
      ) {
        router.navigate({
          to: "/dashboard",
        });

        return;
      }

     
    }

    // default redirects
    if (data.role === "EMPLOYEE") {
      router.navigate({
        to: "/employee/orders",
      });

      return;
    }

    if (data.role === "ADMIN") {
      router.navigate({
        to: "/admin/orders",
      });

      return;
    }

    router.navigate({
      to: "/dashboard",
    });
  })
  .catch((err) => {
    setError(err instanceof Error ? err.message : "Unable to sign in");
  })
  .finally(() => setSubmitting(false));
}

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-xl space-y-6">
        <section className="bg-white rounded-3xl border shadow-xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[var(--neon-green)]/30 bg-[var(--neon-green)]/10">
            <ShieldCheck className="h-8 w-8 text-black" />
          </div>

          <h1 className="text-3xl font-extrabold uppercase tracking-wide">
            {t("common.signIn")}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {draft ? `Enter the OTP sent to ${draft.email}` : t("common.otpMessage")}
          </p>
        </section>

        <form
          className="bg-white rounded-3xl border shadow-xl p-6 md:p-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();

            if (draft) {
              finishLogin();
              return;
            }

            const fd = new FormData(e.currentTarget);
            const email = (fd.get("email")?.toString() ?? "").trim();
            const password = (fd.get("password")?.toString() ?? "").trim();

            setSubmitting(true);
            setError(null);

            void requestLoginOtp(email, password)
              .then((res) => {
                setDraft({ email, password });
                setDevOtp(res.devOtp ?? null);
                setExpiresAt(res.expiresAt);
              })
              .catch((err) => {
                setError(err instanceof Error ? err.message : "Unable to send OTP");
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {!draft ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wide">
                  {t("common.email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="john@example.com"
                    className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wide">
                  {t("common.password")}
                </Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {devOtp ? (
                <p className="rounded-xl border border-lime-200 bg-lime-50 px-4 py-3 text-sm font-semibold text-lime-800">
                  Development OTP: <span className="text-black">{devOtp}</span>
                </p>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="otpCode" className="text-xs font-bold uppercase tracking-wide">
                  OTP code
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="otpCode"
                    name="otpCode"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value.replace(/\D/g, ""));
                      setError(null);
                    }}
                    className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
                  />
                </div>
                {expiresAt ? (
                  <p className="text-xs font-medium text-gray-500">
                    Code expires at {new Date(expiresAt).toLocaleTimeString()}.
                  </p>
                ) : null}
              </div>
            </div>
          )}

          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}

          <div className="grid gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={submitting || (Boolean(draft) && otpCode.length < 4)}
              className="w-full h-12 rounded-xl bg-black text-white font-extrabold uppercase tracking-wide transition active:scale-[0.98]"
            >
              {submitting ? "Working..." : draft ? "Verify OTP and sign in" : "Send OTP"}
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
                  setError(null);
                }}
              >
                Change email
              </Button>
            ) : null}
          </div>

          <div className="pt-2 text-center text-sm text-gray-500">
            {t("common.notAccount")}{" "}
            <Link
              to="/create-account"
              search={{redirect:search.redirect  ? search.redirect : "/dashboard"}}
              className="font-bold text-black underline underline-offset-4 hover:opacity-70"
            >
              {t("proof.createAccount")}
            </Link>
          </div>
        </form>
      </div>
    </SiteLayout>
  );
}
