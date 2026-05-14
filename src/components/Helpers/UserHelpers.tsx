import { UserDetail } from "@/lib/api.types";
import { UserDetailsModal } from "../Modals/UserDetailModal";
import {

  Mail,
  Phone,
  Calendar,

} from "lucide-react";

export function CustomerRow({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-slate-400">
        {icon}
      </div>

      <div className="truncate text-sm font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}

export function SmallStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-2xl font-extrabold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
      <div className="text-sm font-medium text-slate-500">
        {label}
      </div>

      <div className="max-w-[60%] text-right text-sm font-semibold text-slate-900">
        {value || "—"}
      </div>
    </div>
  );
}

export function formatMoney(
  cents: number,
  currency: string = "USD"
) {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency,
    }
  ).format(cents / 100);
}

/* ================= SKELETON ================= */

export function UsersSkeleton() {
  return (
    <div
      className="
        grid animate-pulse grid-cols-1 gap-5
        md:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-4
      "
    >
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-80 rounded-3xl bg-muted"
        />
      ))}
    </div>
  );
}




export function UserCard({
  user,
}: {
  user: UserDetail;
}) {
  const joinedDate = new Date(user.createdAt);

  const hasOrders =
    (user.orderStats?.totalOrders || 0) > 0;

  return (
    <div
      className="
        overflow-hidden rounded-3xl border border-slate-200
        bg-white shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
      "
    >
      <div className="h-1 w-full bg-[var(--neon-green)]" />

      <div className="p-5">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {user.firstName} {user.lastName}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />

              {joinedDate.toLocaleDateString()}
            </div>
          </div>

          <div
            className={`
              rounded-full border px-3 py-1
              text-xs font-bold uppercase

              ${
                hasOrders
                  ? `
                    border-emerald-200
                    bg-emerald-100
                    text-emerald-700
                  `
                  : `
                    border-slate-200
                    bg-slate-100
                    text-slate-600
                  `
              }
            `}
          >
            {hasOrders
              ? "Active"
              : "Inactive"}
          </div>
        </div>

        {/* USER INFO */}
        <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4">
          <CustomerRow
            icon={<Mail className="h-4 w-4" />}
            value={user.email}
          />

          <CustomerRow
            icon={<Phone className="h-4 w-4" />}
            value={`${user.phoneCountryCode} ${user.phoneNumber}`}
          />
        </div>

        {/* STATS */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <SmallStat
            label="Orders"
            value={
              user.orderStats?.totalOrders || 0
            }
          />

          <SmallStat
            label="Spent"
            value={formatMoney(
              user.orderStats?.totalSpent || 0,
              user.lastOrder?.currency ||
                "USD"
            )}
          />
        </div>


        {/* FOOTER */}
        <div className="mt-6 flex justify-end">
          <UserDetailsModal user={user} />
        </div>
      </div>
    </div>
  );
}