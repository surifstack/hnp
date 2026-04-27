import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, Product } from "@/lib/api.types";
import { cloneOrder } from "@/lib/order-draft";
import { apiJson } from "@/lib/api";

export type CartItem = {
  orderId: string;
  addedAt: string;
  order: Order;
  product: Product | null;
};

type PersistedCartItem = Pick<CartItem, "orderId" | "addedAt" | "order">;

type PersistedCartState = {
  items: PersistedCartItem[];
  activeOrderId: string | null;
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
  hydrateProducts: () => Promise<void>;
}

function nowIso() {
  return new Date().toISOString();
}

function updateMatchingItem(items: CartItem[], orderId: string, updater: (item: CartItem) => CartItem) {
  return items.map((item) => (item.orderId === orderId ? updater(item) : item));
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

      hydrateProducts: async () => {
        const items = get().items;
        const missingSlugs = [...new Set(items.filter((item) => !item.product).map((item) => item.order.productSlug))];
        if (missingSlugs.length === 0) return;

        set({ loading: true, error: null });
        try {
          const results = await Promise.allSettled(
            missingSlugs.map((slug) => apiJson<Product>(`/products/${slug}`)),
          );

          const productBySlug = new Map<string, Product>();
          for (const result of results) {
            if (result.status === "fulfilled") {
              productBySlug.set(result.value.slug, result.value);
            }
          }

          set((state) => ({
            loading: false,
            items: state.items.map((item) => ({
              ...item,
              product: item.product ?? productBySlug.get(item.order.productSlug) ?? null,
            })),
          }));
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to refresh cart products",
          });
        }
      },
    }),
    {
      name: "hnp-cart",
      version: 3,
      partialize: (state): PersistedCartState => ({
        items: state.items.map(({ orderId, addedAt, order }) => ({ orderId, addedAt, order })),
        activeOrderId: state.activeOrderId,
      }),
      migrate: (persisted, version): PersistedCartState => {
        if (!persisted || typeof persisted !== "object") {
          return { items: [], activeOrderId: null };
        }

        const anyState = persisted as Partial<PersistedCartState> & {
          items?: Array<PersistedCartItem & { product?: unknown }>;
        };

        if (version < 3) {
          const items = (anyState.items ?? []).map(({ orderId, addedAt, order }) => ({
            orderId,
            addedAt,
            order,
          }));
          return { items, activeOrderId: anyState.activeOrderId ?? null };
        }

        return {
          items: anyState.items ?? [],
          activeOrderId: anyState.activeOrderId ?? null,
        };
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as PersistedCartState | undefined;
        const items = (persisted?.items ?? []).map((item) => ({
          ...item,
          product: null,
        }));
        return {
          ...currentState,
          items,
          activeOrderId: persisted?.activeOrderId ?? null,
        } satisfies CartState;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;
        void state.hydrateProducts();
      },
    },
  ),
);
