import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$slug/order")({
  component: ProductOrder,
});

function ProductOrder() {
  return <Outlet />;
}
