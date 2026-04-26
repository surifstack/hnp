import { SignIn } from "@/components/SignIn";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [{ title: "Sign In — Hot Neon Posters" }],
  }),
  component: SignInPage,
});
function SignInPage() {   
const search = Route.useSearch();

return <SignIn search={search} />; 
}


