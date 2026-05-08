
import {  Link } from "@tanstack/react-router";

import { Eye, RotateCcw, XCircle, Archive, FolderOpen } from "lucide-react";
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
import { useSessionStore } from "@/hooks/useSessionStore";
import { useHnpStore } from "@/hooks/useHnpStore";
import { createClientOrderDraft, applySetupToOrder, applyTextStep, finalizeOrderDraft } from "@/lib/order-draft";
import { formatCents } from "@/components/cart/cartTotals";
import type { UserOrderRecord, UserOrderStatus } from "@/hooks/useHnpStore";

export function DashboardOrdersComponents({ tab }: { tab: string }) {
  const user = useSessionStore((s) => s.user);
  const ordersByUserId = useHnpStore((s) => s.userOrders.ordersByUserId);
  const setStatus = useHnpStore((s) => s.userOrders.setStatus);

  const orders = user?.id ? (ordersByUserId[user.id] ?? []) : [];

  const targetStatus: UserOrderStatus =
    tab === "success"
      ? "SUCCESS"
      : tab === "current"
        ? "CURRENT"
        : tab === "history"
          ? "HISTORY"
          : "CANCELLED";

  const filtered = orders.filter((o) => o.status === targetStatus);

  return (
    <div className="space-y-4">
      <section className="userdash-surface rounded-2xl p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Current, archived history, and cancelled orders.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <TabButton tab="success" activeTab={tab} label="Success" />
            <TabButton tab="current" activeTab={tab} label="Current" />
            <TabButton tab="history" activeTab={tab} label="History" />
            <TabButton tab="cancelled" activeTab={tab} label="Cancelled" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
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

        {filtered.length === 0 ? (
          <div className="userdash-surface rounded-2xl p-6 text-center">
            <div className="text-sm font-semibold">No orders here</div>
            <p className="mt-2 text-sm text-muted-foreground">
              {tab === "success"
                ? "Successful orders appear here."
                : tab === "current"
                ? "Start a new order from Products."
                : tab === "history"
                  ? "Move orders to history when you’re done."
                  : "Cancelled orders appear here."}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Button asChild className="userdash-neon-btn">
                <Link to="/products">Browse products</Link>
              </Button>
              <Button asChild variant="outline" className="bg-white">
                <Link to="/cart">Open cart</Link>
              </Button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function TabButton({
  tab,
  activeTab,
  label,
}: {
  tab: "success" | "current" | "history" | "cancelled";
  activeTab: string;
  label: string;
}) {
  const isActive = activeTab === tab;
  return (
    <Link
      to="/dashboard/orders"
      search={{ tab }}
      className={isActive ? "userdash-chip userdash-chip--neon" : "userdash-chip"}
    >
      {label}
    </Link>
  );
}

function OrderCard({ order, onSetStatus }: { order: UserOrderRecord; onSetStatus: (s: UserOrderStatus) => void }) {
  const cartAddOrder = useHnpStore((s) => s.cart.addOrder);

  const placed = new Date(order.placedAt);
  const money = formatCents(order.item.totals.total, order.item.totals.currency);

  const reorder = () => {
    try {
      const draft = createClientOrderDraft(order.item.productSlug);
      const withSetup = applySetupToOrder(draft, {
        quantity: order.item.quantity,
        colorPms: order.item.colorPms,
        languageCode: order.item.languageCode,
      });
      const withTitle = applyTextStep(withSetup, "title", order.item.titleLines);
      const withSecondary = applyTextStep(withTitle, "secondary", order.item.secondaryLines);
      const withLabel = applyTextStep(withSecondary, "label", order.item.labelLines);
      const finalized = finalizeOrderDraft(withLabel);
      cartAddOrder(finalized, null);
      toast.success("Added to cart");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reorder");
    }
  };

  const statusLabel =
    order.status === "SUCCESS"
      ? "Success"
      : order.status === "CURRENT"
        ? "Current"
        : order.status === "HISTORY"
          ? "History"
          : "Cancelled";

  return (
    <div className="userdash-surface rounded-2xl p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-semibold">Order</div>
            <div className="userdash-pill" data-status={order.status}>
              {statusLabel}
            </div>
          </div>
          <div className="mt-1 truncate text-lg font-semibold">{order.id}</div>
          <div className="mt-2 grid grid-cols-1 gap-1 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="truncate">
              <span className="font-medium text-foreground">Product:</span> {order.item.productSlug}
            </div>
            <div className="truncate">
              <span className="font-medium text-foreground">Qty:</span> {order.item.quantity}
            </div>
            <div className="truncate">
              <span className="font-medium text-foreground">Total:</span> {money}
            </div>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Placed {placed.toLocaleDateString()} • {placed.toLocaleTimeString()}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white">
                <Eye className="h-4 w-4" />
                Details
              </Button>
            </DialogTrigger>
            <DialogContent className="border border-slate-200">
              <DialogHeader>
                <DialogTitle className="font-semibold tracking-tight">Order details</DialogTitle>
                <DialogDescription>Item snapshot saved from your checkout.</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">Product</div>
                  <div className="font-semibold">{order.item.productSlug}</div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Quantity</div>
                    <div className="font-semibold">{order.item.quantity}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Color</div>
                    <div className="font-semibold">PMS {order.item.colorPms}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Language</div>
                    <div className="font-semibold">{order.item.languageCode}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">Total</div>
                    <div className="font-semibold">{money}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="text-xs font-medium text-muted-foreground">Text</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {order.item.titleLines.map((l, idx) => (
                      <li key={`t-${idx}`}>{l}</li>
                    ))}
                    {order.item.secondaryLines.map((l, idx) => (
                      <li key={`s-${idx}`}>{l}</li>
                    ))}
                    {order.item.labelLines.map((l, idx) => (
                      <li key={`l-${idx}`}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button asChild className="userdash-neon-btn">
                  <Link to="/products">Shop again</Link>
                </Button>
                <Button asChild variant="outline" className="bg-white">
                  <Link to="/cart">Open cart</Link>
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button size="sm" className="userdash-neon-btn" onClick={reorder}>
            <RotateCcw className="h-4 w-4" />
            Reorder
          </Button>

          {order.status !== "CANCELLED" ? (
            <Button
              size="sm"
              variant="destructive"
              className="shadow-sm"
              onClick={() => onSetStatus("CANCELLED")}
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="bg-white"
              onClick={() => onSetStatus("CURRENT")}
            >
              <FolderOpen className="h-4 w-4" />
              Restore
            </Button>
          )}

          {order.status === "CURRENT" || order.status === "SUCCESS" ? (
            <Button
              size="sm"
              variant="outline"
              className="bg-white"
              onClick={() => onSetStatus("HISTORY")}
            >
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
