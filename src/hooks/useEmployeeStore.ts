import { create } from "zustand";
import { dummyOrders, dummyUsers } from "@/lib/hnp.dummy";
import type { HnpOrder, HnpOrderStatus, HnpUser } from "@/lib/hnp.types";

function nowIso() {
  return new Date().toISOString();
}

interface EmployeeState {
  users: HnpUser[];
  orders: HnpOrder[];

  toggleUserStatus: (id: string) => void;
  setOrderStatus: (id: string, status: HnpOrderStatus) => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  users: dummyUsers,
  orders: dummyOrders,

  toggleUserStatus: (id) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === id ? { ...u, status: u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" } : u,
      ),
    })),

  setOrderStatus: (id, status) =>
    set((s) => ({
      orders: s.orders.map((o) => (o.id === id ? { ...o, status, updatedAt: nowIso() } : o)),
    })),
}));
