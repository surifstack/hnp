import { Pagination } from "./api.types";

export type EmployeePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
};



export type Employee = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  active: boolean;
  role: string;
  createdAt: string;
};

export type EmployeeResponse = {
  status: number;
  message: string;
  pagination: Pagination;
  data: Employee[];
};