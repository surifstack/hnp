import { OrderSuccessPage } from "@/components/OrderSuccessPage";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/order-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    orderId: typeof search.orderId === "string" ? search.orderId : "",
  }),
  head: () => ({ meta: [{ title: "Order Success — MININOTE" }] }),
  component: () => {
    const { orderId } = Route.useSearch();
    return <OrderSuccessPage orderId={orderId} />;
  },
});
