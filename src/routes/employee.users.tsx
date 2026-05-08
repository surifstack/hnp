import { EmployeeUsersComponnets } from "@/components/Employees/EmployeeUsersComponnets";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/employee/users")({
  head: () => ({ meta: [{ title: "Employee Users — HNP" }] }),
  component: EmployeeUsersComponnets,
});


