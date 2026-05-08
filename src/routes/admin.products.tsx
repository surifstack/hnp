import { AdminProductsComponents } from "@/components/Admin/AdminProductsComponents";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Admin Products — HNP" }] }),
  component: AdminProductsComponents,
});




