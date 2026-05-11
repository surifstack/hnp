import { useMemo } from "react";
import { useAdminStore } from "@/hooks/useAdminStore";
import type { HnpOrderStatus } from "@/lib/hnp.types";
import { CentMoney, OrderStatus } from "@/lib/data";

export function OrderComponents() {
  const orders = useAdminStore((s) => s.orders);
  const setOrderStatus = useAdminStore((s) => s.setOrderStatus);

  const sorted = useMemo(
    () => [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders],
  );

  return (
    <div className="space-y-4">
      <section className="userdash-surface rounded-2xl p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Change order status (dummy).</p>
      </section>

      <section className="userdash-surface overflow-hidden rounded-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">Order list</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Order</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Items</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((o) => (
                <tr key={o.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold">{o.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{o.customerName}</div>
                    <div className="text-xs text-muted-foreground">{o.customerEmail}</div>
                  </td>
                  <td className="px-4 py-3">{o.itemsCount}</td>
                  <td className="px-4 py-3">{CentMoney(o.totalCents)}</td>
                  <td className="px-4 py-3">
                    <select
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium shadow-sm"
                      value={o.status}
                      onChange={(e) => setOrderStatus(o.id, e.target.value as HnpOrderStatus)}
                    >
                      {OrderStatus.map((s) => (
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
      </section>
    </div>
  );
}
