import { Link, useRouter } from "@tanstack/react-router";
import {
  UserPlus,
  Mail,
  LockKeyhole,
  Phone,
  User,
} from "lucide-react";

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
import { useUserProfileStore } from "@/hooks/useUserProfileStore";

export function CreateAccount({
  search,
}: {
  search: { redirect: string | undefined };
}) {
  const router = useRouter();
  const { t } = useTranslation();

  const setUserId = useSessionStore((s) => s.setUserId);

  const upsertProfile = useUserProfileStore(
    (s) => s.upsertProfile
  );

  const [emailError, setEmailError] = useState<string | null>(
    null
  );

  const confirmEmailRef =
    useRef<HTMLInputElement | null>(null);

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-2xl space-y-6">

        {/* HEADER */}
        <section className="bg-white rounded-3xl border shadow-xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[var(--neon-green)]/30 bg-[var(--neon-green)]/10">
            <UserPlus className="h-8 w-8 text-black" />
          </div>

          <h1 className="text-3xl font-extrabold uppercase tracking-wide">
            {t("common.createAccount")}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {t("common.createAccountSubtitle")}
          </p>
        </section>

        {/* FORM */}
        <form
          className="bg-white rounded-3xl border shadow-xl p-6 md:p-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();

            const fd = new FormData(e.currentTarget);

            const firstName = (
              fd.get("first")?.toString() ?? ""
            ).trim();

            const lastName = (
              fd.get("last")?.toString() ?? ""
            ).trim();

            const email = (
              fd.get("email")?.toString() ?? ""
            ).trim();

            const confirmEmail = (
              fd.get("confirmEmail")?.toString() ?? ""
            ).trim();

            const phone = (
              fd.get("phone")?.toString() ?? ""
            ).trim();

            if (
              email.toLowerCase() !==
              confirmEmail.toLowerCase()
            ) {
              setEmailError(t("common.unMatchEmail"));

              confirmEmailRef.current?.focus();

              return;
            }

            const id = email || `user_${Date.now()}`;

            setUserId(id);

            upsertProfile(id, {
              firstName,
              lastName,
              phone,
            });

            if (search.redirect) {
              window.location.assign(search.redirect);
              return;
            }

            router.navigate({ to: "/dashboard" });
          }}
        >
          {/* NAME */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* FIRST */}
            <div className="space-y-2">
              <Label
                htmlFor="first"
                className="text-xs font-bold uppercase tracking-wide"
              >
                {t("common.firstName")}
              </Label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <Input
                  id="first"
                  name="first"
                  required
                  className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
                />
              </div>
            </div>

            {/* LAST */}
            <div className="space-y-2">
              <Label
                htmlFor="last"
                className="text-xs font-bold uppercase tracking-wide"
              >
                {t("common.lastName")}
              </Label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <Input
                  id="last"
                  name="last"
                  required
                  className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
                />
              </div>
            </div>
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-bold uppercase tracking-wide"
            >
              {t("common.email")}
            </Label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                id="email"
                name="email"
                type="email"
                required
                onChange={() => setEmailError(null)}
                className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
              />
            </div>
          </div>

          {/* CONFIRM EMAIL */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmEmail"
              className="text-xs font-bold uppercase tracking-wide"
            >
              {t("common.reEnterEmail")}
            </Label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                ref={confirmEmailRef}
                id="confirmEmail"
                name="confirmEmail"
                type="email"
                required
                aria-invalid={emailError ? "true" : "false"}
                onChange={() => setEmailError(null)}
                className={`h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)] ${
                  emailError
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
            </div>

            {emailError ? (
              <p className="text-sm font-medium text-red-600">
                {emailError}
              </p>
            ) : null}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label
              htmlFor="pw"
              className="text-xs font-bold uppercase tracking-wide"
            >
              {t("common.password")}
            </Label>

            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                id="pw"
                name="password"
                type="password"
                minLength={8}
                required
                className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
              />
            </div>
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wide">
              {t("common.mobileNumber")}
            </Label>

            <div className="flex gap-2">

              <Select defaultValue="+1">
                <SelectTrigger className="h-12 w-40 rounded-xl border-2">
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

              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <Input
                  type="tel"
                  name="phone"
                  placeholder={t("common.phonePlaceholder")}
                  className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
                  required
                />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 rounded-xl bg-black text-white font-extrabold uppercase tracking-wide transition active:scale-[0.98]"
          >
            {t("common.save")}
          </Button>

          {/* FOOTER */}
          <div className="pt-2 text-center text-sm text-gray-500">
            {t("common.alreadyHaveAccount")}{" "}

            <Link
              to="/signin"
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