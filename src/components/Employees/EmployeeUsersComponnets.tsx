import { Link, useNavigate } from "@tanstack/react-router";

import {
  Eye,
  MoreVertical,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Search,
  User2,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSessionStore } from "@/hooks/useSessionStore";

import { apiJson } from "@/lib/api";

import type { Pagination } from "@/lib/api.types";
import { getCountryOption } from "@/config/languages";

/* ================= TYPES ================= */

type UserDetail = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  createdAt: string;
  updatedAt: string;
  orderStats?: {
    totalOrders: number;
    totalSpent: number;
    completedOrders: number;
    cancelledOrders: number;
  };
  lastOrder?: {
    _id: string;
    createdAt: string;
    total: number;
    currency: string;
  };
};

type UsersResponse = {
  status: number;
  message: string;
  pagination: Pagination;
  data: UserDetail[];
};

type UserTab = "all" | "active" | "inactive";

/* ================= PAGE ================= */

export function EmployeeUsersComponnets({
  tab = "all",
}: {
  tab?: string;
}) {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);

  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const currentTab: UserTab = useMemo(() => {
    if (tab === "all" || tab === "active" || tab === "inactive") {
      return tab;
    }
    return "all";
  }, [tab]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const queryParams = new URLSearchParams({
          limit: "10",
          offset: "0",
          ...(debouncedSearch && { search: debouncedSearch }),
          ...(currentTab !== "all" && { status: currentTab }),
        });

        const response = await apiJson<UsersResponse>(
          `/employee/users?${queryParams}`
        );

        if (cancelled) return;

        setUsers(response.data ?? []);
        setPagination(response.pagination);
      } catch (err) {
        if (cancelled) return;
        setError("Failed to load users");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentTab, user?.id, debouncedSearch]);
  /* ================= LOADING ================= */
  if (loading) {
    return <UsersSkeleton />;
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-500">
        {error}
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-5">
      {/* HEADER */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Customer Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View and manage all customer accounts
            </p>
          </div>

          <div className="flex gap-3">
            {/* SEARCH */}
            <div className="relative w-full sm:w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-2xl border-slate-200 pl-10 focus:ring-[var(--neon-green)]"
              />
            </div>

            {/* FILTER */}
            <Select
              value={currentTab}
              onValueChange={(value) => {
                navigate({
                  to: "/dashboard/users",
                  search: { tab: value },
                });
              }}
            >
              <SelectTrigger className="h-11 w-[140px] rounded-2xl border-slate-200 bg-white font-medium shadow-sm">
                <SelectValue placeholder="Filter users" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-200">
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active Users</SelectItem>
                <SelectItem value="inactive">Inactive Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* USERS LIST */}
      <section className="space-y-4">
        {users.map((userDetail) => (
          <UserCard key={userDetail._id} user={userDetail} />
        ))}

        {/* EMPTY STATE */}
        {!users.length && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">No users found</h2>
            <p className="mt-2 text-sm text-slate-500">
              {searchTerm
                ? `No users matching "${searchTerm}"`
                : "No users available in this section."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

/* ================= USER CARD ================= */

function UserCard({ user }: { user: UserDetail }) {
  const joinedDate = new Date(user.createdAt);
  const hasOrderStats = user.orderStats && user.orderStats.totalOrders > 0;

  return (
    <div
      className="
        overflow-hidden rounded-3xl border border-slate-200
        bg-white shadow-sm transition-all duration-300
        hover:-translate-y-0.5 hover:shadow-xl
      "
    >
      <div className="h-1 w-full bg-[var(--neon-green)]" />

      <div className="p-6">
        <div className="flex flex-col gap-6">
          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-slate-900">
                {user.firstName} {user.lastName}
              </h3>
              <div
                className={`
                  rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide
                  ${
                    hasOrderStats
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }
                `}
              >
                {hasOrderStats ? "Active" : "Inactive"}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              Joined {joinedDate.toLocaleDateString()}
            </div>
          </div>

          {/* USER INFORMATION GRID */}
          <div className="grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-4 lg:grid-cols-4">
            <UserInfoRow
              icon={<User className="h-4 w-4" />}
              label="Customer ID"
              value={user._id.slice(-8)}
            />
              <UserInfoRow
              icon={<User2 className="h-4 w-4" />}
              label="Name"
              value={user.firstName + " " + user.lastName}
            />
            <UserInfoRow
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={user.email}
            />
            <UserInfoRow
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={user.phoneCountryCode +" "+ user.phoneNumber}
            />
         
          </div>

          {/* ORDER STATS (if available) */}
          {user.orderStats && user.orderStats.totalOrders > 0 && (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                icon={<ShoppingBag className="h-4 w-4" />}
                label="Total Orders"
                value={user.orderStats.totalOrders}
              />
              <StatCard
                icon={<DollarSign className="h-4 w-4" />}
                label="Total Spent"
                value={formatMoney(
                  user.orderStats.totalSpent,
                  user.lastOrder?.currency || "USD"
                )}
              />
              <StatCard
                label="Completed"
                value={user.orderStats.completedOrders || 0}
              />
              <StatCard
                label="Cancelled"
                value={user.orderStats.cancelledOrders || 0}
              />
            </div>
          )}

          {/* LAST ORDER INFO */}
          {user.lastOrder && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
                Last Order
              </h4>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-600">
                    Order #{user.lastOrder._id.slice(-8)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(user.lastOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {formatMoney(user.lastOrder.total, user.lastOrder.currency)}
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="
                    rounded-2xl border-slate-200
                    bg-white hover:bg-slate-100
                  "
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Full Details
                </Button>
              </DialogTrigger>

              <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200 sm:max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Customer Details
                  </DialogTitle>
                  <DialogDescription>
                    Complete customer information and order history.
                  </DialogDescription>
                </DialogHeader>

                {/* PROFILE SECTION */}
                <div className="mt-6 rounded-3xl bg-gradient-to-r from-[var(--neon-green)]/10 to-transparent p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Customer since {joinedDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div
                      className={`
                        rounded-full border px-4 py-2 text-sm font-bold uppercase
                        ${
                          hasOrderStats
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }
                      `}
                    >
                      {hasOrderStats ? "Active Customer" : "Inactive Customer"}
                    </div>
                  </div>
                </div>

                {/* CONTACT INFORMATION */}
                <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      Contact Information
                    </h3>
                    <div className="mt-4 space-y-3">
                      <InfoRow label="Full Name" value={`${user.firstName} ${user.firstName}`} />
                      <InfoRow label="Email Address" value={user.email} />
                      <InfoRow label="Phone Number" value={user.phoneCountryCode + " " +user.phoneNumber} />
                      
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      Account Information
                    </h3>
                    <div className="mt-4 space-y-3">
                      <InfoRow label="User ID" value={user._id} />
                      <InfoRow label="Account Created" value={joinedDate.toLocaleString()} />
                      <InfoRow label="Last Updated" value={new Date(user.updatedAt).toLocaleString()} />
                    </div>
                  </div>
                </div>

                {/* ORDER STATISTICS */}
                {user.orderStats && user.orderStats.totalOrders > 0 && (
                  <>
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-slate-900">
                        Order Statistics
                      </h3>
                      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <SummaryCard
                          label="Total Orders"
                          value={user.orderStats.totalOrders}
                        />
                        <SummaryCard
                          label="Total Spent"
                          value={formatMoney(
                            user.orderStats.totalSpent,
                            user.lastOrder?.currency || "USD"
                          )}
                        />
                        <SummaryCard
                          label="Completed Orders"
                          value={user.orderStats.completedOrders || 0}
                        />
                        <SummaryCard
                          label="Cancelled Orders"
                          value={user.orderStats.cancelledOrders || 0}
                        />
                      </div>
                    </div>

                    {/* LAST ORDER DETAILS */}
                    {user.lastOrder && (
                      <div className="mt-8">
                        <h3 className="text-xl font-bold text-slate-900">
                          Last Order Information
                        </h3>
                        <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50/50 p-5">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <InfoRow
                              label="Order ID"
                              value={user.lastOrder._id}
                            />
                            <InfoRow
                              label="Order Date"
                              value={new Date(user.lastOrder.createdAt).toLocaleString()}
                            />
                            <InfoRow
                              label="Order Total"
                              value={formatMoney(
                                user.lastOrder.total,
                                user.lastOrder.currency
                              )}
                            />
                          </div>
                          <div className="mt-4">
                            <Button
                              asChild
                              variant="outline"
                              className="rounded-2xl"
                            >
                              <Link to={`/dashboard/orders?search=${user._id}`}>
                                View All Orders
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* NO ORDERS MESSAGE */}
                {(!user.orderStats || user.orderStats.totalOrders === 0) && (
                  <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
                    <ShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-3 text-lg font-semibold text-slate-900">
                      No Orders Yet
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      This customer hasn't placed any orders.
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function UserInfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3">
      <div className="text-slate-400">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="truncate text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      {icon && <div className="mb-2 text-slate-500">{icon}</div>}
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-bold text-slate-900 capitalize">
        {value}
      </p>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`
        rounded-3xl border p-5
        ${
          highlight
            ? "border-[var(--neon-green)]/20 bg-[var(--neon-green)]/10"
            : "border-slate-200 bg-white"
        }
      `}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-extrabold text-slate-900 capitalize">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
      <div className="text-sm font-medium text-slate-500 capitalize">
        {label}
      </div>
      <div className="max-w-[60%] text-right text-sm font-semibold text-slate-900">
        {value || "—"}
      </div>
    </div>
  );
}

function formatMoney(cents: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(cents / 100);
}

/* ================= SKELETON ================= */

function UsersSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-28 rounded-3xl bg-muted" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 rounded-3xl bg-muted" />
      ))}
    </div>
  );
}