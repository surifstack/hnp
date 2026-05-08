import { EmployeeOrdersCompoonents } from "@/components/Employees/EmployeeOrdersCompoonents";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/employee/orders")({
  head: () => ({ meta: [{ title: "Employee Orders — HNP" }] }),
  component: EmployeeOrdersCompoonents,
});




