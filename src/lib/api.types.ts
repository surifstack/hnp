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
  productInfo?: Array<{ label: string; value: string }>;
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

export interface CheckoutProductSnapshot {
  slug: ProductSlug;
  name: string;
  pricing: Product["pricing"];
}

export interface CheckoutItemInput {
  clientItemId: string;
  productSlug: ProductSlug;
  product: CheckoutProductSnapshot;
  quantity: number;
  colorPms: PmsColor;
  languageCode: string;
  titleLines: string[];
  secondaryLines: string[];
  labelLines: string[];
}

export interface CheckoutCustomerInput {
  name: string;
  email: string;
  phone: string;
  country: string;
}

export type CheckoutAddressInput = Record<string, string>;

export interface CheckoutRequest {
  items: CheckoutItemInput[];
  customer: CheckoutCustomerInput;
  address: CheckoutAddressInput;
  otpVerified: boolean;
  promoCode?: string;
}

export interface MoneyTotals {
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
  currency: string;
}

export interface CheckoutResponse {
  acceptedAt: string;
  itemCount: number;
  orderIds: string[];
  totals: MoneyTotals;
}
