import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import { useTranslation } from "react-i18next";
import videoPoster from "@/assets/video-poster.webp";

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
  component: QrLanding,
});

function QrLanding() {
  const router = useRouter();
  const { t } = useTranslation();
  const fetchProducts = useCatalogStore((s) => s.fetchProducts);
  const products = useCatalogStore((s) => s.products);
  const loading = useCatalogStore((s) => s.loading);
  const error = useCatalogStore((s) => s.error);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <QrVideoHero />

        <div className="bg-white/95 rounded-2xl p-5 shadow-xl border-2 border-black space-y-3">
          <h1 className="text-xl font-extrabold uppercase tracking-wide text-center">
            {t("common.chooseProduct")}
          </h1>
          {loading && <p className="text-sm text-muted-foreground text-center">Loading…</p>}
          {error && <p className="text-sm text-destructive text-center">{error}</p>}

          <div className="grid gap-3 sm:grid-cols-2">
            {(products ?? []).map((p) => (
              <div
                key={p.id}
                className="rounded-xl border-2 border-black/80 p-4 bg-white space-y-2"
              >
                <div>
                  <p className="text-sm font-extrabold uppercase tracking-wide">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full font-bold uppercase"
                    onClick={() =>
                      router.navigate({ to: "/products/$slug", params: { slug: p.slug } })
                    }
                  >
                    {t("common.info")}
                  </Button>
                  <Button
                    className="w-full font-bold uppercase"
                    onClick={() =>
                      router.navigate({ to: "/products/$slug/order", params: { slug: p.slug } })
                    }
                  >
                    {t("common.enterOrder")}
                  </Button>
                </div>
              </div>
            ))}

            {!loading && (products?.length ?? 0) === 0 && (
              <p className="text-sm text-muted-foreground text-center">No products available.</p>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function QrVideoHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-black bg-black shadow">
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={videoPoster}
        className="block aspect-video w-full object-cover"
      >
        <source src="/HNP_video_COMPRESSED.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
