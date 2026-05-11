import { createFileRoute } from "@tanstack/react-router";

import { DashboardHomeComponets } from "@/components/Users/DashboardHomeComponets";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [{ title: "Dashboard — HNP" }],
  }),
  component: DashboardHomeComponets,
});


