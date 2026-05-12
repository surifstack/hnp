export type HnpOrderStatus = "NEW" | "PROCESSING" | "SHIPPED" | "CANCELLED";

export interface HnpEmployee {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  active: boolean;
  createdAt: string;
}

// lib/hnp.types.ts

export type UserRole =
  | "USER"
  | "EMPLOYEE"
  | "ADMIN";

export type UserStatus =
  | "ACTIVE"
  | "BLOCKED";

export interface HnpUser {
  id: string;
  _id:string;

  email: string;

  role: UserRole;

  firstName?: string;

  lastName?: string;

  phoneCountryCode?: string;

  phoneNumber?: string;

  status: UserStatus;

  createdAt: string;

  updatedAt: string;
}

export type PublicHnpUser =
  Omit<HnpUser, "status">;

export interface HnpUserRecord
  extends HnpUser {
  passwordHash: string;
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
