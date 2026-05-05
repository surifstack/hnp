import { OverflowMap } from "@/lib/api.types";
import { create } from "zustand";



export const useOverflowStore = create<{
  overflowMap: OverflowMap;
  setOverflow: (key: keyof OverflowMap, value: boolean) => void;
}>((set) => ({
  overflowMap: {},

  setOverflow: (key, value) =>
    set((state) => ({
      overflowMap: {
        ...state.overflowMap,
        [key]: value,
      },
    })),
}));