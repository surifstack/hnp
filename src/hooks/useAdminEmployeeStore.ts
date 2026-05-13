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

  submitting: boolean;

  formError: string;

  error: string;

  search: string;

  status: string;


  deleteConfirmOpen: boolean,
  deleteId: string | null,

  pagination: Pagination;

  openAdd: boolean;
  openEdit: boolean;
  editingId: string | null;
  setEditingId: (id: string | null) => void;


  form: EmployeePayload;

  setSearch: (value: string) => void;

  setStatus: (value: string) => void;

  setOpenAdd: (value: boolean) => void;
  setOpenEdit: (value: boolean) => void;

  

  setFormError: (value: string) => void;

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
  setDeleteConfirmOpen: (v: boolean) => void;
  setDeleteId: (id: string) => void;
  toggleStatus: (
    id: string,
    status: string
  ) => Promise<void>;
};

export const useAdminEmployeeStore =
  create<AdminEmployeeStore>((set, get) => ({

    employees: [],

    loading: true,

    submitting: false,

    formError: "",

    error: "",

    search: "",
    deleteConfirmOpen: false,
    deleteId: "",
    status: "all",

    openAdd: false,
    openEdit: false,
    editingId: null,


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
    },
        setEditingId: (id) => set({ editingId: id }),


    setStatus: (value) => {
      set({ status: value });
    },

    setOpenAdd: (value) => {
      set({
        openAdd: value,
        formError: "",
      });
    },

    setDeleteConfirmOpen: (v) =>
      set({ deleteConfirmOpen: v }),

    setDeleteId: (id) =>
      set({ deleteId: id }),
    

     setOpenEdit: (value) => {
      set({
        openEdit: value,
        // clear form error on close/open
        formError: "",
      });
    },

    setFormError: (value) => {
      set({
        formError: value,
      });
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

        const query = new URLSearchParams({
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
          typeof response.pagination === "object"
        ) {
          set({
            pagination:
              response.pagination,
          });
        }

      } catch (err) {

        set({
          error:
            err instanceof Error
              ? err.message
              : "Failed to load employees",
        });

      } finally {

        set({
          loading: false,
        });
      }
    },

    createEmployee: async () => {

  try {

    set({
      submitting: true,
      formError: "",
    });

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
        phoneCountryCode: "+1",
      },
    });

    await get().fetchEmployees();

  } catch (err: any) {

    console.log(err);

    set({
      formError:
        err?.message ||
        err?.error ||
        err?.response?.data?.message ||
        "Something went wrong",
    });

  } finally {

    set({
      submitting: false,
    });
  }
},

    updateEmployee: async (
      id,
      payload
    ) => {

      try {

        set({
          submitting: true,
          formError: "",
        });

        await apiJson(
          `/admin/employees/${id}`,
          {
            method: "PUT",

            body: JSON.stringify(
              payload
            ),
          }
        );

        await get().fetchEmployees(
          get().pagination.currentPage
        );

      } catch (err: any) {

        set({
          formError:
            err?.message ||
            "Failed to update employee",
        });

      } finally {

        set({
          submitting: false,
        });
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