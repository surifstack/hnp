import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiJson } from "@/lib/api";
import type { CheckoutResponse, MoneyTotals, Order, PmsColor, Product } from "@/lib/api.types";
import {
  applySetupToOrder,
  applyTextStep,
  cloneOrder,
  createClientOrderDraft,
  finalizeOrderDraft,
  splitDraftLines,
} from "@/lib/order-draft";
import { initialFormState, type BasicDetails, type FormState, type Step } from "@/components/cart/types";

type TextStep = "title" | "secondary" | "label" | "review";

export type CartItem = {
  orderId: string;
  addedAt: string;
  order: Order;
  product: Product | null;
};

type PersistedCartItem = Pick<CartItem, "orderId" | "addedAt" | "order">;

type PersistedLegacy<T> = { state: T; version: number };

type SetupDraft = {
  quantity: number;
  colorPms: PmsColor;
  languageCode: string;
};

type OrderFlowDraft = {
  title: string;
  secondary: string;
  label: string;
};

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

export type UserOrderStatus = "SUCCESS" | "CURRENT" | "HISTORY" | "CANCELLED";

export type UserOrderRecord = {
  id: string;
  clientItemId: string;
  placedAt: string;
  status: UserOrderStatus;
  item: UserOrderItemSnapshot;
};

export type LastCheckoutSnapshot = {
  acceptedAt: string;
  orderIds: string[];
  totals: CheckoutResponse["totals"];
  items: UserOrderItemSnapshot[];
};

type CartSlice = {
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
};

type OrderSlice = {
  productSlug: string | null;
  product: Product | null;
  order: Order | null;
  setupDraft: SetupDraft | null;
  activeStep: TextStep;
  draft: OrderFlowDraft;
  proofSvg: string | null;
  loading: boolean;
  error: string | null;
  setSetupDraft: (next: SetupDraft) => void;
  setDraft: (key: keyof OrderFlowDraft, value: string) => void;
  setActiveStep: (step: TextStep) => void;
  reset: () => void;
  clearOrderFlow: () => void;
  loadProduct: (slug: string) => Promise<void>;
  loadOrder: (id: string) => Promise<void>;
  startOrder: (slug: string) => Promise<Order | null>;
  setApproval: (key: keyof Order["approvals"], value: boolean) => void;
  refreshOrder: () => Promise<void>;
  updateSetup: (setup: SetupDraft) => Promise<void>;
  resetApprovals: () => void;
  approveTitle: () => Promise<void>;
  approveSecondary: () => Promise<void>;
  approveLabel: () => Promise<void>;
  textAllApproved: (val: boolean) => void;
  approveAll: () => Promise<void>;
  fetchProofSvg: (opts: { userId: string | null }) => Promise<"ok" | "need-account">;
};

type CheckoutSlice = {
  step: Step;
  form: FormState;
  setStep: (step: Step) => void;
  setBasic: (basic: BasicDetails) => void;
  setAddress: (address: Record<string, string>) => void;
  setOtpVerified: (verified: boolean) => void;
  reset: () => void;
};

type UserOrdersSlice = {
  ordersByUserId: Record<string, UserOrderRecord[]>;
  checkoutsById: Record<
    string,
    LastCheckoutSnapshot & {
      userId: string;
      basic: BasicDetails;
      address: Record<string, string>;
      otpVerified: boolean;
      payment: { method: string; status: string };
    }
  >;
  recordCheckout: (input: {
    checkoutId: string;
    userId: string;
    acceptedAt: string;
    serverOrderIds: string[];
    basic: BasicDetails;
    address: Record<string, string>;
    otpVerified: boolean;
    items: UserOrderItemSnapshot[];
    totals: CheckoutResponse["totals"];
  }) => void;
  setStatus: (userId: string, orderId: string, status: UserOrderStatus) => void;
  clearUser: (userId: string) => void;
};

type HnpStoreState = {
  cart: CartSlice;
  order: OrderSlice;
  checkout: CheckoutSlice;
  userOrders: UserOrdersSlice;
};

function nowIso() {
  return new Date().toISOString();
}

function updateMatchingItem(items: CartItem[], orderId: string, updater: (item: CartItem) => CartItem) {
  return items.map((item) => (item.orderId === orderId ? updater(item) : item));
}

