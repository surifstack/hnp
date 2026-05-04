import { createFileRoute } from "@tanstack/react-router";
import { TextApprovalFlowPage } from "@/components/TextApprovalFlowPage";

export const Route = createFileRoute("/products/$slug/order/text")({
  head: ({ params }) => ({
    meta: [{ title: `Text approval — ${params.slug}` }],
  }),
  component: ProductOrderText,
});

function ProductOrderText() {
  const { slug } = Route.useParams();
  return <TextApprovalFlowPage slug={slug} />;
}
