import { create } from "zustand";
import { apiJson } from "@/lib/api";
import type { Product } from "@/lib/api.types";

interface AdminProductsState {
  products: Product[] | null;
  loading: boolean;
  error: string | null;
  hiddenById: Record<string, boolean | undefined>;
  fetchProducts: () => Promise<void>;
  toggleHidden: (productId: string) => void;
}

export const useAdminProductsStore = create<AdminProductsState>((set) => ({
  products: null,
  loading: false,
  error: null,
  hiddenById: {},

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await apiJson<Product[]>("/products");
      set({ products, loading: false });
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Failed to load products",
        products: null,
      });
    }
  },

  toggleHidden: (productId) =>
    set((s) => ({ hiddenById: { ...s.hiddenById, [productId]: !s.hiddenById[productId] } })),
}));