function draftFromOrder(order: Order): OrderFlowDraft {
  return {
    title: order.text.titleLines.join("\n"),
    secondary: order.text.secondaryLines.join("\n"),
    label: order.text.labelLines.join("\n"),
  };
}

function defaultSetup(order: Order): SetupDraft {
  return { ...order.setup };
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2, 10)}`;
}

function readLegacyPersist<T>(key: string): PersistedLegacy<T> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const anyParsed = parsed as Partial<PersistedLegacy<T>>;
    if (!anyParsed.state || typeof anyParsed.version !== "number") return null;
    return anyParsed as PersistedLegacy<T>;
  } catch {
    return null;
  }
}

export const useHnpStore = create<HnpStoreState>()(
  persist(
    (set, get) => ({
      cart: {
        items: [],
        activeOrderId: null,
        loading: false,
        error: null,

        setActive: (orderId) =>
          set((state) => ({ cart: { ...state.cart, activeOrderId: orderId } })),

        remove: (orderId) =>
          set((state) => {
            const next = state.cart.items.filter((item) => item.orderId !== orderId);
            return {
              cart: {
                ...state.cart,
                items: next,
                activeOrderId:
                  state.cart.activeOrderId === orderId
                    ? (next[0]?.orderId ?? null)
                    : state.cart.activeOrderId,
              },
            };
          }),

        clear: () =>
          set((state) => ({
            cart: { ...state.cart, items: [], activeOrderId: null, error: null },
          })),

        addOrder: (order, product = null) =>
          set((state) => {
            const existing = state.cart.items.find((item) => item.orderId === order.id);
            if (existing) {
              return {
                cart: {
                  ...state.cart,
                  items: updateMatchingItem(state.cart.items, order.id, (item) => ({
                    ...item,
                    order: cloneOrder(order),
                    product: product ?? item.product,
                  })),
                  activeOrderId: order.id,
                  error: null,
                },
              };
            }

            const item: CartItem = {
              orderId: order.id,
              addedAt: nowIso(),
              order: cloneOrder(order),
              product,
            };
            return {
              cart: {
                ...state.cart,
                items: [item, ...state.cart.items],
                activeOrderId: order.id,
                error: null,
              },
            };
          }),

        updateQuantity: (orderId, quantity) =>
          set((state) => ({
            cart: {
              ...state.cart,
              items: updateMatchingItem(state.cart.items, orderId, (item) => ({
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
            },
          })),

        upsertOrder: (order, product = null) =>
          set((state) => ({
            cart: {
              ...state.cart,
              items: updateMatchingItem(state.cart.items, order.id, (item) => ({
                ...item,
                order: cloneOrder(order),
                product: product ?? item.product,
              })),
            },
          })),

        hydrateProducts: async () => {
          const items = get().cart.items;
          const missingSlugs = [
            ...new Set(items.filter((item) => !item.product).map((item) => item.order.productSlug)),
          ];
          if (missingSlugs.length === 0) return;

          set((state) => ({ cart: { ...state.cart, loading: true, error: null } }));
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
              cart: {
                ...state.cart,
                loading: false,
                items: state.cart.items.map((item) => ({
                  ...item,
                  product: item.product ?? productBySlug.get(item.order.productSlug) ?? null,
                })),
              },
            }));
          } catch (e) {
            set((state) => ({
              cart: {
                ...state.cart,
                loading: false,
                error: e instanceof Error ? e.message : "Failed to refresh cart products",
              },
            }));
          }
        },
      },

      order: {
        productSlug: null,
        product: null,
        order: null,
        setupDraft: null,
        activeStep: "title",
        draft: { title: "", secondary: "", label: "" },
        proofSvg: null,
        loading: false,
        error: null,

        setSetupDraft: (next) => {
          const order = get().order.order;
          set((state) => ({
            order: {
              ...state.order,
              setupDraft: next,
              order: order ? applySetupToOrder(order, next) : order,
            },
          }));
        },

        setDraft: (key, value) =>
          set((state) => ({
            order: { ...state.order, draft: { ...state.order.draft, [key]: value } },
          })),

        setActiveStep: (step) =>
          set((state) => ({
            order: { ...state.order, activeStep: step },
          })),

        textAllApproved: (status) =>
          set((state) => {
            if (!state.order.order) return {};
            return {
              order: {
                ...state.order,
                order: {
                  ...state.order.order,
                  approvals: {
                    ...state.order.order.approvals,
                    allApproved: status,
                  },
                },
              },
            };
          }),

        reset: () =>
          set((state) => ({
            order: {
              ...state.order,
              productSlug: null,
              product: null,
              order: null,
              setupDraft: null,
              activeStep: "title",
              draft: { title: "", secondary: "", label: "" },
              proofSvg: null,
              loading: false,
              error: null,
            },
          })),

        clearOrderFlow: () => {
          set((state) => ({
            order: {
              ...state.order,
              productSlug: null,
              product: null,
              order: null,
              setupDraft: null,
              activeStep: "title",
              draft: { title: "", secondary: "", label: "" },
              proofSvg: null,
              loading: false,
              error: null,
            },
          }));
        },

        loadProduct: async (slug) => {
          set((state) => ({
            order: { ...state.order, loading: true, error: null, productSlug: slug },
          }));
          try {
            const product = await apiJson<Product>(`/products/${slug}`);
            set((state) => ({
              order: { ...state.order, product, loading: false },
            }));
          } catch (error) {
            set((state) => ({
              order: {
                ...state.order,
                loading: false,
                error: error instanceof Error ? error.message : "Failed to load product",
                product: null,
              },
            }));
          }
        },

        loadOrder: async (id) => {
          const item = get().cart.items.find((entry) => entry.orderId === id);
          if (!item) {
            set((state) => ({ order: { ...state.order, error: "Cart item not found" } }));
            return;
          }

          const order = cloneOrder(item.order);
          set((state) => ({ order: { ...state.order, error: null } }));

          try {
            const product = item.product ?? (await apiJson<Product>(`/products/${order.productSlug}`));
            set((state) => ({
              order: {
                ...state.order,
                order,
                productSlug: order.productSlug,
                product,
                setupDraft: defaultSetup(order),
                draft: draftFromOrder(order),
                activeStep: order.approvals.final ? "review" : "title",
                error: null,
              },
            }));
          } catch (error) {
            set((state) => ({
              order: {
                ...state.order,
                order,
                productSlug: order.productSlug,
                product: null,
                setupDraft: defaultSetup(order),
                draft: draftFromOrder(order),
                activeStep: order.approvals.final ? "review" : "title",
                error: error instanceof Error ? error.message : "Failed to load product",
              },
            }));
          }
        },

        startOrder: async (slug) => {
          const current = get().order.order;
          if (current?.productSlug === slug) return current;

          const order = createClientOrderDraft(slug);
          set((state) => ({
            order: {
              ...state.order,
              productSlug: slug,
              order,
              setupDraft: defaultSetup(order),
              activeStep: "title",
              draft: { title: "", secondary: "", label: "" },
              proofSvg: null,
              error: null,
            },
          }));
          return order;
        },

        refreshOrder: async () => {
          const id = get().order.order?.id;
          if (!id) return;
          const item = get().cart.items.find((entry) => entry.orderId === id);
          if (!item) return;

          const order = cloneOrder(item.order);
          set((state) => ({
            order: {
              ...state.order,
              order,
              setupDraft: defaultSetup(order),
              draft: draftFromOrder(order),
            },
          }));
        },

        updateSetup: async (setup) => {
          const order = get().order.order;
          if (!order) return;
          set((state) => ({
            order: {
              ...state.order,
              error: null,
              setupDraft: setup,
              order: applySetupToOrder(order, setup),
            },
          }));
        },

        approveTitle: async () => {
          const { order, draft } = get().order;
          if (!order) return;
          const lines = splitDraftLines(draft.title, 2);
          if (lines.length === 0) {
            set((state) => ({ order: { ...state.order, error: "Title is required" } }));
            return;
          }

          set((state) => ({
            order: {
              ...state.order,
              error: null,
              order: applyTextStep(order, "title", lines),
              activeStep: "secondary",
            },
          }));
        },

        approveSecondary: async () => {
          const { order, draft } = get().order;
          if (!order) return;
          const lines = splitDraftLines(draft.secondary, 3);
          if (lines.length === 0) {
            set((state) => ({
              order: { ...state.order, error: "Secondary text is required" },
            }));
            return;
          }

          set((state) => ({
            order: {
              ...state.order,
              error: null,
              order: applyTextStep(order, "secondary", lines),
              activeStep: "label",
            },
          }));
        },

        approveLabel: async () => {
          const { order, draft } = get().order;
          if (!order) return;
          const lines = splitDraftLines(draft.label, 2);
          if (lines.length === 0) {
            set((state) => ({ order: { ...state.order, error: "Label text is required" } }));
            return;
          }

          set((state) => ({
            order: {
              ...state.order,
              error: null,
              order: applyTextStep(order, "label", lines),
              activeStep: "review",
            },
          }));
        },

        approveAll: async () => {
          const order = get().order.order;
          if (!order) return;
          if (!order.approvals.title || !order.approvals.secondary || !order.approvals.label) {
            set((state) => ({
              order: { ...state.order, error: "Approve all text sections before continuing" },
            }));
            return;
          }

          set((state) => ({
            order: {
              ...state.order,
              error: null,
              order: finalizeOrderDraft(order),
              activeStep: "review",
            },
          }));
        },

        setApproval: (key, value) => {
          const order = get().order.order;
          if (!order) return;

          set((state) => ({
            order: {
              ...state.order,
              order: {
                ...order,
                approvals: {
                  ...order.approvals,
                  [key]: value,
                },
              },
            },
          }));
        },

        resetApprovals: () => {
          const order = get().order.order;
          if (!order) return;

          set((state) => ({
            order: {
              ...state.order,
              order: {
                ...order,
                approvals: {
                  ...order.approvals,
                  title: false,
                  secondary: false,
                  label: false,
                  allApproved: false,
                },
              },
              activeStep: "title",
            },
          }));
        },

        fetchProofSvg: async () => {
          set((state) => ({ order: { ...state.order, proofSvg: null, error: null } }));
          return "ok";
        },
      },

      checkout: {
        step: 1,
        form: initialFormState,
        setStep: (step) => set((state) => ({ checkout: { ...state.checkout, step } })),
        setBasic: (basic) =>
          set((state) => ({
            checkout: {
              ...state.checkout,
              form: {
                ...state.checkout.form,
                basic,
                address:
                  state.checkout.form.basic.country !== basic.country && state.checkout.form.basic.country
                    ? {}
                    : state.checkout.form.address,
              },
            },
          })),
        setAddress: (address) =>
          set((state) => ({
            checkout: {
              ...state.checkout,
              form: { ...state.checkout.form, address },
            },
          })),
        setOtpVerified: (verified) =>
          set((state) => ({
            checkout: {
              ...state.checkout,
              form: { ...state.checkout.form, otpVerified: verified },
            },
          })),
        reset: () =>
          set((state) => ({
            checkout: { ...state.checkout, step: 1 }, // Keep form data, only reset step
          })),
      },

      userOrders: {
        ordersByUserId: {},
        checkoutsById: {},

        recordCheckout: ({ checkoutId, userId, acceptedAt, serverOrderIds, basic, address, otpVerified, items, totals }) =>
          set((state) => {
            const prev = state.userOrders.ordersByUserId[userId] ?? [];
            const records: UserOrderRecord[] = items.map((item, i) => {
              const serverId = serverOrderIds[i];
              return {
                id: serverId || item.clientItemId || newId("ord"),
                clientItemId: item.clientItemId,
                placedAt: acceptedAt,
                status: "SUCCESS",
                item,
              };
            });

            return {
              userOrders: {
                ...state.userOrders,
                ordersByUserId: {
                  ...state.userOrders.ordersByUserId,
                  [userId]: [...records, ...prev],
                },
                checkoutsById: {
                  ...state.userOrders.checkoutsById,
                  [checkoutId]: {
                    acceptedAt,
                    orderIds: serverOrderIds,
                    totals,
                    items,
                    userId,
                    basic,
                    address,
                    otpVerified,
                    payment: { method: "card", status: "success" },
                  },
                },
              },
            };
          }),

        setStatus: (userId, orderId, status) =>
          set((state) => {
            const next = (state.userOrders.ordersByUserId[userId] ?? []).map((o) =>
              o.id === orderId ? { ...o, status } : o,
            );
            return {
              userOrders: {
                ...state.userOrders,
                ordersByUserId: { ...state.userOrders.ordersByUserId, [userId]: next },
              },
            };
          }),

        clearUser: (userId) =>
          set((state) => {
            const next = { ...state.userOrders.ordersByUserId };
            delete next[userId];
            return { userOrders: { ...state.userOrders, ordersByUserId: next } };
          }),
      },
    }),
    {
      name: "hnp",
      version: 3,
      partialize: (state) => ({
        cart: {
          items: state.cart.items.map(({ orderId, addedAt, order }) => ({ orderId, addedAt, order })),
          activeOrderId: state.cart.activeOrderId,
        },
        order: {
          productSlug: state.order.productSlug,
          product: state.order.product,
          order: state.order.order,
          setupDraft: state.order.setupDraft,
          activeStep: state.order.activeStep,
          draft: state.order.draft,
        },
        checkout: {
          step: state.checkout.step,
          form: state.checkout.form,
        },
        userOrders: {
          ordersByUserId: state.userOrders.ordersByUserId,
          checkoutsById: state.userOrders.checkoutsById,
        },
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as
          | {
              cart?: { items?: PersistedCartItem[]; activeOrderId?: string | null };
              // v1 of `hnp` used `orderFlow`/`checkoutFlow`
              orderFlow?: Partial<OrderSlice>;
              checkoutFlow?: Partial<CheckoutSlice>;
              // v2 uses `order`/`checkout`
              order?: Partial<OrderSlice>;
              checkout?: Partial<CheckoutSlice>;
              userOrders?: Partial<UserOrdersSlice>;
            }
          | undefined;

        const persistedCartItems = (persisted?.cart?.items ?? []).map((item) => ({
          ...item,
          product: null,
        }));

        return {
          ...currentState,
          cart: {
            ...currentState.cart,
            items: persistedCartItems,
            activeOrderId: persisted?.cart?.activeOrderId ?? null,
          },
          order: {
            ...currentState.order,
            ...(persisted?.order ?? persisted?.orderFlow ?? {}),
          },
          checkout: {
            ...currentState.checkout,
            ...(persisted?.checkout ?? persisted?.checkoutFlow ?? {}),
          },
          userOrders: {
            ...currentState.userOrders,
            ...(persisted?.userOrders ?? {}),
          },
        } satisfies HnpStoreState;
      },
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return;

        const legacyCart = readLegacyPersist<{ items: PersistedCartItem[]; activeOrderId: string | null }>("hnp-cart");
        const legacyOrderFlow = readLegacyPersist<Partial<OrderSlice>>("hnp-order-flow");
        const legacyCheckoutFlow = readLegacyPersist<{ step: Step; form: FormState }>("hnp-checkout-flow");
        const legacyUserOrders = readLegacyPersist<{ ordersByUserId: Record<string, UserOrderRecord[]> }>("hnp-user-orders");
        const hasAnyLegacy = Boolean(
          legacyCart ||
            legacyOrderFlow ||
            legacyCheckoutFlow ||
            legacyUserOrders,
        );
        const isFresh =
          state.cart.items.length === 0 &&
          !state.order.order &&
          !state.order.productSlug &&
          state.checkout.step === 1 &&
          Object.keys(state.userOrders.ordersByUserId).length === 0 &&
          Object.keys(state.userOrders.checkoutsById).length === 0;

        if (hasAnyLegacy && isFresh) {
          useHnpStore.setState((current) => ({
            ...current,
            cart: {
              ...current.cart,
              items: legacyCart?.state?.items ? legacyCart.state.items.map((it) => ({ ...it, product: null })) : current.cart.items,
              activeOrderId: legacyCart?.state?.activeOrderId ?? current.cart.activeOrderId,
            },
            order: legacyOrderFlow?.state
              ? ({ ...current.order, ...(legacyOrderFlow.state as Partial<OrderSlice>) } as OrderSlice)
              : current.order,
            checkout: legacyCheckoutFlow?.state
              ? {
                  ...current.checkout,
                  step: legacyCheckoutFlow.state.step ?? 1,
                  form: legacyCheckoutFlow.state.form ?? initialFormState,
                }
              : current.checkout,
            userOrders: legacyUserOrders?.state
              ? { ...current.userOrders, ordersByUserId: legacyUserOrders.state.ordersByUserId ?? {} }
              : current.userOrders,
          }));

          try {
            localStorage.removeItem("hnp-cart");
            localStorage.removeItem("hnp-order-flow");
            localStorage.removeItem("hnp-checkout-flow");
            localStorage.removeItem("hnp-user-orders");
          } catch {
            // ignore
          }
        }

        void state.cart.hydrateProducts();
      },
    },
  ),
);
