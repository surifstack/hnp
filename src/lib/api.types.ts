
export type PmsColor = "802" | "803" | "806";

export type QuantityConfig = {
  orderQty: number;
  maxQty: number;
  steps: number;
  labelsQty:number;
  quantities: number[];
};
export interface ProductField {
  key: string; // 👈 IMPORTANT for frontend access
  label: string;
  value: string | number | boolean | string[];
}

export type StepCardProps = {
  title: string;
  name:string;
  subtitle: string;
  label: string;
  value: string;
  rows: number;
  disabled: boolean;
  approved: boolean;
  isActive: boolean;
  anchorId?: string;
  canEdit: boolean;
  onActivate: () => void;
  onChange: (next: string) => void;
  onApprove: () => void;
};

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;

  processSteps: string[];

  // flexible (not locked to G/P/Y)
  skus?: Record<string, string>;

  productInfo?: ProductField[];

  documentation?: {
    overview: string;
    specs: ProductField[];
    codes: string[];
  };

  pricing: {
    currency: 'usd';
    pricePerSetCents: number;
    shippingCents: number;
    taxRate?: number;
  };
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
  productSlug: string;
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
    allApproved:boolean;
    final: boolean;

  };
  userId?: string;
}

export interface CheckoutItemInput {
  clientItemId: string;
  productSlug: string;
  quantity: number;
  colorPms: PmsColor;
  languageCode: string;
  titleLines: string[];
  secondaryLines: string[];
  labelLines: string[];
}

// Client -> our server boundary.
// Do NOT accept pricing data from the browser; the server must look up pricing.
export interface CheckoutClientItemInput {
  clientItemId: string;
  productSlug: string;
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

export interface CheckoutClientRequest {
  userId: string;
  items: CheckoutClientItemInput[];
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
