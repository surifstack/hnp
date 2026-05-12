// hooks/useAdminEmployeeStore.ts

import { create } from "zustand";

import { apiJson } from "@/lib/api";

import type { Pagination } from "@/lib/api.types";

import type {
  EmployeePayload,
  EmployeeResponse,
} from "@/lib/types";
import { HnpUser } from "@/lib/hnp.types";

type AdminEmployeeStore = {
  employees: HnpUser[];

  loading: boolean;

  error: string;

  search: string;

  status: string;

  pagination: Pagination;

  openAdd: boolean;

  form: EmployeePayload;

  setSearch: (value: string) => void;

  setStatus: (value: string) => void;

  setOpenAdd: (value: boolean) => void;

  setForm: (
    value:
      | Partial<EmployeePayload>
      | ((prev: EmployeePayload) => EmployeePayload)
  ) => void;

  fetchEmployees: (page?: number) => Promise<void>;

  createEmployee: () => Promise<void>;

  updateEmployee: (
    id: string,
    payload: EmployeePayload
  ) => Promise<void>;

  deleteEmployee: (id: string) => Promise<void>;

  toggleStatus: (
    id: string,
    status: string
  ) => Promise<void>;
};

export const useAdminEmployeeStore =
  create<AdminEmployeeStore>((set, get) => ({
    employees: [],

    loading: true,

    error: "",

    search: "",

    status: "all",

    openAdd: false,

    pagination: {
      total: 0,
      totalPages: 0,
      currentPage: 1,
      limit: 20,
    },

    form: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      phoneCountryCode: "+1",
    },

    setSearch: (value) => {
      set({ search: value });

      get().fetchEmployees(1);
    },

    setStatus: (value) => {
      set({ status: value });

      get().fetchEmployees(1);
    },

    setOpenAdd: (value) => {
      set({ openAdd: value });
    },

    setForm: (value) => {
      if (typeof value === "function") {
        set((state) => ({
          form: value(state.form),
        }));

        return;
      }

      set((state) => ({
        form: {
          ...state.form,
          ...value,
        },
      }));
    },

    fetchEmployees: async (page = 1) => {
      try {
        set({
          loading: true,
          error: "",
        });

        const { search, status } = get();

        const query =
          new URLSearchParams({
            limit: "12",
            page: String(page),
            search,
            ...(status !== "all" && {
              status,
            }),
          });

        const response =
          await apiJson<EmployeeResponse>(
            `/admin/employees?${query}`
          );

        set({
          employees: response.data || [],
        });

        if (
          response.pagination &&
          typeof response.pagination ===
            "object"
        ) {
          set({
            pagination:
              response.pagination,
          });
        }
      } catch (err) {
        set({
          error:
            "Failed to load employees",
        });
      } finally {
        set({
          loading: false,
        });
      }
    },

    createEmployee: async () => {
      try {
        const { form } = get();

        await apiJson(
          `/admin/employees`,
          {
            method: "POST",
            body: JSON.stringify(form),
          }
        );

        set({
          openAdd: false,

          form: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            phoneCountryCode:
              "+1",
          },
        });

        await get().fetchEmployees();
      } catch (err) {
        console.log(err);
      }
    },

    updateEmployee: async (
      id,
      payload
    ) => {
      try {
        await apiJson(
          `/admin/employees/${id}`,
          {
            method: "PATCH",
            body: JSON.stringify(
              payload
            ),
          }
        );

        await get().fetchEmployees(
          get().pagination.currentPage
        );
      } catch (err) {
        console.log(err);
      }
    },

    deleteEmployee: async (id) => {
      try {
        await apiJson(
          `/admin/employees/${id}`,
          {
            method: "DELETE",
          }
        );

        await get().fetchEmployees(
          get().pagination.currentPage
        );
      } catch (err) {
        console.log(err);
      }
    },

    toggleStatus: async (
      id,
      active
    ) => {
      try {
        await apiJson(
          `/admin/employees/${id}/status`,
          {
            method: "PATCH",

            body: JSON.stringify({
              status: active,
            }),
          }
        );

        await get().fetchEmployees(
          get().pagination.currentPage
        );
      } catch (err) {
        console.log(err);
      }
    },
  }));