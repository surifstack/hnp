import { createFileRoute } from "@tanstack/react-router";
import { QrPage } from "@/components/QrPage";

export const Route = createFileRoute("/qr")({
  head: () => ({
    meta: [
      { title: "Hot Neon Posters — Scanned" },
      {
        name: "description",
        content: "Welcome — you scanned a Hot Neon Posters QR code.",
      },
    ],
  }),
  component: QrPage,
});




