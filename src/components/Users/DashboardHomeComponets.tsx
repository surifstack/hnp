import { Link } from "@tanstack/react-router";
import {
  Package,
  PackageX,
  ShoppingBag,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/hooks/useSessionStore";
import { apiJson } from "@/lib/api";

/* ================= TYPES ================= */

type DashboardOverviewResponse = {
  currentOrders: number;
  historyOrders: number;
  cancelledOrders: number;
};

/* ================= COMPONENT ================= */

export function DashboardHomeComponets() {
  const user = useSessionStore((s) => s.user);

  const [overview, setOverview] =
    useState<DashboardOverviewResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res =
          await apiJson<DashboardOverviewResponse>(
            "/orders/dashboard/overview"
          );

        if (!cancelled) {
          setOverview(res);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load dashboard");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  /* ================= LOADING ================= */

  if (loading) {
    return <DashboardOverviewSkeleton />;
  }

  /* ================= ERROR ================= */

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-500">
        {error}
      </div>
    );
  }

  /* ================= VALUES ================= */

  const current = overview?.currentOrders ?? 0;

  const history = overview?.historyOrders ?? 0;

  const cancelled = overview?.cancelledOrders ?? 0;

  /* ================= UI ================= */

  return (
    <div className="space-y-4">

      {/* HERO */}

      <section className="userdash-surface rounded-2xl p-5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Overview
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Quick view of your orders. Manage current,
          history, and cancelled in one place.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">

          <Button asChild className="userdash-neon-btn">
            <Link to="/products">
              <ShoppingBag className="h-4 w-4" />
              Start a new order
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="bg-white"
          >
            <Link to="/dashboard/orders">
              <Package className="h-4 w-4" />
              View all orders
            </Link>
          </Button>

        </div>
      </section>

      {/* STATS */}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {/* CURRENT */}

        <div className="userdash-surface rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">

            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Current
              </div>

              <div className="mt-1 text-3xl font-extrabold">
                {current}
              </div>
            </div>

            <div className="userdash-icon-badge">
              <Package className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Orders you’re actively working on.
          </div>
        </div>

        {/* HISTORY */}

        <div className="userdash-surface rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">

            <div>
              <div className="text-xs font-medium text-muted-foreground">
                History
              </div>

              <div className="mt-1 text-3xl font-extrabold">
                {history}
              </div>
            </div>

            <div className="userdash-icon-badge userdash-icon-badge--muted">
              <Package className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Past completed orders.
          </div>
        </div>

        {/* CANCELLED */}

        <div className="userdash-surface rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">

            <div>
              <div className="text-xs font-medium text-muted-foreground">
                Cancelled
              </div>

              <div className="mt-1 text-3xl font-extrabold">
                {cancelled}
              </div>
            </div>

            <div className="userdash-icon-badge userdash-icon-badge--danger">
              <PackageX className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Orders cancelled or failed.
          </div>
        </div>

      </section>
    </div>
  );
}

/* ================= SKELETON ================= */

function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">

      <div className="h-40 rounded-2xl bg-muted" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 rounded-2xl bg-muted"
          />
        ))}

      </div>
    </div>
  );
}