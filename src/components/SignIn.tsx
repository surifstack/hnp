import { Link, useRouter } from "@tanstack/react-router";
import { ShieldCheck, LockKeyhole, Mail } from "lucide-react";

import { SiteLayout } from "@/components/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useSessionStore } from "@/hooks/useSessionStore";
import { useTranslation } from "react-i18next";

export function SignIn({
  search,
}: {
  search: { redirect: string | undefined };
}) {
  const router = useRouter();
  const { t } = useTranslation();

  const setUserId = useSessionStore((s) => s.setUserId);

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-xl space-y-6">

        {/* HEADER */}
        <section className="bg-white rounded-3xl border shadow-xl p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-[var(--neon-green)]/30 bg-[var(--neon-green)]/10">
            <ShieldCheck className="h-8 w-8 text-black" />
          </div>

          <h1 className="text-3xl font-extrabold uppercase tracking-wide">
            {t("common.signIn")}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            {t("common.otpMessage")}
          </p>
        </section>

        {/* FORM */}
        <form
          className="bg-white rounded-3xl border shadow-xl p-6 md:p-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();

            const fd = new FormData(e.currentTarget);
   
            const email = (fd.get("email")?.toString() ?? "").trim();
          
            const id = email || `user_${Date.now()}`;

            setUserId(id);
          
            if (search.redirect) {
              window.location.assign(search.redirect);
              return;
            }

            router.navigate({ to: "/dashboard" });
          }}
        >
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
                autoComplete="email"
                placeholder="john@example.com"
                className="h-12 rounded-xl border-2 pl-10 focus-visible:ring-[var(--neon-green)]"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-bold uppercase tracking-wide"
            >
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

          {/* SUBMIT */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 rounded-xl bg-black text-white font-extrabold uppercase tracking-wide transition active:scale-[0.98]"
          >
            {t("common.sendCodeAndLogin")}
          </Button>

          {/* CREATE ACCOUNT */}
          <div className="pt-2 text-center text-sm text-gray-500">
            {t("common.notAccount")}{" "}

            <Link
              to="/create-account"
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