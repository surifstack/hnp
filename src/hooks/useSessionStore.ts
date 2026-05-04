import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionState {
  userId: string | null;
  setUserId: (id: string | null) => void;
  signOut: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      userId: null,
      setUserId: (id) => set({ userId: id }),
      signOut: () => set({ userId: null }),
    }),
    { name: "hnp-session" },
  ),
);
