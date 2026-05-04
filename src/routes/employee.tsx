import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, UserRound } from "lucide-react";
import { HnpLayout } from "@/components/hnp/HnpLayout";

export const Route = createFileRoute("/employee")({
  component: EmployeeLayoutRoute,
});

function EmployeeLayoutRoute() {
  return (
    <HnpLayout
      title="Employee"
      subtitle="Limited access (dummy data)"
      nav={[
        { to: "/employee", label: "Overview", icon: <ClipboardList /> },
        { to: "/employee/orders", label: "Orders", icon: <ClipboardList /> },
        { to: "/employee/users", label: "Users", icon: <UserRound /> },
      ]}
    />
  );
}
