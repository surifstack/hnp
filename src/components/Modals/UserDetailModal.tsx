import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type {  UserDetail } from "@/lib/api.types";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Eye,
 
} from "lucide-react";
import { formatMoney, InfoRow, SummaryCard } from "../Helpers/UserHelpers";

export function UserDetailsModal({
  user,
}: {
  user: UserDetail;
}) {
  const joinedDate = new Date(user.createdAt);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-2xl"
        >
          <Eye className="mr-2 h-4 w-4" />
          Details
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Customer Details
          </DialogTitle>

          <DialogDescription>
            Complete customer information
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold">
              Contact Information
            </h3>

            <div className="mt-4 space-y-3">
              <InfoRow
                label="Name"
                value={`${user.firstName} ${user.lastName}`}
              />

              <InfoRow
                label="Email"
                value={user.email}
              />

              <InfoRow
                label="Phone"
                value={`${user.phoneCountryCode} ${user.phoneNumber}`}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold">
              Account Information
            </h3>

            <div className="mt-4 space-y-3">
              <InfoRow
                label="User ID"
                value={user._id}
              />

              <InfoRow
                label="Created"
                value={joinedDate.toLocaleString()}
              />

              <InfoRow
                label="Updated"
                value={new Date(
                  user.updatedAt
                ).toLocaleString()}
              />
            </div>
          </div>
        </div>

        {/* STATS */}
        {user.orderStats && (
          <div className="mt-8">
            <h3 className="text-xl font-bold">
              Order Statistics
            </h3>

            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <SummaryCard
                label="Orders"
                value={
                  user.orderStats.totalOrders
                }
              />

              <SummaryCard
                label="Spent"
                value={formatMoney(
                  user.orderStats.totalSpent,
                  user.lastOrder?.currency ||
                    "USD"
                )}
              />

              <SummaryCard
                label="Completed"
                value={
                  user.orderStats
                    .completedOrders
                }
              />

              <SummaryCard
                label="Cancelled"
                value={
                  user.orderStats
                    .cancelledOrders
                }
              />
            </div>
          </div>
        )}

        {/* ACTION */}
        <div className="mt-8">
          <Button
            asChild
            className="rounded-2xl"
          >
            <Link
              to={`/dashboard/orders?search=${user._id}`}
            >
              View User Orders
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}