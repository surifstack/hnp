import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiJson } from "@/lib/api";
import type { Order, Product } from "@/lib/api.types";

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

  addOrder: (order: Order) => Promise<void>;
  addOrderId: (orderId: string) => Promise<void>;
  refreshItem: (orderId: string) => Promise<void>;
}

function nowIso() {
  return new Date().toISOString();
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      activeOrderId: null,
      loading: false,
      error: null,

      setActive: (orderId) => set({ activeOrderId: orderId }),

      remove: (orderId) =>
        set((s) => {
          const next = s.items.filter((i) => i.orderId !== orderId);
          const activeOrderId =
            s.activeOrderId === orderId ? (next[0]?.orderId ?? null) : s.activeOrderId;
          return { items: next, activeOrderId };
        }),

      clear: () => set({ items: [], activeOrderId: null }),

      addOrder: async (order) => {
        const existing = get().items.find((i) => i.orderId === order.id);
        if (existing) {
          set({ activeOrderId: existing.orderId });
          return;
        }

        set({ loading: true, error: null });
        try {
          const product = await apiJson<Product>(`/products/${order.productSlug}`);
          const item: CartItem = {
            orderId: order.id,
            addedAt: nowIso(),
            order,
            product,
          };
          set((s) => ({
            items: [item, ...s.items],
            activeOrderId: order.id,
            loading: false,
          }));
        } catch (e) {
          set({ loading: false, error: e instanceof Error ? e.message : "Failed to add to cart" });
        }
      },

      addOrderId: async (orderId) => {
        const existing = get().items.find((i) => i.orderId === orderId);
        if (existing) {
          set({ activeOrderId: existing.orderId });
          return;
        }

        set({ loading: true, error: null });
        try {
          const order = await apiJson<Order>(`/orders/${orderId}`);
          const product = await apiJson<Product>(`/products/${order.productSlug}`);
          const item: CartItem = {
            orderId,
            addedAt: nowIso(),
            order,
            product,
          };
          set((s) => ({
            items: [item, ...s.items],
            activeOrderId: orderId,
            loading: false,
          }));
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to load order for cart",
          });
        }
      },

      refreshItem: async (orderId) => {
        const item = get().items.find((i) => i.orderId === orderId);
        if (!item) return;
        set({ loading: true, error: null });
        try {
          const order = await apiJson<Order>(`/orders/${orderId}`);
          const product = await apiJson<Product>(`/products/${order.productSlug}`);
          set((s) => ({
            items: s.items.map((i) => (i.orderId === orderId ? { ...i, order, product } : i)),
            loading: false,
          }));
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to refresh cart item",
          });
        }
      },
    }),
    {
      name: "hnp-cart",
      version: 1,
      partialize: (s) => ({ items: s.items, activeOrderId: s.activeOrderId }),
    },
  ),
);

