import { createFileRoute } from "@tanstack/react-router";
import { ProductInfoPage } from "@/components/ProductInfoPage";

export const Route = createFileRoute("/products/$slug/")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} — Hot Neon Posters` }],
  }),
  component: ProductBySlugIndex,
});

function ProductBySlugIndex() {
  const { slug } = Route.useParams();
  return <ProductInfoPage slug={slug} />;
}

