import { Link, useNavigate, useSearch } from "@tanstack/react-router";

import {
  Eye,
  MoreVertical,
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
import { getLanguageOption , getCountryOption } from "@/config/languages";
import { PagePagination } from "../PagePagination";

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

export function DashboardOrdersComponents({
  tab,
}: {
  tab: string;
}) {
  const navigate = useNavigate();
   const search = useSearch({
      strict: false,
    });

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
            `/orders?type=${currentTab}&limit=${Number(pagination?.limit ?? 10)}&page=${Number(search?.page ?? 1  )}`
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
  }, [currentTab,search?.page ?? '', user?.id]);

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
              Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your active, completed and archived
              orders.
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
                    ...search,
                    tab: value,
                    page: 1,
                  },
                });
              }}
            >

              <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white font-medium shadow-sm">

                <SelectValue placeholder="Filter orders" />

              </SelectTrigger>

              <SelectContent className="rounded-2xl border-slate-200">

                <SelectItem value="success">
                  Success Orders
                </SelectItem>

                <SelectItem value="current">
                  Current Orders
                </SelectItem>

                <SelectItem value="history">
                  History Orders
                </SelectItem>

                <SelectItem value="cancelled">
                  Cancelled Orders
                </SelectItem>

              </SelectContent>

            </Select>

          </div>

        </div>

      </section>

      {/* ORDERS */}

      <section className="space-y-4">

        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
          />
        ))}

        {/* EMPTY */}
        {!orders.length ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              No orders found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              No orders available in this section.
            </p>

            <div className="mt-6 flex justify-center gap-3">

              <Button
                asChild
                className="rounded-2xl bg-[var(--neon-green)] text-black hover:bg-[var(--neon-green)]/90"
              >
                <Link to="/products">
                  Browse Products
                </Link>
              </Button>

            </div>

          </div>
        ) : null}
 
                    {Number(pagination?.totalPages ?? 0) > 1 &&   <PagePagination totalPages={pagination?.totalPages ?? 0} currentPage={pagination?.currentPage ?? 1} /> }


      </section>

    </div>
  );
}

/* ================= CARD ================= */

