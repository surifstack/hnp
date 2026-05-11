import { z } from "zod";
import { 
  AddressField, 
  COUNTRY_OPTIONS,
  getAddressFieldsForCountry 
} from "@/config/languages";

const SUPPORTED_COUNTRY_CODES = COUNTRY_OPTIONS.map((c) => c.code);

export const basicDetailsSchema = z
  .object({
    first_name: z
      .string()
      .trim()
      .min(2, { message: "First name must be at least 2 characters" })
      .max(100, { message: "First name must be less than 100 characters" }),

    last_name: z
      .string()
      .trim()
      .min(2, { message: "Last name must be at least 2 characters" })
      .max(100, { message: "Last name must be less than 100 characters" }),

    email: z
      .string()
      .trim()
      .email({ message: "Enter a valid email address" })
      .max(255, { message: "Email must be less than 255 characters" }),

    confirm_email: z
      .string()
      .trim()
      .email({ message: "Enter a valid email address" }),

    phone: z
      .string()
      .trim()
      .regex(/^[0-9]{7,15}$/, {
        message: "Phone must be 7–15 digits, numbers only",
      }),

    country: z.string().refine((v) => SUPPORTED_COUNTRY_CODES.includes(v), {
      message: "Please select a valid country",
    }),
  })
  .refine((data) => data.email === data.confirm_email, {
    message: "Email addresses must match",
    path: ["confirm_email"],
  });

export type BasicDetailsInput = z.infer<typeof basicDetailsSchema>;

/**
 * Build a dynamic Zod schema for address fields based on country selection
 * @param countryCode - The selected country code (e.g., "US", "FR", "JP")
 * @param customFields - Optional custom address fields (overrides country lookup)
 */
export function buildAddressSchema(
  countryCode?: string, 
  customFields?: AddressField[]
): z.ZodObject<any> {
  let fields: AddressField[] = [];

  if (customFields) {
    fields = customFields;
  } else if (countryCode) {
    fields = getAddressFieldsForCountry(countryCode);
  } else {
    // Default fallback fields if no country provided
    fields = [
      { label: "Street", key: "street" },
      { label: "City", key: "city" },
      { label: "Postal Code", key: "postalCode" },
    ];
  }

  const shape: Record<string, z.ZodString> = {};

  for (const field of fields) {
    shape[field.key] = z
      .string()
      .trim()
      .min(1, { message: `${field.label} is required` })
      .max(120, { message: `${field.label} must be less than 120 characters` });
  }

  return z.object(shape);
}

/**
 * Type for the address data based on a specific country
 */
export type AddressData = Record<string, string>;

/**
 * Validate complete form data including address with country-specific fields
 */
export function validateFormWithAddress(
  basicData: BasicDetailsInput,
  addressData: Record<string, string>
): { 
  success: boolean; 
  errors?: Record<string, string>;
  data?: {
    basic: BasicDetailsInput;
    address: Record<string, string>;
  };
} {
  // First validate basic details
  const basicResult = basicDetailsSchema.safeParse(basicData);
  
  if (!basicResult.success) {
    return {
      success: false,
      errors: zodErrorsToMap(basicResult.error),
    };
  }

  // Then validate address based on selected country
  const addressSchema = buildAddressSchema(basicData.country);
  const addressResult = addressSchema.safeParse(addressData);

  if (!addressResult.success) {
    return {
      success: false,
      errors: zodErrorsToMap(addressResult.error),
    };
  }

  return {
    success: true,
    data: {
      basic: basicResult.data,
      address: addressResult.data,
    },
  };
}

/**
 * Creates a complete schema for the entire form (basic + address)
 * Useful for form libraries that need a single schema
 */
export function buildCompleteFormSchema(countryCode?: string) {
  const addressSchema = buildAddressSchema(countryCode);
  
  return z.object({
    basic: basicDetailsSchema,
    address: addressSchema,
  });
}

export function zodErrorsToMap(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    // Handle nested paths like "address.street" or "basic.email"
    const path = issue.path.join(".");
    if (path && !out[path]) out[path] = issue.message;
  }
  return out;
}

// Optional: Create a schema for partial updates (e.g., for edit forms)
export function createPartialSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  const shape = schema.shape;
  const partialShape: any = {};
  
  for (const key in shape) {
    if (shape[key] instanceof z.ZodString) {
      partialShape[key] = shape[key].optional();
    } else {
      partialShape[key] = shape[key];
    }
  }
  
  return z.object(partialShape);
}

// Helper to get default address values for a country
export function getDefaultAddressValues(countryCode?: string): Record<string, string> {
  const fields = countryCode ? getAddressFieldsForCountry(countryCode) : [];
  const defaults: Record<string, string> = {};
  
  for (const field of fields) {
    defaults[field.key] = "";
  }
  
  return defaults;
}

// Helper to validate if a specific address field exists for a country
export function isValidAddressField(countryCode: string, fieldKey: string): boolean {
  const fields = getAddressFieldsForCountry(countryCode);
  return fields.some(field => field.key === fieldKey);
}