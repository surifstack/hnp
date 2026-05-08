import { EmployeeOverviewComponents } from "@/components/Employees/EmployeeOverviewComponents";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/employee/")({
  head: () => ({ meta: [{ title: "Employee — MININOTE" }] }),
  component: EmployeeOverviewComponents,
});



