import { Link, useNavigate } from "@tanstack/react-router";

import {
  Eye,
  MoreVertical,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

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

import { formatCents } from "@/components/cart/cartTotals";

import { apiJson } from "@/lib/api";

import type {
  OrderDetail,
  Pagination,
} from "@/lib/api.types";
import { getLanguageOption, getCountryOption } from "@/config/languages";

/* ================= TYPES ================= */

type OrdersResponse = {
  status: number;
  message: string;
  pagination: Pagination;
  data: OrderDetail[];
};

type OrderTab =
  | "success"
  | "current"
  | "history"
  | "cancelled";

/* ================= PAGE ================= */

export function EmployeeOrdersCompoonents({
  tab,
}: {
  tab: string;
}) {
  const navigate = useNavigate();

  const user = useSessionStore((s) => s.user);

  const [orders, setOrders] = useState<OrderDetail[]>(
    []
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const currentTab: OrderTab = useMemo(() => {
    if (
      tab === "success" ||
      tab === "current" ||
      tab === "history" ||
      tab === "cancelled"
    ) {
      return tab;
    }

    return "current";
  }, [tab]);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await apiJson<OrdersResponse>(
            `/employee/orders?type=${currentTab}&limit=10&offset=0`
          );

        if (cancelled) return;

        setOrders(response.data ?? []);
        setPagination(response.pagination);
      } catch (err) {
        if (cancelled) return;
        setError("Failed to load orders");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentTab, user?.id]);

  /* ================= LOADING ================= */

  if (loading) {
    return <OrdersSkeleton />;
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
              Orders Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View and manage all customer orders
            </p>
          </div>

          {/* FILTER */}
          <div className="w-full sm:w-[240px]">
            <Select
              value={currentTab}
              onValueChange={(value) => {
                navigate({
                  to: "/dashboard/orders",
                  search: {
                    tab: value,
                  },
                });
              }}
            >
              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white font-medium shadow-sm">
                <SelectValue placeholder="Filter orders" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-200">
                <SelectItem value="success">Success Orders</SelectItem>
                <SelectItem value="current">Current Orders</SelectItem>
                <SelectItem value="history">History Orders</SelectItem>
                <SelectItem value="cancelled">Cancelled Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* ORDERS LIST */}
      <section className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
          />
        ))}

        {/* EMPTY STATE */}
        {!orders.length ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              No orders found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              No orders available in this section.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}

/* ================= ORDER CARD ================= */

