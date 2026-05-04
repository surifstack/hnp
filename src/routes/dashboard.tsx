import * as React from "react";
import { createFileRoute, Link, Outlet, useMatchRoute, useRouter } from "@tanstack/react-router";
import { Package, ShoppingCart, UserRound, LogOut, LayoutDashboard } from "lucide-react";
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
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SiteLayout } from "@/components/SiteLayout";
import { useSessionStore } from "@/hooks/useSessionStore";
import { useUserProfileStore, formatDisplayName } from "@/hooks/useUserProfileStore";

type NavItem = {
  to: "/dashboard" | "/dashboard/orders" | "/dashboard/profile";
  label: string;
  icon: React.ReactNode;
};

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Overview", icon: <LayoutDashboard /> },
  { to: "/dashboard/orders", label: "Orders", icon: <Package /> },
  { to: "/dashboard/profile", label: "Profile", icon: <UserRound /> },
];

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "My Dashboard — MININOTE" }],
  }),
  component: DashboardLayoutRoute,
});

function DashboardLayoutRoute() {
  const router = useRouter();
  const matchRoute = useMatchRoute();
  const userId = useSessionStore((s) => s.userId);
  const signOut = useSessionStore((s) => s.signOut);
  const profile = useUserProfileStore((s) => (userId ? s.profilesByUserId[userId] : undefined));

  if (!userId) {
    return (
      <SiteLayout showTabs={false}>
        <div className="userdash-surface mx-auto w-full max-w-xl rounded-2xl p-6">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Please sign in (email + password) to see your orders and account.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button asChild className="userdash-neon-btn" size="lg">
              <Link to="/signin" search={{ redirect: "/dashboard" }}>
                Sign in
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/create-account" search={{ redirect: "/dashboard" }}>
                Create account
              </Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const displayName = formatDisplayName(profile, userId);

  return (
    <div className="min-h-svh bg-slate-50">
      <div
        style={
          {
            "--sidebar": "oklch(1 0 0 / 0.98)",
            "--sidebar-foreground": "oklch(0.15 0 0)",
            "--sidebar-border": "oklch(0.85 0 0)",
            "--sidebar-accent": "var(--neon-green)",
            "--sidebar-accent-foreground": "#000000",
            "--sidebar-ring": "var(--neon-green)",
          } as React.CSSProperties
        }
      >
        <SidebarProvider defaultOpen>
          <Sidebar variant="inset" collapsible="icon" className="border-r border-slate-200 shadow-sm">
              <SidebarHeader className="p-3">
                <div className="userdash-surface rounded-xl p-3">
                  <div className="text-xs font-medium text-muted-foreground">Account</div>
                  <div className="truncate text-lg font-semibold tracking-tight">{displayName}</div>
                  <div className="mt-2 flex gap-2">
                    <Link
                      to="/products"
                      className="userdash-chip userdash-chip--neon"
                      aria-label="Browse products"
                    >
                      Shop
                    </Link>
                    <Link to="/cart" className="userdash-chip" aria-label="Open cart">
                      Cart
                    </Link>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarSeparator className="bg-slate-200" />
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel className="text-muted-foreground">Dashboard</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {NAV.map((item) => {
                        const isActive = Boolean(matchRoute({ to: item.to, fuzzy: true }));
                        return (
                          <SidebarMenuItem key={item.to}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              className="data-[active=true]:bg-[var(--sidebar-accent)] data-[active=true]:text-[var(--sidebar-accent-foreground)]"
                            >
                              <Link to={item.to}>
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <SidebarInset className="bg-transparent">
              <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-6">
                <SidebarTrigger />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-muted-foreground">My dashboard</div>
                  <div className="truncate text-base font-semibold tracking-tight">
                    Orders • Profile • Support
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button asChild size="sm" className="userdash-neon-btn">
                    <Link to="/cart">
                      <ShoppingCart className="h-4 w-4" />
                      Cart
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white"
                    onClick={() => {
                      signOut();
                      router.navigate({ to: "/" });
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </Button>
                </div>
              </header>

              <main className="px-3 py-4 sm:px-6">
                <div className="mx-auto w-full max-w-6xl">
                  <Outlet />
                </div>
              </main>
            </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
