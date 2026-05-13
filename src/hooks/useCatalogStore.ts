import { create } from "zustand";

import { apiJson } from "@/lib/api";

import type { Product } from "@/lib/api.types";

interface CatalogState {
  products: Product[];

  productBySlug: Record<
    string,
    Product | undefined
  >;

  loading: boolean;

  initialized: boolean;

  error: string | null;

  fetchProducts: () => Promise<void>;

  fetchProduct: (
    slug: string,
  ) => Promise<Product | undefined>;
}

export const useCatalogStore =
  create<CatalogState>((set, get) => ({

    products: [],

    productBySlug: {},

    loading: false,

    initialized: false,

    error: null,

    /* ------------------------------------------------------------------ */
    /*                           FETCH PRODUCTS                           */
    /* ------------------------------------------------------------------ */

    fetchProducts: async () => {

      /* ------------------ PREVENT MULTIPLE FETCHES -------------------- */

      if (
        get().loading ||
        get().initialized
      ) {
        return;
      }

      set({
        loading: true,
        error: null,
      });

      try {

        const products =
          await apiJson<Product[]>(
            "/products",
          );

        /* ---------------- CACHE BY SLUG ---------------- */

        const productMap: Record<
          string,
          Product
        > = {};

        for (const product of products) {
          productMap[product.id] =
            product;
        }

        set({
          products,

          productBySlug: productMap,

          loading: false,

          initialized: true,
        });

      } catch (e) {

        set({
          loading: false,

          error:
            e instanceof Error
              ? e.message
              : "Failed to load products",
        });
      }
    },

    /* ------------------------------------------------------------------ */
    /*                           FETCH PRODUCT                            */
    /* ------------------------------------------------------------------ */

    fetchProduct: async (
      slug: string,
    ) => {

      const cached =
        get().productBySlug[slug];

      /* -------------------- RETURN CACHE -------------------- */

      if (cached) {
        return cached;
      }

      try {

        const product =
          await apiJson<Product>(
            `/products/${slug}`,
          );

        set((s) => ({
          productBySlug: {
            ...s.productBySlug,

            [slug]: product,
          },
        }));

        return product;

      } catch (e) {

        set({
          error:
            e instanceof Error
              ? e.message
              : "Failed to load product",
        });

        return undefined;
      }
    },
  }));