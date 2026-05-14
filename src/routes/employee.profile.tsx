import { createFileRoute } from "@tanstack/react-router";
import { ProfileManagementComponents } from "@/components/Profile/ProfileManagementComponents";

export const Route = createFileRoute("/employee/profile")({
  head: () => ({ meta: [{ title: "Employee Profile — HNP" }] }),
  component: ProfileManagementComponents,
});

