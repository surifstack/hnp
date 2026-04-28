import { z } from "zod";
import { AddressField , LANGUAGE_OPTIONS } from "@/config/languages";

const SUPPORTED_LANGUAGE_CODES = LANGUAGE_OPTIONS.map((l) => l.value);

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

    country: z.string().refine((v) => SUPPORTED_LANGUAGE_CODES.includes(v), {
      message: "Please select a valid language",
    }),
  })
  .refine((data) => data.email === data.confirm_email, {
    message: "Email addresses must match",
    path: ["confirm_email"], // 👈 error shown here
  });

export type BasicDetailsInput = z.infer<typeof basicDetailsSchema>;

export function buildAddressSchema(fields: AddressField[]) {
  const shape: Record<string, z.ZodString> = {};

  for (const f of fields) {
    shape[f.key] = z
      .string()
      .trim()
      .min(1, { message: `${f.label} is required` })
      .max(120, { message: `${f.label} must be less than 120 characters` });
  }

  return z.object(shape);
}

export function zodErrorsToMap(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
