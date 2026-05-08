import { OrderComponents } from "@/components/Admin/OrderComponents";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Admin Orders — HNP" }] }),
  component: OrderComponents,
});

