import { create } from "zustand";
import { dummyEmployees, dummyOrders, dummyUsers } from "@/lib/hnp.dummy";
import type { HnpEmployee, HnpOrder, HnpOrderStatus, HnpUser } from "@/lib/hnp.types";

function nowIso() {
  return new Date().toISOString();
}

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2, 10)}`;
}

interface AdminState {
  employees: HnpEmployee[];
  users: HnpUser[];
  orders: HnpOrder[];

  addEmployee: (input: { name: string; email: string; role?: HnpEmployee["role"] }) => void;
  toggleEmployeeActive: (id: string) => void;

  toggleUserStatus: (id: string) => void;

  setOrderStatus: (id: string, status: HnpOrderStatus) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  employees: dummyEmployees,
  users: dummyUsers,
  orders: dummyOrders,

  addEmployee: ({ name, email, role = "EMPLOYEE" }) => {
    const employee: HnpEmployee = {
      id: newId("emp"),
      name,
      email,
      role,
      active: true,
      createdAt: nowIso(),
    };
    set((s) => ({ employees: [employee, ...s.employees] }));
  },

  toggleEmployeeActive: (id) =>
    set((s) => ({
      employees: s.employees.map((e) => (e.id === id ? { ...e, active: !e.active } : e)),
    })),

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
