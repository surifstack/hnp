import { create } from "zustand";
import { apiJson } from "@/lib/api";
import {Order,  Pagination} from "@/lib/api.types"
interface EmployeeOrdersState {
  orders: Order[];

  page: number;
  limit: number;

  total: number;
  totalPages: number;

  loading: boolean;
  error: string | null;

  fetchOrders: (status?: string) => Promise<void>;

  setPagination: (page: number, limit: number) => void;
}
interface EmployeeOrdersResponse{
    data :Order[],
    pagination :Pagination
}
export const useEmployeeOrdersStore =
  create<EmployeeOrdersState>((set, get) => ({
    orders: [],

    page: 1,
    limit: 10,

    total: 0,
    totalPages: 0,
    loading: false,
    error: null,

    fetchOrders: async (status?: string) => {
      try {
        set({ loading: true, error: null });

        const { page, limit } = get();

        const res = await apiJson<EmployeeOrdersResponse>(
          `/employee/orders?page=${page}&limit=${limit}${
            status ? `&status=${status}` : ""
          }`
        );

        set({
          orders: res.data ?? [],
          total: res.pagination.total,
          totalPages: res.pagination.totalPages,
          loading: false,
        });
      } catch (err: any) {
        set({
          loading: false,
          error: err?.message ?? "Failed to load orders",
        });
      }
    },

    setPagination: (page, limit) =>
      set({
        page,
        limit,
      }),
  }));