import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/signin")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [{ title: "Sign In — Hot Neon Posters" }],
  }),
  component: SignIn,
});

function SignIn() {
  const router = useRouter();
  const { t } = useTranslation();
  const search = Route.useSearch();
  const setUserId = useSessionStore((s) => s.setUserId);

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-xl bg-white/95 rounded-2xl p-6 shadow-xl border-2 border-black">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide mb-1">Sign In</h1>
        <p className="text-sm text-muted-foreground mb-5">
          A verification code will be sent to your email.
        </p>
        <form
          className="space-y-4"
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
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Send code & sign in
          </Button>
        </form>
        <p className="text-sm text-center mt-5">
          No account yet?{" "}
          <Link to="/create-account" className="font-bold underline">
            {t("proof.createAccount")}
          </Link>
        </p>
      </div>
    </SiteLayout>
  );
}
