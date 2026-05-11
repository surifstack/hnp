import * as React from "react";
import type { AuthRole } from "@/hooks/useSessionStore";
import { DashboardScaffold, type DashboardNavItem } from "@/components/dashboard/DashboardScaffold";

type NavItem = DashboardNavItem;

interface HnpLayoutProps {
  title: string;
  subtitle?: string;
  nav: NavItem[];
  redirectTo: string;
  allowedRoles: AuthRole[];
  badge: string;
}

export function HnpLayout({
  title,
  subtitle,
  nav,
  redirectTo,
  allowedRoles,
  badge,
}: HnpLayoutProps) {
  return (
    <DashboardScaffold
      title={title}
      subtitle={subtitle}
      nav={nav}
      redirectTo={redirectTo}
      allowedRoles={allowedRoles}
      badge={badge}
    />
  );
}
