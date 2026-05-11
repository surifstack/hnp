// stores/employee/employee-users.store.ts

import { create } from "zustand";
import type { HnpUser } from "@/lib/hnp.types";
import { apiJson } from "@/lib/api";

interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  search?: string;
}

interface UsersResponse {
  data: HnpUser[];
  pagination: PaginationMeta;
}

interface EmployeeUsersState {
  users: HnpUser[];

  page: number;
  limit: number;

  total: number;
  totalPages: number;

  hasNext: boolean;
  hasPrev: boolean;

  loading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;

  setPagination: (
    page: number,
    limit: number
  ) => void;

  toggleUserStatus: (
    id: string
  ) => void;
}

export const useEmployeeUsersStore =
  create<EmployeeUsersState>(
    (set, get) => ({
      users: [],

      page: 1,
      limit: 10,

      total: 0,
      totalPages: 0,

      hasNext: false,
      hasPrev: false,

      loading: false,
      error: null,

      fetchUsers: async () => {
        try {
          set({
            loading: true,
            error: null,
          });

          const {
            page,
            limit,
          } = get();

          const res =
            await apiJson<UsersResponse>(
              `/employee/users?page=${page}&limit=${limit}`
            );

          set({
            users:
              res.data ?? [],

            total:
              res.pagination
                .total,

            totalPages:
              res.pagination
                .totalPages,

            hasNext:
              res.pagination
                .hasNext,

            hasPrev:
              res.pagination
                .hasPrev,

            loading: false,
          });
        } catch (err: any) {
          set({
            loading: false,

            error:
              err?.message ??
              "Failed to load users",
          });
        }
      },

      setPagination: (
        page,
        limit
      ) =>
        set({
          page,
          limit,
        }),

      toggleUserStatus: (id) =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === id
              ? {
                  ...u,
                  status:
                    u.status ===
                    "ACTIVE"
                      ? "BLOCKED"
                      : "ACTIVE",
                }
              : u
          ),
        })),
    })
  );