import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiJson } from "@/lib/api";
import {
  applySetupToOrder,
  applyTextStep,
  cloneOrder,
  createClientOrderDraft,
  finalizeOrderDraft,
  splitDraftLines,
} from "@/lib/order-draft";
import type { Language, Order, PmsColor, Product, ProductSlug } from "@/lib/api.types";
import { useCartStore } from "@/hooks/useCartStore";

type TextStep = "title" | "secondary" | "label" | "review";

interface SetupDraft {
  quantity: number;
  colorPms: PmsColor;
  languageCode: string;
}

interface OrderFlowState {
  productSlug: string | null;
  product: Product | null;
  languages: Language[];
  order: Order | null;
  setupDraft: SetupDraft | null;
  activeStep: TextStep;
  draft: {
    title: string;
    secondary: string;
    label: string;
  };
  proofSvg: string | null;
  loading: boolean;
  error: string | null;

  setSetupDraft: (next: SetupDraft) => void;
  setDraft: (key: "title" | "secondary" | "label", value: string) => void;
  setActiveStep: (step: TextStep) => void;
  reset: () => void;

  loadProduct: (slug: string) => Promise<void>;
  loadOrder: (id: string) => Promise<void>;
  startOrder: (slug: ProductSlug) => Promise<Order | null>;
  refreshOrder: () => Promise<void>;
  updateSetup: (setup: SetupDraft) => Promise<void>;

  approveTitle: () => Promise<void>;
  approveSecondary: () => Promise<void>;
  approveLabel: () => Promise<void>;
  approveAll: () => Promise<void>;
  fetchProofSvg: (opts: { userId: string | null }) => Promise<"ok" | "need-account">;
}

function draftFromOrder(order: Order) {
  return {
    title: order.text.titleLines.join("\n"),
    secondary: order.text.secondaryLines.join("\n"),
    label: order.text.labelLines.join("\n"),
  };
}

function defaultSetup(order: Order): SetupDraft {
  return { ...order.setup };
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

      setSetupDraft: (next) => {
        const order = get().order;
        set({
          setupDraft: next,
          order: order ? applySetupToOrder(order, next) : order,
        });
      },

      setDraft: (key, value) => set((state) => ({ draft: { ...state.draft, [key]: value } })),
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

      loadProduct: async (slug) => {
        set({ loading: true, error: null, productSlug: slug });
        try {
          const [product, languages] = await Promise.all([
            apiJson<Product>(`/products/${slug}`),
            apiJson<Language[]>(`/products/${slug}/languages`),
          ]);
          set({ product, languages, loading: false });
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load product",
            product: null,
            languages: [],
          });
        }
      },

      loadOrder: async (id) => {
        const item = useCartStore.getState().items.find((entry) => entry.orderId === id);
        if (!item) {
          set({ error: "Cart item not found" });
          return;
        }

        const order = cloneOrder(item.order);
        set({
          order,
          productSlug: order.productSlug,
          product: item.product,
          setupDraft: defaultSetup(order),
          draft: draftFromOrder(order),
          activeStep: order.approvals.final ? "review" : "title",
          error: null,
        });
      },

      startOrder: async (slug) => {
        const current = get().order;
        if (current?.productSlug === slug) {
          return current;
        }

        const order = createClientOrderDraft(slug);
        set({
          productSlug: slug,
          order,
          setupDraft: defaultSetup(order),
          activeStep: "title",
          draft: { title: "", secondary: "", label: "" },
          proofSvg: null,
          error: null,
        });
        return order;
      },

      refreshOrder: async () => {
        const id = get().order?.id;
        if (!id) return;
        const item = useCartStore.getState().items.find((entry) => entry.orderId === id);
        if (!item) return;

        const order = cloneOrder(item.order);
        set({
          order,
          setupDraft: defaultSetup(order),
          draft: draftFromOrder(order),
        });
      },

      updateSetup: async (setup) => {
        const order = get().order;
        if (!order) return;
        set({
          error: null,
          setupDraft: setup,
          order: applySetupToOrder(order, setup),
        });
      },

      approveTitle: async () => {
        const { order, draft } = get();
        if (!order) return;
        const lines = splitDraftLines(draft.title, 2);
        if (lines.length === 0) {
          set({ error: "Title is required" });
          return;
        }

        set({
          error: null,
          order: applyTextStep(order, "title", lines),
          activeStep: "secondary",
        });
      },

      approveSecondary: async () => {
        const { order, draft } = get();
        if (!order) return;
        const lines = splitDraftLines(draft.secondary, 3);
        if (lines.length === 0) {
          set({ error: "Secondary text is required" });
          return;
        }

        set({
          error: null,
          order: applyTextStep(order, "secondary", lines),
          activeStep: "label",
        });
      },

      approveLabel: async () => {
        const { order, draft } = get();
        if (!order) return;
        const lines = splitDraftLines(draft.label, 2);
        if (lines.length === 0) {
          set({ error: "Label text is required" });
          return;
        }

        set({
          error: null,
          order: applyTextStep(order, "label", lines),
          activeStep: "review",
        });
      },

      approveAll: async () => {
        const order = get().order;
        if (!order) return;
        if (!order.approvals.title || !order.approvals.secondary || !order.approvals.label) {
          set({ error: "Approve all text sections before continuing" });
          return;
        }

        set({
          error: null,
          order: finalizeOrderDraft(order),
          activeStep: "review",
        });
      },

      fetchProofSvg: async () => {
        set({ proofSvg: null, error: null });
        return "ok";
      },
    }),
    {
      name: "hnp-order-flow",
      version: 2,
      partialize: (state) => ({
        productSlug: state.productSlug,
        product: state.product,
        languages: state.languages,
        order: state.order,
        setupDraft: state.setupDraft,
        activeStep: state.activeStep,
        draft: state.draft,
      }),
    },
  ),
);
