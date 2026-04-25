import { createFileRoute } from "@tanstack/react-router";
import { ProofPage } from "@/components/ProofPage";

export const Route = createFileRoute("/products/$slug/proof")({
  head: ({ params }) => ({
    meta: [{ title: `Your Proof — ${params.slug}` }],
  }),
  component: ProductProof,
});

function ProductProof() {
  const { slug } = Route.useParams();
  return <ProofPage slug={slug} />;
}
