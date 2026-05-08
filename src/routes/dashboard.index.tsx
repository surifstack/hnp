import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, PackageX, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useHnpStore } from "@/hooks/useHnpStore";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [{ title: "Dashboard — HNP" }],
  }),
  component: DashboardHomePage,
});

function DashboardHomePage() {
  const user = useSessionStore((s) => s.user);
  const ordersByUserId = useHnpStore((s) => s.userOrders.ordersByUserId);

  const orders = user?.id ? (ordersByUserId[user.id] ?? []) : [];
  const current = orders.filter((o) => o.status === "CURRENT");
  const history = orders.filter((o) => o.status === "HISTORY");
  const cancelled = orders.filter((o) => o.status === "CANCELLED");

  return (
    <div className="space-y-4">
      <section className="userdash-surface rounded-2xl p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quick view of your orders. Manage current, history, and cancelled in one place.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button asChild className="userdash-neon-btn">
            <Link to="/products">
              <ShoppingBag className="h-4 w-4" />
              Start a new order
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-white">
            <Link to="/dashboard/orders">
              <Package className="h-4 w-4" />
              View all orders
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="userdash-surface rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground">Current</div>
              <div className="mt-1 text-3xl font-extrabold">{current.length}</div>
            </div>
            <div className="userdash-icon-badge">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Orders you’re actively working on.</div>
        </div>

        <div className="userdash-surface rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground">History</div>
              <div className="mt-1 text-3xl font-extrabold">{history.length}</div>
            </div>
            <div className="userdash-icon-badge userdash-icon-badge--muted">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Past orders you archived.</div>
        </div>

        <div className="userdash-surface rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground">Cancelled</div>
              <div className="mt-1 text-3xl font-extrabold">{cancelled.length}</div>
            </div>
            <div className="userdash-icon-badge userdash-icon-badge--danger">
              <PackageX className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">Orders you cancelled.</div>
        </div>
      </section>
    </div>
  );
}
