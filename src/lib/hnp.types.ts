export type HnpOrderStatus = "NEW" | "PROCESSING" | "SHIPPED" | "CANCELLED";

export interface HnpEmployee {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  active: boolean;
  createdAt: string;
}

export interface HnpUser {
  id: string;
  name: string;
  email: string;
  status: "ACTIVE" | "BLOCKED";
  createdAt: string;
}

export interface HnpOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  totalCents: number;
  status: HnpOrderStatus;
  createdAt: string;
  updatedAt: string;
}
