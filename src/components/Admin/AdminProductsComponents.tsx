import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAdminProductsStore } from "@/hooks/useAdminProductsStore";
import { CentMoney } from "@/lib/data";

export function AdminProductsComponents() {
  const products = useAdminProductsStore((s) => s.products);
  const loading = useAdminProductsStore((s) => s.loading);
  const error = useAdminProductsStore((s) => s.error);
  const hiddenById = useAdminProductsStore((s) => s.hiddenById);
  const fetchProducts = useAdminProductsStore((s) => s.fetchProducts);
  const toggleHidden = useAdminProductsStore((s) => s.toggleHidden);

  useEffect(() => {
    if (!products && !loading) void fetchProducts();
  }, [fetchProducts, loading, products]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-md">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide">Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fetched from API. Hide/unhide is local (dummy).
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-md">
        <div className="border-b-2 border-black px-5 py-3">
          <div className="text-sm font-extrabold uppercase tracking-widest">Product list</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Name</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Slug</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">SKUs</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Price/Set</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td className="px-4 py-6 text-red-600" colSpan={6}>
                    {error}
                  </td>
                </tr>
              ) : null}
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                    Loading products…
                  </td>
                </tr>
              ) : null}
              {(products ?? []).map((p) => {
                const isHidden = Boolean(hiddenById[p.id]);
                const skuList = Object.values(p.skus ?? {});
                return (
                  <tr key={p.id} className="border-t-2 border-black/10">
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3">{p.slug}</td>
                    <td className="px-4 py-3">{skuList.length ? skuList.join(", ") : "—"}</td>
                    <td className="px-4 py-3">{CentMoney(p.pricing.pricePerSetCents)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          "inline-flex rounded-full border-2 border-black px-2 py-0.5 text-xs font-extrabold uppercase tracking-widest " +
                          (!isHidden ? "bg-[var(--neon-green)] text-black" : "bg-white text-black")
                        }
                      >
                        {!isHidden ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-2 border-black"
                        onClick={() => toggleHidden(p.id)}
                      >
                        {!isHidden ? "Hide" : "Unhide"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {!loading && (products ?? []).length === 0 && !error ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                    No products
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}