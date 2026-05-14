
export type PmsColor = "802" | "803" | "806";

export type QuantityConfig = {
  orderQty: number;
  maxQty: number;
  steps: number;
  labelsQty:number;
  pageInchWidth:number;
  quantities: number[];
};
export interface ProductField {
  key: string; // 👈 IMPORTANT for frontend access
  label: string;
  value: string | number | boolean | string[];
}

export type StepCardProps = {
  title: string;
  maxChars: number;
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
  name: string;
  description: string;

  processSteps: string[];

  // flexible (not locked to G/P/Y)
  skus?: Record<string, string>;
  isAvailable?:boolean;
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
  first_name: string;
  last_name: string;
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
  success: boolean;

  acceptedAt: string;

  itemCount: number;

  orderIds: string[];

  checkoutId: string;

  status: string;

  totals: MoneyTotals;

  payment: {
    sessionId: string;

    url: string | null;
  };
}

export type OverflowMap = {
  title?: boolean;
  secondary?: boolean;
  label?: boolean;
};

export interface Pagination {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    offset?: number,
       
}


export interface OrderItem {
  id: string;
  productId: string;

  product: Product;

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

  pricing: {
    subtotal: number;
    shipping: number;
    taxes: number;
    total: number;
    currency: string;
  };

  status: string;

  rejection?: {
    reason?: string;
    rejectedAt?: string;
    rejectedBy?: string;
  };

  approvals: {
    title: boolean;
    secondary: boolean;
    label: boolean;
    final: boolean;
  };

  createdAt: string;
  updatedAt: string;
}
export type Address = Record<string, string>;

export interface OrderDetail extends Order {
  _id: string;
  countryCode: string;
  customer: CheckoutCustomerInput;

  address: Address;

  items: OrderItem[];

  totals: MoneyTotals;

  cancelReason?: string;

  checkoutInfo: {
    checkoutAt: string;
    clientTimestamp: number;
    promoCodeValidated: boolean;
  };

  otpVerified: boolean;

  totalItems: number;
  itemCount?: number;
}

export type UserDetail = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  createdAt: string;
  updatedAt: string;

  orderStats?: {
    totalOrders: number;
    totalSpent: number;
    completedOrders: number;
    cancelledOrders: number;
  };

  lastOrder?: {
    _id: string;
    createdAt: string;
    total: number;
    currency: string;
  };
};
