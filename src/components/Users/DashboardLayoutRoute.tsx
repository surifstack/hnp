import React from "react";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardScaffold, type DashboardNavItem } from "@/components/dashboard/DashboardScaffold";



const NAV: DashboardNavItem[] = [
  {
    to: "/dashboard",
    label: "Overview",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    to: "/dashboard/orders",
    label: "Orders",
    icon: <Package className="h-5 w-5" />,
  },
  // {
  //   to: "/dashboard/profile",
  //   label: "Profile",
  //   icon: <UserRound className="h-5 w-5" />,
  // },
];

export function DashboardLayoutRoute() {
  return (
    <DashboardScaffold
      title="Dashboard"
      subtitle="Welcome back"
      nav={NAV}
      redirectTo="/dashboard"
      allowedRoles={["USER", "EMPLOYEE", "ADMIN"]}
      topbarActions={
        <Button
          asChild
          size="sm"
          className="rounded-xl bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
        >
          <Link to="/cart" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Cart
          </Link>
        </Button>
      }
      sidebarExtras={
        <>
          <Link
            to="/products"
            className="
              flex items-center justify-between
              rounded-2xl border border-slate-200
              bg-white px-4 py-3 text-sm font-medium
              text-slate-700 transition hover:bg-slate-100
              group-data-[collapsible=icon]:hidden
            "
          >
            Browse Products
          </Link>
          <Link
            to="/cart"
            className="
              flex items-center justify-between
              rounded-2xl border border-slate-200
              bg-white px-4 py-3 text-sm font-medium
              text-slate-700 transition hover:bg-slate-100
              group-data-[collapsible=icon]:hidden
            "
          >
            My Cart
          </Link>
        </>
      }
    />
  );
}
