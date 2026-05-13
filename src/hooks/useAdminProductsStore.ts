import { create } from "zustand";

import { apiJson } from "@/lib/api";

import type { Product } from "@/lib/api.types";

interface AdminProductsState {
  products: Product[];

  loading: boolean;

  error: string | null;

  fetchProducts: () => Promise<void>;

  toggleHidden: (
    productId: string,
    isAvailable: boolean,
  ) => Promise<void>;
}

export const useAdminProductsStore =
  create<AdminProductsState>((set, get) => ({

    products: [],

    loading: false,

    error: null,

    /* ------------------------------------------------------------------ */
    /*                           FETCH PRODUCTS                           */
    /* ------------------------------------------------------------------ */

    fetchProducts: async () => {

      if (get().loading) return;

      set({
        loading: true,
        error: null,
      });

      try {

        const products =
          await apiJson<Product[]>(
            "/products",
          );

        set({
          products,
          loading: false,
        });

      } catch (e) {

        set({
          loading: false,

          error:
            e instanceof Error
              ? e.message
              : "Failed to load products",

          products: [],
        });
      }
    },

    /* ------------------------------------------------------------------ */
    /*                         HIDE / UNHIDE PRODUCT                      */
    /* ------------------------------------------------------------------ */

    toggleHidden: async (
      productId,
      isAvailable,
    ) => {

      try {

        /* ---------------- API UPDATE ---------------- */

        await apiJson(
          `/products/${productId}/status`,
          {
            method: "PATCH",

            body: JSON.stringify({
              isAvailable,
            }),
          },
        );

        /* ---------------- LOCAL UPDATE ---------------- */

        set((state) => ({
          products: state.products.map(
            (product) =>
              product.id === productId
                ? {
                    ...product,

                    isAvailable,
                  }
                : product,
          ),
        }));

      } catch (e) {

        set({
          error:
            e instanceof Error
              ? e.message
              : "Failed to update status",
        });
      }
    },
  }));