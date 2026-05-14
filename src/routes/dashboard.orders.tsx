import { DashboardOrdersComponents } from "@/components/Users/DashboardOrdersComponents";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/orders")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab:
      search.tab === "success" ||
      search.tab === "current" ||
      search.tab === "history" ||
      search.tab === "cancelled"
        ? search.tab
        : "success",
    page:
      typeof search.page === "number"
        ? search.page
        : typeof search.page === "string"
          ? Number(search.page) || 1
          : 1,
  }),

  head: () => ({
    meta: [{ title: "Orders — HNP" }],
  }),

  component: DashboardOrdersPage,
});

function DashboardOrdersPage() {
  const search = Route.useSearch();

  return <DashboardOrdersComponents tab={search.tab} />;
}
