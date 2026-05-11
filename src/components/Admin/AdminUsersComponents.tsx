import { useAdminStore } from "@/hooks/useAdminStore";
import { Button } from "@/components/ui/button";
export function AdminUsersComponents() {
  const users = useAdminStore((s) => s.users);
  const toggleUserStatus = useAdminStore((s) => s.toggleUserStatus);

  return (
    <div className="space-y-4">
      <section className="userdash-surface rounded-2xl p-5">
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">Block/unblock users (dummy).</p>
      </section>

      <section className="userdash-surface overflow-hidden rounded-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">User list</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "userdash-chip " + (u.status === "ACTIVE" ? "userdash-chip--neon" : "")
                      }
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl bg-white"
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
      </section>
    </div>
  );
}
