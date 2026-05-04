import { createFileRoute } from "@tanstack/react-router";
import { useAdminStore } from "@/hooks/useAdminStore";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Admin Users — MININOTE" }] }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const users = useAdminStore((s) => s.users);
  const toggleUserStatus = useAdminStore((s) => s.toggleUserStatus);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-md">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Block/unblock users (dummy).</p>
      </div>

      <div className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-md">
        <div className="border-b-2 border-black px-5 py-3">
          <div className="text-sm font-extrabold uppercase tracking-widest">User list</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Name</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Email</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 font-extrabold uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t-2 border-black/10">
                  <td className="px-4 py-3 font-semibold">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-flex rounded-full border-2 border-black px-2 py-0.5 text-xs font-extrabold uppercase tracking-widest " +
                        (u.status === "ACTIVE"
                          ? "bg-[var(--neon-green)] text-black"
                          : "bg-white text-black")
                      }
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-2 border-black"
                      onClick={() => toggleUserStatus(u.id)}
                    >
                      {u.status === "ACTIVE" ? "Block" : "Unblock"}
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                    No users
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
