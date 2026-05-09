import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useSessionStore } from "./useSessionStore";

export type UserProfile = {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
};

interface UserProfileState {
  profilesById: Record<string, UserProfile>;
  upsertProfile: (patch: Partial<Omit<UserProfile, "id" | "createdAt">>) => void;
}

function nowIso() {
  return new Date().toISOString();
}

export function formatDisplayName(profile: UserProfile | undefined, id: string) {
  const full = `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();
  if (full) return full;
  const short = id.includes("@") ? id.split("@")[0] : id;
  return short.length > 20 ? `${short.slice(0, 20)}…` : short;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      profilesById: {},
      upsertProfile: (patch) =>
        set((state) => {
          const id = useSessionStore.getState().user?.id;
          console.log(id , 'id')
          if (!id) return state;

          const existing = state.profilesById[id];
          const createdAt = existing?.createdAt ?? nowIso();
          const next: UserProfile = {
            ...existing,
            ...patch,
            id,
            createdAt,
            updatedAt: nowIso(),
          };
          return {
            profilesById: { ...state.profilesById, [id]: next },
          };
        }),
    }),
    { name: "hnp-user-profiles", version: 2 },
  ),
);
