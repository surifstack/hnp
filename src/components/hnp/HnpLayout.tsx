import * as React from "react";
import { Link, Outlet, useMatchRoute } from "@tanstack/react-router";
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

type NavItem = {
  to: string;
  label: string;
  icon?: React.ReactNode;
};

interface HnpLayoutProps {
  title: string;
  subtitle?: string;
  nav: NavItem[];
}

export function HnpLayout({ title, subtitle, nav }: HnpLayoutProps) {
  const matchRoute = useMatchRoute();

  return (
    <div
      style={
        {
          "--sidebar": "oklch(1 0 0)",
          "--sidebar-foreground": "oklch(0.129 0.042 264.695)",
          "--sidebar-border": "oklch(0.129 0.042 264.695)",
          "--sidebar-accent": "var(--neon-green)",
          "--sidebar-accent-foreground": "#000000",
          "--sidebar-ring": "var(--neon-green)",
        } as React.CSSProperties
      }
      className="min-h-svh bg-background"
    >
      <SidebarProvider defaultOpen>
        <Sidebar variant="inset" collapsible="icon" className="border-r-2 border-black">
          <SidebarHeader className="p-3">
            <div className="rounded-xl border-2 border-black bg-white p-3 shadow-md">
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                HNP
              </div>
              <div className="text-lg font-extrabold uppercase tracking-wide">{title}</div>
             
            </div>
          </SidebarHeader>
          <SidebarSeparator className="bg-black/20" />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-black/70">Manage</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {nav.map((item) => {
                    const isActive = Boolean(matchRoute({ to: item.to, fuzzy: true }));
                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="data-[active=true]:bg-[var(--neon-green)] data-[active=true]:text-black"
                        >
                          <Link to={item.to}>
                            {item.icon}
                            <span className="font-semibold">{item.label}</span>
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
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b-2 border-black bg-white/90 px-3 py-3 backdrop-blur sm:px-6">
            <SidebarTrigger />
            <div className="min-w-0">
              <div className="text-xs font-bold uppercase tracking-widest text-black/70">
                {title}
              </div>
              <div className="truncate text-base font-extrabold uppercase tracking-wide">
                Manage everything
              </div>
            </div>
            <div className="ml-auto rounded-full border-2 border-black bg-[var(--neon-green)] px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-black">
              Admin
            </div>
          </header>

          <main className="px-3 py-4 sm:px-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
