export const COUNTRY_ADDRESS_FIELDS: Record<string, string[]> = {
  India: ["Address Line", "City", "State", "PIN Code"],
  "United States": ["Street", "City", "State", "ZIP Code"],
  "United Kingdom": ["Address Line", "Town/City", "Postcode"],
  Canada: ["Street", "City", "Province", "Postal Code"],
  Australia: ["Street", "Suburb", "State", "Postcode"],
  Germany: ["Street", "House Number", "Postal Code", "City"],
  France: ["Street", "Postal Code", "City"],
  Japan: ["Postal Code", "Prefecture", "City", "Building"],
  "South Korea": ["Postal Code", "Province/City", "District", "Street"],
  China: ["Province", "City", "District", "Street", "Postal Code"],
  Brazil: ["Street", "Number", "Neighborhood", "City", "State", "Postal Code"],
  UAE: ["Street", "Area", "City"],
  "Saudi Arabia": ["Building No", "Street", "District", "City", "Postal Code"],
  "South Africa": ["Street", "Suburb", "City", "Postal Code"],
};

export const COUNTRIES = Object.keys(COUNTRY_ADDRESS_FIELDS);

export type Step = 1 | 2 | 3 | 4;

export interface BasicDetails {
  name: string;
  email: string;
  phone: string;
  country: string;
}

export interface FormState {
  basic: BasicDetails;
  otpVerified: boolean;
  address: Record<string, string>;
}

export const initialFormState: FormState = {
  basic: { name: "", email: "", phone: "", country: "" },
  otpVerified: false,
  address: {},
};

export type FieldErrors = Record<string, string>;
