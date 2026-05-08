import { DashboardLayoutRoute } from "@/components/Users/DashboardLayoutRoute";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "My Dashboard — HNP" }],
  }),
  component: DashboardLayoutRoute,
});
