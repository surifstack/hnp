import { createFileRoute } from "@tanstack/react-router";
import { Shield, Users, Package, ClipboardList, UserRound } from "lucide-react";
import { HnpLayout } from "@/components/hnp/HnpLayout";
import { requireRoles } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => requireRoles(["ADMIN"], location.href),
  component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
  return (
    <HnpLayout
      title="Admin"
      subtitle="Full access"
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
