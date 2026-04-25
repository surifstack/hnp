import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, Product } from "@/lib/api.types";
import { cloneOrder } from "@/lib/order-draft";

export type CartItem = {
  orderId: string;
  addedAt: string;
  order: Order;
  product: Product | null;
};

interface CartState {
  items: CartItem[];
  activeOrderId: string | null;
  loading: boolean;
  error: string | null;

  setActive: (orderId: string) => void;
  remove: (orderId: string) => void;
  clear: () => void;
  addOrder: (order: Order, product?: Product | null) => void;
  updateQuantity: (orderId: string, quantity: number) => void;
  upsertOrder: (order: Order, product?: Product | null) => void;
}

function nowIso() {
  return new Date().toISOString();
}

function updateMatchingItem(items: CartItem[], orderId: string, updater: (item: CartItem) => CartItem) {
  return items.map((item) => (item.orderId === orderId ? updater(item) : item));
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      activeOrderId: null,
      loading: false,
      error: null,

      setActive: (orderId) => set({ activeOrderId: orderId }),

      remove: (orderId) =>
        set((state) => {
          const next = state.items.filter((item) => item.orderId !== orderId);
          return {
            items: next,
            activeOrderId:
              state.activeOrderId === orderId ? (next[0]?.orderId ?? null) : state.activeOrderId,
          };
        }),

      clear: () => set({ items: [], activeOrderId: null, error: null }),

      addOrder: (order, product = null) =>
        set((state) => {
          const existing = state.items.find((item) => item.orderId === order.id);
          if (existing) {
            return {
              items: updateMatchingItem(state.items, order.id, (item) => ({
                ...item,
                order: cloneOrder(order),
                product: product ?? item.product,
              })),
              activeOrderId: order.id,
              error: null,
            };
          }

          const item: CartItem = {
            orderId: order.id,
            addedAt: nowIso(),
            order: cloneOrder(order),
            product,
          };
          return {
            items: [item, ...state.items],
            activeOrderId: order.id,
            error: null,
          };
        }),

      updateQuantity: (orderId, quantity) =>
        set((state) => ({
          items: updateMatchingItem(state.items, orderId, (item) => ({
            ...item,
            order: {
              ...cloneOrder(item.order),
              updatedAt: nowIso(),
              setup: {
                ...item.order.setup,
                quantity,
              },
            },
          })),
        })),

      upsertOrder: (order, product = null) =>
        set((state) => ({
          items: updateMatchingItem(state.items, order.id, (item) => ({
            ...item,
            order: cloneOrder(order),
            product: product ?? item.product,
          })),
        })),
    }),
    {
      name: "hnp-cart",
      version: 2,
      partialize: (state) => ({ items: state.items, activeOrderId: state.activeOrderId }),
    },
  ),
);
