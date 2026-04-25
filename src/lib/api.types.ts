export type ProductSlug = "mininote" | "peelnpost" | "flyer-small" | "flyer-large";

export type PmsColor = "802" | "803" | "806";

export interface Product {
  id: string;
  slug: ProductSlug;
  name: string;
  description: string;
  processSteps: string[];
  // Optional: enriched client-side catalog fields (not required from the API).
  skus?: { G: string; P: string; Y: string };
  documentation?: {
    overview: string;
    specs: Array<{ label: string; value: string }>;
    codes: string[];
  };
  pricing: {
    currency: "usd";
    pricePerSetCents: number;
    shippingCents: number;
    taxRate?: number;
  };
}

export interface Language {
  id: string;
  code: string;
  name: string;
  active: boolean;
  sortOrder: number;
}

export type OrderStatus =
  | "Draft"
  | "In Progress"
  | "Awaiting Approval"
  | "Proof Generated"
  | "Awaiting Payment"
  | "Paid"
  | "In Production"
  | "Shipped"
  | "Completed"
  | "Failed"
  | "Payment Failed";

export interface Order {
  id: string;
  productSlug: ProductSlug;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  setup: {
    quantity: number;
    colorPms: PmsColor;
    languageCode: string;
  };
  text: {
    titleLines: string[];
    secondaryLines: string[];
    labelLines: string[];
  };
  approvals: {
    title: boolean;
    secondary: boolean;
    label: boolean;
    final: boolean;
  };
  userId?: string;
}
