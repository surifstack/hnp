import { useEffect } from "react";
import { useAdminStore } from "@/hooks/useAdminStore";
import { useAdminProductsStore } from "@/hooks/useAdminProductsStore";
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="userdash-surface rounded-2xl p-5">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-extrabold">{value}</div>
    </div>
  );
}

export function AdminOverviewComponents() {
  const employees = useAdminStore((s) => s.employees);
  const users = useAdminStore((s) => s.users);
  const orders = useAdminStore((s) => s.orders);

  const activeEmployees = employees.filter((e) => e.active).length;
  const newOrders = orders.filter((o) => o.status === "NEW").length;

  const products = useAdminProductsStore((s) => s.products);
  const hiddenById = useAdminProductsStore((s) => s.hiddenById);
  const productsLoading = useAdminProductsStore((s) => s.loading);
  const fetchProducts = useAdminProductsStore((s) => s.fetchProducts);

  useEffect(() => {
    if (!products && !productsLoading) void fetchProducts();
  }, [fetchProducts, products, productsLoading]);

  const visibleProducts = (products ?? []).filter((p) => !hiddenById[p.id]).length;

  return (
    <div className="space-y-4">
      <section className="userdash-surface rounded-2xl p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dummy data dashboard (Zustand). No auth wired yet.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Active Employees" value={`${activeEmployees}`} />
        <StatCard label="Visible Products" value={productsLoading ? "…" : `${visibleProducts}`} />
        <StatCard label="New Orders" value={`${newOrders}`} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard label="Total Users" value={`${users.length}`} />
        <StatCard label="Total Orders" value={`${orders.length}`} />
      </div>
    </div>
  );
}
