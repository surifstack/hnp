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
      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-md">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide">Employees</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create and manage employees (dummy).</p>
      </div>

      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-md">
        <h2 className="text-sm font-extrabold uppercase tracking-widest">Add employee</h2>
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
            <Input id="emp_name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emp_email">Email</Label>
            <Input
              id="emp_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full bg-[var(--neon-green)] text-black hover:opacity-90"
            >
              Add
            </Button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-md">
        <div className="border-b-2 border-black px-5 py-3">
          <div className="text-sm font-extrabold uppercase tracking-widest">Employee list</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Name</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Role</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Email</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((e) => (
                <tr key={e.id} className="border-t-2 border-black/10">
                  <td className="px-4 py-3 font-semibold">{e.name}</td>
                  <td className="px-4 py-3">{e.role}</td>
                  <td className="px-4 py-3">{e.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex rounded-full border-2 border-black px-2 py-0.5 text-xs font-extrabold uppercase tracking-widest " +
                        (e.active ? "bg-[var(--neon-green)] text-black" : "bg-white text-black")
                      }
                    >
                      {e.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-2 border-black"
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
      </div>
    </div>
  );
}