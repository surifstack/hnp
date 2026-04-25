import { create } from "zustand";
import { apiJson } from "@/lib/api";
import type { Language, Product } from "@/lib/api.types";

interface CatalogState {
  products: Product[] | null;
  productBySlug: Record<string, Product | undefined>;
  languagesBySlug: Record<string, Language[] | undefined>;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProduct: (slug: string) => Promise<Product | undefined>;
  fetchLanguages: (slug: string) => Promise<Language[]>;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  products: null,
  productBySlug: {},
  languagesBySlug: {},
  loading: false,
  error: null,

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

  fetchProduct: async (slug: string) => {
    const cached = get().productBySlug[slug];
    if (cached) return cached;
    set({ loading: true, error: null });
    try {
      const product = await apiJson<Product>(`/products/${slug}`);
      set((s) => ({
        loading: false,
        productBySlug: { ...s.productBySlug, [slug]: product },
      }));
      return product;
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Failed to load product",
      });
      return undefined;
    }
  },

  fetchLanguages: async (slug: string) => {
    const cached = get().languagesBySlug[slug];
    if (cached) return cached;
    set({ loading: true, error: null });
    try {
      const languages = await apiJson<Language[]>(`/products/${slug}/languages`);
      set((s) => ({
        loading: false,
        languagesBySlug: { ...s.languagesBySlug, [slug]: languages },
      }));
      return languages;
    } catch (e) {
      set({
        loading: false,
        error: e instanceof Error ? e.message : "Failed to load languages",
      });
      return [];
    }
  },
}));
