import {
  getCountryOption,
  getLanguageOption,
} from "@/config/languages";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Eye,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderDetail } from "@/lib/api.types";

export function OrderCard({
  order,
  onStatusChange,
  onRejectItem,
  onRejectAll,
}: {
  order: OrderDetail;

  onStatusChange: (
    id: string,
    status: string
  ) => void;

  onRejectItem: (
    orderId: string,
    itemId: string,
    reason?: string
  ) => void;

  onRejectAll: (
    orderId: string,
    reason?: string
  ) => void;
}) {
  const country =
    getCountryOption(
      order.countryCode
    );

  const money = formatMoney(
    order.totals.total,
    order.totals.currency
  );

  const statusStyles: Record<
    string,
    string
  > = {
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
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="h-1 w-full bg-[var(--neon-green)]" />

      <div className="p-6">
        <div className="flex flex-col gap-5">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Order #
                {order._id.slice(-8)}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <div
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${statusStyles[order.status]}`}
            >
              {order.status.replaceAll(
                "_",
                " "
              )}
            </div>
          </div>

          {/* CUSTOMER */}
          <div className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4">
            <InfoCard
              icon={
                <User className="h-4 w-4" />
              }
              label="Customer"
              value={`${order.customer.first_name} ${order.customer.last_name}`}
            />

            <InfoCard
              icon={
                <Mail className="h-4 w-4" />
              }
              label="Email"
              value={
                order.customer.email
              }
            />

            <InfoCard
              icon={
                <Phone className="h-4 w-4" />
              }
              label="Phone"
              value={
                order.customer.phone
              }
            />

            <InfoCard
              icon={
                <MapPin className="h-4 w-4" />
              }
              label="Country"
              value={
                country?.name ||
                order.countryCode
              }
            />
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={
                <ShoppingBag className="h-4 w-4" />
              }
              label="Items"
              value={
                order.itemCount as number
              }
            />

            <StatCard
              icon={
                <DollarSign className="h-4 w-4" />
              }
              label="Total"
              value={money}
            />
          </div>

          {/* STATUS */}
          <Select
            value={order.status}
            onValueChange={(
              value
            ) =>
              onStatusChange(
                order._id,
                value
              )
            }
          >
            <SelectTrigger className="h-11 rounded-2xl border-slate-200">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
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

              <SelectItem value="failed">
                Failed
              </SelectItem>
            </SelectContent>
          </Select>

          {/* MODAL */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="rounded-2xl"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-5xl">
              <DialogHeader>
                <DialogTitle>
                  Order Details
                </DialogTitle>

                <DialogDescription>
                  Complete order
                  information
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 flex justify-end">
                <RejectDialog
                  triggerLabel="Reject All Items"
                  title="Reject all items"
                  description="This will reject every item and cancel the whole order."
                  confirmLabel="Reject All"
                  onConfirm={(reason) =>
                    onRejectAll(order._id, reason)
                  }
                />
              </div>

              <div className="space-y-6">
                {order.items.map(
                  (item) => {
                    const language =
                      getLanguageOption(
                        item.setup
                          .languageCode
                      );

                    return (
                      <div
                        key={
                          item.id
                        }
                        className="rounded-3xl border border-slate-200 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              {
                                item
                                  .product
                                  ?.name
                              }
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {
                                item
                                  .product
                                  ?.description
                              }
                            </p>
                          </div>

                          <div className="rounded-2xl bg-[var(--neon-green)]/10 px-4 py-2 font-bold">
                            {formatMoney(
                              item
                                .pricing
                                .total,
                              item
                                .pricing
                                .currency
                            )}
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                          <StatCard
                            label="Quantity"
                            value={
                              item
                                .setup
                                .quantity
                            }
                          />

                          <StatCard
                            label="Color"
                            value={
                              item
                                .setup
                                .colorPms
                            }
                          />

                          <StatCard
                            label="Language"
                            value={
                              language?.name ||
                              item
                                .setup
                                .languageCode
                            }
                          />

                          <StatCard
                            label="Status"
                            value={
                              item.status
                            }
                          />
                        </div>

                        <div className="mt-4 flex justify-end">
                          <RejectDialog
                            triggerLabel="Reject Item"
                            title="Reject item"
                            description="Add a reason (optional). If all items are rejected, the order is cancelled."
                            confirmLabel="Reject"
                            onConfirm={(reason) =>
                              onRejectItem(order._id, item.id, reason)
                            }
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

export function InfoCard({
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
      <div className="text-slate-400">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500">
          {label}
        </p>

        <p className="text-sm font-semibold text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

export function StatCard({
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
      {icon && (
        <div className="mb-2 text-slate-500">
          {icon}
        </div>
      )}

      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-slate-900 capitalize">
        {value}
      </p>
    </div>
  );
}

export function formatMoney(
  cents: number,
  currency = "USD"
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

export function OrdersSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-28 rounded-3xl bg-muted" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(
          (i) => (
            <div
              key={i}
              className="h-80 rounded-3xl bg-muted"
            />
          )
        )}
      </div>
    </div>
  );
}

function RejectDialog({
  triggerLabel,
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  triggerLabel: string;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: (reason?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="rounded-2xl">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          className="rounded-2xl"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <Button
            variant="destructive"
            className="rounded-2xl"
            onClick={() => {
              onConfirm(reason.trim() || undefined);
              setReason("");
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
