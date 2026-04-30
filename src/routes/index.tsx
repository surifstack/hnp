import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { VideoBlock } from "@/components/VideoBlock";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <div className="max-w-2xl mx-auto">
        <VideoBlock />
      </div>
    </SiteLayout>
  );
}


