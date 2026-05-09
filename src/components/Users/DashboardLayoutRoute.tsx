import React from "react";
import {
  Link,
  Outlet,
  useMatchRoute,
  useRouter,
} from "@tanstack/react-router";

import {
  Package,
  ShoppingCart,
  UserRound,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useSessionStore } from "@/hooks/useSessionStore";
import { logout } from "@/lib/auth";
import { SignIn } from "../SignIn";

type NavItem = {
  to: "/dashboard" | "/dashboard/orders" | "/dashboard/profile";
  label: string;
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
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
  const router = useRouter();
  const matchRoute = useMatchRoute();

  const user = useSessionStore((s) => s.user);
  console.log(user , 'user')
  const sessionStatus = useSessionStore((s) => s.status);

  if (sessionStatus !== "ready" || !user) {
    return <SignIn search={{ redirect: "/dashboard" }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarProvider defaultOpen>
        {/* SIDEBAR */}
        <Sidebar
          variant="inset"
          collapsible="icon"
          className="
            border-r border-slate-200 bg-white
            group-data-[collapsible=icon]:w-[78px]
          "
        >
          {/* HEADER */}
          <SidebarHeader className="border-b border-slate-100 p-3">
            <Link
              to="/"
              className="
                flex items-center gap-3
                group-data-[collapsible=icon]:justify-center
              "
            >
              {/* LOGO */}
              <div
                className="
                  flex h-11 w-11 shrink-0 items-center justify-center
                  rounded-2xl bg-[var(--neon-green)]
                  text-lg font-bold text-black shadow-sm
                "
              >
                {(user.firstName?.trim()?.[0] ??
                  user.lastName?.trim()?.[0] ??
                  user.email?.trim()?.[0] ??
                  "?").toUpperCase()}
              </div>

              {/* TEXT */}
              <div
                className="
                  min-w-0 transition-all duration-200
                  group-data-[collapsible=icon]:hidden
                "
              >
                <h2 className="truncate text-sm font-bold text-slate-900">
                  Dashboard
                </h2>

                <p className="truncate text-xs text-slate-500">
                  Welcome back
                </p>
              </div>
            </Link>
          </SidebarHeader>

          {/* CONTENT */}
          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupLabel
                className="
                  px-3 text-xs font-semibold uppercase
                  tracking-widest text-slate-400
                  group-data-[collapsible=icon]:hidden
                "
              >
                Menu
              </SidebarGroupLabel>

              <SidebarGroupContent className="mt-2">
                <SidebarMenu className="space-y-2">
                  {NAV.map((item) => {
                    const isActive = Boolean(
                      matchRoute({
                        to: item.to,
                        fuzzy: true,
                      })
                    );

                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.label}
                          className={`
                            h-12 rounded-2xl transition-all duration-200
                            flex items-center

                            group-data-[collapsible=icon]:h-12
                            group-data-[collapsible=icon]:w-12
                            group-data-[collapsible=icon]:justify-center
                            group-data-[collapsible=icon]:mx-auto
                            group-data-[collapsible=icon]:p-0

                            ${
                              isActive
                                ? "bg-[var(--neon-green)] text-black shadow-sm"
                                : "hover:bg-slate-100"
                            }
                          `}
                        >
                          <Link
                            to={item.to}
                            className="
                              flex w-full items-center gap-3 px-3

                              group-data-[collapsible=icon]:w-auto
                              group-data-[collapsible=icon]:justify-center
                              group-data-[collapsible=icon]:gap-0
                              group-data-[collapsible=icon]:px-0
                            "
                          >
                            {/* ICON */}
                            <div
                              className={`
                                flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                                transition-all

                                ${
                                  isActive
                                    ? "bg-black/10"
                                    : "bg-slate-100 text-slate-600"
                                }
                              `}
                            >
                              {item.icon}
                            </div>

                            {/* LABEL */}
                            <span
                              className="
                                font-medium
                                group-data-[collapsible=icon]:hidden
                              "
                            >
                              {item.label}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* EXTRA LINKS */}
            <div className="mt-6 space-y-2">
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
            </div>
          </SidebarContent>
        </Sidebar>

        {/* MAIN */}
        <SidebarInset>
          {/* TOPBAR */}
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl">
            <SidebarTrigger />

            <div>
              <p className="text-xs text-slate-500">
                Dashboard
              </p>

              <h1 className="text-lg font-bold text-slate-900">
                Welcome,{" "}
                {`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                  user.email}
              </h1>
            </div>

            {/* ACTIONS */}
            <div className="ml-auto flex items-center gap-2">
              <Button
                asChild
                size="sm"
                className="rounded-xl bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
              >
                <Link
                  to="/cart"
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                </Link>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  void logout().finally(() => {
                    router.navigate({ to: "/" });
                  });
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </header>

          {/* PAGE */}
          <main className="px-4 py-5 sm:px-6">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
