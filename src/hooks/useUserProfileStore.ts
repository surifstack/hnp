import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserProfile = {
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
};

interface UserProfileState {
  profilesByUserId: Record<string, UserProfile>;
  upsertProfile: (userId: string, patch: Partial<Omit<UserProfile, "userId" | "createdAt">>) => void;
}

function nowIso() {
  return new Date().toISOString();
}

export function formatDisplayName(profile: UserProfile | undefined, userId: string) {
  const full = `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();
  if (full) return full;
  const short = userId.includes("@") ? userId.split("@")[0] : userId;
  return short.length > 20 ? `${short.slice(0, 20)}…` : short;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      profilesByUserId: {},
      upsertProfile: (userId, patch) =>
        set((state) => {
          const existing = state.profilesByUserId[userId];
          const createdAt = existing?.createdAt ?? nowIso();
          const next: UserProfile = {
            userId,
            createdAt,
            updatedAt: nowIso(),
            ...existing,
            ...patch,
          };
          return {
            profilesByUserId: { ...state.profilesByUserId, [userId]: next },
          };
        }),
    }),
    { name: "hnp-user-profiles", version: 1 },
  ),
);

