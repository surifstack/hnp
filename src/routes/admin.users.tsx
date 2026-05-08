import { AdminUsersComponents } from "@/components/Admin/AdminUsersComponents";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Admin Users — MININOTE" }] }),
  component: AdminUsersComponents,
});


