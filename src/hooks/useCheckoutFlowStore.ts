import { create } from "zustand";
import { persist } from "zustand/middleware";
import { initialFormState, type BasicDetails, type FormState, type Step } from "@/components/cart/types";

interface CheckoutFlowState {
  step: Step;
  form: FormState;
  setStep: (step: Step) => void;
  setBasic: (basic: BasicDetails) => void;
  setAddress: (address: Record<string, string>) => void;
  setOtpVerified: (verified: boolean) => void;
  reset: () => void;
}

export const useCheckoutFlowStore = create<CheckoutFlowState>()(
  persist(
    (set) => ({
      step: 1,
      form: initialFormState,
      setStep: (step) => set({ step }),
      setBasic: (basic) =>
        set((state) => ({
          form: {
            ...state.form,
            basic,
            address:
              state.form.basic.country !== basic.country && state.form.basic.country
                ? {}
                : state.form.address,
          },
        })),
      setAddress: (address) =>
        set((state) => ({
          form: {
            ...state.form,
            address,
          },
        })),
      setOtpVerified: (verified) =>
        set((state) => ({
          form: {
            ...state.form,
            otpVerified: verified,
          },
        })),
      reset: () => set({ step: 1, form: initialFormState }),
    }),
    {
      name: "hnp-checkout-flow",
      version: 1,
    },
  ),
);
