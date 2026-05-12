import { AdminOrdersComponents } from "@/components/Admin/AdminOrdersComponents";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Admin Orders — HNP" }] }),
  component: AdminOrdersComponents,
});