function OrderCard({
  order,
}: {
  order: OrderDetail;
}) {
  const money = formatCents(
    order.totals.total,
    order.totals.currency
  );

  const country =
      getCountryOption(
        order.countryCode
      ) || null;

  const placed = new Date(order.createdAt);

  const statusStyles: Record<string, string> = {
    pending:
      "bg-blue-100 text-blue-700 border-blue-200",

    completed:
      "bg-emerald-100 text-emerald-700 border-emerald-200",

    cancelled:
      "bg-red-100 text-red-700 border-red-200",

    shipped:
      "bg-purple-100 text-purple-700 border-purple-200",

    failed:
      "bg-red-100 text-red-700 border-red-200",

    payment_failed:
      "bg-red-100 text-red-700 border-red-200",

    payment_pending:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
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

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

          {/* LEFT */}

          <div className="min-w-0 flex-1">

            <div className="flex flex-wrap items-center gap-3">

              <h3 className="truncate text-2xl font-bold text-slate-900">
                {order.items?.[0]?.product?.name ??
                  "Product"}
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

            <p className="mt-2 text-sm text-slate-500">

              Order ID:{" "}

              <span className="font-medium text-slate-700">
                {order._id}
              </span>

            </p>

            {/* STATS */}

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

              <StatCard
                label="Items"
                value={order.itemCount as number}
              />

              <StatCard
                label="Country"
                value={country?.name ?? order.countryCode}
              />

              <StatCard
                label="Status"
                value={order.status.replaceAll("_", " ")}
              />

              <div className="rounded-2xl border border-[var(--neon-green)]/20 bg-[var(--neon-green)]/10 p-4">

                <p className="text-xs font-medium text-slate-600">
                  Total
                </p>

                <p className="mt-2 text-lg font-extrabold text-slate-900">
                  {money}
                </p>

              </div>

            </div>

            {/* PRODUCTS */}

            <div className="mt-6 flex flex-wrap gap-2">

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

            {/* DATE */}

            <div className="mt-6 flex flex-wrap gap-5 text-xs text-slate-400">

              <span>
                Placed on{" "}
                <span className="font-medium text-slate-600">
                  {placed.toLocaleDateString()}
                </span>
              </span>

              <span>
                Time{" "}
                <span className="font-medium text-slate-600">
                  {placed.toLocaleTimeString()}
                </span>
              </span>

            </div>

          </div>

          {/* ACTION */}

          <div className="flex items-start justify-end">

            <DropdownMenu>

              <DropdownMenuTrigger asChild>

                <Button
                  size="icon"
                  variant="outline"
                  className="
                    h-11 w-11 rounded-2xl border-slate-200
                    bg-white hover:bg-slate-100
                  "
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>

              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 rounded-2xl border-slate-200 p-2"
              >

                {/* VIEW DETAILS */}

                <Dialog>

                  <DialogTrigger asChild>

                    <DropdownMenuItem
                      onSelect={(e) =>
                        e.preventDefault()
                      }
                      className="cursor-pointer rounded-xl"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>

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

                    {/* SUMMARY */}

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">

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
                        label="Total"
                        value={money}
                        highlight
                      />

                    </div>

                    {order.status === "cancelled" && order.cancelReason ? (
                      <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                          Cancellation reason
                        </p>
                        <p className="mt-2 text-sm font-semibold text-red-900">
                          {order.cancelReason}
                        </p>
                      </div>
                    ) : null}

                    {/* CUSTOMER + ADDRESS */}

                    <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">

                      {/* CUSTOMER */}

                      <div className="rounded-3xl border border-slate-200 p-5">

                        <h3 className="text-lg font-bold text-slate-900">
                          Customer Information
                        </h3>

                        <div className="mt-4 space-y-3">

                          <InfoRow
                            label="Name"
                            value={`${order.customer.first_name} ${order.customer.last_name}`}
                          />

                          <InfoRow
                            label="Email"
                            value={order.customer.email}
                          />

                          <InfoRow
                            label="Phone"
                            value={order.customer.phone}
                          />

                          <InfoRow
                            label="Country"
                            value={country?.name ?? order.customer.country}
                          />

                        </div>

                      </div>

                      {/* ADDRESS */}

                      <div className="rounded-3xl border border-slate-200 p-5">

                        <h3 className="text-lg font-bold text-slate-900">
                          Shipping Address
                        </h3>

                        <div className="mt-4 space-y-3">

                          {Object.entries(order.address ?? {}).map(
                            ([key, value]) => (
                              <InfoRow
                                key={key}
                                label={key}
                                value={value}
                              />
                            )
                          )}

                        </div>

                      </div>

                    </div>

                    {/* ITEMS */}

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

                          const countryName =
                            getLanguageOption(
                              item.setup.languageCode
                            ) || null;

                          return (
                            <div
                              key={item.id}
                              className="
                                rounded-3xl border border-slate-200
                                bg-slate-50/50 p-5
                              "
                            >

                              {/* TOP */}

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

                              {/* CONFIG */}

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
                                  value={countryName?.name ?? item.setup.languageCode}
                                />

                                <StatCard
                                  label="Status"
                                  value={item.status}
                                />

                              </div>

                              {item.status === "rejected" && item.rejection?.reason ? (
                                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
                                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                                    Rejection reason
                                  </p>
                                  <p className="mt-2 text-sm font-semibold text-red-900">
                                    {item.rejection.reason}
                                  </p>
                                </div>
                              ) : null}

                              {/* TEXT */}

                              <div className="mt-6">

                                <h5 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                                  Text Content
                                </h5>

                                <div className="mt-3 grid gap-3 lg:grid-cols-3">

                                  <TextBlock
                                    title="Title Lines"
                                    lines={
                                      item.text.titleLines
                                    }
                                  />

                                  <TextBlock
                                    title="Secondary Lines"
                                    lines={
                                      item.text
                                        .secondaryLines
                                    }
                                  />

                                  <TextBlock
                                    title="Label Lines"
                                    lines={
                                      item.text.labelLines
                                    }
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

              </DropdownMenuContent>

            </DropdownMenu>

          </div>

        </div>

      </div>

    </div>
  );
}

/* ================= HELPERS ================= */

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
        {label.replaceAll("_", " ")}
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
          className="h-52 rounded-3xl bg-muted"
        />
      ))}

    </div>
  );
}
