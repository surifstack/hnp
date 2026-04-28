import type { Order, PmsColor } from "@/lib/api.types";

function nowIso() {
  return new Date().toISOString();
}

function newClientId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function splitDraftLines(text: string, maxLines: number) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, maxLines);
}

export function createClientOrderDraft(productSlug: string): Order {
  const timestamp = nowIso();
  return {
    id: newClientId("draft"),
    productSlug,
    status: "Draft",
    createdAt: timestamp,
    updatedAt: timestamp,
    setup: {
      quantity: 40,
      colorPms: "802",
      languageCode: "en",
    },
    text: {
      titleLines: [],
      secondaryLines: [],
      labelLines: [],
    },
    approvals: {
      title: false,
      secondary: false,
      label: false,
      final: false,
      allApproved:false
    },
  };
}

export function cloneOrder(order: Order): Order {
  return {
    ...order,
    setup: { ...order.setup },
    text: {
      titleLines: [...order.text.titleLines],
      secondaryLines: [...order.text.secondaryLines],
      labelLines: [...order.text.labelLines],
    },
    approvals: { ...order.approvals },
  };
}

export function applySetupToOrder(
  order: Order,
  setup: { quantity: number; colorPms: PmsColor; languageCode: string },
) {
  return {
    ...cloneOrder(order),
    updatedAt: nowIso(),
    status: "In Progress" as const,
    setup: { ...setup },
  };
}

export function applyTextStep(
  order: Order,
  step: "title" | "secondary" | "label",
  lines: string[],
) {
  const next = cloneOrder(order);
  next.updatedAt = nowIso();
  next.status = "Awaiting Approval";

  if (step === "title") {
    next.text.titleLines = lines;
    next.approvals.title = true;
    next.approvals.secondary = false;
    next.approvals.label = false;
    next.approvals.final = false;
    next.approvals.allApproved = false;    
    return next;
  }

  if (step === "secondary") {
    next.text.secondaryLines = lines;
    next.approvals.secondary = true;
    next.approvals.label = false;
    next.approvals.allApproved = false;
    return next;
  }

  next.text.labelLines = lines;
  next.approvals.label = true;
  next.approvals.allApproved = false;
  return next;
}

export function finalizeOrderDraft(order: Order) {
  const next = cloneOrder(order);
  next.updatedAt = nowIso();
  next.status = "Proof Generated";
  next.approvals.final = true;
  next.approvals.allApproved = true;
  return next;
}
