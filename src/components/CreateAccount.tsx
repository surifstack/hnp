import { Link, useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useTranslation } from "react-i18next";
import { LANGUAGE_OPTIONS } from "@/config/languages";
import { useRef, useState } from "react";

export function CreateAccount({ search }: { search: { redirect: string | undefined } }) {
  const router = useRouter();
  const { t } = useTranslation();
  const setUserId = useSessionStore((s) => s.setUserId);
  const [emailError, setEmailError] = useState<string | null>(null);
  const confirmEmailRef = useRef<HTMLInputElement | null>(null);

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-2xl bg-white/95 rounded-2xl p-6 shadow-xl border-2 border-black">

        {/* TITLE */}
        <h1 className="text-2xl font-extrabold uppercase tracking-wide mb-1">
          {t("common.createAccount")}
        </h1>

        {/* SUBTITLE */}
        <p className="text-sm text-muted-foreground mb-5">
          {t("common.createAccountSubtitle")}
        </p>

        {/* FORM */}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();

            const fd = new FormData(e.currentTarget);
            const email = (fd.get("email")?.toString() ?? "").trim();
            const confirmEmail = (fd.get("confirmEmail")?.toString() ?? "").trim();

            if (email.toLowerCase() !== confirmEmail.toLowerCase()) {
              setEmailError(t("common.unMatchEmail"));
              confirmEmailRef.current?.focus();
              return;
            }

            const id = email || `user_${Date.now()}`;
            setUserId(id);

            if (search.redirect) {
              window.location.assign(search.redirect);
              return;
            }

            router.navigate({ to: "/dashboard" });
          }}
        >
          {/* NAME */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="first">{t("common.firstName")}</Label>
              <Input id="first" name="first" required />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="last">{t("common.lastName")}</Label>
              <Input id="last" name="last" required />
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-1.5">
            <Label htmlFor="email">{t("common.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              onChange={() => setEmailError(null)}
            />
          </div>

          {/* RE-ENTER EMAIL */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmEmail">{t("common.reEnterEmail")}</Label>
            <Input
              ref={confirmEmailRef}
              id="confirmEmail"
              name="confirmEmail"
              type="email"
              required
              aria-invalid={emailError ? "true" : "false"}
              onChange={() => setEmailError(null)}
            />
            {emailError ? (
              <p className="text-sm font-medium text-red-600">{emailError}</p>
            ) : null}
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <Label htmlFor="pw">{t("common.password")}</Label>
            <Input id="pw" name="password" type="password" minLength={8} required />
          </div>

          {/* PHONE */}
          <div className="space-y-1.5">
            <Label>{t("common.mobileNumber")}</Label>

            <div className="flex gap-2">
              <Select defaultValue="+1">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {LANGUAGE_OPTIONS.map((c) => (
                    <SelectItem
                      key={`${c.value}-${c.name}`}
                      value={c.value}
                    >
                      {c.flag} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="tel"
                name="phone"
                placeholder={t("common.phonePlaceholder")}
                className="flex-1"
                required
              />
            </div>
          </div>

          {/* SUBMIT */}
          <Button type="submit" className="w-full" size="lg">
            {t("common.save")}
          </Button>
        </form>

        {/* FOOTER */}
        <p className="text-sm text-center mt-5">
          {t("common.alreadyHaveAccount")}{" "}
          <Link to="/signin" className="font-bold underline">
            {t("common.signIn")}
          </Link>
        </p>
      </div>
    </SiteLayout>
  );
}
