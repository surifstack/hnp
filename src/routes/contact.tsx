import { Contact } from "@/components/Contact";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [{ title: "Contact Us — Hot Neon Posters" }],
  }),
  component: Contact,
});


