import { useMemo, useState } from "react";
import { useAdminStore } from "@/hooks/useAdminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function EmployeeComponents() {
  const employees = useAdminStore((s) => s.employees);
  const addEmployee = useAdminStore((s) => s.addEmployee);
  const toggleEmployeeActive = useAdminStore((s) => s.toggleEmployeeActive);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const sorted = useMemo(
    () => [...employees].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [employees],
  );

  return (
    <div className="space-y-4">
      <section className="userdash-surface rounded-2xl p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create and manage employees (dummy).</p>
      </section>

      <section className="userdash-surface rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-slate-900">Add employee</h2>
        <form
          className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !email.trim()) return;
            addEmployee({ name: name.trim(), email: email.trim() });
            setName("");
            setEmail("");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="emp_name">Name</Label>
            <Input
              id="emp_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emp_email">Email</Label>
            <Input
              id="emp_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="rounded-xl"
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="userdash-neon-btn w-full rounded-xl">
              Add
            </Button>
          </div>
        </form>
      </section>

      <section className="userdash-surface overflow-hidden rounded-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">Employee list</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => (
                <tr key={e.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold">{e.name}</td>
                  <td className="px-4 py-3">{e.role}</td>
                  <td className="px-4 py-3">{e.email}</td>
                  <td className="px-4 py-3">
                    <span className={"userdash-chip " + (e.active ? "userdash-chip--neon" : "")}>
                      {e.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl bg-white"
                      onClick={() => toggleEmployeeActive(e.id)}
                    >
                      {e.active ? "Disable" : "Enable"}
                    </Button>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                    No employees yet
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