function OrderCard({
  order,
}: {
  order: OrderDetail;
}) {
  const money = formatCents(
    order.totals.total,
    order.totals.currency
  );

  const country = getCountryOption(order.countryCode) || null;
  const placed = new Date(order.createdAt);

  const statusStyles: Record<string, string> = {
    pending: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    shipped: "bg-purple-100 text-purple-700 border-purple-200",
    failed: "bg-red-100 text-red-700 border-red-200",
    payment_failed: "bg-red-100 text-red-700 border-red-200",
    payment_pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

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
          
          {/* HEADER WITH STATUS */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-bold text-slate-900">
                Order #{order._id.slice(-8)}
              </h3>
              <div
                className={`
                  rounded-full border px-3 py-1
                  text-xs font-bold uppercase tracking-wide
                  ${statusStyles[order.status]}
                `}
              >
                {order.status.replaceAll("_", " ")}
              </div>
            </div>
            <div className="text-sm text-slate-500">
              {placed.toLocaleDateString()} at {placed.toLocaleTimeString()}
            </div>
          </div>

          {/* CUSTOMER INFORMATION GRID */}
          <div className="grid grid-cols-1 gap-4 rounded-2xl bg-slate-50 p-4 lg:grid-cols-4">
            <CustomerInfoRow
              icon={<User className="h-4 w-4" />}
              label="Customer Name"
              value={`${order.customer.first_name} ${order.customer.last_name}`}
            />
            <CustomerInfoRow
              icon={<Mail className="h-4 w-4" />}
              label="Email"
              value={order.customer.email}
            />
            <CustomerInfoRow
              icon={<Phone className="h-4 w-4" />}
              label="Phone"
              value={order.customer.phone}
            />
            <CustomerInfoRow
              icon={<MapPin className="h-4 w-4" />}
              label="Country"
              value={country?.name ?? order.countryCode}
            />
          </div>

          {/* SHIPPING ADDRESS */}
          {order.address && Object.keys(order.address).length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                Shipping Address
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(order.address).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-slate-500 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>{' '}
                    <span className="font-semibold text-slate-900">
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDER SUMMARY STATS */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <StatCard
              label="Total Items"
              value={order.itemCount as number}
            />
            <StatCard
              label="Order Total"
              value={money}
            />
            <StatCard
              label="Status"
              value={order.status.replaceAll("_", " ")}
            />
            <StatCard
              label="Products"
              value={order.items?.length || 0}
            />
          </div>

          {/* PRODUCT TAGS */}
          <div className="flex flex-wrap gap-2">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="
                  rounded-full border border-slate-200
                  bg-slate-50 px-3 py-1 text-xs
                  font-medium text-slate-700
                "
              >
                {item.product?.name}
              </div>
            ))}
          </div>

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

              <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200 sm:max-w-6xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Order Details
                  </DialogTitle>
                  <DialogDescription>
                    Full order information and purchased products.
                  </DialogDescription>
                </DialogHeader>

                {/* CUSTOMER + ADDRESS SECTION */}
                <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* CUSTOMER INFORMATION */}
                  <div className="rounded-3xl border border-slate-200 p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      Customer Information
                    </h3>
                    <div className="mt-4 space-y-3">
                      <InfoRow
                        label="Full Name"
                        value={`${order.customer.first_name} ${order.customer.last_name}`}
                      />
                      <InfoRow
                        label="Email Address"
                        value={order.customer.email}
                      />
                      <InfoRow
                        label="Phone Number"
                        value={order.customer.phone}
                      />
                      <InfoRow
                        label="Country"
                        value={country?.name ?? order.customer.country}
                      />
                    </div>
                  </div>

                  {/* SHIPPING ADDRESS DETAILS */}
                  <div className="rounded-3xl border border-slate-200 p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                      Shipping Address
                    </h3>
                    <div className="mt-4 space-y-3">
                      {Object.entries(order.address ?? {}).map(
                        ([key, value]) => (
                          <InfoRow
                            key={key}
                            label={key.replace(/([A-Z])/g, ' $1').trim()}
                            value={value}
                          />
                        )
                      )}
                      {Object.keys(order.address ?? {}).length === 0 && (
                        <div className="text-sm text-slate-500">
                          No address information available
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ORDER SUMMARY */}
                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                  <SummaryCard
                    label="Total Items"
                    value={order.itemCount as number}
                  />
                  <SummaryCard
                    label="Order Status"
                    value={order.status.replaceAll("_", " ")}
                  />
                  <SummaryCard
                    label="Country"
                    value={country?.name ?? order.countryCode}
                  />
                  <SummaryCard
                    label="Total Amount"
                    value={money}
                    highlight
                  />
                </div>

                {/* ORDER ITEMS */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-slate-900">
                    Order Items
                  </h3>
                  <div className="mt-5 space-y-5">
                    {order.items?.map((item) => {
                      const itemMoney = formatCents(
                        item.pricing.total,
                        item.pricing.currency
                      );
                      const language = getLanguageOption(item.setup.languageCode);

                      return (
                        <div
                          key={item.id}
                          className="
                            rounded-3xl border border-slate-200
                            bg-slate-50/50 p-5
                          "
                        >
                          {/* PRODUCT HEADER */}
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <h4 className="text-xl font-bold text-slate-900">
                                {item.product?.name}
                              </h4>
                              <p className="mt-1 text-sm text-slate-500">
                                {item.product?.description}
                              </p>
                            </div>
                            <div className="rounded-2xl bg-[var(--neon-green)]/10 px-4 py-2 text-lg font-extrabold text-slate-900">
                              {itemMoney}
                            </div>
                          </div>

                          {/* PRODUCT CONFIGURATION */}
                          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                            <StatCard
                              label="Quantity"
                              value={item.setup.quantity}
                            />
                            <StatCard
                              label="Color PMS"
                              value={item.setup.colorPms}
                            />
                            <StatCard
                              label="Language"
                              value={language?.name ?? item.setup.languageCode}
                            />
                            <StatCard
                              label="Status"
                              value={item.status}
                            />
                          </div>

                          {/* TEXT CONTENT */}
                          <div className="mt-6">
                            <h5 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                              Text Content
                            </h5>
                            <div className="mt-3 grid gap-3 lg:grid-cols-3">
                              <TextBlock
                                title="Title Lines"
                                lines={item.text.titleLines}
                              />
                              <TextBlock
                                title="Secondary Lines"
                                lines={item.text.secondaryLines}
                              />
                              <TextBlock
                                title="Label Lines"
                                lines={item.text.labelLines}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function CustomerInfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
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
        ${highlight
          ? "border-[var(--neon-green)]/20 bg-[var(--neon-green)]/10"
          : "border-slate-200 bg-white"}
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

function TextBlock({
  title,
  lines,
}: {
  title: string;
  lines: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <h6 className="text-sm font-bold text-slate-700">
        {title}
      </h6>
      <div className="mt-3 space-y-2">
        {lines?.length ? (
          lines.map((line, index) => (
            <div
              key={index}
              className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              {line}
            </div>
          ))
        ) : (
          <div className="text-sm text-slate-400">
            No content
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= SKELETON ================= */

function OrdersSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-28 rounded-3xl bg-muted" />
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-64 rounded-3xl bg-muted"
        />
      ))}
    </div>
  );
}