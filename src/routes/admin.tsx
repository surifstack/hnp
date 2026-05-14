import { createFileRoute } from "@tanstack/react-router";
import { Shield, Users, Package, ClipboardList, UserRound } from "lucide-react";
import { HnpLayout } from "@/components/hnp/HnpLayout";
import { requireRoles } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  // IMPORTANT:
  // Auth is cookie-based on the API domain. During SSR the app server does not
  // receive the API cookie, so server-side role checks will incorrectly
  // redirect logged-in users to /signin on hard refresh.
  // We therefore enforce role access on the client only.
  beforeLoad: ({ location }) =>
    typeof window === "undefined" ? undefined : requireRoles(["ADMIN"], location.href),
  component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
  return (
    <HnpLayout
      title="Admin"
      subtitle="Full access"
      redirectTo="/admin"
      allowedRoles={["ADMIN"]}
      badge="Admin"
      nav={[
        { to: "/admin", label: "Overview", icon: <Shield /> },
        { to: "/admin/employees", label: "Employees", icon: <Users /> },
        { to: "/admin/products", label: "Products", icon: <Package /> },
        { to: "/admin/orders", label: "Orders", icon: <ClipboardList /> },
        { to: "/admin/users", label: "Users", icon: <UserRound /> },
      ]}
    />
  );
}
