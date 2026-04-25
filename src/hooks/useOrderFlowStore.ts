import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiJson, apiText } from "@/lib/api";
import type { Language, Order, PmsColor, Product } from "@/lib/api.types";

type TextStep = "title" | "secondary" | "label" | "review";

interface OrderFlowState {
  productSlug: string | null;
  product: Product | null;
  languages: Language[];
  order: Order | null;
  setupDraft: { quantity: number; colorPms: PmsColor; languageCode: string } | null;
  activeStep: TextStep;
  draft: {
    title: string;
    secondary: string;
    label: string;
  };
  proofSvg: string | null;
  loading: boolean;
  error: string | null;

  setSetupDraft: (next: { quantity: number; colorPms: PmsColor; languageCode: string }) => void;
  setDraft: (key: "title" | "secondary" | "label", value: string) => void;
  setActiveStep: (step: TextStep) => void;
  reset: () => void;

  loadProduct: (slug: string) => Promise<void>;
  loadOrder: (id: string) => Promise<void>;
  startOrder: (slug: string) => Promise<Order | null>;
  refreshOrder: () => Promise<void>;
  updateSetup: (setup: {
    quantity: number;
    colorPms: PmsColor;
    languageCode: string;
  }) => Promise<void>;

  approveTitle: () => Promise<void>;
  approveSecondary: () => Promise<void>;
  approveLabel: () => Promise<void>;
  approveAll: () => Promise<void>;
  fetchProofSvg: (opts: { userId: string | null }) => Promise<"ok" | "need-account">;
}

function splitLines(text: string, maxLines: number) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, maxLines);
}

export const useOrderFlowStore = create<OrderFlowState>()(
  persist(
    (set, get) => ({
      productSlug: null,
      product: null,
      languages: [],
      order: null,
      setupDraft: null,
      activeStep: "title",
      draft: { title: "", secondary: "", label: "" },
      proofSvg: null,
      loading: false,
      error: null,

      setSetupDraft: (next) => set({ setupDraft: next }),
      setDraft: (key, value) => set((s) => ({ draft: { ...s.draft, [key]: value } })),
      setActiveStep: (step) => set({ activeStep: step }),

      reset: () =>
        set({
          productSlug: null,
          product: null,
          languages: [],
          order: null,
          setupDraft: null,
          activeStep: "title",
          draft: { title: "", secondary: "", label: "" },
          proofSvg: null,
          loading: false,
          error: null,
        }),

      loadProduct: async (slug: string) => {
        set({ loading: true, error: null, productSlug: slug });
        try {
          const [product, languages] = await Promise.all([
            apiJson<Product>(`/products/${slug}`),
            apiJson<Language[]>(`/products/${slug}/languages`),
          ]);
          set({ product, languages, loading: false });
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to load product",
            product: null,
            languages: [],
          });
        }
      },

      loadOrder: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const order = await apiJson<Order>(`/orders/${id}`);
          const [product, languages] = await Promise.all([
            apiJson<Product>(`/products/${order.productSlug}`),
            apiJson<Language[]>(`/products/${order.productSlug}/languages`),
          ]);

          set({
            order,
            setupDraft: { ...order.setup },
            productSlug: order.productSlug,
            product,
            languages,
            loading: false,
          });
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to load order",
          });
        }
      },

      startOrder: async (slug: string) => {
        set({ loading: true, error: null, proofSvg: null, productSlug: slug });
        try {
          const order = await apiJson<Order>("/orders", {
            method: "POST",
            body: JSON.stringify({ productSlug: slug }),
          });
          set({
            order,
            setupDraft: { ...order.setup },
            activeStep: "title",
            draft: { title: "", secondary: "", label: "" },
            loading: false,
          });
          return order;
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to create order",
          });
          return null;
        }
      },

      refreshOrder: async () => {
        const id = get().order?.id;
        if (!id) return;
        set({ loading: true, error: null });
        try {
          const order = await apiJson<Order>(`/orders/${id}`);
          set({ order, setupDraft: { ...order.setup }, loading: false });
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to refresh order",
          });
        }
      },

      updateSetup: async (setup) => {
        const id = get().order?.id;
        if (!id) return;
        set({ loading: true, error: null });
        try {
          const order = await apiJson<Order>(`/orders/${id}/setup`, {
            method: "PATCH",
            body: JSON.stringify(setup),
          });
          set({ order, setupDraft: { ...order.setup }, loading: false });
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to update setup",
          });
        }
      },

      approveTitle: async () => {
        const { order, draft } = get();
        if (!order) return;
        set({ loading: true, error: null });
        try {
          const lines = splitLines(draft.title, 2);
          await apiJson<Order>(`/orders/${order.id}/text/title`, {
            method: "PUT",
            body: JSON.stringify({ lines }),
          });
          const approved = await apiJson<Order>(`/orders/${order.id}/approve/title`, {
            method: "POST",
          });
          set({ order: approved, loading: false, activeStep: "secondary" });
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to approve title",
          });
        }
      },

      approveSecondary: async () => {
        const { order, draft } = get();
        if (!order) return;
        set({ loading: true, error: null });
        try {
          const lines = splitLines(draft.secondary, 3);
          await apiJson<Order>(`/orders/${order.id}/text/secondary`, {
            method: "PUT",
            body: JSON.stringify({ lines }),
          });
          const approved = await apiJson<Order>(`/orders/${order.id}/approve/secondary`, {
            method: "POST",
          });
          set({ order: approved, loading: false, activeStep: "label" });
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to approve secondary title",
          });
        }
      },

      approveLabel: async () => {
        const { order, draft } = get();
        if (!order) return;
        set({ loading: true, error: null });
        try {
          const lines = splitLines(draft.label, 2);
          await apiJson<Order>(`/orders/${order.id}/text/label`, {
            method: "PUT",
            body: JSON.stringify({ lines }),
          });
          const approved = await apiJson<Order>(`/orders/${order.id}/approve/label`, {
            method: "POST",
          });
          set({ order: approved, loading: false, activeStep: "review" });
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to approve label text",
          });
        }
      },

      approveAll: async () => {
        const order = get().order;
        if (!order) return;
        set({ loading: true, error: null });
        try {
          const next = await apiJson<Order>(`/orders/${order.id}/approve-all`, { method: "POST" });
          set({ order: next, loading: false });
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to approve all",
          });
        }
      },

      fetchProofSvg: async ({ userId }) => {
        const order = get().order;
        if (!order || !userId) return "need-account";
        set({ loading: true, error: null });
        try {
          const svg = await apiText(`/orders/${order.id}/proof.svg`, {
            headers: { "x-user-id": userId },
          });
          set({ proofSvg: svg, loading: false });
          return "ok";
        } catch (e) {
          set({
            loading: false,
            error: e instanceof Error ? e.message : "Failed to load proof",
          });
          return "need-account";
        }
      },
    }),
    {
      name: "hnp-order-flow",
      version: 1,
      partialize: (s) => ({
        productSlug: s.productSlug,
        order: s.order,
        setupDraft: s.setupDraft,
        activeStep: s.activeStep,
        draft: s.draft,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.order?.id) {
          // Refresh silently; ignore errors.
          void state.refreshOrder();
        }
      },
    },
  ),
);
