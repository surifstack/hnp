import { Products } from "@/components/Products";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [{ title: "Products — Hot Neon Posters" }],
  }),
  component: Products,
});


