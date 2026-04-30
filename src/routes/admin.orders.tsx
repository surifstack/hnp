import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useAdminStore } from "@/hooks/useAdminStore";
import type { HnpOrderStatus } from "@/lib/hnp.types";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Admin Orders — MININOTE" }] }),
  component: AdminOrdersPage,
});

function money(cents: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
}

const statuses: HnpOrderStatus[] = ["NEW", "PROCESSING", "SHIPPED", "CANCELLED"];

function AdminOrdersPage() {
  const orders = useAdminStore((s) => s.orders);
  const setOrderStatus = useAdminStore((s) => s.setOrderStatus);

  const sorted = useMemo(
    () => [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders],
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-md">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Change order status (dummy).</p>
      </div>

      <div className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-md">
        <div className="border-b-2 border-black px-5 py-3">
          <div className="text-sm font-extrabold uppercase tracking-widest">Order list</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Order</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Customer</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Items</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Total</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Updated</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((o) => (
                <tr key={o.id} className="border-t-2 border-black/10">
                  <td className="px-4 py-3 font-semibold">{o.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{o.customerName}</div>
                    <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3">{o.itemsCount}</td>
                  <td className="px-4 py-3">{money(o.totalCents)}</td>
                  <td className="px-4 py-3">
                    <select
                      className="h-9 rounded-md border-2 border-black bg-white px-2 text-sm font-semibold"
                      value={o.status}
                      onChange={(e) => setOrderStatus(o.id, e.target.value as HnpOrderStatus)}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(o.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {sorted.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={6}>
                    No orders
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
