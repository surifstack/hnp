import { AdminEmployeesComponents } from "@/components/Admin/AdminEmployeesComponents";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/employees")({
  head: () => ({ meta: [{ title: "Admin Employees — HNP" }] }),
  component: AdminEmployeesComponents,
});


