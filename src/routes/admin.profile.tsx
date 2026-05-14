import { createFileRoute } from "@tanstack/react-router";
import { ProfileManagementComponents } from "@/components/Profile/ProfileManagementComponents";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({ meta: [{ title: "Admin Profile — HNP" }] }),
  component: ProfileManagementComponents,
});

