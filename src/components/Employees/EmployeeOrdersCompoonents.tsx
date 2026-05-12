import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import {
  Eye,
  User,
  Mail,
  Package2,
  CalendarDays,
} from "lucide-react";

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

import {
  getCountryOption,
  getLanguageOption,
} from "@/config/languages";
import { PagePagination } from "../PagePagination";
import { useSearch } from "@tanstack/react-router";

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
    const search = useSearch({
      strict: false,
    });
  const [pagination, setPagination] =
  useState<Pagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 20,
    offset:0
  });
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

 const [currentTab, setCurrentTab] =
  useState<OrderTab>(() => {
    const tab = search.tab;

    if (
      tab === "success" ||
      tab === "current" ||
      tab === "history" ||
      tab === "cancelled"
    ) {
      return tab;
    }

    return "current";
  });

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
            `/employee/orders?type=${currentTab}&limit=${pagination.limit}&page=${Number(search.page ?? 0)}`
          );

          if (
            response.pagination &&
            typeof response.pagination === "object" &&
            !Array.isArray(response.pagination) &&
            "total" in response.pagination &&
            "totalPages" in response.pagination &&
            "currentPage" in response.pagination
          ) {
            setPagination({
              total: response.pagination.total ?? 0,
              totalPages:
                response.pagination.totalPages ?? 1,
              currentPage:
                response.pagination.currentPage ?? 1,
              limit: response.pagination.limit ?? 20,
              offset :0
            });
          }
        if (cancelled) return;

        setOrders(response.data ?? []);
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
  }, [currentTab,search.page, user?.id]);

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
    <div className="space-y-6">
      {/* HEADER */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Orders Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage customer orders efficiently
            </p>
          </div>

          {/* FILTER */}
          <div className="w-full sm:w-[240px]">
            <Select
              value={currentTab}
              onValueChange={(value) => {
              setCurrentTab(value as any)

                navigate({
                  to: "/employee/orders",
                  search: {
                    tab: value,
                  },
                });
              }}
            >
              <SelectTrigger className="h-11 rounded-2xl border-slate-200">
                <SelectValue placeholder="Select orders" />
              </SelectTrigger>

              <SelectContent className="rounded-2xl">
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

      {/* GRID */}
      {!orders.length ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            No orders found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No orders available in this section.
          </p>
        </div>
      ) : (
        <>

        <section
          className="
            grid grid-cols-1 gap-5
            md:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
          "
        >
          
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
            />
          ))}


        </section>
        </>
      )}
<PagePagination
  currentPage={Number(search.page || 1)}
  totalPages={pagination.totalPages}
/>
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

  const country = getCountryOption(
    order.countryCode
  );

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
        hover:-translate-y-1 hover:shadow-xl
      "
    >
      {/* TOP BORDER */}
      <div className="h-1 w-full bg-[var(--neon-green)]" />

      <div className="p-5">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Order #{order._id.slice(-8)}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4" />

              {placed.toLocaleDateString()}
            </div>
          </div>

          <div
            className={`
              rounded-full border px-3 py-1
              text-xs font-bold uppercase
              ${statusStyles[order.status]}
            `}
          >
            {order.status.replaceAll("_", " ")}
          </div>
        </div>

        {/* CUSTOMER */}
        <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4">
          <CustomerRow
            icon={<User className="h-4 w-4" />}
            value={`${order.customer.first_name} ${order.customer.last_name}`}
          />

          <CustomerRow
            icon={<Mail className="h-4 w-4" />}
            value={order.customer.email}
          />
        </div>

        {/* TOTAL */}
        <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total
            </p>

            <p className="mt-1 text-2xl font-extrabold text-slate-900">
              {money}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 p-3">
            <Package2 className="h-5 w-5 text-slate-700" />
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="mt-5">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Products
          </p>

          <div className="flex flex-wrap gap-2">
            {order.items
              ?.slice(0, 3)
              .map((item) => (
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

            {(order.items?.length || 0) > 3 && (
              <div
                className="
                  rounded-full bg-slate-900
                  px-3 py-1 text-xs font-bold text-white
                "
              >
                +{order.items.length - 3} more
              </div>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-500">
            {country?.name ?? order.countryCode}
          </div>

          <OrderDetailsModal order={order} />
        </div>
      </div>
    </div>
  );
}

/* ================= MODAL ================= */

function OrderDetailsModal({
  order,
}: {
  order: OrderDetail;
}) {
  const money = formatCents(
    order.totals.total,
    order.totals.currency
  );

  const country = getCountryOption(
    order.countryCode
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="
            rounded-2xl border-slate-200
            hover:bg-slate-100
          "
        >
          <Eye className="mr-2 h-4 w-4" />
          Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Order Details
          </DialogTitle>

          <DialogDescription>
            Complete order information
          </DialogDescription>
        </DialogHeader>

        {/* CUSTOMER + ADDRESS */}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {/* CUSTOMER */}
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
                label="Email"
                value={order.customer.email}
              />

              <InfoRow
                label="Phone"
                value={order.customer.phone}
              />

              <InfoRow
                label="Country"
                value={
                  country?.name ??
                  order.customer.country
                }
              />
            </div>
          </div>

          {/* ADDRESS */}
          <div className="rounded-3xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">
              Shipping Address
            </h3>

            <div className="mt-4 space-y-3">
              {Object.entries(
                order.address ?? {}
              ).map(([key, value]) => (
                <InfoRow
                  key={key}
                  label={key}
                  value={value}
                />
              ))}
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <SummaryCard
            label="Items"
            value={order.itemCount as number}
          />

          <SummaryCard
            label="Status"
            value={order.status}
          />

          <SummaryCard
            label="Country"
            value={
              country?.name ?? order.countryCode
            }
          />

          <SummaryCard
            label="Total"
            value={money}
            highlight
          />
        </div>

        {/* ITEMS */}
        <div className="mt-8 space-y-5">
          {order.items?.map((item) => {
            const itemMoney = formatCents(
              item.pricing.total,
              item.pricing.currency
            );

            const language =
              getLanguageOption(
                item.setup.languageCode
              );

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

                  <div
                    className="
                      rounded-2xl
                      bg-[var(--neon-green)]/10
                      px-4 py-2 text-lg
                      font-extrabold
                    "
                  >
                    {itemMoney}
                  </div>
                </div>

                {/* CONFIG */}
                <div className="mt-5 grid gap-3 lg:grid-cols-4">
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
                    value={
                      language?.name ??
                      item.setup.languageCode
                    }
                  />

                  <StatCard
                    label="Status"
                    value={item.status}
                  />
                </div>

                {/* TEXT */}
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
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
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================= HELPERS ================= */

function CustomerRow({
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

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold capitalize text-slate-900">
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
            : "border-slate-200"
        }
      `}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-2xl font-extrabold capitalize text-slate-900">
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
      <div className="text-sm font-medium capitalize text-slate-500">
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
              className="
                rounded-xl bg-slate-50
                px-3 py-2 text-sm
                text-slate-700
              "
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