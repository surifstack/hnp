import { createFileRoute } from "@tanstack/react-router";
import { useEmployeeStore } from "@/hooks/useEmployeeStore";

export const Route = createFileRoute("/employee/")({
  head: () => ({ meta: [{ title: "Employee — MININOTE" }] }),
  component: EmployeeOverviewPage,
});

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-md">
      <div className="text-xs font-bold uppercase tracking-widest text-black/70">{label}</div>
      <div className="mt-1 text-3xl font-extrabold">{value}</div>
    </div>
  );
}

function EmployeeOverviewPage() {
  const users = useEmployeeStore((s) => s.users);
  const orders = useEmployeeStore((s) => s.orders);
  const newOrders = orders.filter((o) => o.status === "NEW").length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-md">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide">Employee Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Orders + users only (dummy)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="New Orders" value={`${newOrders}`} />
        <StatCard label="Total Orders" value={`${orders.length}`} />
        <StatCard label="Total Users" value={`${users.length}`} />
      </div>
    </div>
  );
}
