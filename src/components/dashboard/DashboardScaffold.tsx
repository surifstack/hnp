import React, { useEffect } from "react";
import { Link, Outlet, useMatchRoute, useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

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

import { useSessionStore, type AuthRole } from "@/hooks/useSessionStore";
import { logout } from "@/lib/auth";
import { SignIn } from "@/components/SignIn";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: React.ReactNode;
};

type Props = {
  title: string;
  subtitle?: string;
  nav: DashboardNavItem[];
  redirectTo: string;
  allowedRoles?: AuthRole[];
  badge?: string;
  topbarActions?: React.ReactNode;
  sidebarExtras?: React.ReactNode;
};

function initialsForUser(user: { firstName?: string; lastName?: string; email: string }) {
  return (
    user.firstName?.trim()?.[0] ??
    user.lastName?.trim()?.[0] ??
    user.email?.trim()?.[0] ??
    "?"
  ).toUpperCase();
}

function defaultRedirectForRole(role: AuthRole) {
  if (role === "ADMIN") return "/admin";
  if (role === "EMPLOYEE") return "/employee";
  return "/dashboard";
}

export function DashboardScaffold({
  title,
  subtitle = "Welcome back",
  nav,
  redirectTo,
  allowedRoles,
  badge,
  topbarActions,
  sidebarExtras,
}: Props) {
  const router = useRouter();
  const matchRoute = useMatchRoute();

  const user = useSessionStore((s) => s.user);
  const sessionStatus = useSessionStore((s) => s.status);

  useEffect(() => {
    if (!user || !allowedRoles?.length) return;
    if (allowedRoles.includes(user.role)) return;
    router.navigate({ to: defaultRedirectForRole(user.role) });
  }, [allowedRoles, router, user]);

      if (sessionStatus !== "ready") {
        return (
          <div className="min-h-screen bg-slate-50">
            <div className="flex">
              {/* SIDEBAR SKELETON */}
              <div className="hidden w-[280px] border-r border-slate-200 bg-white lg:block">
                <div className="border-b border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 animate-pulse rounded-2xl bg-slate-200" />

                    <div className="space-y-2">
                      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-2xl p-3"
                    >
                      <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200" />

                      <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
              </div>

              {/* MAIN */}
              <div className="flex-1">
                {/* TOPBAR */}
                <div className="sticky top-0 border-b border-slate-200 bg-white px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                      <div className="h-5 w-56 animate-pulse rounded bg-slate-300" />
                    </div>

                    <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
                  </div>
                </div>

                {/* CONTENT */}
                <main className="space-y-5 p-6">
                  <div className="h-32 animate-pulse rounded-3xl bg-white" />

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="h-72 animate-pulse rounded-3xl bg-white"
                      />
                    ))}
                  </div>
                </main>
              </div>
            </div>
          </div>
        );
      }

      if (!user) {
        console.log('scafold');
;        return <SignIn search={{ redirect: redirectTo }} />;
      }

  return (
    <div className="min-h-screen bg-slate-50">
      <SidebarProvider defaultOpen>
        <Sidebar
          variant="inset"
          collapsible="icon"
          className="
            border-r border-slate-200 bg-white
            group-data-[collapsible=icon]:w-[78px]
          "
        >
          <SidebarHeader className="border-b border-slate-100 p-3">
            <Link
              to="/"
              className="
                flex items-center gap-3
                group-data-[collapsible=icon]:justify-center
              "
            >
              <div
                className="
                  flex h-11 w-11 shrink-0 items-center justify-center
                  rounded-2xl bg-[var(--neon-green)]
                  text-lg font-bold text-black shadow-sm
                "
              >
                {initialsForUser(user)}
              </div>

              <div
                className="
                  min-w-0 transition-all duration-200
                  group-data-[collapsible=icon]:hidden
                "
              >
                <h2 className="truncate text-sm font-bold text-slate-900">{title}</h2>
                <p className="truncate text-xs text-slate-500">{subtitle}</p>
              </div>
            </Link>
          </SidebarHeader>

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
                  {nav.map((item) => {
                    const isActive = Boolean(matchRoute({ to: item.to, fuzzy: true }));

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
                            <div
                              className={`
                                flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                                transition-all

                                ${isActive ? "bg-black/10" : "bg-slate-100 text-slate-600"}
                              `}
                            >
                              {item.icon}
                            </div>

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

            {sidebarExtras ? <div className="mt-6 space-y-2">{sidebarExtras}</div> : null}
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl">
            <SidebarTrigger />

            <div className="min-w-0">
              <p className="text-xs text-slate-500">{title}</p>
              <h1 className="truncate text-lg font-bold text-slate-900">
                Welcome, {`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email}
              </h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {topbarActions}

              {badge ? (
                <div className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm sm:block">
                  {badge}
                </div>
              ) : null}

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
