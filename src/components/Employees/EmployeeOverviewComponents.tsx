import {
  ShoppingCart,
  Users,
  PackageCheck,
  TrendingUp,
} from "lucide-react";

import { useEmployeeOrdersStore } from "@/hooks/useEmployeeOrdersStore";
import { useEmployeeUsersStore } from "@/hooks/useEmployeeUsersStore";

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className="
        overflow-hidden rounded-3xl border border-slate-200
        bg-white p-6 shadow-sm transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-xl
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <h3 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div
          className={`
            flex h-14 w-14 items-center justify-center
            rounded-2xl border text-white shadow-sm
            ${color}
          `}
        >
          {icon}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-600">
        <TrendingUp className="h-4 w-4" />
        Updated live
      </div>
    </div>
  );
}

export function EmployeeOverviewComponents() {
  const users =
    useEmployeeUsersStore(
      (s) => s.users
    );

  const orders =
    useEmployeeOrdersStore(
      (s) => s.orders
    );

  const newOrders = orders.filter(
    (o) => o.status === "In Progress"
  ).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <section
        className="
          rounded-3xl border border-slate-200
          bg-white p-6 shadow-sm
        "
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Employee Overview
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Track users and monitor
              customer orders activity.
            </p>
          </div>

          <div
            className="
              inline-flex items-center gap-2 rounded-2xl
              border border-emerald-200 bg-emerald-50
              px-4 py-2 text-sm font-semibold
              text-emerald-700
            "
          >
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Employee Access
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        className="
          grid grid-cols-1 gap-5
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        <StatCard
          label="New Orders"
          value={`${newOrders}`}
          icon={
            <PackageCheck className="h-6 w-6" />
          }
          color="border-orange-200 bg-orange-500"
        />

        <StatCard
          label="Total Orders"
          value={`${orders.length}`}
          icon={
            <ShoppingCart className="h-6 w-6" />
          }
          color="border-violet-200 bg-violet-500"
        />

        <StatCard
          label="Total Users"
          value={`${users.length}`}
          icon={
            <Users className="h-6 w-6" />
          }
          color="border-emerald-200 bg-emerald-500"
        />
      </section>
    </div>
  );
}