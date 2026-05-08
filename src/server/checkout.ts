import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { API_BASE_URL } from "@/lib/api";
import type {
  CheckoutClientRequest,
  CheckoutRequest,
  CheckoutResponse,
} from "@/lib/api.types";

const slugSchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-z0-9-]+$/i);

const checkoutSchema = z
  .object({
    userId: z.string().min(1),
    items: z
      .array(
        z
          .object({
            clientItemId: z.string().min(1),
            productSlug: slugSchema,
            quantity: z
              .number()
              .int()
              .min(40)
              .max(400)
              .refine((qty) => qty % 40 === 0, "Quantity must be in steps of 40"),
            colorPms: z.enum(["802", "803", "806"]),
            languageCode: z.string().min(1).max(10),
            titleLines: z.array(z.string().trim().min(1).max(80)).max(2),
            secondaryLines: z.array(z.string().trim().min(1).max(120)).max(3),
            labelLines: z.array(z.string().trim().min(1).max(80)).max(2),
          })
          .strict(),
      )
      .min(1),
    customer: z
      .object({
        name: z.string().trim().min(1).max(100),
        email: z.string().trim().min(3).max(320),
        phone: z.string().trim().min(5).max(32),
        country: z.string().trim().min(1).max(80),
      })
      .strict(),
    address: z.record(z.string(), z.string().trim().max(200)),
    otpVerified: z.boolean(),
    promoCode: z.string().trim().min(1).max(50).optional(),
  })
  .strict();

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}

export const checkoutServerFn = createServerFn({ method: "POST" })
  .inputValidator((raw: CheckoutClientRequest) => checkoutSchema.parse(raw))
  .handler(async ({ data }) => {
    const payload: CheckoutRequest = {
      items: data.items,
      customer: data.customer,
      address: data.address,
      otpVerified: data.otpVerified,
      promoCode: data.promoCode,
    };

    const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const bodyText = await safeText(res);
      throw new Error(`API ${res.status} for /orders/checkout${bodyText ? `: ${bodyText}` : ""}`);
    }

    return (await res.json()) as CheckoutResponse;
  });
