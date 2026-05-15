import { AdminContactsComponents } from "@/components/Admin/AdminContactsComponents";
import { AdminProductsComponents } from "@/components/Admin/AdminProductsComponents";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/contacts")({
  head: () => ({ meta: [{ title: "Admin Contcats — HNP" }] }),
  component: AdminContactsComponents,
});




