import { createFileRoute } from "@tanstack/react-router";
import { OrderSetupPage } from "@/components/OrderSetupPage";

export const Route = createFileRoute("/products/$slug/order/")({
  head: ({ params }) => ({
    meta: [{ title: `Order setup — ${params.slug}` }],
  }),
  component: ProductOrderIndex,
});

function ProductOrderIndex() {
  const { slug } = Route.useParams();
  return <OrderSetupPage slug={slug} />;
}
