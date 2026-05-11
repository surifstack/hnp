import type { HnpEmployee, HnpOrder, HnpUser } from "@/lib/hnp.types";

export const dummyEmployees: HnpEmployee[] = [
  {
    id: "emp_001",
    name: "Asha Patel",
    email: "asha@mininote.example",
    role: "ADMIN",
    active: true,
    createdAt: "2026-04-01T10:12:00.000Z",
  },
  {
    id: "emp_002",
    name: "Rohan Singh",
    email: "rohan@mininote.example",
    role: "EMPLOYEE",
    active: true,
    createdAt: "2026-04-12T08:44:00.000Z",
  },
  {
    id: "emp_003",
    name: "Neha Iyer",
    email: "neha@mininote.example",
    role: "EMPLOYEE",
    active: false,
    createdAt: "2026-04-18T15:30:00.000Z",
  },
];

export const dummyUsers: HnpUser[] = [
  {
    id: "usr_1001",
    name: "Jordan Lee",
    email: "jordan.lee@example.com",
    status: "ACTIVE",
    createdAt: "2026-03-28T13:20:00.000Z",
  },
  {
    id: "usr_1002",
    name: "Sam Rivera",
    email: "sam.rivera@example.com",
    status: "ACTIVE",
    createdAt: "2026-04-08T06:05:00.000Z",
  },
  {
    id: "usr_1003",
    name: "Taylor Kim",
    email: "taylor.kim@example.com",
    status: "BLOCKED",
    createdAt: "2026-04-20T19:10:00.000Z",
  },
];

export const dummyOrders: HnpOrder[] = [
  {
    id: "ord_9001",
    customerName: "Jordan Lee",
    customerEmail: "jordan.lee@example.com",
    itemsCount: 1,
    totalCents: 1800,
    status: "NEW",
    createdAt: "2026-04-27T11:02:00.000Z",
    updatedAt: "2026-04-27T11:02:00.000Z",
  },
  {
    id: "ord_9002",
    customerName: "Sam Rivera",
    customerEmail: "sam.rivera@example.com",
    itemsCount: 2,
    totalCents: 4000,
    status: "PROCESSING",
    createdAt: "2026-04-28T09:41:00.000Z",
    updatedAt: "2026-04-29T07:10:00.000Z",
  },
  {
    id: "ord_9003",
    customerName: "Taylor Kim",
    customerEmail: "taylor.kim@example.com",
    itemsCount: 1,
    totalCents: 2000,
    status: "SHIPPED",
    createdAt: "2026-04-21T15:10:00.000Z",
    updatedAt: "2026-04-22T16:55:00.000Z",
  },
];