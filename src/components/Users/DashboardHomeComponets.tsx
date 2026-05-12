import { Link } from "@tanstack/react-router";
import {
  Package,
  PackageX,
  ShoppingBag,
  Clock3,
  ArrowRight,
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

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

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
          setError(
            "Failed to load dashboard"
          );
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
      <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-500 shadow-sm">
        {error}
      </div>
    );
  }

  /* ================= VALUES ================= */

  const current =
    overview?.currentOrders ?? 0;

  const history =
    overview?.historyOrders ?? 0;

  const cancelled =
    overview?.cancelledOrders ?? 0;

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* HERO */}

      <section
        className="
          relative overflow-hidden rounded-3xl
          border border-slate-200 bg-white
          p-6 shadow-sm
        "
      >
        {/* glow */}

        <div
          className="
            absolute right-[-80px] top-[-80px]
            h-64 w-64 rounded-full
            bg-[var(--neon-green)]/20 blur-3xl
          "
        />

        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div
                className="
                  inline-flex items-center gap-2
                  rounded-full border border-emerald-200
                  bg-emerald-50 px-3 py-1
                  text-xs font-semibold text-emerald-700
                "
              >
                <Clock3 className="h-3.5 w-3.5" />
                Live Dashboard
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
                Welcome back,
                {" "}
                {user?.firstName || "User"}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Track active orders,
                completed history,
                and cancelled requests
                from one clean dashboard.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="
                    h-11 rounded-2xl
                    bg-[var(--neon-green)]
                    px-5 font-semibold
                    text-black hover:opacity-90
                  "
                >
                  <Link to="/products">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Start New Order
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="
                    h-11 rounded-2xl
                    border-slate-200 bg-white
                  "
                >
                  <Link to="/dashboard/orders">
                    <Package className="mr-2 h-4 w-4" />
                    View Orders
                  </Link>
                </Button>
              </div>
            </div>

            {/* right card */}

            <div
              className="
                rounded-3xl border border-slate-200
                bg-slate-50 p-5
                shadow-inner
                lg:w-[320px]
              "
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Quick Summary
              </div>

              <div className="mt-5 space-y-4">
                <QuickRow
                  label="Current Orders"
                  value={current}
                  icon={
                    <Package className="h-4 w-4" />
                  }
                />

                <QuickRow
                  label="Completed Orders"
                  value={history}
                  icon={
                    <ArrowRight className="h-4 w-4" />
                  }
                />

                <QuickRow
                  label="Cancelled Orders"
                  value={cancelled}
                  icon={
                    <PackageX className="h-4 w-4" />
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}

      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <StatsCard
          title="Current Orders"
          value={current}
          description="Orders currently in progress"
          icon={
            <Package className="h-5 w-5" />
          }
          iconClassName="
            bg-emerald-100
            text-emerald-700
          "
        />

        <StatsCard
          title="Order History"
          value={history}
          description="Completed previous orders"
          icon={
            <ArrowRight className="h-5 w-5" />
          }
          iconClassName="
            bg-blue-100
            text-blue-700
          "
        />

        <StatsCard
          title="Cancelled Orders"
          value={cancelled}
          description="Failed or cancelled orders"
          icon={
            <PackageX className="h-5 w-5" />
          }
          iconClassName="
            bg-red-100
            text-red-700
          "
        />
      </section>
    </div>
  );
}

/* ================= STATS CARD ================= */

function StatsCard({
  title,
  value,
  description,
  icon,
  iconClassName,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <div
      className="
        group rounded-3xl border border-slate-200
        bg-white p-5 shadow-sm transition-all
        duration-300 hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-500">
            {title}
          </div>

          <div className="mt-2 text-4xl font-black tracking-tight text-slate-900">
            {value}
          </div>
        </div>

        <div
          className={`
            flex h-12 w-12 items-center justify-center
            rounded-2xl
            ${iconClassName}
          `}
        >
          {icon}
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500">
        {description}
      </div>
    </div>
  );
}

/* ================= QUICK ROW ================= */

function QuickRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="
        flex items-center justify-between
        rounded-2xl border border-slate-200
        bg-white px-4 py-3
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex h-9 w-9 items-center justify-center
            rounded-xl bg-slate-100 text-slate-700
          "
        >
          {icon}
        </div>

        <div>
          <div className="text-sm font-medium text-slate-600">
            {label}
          </div>
        </div>
      </div>

      <div className="text-lg font-bold text-slate-900">
        {value}
      </div>
    </div>
  );
}

/* ================= SKELETON ================= */

function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-72 rounded-3xl bg-muted" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 rounded-3xl bg-muted"
          />
        ))}
      </div>
    </div>
  );
}