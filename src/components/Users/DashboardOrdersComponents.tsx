import { Link } from "@tanstack/react-router";

import {
  Eye,
  RotateCcw,
  XCircle,
  Archive,
  FolderOpen,
  MoreVertical,
} from "lucide-react";

import { toast } from "sonner";

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

import { useHnpStore } from "@/hooks/useHnpStore";

import {
  createClientOrderDraft,
  applySetupToOrder,
  applyTextStep,
  finalizeOrderDraft,
} from "@/lib/order-draft";

import { formatCents } from "@/components/cart/cartTotals";

import type {
  UserOrderRecord,
  UserOrderStatus,
} from "@/hooks/useHnpStore";

export function DashboardOrdersComponents({
  tab,
}: {
  tab: string;
}) {
  const user = useSessionStore((s) => s.user);

  const ordersByUserId = useHnpStore(
    (s) => s.userOrders.ordersByUserId
  );

  const setStatus = useHnpStore(
    (s) => s.userOrders.setStatus
  );

  const orders = user?.id
    ? ordersByUserId[user.id] ?? []
    : [];

  const targetStatus: UserOrderStatus =
    tab === "success"
      ? "SUCCESS"
      : tab === "current"
        ? "CURRENT"
        : tab === "history"
          ? "HISTORY"
          : "CANCELLED";

  const filtered = orders.filter(
    (o) => o.status === targetStatus
  );

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* TITLE */}
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
              value={tab}
              onValueChange={(value) => {
                window.history.pushState(
                  {},
                  "",
                  `/dashboard/orders?tab=${value}`
                );

                window.dispatchEvent(
                  new PopStateEvent("popstate")
                );
              }}
            >
              <SelectTrigger
                className="
                  h-11 rounded-2xl border-slate-200
                  bg-white font-medium shadow-sm
                "
              >
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
        {filtered.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            onSetStatus={(next) => {
              if (!user?.id) return;

              setStatus(user.id, o.id, next);
            }}
          />
        ))}

        {/* EMPTY */}
        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              No orders found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {tab === "success"
                ? "Successful orders appear here."
                : tab === "current"
                  ? "Your active orders will appear here."
                  : tab === "history"
                    ? "Archived orders appear here."
                    : "Cancelled orders appear here."}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                className="
                  rounded-2xl bg-[var(--neon-green)]
                  text-black hover:bg-[var(--neon-green)]/90
                "
              >
                <Link to="/products">
                  Browse Products
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-2xl"
              >
                <Link to="/cart">
                  Open Cart
                </Link>
              </Button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function OrderCard({
  order,
  onSetStatus,
}: {
  order: UserOrderRecord;

  onSetStatus: (s: UserOrderStatus) => void;
}) {
  const cartAddOrder = useHnpStore(
    (s) => s.cart.addOrder
  );

  const placed = new Date(order.placedAt);

  const money = formatCents(
    order.item.totals.total,
    order.item.totals.currency
  );

  const reorder = () => {
    try {
      const draft = createClientOrderDraft(
        order.item.productSlug
      );

      const withSetup = applySetupToOrder(draft, {
        quantity: order.item.quantity,
        colorPms: order.item.colorPms,
        languageCode: order.item.languageCode,
      });

      const withTitle = applyTextStep(
        withSetup,
        "title",
        order.item.titleLines
      );

      const withSecondary = applyTextStep(
        withTitle,
        "secondary",
        order.item.secondaryLines
      );

      const withLabel = applyTextStep(
        withSecondary,
        "label",
        order.item.labelLines
      );

      const finalized = finalizeOrderDraft(withLabel);

      cartAddOrder(finalized, null);

      toast.success("Added to cart");
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : "Failed to reorder"
      );
    }
  };

  const statusStyles = {
    SUCCESS:
      "bg-emerald-100 text-emerald-700 border-emerald-200",

    CURRENT:
      "bg-blue-100 text-blue-700 border-blue-200",

    HISTORY:
      "bg-slate-100 text-slate-700 border-slate-200",

    CANCELLED:
      "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="p-5">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          {/* LEFT */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="truncate text-xl font-bold text-slate-900">
                {order.item.productSlug}
              </h3>

              <div
                className={`
                  rounded-full border px-3 py-1
                  text-xs font-semibold uppercase tracking-wide
                  ${statusStyles[order.status]}
                `}
              >
                {order.status}
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Order ID: {order.id}
            </p>

            {/* GRID */}
            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Quantity
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {order.item.quantity}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Color
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  PMS {order.item.colorPms}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">
                  Language
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {order.item.languageCode}
                </p>
              </div>

              <div className="rounded-2xl bg-[var(--neon-green)]/10 p-4">
                <p className="text-xs text-slate-600">
                  Total
                </p>

                <p className="mt-1 text-sm font-bold text-slate-900">
                  {money}
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs text-slate-400">
              Placed on{" "}
              {placed.toLocaleDateString()} at{" "}
              {placed.toLocaleTimeString()}
            </p>
          </div>

          {/* ACTION MENU */}
          <div className="flex items-start justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="
                    h-10 w-10 rounded-2xl border-slate-200
                    bg-white hover:bg-slate-100
                  "
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-52 rounded-2xl border-slate-200 p-2"
              >
                {/* DETAILS */}
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

                  <DialogContent className="rounded-3xl border-slate-200">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">
                        Order Details
                      </DialogTitle>

                      <DialogDescription>
                        Snapshot saved from checkout.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-4">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">
                          Product
                        </p>

                        <p className="mt-1 font-semibold">
                          {order.item.productSlug}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs text-slate-500">
                            Quantity
                          </p>

                          <p className="mt-1 font-semibold">
                            {order.item.quantity}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs text-slate-500">
                            Total
                          </p>

                          <p className="mt-1 font-semibold">
                            {money}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-xs font-medium text-slate-500">
                          Text Content
                        </p>

                        <ul className="mt-3 space-y-2">
                          {[
                            ...order.item.titleLines,
                            ...order.item.secondaryLines,
                            ...order.item.labelLines,
                          ].map((line, idx) => (
                            <li
                              key={idx}
                              className="rounded-xl bg-slate-50 px-3 py-2 text-sm"
                            >
                              {line}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* REORDER */}
                <DropdownMenuItem
                  onClick={reorder}
                  className="cursor-pointer rounded-xl"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reorder
                </DropdownMenuItem>

                {/* CANCEL / RESTORE */}
                {order.status !== "CANCELLED" ? (
                  <DropdownMenuItem
                    onClick={() =>
                      onSetStatus("CANCELLED")
                    }
                    className="
                      cursor-pointer rounded-xl
                      text-red-600 focus:text-red-600
                    "
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() =>
                      onSetStatus("CURRENT")
                    }
                    className="cursor-pointer rounded-xl"
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Restore Order
                  </DropdownMenuItem>
                )}

                {/* ARCHIVE */}
                {(order.status === "CURRENT" ||
                  order.status === "SUCCESS") && (
                  <DropdownMenuItem
                    onClick={() =>
                      onSetStatus("HISTORY")
                    }
                    className="cursor-pointer rounded-xl"
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}