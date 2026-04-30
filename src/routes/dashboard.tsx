import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Employee Dashboard — Hot Neon Posters" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <SiteLayout showTabs={false}>
      <div className="mx-auto w-full max-w-xl bg-white/95 rounded-2xl p-6 shadow-xl border-2 border-black">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="h-5 w-5" />
          <h1 className="text-2xl font-extrabold uppercase tracking-wide">Employee Login</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Authorized employees only. A verification code will be sent to your company email.
        </p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Company email</Label>
            <Input id="email" type="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" required />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Send code & continue
          </Button>
        </form>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/employee"
            className="rounded-xl border-2 border-black bg-[var(--neon-green)] px-4 py-3 text-center text-sm font-extrabold uppercase tracking-widest text-black shadow-md hover:opacity-90"
          >
            Employee Console
          </Link>
          <Link
            to="/admin"
            className="rounded-xl border-2 border-black bg-black px-4 py-3 text-center text-sm font-extrabold uppercase tracking-widest text-white shadow-md hover:opacity-90"
          >
            Admin Console
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}
