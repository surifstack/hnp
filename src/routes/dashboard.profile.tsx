import { createFileRoute } from "@tanstack/react-router";
import { DashboardProfileComponents } from "@/components/Users/DashboardProfileComponents";


export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — HNP" }] }),
  component: DashboardProfileComponents,
});


