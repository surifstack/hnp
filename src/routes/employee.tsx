import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, UserRound } from "lucide-react";
import { HnpLayout } from "@/components/hnp/HnpLayout";
import { requireRoles } from "@/lib/auth";

export const Route = createFileRoute("/employee")({
  beforeLoad: ({ location }) => requireRoles(["EMPLOYEE", "ADMIN"], location.href),
  component: EmployeeLayoutRoute,
});

function EmployeeLayoutRoute() {
  return (
    <HnpLayout
      title="Employee"
      subtitle="Limited access"
      nav={[
        { to: "/employee", label: "Overview", icon: <ClipboardList /> },
        { to: "/employee/orders", label: "Orders", icon: <ClipboardList /> },
        { to: "/employee/users", label: "Users", icon: <UserRound /> },
      ]}
    />
  );
}
