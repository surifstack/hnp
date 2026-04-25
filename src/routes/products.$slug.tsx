import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$slug")({
  component: ProductBySlugLayout,
});

function ProductBySlugLayout() {
  return <Outlet />;
}
