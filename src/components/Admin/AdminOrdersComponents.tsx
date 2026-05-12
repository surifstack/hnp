// AdminOrdersComponents.tsx

import {
  Search,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { apiJson } from "@/lib/api";

import type {
  OrderDetail,
  Pagination,
} from "@/lib/api.types";



import { PagePagination } from "../PagePagination";
import { OrderCard, OrdersSkeleton } from "../Helpers/AdminOrderHelper";

/* ================= TYPES ================= */

type OrdersResponse = {
  status: number;
  message: string;
  pagination: Pagination;
  data: OrderDetail[];
};

/* ================= PAGE ================= */

export function AdminOrdersComponents() {
  const [orders, setOrders] =
    useState<OrderDetail[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [pagination, setPagination] =
    useState<Pagination>({
      total: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 20,
    });

  async function fetchOrders(
    page = 1
  ) {
    try {
      setLoading(true);

      const query =
        new URLSearchParams({
          limit: "12",
          page: String(page),
          search,
          ...(status !== "all" && {
            status,
          }),
        });

      const response =
        await apiJson<OrdersResponse>(
          `/admin/orders?${query}`
        );

      setOrders(response.data || []);

      if (
        response.pagination &&
        typeof response.pagination ===
          "object"
      ) {
        setPagination(
          response.pagination
        );
      }
    } catch (err) {
      setError(
        "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    id: string,
    value: string
  ) {
    try {
      await apiJson(
        `/admin/orders/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: value,
          }),
        }
      );

      fetchOrders(
        pagination.currentPage
      );
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchOrders(1);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders(1);
    }, 500);

    return () =>
      clearTimeout(timer);
  }, [search, status]);

  if (loading) {
    return (
      <OrdersSkeleton />
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Order Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage all customer
              orders
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* SEARCH */}
            <div className="relative w-full sm:w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <Input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search orders..."
                className="h-11 rounded-2xl border-slate-200 pl-10"
              />
            </div>

            {/* FILTER */}
            <Select
              value={status}
              onValueChange={
                setStatus
              }
            >
              <SelectTrigger className="h-11 w-[180px] rounded-2xl border-slate-200">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Orders
                </SelectItem>

                <SelectItem value="pending">
                  Pending
                </SelectItem>

                <SelectItem value="completed">
                  Completed
                </SelectItem>

                <SelectItem value="cancelled">
                  Cancelled
                </SelectItem>

                <SelectItem value="shipped">
                  Shipped
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            onStatusChange={
              updateStatus
            }
          />
        ))}
      </section>

      {/* EMPTY */}
      {!orders.length && (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            No orders found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            No order available.
          </p>
        </div>
      )}

      {/* PAGINATION */}

      {pagination.totalPages > 1 &&
       <PagePagination
        currentPage={
          pagination.currentPage
        }
        totalPages={
          pagination.totalPages
        }
        // onPageChange={(page) => {
        //   fetchOrders(page);
        // }}
      />
        }
     
    </div>
  );
}

/* ================= CARD ================= */

