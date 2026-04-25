import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
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

// Country dial codes — excludes US-restricted countries
// (Cuba, Iran, North Korea, Syria, Russia, Belarus, Venezuela)
const COUNTRY_CODES = [
  { code: "+1", country: "United States" },
  { code: "+1", country: "Canada" },
  { code: "+44", country: "United Kingdom" },
  { code: "+61", country: "Australia" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+34", country: "Spain" },
  { code: "+39", country: "Italy" },
  { code: "+52", country: "Mexico" },
  { code: "+55", country: "Brazil" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+86", country: "China" },
  { code: "+91", country: "India" },
  { code: "+27", country: "South Africa" },
];

export const Route = createFileRoute("/create-account")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [{ title: "Create Account — Hot Neon Posters" }],
  }),
  component: CreateAccount,
});

function CreateAccount() {
  const router = useRouter();
  const { t } = useTranslation();
  const search = Route.useSearch();
  const setUserId = useSessionStore((s) => s.setUserId);

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-2xl bg-white/95 rounded-2xl p-6 shadow-xl border-2 border-black">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide mb-1">Create Account</h1>
        <p className="text-sm text-muted-foreground mb-5">
          You need an account to place an order or see your proof.
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="first">First name</Label>
              <Input id="first" name="first" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last">Last name</Label>
              <Input id="last" name="last" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">Password (min 8 characters)</Label>
            <Input id="pw" name="password" type="password" minLength={8} required />
          </div>
          <div className="space-y-1.5">
            <Label>Mobile number</Label>
            <div className="flex gap-2">
              <Select defaultValue="+1-United States">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((c) => (
                    <SelectItem key={`${c.code}-${c.country}`} value={`${c.code}-${c.country}`}>
                      {c.code} {c.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="tel"
                name="phone"
                placeholder="Phone number"
                className="flex-1"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" size="lg">
            Save
          </Button>
        </form>
        <p className="text-sm text-center mt-5">
          Already have an account?{" "}
          <Link to="/signin" className="font-bold underline">
            {t("common.signIn")}
          </Link>
        </p>
      </div>
    </SiteLayout>
  );
}
