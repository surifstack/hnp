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
      <section className="userdash-surface rounded-2xl p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fetched from API. Hide/unhide is local (dummy).
        </p>
      </section>

      <section className="userdash-surface overflow-hidden rounded-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">Product list</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Slug</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">SKUs</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                  Price/Set
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Action</th>
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
                  <tr key={p.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3">{p.slug}</td>
                    <td className="px-4 py-3">{skuList.length ? skuList.join(", ") : "—"}</td>
                    <td className="px-4 py-3">{CentMoney(p.pricing.pricePerSetCents)}</td>
                    <td className="px-4 py-3">
                      <span className={"userdash-chip " + (!isHidden ? "userdash-chip--neon" : "")}>
                        {!isHidden ? "Visible" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl bg-white"
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
      </section>
    </div>
  );
}
