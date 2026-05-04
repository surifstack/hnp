import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MoneyTotals, PmsColor } from "@/lib/api.types";

export type UserOrderItemSnapshot = {
  clientItemId: string;
  productSlug: string;
  quantity: number;
  colorPms: PmsColor;
  languageCode: string;
  titleLines: string[];
  secondaryLines: string[];
  labelLines: string[];
  totals: MoneyTotals;
};

export type UserOrderStatus = "CURRENT" | "HISTORY" | "CANCELLED";

export type UserOrderRecord = {
  id: string; // server id if available, else client id
  clientItemId: string;
  placedAt: string;
  status: UserOrderStatus;
  item: UserOrderItemSnapshot;
};

interface UserOrdersState {
  ordersByUserId: Record<string, UserOrderRecord[]>;
  recordCheckout: (input: {
    userId: string;
    acceptedAt: string;
    serverOrderIds: string[];
    items: UserOrderItemSnapshot[];
  }) => void;
  setStatus: (userId: string, orderId: string, status: UserOrderStatus) => void;
  clearUser: (userId: string) => void;
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2, 10)}`;
}

export const useUserOrdersStore = create<UserOrdersState>()(
  persist(
    (set) => ({
      ordersByUserId: {},

      recordCheckout: ({ userId, acceptedAt, serverOrderIds, items }) =>
        set((state) => {
          const prev = state.ordersByUserId[userId] ?? [];
          const records: UserOrderRecord[] = items.map((item, i) => {
            const serverId = serverOrderIds[i];
            return {
              id: serverId || item.clientItemId || newId("ord"),
              clientItemId: item.clientItemId,
              placedAt: acceptedAt,
              status: "CURRENT",
              item,
            };
          });

          return {
            ordersByUserId: {
              ...state.ordersByUserId,
              [userId]: [...records, ...prev],
            },
          };
        }),

      setStatus: (userId, orderId, status) =>
        set((state) => {
          const next = (state.ordersByUserId[userId] ?? []).map((o) =>
            o.id === orderId ? { ...o, status } : o,
          );
          return {
            ordersByUserId: { ...state.ordersByUserId, [userId]: next },
          };
        }),

      clearUser: (userId) =>
        set((state) => {
          const next = { ...state.ordersByUserId };
          delete next[userId];
          return { ordersByUserId: next };
        }),
    }),
    { name: "hnp-user-orders", version: 1 },
  ),
);

