import { AdminOverviewComponents } from "@/components/Admin/AdminOverviewComponents";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin — HNP" }] }),
  component: AdminOverviewComponents,
});


