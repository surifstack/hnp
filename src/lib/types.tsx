import { Pagination } from "./api.types";
import { HnpUser } from "./hnp.types";

export type EmployeePayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
};





export type EmployeeResponse = {
  status: number;
  message: string;
  pagination: Pagination;
  data: HnpUser[];
};