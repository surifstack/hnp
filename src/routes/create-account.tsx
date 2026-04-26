import { CreateAccount } from "@/components/CreateAccount";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-account")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [{ title: "Create Account — Hot Neon Posters" }],
  }),
  component: CreateAccountPage,
});

function CreateAccountPage() {   
const search = Route.useSearch();

return <CreateAccount search={search} />; 
}
