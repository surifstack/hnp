import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthRole = "USER" | "EMPLOYEE" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  role: AuthRole;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
}

interface SessionState {
  user: AuthUser | null;
  role: AuthRole | null;
  status: "idle" | "loading" | "ready";
  setStatus: (status: SessionState["status"]) => void;
  setSession: (user: AuthUser | null) => void;
  signOut: () => void;
}

function stateForUser(user: AuthUser | null) {
  return {
    user,
    role: user?.role ?? null,
    status: "ready" as const,
  };
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      status: "idle",
      setStatus: (status) => set({ status }),
      setSession: (user) => set(stateForUser(user)),
      signOut: () => {
        
        set(stateForUser(null));
      },
    }),
    { name: "hnp-session" },
  ),
);
