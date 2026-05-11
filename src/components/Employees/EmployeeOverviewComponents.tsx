import { useEmployeeOrdersStore } from "@/hooks/useEmployeeOrdersStore";
import { useEmployeeUsersStore } from "@/hooks/useEmployeeUsersStore";

export function EmployeeOverviewComponents() {
  const users = useEmployeeUsersStore((s) => s.users);
  const orders = useEmployeeOrdersStore((s) => s.orders);
  const newOrders = orders.filter((o) => o.status === "In Progress").length;

  return (
    <div className="space-y-4">
      <section className="userdash-surface rounded-2xl p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Employee Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Orders + users only (dummy)</p>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="New Orders" value={`${newOrders}`} />
        <StatCard label="Total Orders" value={`${orders.length}`} />
        <StatCard label="Total Users" value={`${users.length}`} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="userdash-surface rounded-2xl p-5">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-3xl font-extrabold">{value}</div>
    </div>
  );
}
