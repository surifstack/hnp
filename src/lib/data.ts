import type { PmsColor, ProductField , QuantityConfig } from "@/lib/api.types";

export const COLORS: Array<{ pms: PmsColor; label: string; swatch: string }> = [
  { pms: "802", label: "PMS 802", swatch: "var(--neon-green)" },
  { pms: "803", label: "PMS 803", swatch: "var(--neon-yellow)" },
  { pms: "806", label: "PMS 806", swatch: "var(--neon-pink)" },
];

export function getSwatchByPms(pms?: PmsColor) {
  const found = COLORS.find((c) => c.pms === pms);
  return found ?? COLORS[0];
}

export function formatProductFieldValue(value: ProductField['value']) {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}

export function getFieldValue<T = ProductField['value']>(
  rows: ProductField[] | undefined,
  key: string,
  defaultValue?: T
): T | ProductField['value'] | undefined {
  const found = rows?.find((r) => r.key === key)?.value;

  return (found ?? defaultValue) as any;
}




export function buildQuantityConfig(
  specs: ProductField[] | undefined
): QuantityConfig {
  const orderQty = getFieldValue(specs, "order_qty", 40) as number;
  const maxQty = getFieldValue(specs, "max_order_qty", 400) as number;
  const labelsQty = getFieldValue(specs, "labels_per_sheet", 52) as number;

  const steps = orderQty > 0 ? Math.floor(maxQty / orderQty) : 0;

  const quantities = Array.from(
    { length: steps },
    (_, i) => (i + 1) * orderQty
  );

  return {
    orderQty,
    maxQty,
    steps,
    quantities,
    labelsQty
  };
}