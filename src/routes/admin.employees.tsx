import { EmployeeComponents } from "@/components/Admin/EmployeeComponents";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/employees")({
  head: () => ({ meta: [{ title: "Admin Employees — HNP" }] }),
  component: EmployeeComponents,
});


