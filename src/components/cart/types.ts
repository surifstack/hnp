import { LANGUAGE_OPTIONS } from "@/config/languages";





export type Step = 1 | 2 | 3 | 4;

export interface AddressField {
  label: string;
  key: string;
}

export interface BasicDetails {
  name: string;
  email: string;
  phone: string;
  country:string; // ✅ ADDED: full language option for later use

}

export const initialFormState: FormState = {
  basic: { name: "", email: "", phone: "", country: "" },
  otpVerified: false,
  address: {},
};
export interface FormState {
  basic: BasicDetails;
  otpVerified: boolean;
  address: Record<string, string>;
}

export type FieldErrors = Record<string, string>;